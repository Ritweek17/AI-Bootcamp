import React, { useState, useEffect } from 'react'
import { X, Search, Users, Download, Info } from 'lucide-react'
import { formatDate, getEventRegistrationState } from '../../utils/formatters'

export const AttendeeListModal = ({ isOpen, onClose, event }) => {
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSearch('')
    }
  }, [isOpen, event?.id])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !event) return null

  const attendees = event.attendees || []
  const regState = getEventRegistrationState(event)

  const filtered = attendees.filter((a) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.studentId?.toLowerCase().includes(q)
    )
  })

  const escapeCsvCell = (value) => {
    const str = String(value ?? '').replace(/"/g, '""')
    return `"${str}"`
  }

  const handleExportCSV = () => {
    if (attendees.length === 0) return
    const headers = ['Student Name', 'Student ID', 'Campus Email', 'Registration Date']
    const rows = attendees.map((a) =>
      [
        escapeCsvCell(a.name),
        escapeCsvCell(a.studentId || 'N/A'),
        escapeCsvCell(a.email),
        escapeCsvCell(a.registeredAt || '')
      ].join(',')
    )

    const csvText = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `roster-${event.id || 'event'}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const baselineCountDiff = Math.max(0, regState.registeredCount - attendees.length)

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#17243A]/55 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="roster-modal-title"
    >
      <div
        className="relative bg-white w-full max-w-2xl rounded-xl shadow-modal border border-[#E8E5DE] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#17243A] p-6 flex items-center justify-between border-b border-[#B69A62]/30">
          <div className="space-y-1 pr-6 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#B69A62]">
              <Users className="w-3.5 h-3.5" />
              Registration Roster
            </div>
            <h2
              id="roster-modal-title"
              className="font-serif text-xl font-normal truncate text-white"
            >
              {event.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#E8E5DE] hover:text-white hover:bg-white/10 transition-colors shrink-0"
            aria-label="Close attendee roster"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Capacity Overview Bar */}
        <div className="bg-[#F8F7F3] px-6 py-3.5 border-b border-[#E8E5DE] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-[#737780]">
            <span>
              Total Registered:{' '}
              <strong className="text-[#17243A]">{regState.registeredCount}</strong>
            </span>
            <span>
              Capacity: <strong className="text-[#17243A]">{regState.capacity}</strong>
            </span>
            <span className="text-[#722F43] font-semibold">
              {regState.percentFilled}% filled
            </span>
          </div>

          <div className="w-28 bg-white border border-[#E8E5DE] rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                regState.isFull ? 'bg-[#A34C4C]' : 'bg-[#17243A]'
              }`}
              style={{ width: `${regState.percentFilled}%` }}
            />
          </div>
        </div>

        {/* Roster Body */}
        <div className="p-6 space-y-4">
          {baselineCountDiff > 0 && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#F8F7F3] border border-[#E8E5DE] text-xs text-[#737780]">
              <Info className="w-4 h-4 text-[#B69A62] shrink-0 mt-0.5" />
              <span>
                Showing <strong className="text-[#17243A]">{attendees.length}</strong> detailed
                student record(s) stored in this demo. The remaining{' '}
                <strong className="text-[#17243A]">{baselineCountDiff}</strong> seeded occupancy
                count(s) represent pre-existing cohort turnout without synthetic PII entries.
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#737780] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by student name, ID, or email..."
                aria-label="Filter attendees"
                className="input-field pl-9 py-2 text-xs"
              />
            </div>

            {attendees.length > 0 && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-secondary py-2 px-3.5 text-xs shrink-0"
                title="Download recorded attendees as CSV"
              >
                <Download className="w-3.5 h-3.5 text-[#17243A]" />
                Export CSV ({attendees.length})
              </button>
            )}
          </div>

          <div className="border border-[#E8E5DE] rounded-lg overflow-hidden max-h-72 overflow-y-auto bg-white">
            {filtered.length === 0 ? (
              <div className="py-12 text-center space-y-2 px-4">
                <Users className="w-6 h-6 mx-auto text-[#B69A62]" />
                <p className="text-xs font-medium text-[#17243A]">No matching attendee records</p>
                <p className="text-[11px] text-[#737780]">
                  {attendees.length === 0
                    ? 'No detailed student registrations have been recorded for this event yet.'
                    : 'No attendee records match your search query.'}
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-[#F8F7F3] text-[#17243A] font-semibold border-b border-[#E8E5DE] sticky top-0">
                  <tr>
                    <th className="py-2.5 px-4">Student</th>
                    <th className="py-2.5 px-4">Student ID</th>
                    <th className="py-2.5 px-4">Email</th>
                    <th className="py-2.5 px-4">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E5DE]">
                  {filtered.map((att, index) => (
                    <tr
                      key={att.id || index}
                      className="hover:bg-[#F8F7F3]/70 transition-colors"
                    >
                      <td className="py-2.5 px-4 font-medium text-[#17243A]">{att.name}</td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-[#737780]">
                        {att.studentId || 'N/A'}
                      </td>
                      <td className="py-2.5 px-4 text-[#737780]">{att.email}</td>
                      <td className="py-2.5 px-4 text-[#737780]">
                        {formatDate(att.registeredAt, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="pt-1 flex justify-end">
            <button type="button" onClick={onClose} className="btn-secondary py-2 px-4 text-xs">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
