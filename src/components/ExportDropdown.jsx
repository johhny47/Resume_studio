import React from 'react'

export default function ExportDropdown({ onExport }) {
  const exportOptions = [
    { format: 'png', icon: '🖼️', label: 'Export as PNG' },
    { format: 'jpg', icon: '📷', label: 'Export as JPG' },
    { format: 'pdf', icon: '📄', label: 'Export as PDF' },
  ]

  return (
    <div className="relative group">
      <button className="btn btn-success px-[18px] py-[10px] rounded-[10px] cursor-pointer text-[14px] font-medium transition-all duration-300 ease flex items-center gap-2 border-none bg-gradient-to-r from-success to-success-light text-white shadow-btn-success hover:shadow-btn-success-hover hover:-translate-y-0.5">
        <span>📥</span> Export
      </button>
      <div className="
        absolute top-full left-0 
        mt-2 
        bg-white 
        rounded-xl 
        shadow-menu 
        overflow-hidden 
        hidden 
        group-hover:block 
        z-[100] 
        min-w-[150px]
      ">
        {exportOptions.map(option => (
          <div 
            key={option.format}
            className="
              p-3 
              cursor-pointer 
              transition-all duration-200 ease 
              flex 
              items-center 
              gap-2.5 
              text-[14px]
              hover:bg-gradient-to-r hover:from-primary hover:to-primary-dark hover:text-white
            "
            onClick={() => onExport(option.format)}
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

