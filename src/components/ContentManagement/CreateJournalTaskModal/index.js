import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'
import axiosInstance from '../../../utils/AxiosInstance'
import {
  attachGlobalIdToPayload,
  getClientAndGlobalBody,
  getClientPayloadValue
} from '../../../utils/clientHostname'
import { toast } from 'react-toastify'
import UserManagementPopup from '../../UserManagment/AlertPopup'
import './index.css'

const CreateJournalTaskModal = ({
  show,
  onClose,
  onSave,
  contentId,
  journalLevelId,
  mode = 'add',
  taskData = null,
  category = 'student-leadership'
}) => {
  const [journalTitle, setJournalTitle] = useState('')
  const [journalText, setJournalText] = useState('')
  const [journalVideoTitle, setJournalVideoTitle] = useState('')
  const [journalVideoUrl, setJournalVideoUrl] = useState('')
  const [journalVideoThumbnailUrl, setJournalVideoThumbnailUrl] = useState('')
  const [journalVideoFile, setJournalVideoFile] = useState(null)
  const [journalThumbnailFile, setJournalThumbnailFile] = useState(null)
  const [journalVideoPreview, setJournalVideoPreview] = useState(null)
  const [journalThumbnailPreview, setJournalThumbnailPreview] = useState(null)
  const [activeTab, setActiveTab] = useState('video')
  const [currentMode, setCurrentMode] = useState(mode)
  const [loading, setLoading] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [modalHeaderTitle, setModalHeaderTitle] = useState('Section Intro')

  const isViewMode = currentMode === 'view'
  const isEditMode = currentMode === 'edit'
  const isAddMode = currentMode === 'add'

  useEffect(() => {
    setModalHeaderTitle(
      category === 'student-leadership' ? 'Section Intro' : 'Level Intro'
    )
  }, [isViewMode, isEditMode])

  const quillModules = {
    toolbar: isViewMode
      ? false
      : [
          ['bold', 'italic', 'blockquote'],
          [{ align: [] }, { align: 'center' }, { align: 'right' }],
          [{ list: 'ordered' }, { list: 'bullet' }],
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

  // Load task data when taskData changes
  useEffect(() => {
    if (taskData && show) {
      console.log('CreateJournalTaskModal - taskData received:', taskData)
      setJournalTitle(taskData.title || '')
      setJournalText(taskData.information || '')
      setJournalVideoTitle(taskData.videoTitle || '')
      setJournalVideoUrl(taskData.videoUrl || '')
      setJournalVideoThumbnailUrl(taskData.thumbnailUrl || '')
      setJournalVideoPreview(taskData.videoUrl || '')
      setJournalThumbnailPreview(taskData.thumbnailUrl || '')
      setCurrentMode(mode)
    } else if (!taskData && show) {
      setJournalTitle('')
      setJournalText('')
      setJournalVideoTitle('')
      setJournalVideoUrl('')
      setJournalVideoThumbnailUrl('')
      setJournalVideoFile(null)
      setJournalThumbnailFile(null)
      setJournalVideoPreview(null)
      setJournalThumbnailPreview(null)
      setActiveTab('video')
      setCurrentMode(mode)
    }
  }, [taskData, mode, show])

  const handleJournalVideoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setJournalVideoFile(file)
    setJournalVideoPreview(URL.createObjectURL(file))
    setUploadingVideo(true)

    try {
      const videoFormData = new FormData()
      videoFormData.append('video', file)

      const videoUploadResponse = await axiosInstance.post(
        '/upload/journal-video',
        videoFormData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (videoUploadResponse.data.success) {
        setJournalVideoUrl(videoUploadResponse.data.fileLocation)
        toast.success('Video uploaded successfully')
      } else {
        toast.error('Failed to upload journal video')
      }
    } catch (error) {
      console.error('Error uploading journal video:', error)
      toast.error('Failed to upload journal video: ' + error.message)
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleJournalThumbnailUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setJournalThumbnailFile(file)
    setJournalThumbnailPreview(URL.createObjectURL(file))
    setUploadingThumbnail(true)

    try {
      const thumbnailFormData = new FormData()
      thumbnailFormData.append('img', file)

      const thumbnailUploadResponse = await axiosInstance.post(
        '/upload/journal-img',
        thumbnailFormData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      if (thumbnailUploadResponse.data.success) {
        setJournalVideoThumbnailUrl(thumbnailUploadResponse.data.fileLocation)
        setJournalThumbnailPreview(thumbnailUploadResponse.data.fileLocation)
        toast.success('Thumbnail uploaded successfully')
      } else {
        toast.error('Failed to upload journal thumbnail')
      }
    } catch (error) {
      console.error('Error uploading journal thumbnail:', error)
      toast.error('Failed to upload journal thumbnail: ' + error.message)
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handleDeleteJournalVideo = () => {
    setJournalVideoFile(null)
    setJournalVideoPreview(null)
    setJournalVideoUrl('')
    const videoInput = document.getElementById('journal-video-upload')
    if (videoInput) videoInput.value = ''
  }

  const handleDeleteJournalThumbnail = () => {
    setJournalThumbnailFile(null)
    setJournalThumbnailPreview(null)
    setJournalVideoThumbnailUrl('')
    const thumbnailInput = document.getElementById('journal-thumbnail-upload')
    if (thumbnailInput) thumbnailInput.value = ''
  }

  const handleSave = async () => {
    if (!journalTitle) {
      toast.error('Please provide a journal title')
      return
    }

    setLoading(true)
    try {
      const taskGlobalId =
        taskData?.globalId ??
        taskData?.journal?.globalId ??
        taskData?.journalData?.globalId

      const clientPayload = getClientPayloadValue(null)
      const payload = {
        title: journalTitle,
        category: category,
        journalLevel: journalLevelId,
        platform: 'instructor',
        order: taskData?.order || 0,
        parentId: null,
        videoUrl: journalVideoUrl || null,
        videoTitle: journalVideoTitle || null,
        thumbnailUrl: journalVideoThumbnailUrl || null,
        information: journalText || null,
        reflectionItems: [],
        isSection: modalHeaderTitle === 'Section Intro',
        ...(clientPayload && clientPayload !== 'all'
          ? { client: clientPayload }
          : {})
      }

      let response
      if (isEditMode && taskData?.id) {
        response = await axiosInstance.put(
          `/LtsJournals/${taskData.id}/edit-with-content`,
          attachGlobalIdToPayload(payload, taskGlobalId)
        )
        toast.success('Journal task updated successfully!')
      } else {
        response = await axiosInstance.post(
          '/LtsJournals/create-with-content',
          payload
        )
        toast.success('Journal task created successfully!')
      }

      if (response.data.success) {
        handleClose()
        if (onSave) onSave()
      } else {
        throw new Error('Failed to save journal task')
      }
    } catch (error) {
      console.error('Error saving journal task:', error)
      toast.error(`Failed to save journal task: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Reset all state
    setJournalTitle('')
    setJournalText('')
    setJournalVideoTitle('')
    setJournalVideoUrl('')
    setJournalVideoThumbnailUrl('')
    setJournalVideoFile(null)
    setJournalThumbnailFile(null)
    setJournalVideoPreview(null)
    setJournalThumbnailPreview(null)
    setActiveTab('video')
    setCurrentMode('add')
    setShowDeleteModal(false)
    onClose()
  }

  const handleDelete = () => {
    if (!taskData?.id) return
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!taskData?.id) {
      toast.error('Task data is missing. Cannot delete.')
      setShowDeleteModal(false)
      return
    }

    setLoading(true)
    try {
      const deleteGlobalId =
        taskData?.globalId ??
        taskData?.journal?.globalId ??
        taskData?.journalData?.globalId
      await axiosInstance.delete(
        `/LtsJournals/${taskData.id}/delete-with-content`,
        { data: getClientAndGlobalBody(null, deleteGlobalId) }
      )
      toast.success('Journal task deleted successfully!')
      setShowDeleteModal(false)
      if (onSave) onSave({ deleted: true, id: taskData.id })
      handleClose()
    } catch (error) {
      console.error('Error deleting journal task:', error)
      toast.error(
        error.response?.data?.message || 'Failed to delete journal task'
      )
    } finally {
      setLoading(false)
    }
  }

  if (!show && !showDeleteModal) return null

  return (
    <>
      {/* Delete Confirmation Modal */}
      <UserManagementPopup
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title='Delete Task?'
        message='Are you sure you want to delete this task?'
        cancelText='NO, TAKE ME BACK'
        confirmText='YES, DELETE TASK'
        loading={loading}
      />
      {show && !showDeleteModal && (
        <div
          className='add-section-introduction-modal-overlay'
          style={{ zIndex: 10000 }}
        >
          <div className='add-section-modal'>
            <div className='modal-header'>
              <div className='circle-icon-heading'>
                <div className='circle-icon'>
                  <div className='icon-circle-bg'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                    >
                      <path
                        d='M3.33301 10.0003V2.26699C3.33301 1.93464 3.60164 1.66602 3.93301 1.66602H13.5011C13.6603 1.66602 13.8129 1.72923 13.9254 1.84175L16.4906 4.40695C16.6031 4.51947 16.6663 4.67208 16.6663 4.83121V17.7327C16.6663 18.0641 16.3977 18.3327 16.0663 18.3327H9.16634'
                        stroke='black'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                      <path
                        d='M13.333 1.66602V4.39935C13.333 4.73072 13.6016 4.99935 13.933 4.99935H16.6663'
                        stroke='black'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                      <path
                        d='M1.66016 15.834H4.16016M6.66016 15.834H4.16016M4.16016 15.834V13.334M4.16016 15.834V18.334'
                        stroke='black'
                        stroke-width='1.5'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      />
                    </svg>
                  </div>
                </div>
                <p className='modal-title'>
                  {isViewMode
                    ? `View ${modalHeaderTitle}`
                    : isEditMode
                      ? `Edit ${modalHeaderTitle}`
                      : `${modalHeaderTitle}`}
                </p>
              </div>
            </div>

            <div style={{ padding: '0 40px' }}>
              <div className='form-section'>
                {/* Sections Content */}
                <div className='sections-content'>
                  <div className='tab-navigation'>
                    <button
                      className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                      onClick={() => setActiveTab('video')}
                    >
                      Section Intro Video
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'intro' ? 'active' : ''}`}
                      onClick={() => setActiveTab('intro')}
                    >
                      Section Intro
                    </button>
                  </div>

                  {activeTab === 'intro' && (
                    <div className='sections-panel'>
                      <div className='sections-box'>
                        <div className='section-details-placeholder'>
                          <div className='d-flex flex-column justify-content-start align-items-start'>
                            <label>Journal Task Title:</label>
                            <input
                              style={{
                                border: '1px solid rgba(227, 229, 233, 0.50)',
                                borderRadius: '8px',
                                padding: '12px 18px',
                                width: '100%',
                                height: '100%',
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#333',
                                backgroundColor: 'transparent',
                                marginBottom: '20px',
                                boxShadow:
                                  '0px 4px 10px 0px rgba(0, 0, 0, 0.25)'
                              }}
                              type='text'
                              placeholder='Add journal task title...'
                              value={journalTitle}
                              onChange={(e) => setJournalTitle(e.target.value)}
                              readOnly={isViewMode}
                              disabled={isViewMode}
                            />
                          </div>
                          <div className='d-flex flex-column justify-content-start align-items-start w-100'>
                            <label>Journal Task Content:</label>
                            <ReactQuill
                              value={journalText}
                              onChange={setJournalText}
                              modules={quillModules}
                              formats={quillFormats}
                              readOnly={isViewMode}
                              style={
                                isViewMode
                                  ? {
                                      backgroundColor: '#f9fafb',
                                      cursor: 'not-allowed'
                                    }
                                  : {}
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'video' && (
                    <>
                      <div className='upload-section'>
                        <div
                          className='sections-panel'
                          style={{ gridColumn: '1 / -1' }}
                        >
                          <div className='d-flex flex-column justify-content-start align-items-start'>
                            <label>Video Title:</label>
                            <input
                              style={{
                                border: '1px solid rgba(227, 229, 233, 0.50)',
                                borderRadius: '8px',
                                padding: '12px 18px',
                                width: '100%',
                                height: '100%',
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#333',
                                backgroundColor: 'transparent',
                                boxShadow:
                                  '0px 4px 10px 0px rgba(0, 0, 0, 0.25)'
                              }}
                              type='text'
                              placeholder='Add video title...'
                              value={journalVideoTitle}
                              onChange={(e) =>
                                setJournalVideoTitle(e.target.value)
                              }
                              readOnly={isViewMode}
                              disabled={isViewMode}
                            />
                          </div>
                        </div>
                        <div className='upload-box'>
                          <div className='upload-header'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='20'
                              height='20'
                              viewBox='0 0 20 20'
                              fill='none'
                            >
                              <g clipPath='url(#clip0_3699_20014)'>
                                <path
                                  d='M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z'
                                  stroke='black'
                                  strokeWidth='1.5'
                                  strokeLinejoin='round'
                                />
                              </g>
                              <defs>
                                <clipPath id='clip0_3699_20014'>
                                  <rect width='20' height='20' fill='white' />
                                </clipPath>
                              </defs>
                            </svg>
                            <span>Upload Video</span>
                          </div>

                          {journalVideoPreview ? (
                            <div className='upload-preview' style={{ position: 'relative' }}>
                              {uploadingVideo && (
                                <div style={{
                                  position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)',
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                  zIndex: 10, borderRadius: '12px'
                                }}>
                                  <div className='spinner-border text-primary' role='status' />
                                  <span style={{ marginTop: 8, fontWeight: 500, fontSize: 13 }}>Uploading video...</span>
                                </div>
                              )}
                              {!isViewMode && !uploadingVideo && (
                                <button
                                  className='delete-preview-btn'
                                  onClick={handleDeleteJournalVideo}
                                  type='button'
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              )}
                              <video
                                src={journalVideoPreview}
                                controls
                                className='video-preview'
                              >
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <>
                              {!isViewMode && (
                                <>
                                  <input
                                    type='file'
                                    id='journal-video-upload'
                                    accept='video/*'
                                    onChange={handleJournalVideoUpload}
                                    style={{ display: 'none' }}
                                    disabled={isViewMode}
                                  />
                                  <label
                                    htmlFor='journal-video-upload'
                                    className='upload-area'
                                  >
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      width='20'
                                      height='20'
                                      viewBox='0 0 20 20'
                                      fill='none'
                                    >
                                      <g clipPath='url(#clip0_3778_12543)'>
                                        <path
                                          d='M9.99967 18.334V10.834M9.99967 10.834L12.9163 13.7507M9.99967 10.834L7.08301 13.7507'
                                          stroke='black'
                                          strokeWidth='1.5'
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                        />
                                        <path
                                          d='M16.6663 14.6721C17.9111 14.1845 19.1663 13.0734 19.1663 10.8327C19.1663 7.49935 16.3886 6.66602 14.9997 6.66602C14.9997 4.99935 14.9997 1.66602 9.99967 1.66602C4.99967 1.66602 4.99967 4.99935 4.99967 6.66602C3.61079 6.66602 0.833008 7.49935 0.833008 10.8327C0.833008 13.0734 2.08824 14.1845 3.33301 14.6721'
                                          stroke='black'
                                          strokeWidth='1.5'
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                        />
                                      </g>
                                      <defs>
                                        <clipPath id='clip0_3778_12543'>
                                          <rect
                                            width='20'
                                            height='20'
                                            fill='white'
                                          />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                    <div className='d-flex flex-column text-center'>
                                      <p className='upload-text'>
                                        Click to upload
                                      </p>
                                      <p className='upload-subtext'>
                                        or drag and drop
                                      </p>
                                    </div>
                                    <p className='upload-info'>
                                      Only mp4, avi, or webm file format
                                      <br />
                                      supported (max. 1.5 GB)
                                    </p>
                                  </label>
                                </>
                              )}
                            </>
                          )}
                        </div>

                        <div className='upload-box'>
                          <div className='upload-header'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='20'
                              height='20'
                              viewBox='0 0 20 20'
                              fill='none'
                            >
                              <g clipPath='url(#clip0_3699_20014)'>
                                <path
                                  d='M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z'
                                  stroke='black'
                                  strokeWidth='1.5'
                                  strokeLinejoin='round'
                                />
                              </g>
                              <defs>
                                <clipPath id='clip0_3699_20014'>
                                  <rect width='20' height='20' fill='white' />
                                </clipPath>
                              </defs>
                            </svg>
                            <span>Upload Thumbnail</span>
                          </div>

                          {journalThumbnailPreview ? (
                            <div className='upload-preview' style={{ position: 'relative' }}>
                              {uploadingThumbnail && (
                                <div style={{
                                  position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)',
                                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                  zIndex: 10, borderRadius: '12px'
                                }}>
                                  <div className='spinner-border text-primary' role='status' />
                                  <span style={{ marginTop: 8, fontWeight: 500, fontSize: 13 }}>Uploading thumbnail...</span>
                                </div>
                              )}
                              {!isViewMode && !uploadingThumbnail && (
                                <button
                                  className='delete-preview-btn'
                                  onClick={handleDeleteJournalThumbnail}
                                  type='button'
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              )}
                              <img
                                src={journalThumbnailPreview}
                                alt='Journal thumbnail preview'
                                className='thumbnail-preview'
                              />
                            </div>
                          ) : (
                            <>
                              {!isViewMode && (
                                <>
                                  <input
                                    type='file'
                                    id='journal-thumbnail-upload'
                                    accept='image/*'
                                    onChange={handleJournalThumbnailUpload}
                                    style={{ display: 'none' }}
                                    disabled={isViewMode}
                                  />
                                  <label
                                    htmlFor='journal-thumbnail-upload'
                                    className='upload-area'
                                  >
                                    <svg
                                      xmlns='http://www.w3.org/2000/svg'
                                      width='20'
                                      height='20'
                                      viewBox='0 0 20 20'
                                      fill='none'
                                    >
                                      <g clipPath='url(#clip0_3778_12543)'>
                                        <path
                                          d='M9.99967 18.334V10.834M9.99967 10.834L12.9163 13.7507M9.99967 10.834L7.08301 13.7507'
                                          stroke='black'
                                          strokeWidth='1.5'
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                        />
                                        <path
                                          d='M16.6663 14.6721C17.9111 14.1845 19.1663 13.0734 19.1663 10.8327C19.1663 7.49935 16.3886 6.66602 14.9997 6.66602C14.9997 4.99935 14.9997 1.66602 9.99967 1.66602C4.99967 1.66602 4.99967 4.99935 4.99967 6.66602C3.61079 6.66602 0.833008 7.49935 0.833008 10.8327C0.833008 13.0734 2.08824 14.1845 3.33301 14.6721'
                                          stroke='black'
                                          strokeWidth='1.5'
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                        />
                                      </g>
                                      <defs>
                                        <clipPath id='clip0_3778_12543'>
                                          <rect
                                            width='20'
                                            height='20'
                                            fill='white'
                                          />
                                        </clipPath>
                                      </defs>
                                    </svg>
                                    <div className='d-flex flex-column text-center'>
                                      <p className='upload-text'>
                                        Click to upload
                                      </p>
                                      <p className='upload-subtext'>
                                        or drag and drop
                                      </p>
                                    </div>
                                    <p className='upload-info'>
                                      Only png, jpg, or jpeg file format
                                      <br />
                                      supported (max. 2Mb)
                                    </p>
                                  </label>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                padding: '0 40px',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                marginTop: '20px',
                marginBottom: '20px'
              }}
            >
              <div>
                {isViewMode && (
                  <button
                    className='save-btn'
                    onClick={() => setCurrentMode('edit')}
                    style={{ marginRight: '10px' }}
                  >
                    <p
                      style={{
                        width: 'fit-content',
                        marginBottom: '0 !important',
                        paddingBottom: '0 !important'
                      }}
                    >
                      SWITCH TO EDIT MODE
                    </p>
                  </button>
                )}
                {isEditMode && (
                  <button
                    onClick={handleDelete}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      backgroundColor: 'transparent',
                      borderRadius: '8px',
                      color: 'black',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      fontFamily: 'Montserrat',
                      border: 'none'
                    }}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                    >
                      <path
                        d='M16.1266 17.5007H3.87405C2.33601 17.5007 1.37357 15.837 2.14023 14.5037L8.26651 3.84931C9.03552 2.5119 10.9651 2.5119 11.7341 3.84931L17.8604 14.5037C18.6271 15.837 17.6646 17.5007 16.1266 17.5007Z'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                      />
                      <path
                        d='M10 7.5V10.8333'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                      />
                      <path
                        d='M10 14.1743L10.0083 14.1651'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    Delete Task
                  </button>
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  width: 'max-content',
                  justifyContent: 'flex-end'
                }}
              >
                <button
                  className='cancel-btn'
                  onClick={handleClose}
                  disabled={loading || uploadingVideo || uploadingThumbnail}
                >
                  {isViewMode ? 'CLOSE' : 'CANCEL'}
                </button>
                {!isViewMode && (
                  <button
                    className='save-btn'
                    onClick={handleSave}
                    disabled={loading || uploadingVideo || uploadingThumbnail}
                  >
                    <p
                      style={{
                        width: 'max-content',
                        marginBottom: '0 !important',
                        paddingBottom: '0 !important'
                      }}
                    >
                      {uploadingVideo || uploadingThumbnail
                        ? 'UPLOADING...'
                        : loading
                          ? 'SAVING...'
                          : isEditMode
                            ? 'UPDATE AND CLOSE'
                            : 'SAVE AND CLOSE'}
                    </p>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CreateJournalTaskModal
