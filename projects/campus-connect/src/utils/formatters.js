// Date, time, status, and UI utility formatters

export const formatDate = (
  dateString,
  options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('en-US', options)
  } catch {
    return ''
  }
}

export const formatTime = (timeString) => {
  if (!timeString) return ''
  if (timeString.includes('T') || timeString.includes('-')) {
    try {
      const date = new Date(timeString)
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
      }
    } catch {
      // fallback below
    }
  }
  const parts = timeString.split(':')
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10)
    const minutes = parts[1]
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12
    return `${formattedHours}:${minutes} ${ampm}`
  }
  return timeString
}

/**
 * Returns local calendar date key 'YYYY-MM-DD' to prevent UTC timezone shifts in calendar matching.
 */
export const toLocalDateKey = (dateInput) => {
  if (!dateInput) return ''
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const isPastEvent = (event) => {
  if (!event) return false
  const compareDate = event.endDate || event.startDate
  if (!compareDate) return false
  const target = new Date(compareDate)
  return !Number.isNaN(target.getTime()) && target < new Date()
}

export const isDeadlinePassed = (event) => {
  if (!event || !event.registrationDeadline) return false
  const deadline = new Date(event.registrationDeadline)
  return !Number.isNaN(deadline.getTime()) && deadline < new Date()
}

export const getEventRegistrationState = (event) => {
  const capacity = Math.max(1, Number(event?.capacity) || 1)
  const registeredCount = Math.max(0, Number(event?.registeredCount) || 0)
  const spotsLeft = Math.max(0, capacity - registeredCount)
  const past = isPastEvent(event)
  const deadlinePassed = isDeadlinePassed(event)
  const full = spotsLeft === 0
  const percentFilled = Math.min(100, Math.round((registeredCount / capacity) * 100))

  return {
    capacity,
    registeredCount,
    spotsLeft,
    percentFilled,
    isPast: past,
    isDeadlinePassed: deadlinePassed,
    isFull: full,
    isOpen: !past && !deadlinePassed && !full
  }
}

export const getCategoryMeta = (category) => {
  const cat = (category || 'Other').toLowerCase()
  switch (cat) {
    case 'technology':
    case 'tech':
      return {
        badge: 'bg-[#EEF2F7] text-[#17243A] border border-[#D4DCE8]',
        dot: 'bg-[#17243A]'
      }
    case 'hackathon':
      return {
        badge: 'bg-[#FAF4F6] text-[#722F43] border border-[#EBCDD6]',
        dot: 'bg-[#722F43]'
      }
    case 'cultural':
    case 'arts':
      return {
        badge: 'bg-[#F9F5EB] text-[#7D6332] border border-[#E6DAC0]',
        dot: 'bg-[#B69A62]'
      }
    case 'sports':
    case 'athletics':
      return {
        badge: 'bg-[#EEF3EF] text-[#52745C] border border-[#D2E0D5]',
        dot: 'bg-[#52745C]'
      }
    case 'workshop':
    case 'bootcamp':
      return {
        badge: 'bg-[#FCF7ED] text-[#8E692A] border border-[#EADBC0]',
        dot: 'bg-[#B58A46]'
      }
    case 'career':
    case 'seminar':
      return {
        badge: 'bg-[#F0F3F7] text-[#3B4C66] border border-[#DCE2EC]',
        dot: 'bg-[#3B4C66]'
      }
    default:
      return {
        badge: 'bg-[#F8F7F3] text-[#737780] border border-[#E8E5DE]',
        dot: 'bg-[#737780]'
      }
  }
}

export const getDaysRemainingText = (dateString, endDateString = null) => {
  if (!dateString) return null
  const eventDate = new Date(dateString)
  if (Number.isNaN(eventDate.getTime())) return null

  const now = new Date()
  if (endDateString) {
    const endDate = new Date(endDateString)
    if (!Number.isNaN(endDate.getTime()) && endDate < now) {
      return {
        text: 'Completed',
        status: 'past',
        color: 'text-[#737780] bg-[#F8F7F3]/95 border border-[#E8E5DE]'
      }
    }
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate())
  const diffTime = target - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return {
      text: 'Completed',
      status: 'past',
      color: 'text-[#737780] bg-[#F8F7F3]/95 border border-[#E8E5DE]'
    }
  }
  if (diffDays === 0) {
    return {
      text: 'Today',
      status: 'today',
      color: 'text-[#722F43] bg-[#FAF4F6]/95 border border-[#EBCDD6]'
    }
  }
  if (diffDays === 1) {
    return {
      text: 'Tomorrow',
      status: 'tomorrow',
      color: 'text-[#8E692A] bg-[#FCF7ED]/95 border border-[#EADBC0]'
    }
  }
  if (diffDays <= 7) {
    return {
      text: `In ${diffDays} days`,
      status: 'soon',
      color: 'text-[#17243A] bg-white/95 border border-[#E8E5DE]'
    }
  }
  return {
    text: `In ${diffDays} days`,
    status: 'upcoming',
    color: 'text-[#25282D] bg-white/95 border border-[#E8E5DE]'
  }
}

export const getGoogleCalendarUrl = (event) => {
  if (!event?.startDate) return '#'
  const formatCalDate = (dStr) => {
    try {
      const d = new Date(dStr)
      if (Number.isNaN(d.getTime())) return ''
      return d.toISOString().replace(/-|:|\.\d\d\d/g, '')
    } catch {
      return ''
    }
  }
  const start = formatCalDate(event.startDate)
  const end = formatCalDate(event.endDate || event.startDate)
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title || '')}&dates=${start}/${end}&location=${encodeURIComponent(event.venue || '')}&details=${encodeURIComponent(event.shortDescription || '')}`
}

export const truncateText = (text, maxLength = 120) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}
