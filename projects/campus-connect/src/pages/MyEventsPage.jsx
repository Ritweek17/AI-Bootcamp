import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Ticket,
  Heart,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  ExternalLink,
  GraduationCap,
  Mail,
  ArrowRight,
  History,
  Info,
  CheckCircle2,
  User
} from 'lucide-react'
import {
  formatDate,
  formatTime,
  getCategoryMeta,
  getGoogleCalendarUrl,
  isPastEvent
} from '../utils/formatters'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import { useUser } from '../context/UserContext'
import { EventCard } from '../components/events/EventCard'
import { RegistrationModal } from '../components/events/RegistrationModal'
import { ConfirmModal } from '../components/common/ConfirmModal'

export const MyEventsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' | 'past' | 'saved'
  const [avatarError, setAvatarError] = useState(false)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [registeringEvent, setRegisteringEvent] = useState(null)

  const { currentUser } = useAuth()
  const { events, cancelRegistration } = useEvents()
  const { bookmarks, registrations, refreshUserData } = useUser()

  // Enrich registrations with live event details and split upcoming vs past
  const { upcomingRegistrations, pastRegistrations } = useMemo(() => {
    const upcoming = []
    const past = []

    registrations.forEach((reg) => {
      const liveEvent = events.find((e) => e.id === reg.eventId)
      if (!liveEvent) return

      const item = { reg, event: liveEvent }
      if (isPastEvent(liveEvent)) {
        past.push(item)
      } else {
        upcoming.push(item)
      }
    })

    upcoming.sort((a, b) => new Date(a.event.startDate) - new Date(b.event.startDate))
    past.sort((a, b) => new Date(b.event.startDate) - new Date(a.event.startDate))

    return { upcomingRegistrations: upcoming, pastRegistrations: past }
  }, [registrations, events])

  const bookmarkedEvents = useMemo(
    () => events.filter((e) => bookmarks.includes(e.id)),
    [events, bookmarks]
  )

  const pastArchiveEvents = useMemo(
    () =>
      events
        .filter((e) => isPastEvent(e))
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate)),
    [events]
  )

  const handleConfirmCancel = () => {
    if (!cancelTarget) return
    cancelRegistration(
      cancelTarget.eventId,
      cancelTarget.studentEmail || currentUser?.email,
      cancelTarget.registrationId
    )
    refreshUserData()
    setCancelTarget(null)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Student Profile Header Card */}
      <div className="bg-white rounded-2xl border border-[#E8E5DE] p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center md:items-start gap-6">
        {avatarError || !currentUser?.avatar ? (
          <div className="w-16 h-16 rounded-full bg-[#F8F7F3] border border-[#B69A62]/45 flex items-center justify-center text-[#17243A] text-lg font-bold shrink-0">
            <User className="w-7 h-7" />
          </div>
        ) : (
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            onError={() => setAvatarError(true)}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-[#B69A62]/45 shrink-0"
          />
        )}

        <div className="space-y-1.5 text-center md:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#17243A]">
              {currentUser.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F8F7F3] border border-[#E8E5DE] text-[#17243A]">
              <GraduationCap className="w-3.5 h-3.5 text-[#B69A62]" />
              {currentUser.studentId}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-[#FAF4F6] text-[#722F43] border border-[#E4C5CE]">
              Demo Profile
            </span>
          </div>
          <p className="text-xs text-[#737780] flex items-center justify-center md:justify-start gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#B69A62]" />
            {currentUser.email}
          </p>
          <p className="text-xs text-[#737780]">
            <strong className="text-[#17243A] font-medium">{currentUser.major}</strong> •{' '}
            {currentUser.year}
          </p>
        </div>

        {/* Live Student Counters */}
        <div className="grid grid-cols-3 gap-6 border-t md:border-t-0 md:border-l border-[#E8E5DE] pt-5 md:pt-0 md:pl-8 w-full md:w-auto text-center md:text-left shrink-0">
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-normal text-[#722F43]">
              {upcomingRegistrations.length}
            </p>
            <p className="text-[11px] font-medium text-[#737780] uppercase tracking-wider">
              Upcoming
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-normal text-[#17243A]">
              {pastRegistrations.length}
            </p>
            <p className="text-[11px] font-medium text-[#737780] uppercase tracking-wider">
              Past
            </p>
          </div>
          <div>
            <p className="font-serif text-2xl sm:text-3xl font-normal text-[#17243A]">
              {bookmarkedEvents.length}
            </p>
            <p className="text-[11px] font-medium text-[#737780] uppercase tracking-wider">
              Saved
            </p>
          </div>
        </div>
      </div>

      {/* Honest Demo Storage Notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E8E5DE] shadow-card text-xs text-[#737780]">
        <Info className="w-4 h-4 text-[#B69A62] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#17243A]">Local Demo Hub:</strong> Your simulated registration
          passes and bookmarked events are persisted in your browser&apos;s{' '}
          <code className="text-[#722F43] bg-[#FAF4F6] px-1.5 py-0.5 rounded font-mono text-[11px]">
            localStorage
          </code>
          .
        </p>
      </div>

      {/* Navigation Tabs */}
      <div
        className="flex items-center gap-6 border-b border-[#E8E5DE] overflow-x-auto"
        role="tablist"
        aria-label="My events sections"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'upcoming'}
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3.5 text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-colors relative ${
            activeTab === 'upcoming'
              ? 'text-[#17243A] font-semibold'
              : 'text-[#737780] hover:text-[#17243A]'
          }`}
        >
          <Ticket className="w-4 h-4 text-[#17243A]" />
          Upcoming Registrations ({upcomingRegistrations.length})
          {activeTab === 'upcoming' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#722F43] rounded-full" />
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'past'}
          onClick={() => setActiveTab('past')}
          className={`pb-3.5 text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-colors relative ${
            activeTab === 'past'
              ? 'text-[#17243A] font-semibold'
              : 'text-[#737780] hover:text-[#17243A]'
          }`}
        >
          <History className="w-4 h-4 text-[#737780]" />
          Past Events ({pastRegistrations.length})
          {activeTab === 'past' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#722F43] rounded-full" />
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'saved'}
          onClick={() => setActiveTab('saved')}
          className={`pb-3.5 text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-colors relative ${
            activeTab === 'saved'
              ? 'text-[#17243A] font-semibold'
              : 'text-[#737780] hover:text-[#17243A]'
          }`}
        >
          <Heart className="w-4 h-4 text-[#722F43]" />
          Saved Events ({bookmarkedEvents.length})
          {activeTab === 'saved' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#722F43] rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: UPCOMING REGISTRATIONS */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingRegistrations.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#E8E5DE] shadow-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#F8F7F3] border border-[#E8E5DE] text-[#B69A62] flex items-center justify-center mx-auto">
                <Ticket className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h2 className="font-serif text-xl font-normal text-[#17243A]">
                  No Upcoming Registrations Yet
                </h2>
                <p className="text-xs text-[#737780] leading-relaxed">
                  Browse upcoming hackathons, workshops, cultural nights, and sports games to claim
                  your seat.
                </p>
              </div>
              <Link to="/" className="btn-primary text-xs">
                Discover Campus Events
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingRegistrations.map(({ reg, event }) => {
                const catMeta = getCategoryMeta(event.category)
                return (
                  <div
                    key={reg.registrationId}
                    className="bg-white border border-[#E8E5DE] rounded-xl overflow-hidden shadow-card flex flex-col"
                  >
                    {/* Pass Header */}
                    <div className="bg-[#17243A] px-5 py-3.5 border-b border-[#B69A62]/30 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${catMeta.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${catMeta.dot}`} />
                          {event.category}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#EEF3EF] text-[#52745C] border border-[#C5DBC9]">
                          <CheckCircle2 className="w-3 h-3" />
                          {reg.status || 'Confirmed (Demo)'}
                        </span>
                      </div>

                      <span className="font-mono text-xs text-[#17243A] bg-white px-2.5 py-0.5 rounded border border-[#E8E5DE]">
                        {reg.registrationId}
                      </span>
                    </div>

                    {/* Pass Body */}
                    <div className="p-5 space-y-4 flex-1">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#722F43] mb-1">
                          Simulated Demo Pass
                        </p>
                        <Link
                          to={`/events/${event.id}`}
                          className="font-serif text-xl font-normal text-[#17243A] hover:text-[#722F43] transition-colors line-clamp-2"
                        >
                          {event.title}
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F8F7F3] p-3.5 rounded-lg border border-[#E8E5DE]">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#737780]">
                            Student Name
                          </p>
                          <p className="text-[#17243A] font-medium mt-0.5 truncate">
                            {reg.studentName}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#737780]">
                            Campus Email
                          </p>
                          <p className="text-[#737780] mt-0.5 truncate">{reg.studentEmail}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#737780]">
                          <Calendar className="w-3.5 h-3.5 text-[#B69A62] shrink-0" />
                          <span>{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#737780]">
                          <Clock className="w-3.5 h-3.5 text-[#B69A62] shrink-0" />
                          <span>{formatTime(event.startDate)}</span>
                        </div>
                        <div className="sm:col-span-2 flex items-start gap-1.5 text-[#737780]">
                          <MapPin className="w-3.5 h-3.5 text-[#B69A62] shrink-0 mt-0.5" />
                          <span>{event.venue}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#737780]">
                        Demo ticket stored locally in browser storage (not an encrypted check-in QR
                        credential).
                      </p>
                    </div>

                    {/* Pass Actions */}
                    <div className="px-5 py-3.5 bg-[#F8F7F3]/75 border-t border-[#E8E5DE] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/events/${event.id}`}
                          className="btn-secondary py-1.5 px-3 text-xs"
                        >
                          View Details
                        </Link>
                        <a
                          href={getGoogleCalendarUrl(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost py-1.5 px-2.5 text-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#17243A]" />
                          Calendar
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCancelTarget({
                            eventId: event.id,
                            eventTitle: event.title,
                            studentEmail: reg.studentEmail,
                            registrationId: reg.registrationId
                          })
                        }
                        className="btn-danger py-1.5 px-3 text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAST EVENTS */}
      {activeTab === 'past' && (
        <div className="space-y-8">
          {pastRegistrations.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-[#E8E5DE] shadow-card p-8 space-y-3">
              <div className="w-11 h-11 rounded-xl bg-[#F8F7F3] border border-[#E8E5DE] text-[#737780] flex items-center justify-center mx-auto">
                <History className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-xl font-normal text-[#17243A]">
                No Past Registered Events
              </h2>
              <p className="text-xs text-[#737780] max-w-md mx-auto leading-relaxed">
                Events you registered for will automatically move here once their end date passes.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pastRegistrations.map(({ reg, event }) => {
                const catMeta = getCategoryMeta(event.category)
                return (
                  <div
                    key={reg.registrationId}
                    className="bg-white border border-[#E8E5DE] rounded-xl p-5 shadow-card space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${catMeta.badge}`}
                      >
                        {event.category}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F3F1EA] text-[#737780] border border-[#E8E5DE]">
                        Completed
                      </span>
                    </div>

                    <div>
                      <Link
                        to={`/events/${event.id}`}
                        className="font-serif text-lg font-normal text-[#17243A] hover:text-[#722F43] transition-colors"
                      >
                        {event.title}
                      </Link>
                      <p className="text-xs text-[#737780] mt-1">
                        {formatDate(event.startDate)} • {event.venue}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E8E5DE] flex items-center justify-between text-xs text-[#737780]">
                      <span className="font-mono text-[11px] text-[#17243A]">{reg.registrationId}</span>
                      <Link
                        to={`/events/${event.id}`}
                        className="text-[#722F43] hover:underline font-medium"
                      >
                        Event Summary
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Recent Campus Archive */}
          {pastArchiveEvents.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#E8E5DE]">
              <div>
                <h3 className="font-serif text-xl font-normal text-[#17243A]">
                  Concluded Campus Events Archive
                </h3>
                <p className="text-xs text-[#737780] mt-0.5">
                  Recent campus sessions that have wrapped up.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastArchiveEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAVED / BOOKMARKED EVENTS */}
      {activeTab === 'saved' && (
        <div>
          {bookmarkedEvents.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#E8E5DE] shadow-card p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF4F6] border border-[#E4C5CE] text-[#722F43] flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h2 className="font-serif text-xl font-normal text-[#17243A]">
                  No Saved Events Yet
                </h2>
                <p className="text-xs text-[#737780] leading-relaxed">
                  Click the bookmark heart icon on any event card to keep track of events you plan
                  to attend later.
                </p>
              </div>
              <Link to="/" className="btn-primary text-xs">
                Explore Events
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onQuickRegister={(evt) => setRegisteringEvent(evt)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <RegistrationModal
        event={registeringEvent}
        isOpen={Boolean(registeringEvent)}
        onClose={() => setRegisteringEvent(null)}
      />

      <ConfirmModal
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Event Registration"
        message={
          cancelTarget
            ? `Release your reserved seat for "${cancelTarget.eventTitle}"?`
            : ''
        }
        confirmLabel="Cancel Pass"
        cancelLabel="Keep Pass"
        variant="danger"
      />
    </div>
  )
}
