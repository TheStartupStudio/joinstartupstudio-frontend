import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import DataTable from '../../DataTable'
import AcademyBtn from '../../AcademyBtn'
import UserManagementPopup from '../AlertPopup'
import AddNewLearner from '../AddNewLearner'
import ViewLearnerModal from '../ViewLearnerModal'
import BulkAddLearnersModal from '../BulkAddLearnersModal'
import groupAdd from '../../../assets/images/academy-icons/svg/user-group-add.svg'
import userPlus from '../../../assets/images/academy-icons/svg/Icon_User_Add_Alt.svg'
import userDeactivate from '../../../assets/images/academy-icons/svg/Icon_User_de.svg'
import warningTriangle from '../../../assets/images/academy-icons/svg/warning-triangle.svg'
import userPassword from '../../../assets/images/academy-icons/svg/Icon_User_Pass.svg'
import download from '../../../assets/images/academy-icons/svg/download.svg'
import newCity from '../../../assets/images/academy-icons/credit-card-slash.png'
import leftArrow from '../../../assets/images/academy-icons/left-arrow.png'
import axiosInstance from '../../../utils/AxiosInstance'
import './index.css'

const ViewFailedPayments = ({ show, onHide }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Data and pagination
  const [failedPaymentsData, setFailedPaymentsData] = useState([])
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1
  })

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch failed payments data
  const fetchFailedPayments = async (page = 1, search = '') => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/super-admin/failed-payments', {
        params: {
          page,
          limit: 50,
          search: search || undefined
        }
      })

      if (response.data.success) {
        setFailedPaymentsData(response.data.data)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching failed payments:', error)
      toast.error('Failed to load failed payments data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when modal opens or when search/page changes
  useEffect(() => {
    if (show) {
      fetchFailedPayments(currentPage, debouncedSearchQuery)
    }
  }, [show, currentPage, debouncedSearchQuery])

  // Reset state when modal closes
  useEffect(() => {
    if (!show) {
      setSearchQuery('')
      setCurrentPage(1)
      setFailedPaymentsData([])
    }
  }, [show])

  const failedPaymentsColumns = useMemo(() => [
    {
      key: 'name',
      title: 'USER NAME',
      sortable: true,
      filterable: true,
      render: (value, item) => (
        <div className="learner-info">
          <div className="learner-details">
            <div className="learner-name">{item.name}</div>
            <div className="learner-email">{item.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'planType',
      title: 'PLAN TYPE',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`level-badge level-${value?.toLowerCase()}`}>
          {value || 'N/A'}
        </span>
      )
    },
    {
      key: 'planStartDate',
      title: 'PLAN START DATE',
      sortable: true,
      render: (value) => (
        <span className="date-text">{value || 'N/A'}</span>
      )
    },
    {
      key: 'paymentFailedDate',
      title: 'PAYMENT FAILED DATE',
      sortable: true,
      render: (value) => (
        <span className="date-text">{value || 'N/A'}</span>
      )
    },
    
  ], [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop={true}
      keyboard={true}
      className="view-failed-payment-modal"
      centered
      size="xl"
    >
      <div className="modal-content-wrapper">
        {/* Header */}
        <div className="modal-header-learners position-relative">
          <div className="d-flex flex-column gap-3">
            <img 
              src={newCity} 
              style={{
                padding: '8px', 
                borderRadius:"50%", 
                backgroundColor: "#E2E6EC", 
                width: 'fit-content',
                width: '36px',
                height: '36px'
              }} 
              alt="icon"
            />
            <p style={{
              color: '#231F20',
              fontSize: '15px',
              fontWeight: 500,
            }}>
              View Failed Payments
            </p>
          </div>

          <div style={{
            display: 'flex',
            height: 64,
            padding: 17,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 28,
            borderRadius: '0px 24px 0px 24px',
            background: 'var(--COLORS-White, #FFF)',
            boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.25)',
            position: 'absolute',
            top: -26,
            right: -26,
            cursor: 'pointer'
          }}
            onClick={onHide}
          >
            <img src={leftArrow} alt="back" />
          </div>
        </div>

        <div style={{
          borderRadius: 24,
          background: 'var(--Glassy-White, rgba(255, 255, 255, 0.10))',
          boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(60px)',
        }}>
          {/* Search Bar */}
          <div className="search-actions-bar">
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search for User"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-input"
                />
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <DataTable 
              columns={failedPaymentsColumns}
              data={failedPaymentsData}
              searchQuery={searchQuery}
              showCheckbox={false}
              activeTab="FailedPayments"
              loading={loading}
            />
          </div>

          {/* Pagination */}
          <div className="pagination-container">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 6L5 12L11 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6L13 12L19 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M15.75 6L9.75 12L15.75 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="pagination-info">{currentPage} / {pagination.totalPages}</span>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M9.25 6L15.25 12L9.25 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={currentPage === pagination.totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 6L19 12L13 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 6L11 12L5 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ViewFailedPayments