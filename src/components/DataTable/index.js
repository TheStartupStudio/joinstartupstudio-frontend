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
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { invoiceApi } from '../../utils/invoiceApi'

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

    const { user } = useSelector((state) => state.user.user)
      const isInstructor = user?.role_id === 2;



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
          name: 'Export Invoice as PDF', 
          action: 'export-invoice-pdf',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.83301 8.33301L9.99967 12.4997L14.1663 8.33301" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 12.5V2.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )
        },
        // { 
        //   name: 'Generate Invoice', 
        //   action: 'generate-invoice',
        //   icon: (
        //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
        //       <path d="M3.33301 17.7337V2.26699C3.33301 1.93562 3.60164 1.66699 3.93301 1.66699H13.5011C13.6603 1.66699 13.8129 1.73021 13.9254 1.84273L16.4906 4.40792C16.6031 4.52044 16.6663 4.67306 16.6663 4.83219V17.7337C16.6663 18.065 16.3977 18.3337 16.0663 18.3337H3.93301C3.60164 18.3337 3.33301 18.065 3.33301 17.7337Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        //       <path d="M6.66699 8.33301H13.3337" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        //       <path d="M6.66699 15H13.3337" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        //       <path d="M6.66699 11.667H10.0003" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        //       <path d="M13.333 1.66699V4.40033C13.333 4.7317 13.6016 5.00033 13.933 5.00033H16.6663" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        //     </svg>
        //   )
        // },
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
    if (activeTab === 'Invoices') {
      return (
        <div className="action-buttons">
          <button
            className="action-btn view-btn"
            onClick={() => handleActionClick('view', item)}
            title="View Invoice"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2.5 10.8335C5.5 4.16683 14.5 4.16683 17.5 10.8335" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14.1665C8.61929 14.1665 7.5 13.0472 7.5 11.6665C7.5 10.2858 8.61929 9.1665 10 9.1665C11.3807 9.1665 12.5 10.2858 12.5 11.6665C12.5 13.0472 11.3807 14.1665 10 14.1665Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            View
          </button>
          
          {!isInstructor && (
            <button
              className="action-btn send-btn"
              onClick={() => handleActionClick('send-invoice', item)}
              title="Send Invoice"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 7.5L11.25 10L15 7.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2.49935 11.25H4.16602" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M0.832682 8.75H4.16602" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.16732 6.25033V6.16699C4.16732 5.06242 5.06275 4.16699 6.16732 4.16699H16.334C17.4386 4.16699 18.334 5.06242 18.334 6.16699V13.8337C18.334 14.9382 17.4386 15.8337 16.334 15.8337H6.16732C5.06275 15.8337 4.16732 14.9382 4.16732 13.8337V13.7503" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              Send
            </button>
          )}
          
          <div style={{ position: 'relative' }} ref={el => moreActionsDropdownRefs.current[item.id] = el}>
            <button
              className="action-btn more-actions-btn"
              onClick={(e) => handleMoreActionsClick(item.id, e)}
              title="More Actions"
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
                {/* ✅ Export Invoice as PDF - First Option */}
                <div 
                  className="more-actions-dropdown-item"
                  style={{
                    padding: '12px 16px',
                    color: 'black',
                    fontFamily: 'Montserrat',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  onClick={() => {
                    // Direct API call for PDF export
                    const exportPDF = async () => {
                      try {
                        toast.success('Downloading invoice...')
                        if (user?.role_id === 2) {
                          // Client/Instructor
                          await invoiceApi.downloadClientInvoice(item.id)
                        } else {
                          // Admin
                          const response = await invoiceApi.downloadInvoice(item.id)
                          const blob = new Blob([response.data], { type: 'application/pdf' })
                          const url = window.URL.createObjectURL(blob)
                          const link = document.createElement('a')
                          link.href = url
                          link.download = `Invoice_${item.invoiceNumber}.pdf`
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                          window.URL.revokeObjectURL(url)
                        }
                        toast.success('Invoice downloaded successfully!')
                      } catch (error) {
                        console.error('Error downloading invoice:', error)
                        toast.error('Failed to download invoice')
                      }
                    }
                    exportPDF()
                    setOpenMoreActionsDropdown(null)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.83301 8.33301L9.99967 12.4997L14.1663 8.33301" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 12.5V2.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Export Invoice as PDF
                </div>

                {/* ✅ Generate Invoice */}
                {/* <div 
                  className="more-actions-dropdown-item"
                  style={{
                    padding: '12px 16px',
                    color: 'black',
                    fontFamily: 'Montserrat',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  onClick={() => {
                    handleActionClick('generate-invoice', item)
                    setOpenMoreActionsDropdown(null)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M3.33301 17.7337V2.26699C3.33301 1.93562 3.60164 1.66699 3.93301 1.66699H13.5011C13.6603 1.66699 13.8129 1.73021 13.9254 1.84273L16.4906 4.40792C16.6031 4.52044 16.6663 4.67306 16.6663 4.83219V17.7337C16.6663 18.065 16.3977 18.3337 16.0663 18.3337H3.93301C3.60164 18.3337 3.33301 18.065 3.33301 17.7337Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.66699 8.33301H13.3337" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.66699 15H13.3337" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.66699 11.667H10.0003" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.333 1.66699V4.40033C13.333 4.7317 13.6016 5.00033 13.933 5.00033H16.6663" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Generate Invoice
                </div> */}

                {/* ✅ Archive Invoice */}
                <div 
                  className="more-actions-dropdown-item"
                  style={{
                    padding: '12px 16px',
                    color: 'black',
                    fontFamily: 'Montserrat',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  onClick={() => {
                    handleActionClick('archive-invoice', item)
                    setOpenMoreActionsDropdown(null)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 6.66699V15.0003C2.5 15.442 2.67559 15.8656 2.98816 16.1782C3.30072 16.4907 3.72464 16.6663 4.16667 16.6663H15.8333C16.2754 16.6663 16.6993 16.4907 17.0118 16.1782C17.3244 15.8656 17.5 15.442 17.5 15.0003V6.66699" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.3337 3.33301H1.66699V6.66634H18.3337V3.33301Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.33301 10H11.6663" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Archive Invoice
                </div>

                {/* ✅ Delete Invoice - only show if not instructor */}
                {!isInstructor && (
                  <div 
                    className="more-actions-dropdown-item"
                    style={{
                      padding: '12px 16px',
                      color: '#DC3545',
                      fontFamily: 'Montserrat',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    onClick={() => {
                      handleActionClick('delete-invoice', item)
                      setOpenMoreActionsDropdown(null)
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M16.1261 17.4997H3.87356C2.33553 17.4997 1.37308 15.8361 2.13974 14.5027L8.26603 3.84833C9.03504 2.51092 10.9646 2.51092 11.7336 3.84833L17.8599 14.5027C18.6266 15.8361 17.6641 17.4997 16.1261 17.4997Z" stroke="#DC3545" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10 7.5V10.8333" stroke="#DC3545" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M10 14.1753L10.0083 14.1661" stroke="#DC3545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete Invoice
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )
    } else if (activeTab === 'Reports') {
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
          <div style={{ position: 'relative' }} ref={el => moreActionsDropdownRefs.current[item.id] = el}>
            <button
              className="action-btn more-actions-btn"
              onClick={(e) => handleMoreActionsClick(item.id, e)}
              title="More Actions"
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
                <div 
                  className="more-actions-dropdown-item"
                  style={{
                    padding: '12px 16px',
                    color: 'black',
                    fontFamily: 'Montserrat',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  onClick={() => {
                    handleActionClick('archive', item)
                    setOpenMoreActionsDropdown(null)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 6.66699V15.0003C2.5 15.442 2.67559 15.8656 2.98816 16.1782C3.30072 16.4907 3.72464 16.6663 4.16667 16.6663H15.8333C16.2754 16.6663 16.6993 16.4907 17.0118 16.1782C17.3244 15.8656 17.5 15.442 17.5 15.0003V6.66699" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.3337 3.33301H1.66699V6.66634H18.3337V3.33301Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8.33301 10H11.6663" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Archive Report
                </div>

                <div 
                  className="more-actions-dropdown-item"
                  style={{
                    padding: '12px 16px',
                    color: '#DC3545',
                    fontFamily: 'Montserrat',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  onClick={() => {
                    handleActionClick('delete', item)
                    setOpenMoreActionsDropdown(null)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 5H4.16667H17.5" stroke="#DC3545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.8337 4.99967V16.6663C15.8337 17.108 15.6581 17.5316 15.3455 17.8441C15.033 18.1567 14.6094 18.3323 14.167 18.3323H5.83366C5.39163 18.3323 4.96807 18.1567 4.65551 17.8441C4.34295 17.5316 4.16699 17.108 4.16699 16.6663V4.99967M6.66699 4.99967V3.33301C6.66699 2.89098 6.84295 2.46742 7.15551 2.15486C7.46807 1.8423 7.89163 1.66634 8.33366 1.66634H11.667C12.109 1.66634 12.5326 1.8423 12.8451 2.15486C13.1577 2.46742 13.3337 2.89098 13.3337 3.33301V4.99967" stroke="#DC3545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete Report
                </div>

                <div 
                  className="more-actions-dropdown-item"
                  style={{
                    padding: '12px 16px',
                    color: 'black',
                    fontFamily: 'Montserrat',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  onClick={() => {
                    handleActionClick('export', item)
                    setOpenMoreActionsDropdown(null)
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.83301 8.33301L9.99967 12.4997L14.1663 8.33301" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 12.5V2.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Export Report
                </div>
              </div>
            )}
          </div>
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