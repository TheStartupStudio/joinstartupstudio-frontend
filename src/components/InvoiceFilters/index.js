import React, { useState, useRef, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaTimes } from 'react-icons/fa'
import './index.css'

const InvoiceFilters = ({ show, onHide, onApplyFilters, anchorRef, initialFilters }) => {
  const [organizationName, setOrganizationName] = useState('')
  const [dateFrom, setDateFrom] = useState(null)
  const [dateTo, setDateTo] = useState(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const panelRef = useRef(null)

  // Initialize filters from props when component mounts or initialFilters change
  useEffect(() => {
    if (initialFilters && !isInitialized) {
      setOrganizationName(initialFilters.organizationName || '')
      setDateFrom(initialFilters.dateFrom)
      setDateTo(initialFilters.dateTo)
      setIsInitialized(true)
    }
  }, [initialFilters, isInitialized])

  // Reset filters when the filter panel is closed
  useEffect(() => {
    if (!show) {
      console.log('InvoiceFilters: Panel closed, resetting filters')
      setOrganizationName('')
      setDateFrom(null)
      setDateTo(null)
      // Reset isInitialized so filters can be re-initialized if reopened
      setIsInitialized(false)

      // Trigger reset in parent component
      if (onApplyFilters) {
        console.log('InvoiceFilters: Resetting parent filters')
        onApplyFilters({
          organizationName: '',
          dateFrom: null,
          dateTo: null
        })
      }
    }
  }, [show, onApplyFilters])

  // Apply filters whenever they change (only after initialization)
  useEffect(() => {
    if (onApplyFilters && isInitialized) {
      // Check if filters have actually changed from initial values
      const hasChanged =
        organizationName !== (initialFilters?.organizationName || '') ||
        dateFrom !== initialFilters?.dateFrom ||
        dateTo !== initialFilters?.dateTo

      if (hasChanged) {
        const filterData = {
          organizationName,
          dateFrom,
          dateTo
        }
        console.log('InvoiceFilters: Applying filters:', filterData)
        onApplyFilters(filterData)
      }
    }
  }, [organizationName, dateFrom, dateTo, onApplyFilters, isInitialized, initialFilters])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(event.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onHide()
      }
    }

    if (show) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [show, onHide, anchorRef])

  if (!show) return null

  return (
    <div 
      ref={panelRef}
      className={`invoice-filters-dropdown ${show ? 'show' : ''}`}
    >
      <div className="filter-dropdown-content">
        {/* Search by Organization Name */}
        <div className="filter-section">
          <div className="filter-section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_3995_31173)">
                    <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_3995_31173">
                    <rect width="20" height="20" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
            <span className="filter-label">Search by Organization Name</span>
          </div>
          <div className="filter-input-wrapper">
            <input
              type="text"
              placeholder="Add organization name here..."
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              className="filter-input"
            />
            <svg 
              className="search-input-icon"
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
            >
              <path 
                d="M17 17L12.514 12.506L17 17ZM14.5 8.5C14.5 11.8137 11.8137 14.5 8.5 14.5C5.18629 14.5 2.5 11.8137 2.5 8.5C2.5 5.18629 5.18629 2.5 8.5 2.5C11.8137 2.5 14.5 5.18629 14.5 8.5Z" 
                stroke="#999" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            {organizationName && (
              <button 
                className="clear-input-btn"
                onClick={() => setOrganizationName('')}
                style={{
                  position: 'absolute',
                  right: '40px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#999',
                  fontSize: '14px'
                }}
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Search by Date Range */}
        <div className="filter-section">
          <div className="filter-section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_3995_31173)">
                    <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_3995_31173">
                    <rect width="20" height="20" fill="white"/>
                    </clipPath>
                </defs>
            </svg>
            <span className="filter-label">Search by Date Range</span>
          </div>

          <div className="date-range-inputs">
            <div className="date-input-group">
              <label className="date-label">From:</label>
              <div className="date-picker-wrapper">
                <DatePicker
                  selected={dateFrom}
                  onChange={(date) => setDateFrom(date)}
                  placeholderText="Choose Date"
                  dateFormat="MM/dd/yyyy"
                  className="date-input"
                  isClearable
                />
                <svg 
                  className="calendar-icon" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
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
              </div>
            </div>

            <div className="date-input-group">
              <label className="date-label">To:</label>
              <div className="date-picker-wrapper">
                <DatePicker
                  selected={dateTo}
                  onChange={(date) => setDateTo(date)}
                  placeholderText="Choose Date"
                  dateFormat="MM/dd/yyyy"
                  className="date-input"
                  minDate={dateFrom}
                  isClearable
                />
                <svg 
                  className="calendar-icon" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoiceFilters