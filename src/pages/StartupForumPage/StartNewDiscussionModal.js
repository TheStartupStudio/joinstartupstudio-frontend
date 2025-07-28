import React, { useState } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBold, faItalic, faQuoteLeft, faAlignLeft, faAlignCenter, faAlignRight, faListUl, faListOl, faImage, faLink } from '@fortawesome/free-solid-svg-icons'

const StartNewDiscussionModal = ({ isOpen, toggle }) => {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const categories = [
    'Introductions',
    'Announcements', 
    'Celebrations',
    'Ideas & Feedback',
    'Misc. Topics'
  ]

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim() || !selectedCategory) {
      alert('Please fill in all fields')
      return
    }

    // Here you would typically send the data to your backend
    console.log('New discussion:', { subject, message, selectedCategory })
    
    // Reset form and close modal
    setSubject('')
    setMessage('')
    setSelectedCategory('')
    toggle()
  }

  const handleCancel = () => {
    setSubject('')
    setMessage('')
    setSelectedCategory('')
    toggle()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      toggle={toggle} 
      className="start-discussion-modal"
      size="lg"
      style={{ maxWidth: '800px' }}
    >
      <ModalHeader className="border-0 pb-0">
        <div className="d-flex align-items-center gap-3">
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f0f0f0',
              borderRadius: '12px'
            }}
          >
            <FontAwesomeIcon icon={faQuoteLeft} style={{ fontSize: '20px', color: '#666' }} />
          </div>
          <h3 className="mb-0" style={{ fontSize: '24px', fontWeight: '600' }}>
            Start New Discussion
          </h3>
        </div>
      </ModalHeader>
      
      <ModalBody className="pt-4">
        {/* Category Selection */}
        <div className="mb-4">
          <label className="form-label fw-semibold mb-2">Select Category</label>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '14px'
            }}
          >
            <option value="">Choose a category...</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Subject Line */}
        <div className="mb-4">
          <div 
            className="d-flex align-items-center gap-2 p-3"
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              backgroundColor: 'white'
            }}
          >
            <input
              type="text"
              placeholder="Add a subject line"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="flex-grow-1"
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                outline: 'none',
                fontSize: '16px'
              }}
            />
            <FontAwesomeIcon icon={faLink} style={{ color: '#666', cursor: 'pointer' }} />
          </div>
        </div>

        {/* Message Editor */}
        <div className="mb-4">
          <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
            {/* Toolbar */}
            <div 
              className="d-flex align-items-center gap-3 p-3 border-bottom"
              style={{ backgroundColor: '#fafafa' }}
            >
              <FontAwesomeIcon icon={faBold} style={{ cursor: 'pointer', color: '#666' }} />
              <FontAwesomeIcon icon={faItalic} style={{ cursor: 'pointer', color: '#666' }} />
              <FontAwesomeIcon icon={faQuoteLeft} style={{ cursor: 'pointer', color: '#666' }} />
              <div style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }}></div>
              <FontAwesomeIcon icon={faAlignLeft} style={{ cursor: 'pointer', color: '#666' }} />
              <FontAwesomeIcon icon={faAlignCenter} style={{ cursor: 'pointer', color: '#666' }} />
              <FontAwesomeIcon icon={faAlignRight} style={{ cursor: 'pointer', color: '#666' }} />
              <div style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }}></div>
              <FontAwesomeIcon icon={faListUl} style={{ cursor: 'pointer', color: '#666' }} />
              <FontAwesomeIcon icon={faListOl} style={{ cursor: 'pointer', color: '#666' }} />
              <div style={{ width: '1px', height: '20px', backgroundColor: '#ddd' }}></div>
              <FontAwesomeIcon icon={faImage} style={{ cursor: 'pointer', color: '#666' }} />
              <FontAwesomeIcon icon={faLink} style={{ cursor: 'pointer', color: '#666' }} />
            </div>

            {/* Text Area */}
            <textarea
              placeholder="Add your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="w-100 p-3"
              style={{
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                fontSize: '16px',
                backgroundColor: 'white',
                borderRadius: '0 0 8px 8px'
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2"
            style={{
              backgroundColor: '#e9ecef',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              color: '#495057',
              cursor: 'pointer'
            }}
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2"
            style={{
              backgroundColor: '#51C7DF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            SUBMIT
          </button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default StartNewDiscussionModal