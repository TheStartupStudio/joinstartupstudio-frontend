import React, { useState } from 'react'
import './AddJournalModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus, faTrash, faPencilAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'

const AddJournalModal = ({ show, onClose }) => {
    const [journalTitle, setJournalTitle] = useState('')
    const [selectedIcon, setSelectedIcon] = useState('')
    const [activeTab, setActiveTab] = useState('names') // 'names' or 'details'
    const [sections, setSections] = useState([
        { id: 1, name: '' },
        { id: 2, name: '' }
    ])

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

    const handleCancel = () => {
        // Reset form
        setJournalTitle('')
        setSelectedIcon('')
        setSections([{ id: 1, name: '' }, { id: 2, name: '' }])
        setActiveTab('names')
        onClose()
    }

    return (
        <div className="modal-overlay">
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
                        <p className="modal-title">Add New Journal</p>
                    </div>
                </div>

                <div style={{ padding: '0 40px' }}>
                    <div className="form-section">
                        {/* Journal Basics Section */}
                        <div className="section-group">
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
                                    <span>Journal Basics</span>
                                </div>
                            </div>

                            <div className="journal-basics-inputs">
                                <div className="input-box flex-1">
                                    <input
                                        type="text"
                                        placeholder="Add Journal Title (i.e. Leadership Journal)..."
                                        value={journalTitle}
                                        onChange={(e) => setJournalTitle(e.target.value)}
                                        className="journal-input"
                                    />
                                    <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />
                                </div>
                                <div className="input-box icon-select">
                                    <span className="select-text">Select Menu Icon</span>
                                    <FontAwesomeIcon icon={faChevronDown} className="input-icon" />
                                </div>
                            </div>
                        </div>

                        {/* Sections Content */}
                        <div className="sections-content">
                            <div className="tab-navigation">
                                <button
                                    className={`tab-btn ${activeTab === 'names' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('names')}
                                >
                                    Section Names
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    Section Details
                                </button>
                            </div>

                            {activeTab === 'names' && (
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

                                        {sections.map((section, index) => (
                                            <div key={section.id} className="section-row">
                                                <div className="reorder-icon">
                                                    <div className="reorder-lines">
                                                        <span></span>
                                                        <span></span>
                                                        <span></span>
                                                    </div>
                                                </div>
                                                <div className="input-box flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder="Add section name..."
                                                        value={section.name}
                                                        onChange={(e) => handleSectionNameChange(section.id, e.target.value)}
                                                        className="section-input"
                                                    />
                                                    <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />
                                                </div>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteSection(section.id)}
                                                    disabled={sections.length === 1}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </button>
                                            </div>
                                        ))}

                                        <div className="add-section-footer">
                                            <button className="add-new-section-btn" onClick={handleAddSection}>
                                                <span>Add New Section</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                    <path d="M5 10H10M15 10H10M10 10V5M10 10V15" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="sections-panel">
                                    <div className="sections-box">
                                        <div className="section-details-placeholder">
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
                                            <ReactQuill />
                                        </div>
                                    </div>
                                </div>
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

export default AddJournalModal

