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

  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedContent, setSelectedContent] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({})
  const [selectedItems, setSelectedItems] = useState([])
  const [showBulkDropdown, setShowBulkDropdown] = useState(false)
  const [showActionDropdown, setShowActionDropdown] = useState(null)
  const [isArchiveMode, setIsArchiveMode] = useState(false)
  const [archivedContents, setArchivedContents] = useState([])
  const [archiveLoading, setArchiveLoading] = useState(false)

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
        await fetchContents()
        setShowEditModal(false)
        setSelectedContent(null)
      }
    } catch (err) {
      console.error('Error updating content:', err)
      toast.error('Failed to update content')
    }
  }

  useEffect(() => {
    fetchContents()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showBulkDropdown && !event.target.closest('.dropdown-wrapper')) {
        setShowBulkDropdown(false)
      }
      if (showActionDropdown && !event.target.closest('.dropdown-wrapper')) {
        setShowActionDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showBulkDropdown, showActionDropdown])

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

  const handleSelectionChange = (contentId) => {
    setSelectedItems(prev => {
      const isSelected = prev.includes(contentId)
      if (isSelected) {
        return prev.filter(id => id !== contentId)
      } else {
        return [...prev, contentId]
      }
    })
  }

  const handleSelectAll = () => {
    const currentContents = isArchiveMode ? archivedContents : contents
    if (selectedItems.length === currentContents.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(currentContents.map(content => content.id))
    }
  }

  const handleBulkArchive = async () => {
    if (selectedItems.length === 0) {
      toast.warning('Please select items to archive/unarchive')
      return
    }

    try {
      setLoading(true)
      const response = await axiosInstance.put('/manage-content/bulk/archive', {
        ids: selectedItems
      })

      if (response.data.success) {
        toast.success(`Successfully toggled archive status for ${selectedItems.length} items`)
        setSelectedItems([])
        fetchContents()
      } else {
        toast.error('Failed to update archive status')
      }
    } catch (error) {
      console.error('Error bulk archiving:', error)
      toast.error('Failed to update archive status')
    } finally {
      setLoading(false)
      setShowBulkDropdown(false)
    }
  }

  const handleBulkPublish = async () => {
    if (selectedItems.length === 0) {
      toast.warning('Please select items to publish/unpublish')
      return
    }

    try {
      setLoading(true)
      const response = await axiosInstance.put('/manage-content/bulk/publish', {
        ids: selectedItems
      })

      if (response.data.success) {
        toast.success(`Successfully toggled publish status for ${selectedItems.length} items`)
        setSelectedItems([])
        fetchContents()
      } else {
        toast.error('Failed to update publish status')
      }
    } catch (error) {
      console.error('Error bulk publishing:', error)
      toast.error('Failed to update publish status')
    } finally {
      setLoading(false)
      setShowBulkDropdown(false)
    }
  }

  const handleArchiveContent = async (contentId) => {
    try {
      setLoading(true)
      const response = await axiosInstance.put('/manage-content/bulk/archive', {
        ids: [contentId]
      })

      if (response.data.success) {
        toast.success('Content archive status updated successfully')
        fetchContents()
      } else {
        toast.error('Failed to update archive status')
      }
    } catch (error) {
      console.error('Error archiving content:', error)
      toast.error('Failed to update archive status')
    } finally {
      setLoading(false)
    }
  }

  const handlePublishContent = async (contentId) => {
    try {
      setLoading(true)
      const response = await axiosInstance.put('/manage-content/bulk/publish', {
        ids: [contentId]
      })

      if (response.data.success) {
        toast.success('Content publish status updated successfully')
        fetchContents()
      } else {
        toast.error('Failed to update publish status')
      }
    } catch (error) {
      console.error('Error publishing content:', error)
      toast.error('Failed to update publish status')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContent = async (contentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this content? This action cannot be undone.')
    if (!confirmDelete) return

    try {
      setLoading(true)
      const response = await axiosInstance.delete(`/manage-content/${contentId}`)

      if (response.data.success) {
        toast.success('Content deleted successfully')
        setSelectedItems(prev => prev.filter(id => id !== contentId))
        fetchContents()
      } else {
        toast.error('Failed to delete content')
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      toast.error('Failed to delete content')
    } finally {
      setLoading(false)
    }
  }

  const fetchArchivedContents = async () => {
    try {
      setArchiveLoading(true)
      const response = await axiosInstance.get('/manage-content/full/archived', {
        params: {
          page: 1,
          limit: 10, // Increased limit to show more items
        }
      })

      if (response.data.success && response.data.data) {
        setArchivedContents(response.data.data)
      } else {
        setArchivedContents([])
      }
    } catch (error) {
      console.error('Error fetching archived contents:', error)
      toast.error('Failed to load archived content')
      setArchivedContents([])
    } finally {
      setArchiveLoading(false)
    }
  }

  const toggleArchiveMode = () => {
    if (isArchiveMode) {
      // Switching back to normal mode
      setIsArchiveMode(false)
      setSelectedItems([])
      setShowBulkDropdown(false)
      setShowActionDropdown(null)
    } else {
      // Switching to archive mode
      setIsArchiveMode(true)
      setSelectedItems([])
      setShowBulkDropdown(false)
      setShowActionDropdown(null)
      fetchArchivedContents()
    }
  }

  return (
    <div className="manage-content">
      <AddJournalModal
        show={showAddJournalModal}
        onClose={handleCloseAddJournalModal}
        onProceedToIntroduction={handleOpenAddJournalIntroductionModal}
        onContentChange={fetchContents}
        mode={modalMode}
        existingData={selectedJournalData}
        contentId={selectedContentId}
      />
      <AddJournalIntroduction
        show={showAddJournalIntroductionModal}
        onClose={handleCloseAddJournalIntroductionModal}
        journalData={journalData}
        mode={modalMode}
        contentId={selectedContentId}
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
                {isArchiveMode ? 'ARCHIVED CONTENT' : 'Content Management'}
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
                {isArchiveMode ? 'View and restore archived content' : 'View and content management elements'}
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
                  title={isArchiveMode ? "Return to Content Management" : "View Archive"}
                  icon={btnIcon}
                  onClick={toggleArchiveMode}
                />
              </div>

              <div className="dropdown-wrapper" style={{ position: 'relative' }}>
                <div
                  className="bulk-actions"
                  onClick={() => setShowBulkDropdown(!showBulkDropdown)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>BULK ACTIONS</span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {showBulkDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      zIndex: 9999,
                      minWidth: '180px',
                      marginTop: '4px'
                    }}
                  >
                    <button
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      onClick={handleBulkArchive}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M2.5 6.66699V15.0003C2.5 15.442 2.67559 15.8656 2.98816 16.1782C3.30072 16.4907 3.72464 16.6663 4.16667 16.6663H15.8333C16.2754 16.6663 16.6993 16.4907 17.0118 16.1782C17.3244 15.8656 17.5 15.442 17.5 15.0003V6.66699" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.3337 3.33301H1.66699V6.66634H18.3337V3.33301Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8.33301 10H11.6663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {isArchiveMode ? 'Unarchive' : 'Archive/Unarchive'}
                    </button>

                    <button
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        background: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: 'black',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      onClick={handleBulkPublish}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_3778_10072)">
                          <path d="M18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.8335 1.70801C10.8335 1.70801 13.3335 5.00019 13.3335 10.0002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.1665 18.2924C9.1665 18.2924 6.6665 15.0002 6.6665 10.0002C6.6665 5.00019 9.1665 1.70801 9.1665 1.70801" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2.19141 12.916H10.0001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2.19141 7.08301H17.8087" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M18.2326 14.9312C18.6441 15.1843 18.6188 15.8004 18.195 15.8485L16.0561 16.0909L15.0968 18.0178C14.9067 18.3997 14.3191 18.2127 14.222 17.7395L13.1759 12.6428C13.0938 12.2428 13.4533 11.9911 13.8011 12.2051L18.2326 14.9312Z" stroke="currentColor" strokeWidth="1.5"/>
                        </g>
                      </svg>
                      Publish/Unpublish
                    </button>
                  </div>
                )}
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
                        checked={selectedItems.length === (isArchiveMode ? archivedContents : contents).length && (isArchiveMode ? archivedContents : contents).length > 0}
                        onChange={handleSelectAll}
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
                  {(loading || archiveLoading) ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        <div className="d-flex justify-content-center align-items-center">
                          <div className="spinner-border text-primary me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          {isArchiveMode ? 'Loading archived content...' : 'Loading content...'}
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
                            onClick={isArchiveMode ? fetchArchivedContents : fetchContents}
                          >
                            Retry
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (isArchiveMode ? archivedContents : contents).length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        <div className="alert alert-info mb-0">
                          {isArchiveMode ? 'No archived content found.' : 'No content found. Try adding new content.'}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    (isArchiveMode ? archivedContents : contents).map((content, index) => {
                      console.log('Rendering content item:', index, content)
                      return (
                        <tr key={content.timestamp || index}>
                          <td className="checkbox-column">
                            <input
                              type="checkbox"
                              className="checkbox"
                              checked={selectedItems.includes(content.id)}
                              onChange={() => handleSelectionChange(content.id)}
                            />
                          </td>
                          <td className="manage-content-task-name-column">
                            <div className="task-name-cell">
                              <div className={`status-dot ${(!content.archiveStatus && content.publishedStatus) ? 'active' : 'inactive'}`}></div>
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
                            <div className="dropdown-wrapper" style={{ position: 'relative' }}>
                              <button
                                className="action-btn more-actions-btn"
                                onClick={() => setShowActionDropdown(showActionDropdown === content.id ? null : content.id)}
                              >
                                <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                                  <circle cx="2" cy="2" r="2" fill="currentColor" />
                                  <circle cx="8" cy="2" r="2" fill="currentColor" />
                                  <circle cx="14" cy="2" r="2" fill="currentColor" />
                                </svg>
                              </button>

                              {showActionDropdown === content.id && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    background: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    zIndex: 9999,
                                    minWidth: '140px',
                                    marginTop: '4px'
                                  }}
                                >
                                  <button
                                    style={{
                                      width: '100%',
                                      padding: '10px 16px',
                                      border: 'none',
                                      background: 'none',
                                      textAlign: 'left',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      color: '#374151',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    onClick={() => {
                                      handleArchiveContent(content.id)
                                      setShowActionDropdown(null)
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                                      <path d="M2.5 6.66699V15.0003C2.5 15.442 2.67559 15.8656 2.98816 16.1782C3.30072 16.4907 3.72464 16.6663 4.16667 16.6663H15.8333C16.2754 16.6663 16.6993 16.4907 17.0118 16.1782C17.3244 15.8656 17.5 15.442 17.5 15.0003V6.66699" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M18.3337 3.33301H1.66699V6.66634H18.3337V3.33301Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M8.33301 10H11.6663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    {isArchiveMode ? 'Unarchive' : 'Archive'}
                                  </button>

                                  <button
                                    style={{
                                      width: '100%',
                                      padding: '10px 16px',
                                      border: 'none',
                                      background: 'none',
                                      textAlign: 'left',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      color: content.publishedStatus ? '#dc2626' : '#059669',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    onClick={() => {
                                      handlePublishContent(content.id)
                                      setShowActionDropdown(null)
                                    }}
                                  >
                                    {content.publishedStatus ? (
                                      <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                                          <path d="M16.1261 17.4997H3.87356C2.33553 17.4997 1.37308 15.8361 2.13974 14.5027L8.26603 3.84833C9.03504 2.51092 10.9646 2.51092 11.7336 3.84833L17.8599 14.5027C18.6266 15.8361 17.6641 17.4997 16.1261 17.4997Z" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                                          <path d="M10 7.5V10.8333" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/>
                                          <path d="M10 14.1753L10.0083 14.1661" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Unpublish
                                      </>
                                    ) : (
                                      <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                                          <g clipPath="url(#clip0_3778_10072)">
                                            <path d="M18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M10.8335 1.70801C10.8335 1.70801 13.3335 5.00019 13.3335 10.0002" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M9.1665 18.2924C9.1665 18.2924 6.6665 15.0002 6.6665 10.0002C6.6665 5.00019 9.1665 1.70801 9.1665 1.70801" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M2.19141 12.916H10.0001" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M2.19141 7.08301H17.8087" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path fillRule="evenodd" clipRule="evenodd" d="M18.2326 14.9312C18.6441 15.1843 18.6188 15.8004 18.195 15.8485L16.0561 16.0909L15.0968 18.0178C14.9067 18.3997 14.3191 18.2127 14.222 17.7395L13.1759 12.6428C13.0938 12.2428 13.4533 11.9911 13.8011 12.2051L18.2326 14.9312Z" stroke="#059669" strokeWidth="1.5"/>
                                          </g>
                                        </svg>
                                        Publish
                                      </>
                                    )}
                                  </button>

                                  <button
                                    style={{
                                      width: '100%',
                                      padding: '10px 16px',
                                      border: 'none',
                                      background: 'none',
                                      textAlign: 'left',
                                      cursor: 'pointer',
                                      fontSize: '14px',
                                      color: 'black',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '8px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    onClick={() => {
                                      handleDeleteContent(content.id)
                                      setShowActionDropdown(null)
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                      <path d="M16.6668 7.5L15.0043 16.9552C14.8642 17.7522 14.172 18.3333 13.3629 18.3333H6.63745C5.82832 18.3333 5.13608 17.7522 4.99596 16.9552L3.3335 7.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                      <path d="M17.5 4.99935H12.8125M2.5 4.99935H7.1875M7.1875 4.99935V3.33268C7.1875 2.41221 7.93369 1.66602 8.85417 1.66602H11.1458C12.0663 1.66602 12.8125 2.41221 12.8125 3.33268V4.99935M7.1875 4.99935H12.8125" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              )}
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
