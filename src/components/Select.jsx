import React from 'react'

export default function Select({ 
  id, 
  value, 
  onChange, 
  options = [], 
  className = '' 
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`
        px-4 py-[10px]
        border-2 border-[#e0e0e0]
        rounded-[10px]
        text-[14px]
        cursor-pointer
        outline-none
        transition-all duration-300 ease
        bg-white
        hover:border-primary
        focus:border-primary
        focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]
        ${className}
      `}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

