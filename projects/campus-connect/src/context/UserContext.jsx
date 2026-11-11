import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { storageService, STORAGE_KEYS, SYNC_EVENT_NAME } from '../services/storageService'
import { useToast } from './ToastContext'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState([])
  const [registrations, setRegistrations] = useState([])
  const { showToast } = useToast()

  const refreshUserData = useCallback(() => {
    try {
      const bMarks = storageService.getBookmarks()
      const regs = storageService.getUserRegistrations()
      setBookmarks(bMarks)
      setRegistrations(regs)
    } catch (err) {
      console.error('Failed to load user state:', err)
    }
  }, [])

  useEffect(() => {
    refreshUserData()
  }, [refreshUserData])

  // Automatically sync when storage changes locally or across tabs
  useEffect(() => {
    const handleSync = () => {
      refreshUserData()
    }
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEYS.BOOKMARKS || e.key === STORAGE_KEYS.REGISTRATIONS) {
        refreshUserData()
      }
    }
    window.addEventListener(SYNC_EVENT_NAME, handleSync)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener(SYNC_EVENT_NAME, handleSync)
      window.removeEventListener('storage', handleStorage)
    }
  }, [refreshUserData])

  const toggleBookmark = useCallback(
    (eventId, eventTitle = 'Event') => {
      const res = storageService.toggleBookmark(eventId)
      setBookmarks(res.bookmarks)
      if (res.isBookmarked) {
        showToast(`Saved "${eventTitle}" to your bookmarks.`, 'success')
      } else {
        showToast(`Removed "${eventTitle}" from bookmarks.`, 'info')
      }
      return res.isBookmarked
    },
    [showToast]
  )

  const isBookmarked = useCallback(
    (eventId) => bookmarks.includes(eventId),
    [bookmarks]
  )

  const getRegistrationForEvent = useCallback(
    (eventId) => registrations.find((r) => r.eventId === eventId) || null,
    [registrations]
  )

  const isRegistered = useCallback(
    (eventId) => registrations.some((r) => r.eventId === eventId),
    [registrations]
  )

  return (
    <UserContext.Provider
      value={{
        bookmarks,
        registrations,
        toggleBookmark,
        isBookmarked,
        isRegistered,
        getRegistrationForEvent,
        refreshUserData
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
