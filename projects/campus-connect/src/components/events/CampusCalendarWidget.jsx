import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, ArrowUpRight } from 'lucide-react'
import { useEvents } from '../../context/EventContext'
import { formatDate, formatTime, toLocalDateKey, getCategoryMeta } from '../../utils/formatters'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const CampusCalendarWidget = () => {
  const { events } = useEvents()
  const today = useMemo(() => new Date(), [])
  const todayKey = toLocalDateKey(today)

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDateKey, setSelectedDateKey] = useState(() => todayKey)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const monthLabel = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Group events by local 'YYYY-MM-DD' date key
  const eventsByDate = useMemo(() => {
    const map = new Map()
    events.forEach((evt) => {
      const key = toLocalDateKey(evt.startDate)
      if (!key) return
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(evt)
    })
    return map
  }, [events])

  // Build calendar grid cells
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay()
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []

    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null)
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateObj = new Date(year, month, day)
      const dateKey = toLocalDateKey(dateObj)
      cells.push({
        day,
        dateObj,
        dateKey,
        dayEvents: eventsByDate.get(dateKey) || []
      })
    }
    return cells
  }, [year, month, eventsByDate])

  const selectedDayEvents = useMemo(() => {
    return (eventsByDate.get(selectedDateKey) || []).sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    )
  }, [eventsByDate, selectedDateKey])

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  const handleJumpToday = () => {
    const now = new Date()
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelectedDateKey(toLocalDateKey(now))
  }

  const selectedDateFormatted = useMemo(() => {
    if (!selectedDateKey) return ''
    const [y, m, d] = selectedDateKey.split('-').map(Number)
    return formatDate(new Date(y, m - 1, d), { weekday: 'long', month: 'short', day: 'numeric' })
  }, [selectedDateKey])

  return (
    <div className="card-surface p-5 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Grid Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="w-4 h-4 text-[#B69A62]" />
              <h3 className="font-serif text-xl font-normal text-[#17243A]">{monthLabel}</h3>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleJumpToday}
                className="px-3 py-1 rounded-md text-xs font-medium text-[#17243A] hover:text-[#722F43] bg-[#F8F7F3] hover:bg-white border border-[#E8E5DE] transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-md text-[#737780] hover:text-[#17243A] bg-[#F8F7F3] hover:bg-white border border-[#E8E5DE] transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-md text-[#737780] hover:text-[#17243A] bg-[#F8F7F3] hover:bg-white border border-[#E8E5DE] transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((wd) => (
              <div key={wd} className="py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#737780]">
                {wd}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell, idx) => {
              if (!cell) {
                return <div key={`empty-${idx}`} className="h-10 sm:h-11 rounded-lg" />
              }

              const isSelected = cell.dateKey === selectedDateKey
              const isToday = cell.dateKey === todayKey
              const hasEvents = cell.dayEvents.length > 0

              return (
                <button
                  key={cell.dateKey}
                  type="button"
                  onClick={() => setSelectedDateKey(cell.dateKey)}
                  aria-label={`${cell.dateKey}${hasEvents ? `, ${cell.dayEvents.length} events` : ''}`}
                  aria-pressed={isSelected}
                  className={`relative h-10 sm:h-11 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#722F43] text-white font-semibold shadow-sm'
                      : isToday
                      ? 'bg-[#EEF2F7] text-[#17243A] border border-[#17243A]/35 font-semibold'
                      : hasEvents
                      ? 'bg-[#F8F7F3] text-[#17243A] hover:bg-[#EFECE4] border border-[#E8E5DE]'
                      : 'text-[#737780] hover:bg-[#F8F7F3] hover:text-[#17243A]'
                  }`}
                >
                  <span>{cell.day}</span>
                  {hasEvents && (
                    <span className="flex items-center gap-0.5 mt-0.5">
                      {cell.dayEvents.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#722F43]'}`}
                        />
                      ))}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Date Agenda Column */}
        <div className="lg:col-span-5 bg-[#F8F7F3] rounded-xl border border-[#E8E5DE] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E5DE] pb-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#722F43]">
                Schedule for Selected Day
              </p>
              <h4 className="font-serif text-base font-normal text-[#17243A] mt-0.5">
                {selectedDateFormatted}
              </h4>
            </div>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-white text-[#17243A] border border-[#E8E5DE]">
              {selectedDayEvents.length} {selectedDayEvents.length === 1 ? 'event' : 'events'}
            </span>
          </div>

          {selectedDayEvents.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <CalendarIcon className="w-6 h-6 text-[#B69A62] mx-auto" />
              <p className="text-xs font-medium text-[#17243A]">No events scheduled on this date</p>
              <p className="text-[11px] text-[#737780] max-w-xs mx-auto">
                Select any date marked with a burgundy dot to inspect its scheduled campus activities.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {selectedDayEvents.map((evt) => {
                const categoryMeta = getCategoryMeta(evt.category)
                return (
                  <Link
                    key={evt.id}
                    to={`/events/${evt.id}`}
                    className="group block p-3.5 rounded-lg bg-white hover:bg-white border border-[#E8E5DE] hover:border-[#722F43]/40 shadow-card transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${categoryMeta.badge}`}>
                        {evt.category}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#737780] group-hover:text-[#722F43] transition-colors" />
                    </div>
                    <p className="font-serif text-[15px] font-normal text-[#17243A] group-hover:text-[#722F43] transition-colors line-clamp-1">
                      {evt.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#737780]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#B69A62]" />
                        {formatTime(evt.startDate)}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-[#737780] shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

