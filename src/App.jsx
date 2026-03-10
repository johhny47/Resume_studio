import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import templatesData from './data/templates.json'
import Swal from 'sweetalert2'
import './index.css'

// Components
import MenuBar from './components/MenuBar'
import HeightControlBar from './components/HeightControlBar'
import Canvas from './components/Canvas'
import Modal from './components/Modal'

const STORAGE_KEY = 'resumeEditor_savedTemplates'
const AUTO_SAVE_KEY = 'resumeEditor_autoSave'

function App() {
  const [elements, setElements] = useState([])
  const [activeElement, setActiveElement] = useState(null)
  const [templates] = useState(templatesData.templates)
  const [savedTemplates, setSavedTemplates] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [currentTemplateId, setCurrentTemplateId] = useState(null)
  const [canvasHeight, setCanvasHeight] = useState(() => {
    const saved = localStorage.getItem('resumeEditor_canvasHeight')
    return saved ? parseInt(saved) : 600
  })
  const [showModal, setShowModal] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
 
  const canvasRef = useRef(null)

  // Auto-save current template when elements change (for loaded saved templates)
  useEffect(() => {
    if (currentTemplateId && elements.length > 0) {
      const templateIndex = savedTemplates.findIndex(t => t.id === currentTemplateId)
      if (templateIndex !== -1) {
        const updatedTemplates = [...savedTemplates]
        updatedTemplates[templateIndex] = {
          ...updatedTemplates[templateIndex],
          elements: elements.map(el => {
            const { uniqueId, ...rest } = el
            return rest
          })
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates))
      }
    }
  }, [elements, currentTemplateId])

  // Auto-save current canvas to localStorage (for new edits)
  useEffect(() => {
    if (elements.length > 0 && !currentTemplateId) {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(elements))
    }
  }, [elements, currentTemplateId])

  // Auto-save canvas height
  useEffect(() => {
    localStorage.setItem('resumeEditor_canvasHeight', canvasHeight.toString())
  }, [canvasHeight])

  // Load auto-saved canvas on init (only once)
  useEffect(() => {
    const autoSaved = localStorage.getItem(AUTO_SAVE_KEY)
    if (autoSaved) {
      try {
        const savedElements = JSON.parse(autoSaved)
        if (savedElements && savedElements.length > 0) {
          // Don't auto-load if user has explicitly loaded a template
          // The user can clear it manually if needed
        }
      } catch (e) {
        console.error('Error loading auto-saved canvas:', e)
      }
    }
  }, [])

  // Combine built-in templates with saved templates
  const allTemplates = [
    ...templates,
    ...savedTemplates.map(t => ({ ...t, isSaved: true }))
  ]

  // Save templates to localStorage
  const saveTemplatesToStorage = (templates) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
    setSavedTemplates(templates)
  }

  // Helper functions
  const rgbToHex = (rgb) => {
    if (!rgb || rgb === 'transparent') return '#ffffff'
    if (rgb.startsWith('#')) return rgb
    const rgbMatch = rgb.match(/\d+/g)
    if (!rgbMatch) return '#000000'
    return '#' + rgbMatch.slice(0, 3).map(x => {
      const hex = parseInt(x).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  // Drag and drop handlers
  const handleDragStart = (e, element) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveElement(element)
    
    const rect = e.target.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    const elementId = element.uniqueId
    
    const handleMouseMove = (moveEvent) => {
      const canvasRect = canvasRef.current.getBoundingClientRect()
      let newLeft = moveEvent.clientX - canvasRect.left - offsetX
      let newTop = moveEvent.clientY - canvasRect.top - offsetY
      
      // Get current element to check its actual dimensions
      const currentEl = elements.find(el => el.uniqueId === elementId)
      const elWidth = currentEl ? currentEl.width : element.width
      const elHeight = currentEl ? currentEl.height : element.height
      
      newLeft = Math.max(0, Math.min(canvasRect.width - elWidth, newLeft))
      newTop = Math.max(0, Math.min(canvasRect.height - elHeight, newTop))
      
      setElements(prev => prev.map(el => 
        el.uniqueId === elementId 
          ? { ...el, left: newLeft, top: newTop }
          : el
      ))
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleResizeStart = (e, element, position) => {
    e.preventDefault()
    e.stopPropagation()
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = element.width || 100
    const startHeight = element.height || 40
    const startLeft = element.left
    const startTop = element.top
    const elementId = element.uniqueId
    
    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      
      let newWidth = startWidth
      let newHeight = startHeight
      let newLeft = startLeft
      let newTop = startTop
      
      if (position.includes('e')) {
        newWidth = Math.max(80, startWidth + deltaX)
      }
      if (position.includes('w')) {
        newWidth = Math.max(80, startWidth - deltaX)
        newLeft = startLeft + deltaX
      }
      if (position.includes('s')) {
        newHeight = Math.max(40, startHeight + deltaY)
      }
      if (position.includes('n')) {
        newHeight = Math.max(40, startHeight - deltaY)
        newTop = startTop + deltaY
      }
      
      setElements(prev => prev.map(el => 
        el.uniqueId === elementId 
          ? { ...el, width: newWidth, height: newHeight, left: newLeft, top: newTop }
          : el
      ))
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Template functions
  const loadTemplate = (templateId) => {
    const template = allTemplates.find(t => t.id === templateId)
    if (!template) return

    const newElements = template.elements.map(el => ({
      ...el,
      uniqueId: `${el.id}-${Date.now()}-${Math.random()}`
    }))
    
    setElements(newElements)
    setActiveElement(null)
    setCurrentTemplateId(template.isSaved ? templateId : null)
  }

  // Add new template - saves current canvas elements to localStorage
  const handleAddTemplate = () => {
    if (newTemplateName.trim()) {
      if (elements.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No Elements',
          text: 'Please add some elements to the canvas before saving as a template.',
          confirmButtonColor: '#667eea'
        })
        return
      }
      
      const newTemplate = {
        id: `saved-${Date.now()}`,
        name: newTemplateName.trim(),
        preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        elements: elements.map(el => {
          const { uniqueId, ...rest } = el
          return rest
        })
      }
      
      const updatedTemplates = [...savedTemplates, newTemplate]
      saveTemplatesToStorage(updatedTemplates)
      
      setNewTemplateName('')
      setShowModal(false)
      Swal.fire({
        icon: 'success',
        title: 'Template Saved!',
        text: `"${newTemplate.name}" has been saved successfully.`,
        confirmButtonColor: '#667eea',
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  // Edit saved template - update existing template
  const handleEditTemplate = (templateId) => {
    const template = savedTemplates.find(t => t.id === templateId)
    if (!template) return

    Swal.fire({
      title: 'Edit Template',
      input: 'text',
      inputLabel: 'Template Name',
      inputValue: template.name,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#667eea',
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Please enter a template name'
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedTemplates = savedTemplates.map(t => 
          t.id === templateId 
            ? { ...t, name: result.value.trim() }
            : t
        )
        saveTemplatesToStorage(updatedTemplates)
        Swal.fire({
          icon: 'success',
          title: 'Template Updated!',
          text: `Template has been updated to "${result.value}".`,
          confirmButtonColor: '#667eea',
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  // Delete saved template
  const deleteTemplate = (templateId) => {
    const updatedTemplates = savedTemplates.filter(t => t.id !== templateId)
    saveTemplatesToStorage(updatedTemplates)
  }

  // Quick save - save current canvas to the loaded template or to localStorage
  const handleQuickSave = () => {
    if (elements.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Elements',
        text: 'Add some elements to the canvas first!',
        confirmButtonColor: '#667eea'
      })
      return
    }

    // If a saved template is loaded, update that template
    if (currentTemplateId) {
      const templateIndex = savedTemplates.findIndex(t => t.id === currentTemplateId)
      if (templateIndex !== -1) {
        const updatedTemplates = [...savedTemplates]
        updatedTemplates[templateIndex] = {
          ...updatedTemplates[templateIndex],
          elements: elements.map(el => {
            const { uniqueId, ...rest } = el
            return rest
          })
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates))
        setSavedTemplates(updatedTemplates)
        
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: 'Template updated successfully!',
          confirmButtonColor: '#667eea',
          timer: 1500,
          showConfirmButton: false
        })
        return
      }
    }

    // Otherwise save to autoSave
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(elements))
    
    Swal.fire({
      icon: 'success',
      title: 'Saved!',
      text: 'Canvas saved to localStorage successfully!',
      confirmButtonColor: '#667eea',
      timer: 1500,
      showConfirmButton: false
    })
  }

  // Helper function to find free whitespace in canvas
  const findFreePosition = (width, height) => {
    const canvasWidth = 850 // Default canvas width
    const canvasH = canvasHeight
    const padding = 20 // Minimum gap between elements
    
    // If no elements exist, use default position
    if (elements.length === 0) {
      return { left: 50, top: 50 }
    }
    
    // Try to find a free space by checking each potential position
    // We'll check positions in a grid pattern
    const positions = []
    for (let top = 20; top < canvasH - height; top += 50) {
      for (let left = 20; left < canvasWidth - width; left += 50) {
        positions.push({ left, top })
      }
    }
    
    // Sort positions by distance from top-left (prefer top-left)
    positions.sort((a, b) => (a.top - b.top) || (a.left - b.left))
    
    // Check each position for overlap
    for (const pos of positions) {
      const hasOverlap = elements.some(el => {
        const elRight = (el.left || 0) + (el.width || 100)
        const elBottom = (el.top || 0) + (el.height || 40)
        const newRight = pos.left + width
        const newBottom = pos.top + height
        
        return !(pos.left >= elRight || 
                 newRight <= (el.left || 0) || 
                 pos.top >= elBottom || 
                 newBottom <= (el.top || 0))
      })
      
      if (!hasOverlap) {
        return pos
      }
    }
    
    // If no free space found, return top: 0 position
    return { left: 50, top: 0 }
  }

  // Add text element
  const addText = () => {
    const position = findFreePosition(200, 40)
    const newElement = {
      uniqueId: `text-${Date.now()}`,
      id: 'text',
      type: 'text',
      content: 'Double-click to edit',
      left: position.left,
      top: position.top,
      width: 200,
      height: 40,
      fontSize: 16,
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      color: '#333333',
      backgroundColor: 'transparent',
      textDecoration: 'none',
      textDecorationLine: 'none',
      textDecorationStyle: 'solid',
      textDecorationColor: '#333333',
      textAlign: 'left',
      shape: 'rectangle',
    }
    setElements(prev => [...prev, newElement])
  }

  // Add shape element
  const addShape = (shapeType) => {
    const defaultSizes = {
      rectangle: { width: 150, height: 100 },
      circle: { width: 120, height: 120 },
      oval: { width: 160, height: 100 },
      triangle: { width: 120, height: 100 },
    }
    const sizes = defaultSizes[shapeType] || { width: 150, height: 100 }
    const position = findFreePosition(sizes.width, sizes.height)
    
    const newElement = {
      uniqueId: `shape-${Date.now()}`,
      id: 'shape',
      type: 'shape',
      shape: shapeType,
      left: position.left,
      top: position.top,
      width: sizes.width,
      height: sizes.height,
      backgroundColor: '#667eea',
      borderColor: '#333333',
      borderWidth: 2,
      borderStyle: 'solid',
    }
    setElements(prev => [...prev, newElement])
  }

  // Add table element
  const addTable = () => {
    const position = findFreePosition(400, 200)
    const rows = 3
    const columns = 3
    
    // Generate default table data
    const tableData = []
    for (let i = 0; i < rows; i++) {
      const row = []
      for (let j = 0; j < columns; j++) {
        row.push(i === 0 ? `Header ${j + 1}` : `Cell ${i}-${j + 1}`)
      }
      tableData.push(row)
    }
    
    const newElement = {
      uniqueId: `table-${Date.now()}`,
      id: 'table',
      type: 'table',
      left: position.left,
      top: position.top,
      width: 400,
      height: 200,
      rows: rows,
      columns: columns,
      tableData: tableData,
      borderColor: '#333333',
      borderWidth: 1,
      headerBgColor: '#667eea',
      headerTextColor: '#ffffff',
      cellBgColor: '#ffffff',
      cellTextColor: '#333333',
      fontSize: 12,
      fontFamily: 'Arial, sans-serif',
    }
    setElements(prev => [...prev, newElement])
  }

  // Toggle text decoration
  const toggleTextDecoration = (decoration) => {
    if (!activeElement) return
    
    let newDecoration = 'none'
    let newDecorationLine = 'none'
    let newDecorationStyle = 'solid'
    let newDecorationColor = activeElement.color || '#333333'
    
    const currentLine = activeElement.textDecorationLine || 'none'
    const currentDecoration = activeElement.textDecoration || 'none'
    
    if (decoration === 'underline') {
      if (currentLine === 'underline') {
        newDecorationLine = 'none'
      } else {
        newDecorationLine = 'underline'
      }
    } else if (decoration === 'overline') {
      if (currentLine === 'overline') {
        newDecorationLine = 'none'
      } else {
        newDecorationLine = 'overline'
      }
    } else if (decoration === 'line-through') {
      if (currentLine === 'line-through') {
        newDecorationLine = 'none'
      } else {
        newDecorationLine = 'line-through'
      }
    }
    
    if (newDecorationLine !== 'none') {
      newDecoration = `${newDecorationLine} ${newDecorationStyle} ${newDecorationColor}`
    }
    
    updateElementStyle('textDecoration', newDecoration)
    updateElementStyle('textDecorationLine', newDecorationLine)
    updateElementStyle('textDecorationStyle', newDecorationStyle)
    updateElementStyle('textDecorationColor', newDecorationColor)
  }

  // File upload handler - supports PDF, DOC, DOCX, and images
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const fileType = file.type
    const fileName = file.name
    const fileExtension = fileName.split('.').pop().toLowerCase()
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileContent = e.target.result
      
      // Check file type and create appropriate element
      if (fileType === 'application/pdf' || fileExtension === 'pdf') {
        // Create PDF element - auto-size based on typical PDF page
        const newElement = {
          uniqueId: `pdf-${Date.now()}`,
          id: 'pdf',
          type: 'pdf',
          content: fileContent,
          fileName: fileName,
          left: 50,
          top: 50,
          width: 595, // A4 width at 72dpi
          height: 842, // A4 height at 72dpi
        }
        setElements(prev => [...prev, newElement])
        // Auto-increase canvas height for PDF
        setCanvasHeight(prev => Math.max(prev, 900))
      } else if (
        fileType === 'application/msword' || 
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileExtension === 'doc' || 
        fileExtension === 'docx'
      ) {
        // Create DOC element - display as embeddable object
        const newElement = {
          uniqueId: `doc-${Date.now()}`,
          id: 'doc',
          type: 'doc',
          content: fileContent,
          fileName: fileName,
          left: 50,
          top: 50,
          width: 300,
          height: 400,
        }
        setElements(prev => [...prev, newElement])
      } else {
        // Create image element for image files
        const position = findFreePosition(200, 150)
        const newElement = {
          uniqueId: `image-${Date.now()}`,
          id: 'image',
          type: 'image',
          content: fileContent,
          left: position.left,
          top: position.top,
          width: 200,
          height: 150
        }
        setElements(prev => [...prev, newElement])
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  // Element style updates
  const updateElementStyle = (property, value) => {
    if (!activeElement) return
    
    setElements(prev => prev.map(el => 
      el.uniqueId === activeElement.uniqueId 
        ? { ...el, [property]: value }
        : el
    ))
    
    setActiveElement(prev => ({ ...prev, [property]: value }))
  }

  // Font controls
  const changeFontSize = (delta) => {
    if (!activeElement) return
    const currentSize = activeElement.fontSize || 16
    const newSize = Math.max(8, Math.min(120, currentSize + delta))
    updateElementStyle('fontSize', newSize)
  }

  const toggleFontWeight = () => {
    if (!activeElement) return
    const newWeight = activeElement.fontWeight === 'bold' ? 'normal' : 'bold'
    updateElementStyle('fontWeight', newWeight)
  }

  const toggleFontStyle = () => {
    if (!activeElement) return
    const newStyle = activeElement.fontStyle === 'italic' ? 'normal' : 'italic'
    updateElementStyle('fontStyle', newStyle)
  }

  // Delete element
  const deleteActiveElement = () => {
    if (!activeElement) return
    setElements(prev => prev.filter(el => el.uniqueId !== activeElement.uniqueId))
    setActiveElement(null)
  }

  // Z-index controls
  const bringToFront = () => {
    if (!activeElement) return
    const maxZ = Math.max(...elements.map(el => el.zIndex || 0))
    updateElementStyle('zIndex', maxZ + 1)
  }

  const sendToBack = () => {
    if (!activeElement) return
    const minZ = Math.min(...elements.map(el => el.zIndex || 0))
    updateElementStyle('zIndex', minZ - 1)
  }

  // Click handlers
  const handleElementClick = (e, element) => {
    e.stopPropagation()
    setActiveElement(element)
  }

  const handleCanvasClick = () => {
    setActiveElement(null)
  }

  // Content editing
  const handleContentEdit = (e, element) => {
    const newContent = e.target.innerText
    setElements(prev => prev.map(el => 
      el.uniqueId === element.uniqueId 
        ? { ...el, content: newContent }
        : el
    ))
  }

  // Double click to edit text
  const handleTextDoubleClick = (e, element) => {
    e.stopPropagation()
    e.target.focus()
  }

  // Handle element resize (e.g., when PDF height changes)
  const handleElementResize = (element, newHeight) => {
    setElements(prev => prev.map(el => 
      el.uniqueId === element.uniqueId 
        ? { ...el, height: newHeight }
        : el
    ))
    // Also increase canvas height if needed
    setCanvasHeight(prev => Math.max(prev, newHeight + 100))
  }

  // Handle table cell data changes - sync to parent state
  const handleTableDataChange = (elementId, newTableData) => {
    setElements(prev => prev.map(el => 
      el.uniqueId === elementId 
        ? { ...el, tableData: newTableData }
        : el
    ))
  }

  // Handle table structure changes (rows/columns)
  const handleTableStructureChange = (elementId, changes) => {
    setElements(prev => prev.map(el => 
      el.uniqueId === elementId 
        ? { ...el, ...changes }
        : el
    ))
  }

  // Canvas height adjustment
  const adjustCanvasHeight = (delta) => {
    setCanvasHeight(prev => Math.max(400, Math.min(1200, prev + delta)))
  }

  // Export function
  const exportCanvas = async (format) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Find and hide resize handles
    const handles = canvas.querySelectorAll('.resize-handle')
    const activeElements = canvas.querySelectorAll('[style*="border: 2px solid #667eea"]')
    handles.forEach(h => h.style.display = 'none')
    activeElements.forEach(el => {
      el.style.border = '2px solid transparent'
      el.style.boxShadow = 'none'
    })

    try {
      if (format === 'png') {
        const canvasEl = await html2canvas(canvas, {
          backgroundColor: '#ffffff',
          scale: 2
        })
        const link = document.createElement('a')
        link.download = 'resume.png'
        link.href = canvasEl.toDataURL('image/png')
        link.click()
      } else if (format === 'jpg') {
        const canvasEl = await html2canvas(canvas, {
          backgroundColor: '#ffffff',
          scale: 2
        })
        const link = document.createElement('a')
        link.download = 'resume.jpg'
        link.href = canvasEl.toDataURL('image/jpeg', 0.9)
        link.click()
      } else if (format === 'pdf') {
        const canvasEl = await html2canvas(canvas, {
          backgroundColor: '#ffffff',
          scale: 2
        })
        const imgData = canvasEl.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [850, canvasHeight]
        })
        pdf.addImage(imgData, 'PNG', 0, 0, 850, canvasHeight)
        pdf.save('resume.pdf')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    }

    // Restore handles
    handles.forEach(h => h.style.display = '')
    activeElements.forEach(el => {
      el.style.border = '2px solid #667eea'
      el.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.2)'
    })
  }

  // Update form controls when active element changes
  useEffect(() => {
    if (activeElement && activeElement.type === 'text') {
      const fontFamily = activeElement.fontFamily || 'Arial, sans-serif'
      const fontSize = activeElement.fontSize || 16
      const fontWeight = activeElement.fontWeight || 'normal'
      const color = activeElement.color || '#333333'
      const bgColor = activeElement.backgroundColor || '#ffffff'
      
      const fontFamilySelect = document.getElementById('fontFamily')
      const fontWeightBtn = document.getElementById('fontWeightBtn')
      const textColorInput = document.getElementById('textColor')
      const bgColorInput = document.getElementById('bgColor')
      
      if (fontFamilySelect) fontFamilySelect.value = fontFamily
      if (fontWeightBtn) fontWeightBtn.classList.toggle('active', fontWeight === 'bold')
      if (textColorInput) textColorInput.value = rgbToHex(color) || color
      if (bgColorInput) bgColorInput.value = rgbToHex(bgColor) || bgColor
    }
  }, [activeElement])

  // Get current element values for menu bar
  const currentFontFamily = activeElement?.fontFamily || 'Arial, sans-serif'
  const currentFontSize = activeElement?.fontSize || 16
  const isBold = activeElement?.fontWeight === 'bold'
  const isItalic = activeElement?.fontStyle === 'italic'
  const textColor = activeElement?.color || '#333333'
  const bgColor = activeElement?.backgroundColor || '#ffffff'

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Menu Bar */}
      <MenuBar
        onAddText={addText}
        onAddShape={addShape}
        onAddTable={addTable}
        onImageUpload={handleImageUpload}
        onSaveCanvas={handleQuickSave}
        templates={allTemplates}
        savedTemplatesCount={savedTemplates.length}
        onSelectTemplate={loadTemplate}
        onAddNewTemplate={() => setShowModal(true)}
        onDeleteTemplate={deleteTemplate}
        onEditTemplate={handleEditTemplate}
        fontFamily={currentFontFamily}
        onFontFamilyChange={(value) => updateElementStyle('fontFamily', value)}
        fontSize={currentFontSize}
        onFontSizeChange={(value) => updateElementStyle('fontSize', value)}
        onFontSizeDecrease={() => changeFontSize(-2)}
        onFontSizeIncrease={() => changeFontSize(2)}
        isBold={isBold}
        onToggleBold={toggleFontWeight}
        isItalic={isItalic}
        onToggleItalic={toggleFontStyle}
        textColor={textColor}
        onTextColorChange={(value) => updateElementStyle('color', value)}
        bgColor={bgColor}
        onBgColorChange={(value) => updateElementStyle('backgroundColor', value)}
        onToggleTextDecoration={toggleTextDecoration}
        activeTextDecoration={activeElement?.textDecorationLine || 'none'}
        textAlign={activeElement?.textAlign || 'left'}
        onTextAlignChange={(value) => updateElementStyle('textAlign', value)}
        activeShape={activeElement?.shape || ''}
        onShapeChange={(shape) => updateElementStyle('shape', shape)}
        activeElement={activeElement}
        onBringToFront={bringToFront}
        onSendToBack={sendToBack}
        onDelete={deleteActiveElement}
        onExport={exportCanvas}
        canvasHeight={canvasHeight}
        onIncreaseCanvasHeight={() => adjustCanvasHeight(50)}
        onDecreaseCanvasHeight={() => adjustCanvasHeight(-50)}
      />
      
    
      
      {/* Modal for Adding New Template */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Template"
        onConfirm={handleAddTemplate}
        confirmText="Add Template"
        cancelText="Cancel"
      >
        <input
          type="text"
          placeholder="Enter template name"
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
          className="
            w-full
            px-4 py-3
            border-2 border-[#e0e0e0]
            rounded-[10px]
            text-[14px]
            mb-5
            outline-none
            transition-all duration-300 ease
            focus:border-primary
            focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)]
          "
          autoFocus
        />
      </Modal>
      
      {/* Canvas */}
      <Canvas 
        canvasRef={canvasRef}
        height={canvasHeight}
        elements={elements}
        activeElement={activeElement}
        onCanvasClick={handleCanvasClick}
        onElementClick={handleElementClick}
        onElementMouseDown={handleDragStart}
        onElementResizeStart={handleResizeStart}
        onElementContentEdit={handleContentEdit}
        onElementDoubleClick={handleTextDoubleClick}
        onElementResize={handleElementResize}
        onTableDataChange={handleTableDataChange}
        onTableStructureChange={handleTableStructureChange}
      />
    </div>
  )
}

export default App

