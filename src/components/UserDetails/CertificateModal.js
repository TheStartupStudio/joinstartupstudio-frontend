import React, { useRef, useEffect, useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import axiosInstance from '../../utils/AxiosInstance'
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
  const certificateRef = useRef(null) // For modal display
  const hiddenCertificateRef = useRef(null) // For PDF generation
  const dispatch = useDispatch()
  const [completionDate, setCompletionDate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false);

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

  // Certificate component for PDF generation (fixed size)
  const HiddenCertificate = () => (
    <div
      ref={hiddenCertificateRef}
      style={{
        position: 'absolute',
        top: '-9999px',
        left: '-9999px',
        width: '1200px',
        height: '900px',
        padding: '2rem',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <img
          src={courseLogoXL}
          alt='academy-logo'
          style={{
            width: '250px',
            height: 'auto'
          }}
        />
        <h1 style={{
          fontSize: '47px',
          fontWeight: 'bold',
          color: '#000000',
          textAlign: 'center',
          lineHeight: '1.2',
          margin: '0'
        }}>
          CERTIFICATE OF <br />
          COMPLETION
        </h1>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
      }}>
        <p style={{
          fontSize: '20px',
          textAlign: 'center',
          margin: '0.2rem 0rem 0.2rem 0rem',
          fontWeight: 'medium',
          color: '#000000'
        }}>
          This is to certify that
        </p>
        <h2 style={{
          fontSize: '64px',
          borderBottom: '3px solid #000',
          paddingBottom: '0.5rem',
          fontWeight: 'bold',
          color: '#000000',
          textAlign: 'center'
        }}>
          {name}
        </h2>
        <p style={{
          fontSize: '20px',
          textAlign: 'center',
          margin: '0.2rem 0rem 0.2rem 0rem',
          fontWeight: 'medium',
          color: '#000000'
        }}>
          has successfully completed
        </p>
        <p style={{
          fontSize: '32px',
          lineHeight: '1.15',
          margin: '1rem 0',
          textAlign: 'center',
          color: '#000000'
        }}>
          The Startup Studio's
          <br /> Course in Entrepreneurship & Innovation
        </p>
        <p style={{
          fontSize: '20px',
          textAlign: 'center',
          margin: '0.2rem 0',
          fontWeight: 'medium',
          color: '#000000'
        }}>
          {completionDate || 'Course not completed'}
        </p>
        <div style={{
          position: 'relative',
          margin: '1rem 0 1rem 0'
        }}>
          <img
            src={signature}
            alt='signature'
            style={{
              paddingInline: '5rem',
              marginTop: '0.5rem'
            }}
          />
          <hr style={{
            borderBottom: '1px solid #aeaeae',
            width: '100%',
            bottom: '-10px',
            position: 'absolute',
            margin: '0',
            border: '1px solid #000'
          }} />
        </div>
        <p style={{
          fontSize: '20px',
          textAlign: 'center',
          margin: '0.5rem 0',
          fontWeight: 'medium',
          color: '#000000'
        }}>
          Anastasia Hall
        </p>
        <p style={{
          fontSize: '20px',
          textAlign: 'center',
          margin: '0.5rem 0',
          fontWeight: 'medium',
          color: '#000000'
        }}>
          Director of Human Development
        </p>
      </div>
    </div>
  );

  const handleSave = async () => {
    if (!isCompleted) return;
    setIsGenerating(true);

    try {
      // Use the hidden certificate for PDF generation
      const certificateElement = hiddenCertificateRef.current;

      if (!certificateElement) {
        throw new Error('Certificate element not found');
      }

      // Configure html2canvas options for the hidden certificate
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 1200,
        height: 900,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200,
        windowHeight: 900,
        foreignObjectRendering: false,
        logging: false
      });

      // Create PDF in landscape orientation
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1200, 900]
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, 1200, 900, undefined, 'FAST');

      // Create blob for cross-platform compatibility
      const pdfBlob = pdf.output('blob');

      // Device detection
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isIOS || isSafari || isMobile) {
        // For iOS/Safari/Mobile: Use blob URL method
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificate-${name}.pdf`;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      } else {
        // For desktop browsers: Use direct PDF save
        pdf.save(`Certificate-${name}.pdf`);
      }

    } catch (error) {
      console.error('Error generating certificate:', error);

      // Fallback: try basic PDF generation without canvas
      try {
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [1200, 900]
        });

        pdf.setFontSize(24);
        pdf.text('Certificate of Completion', 600, 200, { align: 'center' });
        pdf.setFontSize(32);
        pdf.text(name, 600, 300, { align: 'center' });
        pdf.setFontSize(18);
        pdf.text('Course in Entrepreneurship & Innovation', 600, 400, { align: 'center' });
        pdf.text(completionDate, 600, 500, { align: 'center' });

        pdf.save(`Certificate-${name}.pdf`);
      } catch (fallbackError) {
        console.error('Fallback PDF generation also failed:', fallbackError);
        alert('Unable to generate certificate. Please try again or contact support.');
      }

    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = async () => {
    if (!isCompleted) return;
    setIsGenerating(true);

    try {
      const response = await axiosInstance.post('/dashboard/generate-certificate-html', {
        name,
        completionDate,
        courseTitle: 'Course in Entrepreneurship & Innovation',
        action: "print"
      });

      // Device detection for print
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isIOS || isMobile) {
        const blob = new Blob([response.data], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        const printWindow = window.open(url, '_blank', 'width=1200,height=900');

        if (!printWindow) {
          const newTab = window.open('about:blank', '_blank');
          if (newTab) {
            newTab.document.write(response.data);
            newTab.document.close();
          } else {
            alert('Please allow popups for this site to print the certificate. You can also save the certificate as PDF instead.');
          }
        }

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 30000);

      } else {
        const printWindow = window.open('', '_blank', 'width=1200,height=900');
        if (printWindow) {
          printWindow.document.write(response.data);
          printWindow.document.close();
        }
      }

    } catch (error) {
      console.error('Error generating certificate for print:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Hidden certificate for PDF generation */}
      <HiddenCertificate />

      {/* Modal with responsive certificate for display */}
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
                <img src={save} alt='save' style={{ opacity: isCompleted && !isGenerating ? 1 : 0.5 }} />
                <span
                  className={`hover-certificate ${isCompleted && !isGenerating ? 'cursor-pointer' : 'text-muted'}`}
                  onClick={isCompleted && !isGenerating ? handleSave : undefined}
                  style={{
                    opacity: isCompleted && !isGenerating ? 1 : 0.5,
                    pointerEvents: isCompleted && !isGenerating ? 'auto' : 'none'
                  }}
                >
                  Save
                </span>
              </div>
              <div className='d-flex gap-2 align-items-center'>
                <img src={print} alt='print' style={{ opacity: isCompleted && !isGenerating ? 1 : 0.5 }} />
                <span
                  className={`hover-certificate ${isCompleted && !isGenerating ? 'cursor-pointer' : 'text-muted'}`}
                  onClick={isCompleted && !isGenerating ? handlePrint : undefined}
                  style={{
                    opacity: isCompleted && !isGenerating ? 1 : 0.5,
                    pointerEvents: isCompleted && !isGenerating ? 'auto' : 'none'
                  }}
                >
                  Print
                </span>
              </div>
            </div>
          </div>

          {/* Responsive certificate for modal display */}
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
              <h2 className='user-certified'>
                {name}
              </h2>
              <p className='certification-paragraph'>
                has successfully completed
              </p>
              <p className='certificate-reason'>
                The Startup Studio's
                <br /> Course in Entrepreneurship & Innovation
              </p>
              <p className='certification-paragraph'>
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
    </>
  )
}

export default CertificateModal
