import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteLeft, faLink } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Import category icons
import wavingHand from '../../assets/images/academy-icons/svg/Waving Hand.svg'
import speechBalloon from '../../assets/images/academy-icons/svg/Speech Balloon.svg'
import partyPopper from '../../assets/images/academy-icons/svg/Party Popper.svg'
import loudSpeaker from '../../assets/images/academy-icons/svg/Loudspeaker.svg'
import lightBulb from '../../assets/images/academy-icons/svg/Light Bulb.svg'
import messageText from '../../assets/images/academy-icons/svg/message-text.svg'
import { faPencilAlt, triangle} from '@fortawesome/free-solid-svg-icons'

const StartNewDiscussionModal = ({ show, onHide }) => {
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleCategorySelect = (categoryName) => {
    setFormData(prevState => ({
      ...prevState,
      selectedCategory: categoryName
    }))
  }

  const handleMessageChange = (content) => {
    setFormData(prevState => ({
      ...prevState,
      message: content
    }))
  }

  const validateForm = () => {
    if (!formData.subject.trim() || !formData.message.trim() || !formData.selectedCategory) {
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
      // Here you would typically send the data to your backend
      console.log('New discussion:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Discussion created successfully!')
      handleCancel()
    } catch (error) {
      console.error('Error creating discussion:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      subject: '',
      message: '',
      selectedCategory: ''
    })
    setFormSubmitted(false)
    setLoading(false)
    onHide()
  }

  const isFormEmpty = !formData.subject.trim() && !formData.message.trim() && !formData.selectedCategory

  // ReactQuill modules configuration (same as EditUserModal)
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
           <img src={messageText} alt="Message Icon" style={{ width: '20px', height: '20px' }} />
          </div>
          Start New Discussion
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
          {formSubmitted && !formData.selectedCategory && (
            <div className="text-danger mt-2" style={{ fontSize: '12px' }}>
              Please select a category
            </div>
          )}
        </div>

        {/* Subject Line */}
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
              name="subject"
              placeholder="Add a subject line"
              value={formData.subject}
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
              style={{ color: '#666', cursor: 'pointer', fontSize: '14px' }} 
            />
          </div>
          {formSubmitted && !formData.subject.trim() && (
            <div className="text-danger mt-1" style={{ fontSize: '12px' }}>
              Please enter a subject line
            </div>
          )}
        </div>

        {/* Message Editor - Using ReactQuill like EditUserModal */}
        <div className="mb-4">
          <ReactQuill
            value={formData.message}
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
          {formSubmitted && !formData.message.trim() && (
            <div className="text-danger mt-1" style={{ fontSize: '12px' }}>
              Please enter a message
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-3 mt-4">
          <Button className='close-btn w-full-900' onClick={handleCancel}>
                            CANCEL
                          </Button>
          <button
                  className='modal-save-btn w-full-900'
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? '...' : 'SAVE'}
                </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default StartNewDiscussionModal