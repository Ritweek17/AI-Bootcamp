import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { storageService, STORAGE_KEYS, SYNC_EVENT_NAME } from '../services/storageService'
import { CATEGORIES } from '../services/seedData'
import { useToast } from './ToastContext'

const EventContext = createContext(null)

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const [searchTerm, setSearchTermState] = useState(() => searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategoryState] = useState(() => {
    const paramCat = searchParams.get('category')
    if (paramCat && CATEGORIES.some((c) => c.toLowerCase() === paramCat.toLowerCase())) {
      return CATEGORIES.find((c) => c.toLowerCase() === paramCat.toLowerCase())
    }
    return 'All'
  })
  const [sortBy, setSortBy] = useState('date-asc')
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(true)
  const [loading, setLoading] = useState(true)

  const { showToast } = useToast()

  const refreshEvents = useCallback(() => {
    try {
      const data = storageService.getEvents()
      setEvents(data)
    } catch (err) {
      console.error('Failed to load events:', err)
      showToast('Could not load events from local storage.', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    refreshEvents()
  }, [refreshEvents])

  // Keep in sync across components & browser tabs
  useEffect(() => {
    const handleSync = () => {
      setEvents(storageService.getEvents())
    }
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.EVENTS) {
        setEvents(storageService.getEvents())
      }
    }
    window.addEventListener(SYNC_EVENT_NAME, handleSync)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleSync)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  // Sync URL query params when navigating to Home with ?category= or ?search=
  useEffect(() => {
    if (location.pathname !== '/') return
    const paramCat = searchParams.get('category')
    const paramSearch = searchParams.get('search')

    if (paramCat) {
      const matched = CATEGORIES.find((c) => c.toLowerCase() === paramCat.toLowerCase())
      if (matched && matched !== selectedCategory) {
        setSelectedCategoryState(matched)
      }
    }
    if (paramSearch !== null && paramSearch !== searchTerm) {
      setSearchTermState(paramSearch)
    }
  }, [location.pathname, searchParams])

  const setSearchTerm = useCallback(
    (value) => {
      setSearchTermState(value)
      if (location.pathname === '/') {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev)
            if (value.trim()) {
              next.set('search', value)
            } else {
              next.delete('search')
            }
            return next
          },
          { replace: true }
        )
      }
    },
    [location.pathname, setSearchParams]
  )

  const setSelectedCategory = useCallback(
    (category) => {
      setSelectedCategoryState(category)
      if (location.pathname === '/') {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev)
            if (category && category !== 'All') {
              next.set('category', category)
            } else {
              next.delete('category')
            }
            return next
          },
          { replace: true }
        )
      }
    },
    [location.pathname, setSearchParams]
  )

  const clearFilters = useCallback(() => {
    setSearchTermState('')
    setSelectedCategoryState('All')
    setShowUpcomingOnly(true)
    setSortBy('date-asc')
    if (location.pathname === '/') {
      setSearchParams({}, { replace: true })
    }
  }, [location.pathname, setSearchParams])

  // Admin Actions
  const createEvent = useCallback(
    (eventPayload) => {
      try {
        const created = storageService.createEvent(eventPayload)
        setEvents(storageService.getEvents())
        showToast(`Event "${created.title}" published.`, 'success')
        return created
      } catch (err) {
        showToast(err.message || 'Failed to create event.', 'error')
        throw err
      }
    },
    [showToast]
  )

  const updateEvent = useCallback(
    (id, updatedFields) => {
      try {
        const updated = storageService.updateEvent(id, updatedFields)
        setEvents(storageService.getEvents())
        showToast(`Updated "${updated.title}".`, 'success')
        return updated
      } catch (err) {
        showToast(err.message || 'Failed to update event.', 'error')
        throw err
      }
    },
    [showToast]
  )

  const deleteEvent = useCallback(
    (id) => {
      try {
        const target = events.find((e) => e.id === id)
        storageService.deleteEvent(id)
        setEvents(storageService.getEvents())
        showToast(`Deleted "${target?.title || 'event'}" and cleaned up related data.`, 'info')
        return true
      } catch (err) {
        showToast(err.message || 'Failed to delete event.', 'error')
        throw err
      }
    },
    [events, showToast]
  )

  // Registration Actions
  const registerForEvent = useCallback(
    (eventId, studentDetails) => {
      try {
        const result = storageService.registerForEvent(eventId, studentDetails)
        setEvents(storageService.getEvents())
        showToast(`Confirmed registration for ${result.event.title}.`, 'success')
        return result
      } catch (err) {
        showToast(err.message || 'Registration failed.', 'error')
        throw err
      }
    },
    [showToast]
  )

  const cancelRegistration = useCallback(
    (eventId, studentEmail = null, registrationId = null) => {
      try {
        storageService.cancelRegistration(eventId, studentEmail, registrationId)
        setEvents(storageService.getEvents())
        showToast('Registration cancelled.', 'info')
      } catch (err) {
        showToast(err.message || 'Failed to cancel registration.', 'error')
      }
    },
    [showToast]
  )

  const resetAllData = useCallback(() => {
    const fresh = storageService.resetToDefaults()
    setEvents(fresh)
    setSearchTermState('')
    setSelectedCategoryState('All')
    setShowUpcomingOnly(true)
    setSortBy('date-asc')
    if (location.pathname === '/') {
      setSearchParams({}, { replace: true })
    }
    showToast('Demo events, bookmarks, and registrations restored to defaults.', 'info')
  }, [location.pathname, setSearchParams, showToast])

  // Filtered and Sorted Events across title, description, organizer, venue, category, tags
  const filteredEvents = useMemo(() => {
    const now = new Date()

    return events
      .filter((event) => {
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase().trim()
          const titleMatch = event.title?.toLowerCase().includes(query)
          const descMatch = event.description?.toLowerCase().includes(query)
          const shortDescMatch = event.shortDescription?.toLowerCase().includes(query)
          const orgMatch = event.organizer?.toLowerCase().includes(query)
          const venueMatch = event.venue?.toLowerCase().includes(query)
          const categoryMatch = event.category?.toLowerCase().includes(query)
          const tagMatch = event.tags?.some((t) => t.toLowerCase().includes(query))

          if (
            !titleMatch &&
            !descMatch &&
            !shortDescMatch &&
            !orgMatch &&
            !venueMatch &&
            !categoryMatch &&
            !tagMatch
          ) {
            return false
          }
        }

        if (selectedCategory !== 'All') {
          if (event.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false
          }
        }

        if (showUpcomingOnly) {
          const eventEnd = new Date(event.endDate || event.startDate)
          if (!Number.isNaN(eventEnd.getTime()) && eventEnd < now) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'date-asc') {
          return new Date(a.startDate) - new Date(b.startDate)
        }
        if (sortBy === 'date-desc') {
          return new Date(b.startDate) - new Date(a.startDate)
        }
        if (sortBy === 'popularity') {
          return (b.registeredCount || 0) - (a.registeredCount || 0)
        }
        if (sortBy === 'spots-left') {
          const spotsA = Math.max(0, (a.capacity || 0) - (a.registeredCount || 0))
          const spotsB = Math.max(0, (b.capacity || 0) - (b.registeredCount || 0))
          return spotsA - spotsB
        }
        return 0
      })
  }, [events, searchTerm, selectedCategory, showUpcomingOnly, sortBy])

  return (
    <EventContext.Provider
      value={{
        events,
        filteredEvents,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        showUpcomingOnly,
        setShowUpcomingOnly,
        loading,
        clearFilters,
        refreshEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        cancelRegistration,
        resetAllData
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider')
  }
  return context
}
