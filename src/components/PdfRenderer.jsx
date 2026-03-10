import React, { useState, useEffect, useRef } from 'react'

export default function PdfRenderer({
  pdfData,
  fileName,
  width = 595,
  onHeightChange
}) {

  const [src, setSrc] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pdfHeight, setPdfHeight] = useState(842)
  const containerRef = useRef(null)

  useEffect(() => {

    let url = null

    const processPdf = async () => {
      try {

        setLoading(true)
        setError(null)

        if (!pdfData) return

        let pdfBlob

        if (pdfData.startsWith('data:application/pdf')) {

          const base64 = pdfData.split(',')[1]
          const binaryString = atob(base64)
          const bytes = new Uint8Array(binaryString.length)

          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }

          pdfBlob = new Blob([bytes], { type: 'application/pdf' })

        } else if (pdfData.startsWith('blob:')) {

          setSrc(pdfData)
          setLoading(false)
          return

        } else {

          const binaryString = atob(pdfData)
          const bytes = new Uint8Array(binaryString.length)

          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }

          pdfBlob = new Blob([bytes], { type: 'application/pdf' })
        }

        url = URL.createObjectURL(pdfBlob)
        setSrc(url)

        const defaultHeight = 842
        setPdfHeight(defaultHeight)

        if (onHeightChange) {
          onHeightChange(defaultHeight + 50)
        }

      } catch (err) {

        console.error('Error processing PDF:', err)
        setError(err.message)

      } finally {

        setLoading(false)

      }
    }

    processPdf()

    return () => {
      if (url) {
        URL.revokeObjectURL(url)
      }
    }

  }, [pdfData])



  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            Loading PDF...
          </div>
        </div>
      </div>
    )
  }



  if (error) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <div style={{ fontSize: '20px', marginBottom: '5px' }}>
            Cannot load PDF
          </div>

          <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>
            {fileName}
          </div>
        </div>
      </div>
    )
  }



  if (!src) {
    return null
  }



  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: pdfHeight,
        overflow: 'hidden',
        backgroundColor: '#fff',
        position: 'relative'
      }}
    >
      <iframe
        src={`${src}#toolbar=0&navpanes=0&scrollbar=0&view=FitV`}
        style={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        title={fileName || 'PDF Viewer'}
      />
    </div>
  )

}