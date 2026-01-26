import './index.css'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import AcademyBtn from '../../components/AcademyBtn'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import DataTable from '../../components/DataTable'
import axiosInstance from '../../utils/AxiosInstance'
import AddTaskModal from '../../components/ContentManagement/AddTaskModal/index.js'
import AddLevelModal from '../../components/ContentManagement/AddLevelModal/index.js'
import UserManagementPopup from '../../components/UserManagment/AlertPopup'
import AssignTasksModal from '../../components/ContentManagement/AssignTasksModal'
import pinkMaster from '../../assets/images/academy-icons/ping-master-class.png'
import btnIcon from '../../assets/images/academy-icons/svg/material-symbols_file-copy-outline-rounded.svg'
import EnLangs from '../../lang/locales/en_US.js'


const MasterClassManagement = () => {
  const dispatch = useDispatch()
  const [activeLevel, setActiveLevel] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [showBulkDropdown, setShowBulkDropdown] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showAddLevelModal, setShowAddLevelModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [editingTask, setEditingTask] = useState(null)
  const [tasksData, setTasksData] = useState([])
  const [loading, setLoading] = useState(false)
  const addDropdownRef = useRef(null)
  const bulkDropdownRef = useRef(null)

  const [showPublishPopup, setShowPublishPopup] = useState(false)
  const [showUnpublishPopup, setShowUnpublishPopup] = useState(false)
  const [showDeleteTaskPopup, setShowDeleteTaskPopup] = useState(false)
  const [showDeleteLevelPopup, setShowDeleteLevelPopup] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)

  const [levelsData, setLevelsData] = useState([]) 
  const [levels, setLevels] = useState([]) 

  useEffect(() => {
    fetchLevels()
  }, [])

  useEffect(() => {
    if (activeLevel && levelsData.length > 0) {
      fetchContentByLevel()
    }
  }, [activeLevel]) 

  const fetchLevels = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/contents/masterclass/levels')

      setLevelsData(response.data)

      const levelTitles = response.data.map(level => level.title)
      setLevels(levelTitles)

      if (response.data.length > 0) {
        setActiveLevel(response.data[0].title)
      }
    } catch (error) {
      console.error('Error fetching masterclass levels:', error)
      toast.error('Failed to fetch levels')

      const defaultLevels = [
        'Encouragement Videos',
        'Career Guidance Videos',
        'Story in Motion Podcasts Episodes',
        'Live Q&A Episodes'
      ]
      setLevels(defaultLevels)
      setActiveLevel(defaultLevels[0])
    } finally {
      setLoading(false)
    }
  }

  const translateVideoTitle = (titleKey) => {
    if (titleKey && titleKey.startsWith('video.')) {
      return EnLangs[titleKey] || titleKey
    }
    return titleKey
  }

  const handleViewContent = async (contentId, mode) => {
    try {
      setLoading(true)

      const response = await axiosInstance.get(`/contents/${contentId}`)
      const content = response.data

      const taskData = {
        id: content.id,
        title: translateVideoTitle(content.title),
        level: activeLevel,
        contentType: 'video',
        videoUrl: content.url,
        thumbnailUrl: content.thumbnail,
        information: content.description || '',
        reflectionItems: [], 
        journalData: content
      }

      setEditingTask(taskData)
      setModalMode(mode)
      setShowAddTaskModal(true)
    } catch (error) {
      console.error('Error fetching content:', error)
      toast.error('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const fetchContentByLevel = async () => {
    try {
      setLoading(true)

      const activeLevelObj = levelsData.find(l => l.title === activeLevel)
      if (!activeLevelObj) {
        setTasksData([])
        return
      }

      const response = await axiosInstance.get(`/contents/by-journal-level/${activeLevelObj.id}`)

      const transformedContent = response.data.data.map(content => {
        const hasVideoContent = content.videoId ||
                               content.videoIds ||
                               (content.videos && content.videos.length > 0) ||
                               (content.video && content.video.id)

        return {
          id: content.id,
          name: translateVideoTitle(content.title),
          status: content.published ? 'published' : 'unpublished',
          hasContent: hasVideoContent,
          order: content.order || 0,
          journalData: content
        }
      })

      setTasksData(transformedContent)
    } catch (error) {
      console.error('Error fetching content by level:', error)
      toast.error('Failed to fetch content')
      setTasksData([])
    } finally {
      setLoading(false)
    }
  }



  const columns = useMemo(() => [
    {
      key: 'name',
      title: 'VIDEO NAME',
      sortable: true,
      filterable: true,
      render: (value, item) => (
        <div className="task-name-cell">
          <div className={`status-dot ${item.status}`}></div>
          <span>{value}</span>
        </div>
      )
    }
  ], [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRowAction = (actionType, item) => {
    console.log(`${actionType} action for:`, item)
    
    switch (actionType) {
      case 'view':
        handleViewContent(item.id, 'view')
        break
      case 'edit':
        handleViewContent(item.id, 'edit')
        break
      case 'publish':
        // setSelectedTask(item)
        // setShowPublishPopup(true)
        toast.success('Video already published!')
        break
      case 'unpublish':
        setSelectedTask(item)
        setShowUnpublishPopup(true)
        break
      default:
        break
    }
  }

  const handleReorder = async (newOrderedData) => {
    setLoading(true)
    
    try {
      const updatedData = newOrderedData.map((item, index) => ({
        ...item,
        order: index + 1
      }))
      
      setTasksData(updatedData)

      const reorderedTasks = updatedData.map(task => ({
        id: task.id
      }))

      toast.success('Video order updated successfully!')
    } catch (error) {
      console.error('Error reordering videos:', error)
      toast.success('Video order updated successfully!')
    } finally {
      setLoading(false)
    }
  }

  const addNewLevel = () => {
    setShowAddLevelModal(true)
    setShowAddDropdown(false)
  }

  const addNewContent = () => {
    setEditingTask(null)
    setModalMode('add')
    setShowAddTaskModal(true)
    setShowAddDropdown(false)
  }

  const viewUncategorizedTasks = () => {
    setShowAssignModal(true)
    setShowAddDropdown(false)
  }

  const handleBulkPublish = async () => {
    const selectedTasks = tasksData.filter(task => task.isSelected)

    if (selectedTasks.length === 0) {
      toast.warning('Please select videos to publish')
      return
    }

    setLoading(true)
    try {
      const updatePromises = selectedTasks.map(async (task) => {
        return axiosInstance.put(`/contents/${task.id}`, {
          published: true
        })
      })

      await Promise.all(updatePromises)

      toast.success(`${selectedTasks.length} master class videos published successfully!`)

      if (activeLevel) {
        await fetchContentByLevel()
      }

      setTasksData(prevTasks =>
        prevTasks.map(task => ({ ...task, isSelected: false }))
      )

    } catch (error) {
      console.error('Error bulk publishing master class videos:', error)
      toast.error('Failed to publish master class videos')
    } finally {
      setLoading(false)
      setShowBulkDropdown(false)
    }
  }

  const handleBulkUnpublish = async () => {
    const selectedTasks = tasksData.filter(task => task.isSelected)

    if (selectedTasks.length === 0) {
      toast.warning('Please select videos to unpublish')
      return
    }

    setLoading(true)
    try {
      const updatePromises = selectedTasks.map(async (task) => {
        return axiosInstance.put(`/contents/${task.id}`, {
          journalLevel: null
        })
      })

      await Promise.all(updatePromises)

      toast.success(`${selectedTasks.length} master class videos unpublished successfully!`)

      if (activeLevel) {
        await fetchContentByLevel()
      }

      setTasksData(prevTasks =>
        prevTasks.map(task => ({ ...task, isSelected: false }))
      )

    } catch (error) {
      console.error('Error bulk unpublishing master class videos:', error)
      toast.error('Failed to unpublish master class videos')
    } finally {
      setLoading(false)
      setShowBulkDropdown(false)
    }
  }

  const handleSaveTask = (taskData) => {
    console.log('Master class data:', taskData)
    
    if (modalMode === 'edit') {
      setTasksData(prevTasks => 
        prevTasks.map(task => 
          task.id === editingTask.id 
            ? { ...task, name: taskData.title, ...taskData }
            : task
        )
      )
      toast.success('Master class updated successfully!')
    } else {
      const newTask = {
        id: tasksData.length + 1,
        name: taskData.title,
        status: 'unpublished',
        hasContent: true,
        order: tasksData.length + 1
      }
      setTasksData(prevTasks => [...prevTasks, newTask])
      toast.success('Master class created successfully!')
    }
  }

  const handleSaveLevels = async () => {
    await fetchLevels()
  }

  const handleSaveAssignments = async (assignments) => {
    try {
      setLoading(true)

      console.log('Master class assignments to process:', assignments)

      const validAssignments = assignments.filter(assignment => {
        if (!assignment.levelId || assignment.levelId === '') {
          console.warn(`Skipping assignment for content ${assignment.contentId} - invalid levelId:`, assignment.levelId)
          return false
        }
        return true
      })

      if (validAssignments.length === 0) {
        toast.warning('No valid assignments to process')
        setShowAssignModal(false)
        setLoading(false)
        return
      }

      const updatePromises = validAssignments.map(async (assignment) => {
        try {
          console.log(`Assigning master class content ${assignment.contentId} to level ${assignment.levelId}`)
          return await axiosInstance.put(`/contents/${assignment.contentId}`, {
            journalLevel: assignment.levelId
          })
        } catch (individualError) {
          console.error(`Error assigning master class content ${assignment.contentId}:`, individualError)
          throw individualError 
        }
      })

      await Promise.all(updatePromises)

      toast.success(`${validAssignments.length} master class content(s) assigned successfully!`)

      await fetchLevels()
      if (activeLevel) {
        await fetchContentByLevel()
      }

      setShowAssignModal(false)

    } catch (error) {
      console.error('Error assigning master class content:', error)
      toast.error('Failed to assign master class content')
    } finally {
      setLoading(false)
    }
  }

  const handlePublishCancel = () => {
    setShowPublishPopup(false)
    setSelectedTask(null)
  }

  const handleUnpublishCancel = () => {
    setShowUnpublishPopup(false)
    setSelectedTask(null)
  }

  const handleDeleteTaskCancel = () => {
    setShowDeleteTaskPopup(false)
    setSelectedTask(null)
  }

  const handleDeleteLevelCancel = () => {
    setShowDeleteLevelPopup(false)
    setSelectedLevel(null)
  }

  const handleConfirmPublish = async () => {
    setLoading(true)
    try {
      await axiosInstance.put(`/contents/${selectedTask.id}`, {
        published: true
      })

      if (activeLevel) {
        await fetchContentByLevel()
      }

      toast.success(`Master class "${selectedTask.name}" published successfully!`)
      setShowPublishPopup(false)
      setSelectedTask(null)
    } catch (error) {
      console.error('Error publishing master class:', error)
      toast.error('Failed to publish master class')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmUnpublish = async () => {
    setLoading(true)
    try {
      await axiosInstance.put(`/contents/${selectedTask.id}`, {
        journalLevel: null
      })

      if (activeLevel) {
        await fetchContentByLevel()
      }

      toast.success(`Master class "${selectedTask.name}" unpublished successfully!`)
      setShowUnpublishPopup(false)
      setSelectedTask(null)
    } catch (error) {
      console.error('Error unpublishing master class:', error)
      toast.error('Failed to unpublish master class')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDeleteTask = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setTasksData(prevTasks =>
        prevTasks.filter(task => task.id !== selectedTask.id)
      )
      
      toast.success(`Master class "${selectedTask.name}" deleted successfully!`)
      setShowDeleteTaskPopup(false)
      setSelectedTask(null)
    } catch (error) {
      toast.error('Failed to delete master class')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDeleteLevel = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success(`Level "${selectedLevel}" deleted successfully!`)
      setShowDeleteLevelPopup(false)
      setSelectedLevel(null)
    } catch (error) {
      toast.error('Failed to delete level')
    } finally {
      setLoading(false)
    }
  }

  const bulkOptions = [
    {
      name: 'Publish Videos',
      action: handleBulkPublish,
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <g clipPath="url(#clip0_3778_10072)">
            <path d="M18.3332 10.0003C18.3332 5.39795 14.6022 1.66699 9.99984 1.66699C5.39746 1.66699 1.6665 5.39795 1.6665 10.0003C1.6665 14.6027 5.39746 18.3337 9.99984 18.3337" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.8335 1.70801C10.8335 1.70801 13.3335 5.00019 13.3335 10.0002" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.1665 18.2924C9.1665 18.2924 6.6665 15.0002 6.6665 10.0002C6.6665 5.00019 9.1665 1.70801 9.1665 1.70801" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.19141 12.916H10.0001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.19141 7.08301H17.8087" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M18.2326 14.9312C18.6441 15.1843 18.6188 15.8004 18.195 15.8485L16.0561 16.0909L15.0968 18.0178C14.9067 18.3997 14.3191 18.2127 14.222 17.7395L13.1759 12.6428C13.0938 12.2428 13.4533 11.9911 13.8011 12.2051L18.2326 14.9312Z" stroke="currentColor" strokeWidth="1.5"/>
          </g>
          <defs>
            <clipPath id="clip0_3778_10072">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      )
    },
    {
      name: 'Unpublish Videos',
      action: handleBulkUnpublish,
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M16.1261 17.4997H3.87356C2.33553 17.4997 1.37308 15.8361 2.13974 14.5027L8.26603 3.84833C9.03504 2.51092 10.9646 2.51092 11.7336 3.84833L17.8599 14.5027C18.6266 15.8361 17.6641 17.4997 16.1261 17.4997Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M10 7.5V10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M10 14.1753L10.0083 14.1661" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target)) {
        setShowAddDropdown(false)
      }
      
      if (bulkDropdownRef.current && !bulkDropdownRef.current.contains(event.target)) {
        setShowBulkDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="master-class-managment">
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
                MASTER CLASS MANAGEMENT
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
                View and edit Master Class Videos
              </p>
            </div>
          </div>
          <img
            src={MenuIcon}
            alt='menu'
            className='menu-icon-cie self-start-tab cursor-pointer'
            onClick={() => dispatch(toggleCollapse())}
          />
        </div>
      </div>
      
      <div className="content-management-container position-relative">
        <img 
        src={pinkMaster} 
        className='position-absolute' 
        style={{
          top: 0, 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 0,
          pointerEvents: 'none',
          // opacity: 0.1,
          width: '100dvw',
          height: '100dvh'
        }} 
        alt="Decorative background"
        aria-hidden="true"
      />
        <div className="header-tabs d-flex justify-content-between gap-3">
          {levels.map((level, index) => (
            <button
              key={index}
              className={`tab-button ${activeLevel === level ? 'active' : ''}`}
              onClick={() => setActiveLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className='main-search-table-container'>
          <div className="search-actions-bar">
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search for videos"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-input"
                />
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="actions-container">
              <div className="dropdown-wrapper" style={{ position: 'relative' }} ref={addDropdownRef}>
                <div>
                  <AcademyBtn
                    title="ADD NEW LEVEL"
                    icon={faPlus}
                    onClick={() => {
                      addNewLevel()
                    }}
                  />
                </div>
              </div>

              <div>
                <AcademyBtn
                  title="Add New Video"
                  icon={faPlus}
                  onClick={addNewContent}
                />
              </div>

              <div>
                <AcademyBtn
                  title="View Uncategorized Videos"
                  icon={btnIcon}
                  onClick={viewUncategorizedTasks}
                />
              </div>

              <div className="dropdown-wrapper" style={{ position: 'relative' }} ref={bulkDropdownRef}>
                <div 
                  className="bulk-actions"
                  onClick={() => {
                    setShowBulkDropdown(!showBulkDropdown)
                    setShowAddDropdown(false)
                  }}
                >
                  <span>BULK ACTIONS</span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {showBulkDropdown && (
                  <div 
                    className="dropdown-menu"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      zIndex: 9999,
                      marginTop: '4px',
                      minWidth: '200px',
                      display: 'block'
                    }}
                  >
                    {bulkOptions.map((option, index) => (
                      <div 
                        key={index}
                        className="dropdown-item"
                        style={{
                          padding: '12px 16px',
                          color: 'black',
                          fontFamily: 'Montserrat',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        onClick={() => {
                          option.action()
                        }}
                      >
                        {option.svg}
                        <span>{option.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="table-container">
            <DataTable
              columns={columns}
              data={tasksData}
              searchQuery={searchQuery}
              onRowAction={handleRowAction}
              onReorder={handleReorder}
              showCheckbox={true}
              activeTab="Content"
              onSelectionChange={(selectedItems) => {
                setTasksData(prevTasks =>
                  prevTasks.map(task => ({
                    ...task,
                    isSelected: selectedItems.some(selected => selected.id === task.id)
                  }))
                )
              }}
              selectedItems={tasksData.filter(task => task.isSelected)}
            />
          </div>

        </div>
      </div>

      <AddTaskModal 
        show={showAddTaskModal}
        onHide={() => {
          setShowAddTaskModal(false)
          setEditingTask(null)
          setModalMode('add')
        }}
        onSave={handleSaveTask}
        levels={levelsData}
        mode={modalMode}
        taskData={editingTask}
        source="masterclass"
      />

      <AddLevelModal
        show={showAddLevelModal}
        onHide={() => setShowAddLevelModal(false)}
        onSave={handleSaveLevels}
        existingLevels={levelsData}
        category="masterclass"
      />

      <AssignTasksModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        onSave={handleSaveAssignments}
        type="masterclass"
        levels={levelsData}
      />

      <UserManagementPopup
        show={showPublishPopup}
        onHide={handlePublishCancel}
        onConfirm={handleConfirmPublish}
        title="Publish Master Class?"
        message="Are you sure you want to publish this master class video? Once it's published, it will be available to all learners with access to this content."
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, PUBLISH VIDEO"
        loading={loading}
      />

      <UserManagementPopup
        show={showUnpublishPopup}
        onHide={handleUnpublishCancel}
        onConfirm={handleConfirmUnpublish}
        title="Unpublish Master Class?"
        message="Are you sure you want to unpublish this master class video? Once it's unpublished, it will no longer be available to learners."
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, UNPUBLISH VIDEO"
        loading={loading}
      />

      <UserManagementPopup
        show={showDeleteTaskPopup}
        onHide={handleDeleteTaskCancel}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Master Class?"
        message="Are you sure you want to delete this master class video?"
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, DELETE VIDEO"
        loading={loading}
      />

      <UserManagementPopup
        show={showDeleteLevelPopup}
        onHide={handleDeleteLevelCancel}
        onConfirm={handleConfirmDeleteLevel}
        title="Delete Level?"
        message="Are you sure you want to delete this level? Deleting this level will NOT remove videos assigned to it, but they will no longer be accessible to learners."
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, DELETE LEVEL"
        loading={loading}
      />
    </div>
  )
}

export default MasterClassManagement