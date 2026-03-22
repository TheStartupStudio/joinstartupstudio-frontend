import React, { useState, useEffect } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import { toast } from 'react-toastify'
import AcademyBtn from '../AcademyBtn'
import './ViewReportedContentModal.css'
import axiosInstance from '../../utils/AxiosInstance'

const emptyActions = () => ({
  dismissReport: false,
  deletePost: false,
  restrictUser: false
})

/** Maps saved resolution text (API + legacy labels) to checkbox state */
const getSelectedActionsFromResolution = (resolution) => {
  const r = (resolution || '').toLowerCase()
  const isDismiss =
    r.includes('dismiss') ||
    r.includes('ignore report') ||
    r.includes('reviewed and dismissed') ||
    r.includes('report dismissed')
  const isDelete =
    r.includes('content hidden') ||
    r.includes('delete post') ||
    resolution === 'DELETE POST'
  const isRestrict =
    r.includes('restricted from posting') ||
    r.includes('restrict user') ||
    resolution === 'RESTRICT USER FROM POSTING'
  const isCombined =
    r.includes('delete post and restrict') ||
    resolution === 'DELETE POST AND RESTRICT USER'

  if (isCombined) {
    return { dismissReport: false, deletePost: true, restrictUser: true }
  }
  if (isDismiss && !isDelete && !isRestrict) {
    return { dismissReport: true, deletePost: false, restrictUser: false }
  }
  return {
    dismissReport: false,
    deletePost: isDelete,
    restrictUser: isRestrict
  }
}

const resolutionLabelForActions = ({ dismissReport, deletePost, restrictUser }) => {
  if (dismissReport) return 'IGNORE REPORT'
  if (deletePost && restrictUser) return 'DELETE POST AND RESTRICT USER'
  if (deletePost) return 'DELETE POST'
  if (restrictUser) return 'RESTRICT USER FROM POSTING'
  return ''
}

