import React from 'react'
import Button from './Button'
import Select from './Select'
import SizeControl from './SizeControl'
import ColorPicker from './ColorPicker'
import TemplateDropdown from './TemplateDropdown'
import ExportDropdown from './ExportDropdown'

const fontFamilies = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "'Times New Roman', serif", label: "Times New Roman" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Courier New', monospace", label: "Courier New" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Comic Sans MS', cursive", label: "Comic Sans" },
  { value: "'Lucida Console', monospace", label: "Lucida Console" },
]

export default function MenuBar({
  onAddText,
  onImageUpload,
  templates,
  savedTemplatesCount,
  onSelectTemplate,
  onAddNewTemplate,
  onDeleteTemplate,
  onEditTemplate,
  fontFamily,
  onFontFamilyChange,
  fontSize,
  onFontSizeChange,
  onFontSizeDecrease,
  onFontSizeIncrease,
  isBold,
  onToggleBold,
  textColor,
  onTextColorChange,
  bgColor,
  onBgColorChange,
  onBringToFront,
  onSendToBack,
  onDelete,
  onExport,
}) {
  return (
    <div className="
      bg-gradient-to-br from-white to-[#f0f0f0]
      rounded-2xl
      p-4 lg:p-6
      flex flex-wrap items-center gap-4
      shadow-menu
      mb-6
    ">
      {/* Logo */}
      <div className="
        text-2xl font-semibold
        bg-gradient-to-r from-primary to-primary-dark
        bg-clip-text text-transparent
        pr-4
        border-r-2 border-[#e0e0e0]
      ">
        ✨ Resume Studio
      </div>
      
      {/* Add Text Button */}
      <Button variant="primary" onClick={onAddText}>
        <span>T</span> Add Text
      </Button>
      
      {/* Upload Image Button */}
      <Button variant="secondary" onClick={() => document.getElementById('imageInput').click()}>
        <span>🖼️</span> Upload Image
      </Button>
      <input type="file" id="imageInput" accept="image/*" onChange={onImageUpload} className="hidden" />
      
      {/* Template Dropdown */}
      <TemplateDropdown 
        templates={templates}
        onSelectTemplate={onSelectTemplate}
        onAddNew={onAddNewTemplate}
        onDeleteTemplate={onDeleteTemplate}
        onEditTemplate={onEditTemplate}
      />
      
      {/* Divider */}
      <div className="w-[2px] h-10 bg-[#e0e0e0] hidden lg:block"></div>
      
      {/* Font Family */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#666] font-medium uppercase tracking-wide">Font</span>
        <Select 
          id="fontFamily"
          value={fontFamily}
          onChange={(e) => onFontFamilyChange(e.target.value)}
          options={fontFamilies}
        />
      </div>
      
      {/* Font Size */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#666] font-medium uppercase tracking-wide">Size</span>
        <SizeControl
          value={fontSize}
          onChange={onFontSizeChange}
          onDecrease={onFontSizeDecrease}
          onIncrease={onFontSizeIncrease}
        />
      </div>
      
      {/* Font Weight */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#666] font-medium uppercase tracking-wide">Weight</span>
        <button 
          id="fontWeightBtn"
          onClick={onToggleBold}
          className={`
            px-4 py-[10px]
            border-2 border-[#e0e0e0]
            bg-white
            rounded-[10px]
            cursor-pointer
            text-[14px] font-semibold
            transition-all duration-300 ease
            ${isBold 
              ? 'bg-gradient-to-r from-primary to-primary-dark text-white border-transparent' 
              : 'hover:border-primary'
            }
          `}
        >
          Bold
        </button>
      </div>
      
      {/* Divider */}
      <div className="w-[2px] h-10 bg-[#e0e0e0] hidden lg:block"></div>
      
      {/* Text Color */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#666] font-medium uppercase tracking-wide">Text</span>
        <ColorPicker 
          id="textColor"
          value={textColor}
          onChange={(e) => onTextColorChange(e.target.value)}
        />
      </div>
      
      {/* Background Color */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#666] font-medium uppercase tracking-wide">Background</span>
        <ColorPicker 
          id="bgColor"
          value={bgColor}
          onChange={(e) => onBgColorChange(e.target.value)}
        />
      </div>
      
      {/* Divider */}
      <div className="w-[2px] h-10 bg-[#e0e0e0] hidden lg:block"></div>
      
      {/* Z-Index Controls */}
      <div className="flex gap-1">
        <button 
          className="
            px-3 py-2
            border-2 border-[#e0e0e0]
            bg-white
            rounded-lg
            cursor-pointer
            text-xs
            transition-all duration-300 ease
            hover:border-primary
            hover:bg-[rgba(102,126,234,0.05)]
          "
          onClick={onBringToFront}
        >
          ↑ Front
        </button>
        <button 
          className="
            px-3 py-2
            border-2 border-[#e0e0e0]
            bg-white
            rounded-lg
            cursor-pointer
            text-xs
            transition-all duration-300 ease
            hover:border-primary
            hover:bg-[rgba(102,126,234,0.05)]
          "
          onClick={onSendToBack}
        >
          ↓ Back
        </button>
      </div>
      
      {/* Divider */}
      <div className="w-[2px] h-10 bg-[#e0e0e0] hidden lg:block"></div>
      
      {/* Delete Button */}
      <Button variant="danger" onClick={onDelete}>
        🗑️ Delete
      </Button>
      
      {/* Divider */}
      <div className="w-[2px] h-10 bg-[#e0e0e0] hidden lg:block"></div>
      
      {/* Export Dropdown */}
      <ExportDropdown onExport={onExport} />
    </div>
  )
}

