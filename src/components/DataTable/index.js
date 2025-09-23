import React from 'react'
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
  showCheckbox = true 
}) => {
  
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
                          <path d="M2.5 10.8335C5.5 4.16683 14.5 4.16683 17.5 10.8335" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M10 14.1665C8.61929 14.1665 7.5 13.0472 7.5 11.6665C7.5 10.2858 8.61929 9.1665 10 9.1665C11.3807 9.1665 12.5 10.2858 12.5 11.6665C12.5 13.0472 11.3807 14.1665 10 14.1665Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
                    <div className="header-icons">
                      <img src={filter} alt="graph" className="header-icon" />
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