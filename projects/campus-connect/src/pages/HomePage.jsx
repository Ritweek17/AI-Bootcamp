import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Compass,
  Ticket,
  Calendar,
  Sparkles,
  Code2,
  Cpu,
  Music,
  Trophy,
  Wrench,
  Briefcase,
  Layers,
  Clock,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { useEvents } from '../context/EventContext'
import { CATEGORIES } from '../services/seedData'
import { isPastEvent, getEventRegistrationState } from '../utils/formatters'
import { EventFilters } from '../components/events/EventFilters'
import { EventCard } from '../components/events/EventCard'
import { CampusCalendarWidget } from '../components/events/CampusCalendarWidget'
import { RegistrationModal } from '../components/events/RegistrationModal'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1600&q=80'

const CATEGORY_CARDS = [
  { name: 'Technology', icon: Cpu, description: 'AI talks, engineering demos & systems panels' },
  { name: 'Hackathon', icon: Code2, description: 'Weekend build sprints & prototype showcases' },
  { name: 'Cultural', icon: Music, description: 'Music nights, student showcases & festivals' },
  { name: 'Sports', icon: Trophy, description: 'Varsity games, intramurals & tournaments' },
  { name: 'Workshop', icon: Wrench, description: 'Hands-on design, hardware & coding labs' },
  { name: 'Career', icon: Briefcase, description: 'Recruiting mixers, alumni talks & portfolio reviews' }
]

const PILLARS = [
  {
    icon: Layers,
    title: 'One Unified Campus Feed',
    description:
      'Replace scattered group chats and bulletin flyers with a single searchable directory spanning every department and club.'
  },
  {
    icon: Clock,
    title: 'Instant Schedule Clarity',
    description:
      'Check live seat availability, registration cutoffs, and monthly calendar overlaps before committing your week.'
  },
  {
    icon: CheckCircle2,
    title: 'Passes & Bookmarks Ready',
    description:
      'Bookmark upcoming sessions to shortlist later and access your confirmed registration passes in one workspace.'
  }
]

