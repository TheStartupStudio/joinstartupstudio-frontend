import './ContentManagement.css'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import AcademyBtn from '../../components/AcademyBtn'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import btnIcon from '../../assets/images/academy-icons/svg/material-symbols_file-copy-outline-rounded.svg'
import DataTable from '../../components/DataTable'
import blueManagerBG from '../../assets/images/academy-icons/svg/bg-blue-menager.png'
import axiosInstance from '../../utils/AxiosInstance'
import AddTaskModal from '../../components/ContentManagement/AddTaskModal/index.js'
import AddLevelModal from '../../components/ContentManagement/AddLevelModal/index.js'
import UserManagementPopup from '../../components/UserManagment/AlertPopup'
import AssignTasksModal from '../../components/ContentManagement/AssignTasksModal'

const ContentManagement = () => {
  const dispatch = useDispatch()
  const [levelsData, setLevelsData] = useState([]) 
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const addDropdownRef = useRef(null)
  const bulkDropdownRef = useRef(null)

  const [showPublishPopup, setShowPublishPopup] = useState(false)
  const [showUnpublishPopup, setShowUnpublishPopup] = useState(false)
  const [showDeleteTaskPopup, setShowDeleteTaskPopup] = useState(false)
  const [showDeleteLevelPopup, setShowDeleteLevelPopup] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    if (editingTask) {
    }
  }, [editingTask])

  useEffect(() => {
    fetchLevels()
  }, [])

  useEffect(() => {
    if (activeLevel && levelsData.length > 0) {
      const activeLevelObj = levelsData.find(l => l.title === activeLevel)
      if (activeLevelObj) {
        fetchTasksByLevel()
      }
    } else {
      // Clear selected items when switching levels
      setSelectedItems([])
    }
  }, [activeLevel, levelsData])

  const fetchLevels = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/LtsJournals/entrepreneurship/levels')
      
      setLevelsData(response.data)
      
      if (response.data.length > 0) {
        setActiveLevel(response.data[0].title)
      }
    } catch (error) {
      console.error('Error fetching levels:', error)
      toast.error('Failed to fetch levels')
      
      const defaultLevels = [
        { id: 1, title: 'Level 1: Entrepreneurship and You', order: 1, published: true },
        { id: 2, title: 'Level 2: Understanding Learn to Start', order: 2, published: true },
        { id: 3, title: 'Level 3: The Journey of Entrepreneurship', order: 3, published: true }
      ]
      setLevelsData(defaultLevels)
      setActiveLevel(defaultLevels[0].title)
    } finally {
      setLoading(false)
    }
  }

  const fetchTasksByLevel = async () => {
    try {
      setLoading(true)
      
      const activeLevelObj = levelsData.find(l => l.title === activeLevel)
      if (!activeLevelObj) {
        setTasksData([])
        return
      }

      const response = await axiosInstance.get('/LtsJournals/content-by-level', {
        params: {
          category: 'entrepreneurship',
          levelId: activeLevelObj.id
        }
      })

      const transformedTasks = response.data.map(journal => {
        const hasVideoContent = journal.videoId || 
                               journal.videoIds || 
                               (journal.videos && journal.videos.length > 0) ||
                               (journal.video && journal.video.id)
        
        const hasReflectionContent = journal.entries && journal.entries.length > 0

        return {
          id: journal.id,
          name: journal.title,
          status: journal.published ? 'published' : 'unpublished',
          hasContent: hasVideoContent || hasReflectionContent,
          order: journal.order,
          journalData: journal
        }
      })

      setTasksData(transformedTasks)
      // Clear selected items when data is refreshed
      setSelectedItems([])
    } catch (error) {
      console.error('Error fetching tasks by level:', error)
      toast.error('Failed to fetch tasks')
      setTasksData([])
    } finally {
      setLoading(false)
    }
  }

  const columns = useMemo(() => [
    {
    key: 'name',
    title: 'TASK NAME',
    sortable: true,
    filterable: true,
    width: '100%',
    className: 'content-management-task-name-column',
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

  const handleSelectionChange = (selectedTasks) => {
    setSelectedItems(selectedTasks)
  }

  const handleRowAction = (actionType, item) => {
    
    switch (actionType) {
      case 'view':
        handleViewEditJournal(item.id, actionType)
        break
      case 'edit':
        handleViewEditJournal(item.id, actionType)
        break
      case 'publish':
        // setSelectedTask(item)
        // setShowPublishPopup(true)
        toast.success('Task already published!')
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
        order: index 
      }))
      
      setTasksData(updatedData)
  
      const reorderPromises = updatedData.map(task =>
        axiosInstance.put(`/LtsJournals/${task.id}/order`, {
          order: task.order
        })
      )
      await Promise.all(reorderPromises)

      const reorderedItems = updatedData.map(item => ({
        id: item.id,
        name: item.name
      }))
  
      toast.success('Task order updated successfully!')
    } catch (error) {
      console.error('Error reordering tasks:', error)
      toast.error('Failed to update task order')
      fetchTasksByLevel()
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
    if (selectedItems.length === 0) {
      toast.warning('Please select tasks to publish')
      return
    }

    setLoading(true)
    try {
      const updatePromises = selectedItems.map(async (task) => {
        return axiosInstance.put(`/LtsJournals/${task.id}`, {
          published: true
        })
      })

      await Promise.all(updatePromises)

      toast.success(`${selectedItems.length} tasks published successfully!`)

      // Refresh data
      await fetchTasksByLevel()

      // Clear selections
      setSelectedItems([])

    } catch (error) {
      console.error('Error bulk publishing tasks:', error)
      toast.error('Failed to publish tasks')
    } finally {
      setLoading(false)
      setShowBulkDropdown(false)
    }
  }

  const handleBulkUnpublish = async () => {
    if (selectedItems.length === 0) {
      toast.warning('Please select tasks to unpublish')
      return
    }

    setLoading(true)
    try {
      const updatePromises = selectedItems.map(async (task) => {
        return axiosInstance.put(`/LtsJournals/${task.id}/edit-with-content`, {
          journalLevel: null
        })
      })

      await Promise.all(updatePromises)

      toast.success(`${selectedItems.length} tasks unpublished successfully!`)

      // Refresh data
      await fetchTasksByLevel()

      // Clear selections
      setSelectedItems([])

    } catch (error) {
      console.error('Error bulk unpublishing tasks:', error)
      toast.error('Failed to unpublish tasks')
    } finally {
      setLoading(false)
      setShowBulkDropdown(false)
    }
  }

  const handleViewEditJournal = async (journalId, mode) => {
    try {
      setLoading(true)

      const response = await axiosInstance.get(`/LtsJournals/${journalId}/view-with-content`)

      const journal = response.data

      let formattedReflectionItems = []

      if (journal.journalData && journal.journalData.entries && Array.isArray(journal.journalData.entries)) {

        formattedReflectionItems = journal.journalData.entries.map(entry => {
          let question = ''
          let instructions = ''
          if (entry.title) {

            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = entry.title

            const headingElement = tempDiv.querySelector('h1, h2, h3, h4, h5, h6')
            if (headingElement) {
              question = headingElement.textContent || headingElement.innerText || ''
            } else {
              let headingMatch = entry.title.match(/<h3[^>]*>(.*?)<\/h3>/i)
              if (!headingMatch) {
                headingMatch = entry.title.match(/<h2[^>]*>(.*?)<\/h2>/i)
              }
              if (headingMatch && headingMatch[1]) {
                const headingTempDiv = document.createElement('div')
                headingTempDiv.innerHTML = headingMatch[1]
                question = headingTempDiv.textContent || headingTempDiv.innerText || headingMatch[1]
              }
            }

            const pElement = tempDiv.querySelector('p')
            if (pElement) {
              instructions = pElement.textContent || pElement.innerText || ''
            } else {
              const pMatch = entry.title.match(/<p[^>]*>(.*?)<\/p>/i)
              if (pMatch && pMatch[1]) {
                const pTempDiv = document.createElement('div')
                pTempDiv.innerHTML = pMatch[1]
                instructions = pTempDiv.textContent || pTempDiv.innerText || pMatch[1]
              }
            }
          }

          const result = {
            id: entry.id || Date.now() + Math.random(),
            question: question.trim(),
            instructions: instructions.trim()
          }

          return result
        })
      }
      else if (journal.reflectionItems && Array.isArray(journal.reflectionItems) && journal.reflectionItems.length > 0) {
        formattedReflectionItems = journal.reflectionItems.map(item => ({
          id: item.id || Date.now() + Math.random(),
          question: item.question || '',
          instructions: item.instructions || ''
        }))
      }
      else {
        formattedReflectionItems = (journal.category === 'leadership')
          ? [
              { id: 1, question: '', instructions: '' },
              { id: 2, question: '', instructions: '' },
              { id: 3, question: '', instructions: '' }
            ]
          : (journal.contentType === 'reflection')
            ? [{ id: 1, question: '', instructions: '' }]
            : []
      }

      const taskData = {
        id: journal.id,
        title: journal.title,
        level: activeLevel,
        contentType: formattedReflectionItems.length > 0 ? 'video' : 'video',
        videoUrl: journal.videoUrl,
        thumbnailUrl: journal.thumbnailUrl,
        information: journal.information || '',
        reflectionItems: formattedReflectionItems,
        order: journal.order
      }


      setEditingTask(taskData)
      setModalMode(mode)
      setShowAddTaskModal(true)
    } catch (error) {
      console.error('Error fetching journal data:', error)
      toast.error('Failed to load journal data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTask = (journalData) => {

    if (journalData.deleted) {
      setTasksData(prevTasks => prevTasks.filter(task => task.id !== journalData.id))
      return
    }

    fetchTasksByLevel()
  }

  const handleSaveLevels = async () => {
    await fetchLevels()
  }

  const handleSaveAssignments = async (assignments) => {
    try {
      setLoading(true)

      console.log('Assignments to process:', assignments)

      // Filter out assignments with invalid level IDs
      const validAssignments = assignments.filter(assignment => {
        if (!assignment.levelId || assignment.levelId === '') {
          console.warn(`Skipping assignment for journal ${assignment.journalId} - invalid levelId:`, assignment.levelId)
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

      // Update each journal's level assignment using the edit-with-content endpoint
      const updatePromises = validAssignments.map(async (assignment) => {
        try {
          console.log(`Assigning journal ${assignment.journalId} to level ${assignment.levelId}`)
          return await axiosInstance.put(`/LtsJournals/${assignment.journalId}/edit-with-content`, {
            journalLevel: assignment.levelId
          })
        } catch (individualError) {
          console.error(`Error assigning journal ${assignment.journalId}:`, individualError)
          throw individualError // Re-throw to be caught by outer catch
        }
      })

      await Promise.all(updatePromises)

      toast.success(`${validAssignments.length} journal(s) assigned successfully!`)

      // Refresh data
      await fetchTasksByLevel()
      await fetchLevels()

      // Close modal
      setShowAssignModal(false)

    } catch (error) {
      console.error('Error assigning journals:', error)
      // toast.error('Failed to assign journals')
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
      await axiosInstance.put(`/LtsJournals/${selectedTask.id}`, {
        published: true
      })

      // Refresh data from API
      await fetchTasksByLevel()

      toast.success(`Task "${selectedTask.name}" published successfully!`)
      setShowPublishPopup(false)
      setSelectedTask(null)
    } catch (error) {
      console.error('Error publishing task:', error)
      toast.error('Failed to publish task')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmUnpublish = async () => {
    setLoading(true)
    try {
      await axiosInstance.put(`/LtsJournals/${selectedTask.id}/edit-with-content`, {
        journalLevel: null
      })

      // Refresh data from API
      await fetchTasksByLevel()

      toast.success(`Task "${selectedTask.name}" unpublished successfully!`)
      setShowUnpublishPopup(false)
      setSelectedTask(null)
    } catch (error) {
      console.error('Error unpublishing task:', error)
      toast.error('Failed to unpublish task')
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
      
      toast.success(`Task "${selectedTask.name}" deleted successfully!`)
      setShowDeleteTaskPopup(false)
      setSelectedTask(null)
    } catch (error) {
      toast.error('Failed to delete task')
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

  const addOptions = [
    {
      name: 'Add New Level',
      action: addNewLevel
    },
    {
      name: 'Add New Content',
      action: addNewContent
    },
    {
      name: 'View Uncategorized Tasks',
      action: viewUncategorizedTasks
    }
  ]

  const bulkOptions = [
    {
      name: 'Publish Tasks',
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
      name: 'Unpublish Tasks',
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
    <div className="content-management">
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
                COURSE MANAGEMENT
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
                View and edit course materials
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
        <img src={blueManagerBG} className='position-absolute' 
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
          {levelsData.map((level) => (
            <button
              key={level.id}
              className={`tab-button ${activeLevel === level.title ? 'active' : ''}`}
              onClick={() => setActiveLevel(level.title)}
            >
              {level.title}
            </button>
          ))}
        </div>

        <div className='main-search-table-container'>


        <div className="search-actions-bar">
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search for content"
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
                title="Add New Content"
                icon={faPlus}
                onClick={addNewContent}
            />
            </div>

            <div>
              <AcademyBtn
                title="View Uncategorized Tasks"
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
            onSelectionChange={handleSelectionChange}
            selectedItems={selectedItems}
            showCheckbox={true}
            activeTab="Content"
          />
        </div>

        {/* <div className="pagination-container">
          <button className="pagination-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M11 6L5 12L11 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6L13 12L19 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="pagination-btn">
           <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <path d="M15.75 6L9.75 12L15.75 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          </button>
          <span className="pagination-info">1 / 2</span>
          <button className="pagination-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
              <path d="M9.25 6L15.25 12L9.25 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="pagination-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 6L19 12L13 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 6L11 12L5 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div> */}
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
      />

      <AddLevelModal
        show={showAddLevelModal}
        onHide={() => setShowAddLevelModal(false)}
        onSave={handleSaveLevels}
        existingLevels={levelsData}
      />

      <AssignTasksModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        onSave={handleSaveAssignments}
        type="content"
        levels={levelsData}
      />

      <UserManagementPopup
        show={showPublishPopup}
        onHide={handlePublishCancel}
        onConfirm={handleConfirmPublish}
        title="Publish Task?"
        message="Are you sure you want to publish this task? Once it's published, it will be available to all learners with access to this curriculum."
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, PUBLISH TASK"
        loading={loading}
      />

      <UserManagementPopup
        show={showUnpublishPopup}
        onHide={handleUnpublishCancel}
        onConfirm={handleConfirmUnpublish}
        title="Unpublish Task?"
        message="Are you sure you want to unpublish this task? Once it's unpublished, it will no longer be available to learners."
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, UNPUBLISH TASK"
        loading={loading}
      />

      <UserManagementPopup
        show={showDeleteTaskPopup}
        onHide={handleDeleteTaskCancel}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Task?"
        message="Are you sure you want to delete this task?"
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, DELETE TASK"
        loading={loading}
      />

      <UserManagementPopup
        show={showDeleteLevelPopup}
        onHide={handleDeleteLevelCancel}
        onConfirm={handleConfirmDeleteLevel}
        title="Delete Level?"
        message="Are you sure you want to delete this level? Deleting this level will NOT remove tasks assigned to it, but they will no longer be accessible to learners."
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, DELETE LEVEL"
        loading={loading}
      />
    </div>
  )
}

export default ContentManagement