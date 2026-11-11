import React, { useEffect } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger' // 'danger' | 'primary'
}) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isDanger = variant === 'danger'

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-[#17243A]/55 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className="relative bg-white w-full max-w-md rounded-xl shadow-modal border border-[#E8E5DE] p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md text-[#737780] hover:text-[#17243A] hover:bg-[#F8F7F3] transition-colors"
          aria-label="Close confirmation dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4 pr-6">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
              isDanger
                ? 'bg-[#FBF2F2] text-[#A34C4C] border-[#ECD2D2]'
                : 'bg-[#F9F5EB] text-[#722F43] border-[#E6DAC0]'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h3 id="confirm-modal-title" className="font-serif text-lg font-normal text-[#17243A]">
              {title}
            </h3>
            <p className="text-xs text-[#737780] leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#E8E5DE]">
          <button type="button" onClick={onClose} className="btn-secondary py-2 px-4 text-xs">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={isDanger ? 'btn-danger py-2 px-4 text-xs' : 'btn-primary py-2 px-4 text-xs'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
