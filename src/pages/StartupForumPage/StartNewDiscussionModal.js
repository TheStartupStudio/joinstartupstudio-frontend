import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuoteLeft, faLink, faPencilAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axiosInstance from '../../utils/AxiosInstance'
import { checkContent } from '../../utils/contentFilter'
import { useSelector } from 'react-redux'
import UserAgreementModal from '../../components/UserAgreementModal'

import wavingHand from '../../assets/images/academy-icons/svg/Waving Hand.svg'
import speechBalloon from '../../assets/images/academy-icons/svg/Speech Balloon.svg'
import partyPopper from '../../assets/images/academy-icons/svg/Party Popper.svg'
import loudSpeaker from '../../assets/images/academy-icons/svg/Loudspeaker.svg'
import lightBulb from '../../assets/images/academy-icons/svg/Light Bulb.svg'
import messageText from '../../assets/images/academy-icons/svg/message-text.svg'
import warningTriangle from '../../assets/images/academy-icons/warning-triangle.png'
import message from '../../assets/images/academy-icons/svg/message-text.svg'
import star from '../../assets/images/academy-icons/svg/star.svg'

const ICON_MAP = {
  'wavingHand': wavingHand,
  'loudSpeaker': loudSpeaker,
  'partyPopper': partyPopper,
  'speechBalloon': speechBalloon,
  'lightBulb': lightBulb,
  'message': message,
  'star': star
}

