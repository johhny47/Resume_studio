import React from 'react'

export default function HeightControlBar({ 
  height, 
  onDecrease, 
  onIncrease,
  className = '' 
}) {
  return (
    <div className={`
      bg-gradient-to-br from-white to-[#f0f0f0]
      rounded-xl
      px-5 py-2.5
      flex items-center gap-4
      shadow-height-control
      w-fit
      ${className}
    `}>
      <span className="text-xs text-[#666] font-medium uppercase tracking-wide">Canvas Height:</span>
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
      <span className="text-sm font-medium text-[#333] min-w-[50px] text-center">{height}px</span>
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

