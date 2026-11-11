import React, { createContext, useContext, useState, useEffect } from 'react'
import { DEFAULT_USER } from '../services/seedData'
import { STORAGE_KEYS } from '../services/storageService'

// NOTE: Demo-only client-side role switcher for previewing Student and Admin interfaces.
// Do NOT rely on LocalStorage or client state for actual authentication or authorization.
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE)
    return saved === 'admin' ? 'admin' : 'student'
  })

  const [currentUser, setCurrentUser] = useState(DEFAULT_USER)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role)
  }, [role])

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.ACTIVE_ROLE && (e.newValue === 'student' || e.newValue === 'admin')) {
        setRole(e.newValue)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const toggleRole = () => {
    setRole((prev) => (prev === 'student' ? 'admin' : 'student'))
  }

  const setExplicitRole = (newRole) => {
    if (newRole === 'student' || newRole === 'admin') {
      setRole(newRole)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        role,
        isAdmin: role === 'admin',
        isStudent: role === 'student',
        currentUser,
        setCurrentUser,
        toggleRole,
        setExplicitRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
