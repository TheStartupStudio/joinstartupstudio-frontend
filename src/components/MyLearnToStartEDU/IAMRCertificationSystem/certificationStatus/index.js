import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import './index.css'
import LoadingAnimation from '../loadingAnimation'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons'
import DownloadFormatModal from './downloadFormatModal'
import Certification from './Certification'

const CertificationStatus = () => {
  const { user } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)
  const [downloadFormatModal, setDownloadFormatModal] = useState(false)
  const [certificationId, setCertificationId] = useState()

  const date = new Date()
  const formattedDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  const { id } = useParams()

  //below implementation was needed because id was changing twice in the first render
  //calling getCertificationStatus twice aswell
  useEffect(() => {
    if (id !== certificationId) {
      setCertificationId(id)
      setLoading(true)
    }
    setLoading(false)
  }, [id, certificationId])


  const downloadCertificateAsPdf = () => {
    const certificate = document.querySelector('.certificate-container')
    html2canvas(certificate).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20 // Subtract 20mm for padding
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      console.log('pdfHeight', pdfHeight)
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight)
      pdf.save('certificate.pdf')
    })
  }

  const downloadCertificateAsPng = () => {
    const certificate = document.querySelector('.certificate-container')
    html2canvas(certificate).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'certificate.png'
      link.href = imgData
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  return (
    <>
      <div className="certification-status">
        {loading ? (
          <LoadingAnimation show={loading} />
        ) : (
          <>
            <div className="my-3">
              <p className="pb-0 mb-0">
                Congratulations! You have earned your Market-Ready <br />
              </p>
              <span className="d-flex">
                <p>{`Certification ${id}`}: </p>
                <p className="text-info">
                  Competitive Entry Level Employability
                </p>
              </span>
            </div>
            <div className="d-flex justify-content-end mb-3">
              <FontAwesomeIcon
                icon={faCloudDownloadAlt}
                title="Download certification"
                onClick={() => setDownloadFormatModal(true)}
                style={{
                  fontSize: '20px',
                  color: 'lightgrey',
                  cursor: 'pointer'
                }}
              />
            </div>
            <Certification
              id={id}
              user={user.user.name}
              completionDate={formattedDate}
            />
          </>
        )}
      </div>
      <DownloadFormatModal
        show={downloadFormatModal}
        onHide={() => setDownloadFormatModal(false)}
        downloadCertificateAsPdf={downloadCertificateAsPdf}
        downloadCertificateAsPng={downloadCertificateAsPng}
      />
    </>
  )
}

export default CertificationStatus
