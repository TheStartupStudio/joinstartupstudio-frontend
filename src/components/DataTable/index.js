import React, { useState, useRef, useEffect } from 'react'
import './index.css'
import graph from '../../assets/images/academy-icons/svg/Icon_Sort.svg'
import filter from '../../assets/images/academy-icons/svg/Dropdown_ Filter by Level.svg'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const DataTable = ({ 
  columns, 
  data, 
  onRowAction,
  searchQuery = '',
  showCheckbox = true,
  activeTab = 'Organizations'
}) => {
  
  const [openFilterDropdown, setOpenFilterDropdown] = useState(null)
  const [activeFilters, setActiveFilters] = useState({})
  const [openMoreActionsDropdown, setOpenMoreActionsDropdown] = useState(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  
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

  const renderActions = (item) => {
    if (activeTab === 'Organizations') {
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
                <input type="checkbox" className="checkbox" />
              </th>
            )}
            {columns.map((column, index) => (
              <th key={index} className={column.className || ''}>
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
          {filteredData.map((item) => (
            <tr key={item.id}>
              {showCheckbox && (
                <td className="checkbox-column">
                  <input type="checkbox" className="checkbox" />
                </td>
              )}
              {columns.map((column, index) => (
                <td key={index} className={column.className || ''}>
                  {renderCell(column, item)}
                </td>
              ))}
              <td className="actions-column">
                {renderActions(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable