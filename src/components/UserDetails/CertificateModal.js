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
  const certificateRef = useRef(null)
  const dispatch = useDispatch()
  const [completionDate, setCompletionDate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false);

  const { finishedContent, levelProgress, loading, totalProgress } = useSelector(
    (state) => state.course
  );

  const isCompleted = totalProgress === 100;

  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

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
    setIsGenerating(true);
    try {
      const response = await axiosInstance.post('/dashboard/generate-certificate', {
        name,
        completionDate,
        courseTitle: 'Course in Entrepreneurship & Innovation'
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate-${name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating certificate:', error);
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

    // Detect iOS/mobile devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                 (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isIOS || isMobile) {
      // For iOS/mobile: Create a blob URL and open it
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Open in new tab/window
      const printWindow = window.open(url, '_blank', 'width=1200,height=900');
      
      if (!printWindow) {
        // If popup was blocked, try alternative method
        const newTab = window.open('about:blank', '_blank');
        if (newTab) {
          newTab.document.write(response.data);
          newTab.document.close();
        } else {
          // Last resort: show an alert with instructions
          alert('Please allow popups for this site to print the certificate. You can also save the certificate as PDF instead.');
        }
      }
      
      // Clean up blob URL after some time
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 30000);
      
    } else {
      // For desktop browsers: Use the original method
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
