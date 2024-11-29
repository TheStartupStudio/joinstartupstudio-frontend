import jsPDF from 'jspdf'
import { useState } from 'react'
import LtsButton from '../../components/LTSButtons/LTSButton'

const PdfDownloadButton = ({
  archivedDocument,
  myContentDisplayed,
  buttonComponent
}) => {
  const [loading, setLoading] = useState(false)

  const generatePdf = () => {
    setLoading(true)
    const doc = new jsPDF()

    doc.text(20, 20, archivedDocument?.widgetName || 'Document Title')

    if (archivedDocument?.content) {
      doc.text(20, 30, archivedDocument.content)
    }

    doc.save(`${archivedDocument?.widgetName}.pdf`)
    setLoading(false)
  }

  return <div className='w-100 d-flex'>{buttonComponent}</div>
}

export default PdfDownloadButton
