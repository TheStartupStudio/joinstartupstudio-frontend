import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteLeft, faLink, faPencilAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axiosInstance from '../../utils/AxiosInstance'

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
      name: 'Ideas & Feedback',
      color: '#96CEB4',
      icon: lightBulb
    },
    {
      name: 'Misc. Topics',
      color: '#FFEAA7',
      icon: speechBalloon
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

  const handleSubmit = async () => {
    setFormSubmitted(true)
    
    if (!validateForm()) {
      toast.error('Please fill in all fields')
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

      if (onSuccess) {
        onSuccess(response.data)
      }
      
      handleCancel()
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
    onHide()
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
              maxWidth: '748px'
            }}
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
            <div className="d-flex gap-5 justify-content-center">
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
    </>
  )
}

export default StartNewDiscussionModal