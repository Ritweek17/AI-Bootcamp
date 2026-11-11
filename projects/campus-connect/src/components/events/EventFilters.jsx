import React from 'react'
import { Search, X, ArrowUpDown, Filter, ChevronDown } from 'lucide-react'
import { CATEGORIES } from '../../services/seedData'
import { useEvents } from '../../context/EventContext'

export const EventFilters = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    showUpcomingOnly,
    setShowUpcomingOnly,
    clearFilters,
    filteredEvents,
    events
  } = useEvents()

  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    selectedCategory !== 'All' ||
    !showUpcomingOnly ||
    sortBy !== 'date-asc'

  return (
    <div className="bg-white border border-[#E8E5DE] rounded-xl shadow-card p-4 sm:p-5 space-y-4">
      {/* Top Search, Sort & Toggle Controls */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#737780] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event name, club, venue, category, or tag..."
            aria-label="Search campus events"
            className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#F8F7F3] border border-[#E8E5DE] text-sm text-[#25282D] placeholder-[#737780]/75 focus:outline-none focus:bg-white focus:border-[#17243A] focus:ring-1 focus:ring-[#17243A] transition-colors"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#737780] hover:text-[#17243A] hover:bg-[#EFECE4] transition-colors"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort, Upcoming Toggle & Reset */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <div className="relative flex-1 sm:flex-initial">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#737780] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort events"
              className="w-full sm:w-auto pl-8 pr-8 py-2.5 rounded-lg bg-[#F8F7F3] border border-[#E8E5DE] text-xs font-medium text-[#25282D] focus:outline-none focus:bg-white focus:border-[#17243A] focus:ring-1 focus:ring-[#17243A] appearance-none cursor-pointer transition-colors"
            >
              <option value="date-asc">Soonest First</option>
              <option value="date-desc">Latest Scheduled</option>
              <option value="popularity">Most Registered</option>
              <option value="spots-left">Fewest Seats Left</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#737780] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setShowUpcomingOnly(!showUpcomingOnly)}
            aria-pressed={showUpcomingOnly}
            className={`px-3.5 py-2.5 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-2 shrink-0 ${
              showUpcomingOnly
                ? 'bg-[#EEF3EF] text-[#17243A] border-[#52745C]/35'
                : 'bg-white text-[#737780] border-[#E8E5DE] hover:text-[#17243A] hover:border-[#17243A]/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                showUpcomingOnly ? 'bg-[#52745C]' : 'bg-[#B8B4AA]'
              }`}
            />
            <span>Upcoming Only</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-3 py-2.5 rounded-lg text-xs font-medium text-[#722F43] hover:text-white bg-[#FAF4F6] hover:bg-[#722F43] border border-[#E4C5CE] hover:border-[#722F43] transition-colors shrink-0"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills & Result Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E8E5DE]">
        <div
          className="flex items-center gap-1.5 overflow-x-auto py-1"
          role="group"
          aria-label="Filter events by category"
        >
          <span className="text-[11px] font-semibold text-[#737780] uppercase tracking-wider shrink-0 mr-1.5 flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-[#B69A62]" />
            Category
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase()
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={isSelected}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-[#722F43] text-white border-[#722F43] font-semibold'
                    : 'bg-[#F8F7F3] text-[#25282D] hover:text-[#17243A] border-[#E8E5DE] hover:border-[#17243A]/30 hover:bg-white'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        <p className="text-xs text-[#737780] shrink-0">
          Showing <span className="font-semibold text-[#17243A]">{filteredEvents.length}</span> of{' '}
          <span className="font-semibold text-[#17243A]">{events.length}</span> events
        </p>
      </div>
    </div>
  )
}
