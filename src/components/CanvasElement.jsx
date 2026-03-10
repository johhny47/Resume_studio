import React, { useState, useEffect } from 'react'
import PdfRenderer from './PdfRenderer'

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

const generateDefaultTableData = (rows, columns) => {
  const data = []
  for (let i = 0; i < rows; i++) {
    const row = []
    for (let j = 0; j < columns; j++) {
      row.push(i === 0 ? `Header ${j + 1}` : `Cell ${i}-${j + 1}`)
    }
    data.push(row)
  }
  return data
}

export default function CanvasElement ({ 
  element, 
  isActive,
  onClick,
  onMouseDown,
  onResizeStart,
  onContentEdit,
  onDoubleClick,
  onElementResize,
  onTableDataChange,
  onTableStructureChange 
}) {
  const [tableData, setTableData] = useState(() => {
    if (element.type === 'table') {
      if (element.tableData && element.tableData.length > 0) {
        return element.tableData
      }
      return generateDefaultTableData(element.rows || 3, element.columns || 3)
    }
    return []
  })

  useEffect(() => {
    if (element.type === 'table' && element.tableData && element.tableData.length > 0) {
      setTableData(element.tableData)
    }
  }, [element.tableData])

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
        className={`resize-handle absolute w-3 h-3 bg-primary border-2 border-white rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.2)] block z-10 ${resizeHandleStyles[pos]}`}
        onMouseDown={(e) => onResizeStart(e, element, pos)}
      />
    ))
  }

  if (element.type === 'shape') {
    const getShapeStyle = () => {
      const shapeStyle = {
        backgroundColor: element.backgroundColor || '#667eea',
        border: `${element.borderWidth || 2}px ${element.borderStyle || 'solid'} ${element.borderColor || '#333333'}`,
      }
      
      switch (element.shape) {
        case 'circle':
          return { ...shapeStyle, borderRadius: '50%' }
        case 'oval':
          return { ...shapeStyle, borderRadius: '50%' }
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
          return { ...shapeStyle, borderRadius: '4px' }
      }
    }

    if (element.shape === 'triangle') {
      return (
        <div
          style={{ ...baseStyle, width: element.width, height: element.height, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={(e) => { e.stopPropagation(); onClick(element); }}
          onMouseDown={(e) => onMouseDown(e, element)}
        >
          <div style={getShapeStyle()} />
          {renderResizeHandles()}
        </div>
      )
    }

    return (
      <div
        style={{ ...baseStyle, ...getShapeStyle() }}
        onClick={(e) => { e.stopPropagation(); onClick(element); }}
        onMouseDown={(e) => onMouseDown(e, element)}
      >
        {renderResizeHandles()}
      </div>
    )
  }

  if (element.type === 'table') {
    const cellWidth = (element.width || 400) / (element.columns || 3)
    const cellHeight = (element.height || 200) / (element.rows || 3)

    const handleCellEdit = (rowIndex, colIndex, value) => {
      const newData = [...tableData]
      newData[rowIndex] = [...newData[rowIndex]]
      newData[rowIndex][colIndex] = value
      setTableData(newData)
      if (onTableDataChange) {
        onTableDataChange(element.uniqueId, newData)
      }
    }

    const handleCellInput = (rowIndex, colIndex, e) => {
      const value = e.target.innerText
      const newData = [...tableData]
      newData[rowIndex] = [...newData[rowIndex]]
      newData[rowIndex][colIndex] = value
      setTableData(newData)
      if (onTableDataChange) {
        onTableDataChange(element.uniqueId, newData)
      }
    }

    const handleAddRow = () => {
      const newData = [...tableData]
      const newRow = []
      for (let j = 0; j < (element.columns || 3); j++) {
        newRow.push(`Cell ${newData.length}-${j + 1}`)
      }
      newData.push(newRow)
      setTableData(newData)
      if (onTableStructureChange) {
        onTableStructureChange(element.uniqueId, { rows: newData.length })
      }
    }

    const handleRemoveRow = () => {
      if ((element.rows || 3) <= 1) return
      const newData = tableData.slice(0, -1)
      setTableData(newData)
      if (onTableStructureChange) {
        onTableStructureChange(element.uniqueId, { rows: newData.length })
      }
    }

    const handleAddColumn = () => {
      const newData = tableData.map((row, rowIndex) => {
        const newRow = [...row]
        newRow.push(rowIndex === 0 ? `Header ${newRow.length + 1}` : `Cell ${rowIndex}-${newRow.length + 1}`)
        return newRow
      })
      setTableData(newData)
      if (onTableStructureChange) {
        onTableStructureChange(element.uniqueId, { columns: newData[0]?.length || 3 })
      }
    }

    const handleRemoveColumn = () => {
      if ((element.columns || 3) <= 1) return
      const newData = tableData.map(row => row.slice(0, -1))
      setTableData(newData)
      if (onTableStructureChange) {
        onTableStructureChange(element.uniqueId, { columns: newData[0]?.length || 3 })
      }
    }

    return (
      <div
        style={{ ...baseStyle, border: 'none', boxShadow: isActive ? '0 0 0 4px rgba(102, 126, 234, 0.2)' : 'none' }}
        onClick={(e) => { e.stopPropagation(); onClick(element); }}
        onMouseDown={(e) => onMouseDown(e, element)}
      >
        {isActive && (
          <div className="absolute -top-10 left-0 flex gap-1 z-30" style={{ pointerEvents: 'auto' }}>
            <button onClick={(e) => { e.stopPropagation(); handleAddRow(); }} className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600" title="Add Row">+ Row</button>
            <button onClick={(e) => { e.stopPropagation(); handleRemoveRow(); }} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600" title="Remove Row">- Row</button>
            <button onClick={(e) => { e.stopPropagation(); handleAddColumn(); }} className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600" title="Add Column">+ Col</button>
            <button onClick={(e) => { e.stopPropagation(); handleRemoveColumn(); }} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600" title="Remove Column">- Col</button>
          </div>
        )}
        <table style={{ width: '100%', height: '100%',border: '3px solid #333333', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
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
    userSelect: 'text',
    cursor: 'text',
  }}
  contentEditable
  suppressContentEditableWarning
  onBlur={(e) => handleCellEdit(rowIndex, colIndex, e.target.innerText)}
  onMouseDown={(e) => e.stopPropagation()}
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
        onClick={(e) => { e.stopPropagation(); onClick(element); }}
        onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick(e, element); }}
        onBlur={(e) => onContentEdit(e, element)}
        onMouseDown={(e) => { if (document.activeElement !== e.target) { onMouseDown(e, element) } }}
      >
        {element.content}
        {renderResizeHandles()}
      </div>
    )
  }

  if (element.type === 'image') {
    return (
      <div
        style={{ ...baseStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', minWidth: '100px', minHeight: '100px' }}
        onClick={(e) => { e.stopPropagation(); onClick(element); }}
        onMouseDown={(e) => onMouseDown(e, element)}
      >
        <img src={element.content} alt="" style={{ maxWidth: '100%', maxHeight: '100%', pointerEvents: 'none', borderRadius: '4px' }} />
        {renderResizeHandles()}
      </div>
    )
  }

  if (element.type === 'pdf') {
    const handlePdfHeightChange = (newHeight) => {
      if (onElementResize && newHeight !== element.height) {
        onElementResize(element, newHeight)
      }
    }
    
    return (
      <div
        style={{ ...baseStyle, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', border: '2px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}
        onClick={(e) => { e.stopPropagation(); onClick(element); }}
        onMouseDown={(e) => onMouseDown(e, element)}
      >
        <PdfRenderer pdfData={element.content} fileName={element.fileName} width={element.width - 4} onHeightChange={handlePdfHeightChange} />
        {renderResizeHandles()}
      </div>
    )
  }

  if (element.type === 'doc') {
    return (
      <div
        style={{ ...baseStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', border: '2px solid #e0e0e0', borderRadius: '8px', padding: '20px' }}
        onClick={(e) => { e.stopPropagation(); onClick(element); }}
        onMouseDown={(e) => onMouseDown(e, element)}
      >
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>{element.fileName || 'Word Document'}</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>DOC/DOCX</div>
        {renderResizeHandles()}
      </div>
    )
  }

  return (
    <div
      style={{ ...baseStyle, ...element }}
      onClick={(e) => { e.stopPropagation(); onClick(element); }}
      onMouseDown={(e) => onMouseDown(e, element)}
    >
      {element.content}
      {renderResizeHandles()}
    </div>
  )
}

