import React, { useState, useEffect } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { toast } from 'react-toastify'
import AcademyBtn from '../AcademyBtn'
import './ViewReportedContentModal.css'
import axiosInstance from '../../utils/AxiosInstance'

const ViewReportedContentModal = ({ isOpen, toggle, reportData, reportId, onSubmit }) => {
  const [selectedAction, setSelectedAction] = useState('ignore')
  const [reportDetails, setReportDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isResolved, setIsResolved] = useState(false)
  const [userBanStatus, setUserBanStatus] = useState(null)
  const [banStatusLoading, setBanStatusLoading] = useState(false)
  const [userDetails, setUserDetails] = useState(null)

  // Function to strip HTML tags from text
  const stripHtmlTags = (html) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '').trim()
  }

  // Function to fetch user details and ban status
  const fetchUserDetails = async (username) => {
    if (!username) return

    setBanStatusLoading(true)
    try {
      // First try to find user by searching users
      const searchResponse = await axiosInstance.get('/super-admin/users', {
        params: {
          search: username,
          limit: 1
        }
      })

      if (searchResponse.data.success && searchResponse.data.data.length > 0) {
        const user = searchResponse.data.data[0]
        setUserDetails(user)
        setUserBanStatus(user.isBannedForum === 1)
      } else {
        // If not found in users, try learners endpoint
        const learnerResponse = await axiosInstance.get('/super-admin/learners', {
          params: {
            search: username,
            limit: 1
          }
        })

        if (learnerResponse.data.success && learnerResponse.data.data.length > 0) {
          const learner = learnerResponse.data.data[0]
          setUserDetails(learner)
          setUserBanStatus(learner.isBannedForum === 1)
        } else {
          setUserBanStatus(null)
          setUserDetails(null)
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error)
      setUserBanStatus(null)
      setUserDetails(null)
    } finally {
      setBanStatusLoading(false)
    }
  }

  // Function to toggle user's ban status
  const toggleUserBanStatus = async () => {
    if (!userDetails) {
      toast.error('User details not available')
      return
    }

    const newBanStatus = !userBanStatus
    setBanStatusLoading(true)

    try {
      // Assuming there's an endpoint to update user ban status
      const endpoint = userDetails.organization_name ?
        `/forum/${userDetails.id}/ban-forum` :
        `/forum/${userDetails.id}/ban-forum`

      const response = await axiosInstance.patch(endpoint, {
        isBannedForum: newBanStatus ? 1 : 0
      })

      if (response.data.success) {
        setUserBanStatus(newBanStatus)
        toast.success(`User ${newBanStatus ? 'banned' : 'unbanned'} from forum successfully`)
      } else {
        throw new Error('Failed to update ban status')
      }
    } catch (error) {
      console.error('Error toggling ban status:', error)
      toast.error('Failed to update user ban status')
    } finally {
      setBanStatusLoading(false)
    }
  }

  // Function to get action from resolution
  const getActionFromResolution = (resolution) => {
    if (resolution === 'Post deleted by administrator') return 'delete'
    if (resolution === 'User restricted from posting in forum') return 'restrict'
    if (resolution === 'Report reviewed and dismissed by administrator') return 'ignore'
    return 'ignore' // default
  }

  useEffect(() => {
    if (isOpen) {
      setSelectedAction('ignore')
      setIsResolved(false)
      setUserBanStatus(null)
      setUserDetails(null)
      if (reportId) {
        fetchReportDetails()
      } else if (reportData) {
        setReportDetails(reportData)
        setIsResolved(reportData.status === 'resolved')
        if (reportData.status === 'resolved') {
          setSelectedAction(getActionFromResolution(reportData.resolution))
        }
        // Fetch user details for ban status
        if (reportData.postedBy) {
          fetchUserDetails(reportData.postedBy)
        }
      }
    }
  }, [isOpen, reportId, reportData])

  const fetchReportDetails = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/forum/reports/${reportId}`)
      
      console.log('Fetched report details:', response.data)
      
      // Handle the new backend response structure
      const data = response.data.data?.report || response.data.data || response.data.report || response.data
      
      console.log('Report data:', data)
      
      // Transform API response to match modal format
      const transformedReport = {
        id: data.id,
        reportDate: data.reportDate || 'N/A',
        reportedBy: data.reportedBy || 'Unknown',
        email: data.email || 'N/A',
        reportType: data.reportType || data.reasonFlagged || 'N/A',
        postTitle: data.postTitle || data.title || 'N/A',
        postContent: data.postContent || data.description || 'N/A',
        postedBy: data.postedBy || 'Unknown',
        reasonFlagged: data.reasonFlagged || data.reportType || 'N/A',
        additionalDetails: data.additionalDetails || 'No additional details provided',
        status: data.status || 'pending',
        resolution: data.resolution || null,
        resolvedAt: data.resolvedAt || null,
        resolver: data.resolver || null
      }
      
      console.log('Transformed report:', transformedReport)
      setReportDetails(transformedReport)
      setIsResolved(transformedReport.status === 'resolved')
      if (transformedReport.status === 'resolved') {
        setSelectedAction(getActionFromResolution(transformedReport.resolution))
      }

      // Fetch user details for ban status
      if (transformedReport.postedBy) {
        fetchUserDetails(transformedReport.postedBy)
      }
    } catch (error) {
      console.error('Error fetching report details:', error)
      toast.error('Failed to fetch report details')
      // Set empty report details to prevent modal from closing
      setReportDetails({
        id: reportId,
        reportDate: 'N/A',
        reportedBy: 'Unknown',
        email: 'N/A',
        reportType: 'N/A',
        postTitle: 'N/A',
        postContent: 'Failed to load content',
        postedBy: 'Unknown',
        reasonFlagged: 'N/A',
        additionalDetails: 'Error loading details',
        status: 'pending',
        resolution: null,
        resolvedAt: null,
        resolver: null
      })
      setIsResolved(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    const currentReportId = reportId || reportDetails?.id
    
    if (!currentReportId) {
      toast.error('Report ID not found')
      return
    }

    try {
      const response = await axiosInstance.post(`/forum/reports/${currentReportId}/resolution`, {
        action: selectedAction
      })
      
      if (response.data.success) {
        switch (selectedAction) {
          case 'ignore':
            toast.success('Report dismissed')
            break
          case 'delete':
            toast.success('Post deleted successfully')
            break
          case 'restrict':
            toast.success('User has been restricted from posting')
            break
          default:
            toast.success('Action completed')
        }
        
        if (onSubmit) {
          onSubmit({ reportId: currentReportId, action: selectedAction })
        }
        
        toggle()
      }
    } catch (error) {
      console.error('Error submitting action:', error)
      toast.error(error.response?.data?.message || 'Failed to process action')
    }
  }

  const handleCancel = () => {
    setSelectedAction('ignore')
    setReportDetails(null)
    toggle()
  }

  // Don't return null - let the modal render with loading state or content
  const shouldRender = isOpen && (loading || reportDetails)

  if (!shouldRender) return null

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="view-reported-content-modal" size="lg">
      <ModalBody>
        {loading ? (
          <div className="modal-content-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
            </div>
          </div>
        ) : (
        <div className="modal-content-wrapper">
          <div className="modal-header-section">
            <div style={{width: '36px', height: '36px', display: 'flex', alignItems:'center', justifyContent:'center', backgroundColor: '#E2E6EC', borderRadius: '50%'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M2.5 10.832C5.5 4.16537 14.5 4.16537 17.5 10.832" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 14.168C8.61929 14.168 7.5 13.0487 7.5 11.668C7.5 10.2873 8.61929 9.16797 10 9.16797C11.3807 9.16797 12.5 10.2873 12.5 11.668C12.5 13.0487 11.3807 14.168 10 14.168Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            <h2 className="modal-title">View Reported Content</h2>
          </div>

          <div className="modal-body-section">
            <div className="report-details-section">
                 <div className="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_4017_26016)">
                        <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_4017_26016">
                        <rect width="20" height="20" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                Report Details
            </div>
              
              <div className="details-grid">
                <div className="detail-item">
                  <label className="detail-label">Date Submitted:</label>
                  <p className="detail-value">{reportDetails?.reportDate || 'N/A'}</p>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Submitted By:</label>
                  <p className="detail-value">{reportDetails?.reportedBy || 'N/A'}</p>
                </div>

                <div className="detail-item mb-5">
                  <label className="detail-label">Email:</label>
                  <p className="detail-value">{reportDetails?.email || 'user@example.com'}</p>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Submission Report Details</label>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Category:</label>
                  <p className="detail-value">{reportDetails?.reportType || 'N/A'}</p>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Subject Line:</label>
                  <p className="detail-value">{reportDetails?.postTitle || 'N/A'}</p>
                </div>

                <div className="detail-item full-width">
                  <p className="detail-value content-text">
                    <label className="detail-label">Content:</label>
                    {stripHtmlTags(reportDetails?.postContent) || 'This is the content of the reported post. It may contain text, links, or other information that was flagged by the reporter.'}
                  </p>
                </div>

                <div className="detail-item">
                  <label className="detail-label" style={{width: '110px'}}>Posted By:</label>
                  <div className="d-flex align-items-center gap-2 justify-content-between w-100">
                    <p className="detail-value">{reportDetails?.postedBy || 'Anonymous User'}</p>
                    {banStatusLoading ? (
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                      </div>
                    ) : userBanStatus !== null ? (
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="checkbox"
                          id="user-ban-status"
                          checked={userBanStatus}
                          onChange={toggleUserBanStatus}
                          disabled={banStatusLoading}
                          style={{
                            width: '16px',
                            height: '16px',
                            cursor: banStatusLoading ? 'not-allowed' : 'pointer',
                            opacity: banStatusLoading ? 0.6 : 1
                          }}
                        />
                        <label
                          htmlFor="user-ban-status"
                          style={{
                            fontSize: '12px',
                            color: '#666',
                            cursor: banStatusLoading ? 'not-allowed' : 'pointer',
                            opacity: banStatusLoading ? 0.6 : 1,
                            margin: 0
                          }}
                        >
                          {userBanStatus ? 'Banned from Forum' : 'Not Banned'}
                        </label>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        User status unavailable
                      </span>
                    )}
                  </div>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Reason Flagged:</label>
                  <p className="detail-value">{reportDetails?.reasonFlagged || reportDetails?.reportType || 'N/A'}</p>
                </div>

                <div className="detail-item full-width">
                  <label className="detail-label">Additional Details:</label>
                  <p className="detail-value">
                    {stripHtmlTags(reportDetails?.additionalDetails) || 'No additional details provided by the reporter.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="response-section">
            
            <div className="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_4017_26016)">
                        <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_4017_26016">
                        <rect width="20" height="20" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                Response
            </div>

                <div style={{fontWeight: 500, fontSize: '15px', marginBottom: '9px'}}>
                    Select one or more actions to take in response to this report.
                </div>
              
              <div className="radio-options">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="ignore-report"
                    name="action"
                    value="ignore"
                    checked={selectedAction === 'ignore'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    disabled={isResolved}
                  />
                  <label htmlFor="ignore-report" className="radio-label">
                    <div className="radio-label-content">
                      <span className="radio-title">Ignore Report</span>
                    </div>
                  </label>
                </div>

                <div className="radio-option">
                  <input
                    type="radio"
                    id="delete-post"
                    name="action"
                    value="delete"
                    checked={selectedAction === 'delete'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    disabled={isResolved}
                  />
                  <label htmlFor="delete-post" className="radio-label">
                    <div className="radio-label-content">
                      <span className="radio-title">Delete Post</span>
                    </div>
                  </label>
                </div>

                <div className="radio-option">
                  <input
                    type="radio"
                    id="restrict-user"
                    name="action"
                    value="restrict"
                    checked={selectedAction === 'restrict'}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    disabled={isResolved}
                  />
                  <label htmlFor="restrict-user" className="radio-label">
                    <div className="radio-label-content">
                      <span className="radio-title">Restrict User from Posting</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer-section">
            <button className="cancel-btn"
              style={{
                display: 'flex',
                width: '250px',
                height: '54px',
                padding: '6px 12px',
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                borderRadius: 8,
                background: "#DEE1E6",
                boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.25)",
                color: "#000",
                fontSize: 17,
                fontWeight: 600,
                outline: "none",
                border: "none",
              }}
            onClick={handleCancel}>
              Cancel
            </button>
            <button className="submit-btn"
              style={{
                display: 'flex',
                width: '250px',
                height: '54px',
                padding: '6px 12px',
                justifyContent: "center",
                alignItems: "center",
                gap: "12px",
                borderRadius: 8,
                background: isResolved ? "#ccc" : "#51C7DF",
                boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.25)",
                color: "#FFF",
                fontSize: 17,
                fontWeight: 600,
                outline: "none",
                border: "none",
              }}
              disabled={isResolved}
            onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
        )}
      </ModalBody>
    </Modal>
  )
}

export default ViewReportedContentModal
