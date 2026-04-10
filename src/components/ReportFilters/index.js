import React, { useState, useRef, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../InvoiceFilters/index.css'
import './index.css'

const STATUS_OPTIONS = ['Complete', 'Incomplete']
const REPORT_TYPE_OPTIONS = ['Bullying', 'Harassment', 'Inappropriate', 'Spam']
const RESOLUTION_OPTIONS = ['Ignored', 'Delete Post', 'Block User', 'Pending Review', 'Resolved', 'Archived', 'Dismissed']

const ReportFilters = ({ show, onHide, onApplyFilters, anchorRef, initialFilters }) => {
  const [dateFrom, setDateFrom] = useState(null)
  const [dateTo, setDateTo] = useState(null)
  const [status, setStatus] = useState('')
  const [reportType, setReportType] = useState('')
  const [resolution, setResolution] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    if (initialFilters && !isInitialized) {
      setDateFrom(initialFilters.reportDate?.from ?? null)
      setDateTo(initialFilters.reportDate?.to ?? null)
      setStatus(initialFilters.status || '')
      setReportType(initialFilters.reportType || '')
      setResolution(initialFilters.resolution || '')
      setIsInitialized(true)
    }
  }, [initialFilters, isInitialized])

  useEffect(() => {
    if (!show) {
      setDateFrom(null)
      setDateTo(null)
      setStatus('')
      setReportType('')
      setResolution('')
      setIsInitialized(false)
      if (onApplyFilters) {
        onApplyFilters({
          reportDate: { from: null, to: null },
          status: '',
          reportType: '',
          resolution: ''
        })
      }
    }
  }, [show, onApplyFilters])

  useEffect(() => {
    if (onApplyFilters && isInitialized) {
      const filterData = {
        reportDate: { from: dateFrom, to: dateTo },
        status: status || undefined,
        reportType: reportType || undefined,
        resolution: resolution || undefined
      }
      onApplyFilters(filterData)
    }
  }, [dateFrom, dateTo, status, reportType, resolution, onApplyFilters, isInitialized])

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
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [show, onHide, anchorRef])

  if (!show) return null

  const calendarSvg = (
    <svg className="calendar-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12.6667 2.66699H3.33333C2.59695 2.66699 2 3.26395 2 4.00033V13.3337C2 14.07 2.59695 14.667 3.33333 14.667H12.6667C13.403 14.667 14 14.07 14 13.3337V4.00033C14 3.26395 13.403 2.66699 12.6667 2.66699Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.6667 1.33301V3.99967" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.33333 1.33301V3.99967" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 6.66699H14" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const sectionHeaderIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#clip0_report_filters)">
        <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_report_filters">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )

  return (
    <div ref={panelRef} className="invoice-filters-dropdown show">
      <div className="filter-dropdown-content">
        {/* Date Range */}
        <div className="filter-section">
          <div className="filter-section-header">
            {sectionHeaderIcon}
            <span className="filter-label">Filter by Date Range</span>
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
                {calendarSvg}
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
                {calendarSvg}
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        {/* <div className="filter-section">
          <div className="filter-section-header">
            {sectionHeaderIcon}
            <span className="filter-label">Status</span>
          </div>
          <div className="report-filter-options">
            {STATUS_OPTIONS.map((opt) => (
              <div
                key={opt}
                className={`report-filter-option${status === opt ? ' selected' : ''}`}
                onClick={() => setStatus(status === opt ? '' : opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        </div> */}

        {/* Report Type */}
        {/* <div className="filter-section">
          <div className="filter-section-header">
            {sectionHeaderIcon}
            <span className="filter-label">Report Type</span>
          </div>
          <div className="report-filter-options">
            {REPORT_TYPE_OPTIONS.map((opt) => (
              <div
                key={opt}
                className={`report-filter-option${reportType === opt ? ' selected' : ''}`}
                onClick={() => setReportType(reportType === opt ? '' : opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        </div> */}

        {/* Resolution */}
        {/* <div className="filter-section">
          <div className="filter-section-header">
            {sectionHeaderIcon}
            <span className="filter-label">Resolution</span>
          </div>
          <div className="report-filter-options">
            {RESOLUTION_OPTIONS.map((opt) => (
              <div
                key={opt}
                className={`report-filter-option${resolution === opt ? ' selected' : ''}`}
                onClick={() => setResolution(resolution === opt ? '' : opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default ReportFilters
