import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      {/* Accessible toast notification container */}
      <div
        role="status"
        aria-live="polite"
        className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success'
          const isError = toast.type === 'error'
          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-modal bg-white text-[#25282D] border border-[#E8E5DE] transition-all duration-150"
            >
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#52745C] shrink-0 mt-0.5" />}
              {isError && <AlertCircle className="w-5 h-5 text-[#A34C4C] shrink-0 mt-0.5" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-[#17243A] shrink-0 mt-0.5" />}

              <div className="flex-1 text-sm font-medium leading-snug">
                {toast.message}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                type="button"
                className="text-[#737780] hover:text-[#17243A] shrink-0 p-0.5 rounded transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
