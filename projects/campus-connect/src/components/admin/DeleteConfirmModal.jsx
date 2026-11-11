import React from 'react'
import { ConfirmModal } from '../common/ConfirmModal'

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, eventTitle }) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Campus Event"
      message={`Are you sure you want to permanently delete "${eventTitle}"? This will remove the event from the catalog and clean up all associated student registrations and saved bookmarks.`}
      confirmLabel="Delete Event"
      cancelLabel="Cancel"
      variant="danger"
    />
  )
}
