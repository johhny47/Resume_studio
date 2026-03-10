import React from 'react'

const variantStyles = {
  primary: 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-btn-primary hover:shadow-btn-primary-hover hover:-translate-y-0.5',
  secondary: 'bg-gradient-to-r from-secondary to-accent text-white shadow-btn-secondary hover:shadow-btn-secondary-hover hover:-translate-y-0.5',
  success: 'bg-gradient-to-r from-success to-success-light text-white shadow-btn-success hover:shadow-btn-success-hover hover:-translate-y-0.5',
  warning: 'bg-gradient-to-r from-warning to-warning-light text-white shadow-btn-warning hover:shadow-btn-warning-hover hover:-translate-y-0.5',
  danger: 'bg-gradient-to-r from-danger to-[#ee5a5a] text-white shadow-btn-danger hover:shadow-btn-danger-hover hover:-translate-y-0.5',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-gray-200',
  icon: 'bg-white text-gray-700 hover:bg-primary hover:text-white border border-gray-200 shadow-sm hover:shadow-md',
}

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick,
  type = 'button',
  id,
  disabled,
  icon: Icon,
  iconOnly = false,
  size = 'md',
  title,
}) {
  const sizeClasses = {
    sm: iconOnly ? 'w-8 h-8 p-1' : 'px-3 py-1.5 text-xs',
    md: iconOnly ? 'w-10 h-10 p-2' : 'px-4 py-2 text-sm',
    lg: iconOnly ? 'w-12 h-12 p-2.5' : 'px-5 py-2.5 text-base',
  }

  return (
    <button
      type={type}
      id={id}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        rounded-xl
        cursor-pointer
        font-medium
        transition-all duration-300 ease
        flex items-center justify-center gap-2
        border-none
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${iconOnly ? 'rounded-lg' : ''}
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'}
      `}
    >
      {Icon && <Icon size={iconOnly ? (size === 'sm' ? 16 : size === 'lg' ? 24 : 20) : 16} strokeWidth={2.5} />}
      {!iconOnly && children}
    </button>
  )
}

