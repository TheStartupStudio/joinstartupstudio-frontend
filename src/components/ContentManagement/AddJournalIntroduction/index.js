import React, { useState, useEffect } from 'react'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus, faTrash, faPencilAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'

const AddJournalIntroduction = ({ show, onClose, journalData = null, mode = 'add', contentId = null }) => {
    const initializeState = () => {
        if (journalData && (mode === 'edit' || mode === 'view')) {
            const manageContent = journalData.manageContent || {}
            console.log('Initializing state with manageContent:', manageContent)

            return {
                instructorName: manageContent.instructorName || '',
                instructorTitle: manageContent.instructorTitle || '',
                introductionTitle: manageContent.introTitle || '',
                introductionText: manageContent.introDescription || '',
                instructorHeadshot: manageContent.instructorHeadshot || '',
                videoUrl: manageContent.videoUrl || '',
                videoThumbnailUrl: manageContent.videoThumbnail || '',
                videoPreview: manageContent.videoUrl || null,
                thumbnailPreview: manageContent.videoThumbnail || null
            }
        }
        return {
            instructorName: '',
            instructorTitle: '',
            introductionTitle: '',
            introductionText: '',
            instructorHeadshot: '',
            videoUrl: '',
            videoThumbnailUrl: '',
            videoPreview: null,
            thumbnailPreview: null
        }
    }

    const initialState = initializeState()

    const initializeSections = () => {
        if (journalData && (mode === 'edit' || mode === 'view') && journalData.journalLevels && Array.isArray(journalData.journalLevels)) {
            return journalData.journalLevels.map((level, index) => ({
                id: level.id || (index + 1),
                name: level.title || ''
            }))
        }
        return [
            { id: 1, name: '' },
            { id: 2, name: '' }
        ]
    }

    const [instructorName, setInstructorName] = useState(initialState.instructorName)
    const [instructorTitle, setInstructorTitle] = useState(initialState.instructorTitle)
    const [introductionTitle, setIntroductionTitle] = useState(initialState.introductionTitle)
    const [introductionText, setIntroductionText] = useState(initialState.introductionText)
    const [instructorHeadshot, setInstructorHeadshot] = useState(initialState.instructorHeadshot)
    const [selectedIcon, setSelectedIcon] = useState('')
    const [activeTab, setActiveTab] = useState('details') // 'names' or 'details'
    const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false)
    const [sections, setSections] = useState(initializeSections())
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [videoPreview, setVideoPreview] = useState(initialState.videoPreview)
    const [thumbnailPreview, setThumbnailPreview] = useState(initialState.thumbnailPreview)
    const [videoUrl, setVideoUrl] = useState(initialState.videoUrl)
    const [videoThumbnailUrl, setVideoThumbnailUrl] = useState(initialState.videoThumbnailUrl)

    useEffect(() => {
        if (show && journalData && (mode === 'edit' || mode === 'view')) {
            const manageContent = journalData.manageContent || {}

            const headshotUrl = manageContent.instructorHeadshot || ''
            setInstructorName(manageContent.instructorName || '')
            setInstructorTitle(manageContent.instructorTitle || '')
            setIntroductionTitle(manageContent.introTitle || '')
            setIntroductionText(manageContent.introDescription || '')
            setInstructorHeadshot(headshotUrl)
            setVideoUrl(manageContent.videoUrl || '')
            setVideoThumbnailUrl(manageContent.videoThumbnail || '')
            setVideoPreview(manageContent.videoUrl || null)
            setThumbnailPreview(manageContent.videoThumbnail || null)

            if (journalData.journalLevels && Array.isArray(journalData.journalLevels)) {
                const mappedSections = journalData.journalLevels.map((level, index) => ({
                    id: level.id || (index + 1),
                    name: level.title || ''
                }))
                setSections(mappedSections.length > 0 ? mappedSections : [
                    { id: 1, name: '' },
                    { id: 2, name: '' }
                ])
            }
        }
    }, [show, journalData, mode])

    if (!show) return null

    const handleAddSection = () => {
        const newSection = {
            id: sections.length + 1,
            name: ''
        }
        setSections([...sections, newSection])
    }

    const handleDeleteSection = (id) => {
        if (sections.length > 1) {
            setSections(sections.filter(section => section.id !== id))
        }
    }

    const handleSectionNameChange = (id, value) => {
        setSections(sections.map(section =>
            section.id === id ? { ...section, name: value } : section
        ))
    }

    const handleIconSelect = (iconId) => {
        setIsIconDropdownOpen(false)
    }

    const handleIconDropdownToggle = () => {
        setIsIconDropdownOpen(!isIconDropdownOpen)
    }


    const handleVideoUpload = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                setVideoFile(file)
                setVideoPreview(URL.createObjectURL(file))

                // Upload video to S3
                const videoFormData = new FormData()
                videoFormData.append('video', file)

                const videoUploadResponse = await axiosInstance.post('/upload/journal-video', videoFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (videoUploadResponse.data.success) {
                    setVideoUrl(videoUploadResponse.data.fileLocation)
                    console.log('Video uploaded successfully:', videoUploadResponse.data.fileLocation)
                } else {
                    console.error('Video upload failed')
                    toast.error('Failed to upload video')
                }
            } catch (error) {
                console.error('Error uploading video:', error)
                toast.error('Failed to upload video: ' + error.message)
            }
        }
    }

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                setThumbnailFile(file)
                setThumbnailPreview(URL.createObjectURL(file))

                const thumbnailFormData = new FormData()
                thumbnailFormData.append('img', file)

                const thumbnailUploadResponse = await axiosInstance.post('/upload/journal-img', thumbnailFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (thumbnailUploadResponse.data.success) {
                    setVideoThumbnailUrl(thumbnailUploadResponse.data.fileLocation)
                    setThumbnailPreview(thumbnailUploadResponse.data.fileLocation)
                    console.log('Thumbnail uploaded successfully:', thumbnailUploadResponse.data.fileLocation)
                } else {
                    console.error('Thumbnail upload failed')
                    toast.error('Failed to upload thumbnail')
                }
            } catch (error) {
                console.error('Error uploading thumbnail:', error)
                toast.error('Failed to upload thumbnail: ' + error.message)
            }
        }
    }

    const handleHeadshotUpload = async (e) => {
        const file = e.target.files[0]
        if (file) {
            try {
                const previewUrl = URL.createObjectURL(file)

                const headshotFormData = new FormData()
                headshotFormData.append('img', file)

                const headshotUploadResponse = await axiosInstance.post('/upload/journal-img', headshotFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                if (headshotUploadResponse.data.success) {
                    setInstructorHeadshot(headshotUploadResponse.data.fileLocation)
                    console.log('Headshot uploaded successfully:', headshotUploadResponse.data.fileLocation)
                } else {
                    console.error('Headshot upload failed')
                    setInstructorHeadshot(previewUrl)
                    toast.error('Failed to upload headshot')
                }
            } catch (error) {
                console.error('Error uploading headshot:', error)
                toast.error('Failed to upload headshot: ' + error.message)
            }
        }
    }

    const handleDeleteVideo = () => {
        setVideoFile(null)
        setVideoPreview(null)
        setVideoUrl('')
        const videoInput = document.getElementById('video-upload')
        if (videoInput) videoInput.value = ''
    }

    const handleDeleteThumbnail = () => {
        setThumbnailFile(null)
        setThumbnailPreview(null)
        setVideoThumbnailUrl('')
        const thumbnailInput = document.getElementById('thumbnail-upload')
        if (thumbnailInput) thumbnailInput.value = ''
    }

    const handleDeleteHeadshot = () => {
        setInstructorHeadshot('')
        const headshotInput = document.getElementById('headshot-upload')
        if (headshotInput) headshotInput.value = ''
    }

    const handleCancel = () => {
        // Reset form
        setInstructorName('')
        setInstructorTitle('')
        setIntroductionTitle('')
        setIntroductionText('')
        setInstructorHeadshot('')
        setSections([{ id: 1, name: '' }, { id: 2, name: '' }])
        setActiveTab('details')
        setIsIconDropdownOpen(false)
        setVideoFile(null)
        setThumbnailFile(null)
        setVideoPreview(null)
        setThumbnailPreview(null)
        setVideoUrl('')
        setVideoThumbnailUrl('')
        onClose()
    }

    const handleSave = async () => {
        if (mode === 'view') return

        try {
            const updateData = {
                manageContent: {
                    instructorName,
                    instructorTitle,
                    introTitle: introductionTitle,
                    introDescription: introductionText,
                    videoUrl,
                    videoThumbnail: videoThumbnailUrl,
                    instructorHeadshot
                }
            }

            const contentIdToUse = contentId || journalData?.manageContent?.id || 1

            const response = await axiosInstance.put(`/manage-content/full/${contentIdToUse}`, updateData)

            if (response.data.success) {
                toast.success('Introduction data updated successfully!')
                onClose()
            } else {
                throw new Error('Failed to update introduction data')
            }
        } catch (error) {
            console.error('Error updating introduction data:', error)
            toast.error(`Failed to update introduction data: ${error.message}`)
        }
    }

    return (
        <div className="add-journal-instructor-modal-overlay">
            <div className="add-journal-modal">
                <div className="modal-header">
                    <div className="circle-icon-heading">
                        <div className="circle-icon">
                            <div className="icon-circle-bg">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M3.33301 9.99935V2.26602C3.33301 1.93464 3.60164 1.66602 3.93301 1.66602H13.5011C13.6603 1.66602 13.8129 1.72923 13.9254 1.84175L16.4906 4.40695C16.6031 4.51947 16.6663 4.67208 16.6663 4.83121V17.7327C16.6663 18.0641 16.3977 18.3327 16.0663 18.3327H9.16634" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M13.333 1.66602V4.39935C13.333 4.73072 13.6016 4.99935 13.933 4.99935H16.6663" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M1.66016 15.834H4.16016M6.66016 15.834H4.16016M4.16016 15.834V13.334M4.16016 15.834V18.334" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <p className="modal-title">
                            {mode === 'view' ? 'View Journal Introduction' : mode === 'edit' ? 'Edit Journal Introduction' : 'Add Journal Introduction'}
                        </p>
                    </div>
                </div>

                <div style={{ padding: '0 40px' }}>
                    <div className="form-section">
                        

                        {/* Sections Content */}
                        <div className="sections-content">
                            <div className="tab-navigation">
                                <button
                                    className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    Instructor Details
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'intro' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('intro')}
                                >
                                    Journal Intro
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('video')}
                                >
                                    Journal Intro Video
                                </button>
                            </div>

                            {activeTab === 'details' && (
                                <div className="sections-panel">
                                    <div className="d-flex gap-4 sections-box">

                                        <div className="d-flex flex-column gap-4 w-100">

                                            <div className="section-header">
                                                <div className="section-header-content">
                                                    <div className="spark-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <g clip-path="url(#clip0_4724_21225)">
                                                            <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_4724_21225">
                                                                <rect width="20" height="20" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg></div>
                                                    <span>Sections</span>
                                                </div>
                                            </div>

                                        

                                            <div className="journal-basics-inputs">
                                                <label>Instructor Name:</label>
                                                <div className="input-box flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder="Add Instructor Name..."
                                                        value={instructorName}
                                                        onChange={(e) => setInstructorName(e.target.value)}
                                                        className="journal-input"
                                                        disabled={mode === 'view'}
                                                    />
                                                    <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />
                                                </div>
                                            </div>

                                            <div className="journal-basics-inputs">
                                                <label>Instructor Title:</label>
                                                <div className="input-box flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder="Add Instructor Title..."
                                                        value={instructorTitle}
                                                        onChange={(e) => setInstructorTitle(e.target.value)}
                                                        className="journal-input"
                                                        disabled={mode === 'view'}
                                                    />
                                                    <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />
                                                </div>
                                            </div>

                                        </div>

                                        <div className="upload-section headshot">
                                            {instructorHeadshot ? (
                                                <div className="upload-preview-headshot">
                                                    <img
                                                        src={instructorHeadshot}
                                                        alt="Instructor headshot"
                                                        className="headshot-preview"
                                                        crossOrigin="anonymous"
                                                        onError={(e) => {
                                                            // Prevent infinite loop by checking if we're already using a fallback
                                                            if (!e.target.src.includes('data:image')) {
                                                                // Use a data URL for a simple gray circle as fallback
                                                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjYwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNjAiIHk9IjY1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjEyIiBmb250LWZhbWlseT0iQXJpYWwiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4='
                                                            }
                                                        }}
                                                    />
                                                    {mode !== 'view' && (
                                                        <button
                                                            className="delete-preview-btn"
                                                            onClick={handleDeleteHeadshot}
                                                            type="button"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                <input
                                                    type="file"
                                                    id="headshot-upload"
                                                    accept="image/*"
                                                    onChange={handleHeadshotUpload}
                                                    style={{ display: 'none' }}
                                                    disabled={mode === 'view'}
                                                />
                                                <label htmlFor="headshot-upload" className="upload-area">
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
                                                        <p className="upload-text">Upload Headshot</p>
                                                        <p className="upload-subtext">PNG, JPG up to 2MB</p>
                                                    </div>
                                                </label>
                                            </>
                                            )}
                                        </div>
                                    </div>


                                </div>
                            )}

                            {activeTab === 'intro' && (
                                <div className="sections-panel">
                                    <div className="sections-box">
                                        <div className="section-details-placeholder">
                                            <div className="d-flex flex-column justify-content-start align-items-start">
                                                <label>Introduction Title:</label>
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
                                                    }}
                                                    type="text"
                                                    placeholder="Add introduction title..."
                                                    value={introductionTitle}
                                                    onChange={(e) => setIntroductionTitle(e.target.value)}
                                                    disabled={mode === 'view'}
                                                />
                                            </div>
                                            <div className="d-flex flex-column justify-content-start align-items-start w-100">
                                                <label>Introduction Text:</label>
                                                <ReactQuill
                                                    value={introductionText}
                                                    onChange={setIntroductionText}
                                                    readOnly={mode === 'view'}
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

                                            {videoPreview ? (
                                                <div className="upload-preview">
                                                    <button
                                                        className="delete-preview-btn"
                                                        onClick={handleDeleteVideo}
                                                        type="button"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                    <video
                                                        src={videoPreview}
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
                                                        id="video-upload"
                                                        accept="video/*"
                                                        onChange={handleVideoUpload}
                                                        style={{ display: 'none' }}
                                                        disabled={mode === 'view'}
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
                                                    <button
                                                        className="delete-preview-btn"
                                                        onClick={handleDeleteThumbnail}
                                                        type="button"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                    <img
                                                        src={thumbnailPreview}
                                                        alt="Thumbnail preview"
                                                        className="thumbnail-preview"
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <input
                                                        type="file"
                                                        id="thumbnail-upload"
                                                        accept="image/*"
                                                        onChange={handleThumbnailUpload}
                                                        style={{ display: 'none' }}
                                                        disabled={mode === 'view'}
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
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ padding: '0 40px', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                        <button className="cancel-btn" onClick={handleCancel}>
                            {mode === 'view' ? 'Close' : 'Cancel'}
                        </button>
                        {mode !== 'view' && (
                            <button className="save-btn" onClick={handleSave}>
                                Save
                            </button>
                        )}
                    </div>
            </div>
        </div>
    )
}

export default AddJournalIntroduction

