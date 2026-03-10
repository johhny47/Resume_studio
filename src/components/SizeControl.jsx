import React from 'react'
import Select from './Select'

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72]

export default function SizeControl({ 
  value = 16, 
  onChange,
  onDecrease,
  onIncrease,
  className = '' 
}) {
  const sizeOptions = fontSizes.map(size => ({
    value: size,
    label: size
  }))

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button 
        onClick={onDecrease}
        className="
          w-9 h-9
          border-2 border-[#e0e0e0]
          bg-white
          rounded-[8px]
          cursor-pointer
          text-[18px] font-semibold
          text-[#666]
          transition-all duration-300 ease
          flex items-center justify-center
          hover:border-primary
          hover:text-primary
          hover:bg-[rgba(102,126,234,0.05)]
        "
      >
        −
      </button>
      <Select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        options={sizeOptions}
        className="w-20"
      />
      <button 
        onClick={onIncrease}
        className="
          w-9 h-9
          border-2 border-[#e0e0e0]
          bg-white
          rounded-[8px]
          cursor-pointer
          text-[18px] font-semibold
          text-[#666]
          transition-all duration-300 ease
          flex items-center justify-center
          hover:border-primary
          hover:text-primary
          hover:bg-[rgba(102,126,234,0.05)]
        "
      >
        +
      </button>
    </div>
  )
}