export const HomePage = () => {
  const {
    filteredEvents,
    events,
    loading,
    clearFilters,
    setSelectedCategory,
    selectedCategory,
    showUpcomingOnly,
    setShowUpcomingOnly
  } = useEvents()

  const [registeringEvent, setRegisteringEvent] = useState(null)
  const [heroImageError, setHeroImageError] = useState(false)

  // Live metrics calculated exclusively from stored event records
  const stats = useMemo(() => {
    const upcoming = events.filter((e) => !isPastEvent(e))
    const totalRegistrations = events.reduce(
      (sum, e) => sum + (Number(e.registeredCount) || 0),
      0
    )
    const availableSeats = upcoming.reduce((sum, e) => {
      const state = getEventRegistrationState(e)
      return sum + (state.isOpen ? state.spotsLeft : 0)
    }, 0)
    const activeCategories = new Set(events.map((e) => e.category).filter(Boolean)).size

    return {
      upcomingCount: upcoming.length,
      totalRegistrations,
      availableSeats,
      activeCategories
    }
  }, [events])

  // Featured upcoming events
  const featuredEvents = useMemo(() => {
    return events
      .filter((e) => e.featured && !isPastEvent(e))
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 3)
  }, [events])

  // Category counts across all events
  const categoryCounts = useMemo(() => {
    const counts = {}
    CATEGORIES.filter((c) => c !== 'All').forEach((cat) => {
      counts[cat] = events.filter((e) => e.category?.toLowerCase() === cat.toLowerCase()).length
    })
    return counts
  }, [events])

  const handleCategoryBrowse = (catName) => {
    setSelectedCategory(catName)
    const el = document.getElementById('discover')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-[#17243A] border border-[#B69A62]/30 shadow-card">
        {!heroImageError && (
          <img
            src={HERO_IMAGE}
            alt="Students gathering at a campus showcase"
            onError={() => setHeroImageError(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-15"
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#101929]/95 via-[#17243A]/90 to-[#17243A]/85"
          aria-hidden="true"
        />

        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-[#B69A62]/40 text-[#F8F7F3] text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#B69A62]" />
            Centralized Campus Discovery
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[52px] font-normal tracking-tight text-white leading-[1.1]">
            Your Campus. Your Community. Your Events.
          </h1>

          <p className="text-sm sm:text-base text-[#E8E5DE]/90 leading-relaxed max-w-2xl">
            Discover academic symposia, hackathons, cultural festivals, workshops, career forums,
            and varsity athletics — all organized in one centralized campus hub.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#discover"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#F8F7F3] hover:bg-white text-[#17243A] text-sm font-semibold transition-colors shadow-sm"
            >
              <Compass className="w-4 h-4 text-[#722F43]" />
              Explore Events
            </a>
            <Link
              to="/my-events"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/25 text-sm font-medium transition-colors"
            >
              <Ticket className="w-4 h-4 text-[#B69A62]" />
              View My Events
            </Link>
          </div>
        </div>
      </section>

      {/* Compact Campus Activity Summary */}
      <section aria-label="Live campus event summary" className="-mt-8 relative z-20 px-1 sm:px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-5 shadow-card">
            <p className="text-[11px] font-semibold text-[#737780] uppercase tracking-wider">
              Upcoming Events
            </p>
            <p className="font-serif text-3xl font-normal text-[#17243A] mt-1">
              {stats.upcomingCount}
            </p>
          </div>
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-5 shadow-card">
            <p className="text-[11px] font-semibold text-[#737780] uppercase tracking-wider">
              Total Registrations
            </p>
            <p className="font-serif text-3xl font-normal text-[#722F43] mt-1">
              {stats.totalRegistrations}
            </p>
          </div>
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-5 shadow-card">
            <p className="text-[11px] font-semibold text-[#737780] uppercase tracking-wider">
              Open Seats Remaining
            </p>
            <p className="font-serif text-3xl font-normal text-[#17243A] mt-1">
              {stats.availableSeats}
            </p>
          </div>
          <div className="bg-white border border-[#E8E5DE] rounded-xl p-5 shadow-card">
            <p className="text-[11px] font-semibold text-[#737780] uppercase tracking-wider">
              Active Categories
            </p>
            <p className="font-serif text-3xl font-normal text-[#17243A] mt-1">
              {stats.activeCategories}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Events Showcase */}
      {featuredEvents.length > 0 && (
        <section className="space-y-6" aria-labelledby="featured-heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#E8E5DE] pb-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#722F43]">
                Highlights
              </p>
              <h2
                id="featured-heading"
                className="font-serif text-2xl sm:text-[28px] font-normal text-[#17243A] mt-1"
              >
                Featured Upcoming Events
              </h2>
            </div>
            <a
              href="#discover"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#17243A] hover:text-[#722F43] transition-colors shrink-0"
            >
              Browse full catalog
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard
                key={`featured-${event.id}`}
                event={event}
                onQuickRegister={(evt) => setRegisteringEvent(evt)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Event Discovery Catalog */}
      <section id="discover" className="space-y-6 scroll-mt-24" aria-labelledby="discover-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8E5DE] pb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#722F43]">
              Directory
            </p>
            <h2
              id="discover-heading"
              className="font-serif text-2xl sm:text-[28px] font-normal text-[#17243A] mt-1"
            >
              Discover Campus Events
            </h2>
          </div>
          <p className="text-xs text-[#737780]">
            Filter by category, search keywords, or switch between upcoming and full history.
          </p>
        </div>

        <EventFilters />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-96 rounded-xl bg-white border border-[#E8E5DE] animate-pulse"
              />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-[#E8E5DE] shadow-card p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#F8F7F3] border border-[#E8E5DE] text-[#B69A62] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="font-serif text-xl font-normal text-[#17243A]">
                No matching events found
              </h3>
              <p className="text-xs text-[#737780] leading-relaxed">
                {showUpcomingOnly
                  ? 'No upcoming events matched your current filters. You can clear filters or include past events.'
                  : 'No campus events matched your current search or category selection.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button type="button" onClick={clearFilters} className="btn-primary text-xs">
                Clear Filters
              </button>
              {showUpcomingOnly && (
                <button
                  type="button"
                  onClick={() => setShowUpcomingOnly(false)}
                  className="btn-secondary text-xs"
                >
                  Include Past Events
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onQuickRegister={(evt) => setRegisteringEvent(evt)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Interactive Campus Calendar Widget */}
      <section className="space-y-6" aria-labelledby="calendar-heading">
        <div className="border-b border-[#E8E5DE] pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#722F43]">
            Schedule View
          </p>
          <h2
            id="calendar-heading"
            className="font-serif text-2xl sm:text-[28px] font-normal text-[#17243A] mt-1"
          >
            Monthly Campus Calendar
          </h2>
          <p className="text-xs text-[#737780] mt-1">
            Select any highlighted date to inspect sessions happening that day across campus.
          </p>
        </div>

        <CampusCalendarWidget />
      </section>

      {/* Quick Browse Categories */}
      <section className="space-y-6" aria-labelledby="categories-heading">
        <div className="border-b border-[#E8E5DE] pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#722F43]">
            Explore by Discipline
          </p>
          <h2
            id="categories-heading"
            className="font-serif text-2xl sm:text-[28px] font-normal text-[#17243A] mt-1"
          >
            Browse by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORY_CARDS.map((cat) => {
            const Icon = cat.icon
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase()
            const count = categoryCounts[cat.name] || 0
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategoryBrowse(cat.name)}
                className={`text-left p-5 rounded-xl border transition-all duration-150 flex items-start gap-4 group shadow-card ${
                  isSelected
                    ? 'bg-white border-[#722F43] ring-1 ring-[#722F43]/15'
                    : 'bg-white border-[#E8E5DE] hover:border-[#17243A]/30 hover:shadow-card-hover'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#722F43] border-[#722F43] text-white'
                      : 'bg-[#F8F7F3] border-[#E8E5DE] text-[#17243A] group-hover:text-[#722F43]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-base font-normal text-[#17243A] group-hover:text-[#722F43] transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F8F7F3] border border-[#E8E5DE] text-[#737780]">
                      {count} {count === 1 ? 'event' : 'events'}
                    </span>
                  </div>
                  <p className="text-xs text-[#737780] mt-1 leading-relaxed">{cat.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Why CampusConnect */}
      <section className="space-y-6" aria-labelledby="pillars-heading">
        <div className="border-b border-[#E8E5DE] pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#722F43]">
            Platform Overview
          </p>
          <h2
            id="pillars-heading"
            className="font-serif text-2xl sm:text-[28px] font-normal text-[#17243A] mt-1"
          >
            Built for Campus Discovery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="bg-white border border-[#E8E5DE] rounded-xl p-6 shadow-card space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F8F7F3] border border-[#B69A62]/40 text-[#17243A] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg font-normal text-[#17243A]">{pillar.title}</h3>
                <p className="text-xs text-[#737780] leading-relaxed">{pillar.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Registration Modal */}
      <RegistrationModal
        event={registeringEvent}
        isOpen={Boolean(registeringEvent)}
        onClose={() => setRegisteringEvent(null)}
      />
    </div>
  )
}
