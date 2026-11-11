// Storage Abstraction Layer for CampusConnect
// Isolates browser LocalStorage behind a repository interface so UI components
// can later migrate to a MERN (MongoDB / Express / Node) REST API without rewriting UI state.

import { INITIAL_EVENTS } from './seedData'

export const STORAGE_KEYS = {
  EVENTS: 'campus_connect_events',
  BOOKMARKS: 'campus_connect_bookmarks',
  REGISTRATIONS: 'campus_connect_registrations',
  ACTIVE_ROLE: 'campus_connect_role'
}

export const SYNC_EVENT_NAME = 'campusconnect:storage-sync'

const notifySync = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT_NAME))
  }
}

const safeGet = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    const parsed = JSON.parse(raw)
    return parsed
  } catch (err) {
    console.error(`Error parsing ${key} from localStorage:`, err)
    return fallback
  }
}

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    notifySync()
    return true
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err)
    throw new Error('Unable to save changes to browser storage.')
  }
}

const normalizeEvent = (evt) => {
  const capacity = Math.max(1, Number(evt.capacity) || 1)
  const registeredCount = Math.max(0, Number(evt.registeredCount) || 0)
  return {
    ...evt,
    id: evt.id || `evt-${Date.now()}`,
    title: String(evt.title || 'Untitled Event'),
    category: evt.category || 'Technology',
    organizer: evt.organizer || 'Campus Organization',
    venue: evt.venue || 'Campus Venue',
    capacity,
    registeredCount: Math.min(capacity, registeredCount),
    attendees: Array.isArray(evt.attendees) ? evt.attendees : [],
    tags: Array.isArray(evt.tags) ? evt.tags : [],
    fee: evt.fee || 'Free'
  }
}

const generateTicketCode = () => {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
  const timePart = String(Date.now()).slice(-4)
  return `CC-${timePart}-${randomPart}`
}

