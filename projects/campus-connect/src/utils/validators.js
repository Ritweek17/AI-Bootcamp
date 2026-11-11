// Shared validation utilities for CampusConnect forms & service layer

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export const isValidHttpUrl = (value) => {
  if (!value || typeof value !== 'string') return false
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const validateEventPayload = (formData, { isEditing = false, existingRegisteredCount = 0 } = {}) => {
  const errors = {}

  if (!formData.title || !formData.title.trim()) {
    errors.title = 'Event title is required.'
  } else if (formData.title.trim().length < 4) {
    errors.title = 'Event title must be at least 4 characters.'
  }

  if (!formData.organizer || !formData.organizer.trim()) {
    errors.organizer = 'Organizer name is required.'
  }

  if (formData.organizerContact && formData.organizerContact.trim() && !isValidEmail(formData.organizerContact)) {
    errors.organizerContact = 'Please enter a valid contact email address.'
  }

  if (!formData.venue || !formData.venue.trim()) {
    errors.venue = 'Venue or online session link is required.'
  }

  if (!formData.startDate) {
    errors.startDate = 'Start date and time are required.'
  }

  if (!formData.endDate) {
    errors.endDate = 'End date and time are required.'
  }

  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    if (Number.isNaN(start.getTime())) {
      errors.startDate = 'Invalid start date format.'
    }
    if (Number.isNaN(end.getTime())) {
      errors.endDate = 'Invalid end date format.'
    }
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end <= start) {
      errors.endDate = 'End date and time must be after the start date and time.'
    }
  }

  if (formData.startDate && formData.registrationDeadline) {
    const start = new Date(formData.startDate)
    const deadline = new Date(formData.registrationDeadline)
    if (Number.isNaN(deadline.getTime())) {
      errors.registrationDeadline = 'Invalid deadline format.'
    } else if (!Number.isNaN(start.getTime()) && deadline > start) {
      errors.registrationDeadline = 'Registration deadline cannot be after the event start time.'
    }
  }

  const capNum = Number(formData.capacity)
  if (!Number.isFinite(capNum) || capNum < 1 || !Number.isInteger(capNum)) {
    errors.capacity = 'Capacity must be a whole number of at least 1.'
  } else if (isEditing && capNum < existingRegisteredCount) {
    errors.capacity = `Capacity cannot be lower than current registrations (${existingRegisteredCount}).`
  }

  if (formData.bannerUrl && formData.bannerUrl.trim() && !isValidHttpUrl(formData.bannerUrl)) {
    errors.bannerUrl = 'Please enter a valid http:// or https:// image URL.'
  }

  if (!formData.description || !formData.description.trim()) {
    errors.description = 'Event description is required.'
  } else if (formData.description.trim().length < 15) {
    errors.description = 'Please provide a more detailed description (at least 15 characters).'
  }

  return errors
}

