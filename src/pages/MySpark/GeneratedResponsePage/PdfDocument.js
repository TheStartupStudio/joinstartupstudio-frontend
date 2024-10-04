import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const PDFDocument = ({ archivedDocument }) => {
  const generatePDF = () => {
    const input = document.getElementById('pdf-content')
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${archivedDocument?.title}.pdf`)
    })
  }

  return (
    <>
      <div
        id='pdf-content'
        style={{ backgroundColor: '#E4E4E4', padding: '10px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ margin: '10px', padding: '10px', flexGrow: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {archivedDocument?.widgetName?.toUpperCase()}
            </p>
          </div>
          <div style={{ margin: '10px', padding: '10px', flexGrow: 1 }}>
            <p>{archivedDocument?.title}</p>
          </div>
        </div>
        <div
          style={{ margin: '10px', padding: '10px', backgroundColor: '#fff' }}
        >
          {archivedDocument?.type !== 'image' && (
            <div
              dangerouslySetInnerHTML={{ __html: archivedDocument?.myContent }}
            />
          )}
          {archivedDocument?.type === 'image' && (
            <div style={{ textAlign: 'center' }}>
              <img
                src={archivedDocument?.imageUrl}
                alt={archivedDocument?.name}
                style={{
                  width: '100%',
                  maxWidth: '600px',
                  height: 'auto'
                }}
              />
            </div>
          )}
        </div>
      </div>
      <button onClick={generatePDF}>Download PDF</button>
    </>
  )
}

export default PDFDocument
