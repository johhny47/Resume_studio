import React from 'react'

const resizeHandlePositions = ['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e']

const resizeHandleStyles = {
  nw: 'top-[-6px] left-[-6px] cursor-nwse-resize',
  ne: 'top-[-6px] right-[-6px] cursor-nesw-resize',
  sw: 'bottom-[-6px] left-[-6px] cursor-nesw-resize',
  se: 'bottom-[-6px] right-[-6px] cursor-nwse-resize',
  n: 'top-[-6px] left-1/2 -translate-x-1/2 cursor-ns-resize',
  s: 'bottom-[-6px] left-1/2 -translate-x-1/2 cursor-ns-resize',
  w: 'top-1/2 left-[-6px] -translate-y-1/2 cursor-ew-resize',
  e: 'top-1/2 right-[-6px] -translate-y-1/2 cursor-ew-resize',
}

export default function CanvasElement({ 
  element, 
  isActive,
  onClick,
  onMouseDown,
  onResizeStart,
  onContentEdit,
  onDoubleClick 
}) {
  const baseStyle = {
    position: 'absolute',
    left: element.left,
    top: element.top,
    width: element.width,
    height: element.height,
    zIndex: element.zIndex || 1,
    cursor: 'move',
    border: isActive ? '2px solid #667eea' : '2px solid transparent',
    boxShadow: isActive ? '0 0 0 4px rgba(102, 126, 234, 0.2)' : 'none',
    borderRadius: '8px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    userSelect: 'none',
  }

  const renderResizeHandles = () => {
    if (!isActive) return null
    
    return resizeHandlePositions.map(pos => (
      <div
        key={pos}
        data-resize-handle={pos}
        className={`
          resize-handle
          absolute w-3 h-3 
          bg-primary 
          border-2 border-white 
          rounded-full 
          shadow-[0_2px_5px_rgba(0,0,0,0.2)] 
          block 
          z-10
          ${resizeHandleStyles[pos]}
        `}
        onMouseDown={(e) => onResizeStart(e, element, pos)}
      />
    ))
  }

  if (element.type === 'text') {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        style={{
          ...baseStyle,
          fontFamily: element.fontFamily,
          fontSize: element.fontSize,
          fontWeight: element.fontWeight,
          color: element.color,
          backgroundColor: element.backgroundColor,
          padding: '10px 16px',
          minWidth: '100px',
          minHeight: '40px',
        }}
        onClick={(e) => {
          e.stopPropagation()
          onClick(element)
        }}
        onDoubleClick={(e) => {
          e.stopPropagation()
          onDoubleClick(e, element)
        }}
        onBlur={(e) => onContentEdit(e, element)}
        onMouseDown={(e) => {
          if (document.activeElement !== e.target) {
            onMouseDown(e, element)
          }
        }}
      >
        {element.content}
        {renderResizeHandles()}
      </div>
    )
  }

  if (element.type === 'image') {
    return (
      <div
        style={{
          ...baseStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          minWidth: '100px',
          minHeight: '100px',
        }}
        onClick={(e) => {
          e.stopPropagation()
          onClick(element)
        }}
        onMouseDown={(e) => onMouseDown(e, element)}
      >
        <img 
          src={element.content} 
          alt="" 
          style={{ maxWidth: '100%', maxHeight: '100%', pointerEvents: 'none', borderRadius: '4px' }} 
        />
        {renderResizeHandles()}
      </div>
    )
  }

  // Default/rect type
  return (
    <div
      style={{
        ...baseStyle,
        ...element,
      }}
      onClick={(e) => {
        e.stopPropagation()
        onClick(element)
      }}
      onMouseDown={(e) => onMouseDown(e, element)}
    >
      {element.content}
      {renderResizeHandles()}
    </div>
  )
}

