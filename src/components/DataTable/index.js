import React, { useState } from 'react'
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
  activeTab = 'Organizations' // Add this prop to determine current tab
}) => {
  
  const [openFilterDropdown, setOpenFilterDropdown] = useState(null)
  const [activeFilters, setActiveFilters] = useState({})
  
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

  const renderActions = (item) => {
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
        <button
          className="action-btn more-actions-btn"
          onClick={() => handleActionClick('more', item)}
        >
          <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
            <circle cx="2" cy="2" r="2" fill="currentColor" />
            <circle cx="8" cy="2" r="2" fill="currentColor" />
            <circle cx="14" cy="2" r="2" fill="currentColor" />
          </svg>
        </button>
      </div>
    )
  }

  const getFilterOptions = (columnKey) => {
    if (activeTab === 'Organizations') {
      // For organizations, all filterable columns show Active/Inactive
      return ['Active', 'Inactive']
    } else {
      // For users
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
                    <div className="header-icons" style={{ position: 'relative' }}>
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
                            border: '1px solid #e5e7eb',
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