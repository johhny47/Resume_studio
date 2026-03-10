import React, { useState } from 'react'
import Button from './Button'
import Select from './Select'
import SizeControl from './SizeControl'
import ColorPicker from './ColorPicker'
import TemplateDropdown from './TemplateDropdown'
import ExportDropdown from './ExportDropdown'
import { 
  Type, 
  Square, 
  Circle, 
  Triangle, 
  Table, 
  Image, 
  Save, 
  Trash2,
  Download,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Palette,
  PaintBucket,
  MoveUp,
  MoveDown,
  Minus,
  Plus,
  LayoutTemplate
} from 'lucide-react'

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

const shapes = [
  { value: "rectangle", label: "Rectangle", icon: Square },
  { value: "circle", label: "Circle", icon: Circle },
  { value: "oval", label: "Oval", icon: Circle },
  { value: "triangle", label: "Triangle", icon: Triangle },
]

export default function MenuBar({
  onAddText,
  onAddShape,
  onAddTable,
  onImageUpload,
  onSaveCanvas,
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
  isItalic,
  onToggleItalic,
  textColor,
  onTextColorChange,
  bgColor,
  onBgColorChange,
  onToggleTextDecoration,
  activeTextDecoration,
  textAlign,
  onTextAlignChange,
  activeShape,
  onShapeChange,
  activeElement,
  onBringToFront,
  onSendToBack,
  onDelete,
  onExport,
  canvasHeight,
  onIncreaseCanvasHeight,
  onDecreaseCanvasHeight,
}) {
  const [showShapeMenu, setShowShapeMenu] = useState(false)
  const showTextDecorations = activeElement?.type === 'text'
  const showShapeControls = activeElement?.type === 'shape'
  
  return (
    <div className="
      bg-gradient-to-br from-white to-[#f5f5f5]
      rounded-2xl
      p-4
      shadow-menu
      mb-6
      border border-gray-100
    ">
      {/* Row 1: Main Actions */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-gray-200">
        {/* Logo */}
        <div className="
          text-xl font-bold
          bg-gradient-to-r from-primary to-purple-600
          bg-clip-text text-transparent
          pr-4
          border-r-2 border-gray-200
          mr-2
          flex items-center gap-2
        ">
          <LayoutTemplate className="w-6 h-6 text-primary" />
          Resume Studio
        </div>
        
        {/* Add Text Button */}
        <Button 
          variant="primary" 
          onClick={onAddText}
          icon={Type}
          iconOnly={false}
          title="Add Text"
        >
          Text
        </Button>
        
        {/* Shape Dropdown */}
        <div className="relative">
          <Button 
            variant="secondary" 
            onClick={() => setShowShapeMenu(!showShapeMenu)}
            icon={Square}
            iconOnly={false}
            title="Add Shape"
          >
            Shapes
          </Button>
          {showShapeMenu && (
            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 min-w-[180px] overflow-hidden">
              <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Basic Shapes</div>
              {shapes.map((shape, index) => (
                <button
                  key={shape.value}
                  className="w-full px-4 py-2.5 text-left hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 flex items-center gap-3 transition-all border-b border-gray-50 last:border-0"
                  onClick={() => { onAddShape(shape.value); setShowShapeMenu(false) }}
                >
                  <shape.icon className="w-5 h-5 text-primary" />
                  <span className="font-medium text-gray-700">{shape.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Add Table Button */}
        <Button 
          variant="secondary" 
          onClick={onAddTable}
          icon={Table}
          iconOnly={false}
          title="Add Table"
        >
          Table
        </Button>
        
        {/* Upload Image Button */}
        <Button 
          variant="secondary" 
          onClick={() => document.getElementById('imageInput').click()}
          icon={Image}
          iconOnly={false}
          title="Upload Image"
        >
          Upload
        </Button>
        <input type="file" id="imageInput" accept="image/*" onChange={onImageUpload} className="hidden" />
        
        {/* Save Canvas Button */}
        <Button 
          variant="success" 
          onClick={onSaveCanvas}
          icon={Save}
          iconOnly={false}
          title="Save Canvas"
        >
          Save
        </Button>
        
        {/* Template Dropdown */}
        <TemplateDropdown 
          templates={templates}
          onSelectTemplate={onSelectTemplate}
          onAddNew={onAddNewTemplate}
          onDeleteTemplate={onDeleteTemplate}
          onEditTemplate={onEditTemplate}
        />
        
        {/* Delete Button */}
        <Button 
          variant="danger" 
          onClick={onDelete}
          icon={Trash2}
          iconOnly={true}
          size="md"
          title="Delete Element"
        />
        
        {/* Export Dropdown */}
        <ExportDropdown onExport={onExport} />
      </div>
      
      {/* Row 2: Styling Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Text Alignment */}
        <div className="flex items-center gap-0.5 bg-white rounded-lg px-1 py-0.5 border border-gray-200 shadow-sm h-8">
          <Button
            variant={textAlign === 'left' ? 'primary' : 'ghost'}
            icon={AlignLeft}
            iconOnly={true}
            size="sm"
            onClick={() => onTextAlignChange('left')}
            title="Align Left"
          />
          <Button
            variant={textAlign === 'center' ? 'primary' : 'ghost'}
            icon={AlignCenter}
            iconOnly={true}
            size="sm"
            onClick={() => onTextAlignChange('center')}
            title="Align Center"
          />
          <Button
            variant={textAlign === 'right' ? 'primary' : 'ghost'}
            icon={AlignRight}
            iconOnly={true}
            size="sm"
            onClick={() => onTextAlignChange('right')}
            title="Align Right"
          />
        </div>
        
        {/* Font Family */}
        <div className="flex items-center gap-1 h-8">
          <Select 
            id="fontFamily"
            value={fontFamily}
            onChange={(e) => onFontFamilyChange(e.target.value)}
            options={fontFamilies}
            className="w-[120px] text-xs"
          />
        </div>
        
        {/* Font Size */}
        <div className="flex items-center gap-1 h-8">
          <SizeControl
            value={fontSize}
            onChange={onFontSizeChange}
            onDecrease={onFontSizeDecrease}
            onIncrease={onFontSizeIncrease}
          />
        </div>
        
        {/* Font Weight */}
        <Button
          variant={isBold ? 'primary' : 'ghost'}
          icon={Bold}
          iconOnly={true}
          size="sm"
          onClick={onToggleBold}
          title="Bold"
        />
        
        {/* Italic */}
        <Button
          variant={isItalic ? 'primary' : 'ghost'}
          icon={Italic}
          iconOnly={true}
          size="sm"
          onClick={onToggleItalic}
          title="Italic"
        />
        
        {/* Text Decoration Controls - Show only for text elements */}
        {showTextDecorations && (
          <div className="flex items-center gap-0.5 bg-white rounded-lg px-1 py-0.5 border border-gray-200 shadow-sm h-8">
            <Button
              variant={activeTextDecoration === 'underline' ? 'primary' : 'ghost'}
              icon={Underline}
              iconOnly={true}
              size="sm"
              onClick={() => onToggleTextDecoration('underline')}
              title="Underline"
            />
            <Button
              variant={activeTextDecoration === 'line-through' ? 'primary' : 'ghost'}
              icon={Strikethrough}
              iconOnly={true}
              size="sm"
              onClick={() => onToggleTextDecoration('line-through')}
              title="Strikethrough"
            />
          </div>
        )}
        
        {/* Text Color */}
        <div className="flex items-center gap-1 h-8">
          <ColorPicker 
            id="textColor"
            value={textColor}
            onChange={(e) => onTextColorChange(e.target.value)}
          />
        </div>
        
        {/* Background Color */}
        <div className="flex items-center gap-1 h-8">
          <ColorPicker 
            id="bgColor"
            value={bgColor}
            onChange={(e) => onBgColorChange(e.target.value)}
          />
        </div>
        
        {/* Shape Controls - Show only for shape elements */}
        {showShapeControls && (
          <div className="flex items-center gap-1 h-8">
            <span className="text-xs text-gray-500 font-medium">Shape</span>
            <div className="flex items-center gap-0.5 bg-white rounded-lg px-1 py-0.5 border border-gray-200 shadow-sm">
              {shapes.map(shape => (
                <Button
                  key={shape.value}
                  variant={activeShape === shape.value ? 'primary' : 'ghost'}
                  icon={shape.icon}
                  iconOnly={true}
                  size="sm"
                  onClick={() => onShapeChange(shape.value)}
                  title={shape.label}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Z-Index Controls */}
        <div className="flex items-center gap-0.5 bg-white rounded-lg px-1 py-0.5 border border-gray-200 shadow-sm h-8">
          <Button
            variant="ghost"
            icon={MoveUp}
            iconOnly={true}
            size="sm"
            onClick={onBringToFront}
            title="Bring to Front"
          />
          <Button
            variant="ghost"
            icon={MoveDown}
            iconOnly={true}
            size="sm"
            onClick={onSendToBack}
            title="Send to Back"
          />
        </div>

        {/* Canvas Height */}
        <div className="flex items-center gap-1 h-8">
          <span className="text-xs text-gray-500 font-medium">H</span>
          <div className="flex items-center gap-0.5 bg-white rounded-lg px-1 py-0.5 border border-gray-200 shadow-sm">
            <Button
              variant="ghost"
              icon={Minus}
              iconOnly={true}
              size="sm"
              onClick={onDecreaseCanvasHeight}
              title="Decrease Height"
            />
            <span className="text-xs text-gray-600 font-semibold min-w-[30px] text-center">{canvasHeight}</span>
            <Button
              variant="ghost"
              icon={Plus}
              iconOnly={true}
              size="sm"
              onClick={onIncreaseCanvasHeight}
              title="Increase Height"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

