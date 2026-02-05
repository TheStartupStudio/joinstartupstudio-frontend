import React, { useState, useRef, useEffect } from 'react'
import './index.css'
import graph from '../../assets/images/academy-icons/svg/Icon_Sort.svg'
import filter from '../../assets/images/academy-icons/svg/Dropdown_ Filter by Level.svg'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const DataTable = ({ 
  columns, 
  data, 
  onRowAction,
  searchQuery = '',
  showCheckbox = true,
  activeTab = 'Organizations',
  onReorder,
  onSelectionChange,
  selectedItems = [],
  loading = false
}) => {
  
  const [openFilterDropdown, setOpenFilterDropdown] = useState(null)
  const [activeFilters, setActiveFilters] = useState({})
  const [openMoreActionsDropdown, setOpenMoreActionsDropdown] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [draggedRow, setDraggedRow] = useState(null)
  const [draggedOverRow, setDraggedOverRow] = useState(null)
  const [selectAll, setSelectAll] = useState(false)
  
  // Refs for click outside detection
  const filterDropdownRefs = useRef({})
  const moreActionsDropdownRefs = useRef({})

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check filter dropdowns
      if (openFilterDropdown !== null) {
        const filterRef = filterDropdownRefs.current[openFilterDropdown]
        if (filterRef && !filterRef.contains(event.target)) {
          setOpenFilterDropdown(null)
        }
      }

      // Check more actions dropdowns
      if (openMoreActionsDropdown !== null) {
        const moreActionsRef = moreActionsDropdownRefs.current[openMoreActionsDropdown]
        if (moreActionsRef && !moreActionsRef.contains(event.target)) {
          setOpenMoreActionsDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openFilterDropdown, openMoreActionsDropdown])

  // Update select all state when selectedItems changes
  useEffect(() => {
    if (selectedItems.length === 0) {
      setSelectAll(false)
    } else if (selectedItems.length === filteredData.length && filteredData.length > 0) {
      setSelectAll(true)
    } else {
      setSelectAll(false)
    }
  }, [selectedItems, data])
  
  const filteredData = data.filter(item => {
    if (!searchQuery) return true
    
    return Object.values(item).some(value => 
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleActionClick = (actionType, item) => {
    if (onRowAction) {
      onRowAction(actionType, item)
    }
  }

  const renderCell = (column, item) => {
    if (column.render) {
      return column.render(item[column.key], item)
    }
    return item[column.key]
  }

  const getMoreActionsOptions = () => {
    if (activeTab === 'Organizations') {
      return [
        { name: 'View Organization', action: 'view-organization' },
        { name: 'Edit Organization', action: 'edit-organization' },
        { name: 'Deactivate Organization', action: 'deactivate-organization' },
        { name: 'Delete Organization', action: 'delete-organization' },
        { name: 'Export Organization Data', action: 'export-organization' }
      ]
    } else if (activeTab === 'Content') {
      return []
    } else if (activeTab === 'tss-feedback') {
      return [
        { name: 'View Feedback', action: 'view-feedback' }
      ]
    } else {
      return [
        { name: 'Deactivate Learner', action: 'deactivate-learner' },
        { name: 'Delete Learner', action: 'delete-learner' }
      ]
    }
  }

  const handleMoreActionsClick = (itemId, event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setDropdownPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX
    })
    setOpenMoreActionsDropdown(openMoreActionsDropdown === itemId ? null : itemId)
    setOpenFilterDropdown(null)
  }

  const handleMoreActionOptionClick = (action, item) => {
    handleActionClick(action, item)
    setOpenMoreActionsDropdown(null)
  }

  const handleSelectAll = (e) => {
    const checked = e.target.checked
    setSelectAll(checked)
    
    if (checked) {
      onSelectionChange(filteredData)
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectRow = (item) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id)
    
    if (isSelected) {
      onSelectionChange(selectedItems.filter(selected => selected.id !== item.id))
    } else {
      onSelectionChange([...selectedItems, item])
    }
  }

  const isRowSelected = (item) => {
    return selectedItems.some(selected => selected.id === item.id)
  }

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedRow(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', e.currentTarget)
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
    setDraggedRow(null)
    setDraggedOverRow(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e, index) => {
    e.preventDefault()
    setDraggedOverRow(index)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    
    if (draggedRow === null || draggedRow === dropIndex) {
      return
    }

    const newData = [...filteredData]
    const draggedItem = newData[draggedRow]
    
    // Remove dragged item
    newData.splice(draggedRow, 1)
    
    // Insert at new position
    newData.splice(dropIndex, 0, draggedItem)

    // Call onReorder with the new order
    if (onReorder) {
      onReorder(newData)
    }

    setDraggedRow(null)
    setDraggedOverRow(null)
  }

  const renderActions = (item) => {
    if (activeTab === 'tss-feedback') {
      return (

        <div className="action-buttons justify-content-between">
          <button
            className="action-btn view-btn"
            onClick={() => handleActionClick('view-feedback', item)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3.3335 17.7337V2.26699C3.3335 1.93562 3.60213 1.66699 3.9335 1.66699H13.5016C13.6608 1.66699 13.8134 1.73021 13.9259 1.84273L16.4911 4.40792C16.6036 4.52044 16.6668 4.67306 16.6668 4.83219V17.7337C16.6668 18.065 16.3982 18.3337 16.0668 18.3337H3.9335C3.60213 18.3337 3.3335 18.065 3.3335 17.7337Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.6665 8.33301L13.3332 8.33301" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.6665 15L13.3332 15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.6665 11.667L9.99984 11.667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3335 1.66699V4.40033C13.3335 4.7317 13.6021 5.00033 13.9335 5.00033H16.6668" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View Feedback
          </button>
        </div>
      )
    } else if (activeTab === 'Content') {
      const isPublished = item.status === 'published'
      
      return (
        <div className="action-buttons justify-content-between">
          <button
            className="action-btn view-btn"
            onClick={() => handleActionClick('view', item)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3.3335 17.7337V2.26699C3.3335 1.93562 3.60213 1.66699 3.9335 1.66699H13.5016C13.6608 1.66699 13.8134 1.73021 13.9259 1.84273L16.4911 4.40792C16.6036 4.52044 16.6668 4.67306 16.6668 4.83219V17.7337C16.6668 18.065 16.3982 18.3337 16.0668 18.3337H3.9335C3.60213 18.3337 3.3335 18.065 3.3335 17.7337Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.6665 8.33301L13.3332 8.33301" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.6665 15L13.3332 15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.6665 11.667L9.99984 11.667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3335 1.66699V4.40033C13.3335 4.7317 13.6021 5.00033 13.9335 5.00033H16.6668" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View Task
          </button>
          <button
            className="action-btn edit-btn"
            onClick={() => handleActionClick('edit', item)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.6668 10.0003V4.83219C16.6668 4.67306 16.6036 4.52044 16.4911 4.40792L13.9259 1.84273C13.8134 1.73021 13.6608 1.66699 13.5016 1.66699H3.9335C3.60213 1.66699 3.3335 1.93562 3.3335 2.26699V17.7337C3.3335 18.065 3.60213 18.3337 3.9335 18.3337H9.16683" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.6665 8.33333H13.3332M6.6665 5H9.99984M6.6665 11.6667H9.1665" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14.9618 14.1159L15.7951 13.2826C16.16 12.9177 16.7517 12.9177 17.1166 13.2826C17.4815 13.6475 17.4815 14.2392 17.1166 14.6041L16.2833 15.4374M14.9618 14.1159L12.5077 16.5701C12.3578 16.72 12.2594 16.9136 12.2267 17.1231L12.0328 18.3664L13.276 18.1726C13.4855 18.1399 13.6792 18.0415 13.8291 17.8916L16.2833 15.4374M14.9618 14.1159L16.2833 15.4374" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.3335 1.66699V4.40033C13.3335 4.7317 13.6021 5.00033 13.9335 5.00033H16.6668" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Edit Task
          </button>
          <button
            className={`action-btn ${isPublished ? 'unpublish-btn' : 'publish-btn'}`}
            onClick={() => handleActionClick(isPublished ? 'unpublish' : 'publish', item)}
            style={{width: '150px'}}
          >
            {isPublished ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.1261 17.4997H3.87356C2.33553 17.4997 1.37308 15.8361 2.13974 14.5027L8.26603 3.84833C9.03504 2.51092 10.9646 2.51092 11.7336 3.84833L17.8599 14.5027C18.6266 15.8361 17.6641 17.4997 16.1261 17.4997Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 7.5V10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 14.1753L10.0083 14.1661" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Unpublish Task
              </>
            ) : (
              <>
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
                Publish Task
              </>
            )}
          </button>
          <button
            className="action-btn drag-handle-btn"
            style={{ cursor: 'grab', padding: '8px' }}
            onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
            onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3.75017 15C3.63184 15 3.53295 14.96 3.4535 14.88C3.37406 14.8 3.33406 14.7008 3.3335 14.5825C3.33295 14.4642 3.37295 14.3653 3.4535 14.2858C3.53406 14.2064 3.63295 14.1667 3.75017 14.1667H16.2502C16.3685 14.1667 16.4674 14.2067 16.5468 14.2867C16.6263 14.3667 16.6663 14.4658 16.6668 14.5842C16.6674 14.7025 16.6274 14.8014 16.5468 14.8808C16.4663 14.9603 16.3674 15 16.2502 15H3.75017ZM3.75017 11.9392C3.63184 11.9392 3.53295 11.8992 3.4535 11.8192C3.37406 11.7392 3.33406 11.64 3.3335 11.5217C3.33295 11.4033 3.37295 11.3044 3.4535 11.225C3.53406 11.1456 3.63295 11.1058 3.75017 11.1058H16.2502C16.3685 11.1058 16.4674 11.1458 16.5468 11.2258C16.6268 11.3058 16.6668 11.405 16.6668 11.5233C16.6668 11.6417 16.6268 11.7406 16.5468 11.82C16.4668 11.8994 16.3679 11.9392 16.2502 11.9392H3.75017ZM3.75017 8.89417C3.63184 8.89417 3.53295 8.85417 3.4535 8.77417C3.3735 8.69417 3.3335 8.595 3.3335 8.47667C3.3335 8.35833 3.3735 8.25944 3.4535 8.18C3.5335 8.10056 3.63239 8.06083 3.75017 8.06083H16.2502C16.3685 8.06083 16.4674 8.10083 16.5468 8.18083C16.6263 8.26083 16.6663 8.36 16.6668 8.47833C16.6674 8.59667 16.6274 8.69556 16.5468 8.775C16.4663 8.85444 16.3674 8.89417 16.2502 8.89417H3.75017ZM3.75017 5.83333C3.63184 5.83333 3.53295 5.79333 3.4535 5.71333C3.37406 5.63333 3.33406 5.53417 3.3335 5.41583C3.33295 5.2975 3.37295 5.19861 3.4535 5.11917C3.53406 5.03972 3.63295 5 3.75017 5H16.2502C16.3685 5 16.4674 5.04 16.5468 5.12C16.6263 5.2 16.6663 5.29917 16.6668 5.4175C16.6674 5.53583 16.6274 5.63472 16.5468 5.71417C16.4663 5.79361 16.3674 5.83333 16.2502 5.83333H3.75017Z" fill="#6F6F6F"/>
            </svg>
          </button>
        </div>
      )
    } else if (activeTab === 'Organizations') {
      return (
        <div className="action-buttons">
          <button
            className="action-btn view-btn"
            onClick={() => handleActionClick('view-learners', item)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 10.8335C5.5 4.16683 14.5 4.16683 17.5 10.8335" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14.1665C8.61929 14.1665 7.5 13.0472 7.5 11.6665C7.5 10.2858 8.61929 9.1665 10 9.1665C11.3807 9.1665 12.5 10.2858 12.5 11.6665C12.5 13.0472 11.3807 14.1665 10 14.1665Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View Learners
          </button>
          <button
            className="action-btn edit-btn"
            onClick={() => handleActionClick('add-learners', item)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Learners
          </button>
          <div style={{ position: 'relative' }} ref={el => moreActionsDropdownRefs.current[item.id] = el}>
            <button
              className="action-btn more-actions-btn"
              onClick={(e) => handleMoreActionsClick(item.id, e)}
            >
              <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                <circle cx="2" cy="2" r="2" fill="currentColor" />
                <circle cx="8" cy="2" r="2" fill="currentColor" />
                <circle cx="14" cy="2" r="2" fill="currentColor" />
              </svg>
            </button>
            
            {openMoreActionsDropdown === item.id && (
              <div 
                className="more-actions-dropdown-menu"
                style={{
                  position: 'fixed',
                  top: dropdownPosition.top + 30,
                  left: dropdownPosition.left - 170,
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 9999,
                  minWidth: '200px',
                  display: 'block'
                }}
              >
                {getMoreActionsOptions().map((option, optionIndex) => (
                  <div 
                    key={optionIndex}
                    className="more-actions-dropdown-item"
                    style={{
                      padding: '12px 16px',
                      color: 'black',
                      fontFamily: 'Montserrat',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      textTransform: 'none'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    onClick={() => handleMoreActionOptionClick(option.action, item)}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    } else {
      return (
        <div className="action-buttons">
          <button
            className="action-btn view-btn"
            onClick={() => handleActionClick('view', item)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 10.8335C5.5 4.16683 14.5 4.16683 17.5 10.8335" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14.1665C8.61929 14.1665 7.5 13.0472 7.5 11.6665C7.5 10.2858 8.61929 9.1665 10 9.1665C11.3807 9.1665 12.5 10.2858 12.5 11.6665C12.5 13.0472 11.3807 14.1665 10 14.1665Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View
          </button>
          <button
            className="action-btn edit-btn"
            onClick={() => handleActionClick('edit', item)}
          >
            <FontAwesomeIcon icon={faPencilAlt} />
            Edit
          </button>
          <div style={{ position: 'relative' }} ref={el => moreActionsDropdownRefs.current[item.id] = el}>
            <button
              className="action-btn more-actions-btn"
              onClick={(e) => handleMoreActionsClick(item.id, e)}
            >
              <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                <circle cx="2" cy="2" r="2" fill="currentColor" />
                <circle cx="8" cy="2" r="2" fill="currentColor" />
                <circle cx="14" cy="2" r="2" fill="currentColor" />
              </svg>
            </button>
            
            {openMoreActionsDropdown === item.id && (
              <div 
                className="more-actions-dropdown-menu"
                style={{
                  position: 'fixed',
                  top: dropdownPosition.top + 30,
                  left: dropdownPosition.left - 170,
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 9999,
                  minWidth: '180px',
                  display: 'block'
                }}
              >
                {getMoreActionsOptions().map((option, optionIndex) => (
                  <div 
                    key={optionIndex}
                    className="more-actions-dropdown-item"
                    style={{
                      padding: '12px 16px',
                      color: 'black',
                      fontFamily: 'Montserrat',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      textTransform: 'none'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    onClick={() => handleMoreActionOptionClick(option.action, item)}
                  >
                    {option.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }
  }

  const getFilterOptions = (columnKey) => {
    if (activeTab === 'Organizations') {
      return ['Active', 'Inactive']
    } else if (activeTab === 'Content') {
      return ['Published', 'Unpublished']
    } else {
      if (columnKey === 'level') {
        return ['L1', 'L2', 'L3']
      } else if (columnKey === 'name') {
        return ['Active', 'Inactive']
      }
    }
    return []
  }

  const handleFilterClick = (columnKey, columnIndex) => {
    const dropdownKey = `${columnKey}-${columnIndex}`
    setOpenFilterDropdown(openFilterDropdown === dropdownKey ? null : dropdownKey)
    setOpenMoreActionsDropdown(null)
  }

  const handleFilterOptionClick = (columnKey, option) => {
    console.log(`Filter ${columnKey} by:`, option)
    setActiveFilters(prev => ({
      ...prev,
      [columnKey]: option
    }))
    setOpenFilterDropdown(null)
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr> 
            {showCheckbox && (
              <th className="checkbox-column">
                <input 
                  type="checkbox" 
                  className="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  disabled={filteredData.length === 0}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={column.className || ''}
                style={activeTab === 'Content' ? { flex: 1 } : {}}
              >
                <div className="header-with-icons">
                  {column.title}
                  {column.sortable && (
                    <div className="header-icons">
                      <img src={graph} alt="graph" className="header-icon" />
                    </div>
                  )}
                  {column.filterable && (
                    <div className="header-icons" style={{ position: 'relative' }} ref={el => filterDropdownRefs.current[`${column.key}-${index}`] = el}>
                      <img 
                        src={filter} 
                        alt="filter" 
                        className="header-icon" 
                        onClick={() => handleFilterClick(column.key, index)}
                        style={{ cursor: 'pointer' }}
                      />
                      
                      {openFilterDropdown === `${column.key}-${index}` && (
                        <div 
                          className="filter-dropdown-menu"
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            background: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            zIndex: 9999,
                            minWidth: '120px',
                            marginTop: '4px',
                            display: 'block'
                          }}
                        >
                          {getFilterOptions(column.key).map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              className="filter-dropdown-item"
                              style={{
                                padding: '12px 16px',
                                color: 'black',
                                fontFamily: 'Montserrat',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s ease',
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                              onClick={() => handleFilterOptionClick(column.key, option)}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
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
            Array.from({ length: 10 }).map((_, index) => (
              <tr key={`skeleton-${index}`}>
                {showCheckbox && (
                  <td className="checkbox-column">
                    <Skeleton width={20} height={20} />
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={column.className || ''}>
                    <Skeleton width="80%" height={20} />
                  </td>
                ))}
                <td className="actions-column">
                  <Skeleton width={100} height={30} />
                </td>
              </tr>
            ))
          ) : filteredData.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length + (showCheckbox ? 1 : 0) + 1} 
                style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}
              >
                No data available
              </td>
            </tr>
          ) : (
            filteredData.map((item, index) => (
              <tr 
                key={item.id}
                draggable={activeTab === 'Content'}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className={`${draggedOverRow === index ? 'drag-over' : ''} ${activeTab === 'Content' ? 'draggable-row' : ''}`}
              >
                {showCheckbox && (
                  <td className="checkbox-column">
                    <input 
                      type="checkbox" 
                      className="checkbox"
                      checked={isRowSelected(item)}
                      onChange={() => handleSelectRow(item)}
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className={column.className || ''}>
                    {renderCell(column, item)}
                  </td>
                ))}
                <td className="actions-column">
                  {renderActions(item)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable