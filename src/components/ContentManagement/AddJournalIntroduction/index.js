import React, { useState } from 'react'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus, faTrash, faPencilAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'

const AddJournalIntroduction = ({ show, onClose }) => {
    const [journalTitle, setJournalTitle] = useState('')
    const [selectedIcon, setSelectedIcon] = useState('')
    const [activeTab, setActiveTab] = useState('details') // 'names' or 'details'
    const [isIconDropdownOpen, setIsIconDropdownOpen] = useState(false)
    const [sections, setSections] = useState([
        { id: 1, name: '' },
        { id: 2, name: '' }
    ])
    const [videoFile, setVideoFile] = useState(null)
    const [thumbnailFile, setThumbnailFile] = useState(null)
    const [videoPreview, setVideoPreview] = useState(null)
    const [thumbnailPreview, setThumbnailPreview] = useState(null)

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


    const handleVideoUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setVideoFile(file)
            setVideoPreview(URL.createObjectURL(file))
        }
    }

    const handleThumbnailUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            setThumbnailFile(file)
            setThumbnailPreview(URL.createObjectURL(file))
        }
    }

    const handleDeleteVideo = () => {
        setVideoFile(null)
        setVideoPreview(null)
        const videoInput = document.getElementById('video-upload')
        if (videoInput) videoInput.value = ''
    }

    const handleDeleteThumbnail = () => {
        setThumbnailFile(null)
        setThumbnailPreview(null)
        const thumbnailInput = document.getElementById('thumbnail-upload')
        if (thumbnailInput) thumbnailInput.value = ''
    }

    const handleCancel = () => {
        // Reset form
        setJournalTitle('')
        setSections([{ id: 1, name: '' }, { id: 2, name: '' }])
        setActiveTab('details')
        setIsIconDropdownOpen(false)
        setVideoFile(null)
        setThumbnailFile(null)
        setVideoPreview(null)
        setThumbnailPreview(null)
        onClose()
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
                        <p className="modal-title">Add Journal Introduction</p>
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
                                    Section Details
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
                                    <div className="sections-box">
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
                                                    value={journalTitle}
                                                    onChange={(e) => setJournalTitle(e.target.value)}
                                                    className="journal-input"
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
                                                    value={journalTitle}
                                                    onChange={(e) => setJournalTitle(e.target.value)}
                                                    className="journal-input"
                                                />
                                                <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />
                                            </div>
                                        </div>

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
                                                            id="video-upload-details"
                                                            accept="video/*"
                                                            onChange={handleVideoUpload}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <label htmlFor="video-upload-details" className="upload-area">
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
                                                            id="thumbnail-upload-details"
                                                            accept="image/*"
                                                            onChange={handleThumbnailUpload}
                                                            style={{ display: 'none' }}
                                                        />
                                                        <label htmlFor="thumbnail-upload-details" className="upload-area">
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


                                    </div>


                                </div>
                            )}

                            {activeTab === 'intro' && (
                                <div className="sections-panel">
                                    <div className="sections-box">
                                        <div className="section-details-placeholder">
                                            <div className="d-flex flex-column justify-content-start align-items-start">
                                                <label>Introduction Title:</label>
                                                <input style={{
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
                                                }} type="text" placeholder="Add section details..." />
                                            </div>
                                            <div className="d-flex flex-column justify-content-start align-items-start w-100">
                                                <label>Introduction Text:</label>
                                                <ReactQuill />
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
                            Cancel
                        </button>
                        <button className="save-btn">
                            Save
                        </button>
                    </div>
            </div>
        </div>
    )
}

export default AddJournalIntroduction

