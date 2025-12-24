import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBold, faItalic, faQuoteLeft, faAlignLeft, faAlignCenter, faAlignRight, faListUl, faListOl, faImage, faLink, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axiosInstance from '../../utils/AxiosInstance'
import { checkContent } from '../../utils/contentFilter'
import { useSelector } from 'react-redux'
import UserAgreementModal from '../../components/UserAgreementModal'
import messageText from '../../assets/images/academy-icons/svg/message-text.svg'
import reply from '../../assets/images/academy-icons/svg/reply.svg'
import warningTriangle from '../../assets/images/academy-icons/warning-triangle.png'
import blankProfile from '../../assets/images/academy-icons/blankProfile.jpg'



const AddCommentModal = ({ show, onHide, originalPost, editingComment, onSuccess, parentReplyId = null, parentComment = null }) => {
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showContentWarning, setShowContentWarning] = useState(false)
  const [showUserAgreement, setShowUserAgreement] = useState(false)
  const [contentFilterLevel, setContentFilterLevel] = useState(null)
  const [acknowledgeWarning, setAcknowledgeWarning] = useState(false)
  
  const currentUser = useSelector(state => state.user?.user?.user || state.user?.user)
  
  const [formData, setFormData] = useState({
    message: ''
  })

  useEffect(() => {
    if (editingComment) {
      setFormData({
        message: editingComment.content || ''
      })
    } else {
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

  const checkContentFilter = () => {
    return checkContent(formData.message)
  }

  const handleSubmit = async () => {
    setFormSubmitted(true)
    
    if (!validateForm()) {
      toast.error('Please enter a reply')
      return
    }

    // Check if user needs to agree to terms
    if (!currentUser?.forumAgreement) {
      setShowUserAgreement(true)
      return
    }

    // Check for inappropriate content
    const filterResult = checkContentFilter()
    
    if (filterResult) {
      if (filterResult.level === 1) {
        // Level 1: Block submission, show non-dismissible warning
        setContentFilterLevel(1)
        setShowContentWarning(true)
        return
      } else if (filterResult.level === 2 || filterResult.level === 3) {
        // Level 2 & 3: Show warning with acknowledgment option
        if (!acknowledgeWarning) {
          setContentFilterLevel(filterResult.level)
          setShowContentWarning(true)
          return
        }
        // If acknowledged, proceed with submission
      }
    }

    setLoading(true)

    try {
      const payload = {
        content: formData.message.trim(),
        parent_reply_id: parentReplyId
      }

      let response
      if (editingComment) {
        response = await axiosInstance.put(`/forum/replies/${editingComment.id}`, {
          content: formData.message.trim()
        })
        toast.success('Comment updated successfully!')
      } else {
        response = await axiosInstance.post(`/forum/discussion/${originalPost.id}/replies`, payload)
        toast.success('Reply added successfully!')
        
        // Check if Level 2 content needs admin notification
        const filterCheck = checkContentFilter()
        if (filterCheck && filterCheck.level === 2 && originalPost?.id) {
          try {
            await axiosInstance.post(`/forum/discussion/${originalPost.id}/report`, {
              reportType: 'auto report',
              reason: 'Auto-flagged for review - Level 2 content detected',
              flagged_words: filterCheck.found,
              reply_id: response.data?.id
            })
          } catch (notifyError) {
            console.error('Failed to notify admin:', notifyError)
          }
        }
      }

      setFormData({ message: '' })
      setFormSubmitted(false)
      
      // Call onSuccess callback FIRST
      if (onSuccess) {
        onSuccess(response?.data, editingComment ? 'update' : 'create')
      }
      
      // Then immediately close modal using setTimeout to ensure state updates
      setTimeout(() => {
        onHide()
      }, 100)
      
    } catch (error) {
      console.error('Error saving reply:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset all states
    setFormData({ message: '' })
    setFormSubmitted(false)
    setLoading(false)
    setShowDeleteConfirm(false)
    setShowContentWarning(false)
    setShowUserAgreement(false)
    setContentFilterLevel(null)
    setAcknowledgeWarning(false)
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
    if (!editingComment) return
    
    setLoading(true)
    try {
      await axiosInstance.delete(`/forum/replies/${editingComment.id}`)
      toast.success('Comment deleted successfully!')

      setFormData({ message: '' })
      setFormSubmitted(false)
      
      // Call onSuccess callback FIRST
      if (onSuccess) {
        onSuccess(null, 'delete')
      }
      
      // Close delete confirmation immediately
      setShowDeleteConfirm(false)
      
      // Then close main modal using setTimeout
      setTimeout(() => {
        onHide()
      }, 100)
      
    } catch (error) {
      console.error('Error deleting comment:', error)
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(errorMessage)
      setShowDeleteConfirm(false)
    } finally {
      setLoading(false)
    }
  }

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
    <>
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
            {editingComment ? 'Edit Comment' : parentComment ? 'Reply to Comment' : 'Add Comment'}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="pb-4">
          {!editingComment && !parentComment && originalPost && (
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
                      __html: originalPost.content && originalPost.content.length > 200 
                        ? `${originalPost.content.substring(0, 200)}...` 
                        : originalPost.content
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {!editingComment && parentComment && (
            <div className="mb-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #E9ECEF', borderLeft: '4px solid #52C7DE' }}>
              <div className="d-flex align-items-start gap-3">
                <img
                  src={parentComment.author.avatar || blankProfile}
                  alt={parentComment.author.name}
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    padding: '2px',
                    border: '1px solid #E9ECEF'
                  }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <img src={reply} alt="Reply Icon" style={{ filter: 'brightness(100%) saturate(0%)', width: '14px', height: '14px' }} />
                    <h6 className="mb-0" style={{ fontWeight: '600', color: '#666', fontSize: '14px' }}>
                      Replying to @{parentComment.author.name}
                    </h6>
                  </div>
                  <div 
                    className="mb-0" 
                    style={{ 
                      fontSize: '14px', 
                      color: '#666', 
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      whiteSpace: 'normal',
                      hyphens: 'auto',
                      maxWidth: '100%'
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: parentComment.content && parentComment.content.length > 150 
                        ? `${parentComment.content.substring(0, 150)}...` 
                        : parentComment.content
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {editingComment && (
            <div className="mb-4 p-3" style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E9ECEF' }}>
              <div className="d-flex align-items-start gap-3">
                <img
                  src={editingComment.author.avatar || blankProfile}
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
                  <div className="d-flex align-items-start gap-2">
                    <span style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>Original:</span>
                    <div 
                      className="mb-0" 
                      style={{ 
                        fontSize: '14px', 
                        color: '#666', 
                        lineHeight: '1.4',
                        wordBreak: 'break-word',
                        overflowWrap: 'anywhere',
                        whiteSpace: 'normal',
                        hyphens: 'auto',
                        maxWidth: '100%',
                        flex: 1
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: editingComment.content && editingComment.content.length > 150 
                          ? `${editingComment.content.substring(0, 150)}...` 
                          : editingComment.content
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <ReactQuill
              value={formData.message}
              onChange={handleMessageChange}
              className='text-black add-comment-quill'
              placeholder={
                editingComment 
                  ? "Edit your comment..." 
                  : parentComment 
                    ? `Reply to @${parentComment.author.name}...`
                    : "Add your reply..."
              }
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

          <div className="d-flex gap-3 mt-4 modal-btn-container" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
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

            <div className='d-flex gap-3 align-items-center'>
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
              <h5 style={{ margin: '16px 0px', fontSize:'15px' }}>Delete Comment?</h5>
            </div>
            <p style={{ margin: '30px 0px 55px 0px' }}>
              Are you sure you want to delete this comment?
            </p>
            <div className="d-flex gap-5 justify-content-center align-items-center modal-btn-container">
              <Button  
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setFormData({ message: '' })
                  setFormSubmitted(false)
                }}
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
                {loading ? 'DELETING...' : 'DELETE COMMENT'}
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
          onClick={() => {
            setShowContentWarning(false)
            setAcknowledgeWarning(false)
            setContentFilterLevel(null)
          }}
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
            }}
            className="delete-new-discussion-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-100 text-start">
              {contentFilterLevel !== 1 && (
                <div 
                  style={{position: 'absolute', top: 0, right: 0, padding:'17px', borderRadius: "0 24px", boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.25)', cursor: 'pointer' }} 
                  onClick={() => {
                    setShowContentWarning(false)
                    setAcknowledgeWarning(false)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                    <path d="M9.78105 16.25L15.9061 22.375C16.1561 22.625 16.2761 22.9167 16.2661 23.25C16.2561 23.5833 16.1256 23.875 15.8748 24.125C15.6248 24.3542 15.3331 24.4742 14.9998 24.485C14.6665 24.4958 14.3748 24.3758 14.1248 24.125L5.8748 15.875C5.7498 15.75 5.66105 15.6146 5.60855 15.4687C5.55605 15.3229 5.53064 15.1667 5.5323 15C5.53397 14.8333 5.56022 14.6771 5.61105 14.5312C5.66189 14.3854 5.75022 14.25 5.87605 14.125L14.1261 5.875C14.3552 5.64583 14.6419 5.53125 14.9861 5.53125C15.3302 5.53125 15.6269 5.64583 15.8761 5.875C16.1261 6.125 16.2511 6.42208 16.2511 6.76625C16.2511 7.11042 16.1261 7.40708 15.8761 7.65625L9.78105 13.75H23.7498C24.104 13.75 24.4011 13.87 24.6411 14.11C24.8811 14.35 25.0006 14.6467 24.9998 15C24.999 15.3533 24.879 15.6504 24.6398 15.8913C24.4006 16.1321 24.104 16.2517 23.7498 16.25H9.78105Z" fill="black"/>
                  </svg>
                </div>
              )}
              <div style={{padding: '5px', borderRadius: '50%', backgroundColor: '#E2E6EC', width: '36px', height:'36px', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={warningTriangle} alt="Warning Icon" style={{ width: '16px', height: '16px' }} />
              </div>
              <h5 style={{ margin: '16px 0px', fontSize:'15px', fontWeight: '600' }}>Content Warning</h5>
            </div>
            <p style={{ margin: '10px 0px 20px 0px', textAlign: 'center', fontSize: '14px', lineHeight: '1.6' }}>
              {contentFilterLevel === 1 ? (
                'This content contains inappropriate language that violates our community guidelines and cannot be posted. Please edit your message to remove offensive content.'
              ) : (
                'Please remember that this forum is to be used in a professional manner. Profanity, bullying, harassment, and inappropriate content are not allowed. Posting such content may result in you being banned from posting.'
              )}
            </p>
            
            {/* {contentFilterLevel === 1 && (
              <Button
                onClick={() => {
                  setShowContentWarning(false)
                  setContentFilterLevel(null)
                  setAcknowledgeWarning(false)
                }}
                style={{
                  padding: '12px 24px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  backgroundColor: '#DEE1E6',
                  border: 'none',
                  color: '#333',
                  cursor: 'pointer'
                }}
              >
                GO BACK AND EDIT
              </Button>
            )} */}
            
            {(contentFilterLevel === 2 || contentFilterLevel === 3) && (
              <>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:'center',
                    gap: '10px',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    cursor: 'pointer'
                  }}
                  onClick={() => setAcknowledgeWarning(!acknowledgeWarning)}
                >
                  <input
                    type="checkbox"
                    checked={acknowledgeWarning}
                    onChange={(e) => setAcknowledgeWarning(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label style={{ margin: 0, cursor: 'pointer', fontSize: '14px' }}>
                    I understand
                  </label>
                </div>
                
                <Button
                  onClick={() => {
                    setShowContentWarning(false)
                    handleSubmit()
                  }}
                  disabled={!acknowledgeWarning}
                  style={{
                    padding: '12px 24px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    backgroundColor: acknowledgeWarning ? '#52C7DE' : '#DEE1E6',
                    border: 'none',
                    color: acknowledgeWarning ? 'white' : '#6C757D',
                    cursor: acknowledgeWarning ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s ease'
                  }}
                >
                  POST
                </Button>
              </>
            )}
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

export default AddCommentModal