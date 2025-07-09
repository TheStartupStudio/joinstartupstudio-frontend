import React, { useRef, useEffect, useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import courseLogoXL from '../../assets/images/academy-icons/SUS OAE Logox800 1.png'
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

  const handleSave = async () => {
    if (!isCompleted) return;
    
    // Create an invisible iframe for PDF generation (same as print approach)
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '1200px';
    iframe.style.height = '800px';
    document.body.appendChild(iframe);
    
    const certificateHTML = certificateRef.current.outerHTML;
    
    iframe.contentDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate</title>
          <style>
            * {
              box-sizing: border-box;
            }
            
            body {
              margin: 0;
              padding: 20px;
              background: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              width: 1200px;
            }
            
            .certificate-wrapper {
              width: 1200px !important;
              max-width: none !important;
              min-width: 1200px !important;
              transform: none !important;
              background: white;
              padding: 2rem !important;
              box-sizing: border-box;
              margin: 0 auto;
              border-radius: 36px;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            
            .certificate-header {
              display: flex;
              align-items: center;
              gap: 1rem;
              justify-content: center;
              width: 100%;
            }
            
            .certificate-body {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            
            .course-logo {
              width: 250px !important;
              height: auto !important;
            }
            
            .title-completion {
              font-size: 47px !important;
              font-weight: bold !important;
              color: #000 !important;
              line-height: 1.1 !important;
              margin: 0 !important;
              text-align: center !important;
            }
            
            .certification-paragraph {
              font-size: 20px !important;
              text-align: center !important;
              margin-top: 1rem !important;
              margin-bottom: 0.25rem !important;
              font-weight: 500 !important;
              color: #000 !important;
            }
            
            .user-certified {
              font-size: 64px !important;
              border-bottom: 3px solid #000 !important;
              padding-bottom: 0.5rem !important;
              font-weight: bold !important;
              margin: 1.5rem 0 !important;
              text-align: center !important;
            }
            
            .certificate-reason {
              font-size: 32px !important;
              line-height: 1.15 !important;
              margin: 1rem 0 !important;
              text-align: center !important;
              width: auto !important;
            }
            
            .certification-signature {
              position: relative;
            }
            
            .signature-border {
              padding-inline: 5rem !important;
              margin-top: 0.5rem !important;
              width: auto !important;
            }
            
            .horizontal-line-sign {
              bottom: 0 !important;
              left: 0 !important;
              right: 0 !important;
              margin: 0 !important;
              border: 1px solid #000 !important;
            }
            
            .signature-border-bottom {
              border-bottom: 1px solid #aeaeae;
              width: 100%;
              bottom: -7px;
              position: absolute;
            }
          </style>
        </head>
        <body>
          ${certificateHTML}
        </body>
      </html>
    `);
    
    iframe.contentDocument.close();
    
    // Wait for content to load
    iframe.onload = async () => {
      try {
        // Wait a bit more for images and fonts to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const iframeBody = iframe.contentDocument.body;
        
        const canvas = await html2canvas(iframeBody, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 1200,
          height: iframeBody.scrollHeight,
          scrollX: 0,
          scrollY: 0,
          logging: false,
          foreignObjectRendering: false,
          imageTimeout: 15000
        });
        
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pageWidth = 297;
        const pageHeight = 210;
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const position = Math.max((pageHeight - imgHeight) / 2, 10);
        
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        pdf.save('certificate.pdf');
        
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        // Clean up iframe
        document.body.removeChild(iframe);
      }
    };
  }

  const handlePrint = () => {
    if (!isCompleted) return;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    const certificateHTML = certificateRef.current.outerHTML;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * {
              box-sizing: border-box;
            }
            
            body {
              margin: 0;
              padding: 20px;
              background: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            
            .certificate-wrapper {
              width: 1200px !important;
              max-width: none !important;
              min-width: 1200px !important;
              transform: none !important;
              page-break-inside: avoid;
              background: white;
              padding: 2rem !important;
              box-sizing: border-box;
              margin: 0 auto;
              border-radius: 36px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            
            .certificate-header {
              display: flex;
              align-items: center;
              gap: 1rem;
              justify-content: center;
              width: 100%;
            }
            
            .certificate-body {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            
            .course-logo {
              width: 250px !important;
              height: auto !important;
            }
            
            .title-completion {
              font-size: 47px !important;
              font-weight: bold !important;
              color: #000 !important;
              line-height: 1.1 !important;
              margin: 0 !important;
            }
            
            .certification-paragraph {
              font-size: 20px !important;
              text-align: center !important;
              margin-top: 1rem !important;
              margin-bottom: 0.25rem !important;
              font-weight: 500 !important;
              color: #000 !important;
            }
            
            .user-certified {
              font-size: 64px !important;
              border-bottom: 3px solid #000 !important;
              padding-bottom: 0.5rem !important;
              font-weight: bold !important;
              margin: 1.5rem 0 !important;
              text-align: center !important;
            }
            
            .certificate-reason {
              font-size: 32px !important;
              line-height: 1.15 !important;
              margin: 1rem 0 !important;
              text-align: center !important;
              width: auto !important;
            }
            
            .certification-signature {
              position: relative;
            }
            
            .signature-border {
              padding-inline: 5rem !important;
              margin-top: 0.5rem !important;
              width: auto !important;
            }
            
            .horizontal-line-sign {
              bottom: 0 !important;
              left: 0 !important;
              right: 0 !important;
              margin: 0 !important;
              border: 1px solid #000 !important;
            }
            
            .signature-border-bottom {
              border-bottom: 1px solid #aeaeae;
              width: 100%;
              bottom: -7px;
              position: absolute;
            }
            
            @page {
              size: A4 landscape;
              margin: 0;
            }
            
            @media print {
              body {
                padding: 0;
              }
              .certificate-wrapper {
                width: 100% !important;
                min-width: auto !important;
                max-width: 100% !important;
                padding: 40px !important;
              }
            }
          </style>
        </head>
        <body>
          ${certificateHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    };
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
          className={`certificate-wrapper ${!isCompleted ? 'certificate-blur' : ''}`}
          ref={certificateRef}
        >
          <div className='certificate-header'>
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

          <div className='certificate-body'>
            <p className='certification-paragraph'>
              This is to certify that
            </p>
            <h2
              className='user-certified'
            >
              {name}
            </h2>
            <p className='certification-paragraph'>
              has successfully completed
            </p>
            <p className='certificate-reason'>
              The Startup Studio's
              <br /> Course in Entrepreneurship & Innovation
            </p>
            <p className='certification-paragraph '>
              {completionDate || 'Course not completed'}
            </p>
            <div className='certification-signature'>
              <img
                className='signature-border'
                src={signature}
                alt='signature'
              />
              <hr className='horizontal-line-sign signature-border-bottom' />
            </div>
            <p className='certification-paragraph'>
              Anastasia Hall
            </p>
            <p className='certification-paragraph'>
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
