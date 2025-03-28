import React, { useRef } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import courseLogoXL from '../../assets/images/academy-icons/svg/Startup-Studio-Logo.svg'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import print from '../../assets/images/academy-icons/print.png'
import save from '../../assets/images/academy-icons/save.png'
import signature from '../../assets/images/academy-icons/sign.png'

function CertificateModal({ certificate, toggleCertificate, name }) {
  const certificateRef = useRef(null)

  const handleSave = () => {
    html2canvas(certificateRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('l', 'mm', 'a4')

      const pageWidth = 297
      const pageHeight = 210
      const imgWidth = pageWidth - 20
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let position = (pageHeight - imgHeight) / 2

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      pdf.save('certificate.pdf')
    })
  }

  const handlePrint = () => {
    const printContent = certificateRef.current.innerHTML
    const originalContent = document.body.innerHTML

    document.body.innerHTML = printContent
    window.print()

    document.body.innerHTML = originalContent
    window.location.reload()
  }

  return (
    <Modal
      isOpen={certificate}
      toggle={toggleCertificate}
      className='certificate-modal'
      style={{ maxWidth: '1100px' }}
    >
      <span
        className=' cursor-pointer'
        onClick={toggleCertificate}
        style={{ zIndex: '1' }}
      >
        <img className='left-arrow-modal' src={leftArrow} alt='left' />
      </span>
      <ModalBody>
        <img src={courseLogo} alt='logo' />
        <div className='d-flex justify-content-between align-items-center mt-3'>
          <h3 className='fs-14' style={{ marginBottom: '0' }}>
            My Course Certificate
          </h3>
          <div className='d-flex gap-3'>
            <div className='d-flex gap-2 align-items-center'>
              <img src={save} alt='save' />
              <span
                className='hover-certificate cursor-pointer'
                onClick={handleSave}
              >
                Save
              </span>
            </div>
            <div className='d-flex gap-2 align-items-center'>
              <img src={print} alt='print' />
              <span
                className='hover-certificate cursor-pointer'
                onClick={handlePrint}
              >
                Print
              </span>
            </div>
          </div>
        </div>
        <div
          className='d-flex flex-column align-items-center mt-5 certificate-wrapper'
          ref={certificateRef}
        >
          <div className='d-flex gap-3 align-items-center'>
            <img
              src={courseLogoXL}
              alt='academy-logo'
              style={{ width: '250px' }}
            />
            <h1 style={{ fontSize: '47px' }}>
              CERTIFICATE OF <br />
              COMPLETION
            </h1>
          </div>

          <div className='d-flex flex-column align-items-center'>
            <p class='text-center certification-paragraph mt-5 mb-1 fw-medium text-black'>
              This is to certify that
            </p>
            <h2
              class='text-center fw-semibold border-bottom-title'
              style={{ fontSize: '64px' }}
            >
              {name}
            </h2>
            <p class='text-center certification-paragraph mb-0 fw-medium mt-1 text-black'>
              has succesfully completed
            </p>
            <p class='text-center mb-0 fw-medium certificate-reason mt-2 text-black'>
              The Startup Studio’s
              <br /> Course in Entrepreneurship & Innovation
            </p>
            <p class='text-center certification-paragraph mb-0 fw-medium mt-2 text-black'>
              on the 23rd of October, 2025.
            </p>
            <div className='position-relative'>
              <img
                className='mt-2 signature-border'
                src={signature}
                alt='signature'
              />
              <hr className='position-absolute horizontal-line-sign signature-border-bottom' />
            </div>
            <p class='text-center certification-paragraph mb-0 fw-medium mt-2 text-black'>
              Anastasia Hall
            </p>
            <p class='text-center certification-paragraph mb-0 fw-medium text-black'>
              Director of Human Development
            </p>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default CertificateModal
