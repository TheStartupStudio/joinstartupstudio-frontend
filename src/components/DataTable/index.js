import React, { useState, useRef, useEffect } from 'react'
import './index.css'
import graph from '../../assets/images/academy-icons/svg/Icon_Sort.svg'
import filter from '../../assets/images/academy-icons/svg/Dropdown_ Filter by Level.svg'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaTimes } from 'react-icons/fa'

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
  loading = false,
  onFilterChange
}) => {
  
  const [openFilterDropdown, setOpenFilterDropdown] = useState(null)
  const [activeFilters, setActiveFilters] = useState({})
  const [openMoreActionsDropdown, setOpenMoreActionsDropdown] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [draggedRow, setDraggedRow] = useState(null)
  const [draggedOverRow, setDraggedOverRow] = useState(null)
  const [selectAll, setSelectAll] = useState(false)
  
  const [dateFilters, setDateFilters] = useState({})
  
  const filterDropdownRefs = useRef({})
  const moreActionsDropdownRefs = useRef({})

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openFilterDropdown !== null) {
        const filterRef = filterDropdownRefs.current[openFilterDropdown]
        if (filterRef && !filterRef.contains(event.target)) {
          setOpenFilterDropdown(null)
        }
      }

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
    } else if (activeTab === 'Invoices') {
      return [
        { 
          name: 'Generate Invoice', 
          action: 'generate-invoice',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M3.33301 17.7337V2.26699C3.33301 1.93562 3.60164 1.66699 3.93301 1.66699H13.5011C13.6603 1.66699 13.8129 1.73021 13.9254 1.84273L16.4906 4.40792C16.6031 4.52044 16.6663 4.67306 16.6663 4.83219V17.7337C16.6663 18.065 16.3977 18.3337 16.0663 18.3337H3.93301C3.60164 18.3337 3.33301 18.065 3.33301 17.7337Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.66699 8.33301H13.3337" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.66699 15H13.3337" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.66699 11.667H10.0003" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.333 1.66699V4.40033C13.333 4.7317 13.6016 5.00033 13.933 5.00033H16.6663" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        },
        { 
          name: 'Archive Invoice', 
          action: 'archive-invoice',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 6.66699V15.0003C2.5 15.442 2.67559 15.8656 2.98816 16.1782C3.30072 16.4907 3.72464 16.6663 4.16667 16.6663H15.8333C16.2754 16.6663 16.6993 16.4907 17.0118 16.1782C17.3244 15.8656 17.5 15.442 17.5 15.0003V6.66699" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.3337 3.33301H1.66699V6.66634H18.3337V3.33301Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8.33301 10H11.6663" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        },
        { 
          name: 'Delete Invoice', 
          action: 'delete-invoice',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M16.1261 17.4997H3.87356C2.33553 17.4997 1.37308 15.8361 2.13974 14.5027L8.26603 3.84833C9.03504 2.51092 10.9646 2.51092 11.7336 3.84833L17.8599 14.5027C18.6266 15.8361 17.6641 17.4997 16.1261 17.4997Z" stroke="#DC3545" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 7.5V10.8333" stroke="#DC3545" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 14.1753L10.0083 14.1661" stroke="#DC3545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        }
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
    
    newData.splice(draggedRow, 1)
    newData.splice(dropIndex, 0, draggedItem)

    if (onReorder) {
      onReorder(newData)
    }

    setDraggedRow(null)
    setDraggedOverRow(null)
  }

  const renderActions = (item) => {
    if (activeTab === 'Content') {
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
          <button
            className="action-btn edit-btn"
            onClick={(e) => {
              e.stopPropagation()
              onRowAction('view-invoices', item)
              // setOpenActionId(null)
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            View Invoices
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
    } else if (activeTab === 'Invoices') {
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
            className="action-btn send-btn"
            onClick={() => handleActionClick('send', item)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M18.3332 1.66699L9.1665 10.8337" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.3332 1.66699L12.4998 18.3337L9.1665 10.8337L1.6665 7.50033L18.3332 1.66699Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Send
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
                      color: option.action === 'delete-invoice' ? '#DC3545' : 'black',
                      fontFamily: 'Montserrat',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      textTransform: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    onClick={() => handleMoreActionOptionClick(option.action, item)}
                  >
                    {option.icon && <span style={{ display: 'flex', alignItems: 'center' }}>{option.icon}</span>}
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
    } else if (activeTab === 'Invoices') {
      if (columnKey === 'status') {
        return ['Complete', 'Unpaid', 'Created']
      }
      if (columnKey === 'invoiceDate' || columnKey === 'paymentDate') {
        return null
      }
    } else {
      if (columnKey === 'level') {
        return ['L1', 'L2', 'L3']
      } else if (columnKey === 'name') {
        return ['Active', 'Inactive']
      }
    }
    return []
  }

  const handleFilterClick = (columnKey, columnIndex, event) => {
    const dropdownKey = `${columnKey}-${columnIndex}`
    
    const rect = event.currentTarget.getBoundingClientRect()
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX
    })
    
    setOpenFilterDropdown(openFilterDropdown === dropdownKey ? null : dropdownKey)
    setOpenMoreActionsDropdown(null)
  }

  const handleFilterOptionClick = (columnKey, option) => {
    const newFilters = {
      ...activeFilters,
      [columnKey]: option
    }
    setActiveFilters(newFilters)
    setOpenFilterDropdown(null)
    
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  const handleDateFilterChange = (columnKey, dateType, date) => {
    const newDateFilters = {
      ...dateFilters,
      [columnKey]: {
        ...dateFilters[columnKey],
        [dateType]: date
      }
    }
    setDateFilters(newDateFilters)
    
    const newFilters = {
      ...activeFilters,
      [columnKey]: newDateFilters[columnKey]
    }
    setActiveFilters(newFilters)
    
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  const renderDateFilter = (columnKey) => {
    const currentFilter = dateFilters[columnKey] || { from: null, to: null }
    
    return (
      <div className="date-filter-dropdown" style={{ padding: '20px' }}>
        <div style={{
                            bordeRadius: '4px',
                            background: 'rgba(227, 229, 233, 0.50)',
                            display: 'flex',
                            marginBottom: '16px',
                            gap: '12px',
                            alignItem: 'center',
                            color: '#000',
                            fontFamily: 'Montserrat',
                            fontSize: '15px',
                            fontStyle: 'normal',
                            fontWeight: 500,
                          }}>

                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                              <g clip-path="url(#clip0_3995_31182)">
                                <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                              </g>
                              <defs>
                                <clipPath id="clip0_3995_31182">
                                  <rect width="20" height="20" fill="white"/>
                                </clipPath>
                              </defs>
                            </svg>
                            Search by Date Range
                          </div>
        <div className="date-range-inputs" style={{ display: 'flex', gap: '12px' }}>
          <div className="date-input-group" style={{ flex: 1 }}>
            <label className="date-label" style={{
              fontFamily: 'Montserrat',
              fontSize: '12px',
              fontWeight: '500',
              color: '#4B5563',
              marginBottom: '6px',
              display: 'block'
            }}>From:</label>
            <div className="date-picker-wrapper" style={{ position: 'relative' }}>
              <DatePicker
                selected={currentFilter.from}
                onChange={(date) => handleDateFilterChange(columnKey, 'from', date)}
                placeholderText="Choose Date"
                dateFormat="MM/dd/yyyy"
                className="date-input"
                isClearable
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 36px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontFamily: 'Montserrat',
                  fontSize: '13px'
                }}
              />
              <svg 
                className="calendar-icon" 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              >
                <path 
                  d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z" 
                  stroke="#666" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M10.6667 1.33301V3.99967" 
                  stroke="#666" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M5.33333 1.33301V3.99967" 
                  stroke="#666" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 6.66699H14" 
                  stroke="#666" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              {currentFilter.from && (
                <button 
                  className="clear-date-btn"
                  onClick={() => handleDateFilterChange(columnKey, 'from', null)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9CA3AF'
                  }}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          <div className="date-input-group" style={{ flex: 1 }}>
            <label className="date-label" style={{
              fontFamily: 'Montserrat',
              fontSize: '12px',
              fontWeight: '500',
              color: '#4B5563',
              marginBottom: '6px',
              display: 'block'
            }}>To:</label>
            <div className="date-picker-wrapper" style={{ position: 'relative' }}>
              <DatePicker
                selected={currentFilter.to}
                onChange={(date) => handleDateFilterChange(columnKey, 'to', date)}
                placeholderText="Choose Date"
                dateFormat="MM/dd/yyyy"
                className="date-input"
                minDate={currentFilter.from}
                isClearable
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 36px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  fontFamily: 'Montserrat',
                  fontSize: '13px'
                }}
              />
              <svg 
                className="calendar-icon" 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none"
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              >
                <path 
                  d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z" 
                  stroke="#666" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M10.6667 1.33301V3.99967" 
                  stroke="#666" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M5.33333 1.33301V3.99967" 
                  stroke="#666" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 6.66699H14" 
                  stroke="#666" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              {currentFilter.to && (
                <button 
                  className="clear-date-btn"
                  onClick={() => handleDateFilterChange(columnKey, 'to', null)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9CA3AF'
                  }}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
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
                        onClick={(e) => handleFilterClick(column.key, index, e)}
                        style={{ cursor: 'pointer' }}
                      />
                      
                      {openFilterDropdown === `${column.key}-${index}` && (
                        <div 
                          className="filter-dropdown-menu"
                          style={{
                            position: 'fixed',
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            transform: 'translateX(-50%)',
                            background: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            zIndex: 9999,
                            // minWidth: getFilterOptions(column.key) === null ? '700px' : '120px',
                            marginTop: '4px',
                            display: 'block'
                          }}
                        >

                          {getFilterOptions(column.key) === null ? (
                            renderDateFilter(column.key)
                          ) : (
                            getFilterOptions(column.key).map((option, optionIndex) => (
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
                            ))
                          )}
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