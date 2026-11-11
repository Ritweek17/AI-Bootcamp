import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Ticket,
  AlertCircle,
  User,
  Mail,
  GraduationCap,
  Building2,
  ExternalLink
} from 'lucide-react'
import {
  formatDate,
  formatTime,
  getEventRegistrationState,
  getGoogleCalendarUrl
} from '../../utils/formatters'
import { isValidEmail } from '../../utils/validators'
import { useAuth } from '../../context/AuthContext'
import { useEvents } from '../../context/EventContext'
import { useUser } from '../../context/UserContext'

export const RegistrationModal = ({ event, isOpen, onClose }) => {
  const { currentUser } = useAuth()
  const { registerForEvent } = useEvents()
  const { refreshUserData, isRegistered } = useUser()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [studentId, setStudentId] = useState('')
  const [department, setDepartment] = useState('')
  const [dietary, setDietary] = useState('None')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successRegistration, setSuccessRegistration] = useState(null)

  useEffect(() => {
    if (event && isOpen) {
      setFullName(currentUser?.name || '')
      setEmail(currentUser?.email || '')
      setStudentId(currentUser?.studentId || '')
      setDepartment(currentUser?.major || '')
      setDietary('None')
      setError(null)
      setSuccessRegistration(null)
    }
  }, [event, isOpen, currentUser])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !event) return null

  const regState = getEventRegistrationState(event)
  const alreadyRegistered = isRegistered(event.id)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)

    if (!regState.isOpen) {
      setError(
        regState.isPast
          ? 'This event has already ended.'
          : regState.isDeadlinePassed
          ? 'The registration deadline for this event has passed.'
          : 'This event has reached full capacity.'
      )
      return
    }

    if (!fullName.trim() || !email.trim()) {
      setError('Full name and campus email are required.')
      return
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    try {
      const studentDetails = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        studentId: studentId.trim() || 'STU-DEMO',
        department: department.trim(),
        dietary
      }

      const res = registerForEvent(event.id, studentDetails)
      refreshUserData()
      setSuccessRegistration(res.registration)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#17243A]/55 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-modal-title"
    >
      <div
        className="relative bg-white w-full max-w-lg rounded-xl shadow-modal border border-[#E8E5DE] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#17243A] p-6 border-b border-[#B69A62]/30 relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-5 right-5 p-1.5 rounded-lg text-[#E8E5DE] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close registration modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-[#B69A62] text-[11px] font-semibold uppercase tracking-widest mb-1.5">
            <Ticket className="w-3.5 h-3.5" />
            Event Registration (Demo Mode)
          </div>
          <h2
            id="reg-modal-title"
            className="font-serif text-xl sm:text-2xl font-normal leading-snug pr-8 text-white"
          >
            {event.title}
          </h2>

          <div className="mt-3 flex flex-wrap gap-y-1.5 gap-x-4 text-xs text-[#E8E5DE]/90">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B69A62]" />
              {formatDate(event.startDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#B69A62]" />
              {formatTime(event.startDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#B69A62]" />
              {event.venue}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {successRegistration ? (
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 bg-[#EEF3EF] text-[#52745C] rounded-full flex items-center justify-center mx-auto border border-[#C5DBC9]">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-normal text-[#17243A]">
                  Registration Confirmed
                </h3>
                <p className="text-xs text-[#737780]">
                  Saved locally in your browser. View or manage your pass anytime under My Events.
                </p>
              </div>

              {/* Simulated Demo Pass */}
              <div className="p-4 bg-[#F8F7F3] rounded-xl border border-[#E8E5DE] text-left space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E5DE] pb-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#722F43]">
                    Simulated Demo Pass
                  </span>
                  <span className="text-xs font-mono text-[#17243A] bg-white px-2.5 py-0.5 rounded border border-[#E8E5DE]">
                    {successRegistration.registrationId}
                  </span>
                </div>
                <div className="text-xs space-y-1.5 text-[#737780]">
                  <p>
                    Attendee:{' '}
                    <strong className="text-[#17243A]">{successRegistration.studentName}</strong>
                  </p>
                  <p>
                    Email:{' '}
                    <span className="text-[#17243A]">{successRegistration.studentEmail}</span>
                  </p>
                  <p>
                    Event:{' '}
                    <span className="text-[#17243A] font-medium">{event.title}</span>
                  </p>
                  <p>
                    Venue:{' '}
                    <span className="text-[#17243A]">{event.venue}</span>
                  </p>
                  <p>
                    Status:{' '}
                    <span className="inline-flex items-center gap-1 text-[#52745C] font-semibold">
                      Confirmed (Demo)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href={getGoogleCalendarUrl(event)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary flex-1 text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#17243A]" />
                  Add to Google Calendar
                </a>
                <Link
                  to="/my-events"
                  onClick={onClose}
                  className="btn-primary flex-1 text-xs"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  Go to My Events
                </Link>
              </div>
            </div>
          ) : !regState.isOpen && !alreadyRegistered ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FBF2F2] text-[#A34C4C] border border-[#E5C5C5] flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-serif text-lg font-normal text-[#17243A]">
                  {regState.isPast
                    ? 'Event Completed'
                    : regState.isDeadlinePassed
                    ? 'Registration Closed'
                    : 'Event at Full Capacity'}
                </h3>
                <p className="text-xs text-[#737780] max-w-xs mx-auto leading-relaxed">
                  {regState.isPast
                    ? 'This scheduled campus event has already concluded.'
                    : regState.isDeadlinePassed
                    ? 'The registration cutoff date for this event has passed.'
                    : 'All available seats have been claimed. Bookmark the event or check back if spots reopen.'}
                </p>
              </div>
              <button type="button" onClick={onClose} className="btn-secondary text-xs">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Availability Banner */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#F8F7F3] rounded-lg border border-[#E8E5DE] text-xs">
                <span className="text-[#737780]">
                  Remaining Seats:{' '}
                  <strong className={regState.spotsLeft <= 10 ? 'text-[#B58A46]' : 'text-[#17243A]'}>
                    {regState.spotsLeft}
                  </strong>{' '}
                  / {regState.capacity}
                </span>
                <span className="font-semibold text-[#722F43]">
                  {event.fee || 'Free'} Admission
                </span>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FBF2F2] border border-[#E5C5C5] text-xs text-[#A34C4C]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#A34C4C]" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-3.5">
                <div>
                  <label htmlFor="reg-full-name" className="block text-xs font-medium text-[#25282D] mb-1.5">
                    Full Name <span className="text-[#A34C4C]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#737780] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reg-full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Johnson"
                      className="input-field pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-xs font-medium text-[#25282D] mb-1.5">
                    Campus Email <span className="text-[#A34C4C]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#737780] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex.j@campus.edu"
                      className="input-field pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-student-id" className="block text-xs font-medium text-[#25282D] mb-1.5">
                      Student ID
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-[#737780] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-student-id"
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="STU-2024-8891"
                        className="input-field pl-9"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reg-department" className="block text-xs font-medium text-[#25282D] mb-1.5">
                      Department / Major
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-[#737780] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        id="reg-department"
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Computer Science"
                        className="input-field pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-dietary" className="block text-xs font-medium text-[#25282D] mb-1.5">
                    Accessibility / Dietary Notes
                  </label>
                  <select
                    id="reg-dietary"
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    className="input-field cursor-pointer"
                  >
                    <option value="None">None / Standard</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Accessibility Accommodation">Accessibility Accommodation</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E5DE] flex items-center justify-end gap-2.5">
                <button type="button" onClick={onClose} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || alreadyRegistered}
                  className="btn-primary text-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {alreadyRegistered
                    ? 'Already Registered'
                    : isSubmitting
                    ? 'Submitting...'
                    : 'Confirm Registration'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
