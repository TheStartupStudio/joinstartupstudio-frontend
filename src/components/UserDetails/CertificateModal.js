import React, { useRef, useEffect, useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import courseLogoXL from '../../assets/images/academy-icons/svg/Startup-Studio-Logo.svg'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import print from '../../assets/images/academy-icons/print.png'
import save from '../../assets/images/academy-icons/save.png'
import signature from '../../assets/images/academy-icons/sign.png'
import { useDispatch, useSelector } from 'react-redux'
import './CertificateResponsive.css'

function CertificateModal({ certificate, toggleCertificate, name }) {
  const certificateRef = useRef(null)
  const dispatch = useDispatch()
  const [completionDate, setCompletionDate] = useState('')

  const { finishedContent, levelProgress, loading, totalProgress } = useSelector(
    (state) => state.course
  );

  const isCompleted = totalProgress === 100;

  useEffect(() => {
    if (totalProgress === 100) {
      const date = new Date();
      const formattedDate = formatCompletionDate(date);
      setCompletionDate(formattedDate);
    }
  }, [totalProgress]);

  const formatCompletionDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    // Add ordinal suffix to day
    const ordinal = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd'; 
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `on the ${day}${ordinal(day)} of ${month}, ${year}`;
  };

  const handleSave = () => {
    if (!isCompleted) return;
    
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
    if (!isCompleted) return;

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
      <span className='cursor-pointer' onClick={toggleCertificate} style={{ zIndex: '1' }}>
        <img className='left-arrow-modal' src={leftArrow} alt='left' />
      </span>
      <ModalBody>
        <img src={courseLogo} alt='logo' />
        <div className='d-flex justify-content-between align-items-center mt-3'>
          <h3 className='fs-14' style={{ marginBottom: '0' }}>
            My Course Certificate {!isCompleted && '(Course not completed)'}
          </h3>
          <div className='d-flex gap-3'>
            <div className='d-flex gap-2 align-items-center'>
              <img src={save} alt='save' style={{ opacity: isCompleted ? 1 : 0.5 }} />
              <span
                className={`hover-certificate ${isCompleted ? 'cursor-pointer' : 'text-muted'}`}
                onClick={handleSave}
                style={{ opacity: isCompleted ? 1 : 0.5 }}
              >
                Save
              </span>
            </div>
            <div className='d-flex gap-2 align-items-center'>
              <img src={print} alt='print' style={{ opacity: isCompleted ? 1 : 0.5 }} />
              <span
                className={`hover-certificate ${isCompleted ? 'cursor-pointer' : 'text-muted'}`}
                onClick={handlePrint}
                style={{ opacity: isCompleted ? 1 : 0.5 }}
              >
                Print
              </span>
            </div>
          </div>
        </div>
        <div
          className={`d-flex flex-column align-items-center mt-5 certificate-wrapper ${!isCompleted ? 'certificate-blur' : ''}`}
          ref={certificateRef}
        >
          <div className='d-flex gap-3 align-items-center'>
            <img
              src={courseLogoXL}
              alt='academy-logo'
             className='course-logo'
            />
            <h1 className='title-completion'>
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
              className='user-certified'
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
              {completionDate || 'Course not completed'}
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
        {!isCompleted && (
          <div className="text-center mt-3 text-danger">
            Complete the course (Current Total Progress: {totalProgress}%) to unlock your certificate
          </div>
        )}
      </ModalBody>
    </Modal>
  )
}

export default CertificateModal