const StartNewDiscussionModal = ({ show, onHide, editingPost, onSuccess, dbCategories = [] }) => {
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showContentWarning, setShowContentWarning] = useState(false)
  const [showUserAgreement, setShowUserAgreement] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [contentFilterLevel, setContentFilterLevel] = useState(null)
  const [acknowledgeWarning, setAcknowledgeWarning] = useState(false)
  
  const currentUser = useSelector(state => state.user?.user?.user || state.user?.user)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '', 
    selectedCategory: '',
    categoryId: null
  })

  // Map static category names to their icons
  const getCategoryIcon = (categoryName) => {
    // Check if category exists in dbCategories and has an icon
    const dbCategory = dbCategories.find(cat => cat.name === categoryName)
    if (dbCategory?.icons) {
      // If icons is a string (icon name from DB), map it to the imported icon
      if (typeof dbCategory.icons === 'string') {
        // Check if it's an icon name (not a path)
        if (ICON_MAP[dbCategory.icons]) {
          return ICON_MAP[dbCategory.icons]
        }
        // Fallback: if it's a path (starts with /), construct full URL (for backward compatibility)
        if (dbCategory.icons.startsWith('/')) {
          const baseURL = process.env.REACT_APP_SERVER_BASE_URL || ''
          return `${baseURL.replace(/\/$/, '')}${dbCategory.icons}`
        }
      }
      // If it's already an imported module, return as is
      return dbCategory.icons
    }
    
    // Fallback to hardcoded icons for categories without database icons
    const iconMap = {
      'Introductions': wavingHand,
      'Announcements': loudSpeaker,
      'Celebrations': partyPopper,
      'Ask for Feedback': lightBulb,
      'Ask for Collaboration': speechBalloon,
      'Ask for Mentorship': wavingHand
    }
    return iconMap[categoryName] || speechBalloon // Default icon if not found
  }

  // Filter out non-posting categories and map categories with icons
  const categories = dbCategories
    .filter(cat => cat.is_active && cat.name !== 'All Discussions' && cat.name !== 'Following' && cat.name !== 'Reported Posts')
    .map(cat => ({
      name: cat.name,
      icon: getCategoryIcon(cat.name)
    }))

  useEffect(() => {
    if (show) {
      if (editingPost) {
        // Extract category name if it's an object
        const categoryName = typeof editingPost.category === 'object' && editingPost.category !== null
          ? editingPost.category.name
          : editingPost.category
        
        // Find the category ID from dbCategories if category name is provided
        const categoryId = editingPost.categoryId || editingPost.category_id || 
          (categoryName ? dbCategories.find(cat => cat.name === categoryName)?.id : null)
        
        setFormData({
          title: editingPost.title || '',
          description: editingPost.description || '',
          content: editingPost.content || editingPost.description || '',
          category: categoryName || '', 
          selectedCategory: categoryName || '',
          categoryId: categoryId
        })
      } else {
        setFormData({
          title: '',
          description: '',
          content: '',
          category: '',
          selectedCategory: '',
          categoryId: null
        })
      }
    }
  }, [show, editingPost])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
      ...(name === 'title' && { description: value })
    }))
  }

  const handleCategorySelect = (categoryName) => {
    const selectedCat = dbCategories.find(cat => cat.name === categoryName)
    setFormData(prevState => ({
      ...prevState,
      selectedCategory: categoryName,
      category: categoryName,
      categoryId: selectedCat?.id || null
    }))
    setIsDropdownOpen(false)
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

  const checkContentFilter = () => {
    const titleCheck = checkContent(formData.title)
    const contentCheck = checkContent(formData.content)
    
    // Return the highest severity level found
    if (titleCheck && titleCheck.level === 1) return titleCheck
    if (contentCheck && contentCheck.level === 1) return contentCheck
    if (titleCheck && titleCheck.level === 2) return titleCheck
    if (contentCheck && contentCheck.level === 2) return contentCheck
    if (titleCheck && titleCheck.level === 3) return titleCheck
    if (contentCheck && contentCheck.level === 3) return contentCheck
    
    return null
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
        title: formData.title.trim(),
        content: formData.content,
        category_id: formData.categoryId
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
        
        // Check if Level 2 content needs admin notification
        const filterCheck = checkContentFilter()
        if (filterCheck && filterCheck.level === 2 && response.data?.id) {
          try {
            await axiosInstance.post(`/forum/discussion/${response.data.id}/report`, {
              reportType: 'auto report',
              reason: 'Auto-flagged for review - Level 2 content detected',
              flagged_words: filterCheck.found
            })
          } catch (notifyError) {
            console.error('Failed to notify admin:', notifyError)
          }
        }
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
          selectedCategory: '',
          categoryId: null
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
      selectedCategory: '',
      categoryId: null
    })
    setFormSubmitted(false)
    setLoading(false)
    setShowDeleteConfirm(false)
    setShowContentWarning(false)
    setShowUserAgreement(false)
    setIsDropdownOpen(false)
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

                    {/* Category Selection */}
          <div className="mb-3" style={{ position: 'relative' }}>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)',
                borderRadius: '12px',
                padding: '12px 16px',
                backgroundColor: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '14px',
                color: formData.selectedCategory ? 'black' : '#999',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {formData.selectedCategory && (
                  <img 
                    src={getCategoryIcon(formData.selectedCategory)}
                    alt=""
                    style={{ width: '18px', height: '18px' }}
                  />
                )}
                <span>{formData.selectedCategory || 'Select a category'}</span>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none"
                style={{
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <path d="M6 8L2 4H10L6 8Z" fill="#666"/>
              </svg>
            </div>
            
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.25)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  zIndex: 1000,
                  maxHeight: '250px',
                  overflowY: 'auto',
                  padding: '10px'
                }}
              >
                {categories.map((category) => (
                  <div
                    key={category.name}
                    onClick={() => handleCategorySelect(category.name)}
                    style={{
                      padding: '8px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'transparent',
                      borderRadius: '8px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `#45B7D120`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ color: 'black', fontWeight: formData.selectedCategory === category.name ? '600' : '400' }}>
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {formSubmitted && !formData.category && (
              <div className="text-danger mt-2" style={{ fontSize: '12px' }}>
                Please select a category
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
                {/* {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : null} */}
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
                {/* {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : null} */}
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
              position: 'relative'
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
                    gap: '10px',
                    padding: '15px',
                    justifyContent:'center',
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

export default StartNewDiscussionModal