import './index.css'
import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import AcademyBtn from '../../components/AcademyBtn'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import btnIcon from '../../assets/images/academy-icons/svg/material-symbols_file-copy-outline-rounded.svg'
import blueManagerBG from '../../assets/images/academy-icons/svg/bg-blue-menager.png'
import AddJournalModal from '../../components/ContentManagement/AddJournalModal'
import AddJournalIntroduction from '../../components/ContentManagement/AddJournalIntroduction'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'


const ManageContentSite = () => {
  const dispatch = useDispatch()
  const [showAddJournalModal, setShowAddJournalModal] = useState(false)
  const [showAddJournalIntroductionModal, setShowAddJournalIntroductionModal] = useState(false)
  const [journalData, setJournalData] = useState(null)
  const [modalMode, setModalMode] = useState('add') // 'add', 'edit', 'view'
  const [selectedJournalData, setSelectedJournalData] = useState(null)
  const [selectedContentId, setSelectedContentId] = useState(null)

  // Content management state
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedContent, setSelectedContent] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({})

  // Edit Content Form Component
  const EditContentForm = ({ content, onSave, onCancel }) => {
    const handleChange = (e) => {
      const { name, value } = e.target
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(editFormData)
    }

    // Initialize form data when content changes
    React.useEffect(() => {
      if (content) {
        setEditFormData({
          title: content.title || '',
          icon: content.icon || '',
          instructorName: content.instructorName || '',
          instructorTitle: content.instructorTitle || '',
          introTitle: content.introTitle || '',
          introDescription: content.introDescription || '',
          videoUrl: content.videoUrl || '',
          videoThumbnail: content.videoThumbnail || ''
        })
      }
    }, [content])

    return (
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={editFormData.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Icon</label>
            <input
              type="text"
              className="form-control"
              name="icon"
              value={editFormData.icon || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Instructor Name</label>
            <input
              type="text"
              className="form-control"
              name="instructorName"
              value={editFormData.instructorName || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Instructor Title</label>
            <input
              type="text"
              className="form-control"
              name="instructorTitle"
              value={editFormData.instructorTitle || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Intro Title</label>
            <input
              type="text"
              className="form-control"
              name="introTitle"
              value={editFormData.introTitle || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Video URL</label>
            <input
              type="url"
              className="form-control"
              name="videoUrl"
              value={editFormData.videoUrl || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Video Thumbnail</label>
            <input
              type="url"
              className="form-control"
              name="videoThumbnail"
              value={editFormData.videoThumbnail || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Intro Description</label>
            <textarea
              className="form-control"
              name="introDescription"
              value={editFormData.introDescription || ''}
              onChange={handleChange}
              rows="6"
            />
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    )
  }

  const columns = [
    {
    key: 'name',
    title: 'TASK NAME',
    sortable: true,
    filterable: true,
    width: '100%',
    className: 'manage-content-task-name-column',
    render: (value, item) => (
      <div className="task-name-cell">
        <div className={`status-dot ${item.status}`}></div>
        <span>{value}</span>
      </div>
    )
  }
  ]

  const handleSearch = (e) => {
    // Static implementation - no functionality
  }

  const handleOpenAddJournalModal = () => {
    setShowAddJournalModal(true)
  }

  const handleCloseAddJournalModal = () => {
    setShowAddJournalModal(false)
    setModalMode('add')
    setSelectedJournalData(null)
    setSelectedContentId(null)
  }

  const handleOpenAddJournalIntroductionModal = (data) => {
    setJournalData(data)
    setShowAddJournalModal(false)
    setShowAddJournalIntroductionModal(true)
  }

  const handleCloseAddJournalIntroductionModal = () => {
    setShowAddJournalIntroductionModal(false)
    setJournalData(null)
  }

  // API Functions
  const fetchContents = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/manage-content/')

      console.log('API Response:', response)
      console.log('API Response Data:', response.data)

      if (response.data.success && response.data.data) {
        console.log('Content items:', response.data.data)
        setContents(response.data.data)
      } else {
        console.log('No data in response')
        setContents([])
      }

      setError(null)
    } catch (err) {
      console.error('Error fetching contents:', err)
      setError('Failed to load content')
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const updateContent = async (contentId, updateData) => {
    try {
      const response = await axiosInstance.put(`/manage-content/${contentId}`, updateData)
      if (response.data.success) {
        toast.success('Content updated successfully')
        // Refresh the contents
        await fetchContents()
        setShowEditModal(false)
        setSelectedContent(null)
      }
    } catch (err) {
      console.error('Error updating content:', err)
      toast.error('Failed to update content')
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchContents()
  }, [])

  // Action handlers
  const handleViewContent = async (content) => {
    console.log('View clicked for content:', content)
    console.log('Available content properties:', Object.keys(content))
    console.log('Content ID value:', content.id)

    if (content.id) {
      try {
        console.log('Fetching full data for contentId:', content.id)
        const response = await axiosInstance.get(`/manage-content/full/${content.id}`)
        if (response.data.success) {
          console.log('Full data fetched:', response.data.data)
          setSelectedJournalData(response.data.data)
          setModalMode('view')
          setSelectedContentId(content.id)
          setShowAddJournalModal(true)
        } else {
          toast.error('Failed to load content data')
        }
      } catch (error) {
        console.error('Error fetching full content:', error)
        toast.error('Failed to load content data')
      }
    } else {
      console.log('No ID found on content object')
      toast.error('Content ID is required for viewing')
    }
  }

  const handleEditContent = async (content) => {
    console.log('Edit clicked for content:', content)
    console.log('Available content properties:', Object.keys(content))
    console.log('Content ID value:', content.id)

    if (content.id) {
      try {
        console.log('Fetching full data for contentId:', content.id)
        const response = await axiosInstance.get(`/manage-content/full/${content.id}`)
        if (response.data.success) {
          console.log('Full data fetched:', response.data.data)
          setSelectedJournalData(response.data.data)
          setModalMode('edit')
          setSelectedContentId(content.id)
          setShowAddJournalModal(true)
        } else {
          toast.error('Failed to load content data')
        }
      } catch (error) {
        console.error('Error fetching full content:', error)
        toast.error('Failed to load content data')
      }
    } else {
      console.log('No ID found on content object')
      toast.error('Content ID is required for editing')
    }
  }

  const handleUpdateContent = (updateData) => {
    if (selectedContent) {
      updateContent(selectedContent.id, updateData)
    }
  }

  return (
    <div className="manage-content">
      <AddJournalModal
        show={showAddJournalModal}
        onClose={handleCloseAddJournalModal}
        onProceedToIntroduction={handleOpenAddJournalIntroductionModal}
        mode={modalMode}
        existingData={selectedJournalData}
        contentId={selectedContentId}
      />
      <AddJournalIntroduction
        show={showAddJournalIntroductionModal}
        onClose={handleCloseAddJournalIntroductionModal}
        journalData={journalData}
      />

      {/* Edit Content Modal */}
      {showEditModal && selectedContent && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Content</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <EditContentForm
                  content={selectedContent}
                  onSave={handleUpdateContent}
                  onCancel={() => setShowEditModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <div className="col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
          <div className="d-flex justify-content-between flex-col-tab align-start-tab" style={{padding: '40px 40px 10px 30px'}}>
            <div className="d-flex flex-column gap-2">
              <h3 className="text-black mb-0"
                style={{
                  color: '#231F20',
                  fontFamily: 'Montserrat',
                  fontSize: '23px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: 'normal',
                }}
              >
                MANAGE CONTENT SITE
              </h3>
              <p
                style={{
                  color: '#AEAEAE',
                  fontFamily: 'Montserrat',
                  fontSize: '15px',
                  fontStyle: 'normal',
                  fontWeight: '400',
                  lineHeight: '20px',
                  marginBottom: '0px',
                }}
              >
                View and manage content site elements
              </p>
            </div>
          </div>
          <div className="menu-icon-container">
            <img
              src={require('../../assets/images/academy-icons/svg/icons8-menu.svg').default}
              alt='menu'
              className='menu-icon-cie self-start-tab cursor-pointer'
              onClick={() => dispatch(toggleCollapse())}
            />
          </div>
        </div>
      </div>

      <div className="manage-content-container position-relative">
        <img src={blueManagerBG} className='position-absolute'
        style={{
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 0,
          pointerEvents: 'none',
          width: '100dvw',
          height: '100dvh'
        }}
        alt="Decorative background"
        aria-hidden="true"
      />

        <div className='main-search-table-container'>
          <div className="search-actions-bar">
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search for content"
                  value=""
                  onChange={handleSearch}
                  className="search-input"
                />
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="actions-container">
              <div className="dropdown-wrapper">
                <div onClick={handleOpenAddJournalModal} style={{ cursor: 'pointer' }}>
                  <AcademyBtn
                    title="add new journal"
                    icon={faPlus}
                  />
                </div>
              </div>

              <div>
                <AcademyBtn
                  title="View Archive"
                  icon={btnIcon}
                />
              </div>

              <div className="dropdown-wrapper">
                <div
                  className="bulk-actions"
                >
                  <span>BULK ACTIONS</span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="table-container">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={false}
                        readOnly
                      />
                    </th>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className={column.className || ''}
                        style={{ flex: 1 }}
                      >
                        <div className="header-with-icons">
                          {column.title}
                          {column.sortable && (
                            <div className="header-icons">
                              <img src={require('../../assets/images/academy-icons/svg/Icon_Sort.svg').default} alt="graph" className="header-icon" />
                            </div>
                          )}
                          {column.filterable && (
                            <div className="header-icons">
                              <img
                                src={require('../../assets/images/academy-icons/svg/Dropdown_ Filter by Level.svg').default}
                                alt="filter"
                                className="header-icon"
                              />
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="actions-column">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="spinner-border text-primary me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Loading content...
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        <div className="alert alert-danger mb-0">
                          {error}
                          <button
                            className="btn btn-link p-0 ms-2"
                            onClick={fetchContents}
                          >
                            Retry
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : contents.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        <div className="alert alert-info mb-0">
                          No content found. Try adding new content.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    contents.map((content, index) => {
                      console.log('Rendering content item:', index, content)
                      return (
                        <tr key={content.timestamp || index}>
                          <td className="checkbox-column">
                            <input
                              type="checkbox"
                              className="checkbox"
                              readOnly
                            />
                          </td>
                          <td className="manage-content-task-name-column">
                            <div className="task-name-cell">
                              <div className="status-dot published"></div>
                              <span>{content.title || 'Untitled Content'}</span>
                            </div>
                          </td>
                        <td className="actions-column">
                          <div className="action-buttons">
                            <button
                              className="action-btn view-btn"
                              onClick={() => handleViewContent(content)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M2.5 10.8335C5.5 4.16683 14.5 4.16683 17.5 10.8335" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 14.1665C8.61929 14.1665 7.5 13.0472 7.5 11.6665C7.5 10.2858 8.61929 9.1665 10 9.1665C11.3807 9.1665 12.5 10.2858 12.5 11.6665C12.5 13.0472 11.3807 14.1665 10 14.1665Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              View
                            </button>
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleEditContent(content)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 5V19M5 12H19" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Edit
                            </button>
                            <div className="dropdown-wrapper">
                              <button className="action-btn more-actions-btn">
                                <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                                  <circle cx="2" cy="2" r="2" fill="currentColor" />
                                  <circle cx="8" cy="2" r="2" fill="currentColor" />
                                  <circle cx="14" cy="2" r="2" fill="currentColor" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageContentSite
