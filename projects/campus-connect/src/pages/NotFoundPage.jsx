import React from 'react'
import { Link } from 'react-router-dom'
import { Compass, Ticket, Home, AlertCircle } from 'lucide-react'

export const NotFoundPage = () => {
  return (
    <div className="min-h-[65vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white border border-[#E8E5DE] rounded-2xl p-8 text-center shadow-card space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#FAF4F6] border border-[#E4C5CE] text-[#722F43] mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-[#722F43]">
            Error 404
          </p>
          <h1 className="font-serif text-3xl sm:text-[36px] font-normal text-[#17243A] tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-[#737780] leading-relaxed">
            The campus event or page you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/" className="btn-primary w-full sm:w-auto">
            <Compass className="w-4 h-4" />
            Discover Events
          </Link>
          <Link to="/my-events" className="btn-secondary w-full sm:w-auto">
            <Ticket className="w-4 h-4 text-[#722F43]" />
            My Events
          </Link>
        </div>

        <div className="pt-4 border-t border-[#E8E5DE]">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#737780] hover:text-[#17243A] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            Return to CampusConnect Home
          </Link>
        </div>
      </div>
    </div>
  )
}

