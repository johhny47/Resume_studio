import React, { useState } from 'react'

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
  const [tableData, setTableData] = useState(() => {
    // Initialize table data with empty cells
    if (element.type === 'table') {
      const rows = []
      for (let i = 0; i < element.rows; i++) {
        const row = []
        for (let j = 0; j < element.columns; j++) {
          row.push(i === 0 ? `Header ${j + 1}` : `Cell ${i}-${j + 1}`)
        }
        rows.push(row)
      }
      return rows
    }
    return []
  })

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

  // Render shapes
  if (element.type === 'shape') {
    const getShapeStyle = () => {
      const shapeStyle = {
        backgroundColor: element.backgroundColor || '#667eea',
        border: `${element.borderWidth || 2}px ${element.borderStyle || 'solid'} ${element.borderColor || '#333333'}`,
      }
      
      switch (element.shape) {
        case 'circle':
          return {
            ...shapeStyle,
            borderRadius: '50%',
          }
        case 'oval':
          return {
            ...shapeStyle,
            borderRadius: '50%',
          }
        case 'triangle':
          return {
            ...shapeStyle,
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderLeft: `${(element.width || 120) / 2}px solid transparent`,
            borderRight: `${(element.width || 120) / 2}px solid transparent`,
            borderBottom: `${element.height || 100}px solid ${element.backgroundColor || '#667eea'}`,
            borderTop: 'none',
          }
        case 'rectangle':
        default:
          return {
            ...shapeStyle,
            borderRadius: '4px',
          }
      }
    }

    // For triangle, we need a wrapper div
    if (element.shape === 'triangle') {
      return (
        <div
          style={{
            ...baseStyle,
            width: element.width,
            height: element.height,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={(e) => {
            e.stopPropagation()
            onClick(element)
          }}
          onMouseDown={(e) => onMouseDown(e, element)}
        >
          <div style={getShapeStyle()} />
          {renderResizeHandles()}
        </div>
      )
    }

    // For oval
    if (element.shape === 'oval') {
      return (
        <div
          style={{
            ...baseStyle,
            ...getShapeStyle(),
          }}
          onClick={(e) => {
            e.stopPropagation()
            onClick(element)
          }}
          onMouseDown={(e) => onMouseDown(e, element)}
        >
          {renderResizeHandles()}
        </div>
      )
    }

    return (
      <div
        style={{
          ...baseStyle,
          ...getShapeStyle(),
        }}
        onClick={(e) => {
          e.stopPropagation()
          onClick(element)
        }}
        onMouseDown={(e) => onMouseDown(e, element)}
      >
        {renderResizeHandles()}
      </div>
    )
  }

  // Render table
  if (element.type === 'table') {
    const cellWidth = (element.width || 400) / (element.columns || 3)
    const cellHeight = (element.height || 200) / (element.rows || 3)

    const handleCellEdit = (rowIndex, colIndex, value) => {
      const newData = [...tableData]
      newData[rowIndex] = [...newData[rowIndex]]
      newData[rowIndex][colIndex] = value
      setTableData(newData)
    }

    return (
      <div
        style={{
          ...baseStyle,
          border: 'none',
          boxShadow: isActive ? '0 0 0 4px rgba(102, 126, 234, 0.2)' : 'none',
        }}
        onClick={(e) => {
          e.stopPropagation()
          onClick(element)
        }}
        onMouseDown={(e) => onMouseDown(e, element)}
      >
        <table style={{ 
          width: '100%', 
          height: '100%', 
          borderCollapse: 'collapse',
          tableLayout: 'fixed'
        }}>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      width: cellWidth,
                      height: cellHeight,
                      border: `${element.borderWidth || 1}px solid ${element.borderColor || '#333333'}`,
                      backgroundColor: rowIndex === 0 ? element.headerBgColor || '#667eea' : element.cellBgColor || '#ffffff',
                      color: rowIndex === 0 ? element.headerTextColor || '#ffffff' : element.cellTextColor || '#333333',
                      fontSize: element.fontSize || 12,
                      fontFamily: element.fontFamily || 'Arial, sans-serif',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      padding: '4px',
                    }}
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleCellEdit(rowIndex, colIndex, e.target.innerText)}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {renderResizeHandles()}
      </div>
    )
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
          fontStyle: element.fontStyle,
          color: element.color,
          backgroundColor: element.backgroundColor,
          padding: '10px 16px',
          minWidth: '100px',
          minHeight: '40px',
          textDecoration: element.textDecoration,
          textDecorationLine: element.textDecorationLine,
          textDecorationStyle: element.textDecorationStyle,
          textDecorationColor: element.textDecorationColor,
          textAlign: element.textAlign || 'left',
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

