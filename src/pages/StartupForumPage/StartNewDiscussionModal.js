import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteLeft, faLink, faPencilAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axiosInstance from '../../utils/AxiosInstance'
import foulWords from '../../assets/json/foul-words.json'
import { useSelector } from 'react-redux'
import UserAgreementModal from '../../components/UserAgreementModal'

import wavingHand from '../../assets/images/academy-icons/svg/Waving Hand.svg'
import speechBalloon from '../../assets/images/academy-icons/svg/Speech Balloon.svg'
import partyPopper from '../../assets/images/academy-icons/svg/Party Popper.svg'
import loudSpeaker from '../../assets/images/academy-icons/svg/Loudspeaker.svg'
import lightBulb from '../../assets/images/academy-icons/svg/Light Bulb.svg'
import messageText from '../../assets/images/academy-icons/svg/message-text.svg'
import warningTriangle from '../../assets/images/academy-icons/warning-triangle.png'


const StartNewDiscussionModal = ({ show, onHide, editingPost, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showContentWarning, setShowContentWarning] = useState(false)
  const [showUserAgreement, setShowUserAgreement] = useState(false)
  
  const currentUser = useSelector(state => state.user?.user?.user || state.user?.user)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '', 
    selectedCategory: ''
  })

  const categories = [
    {
      name: 'Introductions',
      color: '#FF6B6B',
      icon: wavingHand
    },
    {
      name: 'Announcements',
      color: '#4ECDC4',
      icon: loudSpeaker
    },
    {
      name: 'Celebrations',
      color: '#45B7D1',
      icon: partyPopper
    },
    {
      name: 'Ask for Feedback',
      color: '#F49AC2',
      icon: lightBulb
    },
    {
      name: 'Ask for Collaboration',
      color: '#A29BFE',
      icon: speechBalloon
    },
    {
      name: 'Ask for Mentorship',
      color: '#81ECEC',
      icon: wavingHand
    }
  ]

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title || '',
        description: editingPost.description || '',
        content: editingPost.content || editingPost.description || '',
        category: editingPost.category || '', 
        selectedCategory: editingPost.category || ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        content: '',
        category: '',
        selectedCategory: ''
      })
    }
  }, [editingPost])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      ...(name === 'title' && { description: value })
    }))
  }

  const handleCategorySelect = (categoryName) => {
    setFormData(prevState => ({
      ...prevState,
      selectedCategory: categoryName,
      category: categoryName
    }))
  }

  const handleMessageChange = (content) => {
    setFormData(prevState => ({
      ...prevState,
      content: content,
      description: prevState.description || content
    }))
  }

  const validateForm = () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
      return false
    }
    return true
  }

  const containsFoulLanguage = (text) => {
    if (!text) return false
    
    // Strip HTML tags from content
    const strippedText = text.replace(/<[^>]*>/g, ' ').toLowerCase()
    
    // Check if any foul word exists in the text
    return foulWords.some(word => {
      const regex = new RegExp(`\\b${word.toLowerCase()}\\b`, 'i')
      return regex.test(strippedText)
    })
  }

  const handleSubmit = async () => {
    setFormSubmitted(true)
    
    if (!validateForm()) {
      toast.error('Please fill in all fields')
      return
    }

    // Check if user needs to agree to terms
    if (!currentUser?.forumAgreement) {
      setShowUserAgreement(true)
      return
    }

    // Check for foul language
    if (containsFoulLanguage(formData.title) || containsFoulLanguage(formData.content)) {
      setShowContentWarning(true)
      return
    }

    setLoading(true)

    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content,
        category: formData.category
      }

      let response
      if (editingPost) {
        response = await axiosInstance.put(`/forum/${editingPost.id}`, payload)
        toast.success('Discussion updated successfully!')
      } else {
        response = await axiosInstance.post('/forum', {
          ...payload,
          description: formData.description.trim() || formData.title.trim(),
          published: true
        })
        toast.success('Discussion created successfully!')
      }

      // Call onSuccess callback FIRST
      if (onSuccess) {
        onSuccess(response.data)
      }
      
      // Close modal IMMEDIATELY
      onHide()
      
      // Reset form state after a delay to avoid conflicts
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          content: '',
          category: '',
          selectedCategory: ''
        })
        setFormSubmitted(false)
      }, 100)
      
    } catch (error) {
      console.error('Error saving discussion:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: '',
      selectedCategory: ''
    })
    setFormSubmitted(false)
    setLoading(false)
    setShowDeleteConfirm(false)
    setShowContentWarning(false)
    setShowUserAgreement(false)
    onHide()
  }

  const handleUserAgreementSuccess = () => {
    setShowUserAgreement(false)
    // Retry submission after agreement
    setTimeout(() => {
      handleSubmit()
    }, 300)
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await axiosInstance.delete(`/forum/${editingPost.id}`)
      toast.success('Discussion deleted successfully!')
      
      if (onSuccess) {
        onSuccess(null, 'delete')
      }
      
      handleCancel()
    } catch (error) {
      console.error('Error deleting discussion:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image']
    ]
  }

  const quillFormats = [
    'header', 'bold', 'italic', 'underline',
    'list', 'bullet', 'align', 'link', 'image'
  ]

  return (
    <>
      <Modal 
        show={show} 
        onHide={handleCancel}
        className="start-discussion-modal"
        size="lg"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="p-4">
          <Modal.Title 
            className="d-flex gap-3"
            style={{ fontSize: '16px', flexDirection: 'column', fontWeight: '600 !important' }}
          >
            <div 
              className="d-flex align-items-center justify-content-center me-3"
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#C8CDD880',
                borderRadius: '50%',
                fontSize: '15px'
              }}
            >
              <img src={messageText} alt="Discussion Icon" style={{ width: '20px', height: '20px' }} />
            </div>
            {editingPost ? 'Edit Discussion' : 'Start New Discussion'}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="pb-4">
          {/* Category Selection */}
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-3">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className={`category-selection-btn ${formData.selectedCategory === category.name ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(category.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: formData.selectedCategory === category.name ? `2px solid ${category.color}` : '2px solid #e0e0e0',
                    backgroundColor: formData.selectedCategory === category.name ? category.color : 'white',
                    color: formData.selectedCategory === category.name ? 'white' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: formData.selectedCategory === category.name ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    transform: formData.selectedCategory === category.name ? 'translateY(-1px)' : 'none'
                  }}
                >
                  <img
                    src={category.icon}
                    alt={category.name}
                    style={{
                      width: '16px',
                      height: '16px',
                    }}
                  />
                  {category.name}
                </div>
              ))}
            </div>
            {formSubmitted && !formData.category && (
              <div className="text-danger mt-2" style={{ fontSize: '12px' }}>
                Please select a category
              </div>
            )}
          </div>

          <div className="mb-3">
            <div 
              className="d-flex align-items-center gap-2"
              style={{
                boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                padding: '12px',
                backgroundColor: 'white'
              }}
            >
              <input
                type="text"
                name="title"
                placeholder="Add a subject line"
                value={formData.title}
                onChange={handleChange}
                className="flex-grow-1"
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              <FontAwesomeIcon 
                icon={faPencilAlt} 
                style={{ color: 'black', cursor: 'pointer', fontSize: '14px' }} 
              />
            </div>
            {formSubmitted && !formData.title.trim() && (
              <div className="text-danger mt-1" style={{ fontSize: '12px' }}>
                Please enter a subject line
              </div>
            )}
          </div>

          <div className="mb-4">
            <ReactQuill
              value={formData.content}
              onChange={handleMessageChange}
              className='text-black'
              placeholder="Add your message..."
              modules={quillModules}
              formats={quillFormats}
              style={{
                boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                minHeight: '200px'
              }}
            />
            {formSubmitted && !formData.content.trim() && (
              <div className="text-danger mt-1" style={{ fontSize: '12px' }}>
                Please enter a message
              </div>
            )}
          </div>

          <div className="d-flex gap-3 mt-4 modal-btn-container" style={{ alignItems: 'center', justifyContent: editingPost ? 'space-between' : 'end' }}>
            {editingPost && (
              <div 
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: '#FF3399'
                }}
              >
                <FontAwesomeIcon icon={faExclamationTriangle} />
                Delete discussion
              </div>   
            )}

            <div className='d-flex gap-3 align-items-center modal-btn-container'>
              <Button className='close-btn w-full-900' onClick={handleCancel}>
                CANCEL
              </Button>
              <button
                className='modal-save-btn w-full-900'
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : null}
                {loading ? (editingPost ? 'UPDATING...' : 'SUBMITTING...') : (editingPost ? 'UPDATE' : 'SUBMIT')}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {showDeleteConfirm && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '24px',
              textAlign: 'center',
              width: '100%',
              maxWidth: '748px',
              margin: '0px 15px',
            }}
            className="delete-new-discussion-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-100 text-start">
              <div style={{padding: '5px', borderRadius: '50%', backgroundColor: '#E2E6EC', width: '36px', height:'36px', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={warningTriangle} alt="Warning Icon" style={{ width: '16px', height: '16px' }} />
              </div>
              <h5 style={{ margin: '16px 0px', fontSize:'15px' }}>Delete Discussion?</h5>
            </div>
            <p style={{ margin: '30px 0px 55px 0px' }}>
              Are you sure you want to delete this discussion? This action cannot be undone.
            </p>
            <div className="d-flex gap-5 justify-content-center align-items-center modal-btn-container">
              <Button  
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
                style={{ 
                  width: '100%',
                  backgroundColor: '#DEE1E6', 
                  boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)', 
                  padding: '12px 12px',
                  maxWidth: '250px',
                  borderRadius: '8px',
                  fontSize:'17px',
                  fontWeight: '600',
                  color:'black',
                  border:'none'
                }}
              >
                NO, TAKE ME BACK
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDelete}
                disabled={loading}
                style={{ 
                  width: '100%',
                  backgroundColor: '#FF3399', 
                  boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)', 
                  padding: '12px',
                  maxWidth: '250px',
                  borderRadius: '8px',
                  fontSize:'17px',
                  fontWeight: '600'
                }}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : null}
                {loading ? 'DELETING...' : 'DELETE DISCUSSION'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showContentWarning && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setShowContentWarning(false)}
        >
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '24px',
              textAlign: 'center',
              width: '100%',
              maxWidth: '742px',
              margin: '0px 15px',
              position: 'relative'
            }}
            className="delete-new-discussion-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-100 text-start">
              <div style={{position: 'absolute', top: 0, right: 0, padding:'17px', borderRadius: "0 24px", boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.25)', cursor: 'pointer' }} onClick={() => setShowContentWarning(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M9.78105 16.25L15.9061 22.375C16.1561 22.625 16.2761 22.9167 16.2661 23.25C16.2561 23.5833 16.1256 23.875 15.8748 24.125C15.6248 24.3542 15.3331 24.4742 14.9998 24.485C14.6665 24.4958 14.3748 24.3758 14.1248 24.125L5.8748 15.875C5.7498 15.75 5.66105 15.6146 5.60855 15.4687C5.55605 15.3229 5.53064 15.1667 5.5323 15C5.53397 14.8333 5.56022 14.6771 5.61105 14.5312C5.66189 14.3854 5.75022 14.25 5.87605 14.125L14.1261 5.875C14.3552 5.64583 14.6419 5.53125 14.9861 5.53125C15.3302 5.53125 15.6269 5.64583 15.8761 5.875C16.1261 6.125 16.2511 6.42208 16.2511 6.76625C16.2511 7.11042 16.1261 7.40708 15.8761 7.65625L9.78105 13.75H23.7498C24.104 13.75 24.4011 13.87 24.6411 14.11C24.8811 14.35 25.0006 14.6467 24.9998 15C24.999 15.3533 24.879 15.6504 24.6398 15.8913C24.4006 16.1321 24.104 16.2517 23.7498 16.25H9.78105Z" fill="black"/>
                </svg>
              </div>
              <div style={{padding: '5px', borderRadius: '50%', backgroundColor: '#E2E6EC', width: '36px', height:'36px', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={warningTriangle} alt="Warning Icon" style={{ width: '16px', height: '16px' }} />
              </div>
              <h5 style={{ margin: '16px 0px', fontSize:'15px', fontWeight: '600' }}>Content Warning</h5>
            </div>
            <p style={{ margin: '10px 0px 0px 0px', textAlign: 'center', fontSize: '14px', lineHeight: '1.6' }}>
              Please remember that this forum is to be used in a professional manner. Profanity, bullying, harassment, and inappropriate content are not allowed. Posting such content may result in you being banned from posting.
            </p>
          </div>
        </div>
      )}

      {/* User Agreement Modal */}
      <UserAgreementModal 
        show={showUserAgreement}
        onSuccess={handleUserAgreementSuccess}
        onHide={() => setShowUserAgreement(false)}
      />
    </>
  )
}

export default StartNewDiscussionModal