export const storageService = {
  // --- EVENTS REPOSITORY ---

  getEvents: () => {
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS)
    if (raw === null) {
      safeSet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS)
      return INITIAL_EVENTS
    }
    const parsed = safeGet(STORAGE_KEYS.EVENTS, null)
    if (!Array.isArray(parsed)) {
      safeSet(STORAGE_KEYS.EVENTS, INITIAL_EVENTS)
      return INITIAL_EVENTS
    }
    return parsed.map(normalizeEvent)
  },

  getEventById: (id) => {
    const events = storageService.getEvents()
    return events.find((e) => e.id === id) || null
  },

  createEvent: (eventData) => {
    const events = storageService.getEvents()
    const newEvent = normalizeEvent({
      ...eventData,
      id: eventData.id || `evt-${Date.now()}`,
      registeredCount: Number(eventData.registeredCount) || 0,
      capacity: Number(eventData.capacity) || 100,
      attendees: Array.isArray(eventData.attendees) ? eventData.attendees : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    const updated = [newEvent, ...events]
    safeSet(STORAGE_KEYS.EVENTS, updated)
    return newEvent
  },

  updateEvent: (id, updatedFields) => {
    const events = storageService.getEvents()
    let updatedEvent = null

    const updated = events.map((item) => {
      if (item.id === id) {
        updatedEvent = normalizeEvent({
          ...item,
          ...updatedFields,
          capacity: Number(updatedFields.capacity ?? item.capacity),
          registeredCount: Number(updatedFields.registeredCount ?? item.registeredCount),
          updatedAt: new Date().toISOString()
        })
        return updatedEvent
      }
      return item
    })

    if (!updatedEvent) {
      throw new Error('Event could not be found for update.')
    }

    safeSet(STORAGE_KEYS.EVENTS, updated)
    return updatedEvent
  },

  deleteEvent: (id) => {
    const events = storageService.getEvents()
    const filtered = events.filter((e) => e.id !== id)
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filtered))

    // Clean up associated bookmarks
    const bookmarks = storageService.getBookmarks()
    const filteredBookmarks = bookmarks.filter((bId) => bId !== id)
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(filteredBookmarks))

    // Clean up associated registrations
    const registrations = storageService.getUserRegistrations()
    const filteredRegs = registrations.filter((r) => r.eventId !== id)
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(filteredRegs))

    notifySync()
    return true
  },

  // --- REGISTRATIONS REPOSITORY ---

  getUserRegistrations: () => {
    const regs = safeGet(STORAGE_KEYS.REGISTRATIONS, [])
    return Array.isArray(regs) ? regs : []
  },

  registerForEvent: (eventId, studentDetails) => {
    const events = storageService.getEvents()
    const eventIndex = events.findIndex((e) => e.id === eventId)

    if (eventIndex === -1) {
      throw new Error('Event not found.')
    }

    const event = events[eventIndex]
    const now = new Date()

    // Check if event has already concluded
    const endDate = new Date(event.endDate || event.startDate)
    if (!Number.isNaN(endDate.getTime()) && endDate < now) {
      throw new Error('This event has already ended. Registration is closed.')
    }

    // Check registration deadline
    if (event.registrationDeadline) {
      const deadline = new Date(event.registrationDeadline)
      if (!Number.isNaN(deadline.getTime()) && deadline < now) {
        throw new Error('The registration deadline for this event has passed.')
      }
    }

    // Capacity Check
    if (event.registeredCount >= event.capacity) {
      throw new Error('This event has reached full capacity. Registration is closed.')
    }

    const normalizedEmail = (studentDetails.email || '').trim().toLowerCase()
    const normalizedStudentId = (studentDetails.studentId || '').trim().toLowerCase()

    // Duplicate Check against event attendees AND user registrations
    const currentAttendees = event.attendees || []
    const userRegs = storageService.getUserRegistrations()

    const duplicateInAttendees = currentAttendees.some(
      (a) =>
        (normalizedEmail && a.email?.toLowerCase() === normalizedEmail) ||
        (normalizedStudentId && normalizedStudentId !== 'stu-guest' && a.studentId?.toLowerCase() === normalizedStudentId)
    )

    const duplicateInUserRegs = userRegs.some(
      (r) =>
        r.eventId === eventId &&
        normalizedEmail &&
        r.studentEmail?.toLowerCase() === normalizedEmail
    )

    if (duplicateInAttendees || duplicateInUserRegs) {
      throw new Error('You are already registered for this event.')
    }

    const ticketId = generateTicketCode()
    const registeredAt = new Date().toISOString()

    const newAttendee = {
      id: `att-${Date.now()}`,
      ticketId,
      name: studentDetails.name.trim(),
      email: normalizedEmail,
      studentId: studentDetails.studentId?.trim() || 'N/A',
      department: studentDetails.department?.trim() || '',
      dietary: studentDetails.dietary || 'None',
      registeredAt
    }

    const updatedAttendees = [newAttendee, ...currentAttendees]
    const updatedEvent = normalizeEvent({
      ...event,
      attendees: updatedAttendees,
      registeredCount: Number(event.registeredCount || 0) + 1,
      updatedAt: registeredAt
    })

    events[eventIndex] = updatedEvent
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events))

    const userRegistrationEntry = {
      registrationId: ticketId,
      eventId: event.id,
      eventTitle: event.title,
      eventStartDate: event.startDate,
      eventEndDate: event.endDate,
      eventVenue: event.venue,
      eventCategory: event.category,
      registeredAt,
      status: 'Confirmed (Demo)',
      studentName: newAttendee.name,
      studentEmail: normalizedEmail,
      studentId: newAttendee.studentId
    }

    localStorage.setItem(
      STORAGE_KEYS.REGISTRATIONS,
      JSON.stringify([userRegistrationEntry, ...userRegs])
    )

    notifySync()
    return { event: updatedEvent, registration: userRegistrationEntry }
  },

  cancelRegistration: (eventId, studentEmail = null, registrationId = null) => {
    const events = storageService.getEvents()
    const eventIndex = events.findIndex((e) => e.id === eventId)
    const userRegs = storageService.getUserRegistrations()

    const targetEmail = studentEmail ? studentEmail.trim().toLowerCase() : null

    const matchingReg = userRegs.find(
      (r) =>
        r.eventId === eventId &&
        ((registrationId && r.registrationId === registrationId) ||
          (targetEmail && r.studentEmail?.toLowerCase() === targetEmail) ||
          (!registrationId && !targetEmail))
    )

    const updatedRegs = userRegs.filter((r) => {
      if (r.eventId !== eventId) return true
      if (registrationId && r.registrationId === registrationId) return false
      if (targetEmail && r.studentEmail?.toLowerCase() === targetEmail) return false
      return Boolean(registrationId || targetEmail)
    })

    if (eventIndex !== -1) {
      const event = events[eventIndex]
      const emailToRemove = targetEmail || matchingReg?.studentEmail?.toLowerCase()
      const currentAttendees = event.attendees || []
      const updatedAttendees = emailToRemove
        ? currentAttendees.filter((a) => a.email?.toLowerCase() !== emailToRemove)
        : currentAttendees

      const hadRegistration = Boolean(matchingReg) || updatedAttendees.length < currentAttendees.length

      events[eventIndex] = normalizeEvent({
        ...event,
        attendees: updatedAttendees,
        registeredCount: hadRegistration
          ? Math.max(0, Number(event.registeredCount || 0) - 1)
          : event.registeredCount,
        updatedAt: new Date().toISOString()
      })
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events))
    }

    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(updatedRegs))
    notifySync()
    return true
  },

  // --- BOOKMARKS REPOSITORY ---

  getBookmarks: () => {
    const b = safeGet(STORAGE_KEYS.BOOKMARKS, [])
    return Array.isArray(b) ? b : []
  },

  toggleBookmark: (eventId) => {
    const bookmarks = storageService.getBookmarks()
    const exists = bookmarks.includes(eventId)
    const updated = exists
      ? bookmarks.filter((id) => id !== eventId)
      : [eventId, ...bookmarks]

    safeSet(STORAGE_KEYS.BOOKMARKS, updated)
    return { isBookmarked: !exists, bookmarks: updated }
  },

  isBookmarked: (eventId) => {
    const bookmarks = storageService.getBookmarks()
    return bookmarks.includes(eventId)
  },

  // --- RESET UTILITY ---
  resetToDefaults: () => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS))
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]))
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]))
    notifySync()
    return INITIAL_EVENTS
  }
}
