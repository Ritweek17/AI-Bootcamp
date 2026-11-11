import React, { useState, useEffect } from 'react'
import { X, Sparkles, Save, AlertCircle } from 'lucide-react'
import { CATEGORIES } from '../../services/seedData'
import { useEvents } from '../../context/EventContext'
import { validateEventPayload } from '../../utils/validators'

const BANNER_PRESETS = [
  {
    label: 'Hackathon / Tech',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'AI & Data Systems',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Music & Culture',
    url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Athletics',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Career & Talks',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
  },
  {
    label: 'Design Workshop',
    url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80'
  }
]

const FALLBACK_BANNER =
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'

export const EventFormModal = ({ isOpen, onClose, eventToEdit = null }) => {
  const { createEvent, updateEvent } = useEvents()
  const isEditing = Boolean(eventToEdit)

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    organizer: '',
    organizerContact: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    venue: '',
    capacity: 100,
    bannerUrl: BANNER_PRESETS[0].url,
    shortDescription: '',
    description: '',
    fee: 'Free',
    tags: 'Campus, Student Life',
    featured: false,
    isOnline: false
  })

  const [errors, setErrors] = useState({})
  const [previewSrc, setPreviewSrc] = useState(BANNER_PRESETS[0].url)

  const toLocalInputFormat = (isoString) => {
    if (!isoString) return ''
    try {
      const date = new Date(isoString)
      if (Number.isNaN(date.getTime())) return ''
      const pad = (n) => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
        date.getHours()
      )}:${pad(date.getMinutes())}`
    } catch {
      return ''
    }
  }

  useEffect(() => {
    if (eventToEdit && isOpen) {
      const banner = eventToEdit.bannerUrl || BANNER_PRESETS[0].url
      setFormData({
        title: eventToEdit.title || '',
        category: eventToEdit.category || 'Technology',
        organizer: eventToEdit.organizer || '',
        organizerContact: eventToEdit.organizerContact || '',
        startDate: toLocalInputFormat(eventToEdit.startDate),
        endDate: toLocalInputFormat(eventToEdit.endDate),
        registrationDeadline: toLocalInputFormat(eventToEdit.registrationDeadline),
        venue: eventToEdit.venue || '',
        capacity: eventToEdit.capacity || 100,
        bannerUrl: banner,
        shortDescription: eventToEdit.shortDescription || '',
        description: eventToEdit.description || '',
        fee: eventToEdit.fee || 'Free',
        tags: Array.isArray(eventToEdit.tags) ? eventToEdit.tags.join(', ') : '',
        featured: Boolean(eventToEdit.featured),
        isOnline: Boolean(eventToEdit.isOnline)
      })
      setPreviewSrc(banner)
      setErrors({})
    } else if (isOpen) {
      const now = new Date()
      const futureStart = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      futureStart.setHours(14, 0, 0, 0)
      const futureEnd = new Date(futureStart.getTime() + 3 * 60 * 60 * 1000)
      const deadline = new Date(futureStart.getTime() - 24 * 60 * 60 * 1000)

      setFormData({
        title: '',
        category: 'Technology',
        organizer: 'Student Activities Council',
        organizerContact: 'events@campusconnect.demo',
        startDate: toLocalInputFormat(futureStart.toISOString()),
        endDate: toLocalInputFormat(futureEnd.toISOString()),
        registrationDeadline: toLocalInputFormat(deadline.toISOString()),
        venue: 'Student Innovation Center — Hall A',
        capacity: 100,
        bannerUrl: BANNER_PRESETS[0].url,
        shortDescription: '',
        description: '',
        fee: 'Free',
        tags: 'Campus, Learning',
        featured: false,
        isOnline: false
      })
      setPreviewSrc(BANNER_PRESETS[0].url)
      setErrors({})
    }
  }, [eventToEdit, isOpen])

  useEffect(() => {
    setPreviewSrc(formData.bannerUrl || FALLBACK_BANNER)
  }, [formData.bannerUrl])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validationErrors = validateEventPayload(formData, {
      isEditing,
      existingRegisteredCount: Number(eventToEdit?.registeredCount) || 0
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const parsedTags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const trimmedDesc = formData.description.trim()
    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      organizer: formData.organizer.trim(),
      organizerContact: formData.organizerContact.trim(),
      venue: formData.venue.trim(),
      capacity: Number(formData.capacity),
      fee: formData.fee.trim() || 'Free',
      bannerUrl: formData.bannerUrl.trim() || BANNER_PRESETS[0].url,
      tags: parsedTags,
      featured: Boolean(formData.featured),
      isOnline: Boolean(formData.isOnline),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      registrationDeadline: formData.registrationDeadline
        ? new Date(formData.registrationDeadline).toISOString()
        : new Date(formData.startDate).toISOString(),
      shortDescription:
        formData.shortDescription.trim() ||
        (trimmedDesc.length > 110 ? `${trimmedDesc.slice(0, 110)}...` : trimmedDesc),
      description: trimmedDesc
    }

    if (isEditing) {
      updateEvent(eventToEdit.id, payload)
    } else {
      createEvent(payload)
    }
    onClose()
  }

  const errorCount = Object.keys(errors).length

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#17243A]/55 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-form-title"
    >
      <div
        className="relative bg-white w-full max-w-2xl rounded-xl shadow-modal border border-[#E8E5DE] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#17243A] p-6 flex items-center justify-between border-b border-[#B69A62]/30">
          <div className="flex items-center gap-3 pr-4">
            <div className="w-9 h-9 rounded-lg bg-white/10 border border-[#B69A62]/40 flex items-center justify-center text-[#B69A62] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2
                id="event-form-title"
                className="font-serif text-xl font-normal text-white"
              >
                {isEditing ? 'Edit Campus Event' : 'Create New Event'}
              </h2>
              <p className="text-xs text-[#E8E5DE]/85">
                {isEditing
                  ? 'Update event schedule, venue, and registration limits'
                  : 'Publish an upcoming event to the CampusConnect catalog'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#E8E5DE] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close event editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorCount > 0 && (
            <div
              role="alert"
              className="flex items-center gap-2.5 p-3 rounded-lg bg-[#FBF2F2] border border-[#E5C5C5] text-xs text-[#A34C4C]"
            >
              <AlertCircle className="w-4 h-4 text-[#A34C4C] shrink-0" />
              <span>Please fix the {errorCount} highlighted field(s) below before saving.</span>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="evt-title" className="block text-xs font-medium text-[#25282D] mb-1.5">
                Event Title <span className="text-[#A34C4C]">*</span>
              </label>
              <input
                id="evt-title"
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Spring Robotics Expo & Demo Day"
                className={`input-field ${errors.title ? 'border-[#A34C4C] focus:border-[#A34C4C]' : ''}`}
              />
              {errors.title && <p className="text-xs text-[#A34C4C] mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="evt-category" className="block text-xs font-medium text-[#25282D] mb-1.5">
                Category
              </label>
              <select
                id="evt-category"
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="input-field cursor-pointer"
              >
                {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Organizer & Contact Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="evt-organizer" className="block text-xs font-medium text-[#25282D] mb-1.5">
                Organizer / Club Name <span className="text-[#A34C4C]">*</span>
              </label>
              <input
                id="evt-organizer"
                type="text"
                value={formData.organizer}
                onChange={(e) => updateField('organizer', e.target.value)}
                placeholder="e.g. Robotics Society"
                className={`input-field ${errors.organizer ? 'border-[#A34C4C] focus:border-[#A34C4C]' : ''}`}
              />
              {errors.organizer && <p className="text-xs text-[#A34C4C] mt-1">{errors.organizer}</p>}
            </div>

            <div>
              <label htmlFor="evt-contact" className="block text-xs font-medium text-[#25282D] mb-1.5">
                Organizer Contact Email
              </label>
              <input
                id="evt-contact"
                type="email"
                value={formData.organizerContact}
                onChange={(e) => updateField('organizerContact', e.target.value)}
                placeholder="contact@campusconnect.demo"
                className={`input-field ${
                  errors.organizerContact ? 'border-[#A34C4C] focus:border-[#A34C4C]' : ''
                }`}
              />
              {errors.organizerContact && (
                <p className="text-xs text-[#A34C4C] mt-1">{errors.organizerContact}</p>
              )}
            </div>
          </div>

          {/* Venue, Fee & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="evt-venue" className="block text-xs font-medium text-[#25282D] mb-1.5">
                Venue / Session Link <span className="text-[#A34C4C]">*</span>
              </label>
              <input
                id="evt-venue"
                type="text"
                value={formData.venue}
                onChange={(e) => updateField('venue', e.target.value)}
                placeholder="Student Union — Room 204"
                className={`input-field ${errors.venue ? 'border-[#A34C4C] focus:border-[#A34C4C]' : ''}`}
              />
              {errors.venue && <p className="text-xs text-[#A34C4C] mt-1">{errors.venue}</p>}
            </div>

            <div>
              <label htmlFor="evt-capacity" className="block text-xs font-medium text-[#25282D] mb-1.5">
                Seat Capacity <span className="text-[#A34C4C]">*</span>
              </label>
              <input
                id="evt-capacity"
                type="number"
                min={1}
                step={1}
                value={formData.capacity}
                onChange={(e) => updateField('capacity', e.target.value)}
                className={`input-field ${errors.capacity ? 'border-[#A34C4C] focus:border-[#A34C4C]' : ''}`}
              />
              {errors.capacity && <p className="text-xs text-[#A34C4C] mt-1">{errors.capacity}</p>}
            </div>

            <div>
              <label htmlFor="evt-fee" className="block text-xs font-medium text-[#25282D] mb-1.5">
                Admission Fee
              </label>
              <input
                id="evt-fee"
                type="text"
                value={formData.fee}
                onChange={(e) => updateField('fee', e.target.value)}
                placeholder="Free"
                className="input-field"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="evt-start" className="block text-xs font-medium text-[#25282D] mb-1.5">
                Start Date & Time <span className="text-[#A34C4C]">*</span>
              </label>
              <input
                id="evt-start"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                className={`input-field ${errors.startDate ? 'border-[#A34C4C] focus:border-[#A34C4C]' : ''}`}
              />
              {errors.startDate && <p className="text-xs text-[#A34C4C] mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="evt-end" className="block text-xs font-medium text-[#25282D] mb-1.5">
                End Date & Time <span className="text-[#A34C4C]">*</span>
              </label>
              <input
                id="evt-end"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
                className={`input-field ${errors.endDate ? 'border-[#A34C4C] focus:border-[#A34C4C]' : ''}`}
              />
              {errors.endDate && <p className="text-xs text-[#A34C4C] mt-1">{errors.endDate}</p>}
            </div>

            <div>
              <label htmlFor="evt-deadline" className="block text-xs font-medium text-[#25282D] mb-1.5">
                Registration Cutoff
              </label>
              <input
                id="evt-deadline"
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => updateField('registrationDeadline', e.target.value)}
                className={`input-field ${
                  errors.registrationDeadline ? 'border-[#A34C4C] focus:border-[#A34C4C]' : ''
                }`}
              />
              {errors.registrationDeadline && (
                <p className="text-xs text-[#A34C4C] mt-1">{errors.registrationDeadline}</p>
              )}
            </div>
          </div>

          {/* Toggles: Featured & Online */}
          <div className="flex flex-wrap items-center gap-6 px-4 py-3 rounded-lg bg-[#F8F7F3] border border-[#E8E5DE]">
            <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#25282D]">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                className="w-4 h-4 rounded border-[#D8D3C7] bg-white text-[#722F43] accent-[#722F43] focus:ring-[#722F43]"
              />
              Feature on Home Showcase
            </label>

            <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#25282D]">
              <input
                type="checkbox"
                checked={formData.isOnline}
                onChange={(e) => updateField('isOnline', e.target.checked)}
                className="w-4 h-4 rounded border-[#D8D3C7] bg-white text-[#722F43] accent-[#722F43] focus:ring-[#722F43]"
              />
              Virtual / Online Format
            </label>
          </div>

          {/* Banner URL & Presets */}
          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <label htmlFor="evt-banner" className="block text-xs font-medium text-[#25282D] mb-1.5">
                  Cover Image URL
                </label>
                <input
                  id="evt-banner"
                  type="url"
                  value={formData.bannerUrl}
                  onChange={(e) => updateField('bannerUrl', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className={`input-field ${errors.bannerUrl ? 'border-[#A34C4C] focus:border-[#A34C4C]' : ''}`}
                />
                {errors.bannerUrl && <p className="text-xs text-[#A34C4C] mt-1">{errors.bannerUrl}</p>}
              </div>

              <div className="w-20 h-14 mt-5 rounded-lg overflow-hidden border border-[#E8E5DE] bg-[#F2EFE9] shrink-0">
                <img
                  src={previewSrc}
                  alt="Cover preview"
                  onError={() => setPreviewSrc(FALLBACK_BANNER)}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[11px] text-[#737780] shrink-0 mr-1">Presets:</span>
              {BANNER_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => updateField('bannerUrl', preset.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border shrink-0 transition-colors ${
                    formData.bannerUrl === preset.url
                      ? 'bg-[#722F43] text-white border-[#722F43] font-semibold'
                      : 'bg-[#F8F7F3] text-[#25282D] hover:text-[#17243A] border-[#E8E5DE] hover:bg-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags & Short Description */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="evt-tags" className="block text-xs font-medium text-[#25282D] mb-1.5">
                Tags (comma separated)
              </label>
              <input
                id="evt-tags"
                type="text"
                value={formData.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="AI, Workshop, Hands-on"
                className="input-field"
              />
            </div>

            <div>
              <label htmlFor="evt-short-desc" className="block text-xs font-medium text-[#25282D] mb-1.5">
                Card Summary (Optional)
              </label>
              <input
                id="evt-short-desc"
                type="text"
                maxLength={140}
                value={formData.shortDescription}
                onChange={(e) => updateField('shortDescription', e.target.value)}
                placeholder="Brief 1-sentence summary shown on cards"
                className="input-field"
              />
            </div>
          </div>

          {/* Full Description */}
          <div>
            <label htmlFor="evt-description" className="block text-xs font-medium text-[#25282D] mb-1.5">
              Full Event Description <span className="text-[#A34C4C]">*</span>
            </label>
            <textarea
              id="evt-description"
              rows={4}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Schedule, guest speakers, prerequisites, and what students should bring..."
              className={`input-field ${errors.description ? 'border-[#A34C4C] focus:border-[#A34C4C]' : ''}`}
            />
            {errors.description && <p className="text-xs text-[#A34C4C] mt-1">{errors.description}</p>}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#E8E5DE] flex items-center justify-end gap-2.5">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs">
              <Save className="w-3.5 h-3.5" />
              {isEditing ? 'Save Changes' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