const ViewReportedContentModal = ({ isOpen, toggle, reportData, reportId, onSubmit, mode = 'view' }) => {
  const [selectedActions, setSelectedActions] = useState(emptyActions)
  const [reportDetails, setReportDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isResolved, setIsResolved] = useState(false)
  const [userBanStatus, setUserBanStatus] = useState(null)
  const [banStatusLoading, setBanStatusLoading] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [allowEditingResolved, setAllowEditingResolved] = useState(false)

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
        setUserBanStatus(user.is_banned_forum || false)
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
          setUserBanStatus(learner.is_banned_forum || false)
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

        // If this is a resolved report with user restriction resolution
        // and we're unbanning the user, update the report resolution
        if (isResolved && allowEditingResolved && !newBanStatus && reportDetails) {
          try {
            const currentReportId = reportId || reportDetails.id
            await axiosInstance.post(`/forum/reports/${currentReportId}/resolution`, {
              action: 'ignore' // Change to "Report reviewed and dismissed"
            })
            // Update the local report details
            setReportDetails(prev => ({
              ...prev,
              resolution: 'Report reviewed and dismissed by administrator'
            }))
            setSelectedActions({ dismissReport: true, deletePost: false, restrictUser: false })
            toast.success('Report resolution updated')
          } catch (resolutionError) {
            console.error('Error updating report resolution:', resolutionError)
            // Don't show error toast for this as the main action succeeded
          }
        }
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

  useEffect(() => {
    if (isOpen) {
      setSelectedActions(emptyActions())
      setIsResolved(false)
      setAllowEditingResolved(false)
      setUserBanStatus(null)
      setUserDetails(null)
      if (reportId) {
        fetchReportDetails()
      } else if (reportData) {
        setReportDetails(reportData)
        setIsResolved(reportData.status === 'resolved')
        // Allow editing resolved reports to change resolution, regardless of view/edit mode
        setAllowEditingResolved(reportData.status === 'resolved')
        if (reportData.status === 'resolved') {
          setSelectedActions(getSelectedActionsFromResolution(reportData.resolution))
        }
        // Fetch user details for ban status
        if (reportData.postedBy) {
          fetchUserDetails(reportData.postedBy)
        }
      }
    }
  }, [isOpen, reportId, reportData])

  const isReportViewMode = mode === 'view'

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
      // Allow editing any resolved report to change the resolution
      setAllowEditingResolved(transformedReport.status === 'resolved')
      if (transformedReport.status === 'resolved') {
        setSelectedActions(getSelectedActionsFromResolution(transformedReport.resolution))
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

  const isValidActionSelection = () => {
    const { dismissReport, deletePost, restrictUser } = selectedActions
    if (dismissReport && (deletePost || restrictUser)) return false
    if (dismissReport) return true
    return deletePost || restrictUser
  }

  const buildResolutionPayload = () => {
    const { dismissReport, deletePost, restrictUser } = selectedActions
    if (dismissReport) return { action: 'ignore' }
    if (deletePost && restrictUser) return { actions: ['delete', 'restrict'] }
    if (deletePost) return { action: 'delete' }
    if (restrictUser) return { action: 'restrict' }
    return null
  }

  const handleSubmit = async () => {
    const currentReportId = reportId || reportDetails?.id

    if (!currentReportId) {
      toast.error('Report ID not found')
      return
    }

    if (!isValidActionSelection()) {
      toast.error('Choose Dismiss report, or one or both of Delete post and Restrict user.')
      return
    }

    const payload = buildResolutionPayload()
    if (!payload) {
      toast.error('Invalid selection')
      return
    }

    try {
      const response = await axiosInstance.post(
        `/forum/reports/${currentReportId}/resolution`,
        payload
      )

      if (response.data.success) {
        const { dismissReport, deletePost, restrictUser } = selectedActions

        if (isResolved) {
          if (dismissReport) {
            toast.success('Report resolution updated to "Dismiss"')
          } else if (deletePost && restrictUser) {
            toast.success('Report resolution updated: post hidden and user restricted')
          } else if (deletePost) {
            toast.success('Report resolution updated to "Delete post"')
          } else {
            toast.success('Report resolution updated to "Restrict user"')
          }
        } else if (dismissReport) {
          toast.success('Report dismissed')
        } else if (deletePost && restrictUser) {
          toast.success('Report resolved: post hidden and user restricted')
        } else if (deletePost) {
          toast.success('Post hidden successfully')
        } else {
          toast.success('User restricted from posting')
        }

        const label = resolutionLabelForActions(selectedActions)

        if (reportId) {
          fetchReportDetails()
        } else {
          setReportDetails((prev) => ({
            ...prev,
            status: 'resolved',
            resolution: label || prev.resolution
          }))
          setIsResolved(true)
          setSelectedActions(getSelectedActionsFromResolution(label))
        }

        if (onSubmit) {
          onSubmit({ reportId: currentReportId, ...payload })
        }

        if (!isResolved) {
          toggle()
        }
      }
    } catch (error) {
      console.error('Error submitting action:', error)
      const errMsg = error.response?.data?.error || error.response?.data?.message
      toast.error(
        errMsg ||
          (selectedActions.deletePost && selectedActions.restrictUser
            ? 'This server may need multi-action support for delete + restrict together (send actions: ["delete","restrict"]).'
            : 'Failed to process action')
      )
    }
  }

  const handleCancel = () => {
    setSelectedActions(emptyActions())
    setReportDetails(null)
    toggle()
  }

  const actionInputDisabled = isResolved && !allowEditingResolved

  const handleDismissChange = (e) => {
    const checked = e.target.checked
    if (checked) {
      setSelectedActions({ dismissReport: true, deletePost: false, restrictUser: false })
    } else {
      setSelectedActions((prev) => ({ ...prev, dismissReport: false }))
    }
  }

  const handleDeletePostChange = (e) => {
    const checked = e.target.checked
    setSelectedActions((prev) => ({
      ...prev,
      deletePost: checked,
      dismissReport: false
    }))
  }

  const handleRestrictUserChange = (e) => {
    const checked = e.target.checked
    setSelectedActions((prev) => ({
      ...prev,
      restrictUser: checked,
      dismissReport: false
    }))
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
            <h2 className="modal-title">
              {isResolved ? 'Edit Report Resolution' : (isReportViewMode ? 'View Reported Content' : 'Edit Report Resolution')}
            </h2>
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
                  <p className="detail-value">{reportDetails?.reportType ? reportDetails.reportType.charAt(0).toUpperCase() + reportDetails.reportType.slice(1).toLowerCase() : 'N/A'}</p>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Subject Line:</label>
                  <p className="detail-value">{reportDetails?.postTitle || 'N/A'}</p>
                </div>

                <div className="detail-item full-width">
                  <p className="detail-value content-text">
                    <label className="detail-label" style={{marginRight: '5px'}}>Content: </label>
                    {stripHtmlTags(reportDetails?.postContent) || 'This is the content of the reported post. It may contain text, links, or other information that was flagged by the reporter.'}
                  </p>
                </div>

                <div className="detail-item">
                  <label className="detail-label" style={{width: '110px'}}>Posted By:</label>
                  <div className="d-flex align-items-center gap-2 justify-content-between w-100">
                    <p className="detail-value">{reportDetails?.postedBy || 'Anonymous User'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <label className="detail-label">Reason Flagged:</label>
                  <p className="detail-value">{reportDetails?.reasonFlagged ? reportDetails.reasonFlagged.charAt(0).toUpperCase() + reportDetails.reasonFlagged.slice(1).toLowerCase() : (reportDetails?.reportType ? reportDetails.reportType.charAt(0).toUpperCase() + reportDetails.reportType.slice(1).toLowerCase() : 'N/A')}</p>
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
                {isResolved ? 'Change Resolution' : 'Response'}
            </div>

                <div style={{fontWeight: 500, fontSize: '15px', marginBottom: '9px'}}>
                    {isResolved
                      ? 'Select a new resolution to update this report:'
                      : 'Select one or more actions to take in response to this report.'
                    }
                </div>
              
              <div className="radio-options">
                <div className="radio-option">
                  <input
                    type="checkbox"
                    id="dismiss-report"
                    checked={selectedActions.dismissReport}
                    onChange={handleDismissChange}
                    disabled={actionInputDisabled}
                  />
                  <label htmlFor="dismiss-report" className="radio-label">
                    <div className="radio-label-content">
                      <span className="radio-title">Dismiss report</span>
                    </div>
                  </label>
                </div>

                <div className="radio-option">
                  <input
                    type="checkbox"
                    id="delete-post"
                    checked={selectedActions.deletePost}
                    onChange={handleDeletePostChange}
                    disabled={actionInputDisabled}
                  />
                  <label htmlFor="delete-post" className="radio-label">
                    <div className="radio-label-content">
                      <span className="radio-title">Delete post</span>
                    </div>
                  </label>
                </div>

                <div className="radio-option">
                  <input
                    type="checkbox"
                    id="restrict-user"
                    checked={selectedActions.restrictUser}
                    onChange={handleRestrictUserChange}
                    disabled={actionInputDisabled}
                  />
                  <label htmlFor="restrict-user" className="radio-label">
                    <div className="radio-label-content">
                      <span className="radio-title">Restrict user from posting</span>
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
                background: "#51C7DF",
                boxShadow: "0 4px 10px 0 rgba(0, 0, 0, 0.25)",
                color: "#FFF",
                fontSize: 17,
                fontWeight: 600,
                outline: "none",
                border: "none",
              }}
              disabled={!isValidActionSelection()}
            onClick={handleSubmit}>
              {isResolved ? 'Resubmit' : 'Submit'}
            </button>
          </div>
        </div>
        )}
      </ModalBody>
    </Modal>
  )
}

export default ViewReportedContentModal
