import React, { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle2,
  Mail,
  Tag,
  AlertCircle,
  Building2,
  Hourglass,
  ExternalLink,
  Ticket,
  Globe,
  XCircle
} from 'lucide-react'
import {
  formatDate,
  formatTime,
  getCategoryMeta,
  getDaysRemainingText,
  getEventRegistrationState,
  getGoogleCalendarUrl,
  isPastEvent
} from '../utils/formatters'
import { useEvents } from '../context/EventContext'
import { useUser } from '../context/UserContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { EventCard } from '../components/events/EventCard'
import { RegistrationModal } from '../components/events/RegistrationModal'
import { ConfirmModal } from '../components/common/ConfirmModal'

const FALLBACK_BANNER =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'

export const EventDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { events, cancelRegistration } = useEvents()
  const { currentUser } = useAuth()
  const { isBookmarked, toggleBookmark, isRegistered, getRegistrationForEvent, refreshUserData } =
    useUser()
  const { showToast } = useToast()

  const [modalEvent, setModalEvent] = useState(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [imgError, setImgError] = useState(false)

  const event = useMemo(() => events.find((e) => e.id === id), [events, id])

  useEffect(() => {
    setImgError(false)
  }, [event?.id, event?.bannerUrl])

  // Related events: prioritize upcoming events in the same category, then other upcoming events
  const relatedEvents = useMemo(() => {
    if (!event) return []
    const candidates = events.filter((e) => e.id !== event.id && !isPastEvent(e))
    const sameCategory = candidates.filter(
      (e) => e.category?.toLowerCase() === event.category?.toLowerCase()
    )
    const others = candidates.filter(
      (e) => e.category?.toLowerCase() !== event.category?.toLowerCase()
    )
    return [...sameCategory, ...others].slice(0, 3)
  }, [events, event])

  if (!event) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white border border-[#E8E5DE] rounded-2xl p-8 text-center shadow-card space-y-5">
          <div className="w-12 h-12 rounded-xl bg-[#FBF2F2] text-[#A34C4C] border border-[#E5C5C5] flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl font-normal text-[#17243A]">Event Not Found</h1>
            <p className="text-xs text-[#737780] leading-relaxed">
              This campus event does not exist or may have been removed from the catalog.
            </p>
          </div>
          <Link to="/" className="btn-primary text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Event Catalog
          </Link>
        </div>
      </div>
    )
  }

  const bookmarked = isBookmarked(event.id)
  const registered = isRegistered(event.id)
  const registrationRecord = getRegistrationForEvent(event.id)
  const categoryMeta = getCategoryMeta(event.category)
  const daysMeta = getDaysRemainingText(event.startDate, event.endDate)
  const regState = getEventRegistrationState(event)

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: event.shortDescription || `Check out ${event.title} on CampusConnect`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        if (err?.name === 'AbortError') return
      }
    }

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href)
        showToast('Event link copied to clipboard.', 'success')
        return
      } catch {
        // Fallback below
      }
    }

    showToast('Copy this page URL from your browser address bar to share.', 'info')
  }

  const handleConfirmCancel = () => {
    cancelRegistration(
      event.id,
      registrationRecord?.studentEmail || currentUser?.email,
      registrationRecord?.registrationId
    )
    refreshUserData()
    setIsCancelModalOpen(false)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={handleBack} className="btn-secondary py-2 px-3.5 text-xs">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Catalog
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleBookmark(event.id, event.title)}
            aria-pressed={bookmarked}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 shadow-card ${
              bookmarked
                ? 'bg-[#FAF4F6] text-[#722F43] border-[#E4C5CE]'
                : 'bg-white text-[#25282D] border-[#E8E5DE] hover:border-[#17243A]/30 hover:text-[#17243A]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${bookmarked ? 'fill-[#722F43] text-[#722F43]' : ''}`} />
            {bookmarked ? 'Saved' : 'Save Event'}
          </button>

          <button type="button" onClick={handleShare} className="btn-secondary py-2 px-3.5 text-xs">
            <Share2 className="w-3.5 h-3.5 text-[#17243A]" />
            Share
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Banner Card */}
          <div className="bg-white border border-[#E8E5DE] rounded-2xl overflow-hidden shadow-card">
            <div className="relative h-64 sm:h-80 w-full bg-[#F2EFE9]">
              <img
                src={imgError ? FALLBACK_BANNER : event.bannerUrl || FALLBACK_BANNER}
                alt={event.title}
                onError={() => {
                  if (!imgError) setImgError(true)
                }}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#17243A]/80 via-[#17243A]/20 to-transparent"
                aria-hidden="true"
              />

              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shadow-sm ${categoryMeta.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${categoryMeta.dot}`} />
                  {event.category}
                </span>

                {daysMeta && (
                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium shadow-sm ${daysMeta.color}`}>
                    {daysMeta.text}
                  </span>
                )}

                {event.isOnline && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-[#17243A]/90 text-[#F8F7F3] border border-[#B69A62]/40 backdrop-blur-sm">
                    <Globe className="w-3 h-3 text-[#B69A62]" />
                    Online Event
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="space-y-3">
                <h1 className="font-serif text-3xl sm:text-[38px] font-normal text-[#17243A] tracking-tight leading-[1.15]">
                  {event.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#737780]">
                  <span className="inline-flex items-center gap-1.5 text-[#17243A] font-medium">
                    <Building2 className="w-4 h-4 text-[#B69A62]" />
                    {event.organizer}
                  </span>

                  {event.organizerContact && event.organizerContact.trim() && (
                    <a
                      href={`mailto:${event.organizerContact.trim()}`}
                      className="inline-flex items-center gap-1.5 text-[#722F43] hover:underline"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {event.organizerContact.trim()}
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-5 border-t border-[#E8E5DE] space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[#722F43]">
                  About This Event
                </h2>
                <p className="text-sm sm:text-[15px] text-[#25282D] leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {Array.isArray(event.tags) && event.tags.length > 0 && (
                <div className="pt-4 border-t border-[#E8E5DE] flex flex-wrap items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#737780] mr-1" />
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F8F7F3] border border-[#E8E5DE] text-[#25282D]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Logistics & Action Sidebar */}
        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
          <div className="bg-white border border-[#E8E5DE] rounded-2xl p-6 shadow-card space-y-5">
            {/* Fee & Availability Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E5DE]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737780]">
                  Admission
                </p>
                <p className="font-serif text-2xl font-normal text-[#17243A] mt-0.5">
                  {event.fee || 'Free'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#737780]">
                  Availability
                </p>
                <p
                  className={`text-sm font-semibold mt-0.5 ${
                    regState.isPast || regState.isDeadlinePassed || regState.isFull
                      ? 'text-[#A34C4C]'
                      : regState.spotsLeft <= 10
                      ? 'text-[#B58A46]'
                      : 'text-[#52745C]'
                  }`}
                >
                  {regState.isPast
                    ? 'Ended'
                    : regState.isDeadlinePassed
                    ? 'Closed'
                    : regState.isFull
                    ? 'Full'
                    : `${regState.spotsLeft} seats open`}
                </p>
              </div>
            </div>

            {/* Schedule & Venue Details */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#B69A62] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#17243A]">Date</p>
                  <p className="text-[#737780] mt-0.5">{formatDate(event.startDate)}</p>
                  {event.endDate &&
                    formatDate(event.endDate) !== formatDate(event.startDate) && (
                      <p className="text-[#737780] text-[11px]">
                        Ends {formatDate(event.endDate)}
                      </p>
                    )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#B69A62] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#17243A]">Time</p>
                  <p className="text-[#737780] mt-0.5">
                    {formatTime(event.startDate)}
                    {event.endDate ? ` – ${formatTime(event.endDate)}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#B69A62] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#17243A]">Location</p>
                  <p className="text-[#737780] mt-0.5">{event.venue}</p>
                </div>
              </div>

              {event.registrationDeadline && (
                <div className="flex items-start gap-3">
                  <Hourglass className="w-4 h-4 text-[#B69A62] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#17243A]">Registration Cutoff</p>
                    <p
                      className={`mt-0.5 ${
                        regState.isDeadlinePassed ? 'text-[#A34C4C] font-medium' : 'text-[#737780]'
                      }`}
                    >
                      {formatDate(event.registrationDeadline)} at{' '}
                      {formatTime(event.registrationDeadline)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Capacity Progress Bar */}
            <div className="p-3.5 rounded-xl bg-[#F8F7F3] border border-[#E8E5DE] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 text-[#737780]">
                  <Users className="w-3.5 h-3.5 text-[#17243A]" />
                  Capacity Filled
                </span>
                <span className="font-semibold text-[#17243A]">
                  {regState.registeredCount} / {regState.capacity}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-[#E8E5DE]">
                <div
                  className={`h-full transition-all ${
                    regState.isFull
                      ? 'bg-[#A34C4C]'
                      : regState.percentFilled >= 85
                      ? 'bg-[#B58A46]'
                      : 'bg-[#17243A]'
                  }`}
                  style={{ width: `${regState.percentFilled}%` }}
                />
              </div>
            </div>

            {/* Registration Status & CTA */}
            {registered ? (
              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[#EEF3EF] border border-[#C5DBC9] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52745C]">
                      <CheckCircle2 className="w-4 h-4" />
                      Registered
                    </span>
                    {registrationRecord?.registrationId && (
                      <span className="text-[11px] font-mono text-[#17243A] bg-white border border-[#C5DBC9] px-2 py-0.5 rounded">
                        {registrationRecord.registrationId}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#52745C]">
                    Your pass is saved in My Events.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  <Link to="/my-events" className="btn-primary w-full text-xs">
                    <Ticket className="w-4 h-4" />
                    View Demo Pass
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="btn-danger w-full text-xs"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Registration
                  </button>
                </div>
              </div>
            ) : regState.isOpen ? (
              <button
                type="button"
                onClick={() => setModalEvent(event)}
                className="btn-primary w-full py-3 text-sm"
              >
                <Ticket className="w-4 h-4" />
                Register for Event
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#F8F7F3] border border-[#E8E5DE] text-center space-y-1">
                <p className="text-xs font-semibold text-[#17243A]">
                  {regState.isPast
                    ? 'Event Completed'
                    : regState.isDeadlinePassed
                    ? 'Registration Closed'
                    : 'All Seats Claimed'}
                </p>
                <p className="text-[11px] text-[#737780]">
                  {regState.isPast
                    ? 'This event has already taken place.'
                    : regState.isDeadlinePassed
                    ? 'The registration deadline has passed.'
                    : 'Registration is closed because seating is full.'}
                </p>
              </div>
            )}

            {/* Calendar Export */}
            <a
              href={getGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#17243A]" />
              Add to Google Calendar
            </a>
          </div>
        </aside>
      </div>

      {/* Related Upcoming Events */}
      {relatedEvents.length > 0 && (
        <section className="pt-6 border-t border-[#E8E5DE] space-y-5" aria-labelledby="related-heading">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#722F43]">
                Keep Exploring
              </p>
              <h2
                id="related-heading"
                className="font-serif text-2xl font-normal text-[#17243A] mt-0.5"
              >
                Related Campus Events
              </h2>
            </div>
            <Link
              to={`/?category=${encodeURIComponent(event.category)}`}
              className="text-xs font-medium text-[#17243A] hover:text-[#722F43] transition-colors"
            >
              More in {event.category}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedEvents.map((relEvent) => (
              <EventCard
                key={relEvent.id}
                event={relEvent}
                onQuickRegister={(evt) => setModalEvent(evt)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <RegistrationModal
        event={modalEvent}
        isOpen={Boolean(modalEvent)}
        onClose={() => setModalEvent(null)}
      />

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Event Registration"
        message={`Release your reserved seat for "${event.title}"? You can re-register later while seats remain open.`}
        confirmLabel="Yes, Cancel Registration"
        cancelLabel="Keep My Seat"
        variant="danger"
      />
    </div>
  )
}
