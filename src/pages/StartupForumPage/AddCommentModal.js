import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBold, faItalic, faQuoteLeft, faAlignLeft, faAlignCenter, faAlignRight, faListUl, faListOl, faImage, faLink, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

// Import icons
import messageText from '../../assets/images/academy-icons/svg/message-text.svg'

const AddCommentModal = ({ show, onHide, originalPost, editingComment }) => {
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const [formData, setFormData] = useState({
    message: ''
  })

  // Pre-fill form when editing
  useEffect(() => {
    if (editingComment) {
      setFormData({
        message: editingComment.description || ''
      })
    } else {
      // Reset form for new comment
      setFormData({
        message: ''
      })
    }
  }, [editingComment])

  const handleMessageChange = (content) => {
    setFormData(prevState => ({
      ...prevState,
      message: content
    }))
  }

  const validateForm = () => {
    if (!formData.message.trim()) {
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    setFormSubmitted(true)
    
    if (!validateForm()) {
      toast.error('Please enter a reply')
      return
    }

    setLoading(true)

    try {
      // Here you would typically send the data to your backend
      if (editingComment) {
        console.log('Updating comment:', { ...formData, id: editingComment.id })
        toast.success('Comment updated successfully!')
      } else {
        console.log('Creating new reply:', formData)
        toast.success('Reply added successfully!')
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      handleCancel()
    } catch (error) {
      console.error('Error saving reply:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      message: ''
    })
    setFormSubmitted(false)
    setLoading(false)
    onHide()
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      // Here you would typically send the delete request to your backend
      console.log('Deleting comment:', editingComment.id)
      toast.success('Comment deleted successfully!')
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      handleCancel()
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  // ReactQuill modules configuration
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'blockquote'],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image']
    ]
  }

  const quillFormats = [
    'bold', 'italic', 'blockquote',
    'list', 'bullet', 'align', 'link', 'image'
  ]

  return (
    <Modal 
      show={show} 
      onHide={handleCancel}
      className="add-comment-modal"
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
              backgroundColor: '#E8F4FD',
              borderRadius: '50%'
            }}
          >
            <img src={messageText} alt="Comment Icon" style={{ width: '20px', height: '20px' }} />
          </div>
          {editingComment ? 'Edit Comment' : 'Add Comment'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="pb-4">
        {/* Original Post Display - Only show when adding new comment */}
        {!editingComment && originalPost && (
          <div className="mb-4 p-3" style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
            <div className="d-flex align-items-start gap-3">
              <img
                src={originalPost.author.avatar}
                alt={originalPost.author.name}
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
                <h6 className="mb-1" style={{ fontWeight: '600', color: '#333', fontSize: '20px' }}>
                  {originalPost.title}
                </h6>
                <p className="mb-0" style={{ fontSize: '15px', color: '#666', lineHeight: '1.4' }}>
                  {originalPost.description.length > 200 
                    ? `${originalPost.description.substring(0, 200)}...` 
                    : originalPost.description
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Editing Comment Display - Only show when editing */}
        {editingComment && (
          <div className="mb-4 p-3" style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
            <div className="d-flex align-items-start gap-3">
              <img
                src={editingComment.author.avatar}
                alt={editingComment.author.name}
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
                <h6 className="mb-1" style={{ fontWeight: '600', color: '#333', fontSize: '16px' }}>
                  Editing your comment
                </h6>
                <p className="mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                  Original: {editingComment.description.length > 150 
                    ? `${editingComment.description.substring(0, 150)}...` 
                    : editingComment.description
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message Editor */}
        <div className="mb-4">
          <ReactQuill
            value={formData.message}
            onChange={handleMessageChange}
            className='text-black add-comment-quill'
            placeholder={editingComment ? "Edit your comment..." : "Add your reply..."}
            modules={quillModules}
            formats={quillFormats}
            style={{
              borderRadius: '8px',
              minHeight: '200px',
              border: '1px solid #E9ECEF'
            }}
          />
          {formSubmitted && !formData.message.trim() && (
            <div className="text-danger mt-2" style={{ fontSize: '12px' }}>
              Please enter a reply
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-3 mt-4" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          {editingComment && (
            <div 
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                color: 'black'
              }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} />
              Delete comment
            </div>   
          )}

          <div className='d-flex gap-3 align-items-center' style={{ marginLeft: 'auto' }}>
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
                backgroundColor: '#52C7DE',
                border: 'none',
                color: 'white'
              }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : null}
              {loading ? (editingComment ? 'UPDATING...' : 'SUBMITTING...') : (editingComment ? 'UPDATE' : 'SUBMIT')}
            </Button>
          </div>
        </div>
      </Modal.Body>

      {/* Delete Confirmation Modal */}
      {/* {showDeleteConfirm && (
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
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '400px',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <FontAwesomeIcon 
              icon={faExclamationTriangle} 
              style={{ fontSize: '24px', color: '#FF3399', marginBottom: '16px' }}
            />
            <h5 style={{ marginBottom: '16px' }}>Delete Comment?</h5>
            <p style={{ marginBottom: '24px', color: '#666' }}>
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Button 
                variant="secondary" 
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                CANCEL
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDelete}
                disabled={loading}
                style={{ backgroundColor: '#FF3399', borderColor: '#FF3399' }}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : null}
                {loading ? 'DELETING...' : 'DELETE'}
              </Button>
            </div>
          </div>
        </div>
      )} */}
    </Modal>
  )
}

export default AddCommentModal