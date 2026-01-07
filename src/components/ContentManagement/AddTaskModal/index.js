import React, { useState, useRef, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileLines, faPencilAlt, faChevronDown, faTrash } from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import './index.css'

const AddTaskModal = ({ show, onHide, onSave, levels, mode = 'add', taskData = null, source = 'content' }) => {
  const [taskTitle, setTaskTitle] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [activeTab, setActiveTab] = useState('video')
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [information, setInformation] = useState('')
  const [reflectionItems, setReflectionItems] = useState([
    { id: 1, question: '', instructions: '' },
    { id: 2, question: '', instructions: '' },
    { id: 3, question: '', instructions: '' }
  ])
  const [currentMode, setCurrentMode] = useState(mode)
  const [loading, setLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const dropdownRef = useRef(null)

  const isViewMode = currentMode === 'view'
  const isEditMode = currentMode === 'edit'
  const isAddMode = currentMode === 'add'
  const isMasterClass = source === 'masterclass'
  const isLeadership = source === 'leadership'

  const quillModules = {
    toolbar: isViewMode ? false : [
      ['bold', 'italic', 'blockquote'],
      [{ 'align': [] }, { 'align': 'center' }, { 'align': 'right' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image']
    ]
  }

  const quillFormats = [
    'bold',
    'italic',
    'blockquote',
    'align',
    'list',
    'bullet',
    'link',
    'image'
  ]

  useEffect(() => {
    setCurrentMode(mode)
  }, [mode])

  useEffect(() => {
    // Only load data when taskData changes, not when mode changes
    if (taskData && taskData.id) {
      console.log('Loading taskData in modal:', taskData)
      console.log('Current mode:', currentMode)
      console.log('Current reflectionItems before loading:', reflectionItems)
      console.log('isLoadingData:', isLoadingData)

      setIsLoadingData(true)

      setTaskTitle(taskData.title || '')
      setSelectedLevel(taskData.level || '')
      setActiveTab(taskData.contentType || 'video')
      setInformation(taskData.information || '')

      // CRITICAL: Only update reflection items if we have valid data
      // This prevents reflection items from being reset during mode switches or loading
      if (taskData.reflectionItems && Array.isArray(taskData.reflectionItems) && taskData.reflectionItems.length > 0) {
        console.log('Setting reflection items from taskData:', taskData.reflectionItems)
        setReflectionItems(taskData.reflectionItems)
      } else if (currentMode === 'add') {
        // Only reset for new items in add mode
        console.log('Resetting reflection items for add mode')
        if (isLeadership) {
          setReflectionItems([
            { id: 1, question: '', instructions: '' },
            { id: 2, question: '', instructions: '' },
            { id: 3, question: '', instructions: '' }
          ])
        } else {
          setReflectionItems([{ id: 1, question: '', instructions: '' }])
        }
      }
      // For edit/view modes, NEVER reset reflection items - preserve them

      if (taskData.videoUrl) {
        setVideoPreview(taskData.videoUrl)
      }
      if (taskData.thumbnailUrl) {
        setThumbnailPreview(taskData.thumbnailUrl)
      }

      setIsLoadingData(false)
    }
  }, [taskData?.id, taskData?.reflectionItems]) // Only depend on specific taskData properties

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSave = async () => {
    if (!taskTitle || !selectedLevel) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      let videoUrl = videoPreview
      let thumbnailUrl = thumbnailPreview

      // Step 1: Upload video file if it's a new file (not a URL)
      if (videoFile && videoFile instanceof File) {
        toast.info('Uploading video...')
        const videoFormData = new FormData()
        videoFormData.append('video', videoFile)
        
        const videoUploadResponse = await axiosInstance.post('/upload/journal-video', videoFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        if (videoUploadResponse.data.success) {
          videoUrl = videoUploadResponse.data.fileLocation
          toast.success('Video uploaded successfully!')
        }
      }

      // Step 2: Upload thumbnail file if it's a new file (not a URL)
      if (thumbnailFile && thumbnailFile instanceof File) {
        toast.info('Uploading thumbnail...')
        const thumbnailFormData = new FormData()
        thumbnailFormData.append('img', thumbnailFile)
        
        const thumbnailUploadResponse = await axiosInstance.post('/upload/journal-img', thumbnailFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        if (thumbnailUploadResponse.data.success) {
          thumbnailUrl = thumbnailUploadResponse.data.fileLocation
          toast.success('Thumbnail uploaded successfully!')
        }
      }

      // Step 3: Find the level ID from the selected level title
      const selectedLevelObj = levels.find(l => {
        const levelTitle = typeof l === 'string' ? l : l.title
        return levelTitle === selectedLevel
      })
      const levelId = selectedLevelObj && typeof selectedLevelObj !== 'string' ? selectedLevelObj.id : null

      // Step 4: Prepare reflection items (filter out empty questions)
      const filteredReflectionItems = (activeTab === 'reflection' || isLeadership) 
        ? reflectionItems.filter(item => {
            // Remove HTML tags to check if question is truly empty
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = item.question
            const textContent = tempDiv.textContent || tempDiv.innerText || ''
            return textContent.trim() !== ''
          })
        : []

      // Step 5: Create or update the journal
      const payload = {
        title: taskTitle,
        category: isMasterClass ? 'master-class' : isLeadership ? 'student-leadership' : 'entrepreneurship',
        journalLevel: levelId,
        platform: 'instructor',
        order: taskData?.order || 0,
        parentId: null,
        videoUrl: videoUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        information: (isLeadership || isMasterClass) ? (information || null) : null,
        reflectionItems: filteredReflectionItems
      }

      let response
      if (isEditMode && taskData?.id) {
        // Update existing journal using new edit endpoint
        toast.info('Updating task...')
        response = await axiosInstance.put(`/LtsJournals/${taskData.id}/edit-with-content`, payload)
        toast.success('Task updated successfully!')
      } else {
        // Create new journal
        toast.info('Creating task...')
        response = await axiosInstance.post('/LtsJournals/create-with-content', payload)
        toast.success('Task created successfully!')
      }

      // Response structure:
      // {
      //   success: true,
      //   message: "LTS Journal created/updated successfully",
      //   journal: {
      //     id, title, content, videoIds, JournalImage,
      //     entries: [...], video: {...}, videos: [...], JournalImg: {...}
      //   }
      // }

      onSave(response.data.journal)
      handleClose()
    } catch (error) {
      console.error('Error saving journal:', error)
      toast.error(error.response?.data?.message || 'Failed to save journal')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTaskTitle('')
    setSelectedLevel('')
    setActiveTab('video')
    setVideoFile(null)
    setThumbnailFile(null)
    setVideoPreview(null)
    setThumbnailPreview(null)
    setInformation('')
    setReflectionItems(
      isLeadership 
        ? [
            { id: 1, question: '', instructions: '' },
            { id: 2, question: '', instructions: '' },
            { id: 3, question: '', instructions: '' }
          ]
        : [{ id: 1, question: '', instructions: '' }]
    )
    setIsDropdownOpen(false)
    setCurrentMode(mode)
    onHide()
  }

  const handleSwitchToEditMode = () => {
    console.log('Switching to edit mode, current reflection items:', reflectionItems)
    console.log('Current taskData:', taskData)

    // When switching from view to edit, preserve all current data
    // Update the taskData to reflect the current state before switching modes
    if (taskData) {
      const updatedTaskData = {
        ...taskData,
        reflectionItems: reflectionItems, // Preserve current reflection items
        information: information, // Preserve current information
        title: taskTitle,
        level: selectedLevel,
        contentType: activeTab,
        videoUrl: videoPreview,
        thumbnailUrl: thumbnailPreview
      }
      console.log('Updated taskData for edit mode:', updatedTaskData)
      // Note: We can't directly update taskData prop, but we can ensure the state is preserved
    }

    setCurrentMode('edit')
    setActiveTab("video")
  }

  const handleDelete = async () => {
    if (!taskData?.id) return

    const confirmDelete = window.confirm(`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`)
    if (!confirmDelete) return

    setLoading(true)
    try {
      await axiosInstance.delete(`/LtsJournals/${taskData.id}/delete-with-content`)
      toast.success('Task deleted successfully!')
      onSave({ deleted: true, id: taskData.id })
      handleClose()
    } catch (error) {
      console.error('Error deleting task:', error)
      toast.error(error.response?.data?.message || 'Failed to delete task')
    } finally {
      setLoading(false)
    }
  }

  const handleVideoUpload = (e) => {
    if (isViewMode) return
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const handleThumbnailUpload = (e) => {
    if (isViewMode) return
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  const handleDeleteVideo = () => {
    if (isViewMode) return
    setVideoFile(null)
    setVideoPreview(null)
    const videoInput = document.getElementById('video-upload')
    if (videoInput) videoInput.value = ''
  }

  const handleDeleteThumbnail = () => {
    if (isViewMode) return
    setThumbnailFile(null)
    setThumbnailPreview(null)
    const thumbnailInput = document.getElementById('thumbnail-upload')
    if (thumbnailInput) thumbnailInput.value = ''
  }

  const handleLevelSelect = (level) => {
    if (isViewMode) return
    // Store the level object or title depending on what's passed
    setSelectedLevel(typeof level === 'string' ? level : level.title)
    setIsDropdownOpen(false)
  }

  const handleQuestionChange = (id, value) => {
    if (isViewMode) return
    setReflectionItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, question: value } : item
      )
    )
  }

  const handleInstructionsChange = (id, value) => {
    if (isViewMode) return
    setReflectionItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, instructions: value } : item
      )
    )
  }

  const addNewReflectionItem = () => {
    if (isViewMode) return
    const newId = Math.max(...reflectionItems.map(item => item.id), 0) + 1
    setReflectionItems([...reflectionItems, { id: newId, question: '', instructions: '' }])
  }

  const deleteReflectionItem = (id) => {
    if (isViewMode) return
    if (isLeadership && reflectionItems.length > 1) {
      setReflectionItems(reflectionItems.filter(item => item.id !== id))
    } else if (!isLeadership && reflectionItems.length > 1) {
      setReflectionItems(reflectionItems.filter(item => item.id !== id))
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const toggleDropdown = () => {
    if (isViewMode) return
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <Modal show={show} onHide={handleClose} centered size="lg" className="add-task-content-management-modal">
      <Modal.Body className="add-task-modal-body">
        <div className="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3.33301 10.0003V2.26699C3.33301 1.93562 3.60164 1.66699 3.93301 1.66699H13.5011C13.6603 1.66699 13.8129 1.73021 13.9254 1.84273L16.4906 4.40792C16.6031 4.52044 16.6663 4.67306 16.6663 4.83219V17.7337C16.6663 18.065 16.3977 18.3337 16.0663 18.3337H9.16634" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.333 1.66699V4.40033C13.333 4.7317 13.6016 5.00033 13.933 5.00033H16.6663" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.66016 15.833H4.16016M6.66016 15.833H4.16016M4.16016 15.833V13.333M4.16016 15.833V18.333" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h5 className="modal-title">
          {isViewMode ? (isMasterClass ? 'View Master Class' : 'View Task') : isEditMode ? (isMasterClass ? 'Edit Master Class' : 'Edit Task') : (isMasterClass ? 'Add New Master Class' : 'Add New Task')}
        </h5>

        {isViewMode && (
          <div className="modal-close-edit-container">
            <div 
              onClick={handleSwitchToEditMode}
              style={{ cursor: 'pointer' }}
              title={isMasterClass ? "Edit master class" : "Edit task"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M17.9539 7.06445L20.1575 4.86091C20.9385 4.07986 22.2049 4.07986 22.9859 4.86091L25.4608 7.33579C26.2418 8.11683 26.2418 9.38316 25.4608 10.1642L23.2572 12.3678M17.9539 7.06445L5.80585 19.2125C5.47378 19.5446 5.26915 19.983 5.22783 20.4508L4.88296 24.3546C4.82819 24.9746 5.34707 25.4935 5.96708 25.4387L9.87093 25.0939C10.3387 25.0525 10.7771 24.8479 11.1092 24.5158L23.2572 12.3678M17.9539 7.06445L23.2572 12.3678" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div 
              onClick={handleClose}
              style={{ cursor: 'pointer' }}
              title="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M8.44686 21.5533L15.0002 15M21.5535 8.4467L15.0002 15M15.0002 15L8.44686 8.4467M15.0002 15L21.5535 21.5533" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">{isMasterClass ? 'MASTER CLASS TITLE:' : 'TASK TITLE:'}</label>
          <div className="input-wrapper">
            <input
              type="text"
              className="form-control task-title-input"
              placeholder={isMasterClass ? "Add master class title here..." : "Add task title here..."}
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              readOnly={isViewMode}
              disabled={isViewMode}
              style={isViewMode ? { backgroundColor: '#f9fafb', cursor: 'not-allowed' } : {}}
            />
            {!isViewMode && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{isMasterClass ? 'CONNECTED MASTER CLASS LEVEL' : 'CONNECTED AIE LEVEL'}</label>
          <div className="custom-level-dropdown" ref={dropdownRef}>
            <div 
              className="level-dropdown-trigger"
              onClick={toggleDropdown}
              style={isViewMode ? { cursor: 'not-allowed', opacity: 0.7 } : { cursor: 'pointer' }}
            >
              <span className={selectedLevel ? 'selected-text' : 'placeholder-text'}>
                {selectedLevel || (isMasterClass ? 'Select master class level' : 'Select AIE level')}
              </span>
              {!isViewMode && (
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
                />
              )}
            </div>
            
            {isDropdownOpen && !isViewMode && (
              <div className="level-dropdown-menu">
                {levels.map((level, index) => {
                  const levelTitle = typeof level === 'string' ? level : level.title
                  return (
                    <div
                      key={typeof level === 'string' ? index : level.id}
                      className="level-dropdown-item"
                      onClick={() => handleLevelSelect(level)}
                    >
                      {levelTitle}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {!isMasterClass && !isLeadership && (
          <div className="form-group">
            <label className="form-label">CONTENT:</label>
            <div className="content-tabs">
              <button
                className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                onClick={() => handleTabChange('video')}
                style={{ cursor: 'pointer' }}
              >
                Video
              </button>
              <button
                className={`tab-btn ${activeTab === 'reflection' ? 'active' : ''}`}
                onClick={() => handleTabChange('reflection')}
                style={{ cursor: 'pointer' }}
              >
                Reflection
              </button>
            </div>
          </div>
        )}

        {isLeadership && (
          <div className="form-group">
            <label className="form-label">CONTENT:</label>
            <div className="content-tabs">
              <button
                className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                onClick={() => handleTabChange('video')}
                style={{ cursor: 'pointer' }}
              >
                Video
              </button>
              <button
                className={`tab-btn ${activeTab === 'reflection' ? 'active' : ''}`}
                onClick={() => handleTabChange('reflection')}
                style={{ cursor: 'pointer' }}
              >
                Reflection
              </button>
            </div>
          </div>
        )}

        {(isMasterClass || activeTab === 'video') ? (
          <>
            <div className="upload-section">
              <div className="upload-box">
                <div className="upload-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_3699_20014)">
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_3699_20014">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Upload Video</span>
                </div>
                
                {videoPreview ? (
                  <div className="upload-preview">
                    {!isViewMode && (
                      <button 
                        className="delete-preview-btn"
                        onClick={handleDeleteVideo}
                        type="button"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                    <video 
                      src={videoPreview} 
                      controls 
                      className="video-preview"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : !isViewMode && (
                  <>
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="video-upload" className="upload-area">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_3778_12543)">
                          <path d="M9.99967 18.334V10.834M9.99967 10.834L12.9163 13.7507M9.99967 10.834L7.08301 13.7507" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16.6663 14.6721C17.9111 14.1845 19.1663 13.0734 19.1663 10.8327C19.1663 7.49935 16.3886 6.66602 14.9997 6.66602C14.9997 4.99935 14.9997 1.66602 9.99967 1.66602C4.99967 1.66602 4.99967 4.99935 4.99967 6.66602C3.61079 6.66602 0.833008 7.49935 0.833008 10.8327C0.833008 13.0734 2.08824 14.1845 3.33301 14.6721" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_3778_12543">
                            <rect width="20" height="20" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                      <div className="d-flex flex-column text-center">
                        <p className="upload-text">Click to upload</p>
                        <p className="upload-subtext">or drag and drop</p>
                      </div>
                      <p className="upload-info">
                        Only mp4, avi, or webm file format<br />
                        supported (max. 50Mb)
                      </p>
                    </label>
                  </>
                )}
              </div>

              <div className="upload-box">
                <div className="upload-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_3699_20014)">
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_3699_20014">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Upload Thumbnail</span>
                </div>
                
                {thumbnailPreview ? (
                  <div className="upload-preview">
                    {!isViewMode && (
                      <button 
                        className="delete-preview-btn"
                        onClick={handleDeleteThumbnail}
                        type="button"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview"
                      className="thumbnail-preview"
                    />
                  </div>
                ) : !isViewMode && (
                  <>
                    <input
                      type="file"
                      id="thumbnail-upload"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="thumbnail-upload" className="upload-area">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_3778_12543)">
                          <path d="M9.99967 18.334V10.834M9.99967 10.834L12.9163 13.7507M9.99967 10.834L7.08301 13.7507" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16.6663 14.6721C17.9111 14.1845 19.1663 13.0734 19.1663 10.8327C19.1663 7.49935 16.3886 6.66602 14.9997 6.66602C14.9997 4.99935 14.9997 1.66602 9.99967 1.66602C4.99967 1.66602 4.99967 4.99935 4.99967 6.66602C3.61079 6.66602 0.833008 7.49935 0.833008 10.8327C0.833008 13.0734 2.08824 14.1845 3.33301 14.6721" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_3778_12543">
                            <rect width="20" height="20" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                      <div className="d-flex flex-column text-center">
                        <p className="upload-text">Click to upload</p>
                        <p className="upload-subtext">or drag and drop</p>
                      </div>
                      <p className="upload-info">
                        Only png, jpg, or jpeg file format<br />
                        supported (max. 2Mb)
                      </p>
                    </label>
                  </>
                )}
              </div>
            </div>

            {isLeadership && (
              <div className="reflection-section" style={{ marginTop: '24px' }}>
                <div className="reflection-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_3699_20014)">
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_3699_20014">
                        <rect width="20" height="20" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Information</span>
                </div>
                <div className="reflection-editor-area">
                  <ReactQuill
                    theme="snow"
                    value={information}
                    onChange={(value) => setInformation(value)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Add information..."
                    className="reflection-quill-editor"
                    readOnly={isViewMode}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="reflection-content">
            {reflectionItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="reflection-section">
                  <div className="reflection-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <g clipPath="url(#clip0_3699_20014)">
                        <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_3699_20014">
                          <rect width="20" height="20" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                    <span>{isLeadership ? `Reflection Question ${index + 1}` : 'Question'}</span>
                  </div>
                  <div className="reflection-editor-area">
                    <ReactQuill
                      theme="snow"
                      value={item.question}
                      onChange={(value) => handleQuestionChange(item.id, value)}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder={isLeadership ? "Add reflection question..." : "Add question..."}
                      className="reflection-quill-editor"
                      readOnly={isViewMode}
                    />
                  </div>

                    {isLeadership && !isViewMode && (
                      <div className="d-flex align-item-center justify-content-between">
                      <button 
                        className="delete-reflection-btn"
                        onClick={() => deleteReflectionItem(item.id)}
                        type="button"
                      >
                        <svg class="warning-triangle" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.1266 17.5007H3.87405C2.33601 17.5007 1.37357 15.837 2.14023 14.5037L8.26651 3.84931C9.03552 2.5119 10.9651 2.5119 11.7341 3.84931L17.8604 14.5037C18.6271 15.837 17.6646 17.5007 16.1266 17.5007Z" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M10 7.5V10.8333" stroke="black" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M10 14.1743L10.0083 14.1651" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        Delete Item(s)
                      </button>

                      <button onClick={addNewReflectionItem} className="delete-reflection-btn">
                        Add New Reflection Question

                        <svg class="plus" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </button>
                    </div>
                    )}
                </div>

                {!isLeadership && (
                  <div className="reflection-section">
                    <div className="reflection-header">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_3699_20014)">
                          <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_3699_20014">
                            <rect width="20" height="20" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                      <span>Instructions</span>
                    </div>
                    <div className="reflection-editor-area">
                      <ReactQuill
                        theme="snow"
                        value={item.instructions}
                        onChange={(value) => handleInstructionsChange(item.id, value)}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Add overview items..."
                        className="reflection-quill-editor"
                        readOnly={isViewMode}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}

            {!isViewMode && !isLeadership && (
              <div className="reflection-actions">
                {reflectionItems.length > 1 && (
                  <div className="delete-action" onClick={() => deleteReflectionItem(reflectionItems[reflectionItems.length - 1].id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M16.1266 17.5007H3.87405C2.33601 17.5007 1.37357 15.837 2.14023 14.5037L8.26651 3.84931C9.03552 2.5119 10.9651 2.5119 11.7341 3.84931L17.8604 14.5037C18.6271 15.837 17.6646 17.5007 16.1266 17.5007Z" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10 7.5V10.8333" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10 14.1743L10.0083 14.1651" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Delete Item(s)</span>
                  </div>
                )}
                <button type="button" className="add-question-btn" onClick={addNewReflectionItem}>
                  Add New Question and Instructions
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {!isViewMode && (
          <div className="modal-actions">
            {isEditMode && (
              <div className="delete-action" onClick={handleDelete} style={{ cursor: 'pointer' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.1266 17.5007H3.87405C2.33601 17.5007 1.37357 15.837 2.14023 14.5037L8.26651 3.84931C9.03552 2.5119 10.9651 2.5119 11.7341 3.84931L17.8604 14.5037C18.6271 15.837 17.6646 17.5007 16.1266 17.5007Z" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 7.5V10.8333" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 14.1743L10.0083 14.1651" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{isMasterClass ? 'Delete Master Class' : 'Delete Task'}</span>
              </div>
            )}

            <div className="d-flex gap-2">
              <button className="btn-cancel" onClick={handleClose} disabled={loading}>
                CANCEL
              </button>
              <button className="btn-save" onClick={handleSave} disabled={loading}>
                {loading ? 'SAVING...' : (isEditMode ? 'UPDATE AND CLOSE' : 'SAVE AND CLOSE')}
              </button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default AddTaskModal