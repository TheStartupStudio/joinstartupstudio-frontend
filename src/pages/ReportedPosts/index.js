import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Modal, ModalBody } from 'reactstrap'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import DataTable from '../../components/DataTable'
import AcademyBtn from '../../components/AcademyBtn'
import ViewReportedContentModal from '../../components/Modals/ViewReportedContentModal'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import blueManagerBG from '../../assets/images/academy-icons/svg/bg-blue-menager.png'
import axiosInstance from '../../utils/AxiosInstance'

import './ReportedPosts.css'

const ReportedPosts = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [searchQuery, setSearchQuery] = useState('')
  const [showBulkDropdown, setShowBulkDropdown] = useState(false)
  const [reportsData, setReportsData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedReports, setSelectedReports] = useState([])
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedReportId, setSelectedReportId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)
  const [isArchiveView, setIsArchiveView] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const bulkDropdownRef = useRef(null)

  useEffect(() => {
    fetchReports()
  }, [currentPage, isArchiveView])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const endpoint = isArchiveView 
        ? `/forum/reports/archived?page=${currentPage}&limit=${limit}`
        : `/forum/reports?page=${currentPage}&limit=${limit}`
      
      const response = await axiosInstance.get(endpoint)
      
      console.log('API Response:', response.data)
      
      // Get reports from the new backend structure
      const reports = response.data.data?.reports || response.data.reports || []
      
      console.log('Reports found:', reports)
      
      // Transform the reports data to match table format
      const transformedData = reports.map(report => ({
        id: report.id,
        reportDate: report.reportDate || 'N/A',
        status: (report.status === 'resolved' || report.status === 'dismissed' || report.status === 'archived') ? 'complete' : 'incomplete',
        reportType: report.reasonFlagged || report.reportType || 'N/A',
        resolution: report.resolution || (
          report.status === 'resolved' ? 'Resolved' : 
          report.status === 'archived' ? 'Archived' :
          report.status === 'dismissed' ? 'Dismissed' : 
          'Pending Review'
        ),
        postTitle: report.postTitle || report.title || 'N/A',
        postContent: report.postContent || report.description || 'N/A',
        reportedBy: report.reportedBy || 'Unknown',
        email: report.email || 'N/A',
        postedBy: report.postedBy || 'Unknown',
        reasonFlagged: report.reasonFlagged || report.reportType || 'N/A',
        additionalDetails: report.additionalDetails || 'No additional details provided',
        rawData: report // Keep raw data for reference
      }))
      
      console.log('Transformed data:', transformedData)
      
      setReportsData(transformedData)
      
      const total = response.data.data?.total || response.data.total || reports.length
      const totalPagesCount = response.data.data?.totalPages || response.data.totalPages || Math.ceil(total / limit) || 1
      setTotalPages(totalPagesCount)
    } catch (error) {
      console.error('Error fetching reports:', error)
      toast.error('Failed to fetch reports')
    } finally {
      setLoading(false)
    }
  }

  const columns = useMemo(() => [
    {
      key: 'reportDate',
      title: 'REPORT DATE',
      sortable: true,
      filterable: true,
      width: '15%',
      render: (value) => <span>{value}</span>
    },
    {
      key: 'status',
      title: 'STATUS',
      sortable: true,
      filterable: true,
      width: '15%',
      render: (value) => (
        <span className={`status-with-dot status-${value}`}>
          <span className="status-dot"></span>
          {value === 'complete' ? 'Complete' : 'Incomplete'}
        </span>
      )
    },
    {
      key: 'reportType',
      title: 'REPORT TYPE',
      sortable: true,
      filterable: true,
      width: '15%',
      render: (value) => <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
    },
    {
      key: 'resolution',
      title: 'RESOLUTION',
      sortable: true,
      filterable: true,
      width: '25%',
      render: (value) => <span>{value}</span>
    }
  ], [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSelectionChange = (selectedItems) => {
    setSelectedReports(selectedItems)
  }

  const handleRowAction = async (actionType, item) => {
    console.log(`${actionType} action for:`, item)
    
    switch (actionType) {
      case 'view':
        setSelectedReportId(item.id)
        setShowViewModal(true)
        break
      case 'archive':
        await handleSingleArchive(item.id)
        break
      case 'delete':
        await handleSingleDelete(item.id)
        break
      case 'export':
        await handleSingleExport(item.id)
        break
      default:
        break
    }
  }

  const handleSingleArchive = async (reportId) => {
    try {
      if (isArchiveView) {
        await axiosInstance.put(`/forum/reports/${reportId}/unarchive`)
        toast.success(`Report #${reportId} unarchived`)
      } else {
        await axiosInstance.put(`/forum/reports/${reportId}/archive`)
        toast.success(`Report #${reportId} archived`)
      }
      fetchReports()
    } catch (error) {
      console.error(`Error ${isArchiveView ? 'unarchiving' : 'archiving'} report:`, error)
      toast.error(`Failed to ${isArchiveView ? 'unarchive' : 'archive'} report`)
    }
  }

  const handleSingleDelete = (reportId) => {
    setDeleteTarget({ type: 'single', id: reportId })
    setShowDeleteModal(true)
  }

  const confirmSingleDelete = async (reportId) => {
    try {
      await axiosInstance.delete(`/forum/reports/${reportId}/delete`)
      toast.success(`Report #${reportId} deleted`)
      setShowDeleteModal(false)
      setDeleteTarget(null)
      fetchReports()
    } catch (error) {
      console.error('Error deleting report:', error)
      toast.error('Failed to delete report')
    }
  }

  const handleSingleExport = async (reportId) => {
    try {
      const response = await axiosInstance.get(`/forum/reports/${reportId}/export`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report_${reportId}_${new Date().getTime()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success(`Report #${reportId} exported`)
    } catch (error) {
      console.error('Error exporting report:', error)
      toast.error('Failed to export report')
    }
  }

  const handleModalSubmit = async (data) => {
    // The modal now handles the API call itself
    // Just refresh the reports list after action
    fetchReports()
  }

  const handleDeleteConfirm = async () => {
    if (deleteTarget?.type === 'single') {
      await confirmSingleDelete(deleteTarget.id)
    } else if (deleteTarget?.type === 'bulk') {
      await confirmBulkDelete()
    }
  }

  const handleArchiveInstead = async () => {
    if (deleteTarget?.type === 'single') {
      await handleSingleArchive(deleteTarget.id)
      setShowDeleteModal(false)
      setDeleteTarget(null)
    } else if (deleteTarget?.type === 'bulk') {
      await handleBulkArchive()
      setShowDeleteModal(false)
      setDeleteTarget(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setDeleteTarget(null)
  }

  const handleBulkArchive = async () => {
    if (selectedReports.length === 0) {
      toast.warning(`Please select reports to ${isArchiveView ? 'unarchive' : 'archive'}`)
      return
    }
    
    try {
      const reportIds = selectedReports.map(report => report.id)
      
      if (isArchiveView) {
        await axiosInstance.post('/forum/reports/bulk-unarchive', { reportIds })
        toast.success(`${selectedReports.length} report(s) unarchived`)
      } else {
        await axiosInstance.post('/forum/reports/bulk-archive', { reportIds })
        toast.success(`${selectedReports.length} report(s) archived`)
      }
      
      setShowBulkDropdown(false)
      setSelectedReports([])
      fetchReports()
    } catch (error) {
      console.error(`Error ${isArchiveView ? 'unarchiving' : 'archiving'} reports:`, error)
      toast.error(`Failed to ${isArchiveView ? 'unarchive' : 'archive'} reports`)
    }
  }

  const handleBulkDelete = () => {
    if (selectedReports.length === 0) {
      toast.warning('Please select reports to delete')
      return
    }
    setDeleteTarget({ type: 'bulk', reports: selectedReports })
    setShowDeleteModal(true)
  }

  const confirmBulkDelete = async () => {
    try {
      const reportIds = selectedReports.map(report => report.id)
      await axiosInstance.post('/forum/reports/bulk-delete', { reportIds })
      
      toast.success(`${selectedReports.length} report(s) deleted`)
      setShowBulkDropdown(false)
      setSelectedReports([])
      setShowDeleteModal(false)
      setDeleteTarget(null)
      fetchReports()
    } catch (error) {
      console.error('Error deleting reports:', error)
      toast.error('Failed to delete reports')
    }
  }

  const handleBulkExport = async () => {
    if (selectedReports.length === 0) {
      toast.warning('Please select reports to export')
      return
    }
    
    try {
      const reportIds = selectedReports.map(report => report.id)
      const response = await axiosInstance.post('/forum/reports/bulk-export', 
        { reportIds },
        { responseType: 'blob' }
      )
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reports_export_${new Date().getTime()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success(`Exporting ${selectedReports.length} report(s)`)
      setShowBulkDropdown(false)
    } catch (error) {
      console.error('Error exporting reports:', error)
      toast.error('Failed to export reports')
    }
  }

  const handleViewArchive = () => {
    setIsArchiveView(!isArchiveView)
    setCurrentPage(1)
    setSelectedReports([])
  }

  const handleReturnToForum = () => {
    if (isArchiveView) {
      // Return to current reports from archive view
      setIsArchiveView(false)
      setCurrentPage(1)
      setSelectedReports([])
    } else {
      // Return to forum from current reports view
      history.push('/startup-forum')
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleFirstPage = () => handlePageChange(1)
  const handleLastPage = () => handlePageChange(totalPages)
  const handlePrevPage = () => handlePageChange(currentPage - 1)
  const handleNextPage = () => handlePageChange(currentPage + 1)

  const bulkOptions = [
    {
      name: isArchiveView ? 'Unarchive Reports' : 'Archive Reports',
      action: handleBulkArchive,
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M16.667 8.33301V15.833C16.667 16.7535 15.9208 17.4997 15.0003 17.4997H5.00033C4.07985 17.4997 3.33366 16.7535 3.33366 15.833V8.33301" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.3337 4.16699H1.66699V8.33366H18.3337V4.16699Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.33301 11.667H11.6663" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Delete Reports',
      action: handleBulkDelete,
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M2.5 5H4.16667H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.8337 4.99967V16.6663C15.8337 17.108 15.6581 17.5316 15.3455 17.8441C15.033 18.1567 14.6094 18.3323 14.167 18.3323H5.83366C5.39163 18.3323 4.96807 18.1567 4.65551 17.8441C4.34295 17.5316 4.16699 17.108 4.16699 16.6663V4.99967M6.66699 4.99967V3.33301C6.66699 2.89098 6.84295 2.46742 7.15551 2.15486C7.46807 1.8423 7.89163 1.66634 8.33366 1.66634H11.667C12.109 1.66634 12.5326 1.8423 12.8451 2.15486C13.1577 2.46742 13.3337 2.89098 13.3337 3.33301V4.99967" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      name: 'Export Reports',
      action: handleBulkExport,
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.83301 8.33301L9.99967 12.4997L14.1663 8.33301" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 12.5V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    <div className="reported-posts-page">
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
                {isArchiveView ? 'REPORTED CONTENT ARCHIVE' : 'REPORTED POSTS MANAGEMENT'}
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
                {isArchiveView ? 'View and manage archived reported content' : 'Review and manage reported forum posts'}
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
      
      <div className="reported-posts-container position-relative">
        <img 
          src={blueManagerBG} 
          className='position-absolute' 
          style={{
            top: 0, 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 0,
            pointerEvents: 'none',
            width: '100dvw',
            height: '100dvh'
          }} 
          alt="Decorative background"
          aria-hidden="true"
        />

        <div className='main-search-table-container'>
          <div className="search-actions-bar">
            <div className='d-flex align-items-center gap-2' style={{fontSize: "15px", fontWeight: "500", cursor: "pointer"}} onClick={handleReturnToForum}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6.52005 10.8333L10.6034 14.9167C10.7701 15.0833 10.8501 15.2778 10.8434 15.5C10.8367 15.7222 10.7498 15.9167 10.5826 16.0833C10.4159 16.2361 10.2214 16.3161 9.99922 16.3233C9.777 16.3306 9.58255 16.2506 9.41588 16.0833L3.91588 10.5833C3.83255 10.5 3.77338 10.4097 3.73838 10.3125C3.70338 10.2153 3.68644 10.1111 3.68755 10C3.68866 9.88889 3.70616 9.78472 3.74005 9.6875C3.77394 9.59028 3.83283 9.5 3.91672 9.41667L9.41672 3.91667C9.5695 3.76389 9.76061 3.6875 9.99005 3.6875C10.2195 3.6875 10.4173 3.76389 10.5834 3.91667C10.7501 4.08333 10.8334 4.28139 10.8334 4.51083C10.8334 4.74028 10.7501 4.93806 10.5834 5.10417L6.52005 9.16667H15.8326C16.0687 9.16667 16.2667 9.24667 16.4267 9.40667C16.5867 9.56667 16.6664 9.76444 16.6659 10C16.6653 10.2356 16.5853 10.4336 16.4259 10.5942C16.2664 10.7547 16.0687 10.8344 15.8326 10.8333H6.52005Z" fill="black"/>
                </svg>
                {isArchiveView ? 'Return to Current Reports' : 'Return to Forum'}
            </div>
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search reports"
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

              {!isArchiveView && (
                <div>
                  <AcademyBtn
                    title={isArchiveView ? "View Active Reports" : "View Archive"}
                    onClick={handleViewArchive}
                  />
                </div>
              )}

              <div className="dropdown-wrapper" style={{ position: 'relative' }} ref={bulkDropdownRef}>
                <div 
                  className="bulk-actions"
                  onClick={() => {
                    setShowBulkDropdown(!showBulkDropdown)
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
                        {option.name}
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
              data={reportsData}
              searchQuery={searchQuery}
              onRowAction={handleRowAction}
              showCheckbox={true}
              activeTab="Reports"
              selectedItems={selectedReports}
              onSelectionChange={handleSelectionChange}
              loading={loading}
              customActions={[
                { type: 'archive', label: isArchiveView ? 'Unarchive Report' : 'Archive Report' },
                { type: 'delete', label: 'Delete Report' },
                { type: 'export', label: 'Export Report' }
              ]}
            />
          </div>

          <div className="pagination-container">
            <button className="pagination-btn" onClick={handleFirstPage} disabled={currentPage === 1}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 6L5 12L11 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6L13 12L19 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="pagination-btn" onClick={handlePrevPage} disabled={currentPage === 1}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M15.75 6L9.75 12L15.75 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="pagination-info">{currentPage} / {totalPages}</span>
            <button className="pagination-btn" onClick={handleNextPage} disabled={currentPage === totalPages}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M9.25 6L15.25 12L9.25 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="pagination-btn" onClick={handleLastPage} disabled={currentPage === totalPages}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 6L19 12L13 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 6L11 12L5 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <ViewReportedContentModal
        isOpen={showViewModal}
        toggle={() => {
          setShowViewModal(false)
          setSelectedReportId(null)
        }}
        reportId={selectedReportId}
        onSubmit={handleModalSubmit}
      />

      <Modal isOpen={showDeleteModal} toggle={handleDeleteCancel} className="delete-confirmation-modal" size="md">
        <ModalBody>
          <div className="delete-modal-content">
          <div className='d-flex align-items-start gap-4 flex-column w-100'>

          
            <div className="delete-modal-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.1256 17.4987H3.87307C2.33504 17.4987 1.37259 15.8351 2.13926 14.5018L8.26554 3.84736C9.03455 2.50995 10.9641 2.50995 11.7332 3.84736L17.8594 14.5018C18.6261 15.8351 17.6637 17.4987 16.1256 17.4987Z" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10 7.5V10.8333" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10 14.1763L10.0083 14.167" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            
            <h2 className="delete-modal-title">Delete Report{deleteTarget?.type === 'bulk' ? '(s)' : ''}?</h2>

            </div>
            
            <p className="delete-modal-message">
              Are you sure you want to delete the report{deleteTarget?.type === 'bulk' ? '(s)' : ''}? This cannot be undone.
              <br />
              Alternatively, you can archive the report{deleteTarget?.type === 'bulk' ? '(s)' : ''} instead.
            </p>
            
            <div className="delete-modal-actions">
              <button className="delete-modal-btn delete-modal-btn-archive" onClick={handleArchiveInstead}>
                Archive Report{deleteTarget?.type === 'bulk' ? 's' : ''}
              </button>
              <button className="delete-modal-btn delete-modal-btn-cancel" onClick={handleDeleteCancel}>
                No, Take Me Back
              </button>
              <button className="delete-modal-btn delete-modal-btn-delete" onClick={handleDeleteConfirm}>
                Delete Report{deleteTarget?.type === 'bulk' ? 's' : ''}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default ReportedPosts
