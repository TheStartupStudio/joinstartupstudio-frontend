import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import csvToArray from '../../CSVUpload/csvToArray'
import template from '../../../assets/files/CSV_USERS_EXAMPLE.csv'
import './index.css'

const BulkAddLearnersModal = ({ show, onHide, onSuccess, mode = 'learners' }) => {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // Dynamic content based on mode
  const content = {
    learners: {
      title: 'Bulk Add Learners',
      buttonText: 'DOWNLOAD BLANK CSV TEMPLATE',
      uploadMessage: 'Only .csv file supported (max. 2Mb)',
      successMessage: 'Learners added successfully!'
    },
    organizations: {
      title: 'Bulk Add Organizations',
      buttonText: 'DOWNLOAD BLANK CSV TEMPLATE',
      uploadMessage: 'Only .csv file supported (max. 2Mb)',
      successMessage: 'Organizations added successfully!'
    }
  }

  const currentContent = content[mode]

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'text/csv') {
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB')
        return
      }
      setFile(selectedFile)
    } else {
      toast.error('Only CSV files are supported')
    }
  }

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file to upload')
      return
    }

    setLoading(true)

    const reader = new FileReader()

    reader.onload = async function (e) {
      try {
        const results = csvToArray(e.target.result, ',')
        
        if (results.length === 0) {
          toast.error('CSV file is empty')
          setLoading(false)
          return
        }

        // Process based on mode
        if (mode === 'learners') {
          for (let learner of results) {
            let payload = {
              ...learner,
              stripe_subscription_id: 'true',
              payment_type: 'school',
              is_active: 1
            }
            await axiosInstance.post('/instructor/add-users', payload)
          }
        } else if (mode === 'organizations') {
          for (let organization of results) {
            let payload = {
              ...organization
            }
            // Replace with actual endpoint for organizations
            await axiosInstance.post('/admin/add-organization', payload)
          }
        }

        toast.success(currentContent.successMessage)
        onSuccess()
        handleCancel()
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(error.response?.data?.message || `Error uploading ${mode}`)
      } finally {
        setLoading(false)
      }
    }

    reader.onerror = function () {
      toast.error('Error reading file')
      setLoading(false)
    }

    reader.readAsText(file)
  }

  const handleCancel = () => {
    if (!loading) {
      setFile(null)
      onHide()
    }
  }

  const handleDownloadTemplate = () => {
    const link = document.createElement('a')
    link.href = template
    link.download = mode === 'learners' ? 'CSV_LEARNERS_TEMPLATE.csv' : 'CSV_ORGANIZATIONS_TEMPLATE.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      backdrop={loading ? 'static' : true}
      keyboard={!loading}
      className="bulk-add-learners-modal"
      centered
      size="md"
    >
      <div className="bulk-add-learners-content">
        {/* Icon and Title */}
        <div className="d-flex flex-column justify-content-start">
          <div className="popup-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10.4167 9.95801C10.8194 9.51356 11.1286 9.00662 11.3442 8.43717C11.5597 7.86773 11.6672 7.27745 11.6667 6.66634C11.6661 6.05523 11.5586 5.46495 11.3442 4.89551C11.1297 4.32606 10.8206 3.81912 10.4167 3.37467C11.25 3.48579 11.9444 3.85384 12.5 4.47884C13.0556 5.10384 13.3333 5.83301 13.3333 6.66634C13.3333 7.49967 13.0556 8.22884 12.5 8.85384C11.9444 9.47884 11.25 9.8469 10.4167 9.95801ZM14.5417 16.6663C14.6944 16.4163 14.8092 16.1491 14.8858 15.8647C14.9625 15.5802 15.0006 15.2919 15 14.9997V14.1663C15 13.6663 14.8889 13.1905 14.6667 12.7388C14.4444 12.2872 14.1528 11.888 13.7917 11.5413C14.5 11.7913 15.1564 12.1144 15.7608 12.5105C16.3653 12.9066 16.6672 13.4586 16.6667 14.1663V14.9997C16.6667 15.458 16.5036 15.8505 16.1775 16.1772C15.8514 16.5038 15.4589 16.6669 15 16.6663H14.5417ZM16.6667 9.16634H15.8333C15.5972 9.16634 15.3994 9.08634 15.24 8.92634C15.0806 8.76634 15.0006 8.56856 15 8.33301C14.9994 8.09745 15.0794 7.89967 15.24 7.73967C15.4006 7.57967 15.5983 7.49967 15.8333 7.49967H16.6667V6.66634C16.6667 6.43023 16.7467 6.23245 16.9067 6.07301C17.0667 5.91356 17.2644 5.83356 17.5 5.83301C17.7356 5.83245 17.9336 5.91245 18.0942 6.07301C18.2547 6.23356 18.3344 6.43134 18.3333 6.66634V7.49967H19.1667C19.4028 7.49967 19.6008 7.57967 19.7608 7.73967C19.9208 7.89967 20.0006 8.09745 20 8.33301C19.9994 8.56856 19.9194 8.76662 19.76 8.92717C19.6006 9.08773 19.4028 9.16745 19.1667 9.16634H18.3333V9.99967C18.3333 10.2358 18.2533 10.4338 18.0933 10.5938C17.9333 10.7538 17.7356 10.8336 17.5 10.833C17.2644 10.8325 17.0667 10.7525 16.9067 10.593C16.7467 10.4336 16.6667 10.2358 16.6667 9.99967V9.16634ZM6.66667 9.99967C5.75 9.99967 4.96528 9.67329 4.3125 9.02051C3.65972 8.36773 3.33333 7.58301 3.33333 6.66634C3.33333 5.74967 3.65972 4.96495 4.3125 4.31217C4.96528 3.6594 5.75 3.33301 6.66667 3.33301C7.58333 3.33301 8.36805 3.6594 9.02083 4.31217C9.67361 4.96495 10 5.74967 10 6.66634C10 7.58301 9.67361 8.36773 9.02083 9.02051C8.36805 9.67329 7.58333 9.99967 6.66667 9.99967ZM0 14.9997V14.333C0 13.8608 0.121667 13.4269 0.365 13.0313C0.608333 12.6358 0.931111 12.3336 1.33333 12.1247C2.19444 11.6941 3.06944 11.3713 3.95833 11.1563C4.84722 10.9413 5.75 10.8336 6.66667 10.833C7.58333 10.8325 8.48611 10.9402 9.375 11.1563C10.2639 11.3725 11.1389 11.6952 12 12.1247C12.4028 12.333 12.7258 12.6352 12.9692 13.0313C13.2125 13.4275 13.3339 13.8613 13.3333 14.333V14.9997C13.3333 15.458 13.1703 15.8505 12.8442 16.1772C12.5181 16.5038 12.1256 16.6669 11.6667 16.6663H1.66667C1.20833 16.6663 0.816111 16.5033 0.49 16.1772C0.163889 15.8511 0.000555556 15.4586 0 14.9997ZM6.66667 8.33301C7.125 8.33301 7.5175 8.16995 7.84417 7.84384C8.17083 7.51773 8.33389 7.12523 8.33333 6.66634C8.33278 6.20745 8.16972 5.81523 7.84417 5.48967C7.51861 5.16412 7.12611 5.00079 6.66667 4.99967C6.20722 4.99856 5.815 5.1619 5.49 5.48967C5.165 5.81745 5.00167 6.20967 5 6.66634C4.99833 7.12301 5.16167 7.51551 5.49 7.84384C5.81833 8.17217 6.21056 8.33523 6.66667 8.33301ZM1.66667 14.9997H11.6667V14.333C11.6667 14.1802 11.6286 14.0413 11.5525 13.9163C11.4764 13.7913 11.3756 13.6941 11.25 13.6247C10.5 13.2497 9.74305 12.9686 8.97917 12.7813C8.21528 12.5941 7.44444 12.5002 6.66667 12.4997C5.88889 12.4991 5.11805 12.593 4.35417 12.7813C3.59028 12.9697 2.83333 13.2508 2.08333 13.6247C1.95833 13.6941 1.8575 13.7913 1.78083 13.9163C1.70417 14.0413 1.66611 14.1802 1.66667 14.333V14.9997Z" fill="black"/>
                </svg>
          </div>
          <h3 className="popup-title">{currentContent.title}</h3>
        </div>

        {/* Download Template Button */}
        <button
          type="button"
          className="download-template-btn"
          onClick={handleDownloadTemplate}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 11L8 3M8 11L5 8M8 11L11 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 11V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {currentContent.buttonText}
        </button>

        {/* File Upload Area */}
        <div
          className={`file-upload-area ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('csvFileInput').click()}
        >
          <input
            type="file"
            id="csvFileInput"
            accept=".csv"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          
          <div className="upload-icon">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <g clip-path="url(#clip0_3743_9143)">
                <path d="M12 22V13M12 13L15.5 16.5M12 13L8.5 16.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20 17.6073C21.4937 17.0221 23 15.6889 23 13C23 9 19.6667 8 18 8C18 6 18 2 12 2C6 2 6 6 6 8C4.33333 8 1 9 1 13C1 15.6889 2.50628 17.0221 4 17.6073" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <defs>
                <clipPath id="clip0_3743_9143">
                <rect width="24" height="24" fill="white"/>
                </clipPath>
            </defs>
            </svg>
          </div>

          {file ? (
            <div className="file-selected">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          ) : (
            <>
              <p className="upload-text">Click to upload or drag and drop</p>
              <p className="upload-subtext">{currentContent.uploadMessage}</p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="popup-actions">
          <button
            type="button"
            className="popup-btn cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="popup-btn confirm-btn upload-btn"
            onClick={handleUpload}
            disabled={loading || !file}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              'UPLOAD'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BulkAddLearnersModal