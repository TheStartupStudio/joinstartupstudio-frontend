import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import './index.css'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import DataTable from '../../components/DataTable'
import axiosInstance from '../../utils/AxiosInstance'
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import blueManagerBG from '../../assets/images/academy-icons/svg/bg-blue-menager.png'


const TssFeedback = () => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user.user)
  const userRole = user?.role_id || localStorage.getItem('role')

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [loading, setLoading] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  // Feedback data and pagination
  const [feedbackData, setFeedbackData] = useState([])
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackPagination, setFeedbackPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1) // Reset to first page when search changes
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Function to fetch feedback data
  const fetchFeedback = async (page = 1, search = '') => {
    setFeedbackLoading(true)
    try {
      const response = await axiosInstance.get('/startup-studio/feedback', {
        params: {
          page,
          limit: 10,
          search: search || undefined
        }
      })

      if (response.data) {
        // Assuming the response structure is an array of feedback items
        // If it's paginated, adjust accordingly
        if (Array.isArray(response.data)) {
          setFeedbackData(response.data)
          setFeedbackPagination({
            total: response.data.length,
            page: 1,
            limit: 10,
            totalPages: Math.ceil(response.data.length / 10)
          })
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setFeedbackData(response.data.data)
          setFeedbackPagination(response.data.pagination || {
            total: response.data.data.length,
            page: 1,
            limit: 10,
            totalPages: Math.ceil(response.data.data.length / 10)
          })
        }
      }
    } catch (error) {
      console.error('Error fetching TSS feedback:', error)
      toast.error('Failed to load feedback data')
    } finally {
      setFeedbackLoading(false)
    }
  }

  // Fetch data when component mounts or when debounced search/page changes
  useEffect(() => {
    fetchFeedback(currentPage, debouncedSearchQuery)
  }, [currentPage, debouncedSearchQuery])

  const feedbackColumns = useMemo(() => [
    {
      key: 'name',
      title: 'NAME',
      sortable: true,
      filterable: true,
      render: (value, item) => (
        <div className="learner-info">
          <div className="learner-details">
            <div className="learner-name">{item.name || 'N/A'}</div>
            <div className="learner-email">{item.email || ''}</div>
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      title: 'DATE SUBMITTED',
      sortable: true,
      render: (value) => (
        <span className="last-active">
          {value ? new Date(value).toLocaleDateString('en-US', {
            month: '2-digit',
            day: 'numeric',
            year: 'numeric'
          }) : 'N/A'}
        </span>
      )
    }
  ], [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRowAction = (actionType, item) => {
    console.log(`${actionType} action for:`, item)

    switch (actionType) {
      case 'view-feedback':
        setSelectedFeedback(item)
        setShowViewModal(true)
        break
      default:
        break
    }
  }

  const handleViewModalClose = () => {
    setShowViewModal(false)
    setSelectedFeedback(null)
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= feedbackPagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div>
      <div>
        <div className="col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
          <div className="d-flex justify-content-between flex-col-tab align-start-tab" style={{padding: '40px 40px 10px 30px'}}>
            <div className="d-flex flex-column gap-2">
              <h3 className=" text-black mb-0"
                style={{
                  color: '#231F20',
                  fontFamily: 'Montserrat',
                  fontSize: '23px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: 'normal',
                }}
              >
                TSS FEEDBACK
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
                View all TSS feedback submissions
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

      <div className="tss-feedback-container position-relative">
      <img src={blueManagerBG} className='position-absolute' 
        style={{
          top: 0, 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 0,
          pointerEvents: 'none',
          // opacity: 0.1,
          width: '100dvw',
          height: '100dvh'
        }} 
        alt="Decorative background"
        aria-hidden="true"
      />
        <div className="search-actions-bar">
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 17L21 21" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 15.6493C18.1077 14.2022 19 12.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="table-container">
          <DataTable
            columns={feedbackColumns}
            data={feedbackData}
            searchQuery={searchQuery}
            onRowAction={handleRowAction}
            activeTab="tss-feedback"
            loading={feedbackLoading}
            showCheckbox={false}
          />
        </div>

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
          <span className="pagination-info">{currentPage} / {feedbackPagination.totalPages}</span>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === feedbackPagination.totalPages}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
              <path d="M9.25 6L15.25 12L9.25 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(feedbackPagination.totalPages)}
            disabled={currentPage === feedbackPagination.totalPages}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 6L19 12L13 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 6L11 12L5 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <Modal
        isOpen={showViewModal}
        toggle={handleViewModalClose}
        size="lg"
        centered
        className="tss-feedback-view-modal"
      >
        <ModalHeader 
        // toggle={handleViewModalClose} 
        className="feedback-modal-header">
          <div className="modal-header-content">
            <div className="modal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
              <path d="M2.79925 0H12.4778C13.2476 0 13.9474 0.314102 14.4552 0.821873C14.963 1.32964 15.2771 2.02946 15.2771 2.79925V9.04223C15.2771 9.81202 14.963 10.5118 14.4552 11.0196C13.9474 11.5274 13.2476 11.8415 12.4778 11.8415H7.63772L3.38677 15.4951C3.18984 15.6644 2.89202 15.6416 2.72276 15.4431C2.63976 15.3454 2.60233 15.225 2.61046 15.1062L2.83668 11.8399H2.79925C2.02946 11.8399 1.32964 11.5257 0.821873 11.018C0.314102 10.5118 0 9.81202 0 9.04223V2.79925C0 2.02946 0.314102 1.32964 0.821873 0.821873C1.32802 0.314102 2.02783 0 2.79925 0ZM16.6507 4.55366C17.1991 4.65945 17.6906 4.92961 18.0714 5.31044C18.5678 5.80682 18.877 6.49198 18.877 7.24713V13.4901C18.877 14.2453 18.5694 14.9304 18.0714 15.4268C17.5751 15.9232 16.8899 16.2324 16.1347 16.2324H16.0355L16.2666 19.5589C16.2731 19.6631 16.2422 19.7705 16.1689 19.8551C16.0208 20.0293 15.7588 20.0488 15.5863 19.9007L11.3191 16.125H5.69778L8.4661 13.3095H14.3315C15.6107 13.3095 16.6588 12.263 16.6588 10.9822V4.73757C16.6572 4.67572 16.6555 4.61388 16.6507 4.55366ZM4.17935 7.10879C3.91895 7.10879 3.70738 6.89722 3.70738 6.63683C3.70738 6.37643 3.91895 6.16486 4.17935 6.16486H9.11872C9.37911 6.16486 9.59069 6.37643 9.59069 6.63683C9.59069 6.89722 9.37911 7.10879 9.11872 7.10879H4.17935ZM4.17935 4.77174C3.91895 4.77174 3.70738 4.56017 3.70738 4.29978C3.70738 4.03938 3.91895 3.82781 4.17935 3.82781H11.1807C11.4411 3.82781 11.6527 4.03938 11.6527 4.29978C11.6527 4.56017 11.4411 4.77174 11.1807 4.77174H4.17935ZM12.4762 0.943933H2.79925C2.28985 0.943933 1.82602 1.15225 1.48914 1.48914C1.15225 1.82602 0.943933 2.28822 0.943933 2.79925V9.04223C0.943933 9.55163 1.15225 10.0155 1.48914 10.3523C1.82602 10.6892 2.28985 10.8975 2.79925 10.8975H3.34283V10.8992L3.37375 10.9008C3.63251 10.9187 3.82944 11.1433 3.81154 11.4021L3.62763 14.0483L7.13321 11.0343C7.21783 10.9496 7.33501 10.8975 7.46521 10.8975H12.4762C12.9856 10.8975 13.4494 10.6892 13.7863 10.3523C14.1232 10.0155 14.3315 9.55163 14.3315 9.04223V2.79925C14.3315 2.28985 14.1232 1.82602 13.7863 1.48914C13.451 1.15225 12.9872 0.943933 12.4762 0.943933Z" fill="black"/>
            </svg>
            </div>
            <h5 className="mb-0 modal-title">TSS Feedback Details</h5>
          </div>
        </ModalHeader>
        <ModalBody className="feedback-modal-body">
          {selectedFeedback && (
            <div className="feedback-details-container">
              {/* Personal Information Section */}
              <div className="feedback-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h6 className="section-title">Personal Information</h6>
                </div>
                <div className="section-content">
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Name
                      </div>
                      <div className="info-value">{selectedFeedback.name || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 8L10.89 4.26C11.2187 4.10222 11.5808 4.05155 11.9366 4.11381C12.2924 4.17608 12.6239 4.34802 12.89 4.61L21 12V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V8Z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 8L9.89 11.74C10.2187 11.8978 10.5808 11.9485 10.9366 11.8862C11.2924 11.8239 11.6239 11.652 11.89 11.39L20 4" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Email
                      </div>
                      <div className="info-value">{selectedFeedback.email || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2"/>
                          <path d="M12 6V12L16 14" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Age
                      </div>
                      <div className="info-value">{selectedFeedback.age || 'N/A'}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#9ca3af" strokeWidth="2"/>
                          <path d="M16 2V6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 2V6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 10H21" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Date Submitted
                      </div>
                      <div className="info-value">
                        {selectedFeedback.createdAt
                          ? new Date(selectedFeedback.createdAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Identity Questions Section */}
              <div className="feedback-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#6b7280" strokeWidth="2"/>
                  </svg>
                  <h6 className="section-title">Identity Questions</h6>
                </div>
                <div className="section-content">
                  <div className="question-item">
                    <div className="question-label">
                      <span className="question-number">1</span>
                      Who Are You?
                    </div>
                    <div className="question-answer">{selectedFeedback.who_are_you || 'N/A'}</div>
                  </div>
                  <div className="question-item">
                    <div className="question-label">
                      <span className="question-number">2</span>
                      What Can You Do?
                    </div>
                    <div className="question-answer">{selectedFeedback.what_can_you_do || 'N/A'}</div>
                  </div>
                  <div className="question-item">
                    <div className="question-label">
                      <span className="question-number">3</span>
                      How Do You Prove It?
                    </div>
                    <div className="question-answer">{selectedFeedback.how_prove_it || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="feedback-section">
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h6 className="section-title">Personalized Feedback</h6>
                </div>
                <div className="section-content">
                  <div className="feedback-content-card">
                    <div className="feedback-text">
                      {selectedFeedback.feedback
                        ? selectedFeedback.feedback.split('\\n').map((line, index) => (
                            <p key={index} className="feedback-paragraph">
                              {line}
                            </p>
                          ))
                        : <p className="no-feedback">No feedback available</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
            <button className="close-btn" onClick={handleViewModalClose}>Close</button>
          </div>
          
        </ModalBody>
      </Modal>
    </div>
  )
}

export default TssFeedback
