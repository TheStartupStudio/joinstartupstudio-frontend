import './index.css'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import AcademyBtn from '../../components/AcademyBtn'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import DataTable from '../../components/DataTable'
import AddTaskModal from '../../components/ContentManagement/AddTaskModal/index.js'
import AddLevelModal from '../../components/ContentManagement/AddLevelModal/index.js'
import CreateJournalTaskModal from '../../components/ContentManagement/CreateJournalTaskModal'
import UserManagementPopup from '../../components/UserManagment/AlertPopup'
import AssignTasksModal from '../../components/ContentManagement/AssignTasksModal'
import greenLeader from '../../assets/images/academy-icons/green-leadership-journal.png'
import btnIcon from '../../assets/images/academy-icons/svg/material-symbols_file-copy-outline-rounded.svg'
import axiosInstance from '../../utils/AxiosInstance'


const LeadershipJournalManagement = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [levelsData, setLevelsData] = useState([])
  const [levels, setLevels] = useState([])
  const [activeLevel, setActiveLevel] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [showBulkDropdown, setShowBulkDropdown] = useState(false)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false)
  const [showAddLevelModal, setShowAddLevelModal] = useState(false)
  const [showCreateJournalTaskModal, setShowCreateJournalTaskModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [editingTask, setEditingTask] = useState(null)
  const [tasksData, setTasksData] = useState([])
  const [loading, setLoading] = useState(false)
  const [manageContentData, setManageContentData] = useState([]) 
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null) 
  const addDropdownRef = useRef(null)
  const bulkDropdownRef = useRef(null)

  const [showPublishPopup, setShowPublishPopup] = useState(false)
  const [showUnpublishPopup, setShowUnpublishPopup] = useState(false)
  const [showDeleteTaskPopup, setShowDeleteTaskPopup] = useState(false)
  const [showDeleteLevelPopup, setShowDeleteLevelPopup] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])

  // Get the selected journal's color
  const getSelectedJournalColor = () => {
    const selectedJournal = manageContentData.find(item => item.title === selectedCategory)
    return selectedJournal?.color || '#E0EBC5' // Default to green if no color found
  }

  const fetchManageContent = async () => {
    try {
      const response = await axiosInstance.get('/journal-courses/manage-content/all')
      if (response.data.success) {
        const contentData = response.data.data || []
        setManageContentData(contentData)

        if (contentData.length > 0) {
          // Check if there's a contentId in the URL query parameters
          const urlParams = new URLSearchParams(location.search)
          const contentIdParam = urlParams.get('contentId')

          if (contentIdParam) {
            // Find the content with matching ID
            const matchingContent = contentData.find(content => content.id.toString() === contentIdParam)
            if (matchingContent) {
              setSelectedCategory(matchingContent.title)
              return // Exit early since we found the matching content
            }
          }

          // Default to first item if no contentId param or no matching content found
          setSelectedCategory(contentData[0].title)
        }
      } else {
        console.error('Failed to fetch manage content data')
        setManageContentData([])
      }
    } catch (error) {
      console.error('Error fetching manage content data:', error)
      setManageContentData([])
    }
  }

  const fetchContentByLevel = async (levelId) => {
    if (!levelId) return

    try {
      setLoading(true)
      const response = await axiosInstance.get('/LtsJournals/content-by-level', {
        params: {
          category: selectedCategory,
          levelId: levelId
        }
      })

      const transformedData = response.data.map((journal, index) => ({
        id: journal.id,
        name: journal.title,
        status: journal.published ? 'published' : 'published',
        hasContent: journal.entries && journal.entries.length > 0,
        order: journal.order || index + 1,
        fullData: journal
      }))

      setTasksData(transformedData)
      // Clear selected items when data is refreshed
      setSelectedItems([])
    } catch (error) {
      console.error('Error fetching leadership content by level:', error)
      toast.error('Failed to fetch content for this level')
      setTasksData([])
    } finally {
      setLoading(false)
    }
  }

  const fetchLevels = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/LtsJournals/leadership-journal/levels', {
        params: {
          category: selectedCategory
        }
      })

      setLevelsData(response.data)

      const levelTitles = response.data.map(level => level.title)
      setLevels(levelTitles)

      if (response.data.length > 0) {
        setActiveLevel(response.data[0].title)
      }
    } catch (error) {
      console.error('Error fetching leadership journal levels:', error)
      toast.error('Failed to fetch levels')

      const defaultLevels = [
        'Section One: Who am I?',
        'Section Two: What can I do?',
        'Section Three: How do I prove it?'
      ]
      setLevels(defaultLevels)
      setActiveLevel(defaultLevels[0])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchManageContent()
  }, [location.search]) // Run on mount and when URL search params change

  useEffect(() => {
    if (selectedCategory) {
      fetchLevels()
    }
  }, [selectedCategory])

  useEffect(() => {
    if (activeLevel && levelsData.length > 0) {
      const activeLevelObj = levelsData.find(level => level.title === activeLevel)
      if (activeLevelObj) {
        fetchContentByLevel(activeLevelObj.id)
      }
    } else {
      // Clear selected items when switching levels
      setSelectedItems([])
    }
  }, [activeLevel, levelsData])

  const handleSaveLevels = async () => {
    await fetchLevels()
  }

  const columns = useMemo(() => [
    {
      key: 'name',
      title: 'TASK NAME',
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

  const handleSelectionChange = (selectedTasks) => {
    setSelectedItems(selectedTasks)
  }

  const handleRowAction = (actionType, item) => {
    console.log(`${actionType} action for:`, item)

    switch (actionType) {
      case 'view':
      case 'edit':
        handleViewEditJournal(item.id, actionType)
        break
      case 'publish':
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
        order: index + 1
      }))

      setTasksData(updatedData)

      const reorderPromises = updatedData.map(task =>
        axiosInstance.put(`/LtsJournals/${task.id}/order`, {
          order: task.order
        })
      )
      await Promise.all(reorderPromises)

      toast.success('Task order updated successfully!')
    } catch (error) {
      console.error('Error reordering tasks:', error)
      toast.error('Failed to update task order')
      if (activeLevel && levelsData.length > 0) {
        const activeLevelObj = levelsData.find(l => l.title === activeLevel)
        if (activeLevelObj) {
          fetchContentByLevel(activeLevelObj.id)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const addNewLevel = () => {
    setShowAddLevelModal(true)
    setShowAddDropdown(false)
  }

  const addNewContent = () => {
    // Check if the current level has any tasks
    const hasTasksInLevel = tasksData.length > 0

    if (hasTasksInLevel) {
      // If level has tasks, use regular AddTaskModal
      setEditingTask(null)
      setModalMode('add')
      setShowAddTaskModal(true)
    } else {
      // If level has no tasks, use CreateJournalTaskModal for the first task
      setShowCreateJournalTaskModal(true)
    }

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

      toast.success(`${selectedItems.length} leadership tasks published successfully!`)

      if (activeLevel) {
        const activeLevelObj = levelsData.find(level => level.title === activeLevel)
        if (activeLevelObj) {
          await fetchContentByLevel(activeLevelObj.id)
        }
      }

      setSelectedItems([])

    } catch (error) {
      console.error('Error bulk publishing leadership tasks:', error)
      toast.error('Failed to publish leadership tasks')
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

      toast.success(`${selectedItems.length} leadership tasks unpublished successfully!`)

      if (activeLevel) {
        const activeLevelObj = levelsData.find(level => level.title === activeLevel)
        if (activeLevelObj) {
          await fetchContentByLevel(activeLevelObj.id)
        }
      }

      setSelectedItems([])

    } catch (error) {
      console.error('Error bulk unpublishing leadership tasks:', error)
      toast.error('Failed to unpublish leadership tasks')
    } finally {
      setLoading(false)
      setShowBulkDropdown(false)
    }
  }

  const handleViewEditJournal = async (journalId, mode) => {
    try {
      setLoading(true)

      const response = await axiosInstance.get(`/LtsJournals/${journalId}`)

      const journal = response.data

      let formattedReflectionItems = []

      if (journal.entries && Array.isArray(journal.entries)) {
        formattedReflectionItems = journal.entries.map(entry => {
          let question = ''
          let instructions = ''

          if (entry.title) {
            const hasHtmlTags = /<[^>]*>/.test(entry.title)

            if (hasHtmlTags) {
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
            } else {
              question = entry.title
              instructions = ''
            }
          }

          return {
            id: entry.id || Date.now() + Math.random(),
            question: question.trim(),
            instructions: instructions.trim()
          }
        })
      }

      const taskData = {
        id: journal.id,
        title: journal.title,
        level: activeLevel,
        contentType: 'video',
        videoUrl: journal.video?.url || journal.videos?.[0]?.url || '',
        thumbnailUrl: journal.JournalImg?.url || journal.video?.thumbnail || journal.videos?.[0]?.thumbnail || '',
        information: journal.content || journal.paragraph || '',
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

    fetchContentByLevel(levelsData.find(l => l.title === activeLevel)?.id)
  }

  const handleSaveJournalTask = () => {
    // Refresh the tasks data for the current level after creating the first journal task
    fetchContentByLevel(levelsData.find(l => l.title === activeLevel)?.id)
  }


  const handleSaveAssignments = async (assignments) => {
    try {
      setLoading(true)

      console.log('Leadership assignments to process:', assignments)

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

      const updatePromises = validAssignments.map(async (assignment) => {
        try {
          console.log(`Assigning leadership journal ${assignment.journalId} to level ${assignment.levelId}`)
          return await axiosInstance.put(`/LtsJournals/${assignment.journalId}/edit-with-content`, {
            journalLevel: assignment.levelId
          })
        } catch (individualError) {
          console.error(`Error assigning leadership journal ${assignment.journalId}:`, individualError)
          throw individualError 
        }
      })

      await Promise.all(updatePromises)

      toast.success(`${validAssignments.length} leadership journal(s) assigned successfully!`)

      await fetchLevels()
      if (activeLevel) {
        const activeLevelObj = levelsData.find(level => level.title === activeLevel)
        if (activeLevelObj) {
          await fetchContentByLevel(activeLevelObj.id)
        }
      }

      setShowAssignModal(false)

    } catch (error) {
      console.error('Error assigning leadership journals:', error)
      toast.error('Failed to assign leadership journals')
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

      if (activeLevel) {
        const activeLevelObj = levelsData.find(level => level.title === activeLevel)
        if (activeLevelObj) {
          await fetchContentByLevel(activeLevelObj.id)
        }
      }

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

      if (activeLevel) {
        const activeLevelObj = levelsData.find(level => level.title === activeLevel)
        if (activeLevelObj) {
          await fetchContentByLevel(activeLevelObj.id)
        }
      }

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
      await axiosInstance.delete(`/LtsJournals/${selectedTask.id}/delete-with-content`)

      setTasksData(prevTasks =>
        prevTasks.filter(task => task.id !== selectedTask.id)
      )

      toast.success(`Task "${selectedTask.name}" deleted successfully!`)
      setShowDeleteTaskPopup(false)
      setSelectedTask(null)
    } catch (error) {
      console.error('Error deleting task:', error)
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

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="leadership-journal-management">
      <div>
        <div className="col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4" style={{backgroundColor: 'white'}}>
          <div className="d-flex justify-content-between flex-col-tab align-start-tab gap-5" style={{padding: '40px 40px 10px 30px'}}>
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
                LEADERSHIP JOURNAL MANAGEMENT
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
                View and edit Leadership Journal Tasks
              </p>
            </div>

            {/* Category Selector */}
        <div className="category-selector" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              ref={dropdownRef}
              style={{
                position: 'relative',
                display: 'inline-block',
                minWidth: '200px'
              }}
            >
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  display: 'inline-block',
                  borderRadius: '8px',
                  background: 'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                  padding: '2px',
                  height: '58px',
                  boxShadow: '0px 4px 10px 0px #00000040',
                  cursor: 'pointer'
                }}
              >
                <div
                  className="fs-14 d-flex align-items-center justify-content-between"
                  style={{
                    width: '100%',
                    padding: '0 1rem',
                    borderRadius: '6px',
                    fontFamily: 'Montserrat',
                    fontSize: '14px',
                    backgroundColor: 'white',
                    height: '100%',
                    outline: 'none',
                    minWidth: '200px'
                  }}
                >
                  <span >
                    {selectedCategory || 'Select Category'}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#666"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>

              {isDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    right: '0',
                    borderRadius: '8px',
                    padding: '2px',
                    boxShadow: '0px 8px 20px 0px #00000050',
                    zIndex: 1000,
                    marginTop: '4px'
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {manageContentData.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedCategory(item.title)
                          setIsDropdownOpen(false)
                        }}
                        style={{
                          padding: '12px 12px',
                          cursor: 'pointer',
                          fontFamily: 'Montserrat',
                          fontSize: '12px',
                          fontWeight: '400',
                          color: 'black',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f9fafb'
                          e.target.style.fontWeight = '600'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white'
                          e.target.style.fontWeight = '400'
                        }}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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
      
      <div className="content-management-container">
         {/* <img 
        src={greenLeader} 
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
      /> */}

      <div style={{ borderRadius: '1234px',
          background: `radial-gradient(50% 50% at 50% 50%, ${getSelectedJournalColor()}33 0%, rgba(255, 255, 255, 0.00) 100%)`,
          height: '100dvh',
          width: '100dvw',
          position: 'absolute',
          top: '0px',
          left: 0,
          zIndex: 0,
          pointerEvents: 'none'
        }}>
      </div>


        <div className="header-tabs d-flex justify-content-between gap-3">
          {levels.map((level, index) => (
            <button
              key={index}
              className={`tab-button ${activeLevel === level ? 'active' : ''}`}
              style={activeLevel === level ? { backgroundColor: getSelectedJournalColor() } : {}}
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
                  placeholder="Search for tasks"
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
                  title="Add New Task"
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
                      zIndex: 99999,
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
              onSelectionChange={handleSelectionChange}
              selectedItems={selectedItems}
              emptyMessage="There are no leadership journals"
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
        source="leadership"
      />

      <CreateJournalTaskModal
        show={showCreateJournalTaskModal}
        onClose={() => {
          setShowCreateJournalTaskModal(false)
        }}
        onSave={handleSaveJournalTask}
        contentId={(() => {
          const foundItem = manageContentData.find(item => item.title === selectedCategory)
          return foundItem?.id
        })()}
        journalLevelId={(() => {
          const activeLevelObj = levelsData.find(level => level.title === activeLevel)
          return activeLevelObj?.id
        })()}
      />

      <AddLevelModal
        show={showAddLevelModal}
        onHide={() => setShowAddLevelModal(false)}
        onSave={handleSaveLevels}
        existingLevels={levelsData}
        category="leadership"
        selectedCategory={selectedCategory}
        manageContentId={(() => {
          const foundItem = manageContentData.find(item => item.title === selectedCategory)
          return foundItem?.id
        })()}
      />

      <AssignTasksModal
        show={showAssignModal}
        onHide={() => setShowAssignModal(false)}
        onSave={handleSaveAssignments}
        type="leadership"
        levels={levelsData}
      />

      <UserManagementPopup
        show={showPublishPopup}
        onHide={handlePublishCancel}
        onConfirm={handleConfirmPublish}
        title="Publish Task?"
        message="Are you sure you want to publish this leadership task? Once it's published, it will be available to all learners with access to this content."
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, PUBLISH TASK"
        loading={loading}
      />

      <UserManagementPopup
        show={showUnpublishPopup}
        onHide={handleUnpublishCancel}
        onConfirm={handleConfirmUnpublish}
        title="Unpublish Task?"
        message="Are you sure you want to unpublish this leadership task? Once it's unpublished, it will no longer be available to learners."
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, UNPUBLISH TASK"
        loading={loading}
      />

      <UserManagementPopup
        show={showDeleteTaskPopup}
        onHide={handleDeleteTaskCancel}
        onConfirm={handleConfirmDeleteTask}
        title="Delete Task?"
        message="Are you sure you want to delete this leadership task?"
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

export default LeadershipJournalManagement