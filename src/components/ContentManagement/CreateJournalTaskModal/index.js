import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import './index.css'

const CreateJournalTaskModal = ({ show, onClose, onSave, contentId, journalLevelId }) => {
    const [journalTitle, setJournalTitle] = useState('')
    const [journalText, setJournalText] = useState('')
    const [journalVideoUrl, setJournalVideoUrl] = useState('')
    const [journalVideoThumbnailUrl, setJournalVideoThumbnailUrl] = useState('')
    const [journalVideoFile, setJournalVideoFile] = useState(null)
    const [journalThumbnailFile, setJournalThumbnailFile] = useState(null)
    const [journalVideoPreview, setJournalVideoPreview] = useState(null)
    const [journalThumbnailPreview, setJournalThumbnailPreview] = useState(null)
    const [activeTab, setActiveTab] = useState('intro')

    const handleJournalVideoUpload = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                setJournalVideoFile(file)
                setJournalVideoPreview(URL.createObjectURL(file))

                const videoFormData = new FormData()
                videoFormData.append('video', file)

                const videoUploadResponse = await axiosInstance.post('/upload/journal-video', videoFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (videoUploadResponse.data.success) {
                    setJournalVideoUrl(videoUploadResponse.data.fileLocation)
                    console.log('Journal video uploaded successfully:', videoUploadResponse.data.fileLocation)
                } else {
                    console.error('Journal video upload failed')
                    toast.error('Failed to upload journal video')
                }
            } catch (error) {
                console.error('Error uploading journal video:', error)
                toast.error('Failed to upload journal video: ' + error.message)
            }
        }
    }

    const handleJournalThumbnailUpload = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                setJournalThumbnailFile(file)
                setJournalThumbnailPreview(URL.createObjectURL(file))

                const thumbnailFormData = new FormData()
                thumbnailFormData.append('img', file)

                const thumbnailUploadResponse = await axiosInstance.post('/upload/journal-img', thumbnailFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (thumbnailUploadResponse.data.success) {
                    setJournalVideoThumbnailUrl(thumbnailUploadResponse.data.fileLocation)
                    setJournalThumbnailPreview(thumbnailUploadResponse.data.fileLocation)
                    console.log('Journal thumbnail uploaded successfully:', thumbnailUploadResponse.data.fileLocation)
                } else {
                    console.error('Journal thumbnail upload failed')
                    toast.error('Failed to upload journal thumbnail')
                }
            } catch (error) {
                console.error('Error uploading journal thumbnail:', error)
                toast.error('Failed to upload journal thumbnail: ' + error.message)
            }
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
        try {
            const payload = {
                title: journalTitle,
                category: 'student-leadership',
                journalLevel: journalLevelId,
                platform: 'instructor',
                order: 0,
                parentId: null,
                videoUrl: journalVideoUrl || null,
                thumbnailUrl: journalVideoThumbnailUrl || null,
                information: journalText || null,
                reflectionItems: []
            }

            const response = await axiosInstance.post('/LtsJournals/create-with-content', payload)

            if (response.data.success) {
                toast.success('Journal task created successfully!')
                handleClose()
                if (onSave) onSave()
            } else {
                throw new Error('Failed to create journal task')
            }
        } catch (error) {
            console.error('Error creating journal task:', error)
            toast.error(`Failed to create journal task: ${error.message}`)
        }
    }

    const handleClose = () => {
        // Reset all state
        setJournalTitle('')
        setJournalText('')
        setJournalVideoUrl('')
        setJournalVideoThumbnailUrl('')
        setJournalVideoFile(null)
        setJournalThumbnailFile(null)
        setJournalVideoPreview(null)
        setJournalThumbnailPreview(null)
        setActiveTab('intro')
        onClose()
    }

    if (!show) return null

    return (
        <div className="add-section-introduction-modal-overlay" style={{ zIndex: 1000000 }}>
            <div className="add-section-modal">
                <div className="modal-header">
                    <div className="circle-icon-heading">
                        <div className="circle-icon">
                            <div className="icon-circle-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M3.33301 10.0003V2.26699C3.33301 1.93464 3.60164 1.66602 3.93301 1.66602H13.5011C13.6603 1.66602 13.8129 1.72923 13.9254 1.84175L16.4906 4.40695C16.6031 4.51947 16.6663 4.67208 16.6663 4.83121V17.7327C16.6663 18.0641 16.3977 18.3327 16.0663 18.3327H9.16634" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M13.333 1.66602V4.39935C13.333 4.73072 13.6016 4.99935 13.933 4.99935H16.6663" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M1.66016 15.834H4.16016M6.66016 15.834H4.16016M4.16016 15.834V13.334M4.16016 15.834V18.334" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <p className="modal-title">Create Journal Task</p>
                    </div>
                </div>

                <div style={{ padding: '0 40px' }}>
                    <div className="form-section">
                        {/* Sections Content */}
                        <div className="sections-content">
                            <div className="tab-navigation">
                                <button
                                    className={`tab-btn ${activeTab === 'intro' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('intro')}
                                >
                                    Section Intro
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('video')}
                                >
                                    Section Intro Video
                                </button>
                            </div>

                            {activeTab === 'intro' && (
                                <div className="sections-panel">
                                    <div className="sections-box">
                                        <div className="section-details-placeholder">
                                            <div className="d-flex flex-column justify-content-start align-items-start">
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
                                                        marginBottom: '10px',
                                                        boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.25)',
                                                    }}
                                                    type="text"
                                                    placeholder="Add journal task title..."
                                                    value={journalTitle}
                                                    onChange={(e) => setJournalTitle(e.target.value)}
                                                />
                                            </div>
                                            <div className="d-flex flex-column justify-content-start align-items-start w-100">
                                                <label>Journal Task Content:</label>
                                                <ReactQuill
                                                    value={journalText}
                                                    onChange={setJournalText}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'video' && (
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

                                            {journalVideoPreview ? (
                                                <div className="upload-preview">
                                                    <button
                                                        className="delete-preview-btn"
                                                        onClick={handleDeleteJournalVideo}
                                                        type="button"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                    <video
                                                        src={journalVideoPreview}
                                                        controls
                                                        className="video-preview"
                                                    >
                                                        Your browser does not support the video tag.
                                                    </video>
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="file"
                                                        id="journal-video-upload"
                                                        accept="video/*"
                                                        onChange={handleJournalVideoUpload}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <label htmlFor="journal-video-upload" className="upload-area">
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

                                            {journalThumbnailPreview ? (
                                                <div className="upload-preview">
                                                    <button
                                                        className="delete-preview-btn"
                                                        onClick={handleDeleteJournalThumbnail}
                                                        type="button"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                    <img
                                                        src={journalThumbnailPreview}
                                                        alt="Journal thumbnail preview"
                                                        className="thumbnail-preview"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="file"
                                                        id="journal-thumbnail-upload"
                                                        accept="image/*"
                                                        onChange={handleJournalThumbnailUpload}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <label htmlFor="journal-thumbnail-upload" className="upload-area">
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
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ padding: '0 40px', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button className="cancel-btn" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="save-btn" onClick={handleSave}>
                        Create Journal Task
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateJournalTaskModal