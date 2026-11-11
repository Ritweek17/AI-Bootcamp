import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Compass,
  Ticket,
  LayoutDashboard,
  UserCheck,
  Shield,
  Menu,
  X,
  GraduationCap
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { useToast } from '../../context/ToastContext'

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { role, setExplicitRole, isAdmin, currentUser } = useAuth()
  const { bookmarks, registrations } = useUser()
  const { showToast } = useToast()
  const location = useLocation()
  const navigate = useNavigate()

  const regCount = registrations?.length || 0
  const bookmarkCount = bookmarks?.length || 0
  const totalMyItems = regCount + bookmarkCount

  // Ensure mobile menu closes automatically on navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname, location.search])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleRoleSwitch = (nextRole) => {
    if (nextRole === role) return
    setExplicitRole(nextRole)
    if (nextRole === 'admin') {
      showToast('Switched to Admin Demo Mode. Management dashboard unlocked.', 'info')
    } else {
      showToast('Switched to Student View.', 'info')
      if (location.pathname.startsWith('/admin')) {
        navigate('/')
      }
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-[#17243A] border-b border-[#B69A62]/30 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Wordmark */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#223452] border border-[#B69A62]/45 flex items-center justify-center text-[#B69A62] group-hover:border-[#B69A62] transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-tight text-[#F8F7F3] leading-none">
                CampusConnect
              </span>
              <span className="hidden sm:block text-[10px] font-medium text-[#E8E5DE]/75 mt-0.5 tracking-wide uppercase">
                University Event Hub
              </span>
            </div>
          </Link>

          {/* Primary Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Main navigation">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-2 ${
                isActive('/')
                  ? 'bg-[#722F43] text-white'
                  : 'text-[#E8E5DE]/85 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Compass className={`w-4 h-4 ${isActive('/') ? 'text-[#F8F7F3]' : 'text-[#B69A62]'}`} />
              Discover
            </Link>

            <Link
              to="/my-events"
              className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-2 ${
                isActive('/my-events')
                  ? 'bg-[#722F43] text-white'
                  : 'text-[#E8E5DE]/85 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Ticket className={`w-4 h-4 ${isActive('/my-events') ? 'text-[#F8F7F3]' : 'text-[#B69A62]'}`} />
              My Events
              {totalMyItems > 0 && (
                <span
                  className={`ml-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded-full ${
                    isActive('/my-events')
                      ? 'bg-white text-[#722F43]'
                      : 'bg-[#722F43] text-white'
                  }`}
                  title={`${regCount} registered, ${bookmarkCount} saved`}
                >
                  {totalMyItems}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center gap-2 ${
                  isActive('/admin')
                    ? 'bg-[#722F43] text-white'
                    : 'text-[#E8E5DE]/85 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 ${isActive('/admin') ? 'text-[#F8F7F3]' : 'text-[#B69A62]'}`} />
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Right Controls: Demo Role Switcher & Profile */}
          <div className="hidden md:flex items-center gap-3">
            <div
              className="flex items-center bg-[#101929] p-1 rounded-lg border border-white/15"
              role="group"
              aria-label="Demo role switcher"
              title="Demo mode switcher (client-side preview only)"
            >
              <button
                onClick={() => handleRoleSwitch('student')}
                type="button"
                aria-pressed={!isAdmin}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 ${
                  !isAdmin
                    ? 'bg-white text-[#17243A]'
                    : 'text-[#E8E5DE]/80 hover:text-white'
                }`}
              >
                <UserCheck className={`w-3.5 h-3.5 ${!isAdmin ? 'text-[#722F43]' : 'text-[#B69A62]'}`} />
                Student
              </button>
              <button
                onClick={() => handleRoleSwitch('admin')}
                type="button"
                aria-pressed={isAdmin}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 ${
                  isAdmin
                    ? 'bg-[#722F43] text-white'
                    : 'text-[#E8E5DE]/80 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Demo
              </button>
            </div>

            <div className="flex items-center gap-2.5 pl-3 border-l border-white/15">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#B69A62]/60"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-[#F8F7F3] leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-[#E8E5DE]/75 leading-tight">
                  {isAdmin ? 'Admin Demo' : 'Student'}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            type="button"
            className="md:hidden p-2 rounded-md text-[#F8F7F3] hover:bg-white/10 border border-white/15"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#B69A62]/25 bg-[#101929] px-4 py-4 space-y-4">
          <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
            <Link
              to="/"
              className={`px-3 py-2.5 rounded-md text-sm font-medium flex items-center gap-2.5 ${
                isActive('/')
                  ? 'bg-[#722F43] text-white'
                  : 'text-[#E8E5DE]/85 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Compass className="w-4 h-4 text-[#B69A62]" />
              Discover
            </Link>

            <Link
              to="/my-events"
              className={`px-3 py-2.5 rounded-md text-sm font-medium flex items-center justify-between ${
                isActive('/my-events')
                  ? 'bg-[#722F43] text-white'
                  : 'text-[#E8E5DE]/85 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Ticket className="w-4 h-4 text-[#B69A62]" />
                My Events
              </span>
              <span className="text-xs text-[#E8E5DE]/75">
                {regCount} passes · {bookmarkCount} saved
              </span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2.5 rounded-md text-sm font-medium flex items-center gap-2.5 ${
                  isActive('/admin')
                    ? 'bg-[#722F43] text-white'
                    : 'text-[#E8E5DE]/85 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#B69A62]" />
                Admin Dashboard
              </Link>
            )}
          </nav>

          <div className="pt-3 border-t border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#E8E5DE]/80">Role Preview (Demo Mode)</span>
              <div className="flex items-center bg-[#17243A] p-0.5 rounded-lg border border-white/15">
                <button
                  onClick={() => handleRoleSwitch('student')}
                  type="button"
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    !isAdmin ? 'bg-white text-[#17243A]' : 'text-[#E8E5DE]/75'
                  }`}
                >
                  Student
                </button>
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  type="button"
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    isAdmin ? 'bg-[#722F43] text-white' : 'text-[#E8E5DE]/75'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-[#17243A] border border-white/10">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-[#B69A62]/50"
              />
              <div>
                <p className="text-sm font-medium text-[#F8F7F3]">{currentUser.name}</p>
                <p className="text-xs text-[#E8E5DE]/75">
                  {currentUser.studentId} · {isAdmin ? 'Admin Demo Mode' : 'Student Mode'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
