import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, RotateCcw } from 'lucide-react'
import { useEvents } from '../../context/EventContext'
import { ConfirmModal } from '../common/ConfirmModal'

export const Footer = () => {
  const { resetAllData } = useEvents()
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const handleConfirmReset = () => {
    resetAllData()
    setIsResetModalOpen(false)
  }

  return (
    <footer className="bg-[#17243A] text-[#E8E5DE] mt-20 border-t border-[#B69A62]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* About CampusConnect */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#223452] border border-[#B69A62]/45 flex items-center justify-center text-[#B69A62]">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-serif text-xl tracking-tight text-[#F8F7F3]">
                CampusConnect
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#E8E5DE]/80 max-w-md">
              A centralized campus event discovery and registration portal designed for students
              and university organizations. Explore upcoming hackathons, symposia, cultural
              showcases, and athletics in one organized space.
            </p>
            <div className="pt-1">
              <button
                onClick={() => setIsResetModalOpen(true)}
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium bg-white/[0.08] text-[#F8F7F3] hover:bg-white/[0.15] border border-white/15 transition-colors duration-150"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#B69A62]" />
                Reset Demo Data
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-[#F8F7F3] uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs text-[#E8E5DE]/80">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Discover Events
                </Link>
              </li>
              <li>
                <Link to="/my-events" className="hover:text-white transition-colors">
                  My Events &amp; Passes
                </Link>
              </li>
              <li>
                <Link to="/?category=Hackathon" className="hover:text-white transition-colors">
                  Hackathons
                </Link>
              </li>
              <li>
                <Link to="/?category=Technology" className="hover:text-white transition-colors">
                  Technology &amp; Engineering
                </Link>
              </li>
              <li>
                <Link to="/?category=Cultural" className="hover:text-white transition-colors">
                  Cultural &amp; Arts
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Features & Demo Mode Disclosure */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold text-[#F8F7F3] uppercase tracking-wider mb-3">
              Platform Capabilities
            </h3>
            <ul className="space-y-1.5 text-xs text-[#E8E5DE]/80 mb-3">
              <li>• Unified search across titles, clubs, and venues</li>
              <li>• Monthly campus calendar &amp; discipline filters</li>
              <li>• Instant bookmarking, capacity rules &amp; demo passes</li>
              <li>• Admin studio for event scheduling &amp; CSV rosters</li>
            </ul>
            <p className="text-[11px] text-[#E8E5DE]/65 leading-relaxed">
              Running in browser-local MVP mode (<code className="text-[#F8F7F3]">localStorage</code>).
              Structured for seamless backend integration.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8E5DE]/65 gap-3">
          <p>© {new Date().getFullYear()} CampusConnect. Built with React, Vite &amp; Tailwind CSS.</p>
          <p>Client-side demo data · No external user tracking</p>
        </div>
      </div>

      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Data"
        message="Restore initial campus events and clear any custom changes, saved bookmarks, and student registrations stored in your browser?"
        confirmLabel="Reset to Defaults"
        variant="primary"
      />
    </footer>
  )
}
