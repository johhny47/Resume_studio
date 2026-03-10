import React from 'react'
import CanvasElement from './CanvasElement'

export default function Canvas({ 
  canvasRef, 
  height, 
  elements, 
  activeElement,
  onCanvasClick,
  onElementClick,
  onElementMouseDown,
  onElementResizeStart,
  onElementContentEdit,
  onElementDoubleClick 
}) {
  return (
    <div className="flex justify-center">
      <div 
        id="canvas"
        ref={canvasRef}
        onClick={onCanvasClick}
        style={{ 
          height: height,
          width: '850px',
          background: 'white',
          borderRadius: '16px',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(circle, #e0e0e0 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {elements.length === 0 && (
          <div 
            className="
              absolute 
              top-1/2 left-1/2 
              -translate-x-1/2 -translate-y-1/2 
              text-[#999] 
              text-lg 
              text-center 
              pointer-events-none
            "
          >
            Click "Add Text", "Upload Image", or choose a "Resume Template" to start!
          </div>
        )}
        {elements.map(element => (
          <CanvasElement
            key={element.uniqueId}
            element={element}
            isActive={activeElement?.uniqueId === element.uniqueId}
            onClick={onElementClick}
            onMouseDown={onElementMouseDown}
            onResizeStart={onElementResizeStart}
            onContentEdit={onElementContentEdit}
            onDoubleClick={onElementDoubleClick}
          />
        ))}
      </div>
    </div>
  )
}

