import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axiosInstance from '../../utils/AxiosInstance'

import warningTriangle from '../../assets/images/academy-icons/warning-triangle.png'

const ReportPostModal = ({ show, onHide, post, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    reportType: '',
    description: ''
  })

  const reportOptions = [
    { value: 'bullying', label: 'Bullying' },
    { value: 'harassment', label: 'Harassment' },
    { value: 'inappropriate', label: 'Inappropriate' },
    { value: 'spam', label: 'Spam' }
  ]

  useEffect(() => {
    if (!show) {
      setFormData({
        reportType: '',
        description: ''
      })
      setFormSubmitted(false)
    }
  }, [show])

  const handleReportTypeChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      reportType: e.target.value
    }))
  }

  const handleDescriptionChange = (content) => {
    setFormData(prevState => ({
      ...prevState,
      description: content
    }))
  }

  const validateForm = () => {
    if (!formData.reportType || !formData.description.trim()) {
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    setFormSubmitted(true)
    
    if (!validateForm()) {
      toast.error('Please select a report type and provide a description')
      return
    }

    if (!post || !post.id) {
      toast.error('Invalid post data. Please try again.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        reportType: formData.reportType,
        description: formData.description.trim()
      }

      await axiosInstance.post(`/forum/discussion/${post.id}/report`, payload)
      toast.success('Report submitted successfully!')

      setFormData({ reportType: '', description: '' })
      setFormSubmitted(false)
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
      
      // Close modal using setTimeout to ensure state updates
      setTimeout(() => {
        onHide()
      }, 100)
      
    } catch (error) {
      console.error('Error submitting report:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({ reportType: '', description: '' })
    setFormSubmitted(false)
    setLoading(false)
    onHide()
  }

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'blockquote'],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link']
    ]
  }

  const quillFormats = [
    'bold', 'italic', 'blockquote',
    'list', 'bullet', 'align', 'link'
  ]

  return (
    <>
      <Modal 
        show={show} 
        onHide={handleCancel}
        className="report-post-modal"
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="p-4 border-0 mb-3">
          <Modal.Title 
            className="d-flex gap-3"
            style={{ fontSize: '16px', fontWeight: '600', color: '#333', flexDirection: 'column' }}
          >
            <div 
              className="d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: 'rgb(232, 244, 253)',
                borderRadius: '50%'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3.33398 17.5004V13.0729M3.33398 13.0729C8.18232 9.28123 11.819 16.8646 16.6673 13.0729V3.59456C11.819 7.38623 8.18232 -0.197107 3.33398 3.59456V13.0729Z" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            Report Post
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="pb-4">
          {post && (
            <div className="mb-4 p-3" style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
              <div className="d-flex align-items-start gap-3">
                <img
                  src={post.author?.avatar || 'https://via.placeholder.com/55'}
                  alt={post.author?.name || 'User'}
                  style={{
                    width: '55px',
                    height: '55px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    padding: '2px',
                    border: '1px solid #E9ECEF'
                  }}
                />
                <div className="flex-grow-1">
                    <span style={{ fontSize: '13px', fontWeight: '300', color: 'black' }}>
                        @{post.author?.name || 'Unknown User'}
                    </span>
                  <h6 className="mb-1" style={{ fontWeight: '600', color: '#333', fontSize: '20px' }}>
                    {post.title}
                  </h6>
                  <div 
                    className="mb-0" 
                    style={{ 
                      fontSize: '15px', 
                      color: '#666', 
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      whiteSpace: 'normal',
                      hyphens: 'auto',
                      maxWidth: '100%'
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: post.content && post.content.length > 200 
                        ? `${post.content.substring(0, 200)}...` 
                        : post.content
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="reportType" style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px', display: 'block' }}>
              Report Type <span style={{ color: '#FF3399' }}>*</span>
            </label>
            <select
              id="reportType"
              value={formData.reportType}
              onChange={handleReportTypeChange}
              className="form-control"
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #E9ECEF',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
            >
              <option value="">Select a reason</option>
              {reportOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formSubmitted && !formData.reportType && (
              <div className="text-danger mt-2" style={{ fontSize: '12px' }}>
                Please select a report type
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="description" style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px', display: 'block' }}>
              Additional Details <span style={{ color: '#FF3399' }}>*</span>
            </label>
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
              className='text-black report-post-quill'
              placeholder="Please provide more details about why you're reporting this post..."
              modules={quillModules}
              formats={quillFormats}
              style={{
                borderRadius: '8px',
                minHeight: '200px',
                border: '1px solid #E9ECEF'
              }}
            />
            {formSubmitted && !formData.description.trim() && (
              <div className="text-danger mt-2" style={{ fontSize: '12px' }}>
                Please provide a description
              </div>
            )}
          </div>

          <div className="d-flex gap-3 mt-4 modal-btn-container" style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
            <Button 
              variant="outline-secondary"
              onClick={handleCancel}
              disabled={loading}
              style={{
                padding: '12px 24px',
                fontWeight: '600',
                borderRadius: '6px'
              }}
            >
              CANCEL
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '12px 24px',
                fontWeight: '600',
                borderRadius: '6px',
                backgroundColor: '#FF3399',
                border: 'none',
                color: 'white'
              }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : null}
              {loading ? 'SUBMITTING...' : 'SUBMIT REPORT'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ReportPostModal
