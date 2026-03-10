import React from 'react'

const variantStyles = {
  primary: 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-0.5',
  secondary: 'bg-gradient-to-r from-secondary to-accent text-white shadow-btn-secondary hover:shadow-btn-secondary-hover hover:-translate-y-0.5',
  success: 'bg-gradient-to-r from-success to-success-light text-white shadow-btn-success hover:shadow-btn-success-hover hover:-translate-y-0.5',
  warning: 'bg-gradient-to-r from-warning to-warning-light text-white shadow-btn-warning hover:shadow-btn-warning-hover hover:-translate-y-0.5',
  danger: 'bg-gradient-to-r from-danger to-[#ee5a5a] text-white shadow-btn-danger hover:shadow-btn-danger-hover hover:-translate-y-0.5',
}

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  type = 'button',
  id,
  disabled
}) {
  return (
    <button
      type={type}
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-[18px] py-[10px]
        rounded-[10px]
        cursor-pointer
        text-[14px] font-medium
        transition-all duration-300 ease
        flex items-center gap-2
        border-none
        ${variantStyles[variant] || variantStyles.primary}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

