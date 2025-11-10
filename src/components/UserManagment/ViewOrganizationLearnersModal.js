import React, { useState, useMemo, useRef, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import DataTable from '../DataTable'
import AcademyBtn from '../AcademyBtn'
import UserManagementPopup from './AlertPopup'
import AddNewLearner from './AddNewLearner'
import ViewLearnerModal from './ViewLearnerModal'
import BulkAddLearnersModal from './BulkAddLearnersModal'
import groupAdd from '../../assets/images/academy-icons/svg/user-group-add.svg'
import userPlus from '../../assets/images/academy-icons/svg/Icon_User_Add_Alt.svg'
import userDeactivate from '../../assets/images/academy-icons/svg/Icon_User_de.svg'
import warningTriangle from '../../assets/images/academy-icons/svg/warning-triangle.svg'
import userPassword from '../../assets/images/academy-icons/svg/Icon_User_Pass.svg'
import download from '../../assets/images/academy-icons/svg/download.svg'
import newCity from '../../assets/images/academy-icons/svg/city.svg'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import axiosInstance from '../../utils/AxiosInstance'
import './ViewOrganizationLearnersModal.css'

const ViewOrganizationLearnersModal = ({ show, onHide, organizationName, organizationId }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [showBulkDropdown, setShowBulkDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Popup states
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showResetPasswordPopup, setShowResetPasswordPopup] = useState(false)
  const [showDeactivateUserPopup, setShowDeactivateUserPopup] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isBulkAction, setIsBulkAction] = useState(false)

  // Modal states for add/edit/view learners
  const [showAddLearnerModal, setShowAddLearnerModal] = useState(false)
  const [showViewLearnerModal, setShowViewLearnerModal] = useState(false)
  const [showBulkAddLearnersModal, setShowBulkAddLearnersModal] = useState(false)
  const [selectedLearner, setSelectedLearner] = useState(null)
  const [learnerModalMode, setLearnerModalMode] = useState('add')

  // Data and pagination
  const [learnersData, setLearnersData] = useState([])
  const [learnersLoading, setLearnersLoading] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })

  // Refs for dropdowns
  const addDropdownRef = useRef(null)
  const bulkDropdownRef = useRef(null)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch learners data
  const fetchLearners = async (page = 1, search = '') => {
    if (!organizationId) return

    setLearnersLoading(true)
    try {
      const response = await axiosInstance.get(`/super-admin/universities/${organizationId}/learners`, {
        params: {
          page,
          limit: 10,
          search: search || undefined
        }
      })

      if (response.data.success) {
        const mappedData = response.data.data.map(learner => ({
          id: learner.id,
          name: learner.name,
          organization_name: learner.organization_name,
          email: learner.email,
          level: learner.level,
          reflections: learner.reflections,
          total_paid: Math.round(learner.total_paid),
          last_active: learner.last_active,
          trial_start: learner.trial_start,
          activation_date: learner.member_since,
          activeStatus: learner.activeStatus
        }))

        setLearnersData(mappedData)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching learners:', error)
      toast.error('Failed to load learners data')
    } finally {
      setLearnersLoading(false)
    }
  }

  // Fetch data when modal opens or when search/page changes
  useEffect(() => {
    if (show && organizationId) {
      fetchLearners(currentPage, debouncedSearchQuery)
    }
  }, [show, organizationId, currentPage, debouncedSearchQuery])

  // Reset state when modal closes
  useEffect(() => {
    if (!show) {
      setSearchQuery('')
      setCurrentPage(1)
      setSelectedUsers([])
      setLearnersData([])
    }
  }, [show])

// ...existing code...

  const learnersColumns = useMemo(() => [
    {
      key: 'name',
      title: 'LEARNER NAME',
      sortable: true,
      filterable: true,
      render: (value, item) => (
        <div className="learner-info">
          <div className={`status-indicator ${item.activeStatus ? 'active' : 'inactive'}`}></div>
          <div className="learner-details">
            <div className="learner-name">{item.name}</div>
            <div className="learner-organization">{item.organization_name}</div>
            <div className="learner-email">{item.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'level',
      title: 'LEVEL',
      sortable: true,
      filterable: true,
      render: (value) => {
        const displayLevel = value || 'L1'
        return (
          <span className={`level-badge level-${displayLevel?.toLowerCase()}`}>
            {displayLevel}
          </span>
        )
      }
    },
    {
      key: 'last_active',
      title: 'LAST ACTIVE',
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
    },
    {
      key: 'trial_start',
      title: 'TRIAL START',
      sortable: true,
      render: (value) => (
        <span className="trial-start">
          {value ? new Date(value).toLocaleDateString('en-US', {
            month: '2-digit',
            day: 'numeric',
            year: 'numeric'
          }) : 'N/A'}
        </span>
      )
    },
    {
      key: 'activation_date',
      title: 'ACTIVATION DATE',
      sortable: true,
      render: (value) => (
        <span className="activation-date">
          {value ? new Date(value).toLocaleDateString('en-US', {
            month: '2-digit',
            day: 'numeric',
            year: 'numeric'
          }) : 'N/A'}
        </span>
      )
    }
  ], [])

// ...existing code...
  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target)) {
        setShowAddDropdown(false)
      }
      
      if (bulkDropdownRef.current && !bulkDropdownRef.current.contains(event.target)) {
        setShowBulkDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRowAction = (actionType, item) => {
    console.log(`${actionType} action for learner:`, item)
    setSelectedUser(item)
    setIsBulkAction(false)

    switch (actionType) {
      case 'view':
        handleViewLearner(item)
        break
      case 'edit':
        handleEditLearner(item)
        break
      case 'deactivate-learner':
        setShowDeactivateUserPopup(true)
        break
      case 'delete-learner':
        setShowDeletePopup(true)
        break
      default:
        break
    }
  }

  const handleSelectionChange = (selectedItems) => {
    setSelectedUsers(selectedItems)
  }

  // Learner modal handlers
  const handleViewLearner = (learner) => {
    setSelectedLearner(learner)
    setShowViewLearnerModal(true)
  }

  const handleEditLearner = (learner) => {
    setSelectedLearner(learner)
    setLearnerModalMode('edit')
    setShowViewLearnerModal(false)
    setShowAddLearnerModal(true)
  }

  const handleAddSingleUser = () => {
    setLearnerModalMode('add')
    setSelectedLearner(null)
    setShowAddLearnerModal(true)
    setShowAddDropdown(false)
  }

  const handleBulkAddUsers = () => {
    setShowBulkAddLearnersModal(true)
    setShowAddDropdown(false)
  }

  const handleLearnerModalSuccess = () => {
    toast.success('Learner saved successfully!')
    setShowAddLearnerModal(false)
    fetchLearners(currentPage, debouncedSearchQuery)
  }

  // Cancel handlers
  const handleDeleteCancel = () => {
    setShowDeletePopup(false)
    setSelectedUser(null)
    setSelectedUsers([])
    setIsBulkAction(false)
  }

  const handleResetPasswordCancel = () => {
    setShowResetPasswordPopup(false)
    setSelectedUser(null)
    setSelectedUsers([])
    setIsBulkAction(false)
  }

  const handleDeactivateUserCancel = () => {
    setShowDeactivateUserPopup(false)
    setSelectedUser(null)
    setSelectedUsers([])
    setIsBulkAction(false)
  }

  // Confirm handlers
  const handleConfirmDelete = async () => {
    setLoading(true)
    try {
      if (isBulkAction) {
        const userIds = selectedUsers.map(user => user.id)
        await axiosInstance.delete('/super-admin/users/bulk-delete', {
          data: { userIds }
        })
        toast.success(`${userIds.length} user(s) deleted successfully!`)
      } else {
        await axiosInstance.delete(`/super-admin/users/${selectedUser.id}`)
        toast.success('User deleted successfully!')
      }
      
      setShowDeletePopup(false)
      setSelectedUser(null)
      setSelectedUsers([])
      setIsBulkAction(false)
      fetchLearners(currentPage, debouncedSearchQuery)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete user(s)')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmResetPassword = async () => {
    setLoading(true)
    try {
      if (isBulkAction) {
        const userIds = selectedUsers.map(user => user.id)
        await axiosInstance.post('/super-admin/users/bulk-reset-passwords', { userIds })
        toast.success(`${userIds.length} password(s) reset successfully!`)
      } else {
        await axiosInstance.patch(`/auth/setDefaultUserPassword/${selectedUser.id}`)
        toast.success('Password reset successfully!')
      }
      
      setShowResetPasswordPopup(false)
      setSelectedUser(null)
      setSelectedUsers([])
      setIsBulkAction(false)
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error(error.response?.data?.message || 'Failed to reset password(s)')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDeactivateUser = async () => {
    setLoading(true)
    try {
      if (isBulkAction) {
        const userIds = selectedUsers.map(user => user.id)
        await axiosInstance.post('/super-admin/users/bulk-deactivate', { userIds })
        toast.success(`${userIds.length} user(s) deactivated successfully!`)
      } else {
        const userIds = [selectedUser.id]
        await axiosInstance.post('/super-admin/users/bulk-deactivate', { userIds })
        toast.success('User deactivated successfully!')
      }
      
      setShowDeactivateUserPopup(false)
      setSelectedUser(null)
      setSelectedUsers([])
      setIsBulkAction(false)
      fetchLearners(currentPage, debouncedSearchQuery)
    } catch (error) {
      console.error('Deactivate error:', error)
      toast.error(error.response?.data?.message || 'Failed to deactivate user(s)')
    } finally {
      setLoading(false)
    }
  }

  // Bulk action handlers
  const handleBulkResetPasswords = () => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select at least one user')
      return
    }
    setIsBulkAction(true)
    setShowResetPasswordPopup(true)
    setShowBulkDropdown(false)
  }

  const handleBulkDeactivateUsers = () => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select at least one user')
      return
    }
    setIsBulkAction(true)
    setShowDeactivateUserPopup(true)
    setShowBulkDropdown(false)
  }

  const handleBulkDeleteUsers = () => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select at least one user')
      return
    }
    setIsBulkAction(true)
    setShowDeletePopup(true)
    setShowBulkDropdown(false)
  }

  const handleBulkExportUsers = async () => {
    try {
      const userIds = selectedUsers.length > 0 
        ? selectedUsers.map(user => user.id).join(',')
        : undefined

      const response = await axiosInstance.get('/super-admin/users/export', {
        params: userIds ? { userIds } : {},
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${organizationName}_users_export_${new Date().toISOString()}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success(
        selectedUsers.length > 0
          ? `${selectedUsers.length} user(s) exported successfully!`
          : 'All users exported successfully!'
      )
    } catch (error) {
      console.error('Error exporting users:', error)
      toast.error('Failed to export users')
    }
    setShowBulkDropdown(false)
  }

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  const addOptions = [
    {
      name: 'Add Single User',
      action: handleAddSingleUser,
      icon: <img src={userPlus} alt="user add" className="admin-icons-dropdown" />
    },
    {
      name: 'Bulk Add Users',
      action: handleBulkAddUsers,
      icon: <img src={groupAdd} alt="group add" className="admin-icons-dropdown" />
    }
  ]

  const bulkOptions = [
    {
      name: 'Reset Passwords',
      action: handleBulkResetPasswords,
      icons: <img src={userPassword} alt="user password" className="admin-icons-dropdown" />
    },
    {
      name: 'Deactivate Users',
      action: handleBulkDeactivateUsers,
      icons: <img src={userDeactivate} alt="user deactivate" className="admin-icons-dropdown" />
    },
    {
      name: 'Delete Users',
      action: handleBulkDeleteUsers,
      icons: <img src={warningTriangle} alt="warning" className="admin-icons-dropdown" />
    },
    {
      name: 'Export Users',
      action: handleBulkExportUsers,
      icons: <img src={download} alt="download" className="admin-icons-dropdown" />
    }
  ]

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        backdrop={true}
        keyboard={true}
        className="view-organization-learners-modal"
        centered
        size="xl"
      >
        <div className="modal-content-wrapper">
          {/* Header */}
          <div className="modal-header-learners position-relative">
            <div className="d-flex flex-column gap-3">
              <img src={newCity} style={{padding: '8px', borderRadius:"50%", backgroundColor: "#E2E6EC", width: 'fit-content'}} />
              <p
                style={{
                  color: '#231F20',
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >View Organization Users</p>
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

            <div className="header-content">
              <h2 className="organization-name">{organizationName || 'ORGANIZATION NAME'}</h2>
            </div>

            {/* Search and Actions Bar */}
            <div className="search-actions-bar">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search for Learner"
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
                <div className="dropdown-wrapper" style={{ position: 'relative' }} ref={addDropdownRef}>
                  <div>
                    <AcademyBtn
                      title="Add New User"
                      icon={faPlus}
                      onClick={() => {
                        setShowAddDropdown(!showAddDropdown)
                        setShowBulkDropdown(false)
                      }}
                    />
                  </div>

                  {showAddDropdown && (
                    <div 
                      className="dropdown-menu"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 9999,
                        marginTop: '4px',
                        display: 'block'
                      }}
                    >
                      {addOptions.map((option, index) => (
                        <div 
                          key={index}
                          className="dropdown-item"
                          style={{
                            padding: '14px 12px',
                            color: 'black',
                            fontFamily: 'Montserrat',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease',
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                          onClick={() => {
                            option.action()
                            setShowAddDropdown(false)
                          }}
                        >
                          {option.icon}
                          {option.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="dropdown-wrapper" style={{ position: 'relative' }} ref={bulkDropdownRef}>
                  <div 
                    className="bulk-actions"
                    onClick={() => {
                      setShowBulkDropdown(!showBulkDropdown)
                      setShowAddDropdown(false)
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
                        left: 0,
                        right: 0,
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        zIndex: 9999,
                        marginTop: '4px',
                        display: 'block'
                      }}
                    >
                      {bulkOptions.map((option, index) => (
                        <div 
                          key={index}
                          className="dropdown-item"
                          style={{
                            padding: '14px 12px',
                            color: 'black',
                            fontFamily: 'Montserrat',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                          onClick={() => {
                            option.action()
                          }}
                        >
                          {option.icons}
                          {option.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="table-container">
              <DataTable 
                columns={learnersColumns}
                data={learnersData}
                searchQuery={searchQuery}
                onRowAction={handleRowAction}
                showCheckbox={true}
                activeTab="Users"
                loading={learnersLoading}
                onSelectionChange={handleSelectionChange}
                selectedItems={selectedUsers}
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

      {/* Add New Learner Modal */}
      <AddNewLearner
        show={showAddLearnerModal}
        onHide={() => {
          setShowAddLearnerModal(false)
          setLearnerModalMode('add')
          setSelectedLearner(null)
        }}
        onSuccess={handleLearnerModalSuccess}
        mode={learnerModalMode}
        learnerData={selectedLearner}
      />

      {/* View Learner Modal */}
      <ViewLearnerModal
        show={showViewLearnerModal}
        onHide={() => setShowViewLearnerModal(false)}
        learner={selectedLearner}
        onEdit={handleEditLearner}
      />

      {/* Bulk Add Learners Modal */}
      <BulkAddLearnersModal
        show={showBulkAddLearnersModal}
        onHide={() => setShowBulkAddLearnersModal(false)}
        onSuccess={() => {
          setShowBulkAddLearnersModal(false)
          toast.success('Learners added successfully!')
          fetchLearners(currentPage, debouncedSearchQuery)
        }}
        mode="learners"
      />

      {/* Delete User Popup */}
      <UserManagementPopup
        show={showDeletePopup}
        onHide={handleDeleteCancel}
        onConfirm={handleConfirmDelete}
        title={isBulkAction ? "Delete User(s)?" : "Delete User?"}
        message={
          isBulkAction
            ? "Are you sure you want to delete the user(s)? User and all work will be removed from the system. This action cannot be undone."
            : `Are you sure you want to delete ${selectedUser?.name}? User and all work will be removed from the system. This action cannot be undone.`
        }
        cancelText="NO, TAKE ME BACK"
        confirmText={isBulkAction ? "YES, DELETE USER(S)" : "YES, DELETE USER"}
        loading={loading}
      />

      {/* Reset Password Popup */}
      <UserManagementPopup
        show={showResetPasswordPopup}
        onHide={handleResetPasswordCancel}
        onConfirm={handleConfirmResetPassword}
        title={isBulkAction ? "Reset Password(s)?" : "Reset Password?"}
        message={
          isBulkAction
            ? "Are you sure you want to reset passwords for the selected user(s) to the default (Learntostart1!)? The users will need to use this password on their next login."
            : `Are you sure you want to reset ${selectedUser?.name}'s password to the default (Learntostart1!)? The user will need to use this password on their next login.`
        }
        cancelText="NO, TAKE ME BACK"
        confirmText={isBulkAction ? "YES, RESET PASSWORD(S)" : "YES, RESET PASSWORD"}
        loading={loading}
      />

      {/* Deactivate/Activate User Popup */}
      <UserManagementPopup
        show={showDeactivateUserPopup}
        onHide={handleDeactivateUserCancel}
        onConfirm={handleConfirmDeactivateUser}
        title={
          isBulkAction
            ? "Deactivate User(s)?"
            : selectedUser?.activeStatus
            ? "Deactivate User?"
            : "Activate User?"
        }
        message={
          isBulkAction
            ? "Are you sure you want to deactivate the user(s)? Work and settings will be preserved, but user(s) will no longer have access to the platform."
            : selectedUser?.activeStatus
            ? `Are you sure you want to deactivate ${selectedUser?.name}? Work and settings will be preserved, but the user will no longer have access to the platform.`
            : `Are you sure you want to activate ${selectedUser?.name}? The user will regain access to the platform.`
        }
        cancelText="NO, TAKE ME BACK"
        confirmText={
          isBulkAction
            ? "YES, DEACTIVATE USER(S)"
            : selectedUser?.activeStatus
            ? "YES, DEACTIVATE USER"
            : "YES, ACTIVATE USER"
        }
        loading={loading}
      />
    </>
  )
}

export default ViewOrganizationLearnersModal