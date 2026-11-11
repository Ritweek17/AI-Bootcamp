import React from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  CheckCircle2,
  ArrowRight,
  Building2
} from 'lucide-react'
import {
  formatDate,
  formatTime,
  getCategoryMeta,
  getDaysRemainingText,
  getEventRegistrationState
} from '../../utils/formatters'
import { useUser } from '../../context/UserContext'

const FALLBACK_BANNER =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'

export const EventCard = ({ event, onQuickRegister }) => {
  const { isBookmarked, toggleBookmark, isRegistered } = useUser()

  const bookmarked = isBookmarked(event.id)
  const registered = isRegistered(event.id)

  const categoryMeta = getCategoryMeta(event.category)
  const daysMeta = getDaysRemainingText(event.startDate, event.endDate)
  const regState = getEventRegistrationState(event)

  const handleBookmarkClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleBookmark(event.id, event.title)
  }

  const handleRegisterClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onQuickRegister && !registered && regState.isOpen) {
      onQuickRegister(event)
    }
  }

  const handleImageError = (e) => {
    if (e.currentTarget.src !== FALLBACK_BANNER) {
      e.currentTarget.src = FALLBACK_BANNER
    }
  }

  return (
    <article className="group bg-white rounded-xl border border-[#E8E5DE] shadow-card hover:shadow-card-hover hover:border-[#17243A]/25 hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden h-full">
      {/* Cover Image */}
      <Link to={`/events/${event.id}`} className="relative aspect-[16/9] w-full overflow-hidden bg-[#F2EFE9] block">
        <img
          src={event.bannerUrl || FALLBACK_BANNER}
          alt={event.title}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#17243A]/75 via-[#17243A]/10 to-[#17243A]/25 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shadow-sm ${categoryMeta.badge}`}>
            {event.category || 'General'}
          </span>

          <button
            onClick={handleBookmarkClick}
            type="button"
            className={`p-2 rounded-lg transition-colors border shadow-sm ${
              bookmarked
                ? 'bg-[#722F43] text-white border-[#722F43]'
                : 'bg-white/95 text-[#17243A] hover:text-[#722F43] hover:bg-white border-[#E8E5DE]'
            }`}
            aria-label={bookmarked ? `Remove ${event.title} from bookmarks` : `Bookmark ${event.title}`}
            aria-pressed={bookmarked}
            title={bookmarked ? 'Remove bookmark' : 'Save bookmark'}
          >
            <Heart className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Metadata Pills */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          {daysMeta && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium shadow-sm ${daysMeta.color}`}>
              {daysMeta.text}
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#17243A]/90 text-[#F8F7F3] border border-[#B69A62]/40 backdrop-blur-sm ml-auto">
            {event.fee || 'Free'}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2.5">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs text-[#737780]">
            <span className="flex items-center gap-1.5 text-[#17243A] font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#722F43] shrink-0" />
              {formatDate(event.startDate, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="text-[#D5D0C5]">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#737780] shrink-0" />
              {formatTime(event.startDate)}
            </span>
          </div>

          {/* Event Title */}
          <Link to={`/events/${event.id}`} className="block">
            <h3 className="font-serif text-[19px] font-normal text-[#17243A] leading-snug line-clamp-2 min-h-[2.85rem] group-hover:text-[#722F43] transition-colors">
              {event.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-[#737780] line-clamp-2 min-h-[2.25rem] leading-relaxed">
            {event.shortDescription || event.description}
          </p>

          {/* Venue & Organizer */}
          <div className="space-y-1.5 pt-1 text-xs text-[#737780]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#737780] shrink-0" />
              <span className="truncate">{event.venue || 'Campus Venue'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#737780] shrink-0" />
              <span className="truncate text-[#737780]">{event.organizer || 'Campus Organization'}</span>
            </div>
          </div>
        </div>

        {/* Availability + Actions */}
        <div className="space-y-3 pt-3 border-t border-[#E8E5DE]">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-medium">
              <span className="flex items-center gap-1.5 text-[#737780]">
                <Users className="w-3.5 h-3.5 text-[#737780]" />
                {regState.registeredCount} / {regState.capacity} registered
              </span>
              <span
                className={
                  regState.isPast
                    ? 'text-[#737780]'
                    : regState.isFull
                    ? 'text-[#A34C4C]'
                    : regState.isDeadlinePassed
                    ? 'text-[#B58A46]'
                    : regState.spotsLeft <= 10
                    ? 'text-[#B58A46]'
                    : 'text-[#52745C]'
                }
              >
                {regState.isPast
                  ? 'Event Ended'
                  : regState.isFull
                  ? 'Full'
                  : regState.isDeadlinePassed
                  ? 'Deadline Passed'
                  : `${regState.spotsLeft} spots left`}
              </span>
            </div>

            <div className="w-full bg-[#F2EFE9] border border-[#E8E5DE] rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  regState.isFull
                    ? 'bg-[#A34C4C]'
                    : regState.percentFilled >= 80
                    ? 'bg-[#B58A46]'
                    : 'bg-[#17243A]'
                }`}
                style={{ width: `${regState.percentFilled}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/events/${event.id}`}
              className="flex-1 py-2 px-3 text-center text-xs font-medium rounded-lg text-[#17243A] bg-white hover:bg-[#F8F7F3] border border-[#E8E5DE] hover:border-[#17243A]/30 transition-colors"
            >
              View Details
            </Link>

            {registered ? (
              <Link
                to={`/events/${event.id}`}
                className="flex-1 py-2 px-3 text-center text-xs font-semibold rounded-lg text-[#52745C] bg-[#EEF3EF] border border-[#C5DBC9] flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Registered
              </Link>
            ) : !regState.isOpen ? (
              <button
                type="button"
                disabled
                className="flex-1 py-2 px-3 text-center text-xs font-medium rounded-lg text-[#737780] bg-[#F8F7F3] border border-[#E8E5DE] cursor-not-allowed"
              >
                {regState.isPast ? 'Ended' : regState.isFull ? 'Sold Out' : 'Closed'}
              </button>
            ) : (
              <button
                onClick={handleRegisterClick}
                type="button"
                className="flex-1 py-2 px-3 text-center text-xs font-semibold rounded-lg text-white bg-[#17243A] hover:bg-[#1F314F] transition-colors flex items-center justify-center gap-1.5"
              >
                Register
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
