import React from 'react'

export default function ColorPicker({ 
  id, 
  value = '#333333', 
  onChange, 
  className = '' 
}) {
  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <input 
        type="color" 
        id={id} 
        value={value}
        onChange={onChange}
        className="
          w-[44px] h-10
          border-none
          rounded-[10px]
          cursor-pointer
          p-0
          overflow-hidden
        "
      />
    </div>
  )
}

