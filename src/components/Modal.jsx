import React from 'react'
import Button from './Button'

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children,
  onConfirm,
  confirmText = 'Add Template',
  cancelText = 'Cancel',
  showActions = true
}) {
  if (!isOpen) return null

  return (
    <div 
      className="
        fixed inset-0
        bg-black/50
        flex items-center justify-center
        z-[1000]
        animate-fade-in
      "
      onClick={onClose}
    >
      <div 
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-modal
          min-w-[350px]
          animate-slide-in
        "
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-5 text-xl text-[#333] font-semibold">{title}</h3>
        {children}
        {showActions && (
          <div className="flex gap-2.5 justify-end mt-5">
            <Button variant="primary" onClick={onConfirm}>
              {confirmText}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

