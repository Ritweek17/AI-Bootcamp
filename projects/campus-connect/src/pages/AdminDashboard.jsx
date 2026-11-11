import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield,
  ShieldAlert,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Calendar,
  TrendingUp,
  Eye,
  ArrowUpDown,
  ChevronDown,
  Info,
  Compass
} from 'lucide-react'
import {
  formatDate,
  formatTime,
  getCategoryMeta,
  getEventRegistrationState,
  isPastEvent
} from '../utils/formatters'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventContext'
import { CATEGORIES } from '../services/seedData'
import { EventFormModal } from '../components/admin/EventFormModal'
import { AttendeeListModal } from '../components/admin/AttendeeListModal'
import { DeleteConfirmModal } from '../components/admin/DeleteConfirmModal'

const FALLBACK_THUMB =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=60'

export const AdminDashboard = () => {
  const { isAdmin, setExplicitRole } = useAuth()
  const { events, deleteEvent } = useEvents()

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sortBy, setSortBy] = useState('date-asc')

  // Modal state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState(null)
  const [rosterEvent, setRosterEvent] = useState(null)
  const [eventToDelete, setEventToDelete] = useState(null)

  // Live Metrics
  const metrics = useMemo(() => {
    const totalEvents = events.length
    const upcomingEventsCount = events.filter((e) => !isPastEvent(e)).length
    const totalRegistrations = events.reduce(
      (sum, e) => sum + (Number(e.registeredCount) || 0),
      0
    )
    const totalCapacity = events.reduce((sum, e) => sum + (Number(e.capacity) || 0), 0)
    const overallFillRate =
      totalCapacity > 0 ? Math.min(100, Math.round((totalRegistrations / totalCapacity) * 100)) : 0

    return {
      totalEvents,
      upcomingEventsCount,
      totalRegistrations,
      totalCapacity,
      overallFillRate
    }
  }, [events])

  // Filtered & Sorted Table Rows
  const tableEvents = useMemo(() => {
    return events
      .filter((e) => {
        if (categoryFilter !== 'All' && e.category?.toLowerCase() !== categoryFilter.toLowerCase()) {
          return false
        }
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim()
          return (
            e.title?.toLowerCase().includes(q) ||
            e.organizer?.toLowerCase().includes(q) ||
            e.venue?.toLowerCase().includes(q) ||
            e.category?.toLowerCase().includes(q)
          )
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'date-asc') return new Date(a.startDate) - new Date(b.startDate)
        if (sortBy === 'date-desc') return new Date(b.startDate) - new Date(a.startDate)
        if (sortBy === 'registrations-desc') {
          return (Number(b.registeredCount) || 0) - (Number(a.registeredCount) || 0)
        }
        if (sortBy === 'utilization-desc') {
          const rateA = (Number(a.registeredCount) || 0) / Math.max(1, Number(a.capacity) || 1)
          const rateB = (Number(b.registeredCount) || 0) / Math.max(1, Number(b.capacity) || 1)
          return rateB - rateA
        }
        if (sortBy === 'title-asc') return (a.title || '').localeCompare(b.title || '')
        return 0
      })
  }, [events, categoryFilter, searchTerm, sortBy])

  const getStatusBadge = (event) => {
    const state = getEventRegistrationState(event)
    if (state.isPast) {
      return {
        label: 'Completed',
        className: 'bg-[#F3F1EA] text-[#737780] border-[#E8E5DE]'
      }
    }
    if (state.isFull) {
      return {
        label: 'Full',
        className: 'bg-[#FBF2F2] text-[#A34C4C] border-[#E5C5C5]'
      }
    }
    if (state.isDeadlinePassed) {
      return {
        label: 'Cutoff Passed',
        className: 'bg-[#FCF7ED] text-[#B58A46] border-[#EAD9B7]'
      }
    }
    if (state.spotsLeft <= 10) {
      return {
        label: 'Filling Fast',
        className: 'bg-[#FCF7ED] text-[#B58A46] border-[#EAD9B7]'
      }
    }
    return {
      label: 'Open',
      className: 'bg-[#EEF3EF] text-[#52745C] border-[#C5DBC9]'
    }
  }

  const handleOpenCreate = () => {
    setEventToEdit(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEdit = (event) => {
    setEventToEdit(event)
    setIsFormModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id)
      setEventToDelete(null)
    }
  }

  // Client-side Role Guard when in Student View
  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full bg-white border border-[#E8E5DE] rounded-2xl p-8 text-center shadow-card space-y-6">
          <div className="w-12 h-12 rounded-xl bg-[#FCF7ED] border border-[#EAD9B7] text-[#B58A46] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#722F43]">
              Student Mode Active
            </p>
            <h1 className="font-serif text-3xl font-normal text-[#17243A]">
              Admin Demo Dashboard
            </h1>
            <p className="text-xs text-[#737780] leading-relaxed">
              The management console is hidden in Student mode. Switch to Admin Demo Mode to test
              event creation, editing, deletion, and attendee roster exports.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF8F3] border border-[#E5D9BD] text-left text-[11px] text-[#737780] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#B69A62] shrink-0 mt-0.5" />
            <span>
              <strong className="text-[#17243A]">Portfolio Demo Note:</strong> Role switching is
              client-side for local interactive evaluation only; real authentication and RBAC
              authorization will be handled by a backend API.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setExplicitRole('admin')}
              className="btn-primary w-full sm:w-auto text-xs"
            >
              <Shield className="w-4 h-4" />
              Switch to Admin Demo Mode
            </button>
            <Link to="/" className="btn-secondary w-full sm:w-auto text-xs">
              <Compass className="w-4 h-4" />
              Back to Discover
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const hasFilters = searchTerm.trim() !== '' || categoryFilter !== 'All' || sortBy !== 'date-asc'

  return (
    <div className="space-y-8 pb-12">
      {/* Honest Demo Authorization Disclaimer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#E5D9BD] text-xs text-[#737780]">
        <div className="flex items-start sm:items-center gap-2.5">
          <Info className="w-4 h-4 text-[#B69A62] shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong className="text-[#17243A]">Demo Mode Active:</strong> Changes made here modify
            events and rosters locally in browser{' '}
            <code className="text-[#722F43] bg-white px-1.5 py-0.5 rounded border border-[#E8E5DE] font-mono text-[11px]">
              localStorage
            </code>{' '}
            with simulated client-side role permissions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExplicitRole('student')}
          className="text-xs font-medium text-[#722F43] hover:text-[#17243A] transition-colors shrink-0 self-end sm:self-center"
        >
          Exit to Student View
        </button>
      </div>

      {/* Header & Create CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E5DE] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#722F43]">
            <Shield className="w-3.5 h-3.5" />
            Management Console
          </div>
          <h1 className="font-serif text-3xl sm:text-[38px] font-normal text-[#17243A] mt-1">
            Campus Event Administration
          </h1>
          <p className="text-xs text-[#737780] mt-1">
            Publish events, monitor seat utilization, and inspect registration rosters.
          </p>
        </div>

        <button type="button" onClick={handleOpenCreate} className="btn-primary text-xs shrink-0">
          <Plus className="w-4 h-4" />
          Create New Event
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E5DE] rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#737780]">
            <span className="text-[11px] font-medium uppercase tracking-wider">Total Events</span>
            <Calendar className="w-4 h-4 text-[#B69A62]" />
          </div>
          <p className="font-serif text-3xl font-normal text-[#17243A] mt-2">
            {metrics.totalEvents}
          </p>
          <p className="text-[11px] text-[#737780] mt-1">All cataloged sessions</p>
        </div>

        <div className="bg-white border border-[#E8E5DE] rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#737780]">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Total Registrations
            </span>
            <Users className="w-4 h-4 text-[#B69A62]" />
          </div>
          <p className="font-serif text-3xl font-normal text-[#722F43] mt-2">
            {metrics.totalRegistrations}
          </p>
          <p className="text-[11px] text-[#737780] mt-1">Confirmed student seats</p>
        </div>

        <div className="bg-white border border-[#E8E5DE] rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#737780]">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Upcoming Events
            </span>
            <Calendar className="w-4 h-4 text-[#B69A62]" />
          </div>
          <p className="font-serif text-3xl font-normal text-[#17243A] mt-2">
            {metrics.upcomingEventsCount}
          </p>
          <p className="text-[11px] text-[#737780] mt-1">Currently active or scheduled</p>
        </div>

        <div className="bg-white border border-[#E8E5DE] rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between text-xs text-[#737780]">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Capacity Utilization
            </span>
            <TrendingUp className="w-4 h-4 text-[#B69A62]" />
          </div>
          <p className="font-serif text-3xl font-normal text-[#17243A] mt-2">
            {metrics.overallFillRate}%
          </p>
          <p className="text-[11px] text-[#737780] mt-1">
            {metrics.totalRegistrations} / {metrics.totalCapacity} total seats
          </p>
        </div>
      </div>

      {/* Table Filter & Sort Controls */}
      <div className="bg-white border border-[#E8E5DE] rounded-xl shadow-card p-4 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#737780] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search events by title, organizer, venue, or category..."
            aria-label="Search admin event catalog"
            className="input-field pl-10 py-2.5 text-xs"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter table by category"
              className="input-field pr-8 py-2.5 text-xs appearance-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#737780] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:flex-initial">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#737780] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort admin events"
              className="input-field pl-8 pr-8 py-2.5 text-xs appearance-none cursor-pointer"
            >
              <option value="date-asc">Date (Soonest First)</option>
              <option value="date-desc">Date (Latest First)</option>
              <option value="registrations-desc">Most Registrations</option>
              <option value="utilization-desc">Highest Capacity %</option>
              <option value="title-asc">Title (A–Z)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#737780] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('All')
                setSortBy('date-asc')
              }}
              className="btn-ghost text-xs text-[#722F43] shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Empty Table State */}
      {tableEvents.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-[#E8E5DE] shadow-card p-8 space-y-4">
          <p className="font-serif text-xl font-normal text-[#17243A]">No Matching Events</p>
          <p className="text-xs text-[#737780]">
            No events match your current search query or category filter.
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('All')
                setSortBy('date-asc')
              }}
              className="btn-secondary text-xs"
            >
              Clear Table Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Cards View (< md) */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {tableEvents.map((event) => {
              const catMeta = getCategoryMeta(event.category)
              const regState = getEventRegistrationState(event)
              const statusBadge = getStatusBadge(event)

              return (
                <div
                  key={event.id}
                  className="bg-white border border-[#E8E5DE] rounded-xl p-4 shadow-card space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${catMeta.badge}`}
                    >
                      {event.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${statusBadge.className}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  <div>
                    <Link
                      to={`/events/${event.id}`}
                      className="font-serif text-lg font-normal text-[#17243A] hover:text-[#722F43]"
                    >
                      {event.title}
                    </Link>
                    <p className="text-xs text-[#737780] mt-0.5">{event.organizer}</p>
                    <p className="text-xs text-[#737780] mt-1">
                      {formatDate(event.startDate)} • {formatTime(event.startDate)}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#737780]">
                      <span>Registrations</span>
                      <span className="text-[#17243A] font-medium">
                        {regState.registeredCount} / {regState.capacity} ({regState.percentFilled}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#F2EFE9] border border-[#E8E5DE] overflow-hidden">
                      <div
                        className={`h-full ${regState.isFull ? 'bg-[#A34C4C]' : 'bg-[#17243A]'}`}
                        style={{ width: `${regState.percentFilled}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8E5DE] flex items-center justify-end gap-2">
                    <Link
                      to={`/events/${event.id}`}
                      className="btn-ghost py-1.5 px-2.5 text-xs"
                      aria-label={`View details for ${event.title}`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => setRosterEvent(event)}
                      className="btn-ghost py-1.5 px-2.5 text-xs"
                    >
                      <Users className="w-3.5 h-3.5 text-[#17243A]" />
                      Roster
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(event)}
                      className="btn-ghost py-1.5 px-2.5 text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#722F43]" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventToDelete(event)}
                      className="btn-danger py-1.5 px-2.5 text-xs"
                      aria-label={`Delete ${event.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop Table View (md+) */}
          <div className="hidden md:block bg-white border border-[#E8E5DE] rounded-xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-[#F8F7F3] text-[#17243A] uppercase tracking-wider text-[11px] font-semibold border-b border-[#E8E5DE]">
                  <tr>
                    <th className="py-3.5 px-4">Event</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Date &amp; Time</th>
                    <th className="py-3.5 px-4">Organizer</th>
                    <th className="py-3.5 px-4">Registrations</th>
                    <th className="py-3.5 px-4">Capacity</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E5DE]">
                  {tableEvents.map((event) => {
                    const catMeta = getCategoryMeta(event.category)
                    const regState = getEventRegistrationState(event)
                    const statusBadge = getStatusBadge(event)

                    return (
                      <tr key={event.id} className="hover:bg-[#F8F7F3]/75 transition-colors">
                        <td className="py-3.5 px-4 max-w-[260px]">
                          <div className="flex items-center gap-3">
                            <img
                              src={event.bannerUrl || FALLBACK_THUMB}
                              alt=""
                              onError={(e) => {
                                e.currentTarget.src = FALLBACK_THUMB
                              }}
                              className="w-11 h-11 rounded-lg object-cover border border-[#E8E5DE] shrink-0 bg-[#F2EFE9]"
                            />
                            <div className="min-w-0">
                              <Link
                                to={`/events/${event.id}`}
                                className="font-serif text-[15px] font-normal text-[#17243A] hover:text-[#722F43] transition-colors line-clamp-1"
                              >
                                {event.title}
                              </Link>
                              <p className="text-[11px] text-[#737780] truncate mt-0.5">
                                {event.venue}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${catMeta.badge}`}
                          >
                            {event.category}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-[#737780]">
                          <p className="text-[#17243A] font-medium">
                            {formatDate(event.startDate, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-[11px] text-[#737780]">{formatTime(event.startDate)}</p>
                        </td>

                        <td className="py-3.5 px-4 max-w-[180px]">
                          <p className="text-[#737780] truncate">{event.organizer}</p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-[#17243A]">
                          {regState.registeredCount}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="w-24 space-y-1">
                            <div className="flex justify-between text-[11px] text-[#737780]">
                              <span>{regState.capacity}</span>
                              <span>{regState.percentFilled}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#F2EFE9] border border-[#E8E5DE] overflow-hidden">
                              <div
                                className={`h-full ${
                                  regState.isFull ? 'bg-[#A34C4C]' : 'bg-[#17243A]'
                                }`}
                                style={{ width: `${regState.percentFilled}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${statusBadge.className}`}
                          >
                            {statusBadge.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center justify-end gap-1">
                            <Link
                              to={`/events/${event.id}`}
                              className="p-1.5 rounded-lg text-[#737780] hover:text-[#17243A] hover:bg-[#F8F7F3] transition-colors"
                              title="View public event details"
                              aria-label={`View ${event.title}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setRosterEvent(event)}
                              className="p-1.5 rounded-lg text-[#737780] hover:text-[#17243A] hover:bg-[#F8F7F3] transition-colors"
                              title="View attendee roster"
                              aria-label={`View attendees for ${event.title}`}
                            >
                              <Users className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(event)}
                              className="p-1.5 rounded-lg text-[#737780] hover:text-[#722F43] hover:bg-[#FAF4F6] transition-colors"
                              title="Edit event"
                              aria-label={`Edit ${event.title}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEventToDelete(event)}
                              className="p-1.5 rounded-lg text-[#737780] hover:text-[#A34C4C] hover:bg-[#FBF2F2] transition-colors"
                              title="Delete event"
                              aria-label={`Delete ${event.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Admin Modals */}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false)
          setEventToEdit(null)
        }}
        eventToEdit={eventToEdit}
      />

      <AttendeeListModal
        isOpen={Boolean(rosterEvent)}
        onClose={() => setRosterEvent(null)}
        event={rosterEvent}
      />

      <DeleteConfirmModal
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleConfirmDelete}
        eventTitle={eventToDelete?.title}
      />
    </div>
  )
}
