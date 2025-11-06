import './index.css'
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'react-chartjs-2'
import { Bar } from 'react-chartjs-2'
import LtsContainerWrapper from '../../ui/LtsContainerWrapper'
import IntMessages from '../../utils/IntlMessages';
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import graphIcon from '../../assets/images/graph-up.png'
import dollarIcon from '../../assets/images/dollar.png'
import creaditCardIcon from '../../assets/images/credit-cards.png'
import groupIcon from '../../assets/images/group.png'
import totalEntrolledIcon from '../../assets/images/Total Enrolled Learners Icon.png'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import AcademyBtn from '../../components/AcademyBtn'
import { faPlus, faEye, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import DataTable from '../../components/DataTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import groupAdd from '../../assets/images/academy-icons/svg/user-group-add.svg'
import userPlus from '../../assets/images/academy-icons/svg/Icon_User_Add_Alt.svg'
import userDeactivate from '../../assets/images/academy-icons/svg/Icon_User_de.svg'
import warningTriangle from '../../assets/images/academy-icons/svg/warning-triangle.svg'
import userPassword from '../../assets/images/academy-icons/svg/Icon_User_Pass.svg'
import download from '../../assets/images/academy-icons/svg/download.svg'
import AddNewOrganization from '../../components/UserManagment/AddNewOrganization'
import ViewOrganizationLearnersModal from '../../components/UserManagment/ViewOrganizationLearnersModal'
import AddNewLearner from '../../components/UserManagment/AddNewLearner'
import ViewLearnerModal from '../../components/UserManagment/ViewLearnerModal'
import blueManagerBG from '../../assets/images/academy-icons/svg/bg-blue-menager.png'
import UserManagementPopup from '../../components/UserManagment/AlertPopup'
import BulkAddLearnersModal from '../../components/UserManagment/BulkAddLearnersModal/index'
import plusIcon from '../../assets/images/academy-icons/svg/plus.svg'
import axiosInstance from '../../utils/AxiosInstance'


const UserManagement = () => {
  const dispatch = useDispatch()
  
  const { user } = useSelector((state) => state.user.user)
  const userRole = user?.role_id || localStorage.getItem('role')

  const isInstructor = userRole === 2 || userRole === 'instructor' || userRole === 'trial'
  
  const [activeTab, setActiveTab] = useState(isInstructor ? 'Users' : 'Organizations')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAddDropdown, setShowAddDropdown] = useState(false) 
  const [showBulkDropdown, setShowBulkDropdown] = useState(false)
  
  const [showAddOrganizationModal, setShowAddOrganizationModal] = useState(false)
  const [selectedOrganization, setSelectedOrganization] = useState(null)
  const [modalMode, setModalMode] = useState('add')
  
  const [showLearnersModal, setShowLearnersModal] = useState(false)
  const [selectedOrgForLearners, setSelectedOrgForLearners] = useState(null)
  const [showAddLearnerModal, setShowAddLearnerModal] = useState(false)
  const [showViewLearnerModal, setShowViewLearnerModal] = useState(false)
  const [selectedLearner, setSelectedLearner] = useState(null)
  const [learnerModalMode, setLearnerModalMode] = useState('add')

  const [loading, setLoading] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showResetPasswordPopup, setShowResetPasswordPopup] = useState(false)
  const [showDeactivatePopup, setShowDeactivatePopup] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [actionContext, setActionContext] = useState('') 
  const [isSingleAction, setIsSingleAction] = useState(false) 
  const [showBulkAddLearnersModal, setShowBulkAddLearnersModal] = useState(false)
  const [showBulkAddOrganizationsModal, setShowBulkAddOrganizationsModal] = useState(false) 


    // New state for users data and pagination
  const [usersData, setUsersData] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersPagination, setUsersPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })

  const organizationsData = [
    {
      id: 1,
      name: 'Organization Name',
      domain: 'organization.aie.com',
      totalUsers: 24,
      monthlyFee: '$15 / user / mo'
    },
    {
      id: 2,
      name: 'Organization Name',
      domain: 'organization.aie.com',
      totalUsers: 24,
      monthlyFee: '$15 / user / mo'
    },
    {
      id: 3,
      name: 'Organization Name',
      domain: 'organization.aie.com',
      totalUsers: 24,
      monthlyFee: '$15 / user / mo'
    },
    {
      id: 4,
      name: 'Organization Name',
      domain: 'organization.aie.com',
      totalUsers: 24,
      monthlyFee: '$15 / user / mo'
    },
    {
      id: 5,
      name: 'Organization Name',
      domain: 'organization.aie.com',
      totalUsers: 24,
      monthlyFee: '$15 / user / mo'
    },
    {
      id: 6,
      name: 'Organization Name',
      domain: 'organization.aie.com',
      totalUsers: 24,
      monthlyFee: '$15 / user / mo'
    }
  ]

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1) // Reset to first page when search changes
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Function to fetch users data
  const fetchUsers = async (page = 1, search = '') => {
    setUsersLoading(true)
    try {
      const response = await axiosInstance.get('/super-admin/users', {
        params: {
          page,
          limit: 10,
          search: search || undefined
        }
      })

      if (response.data.success) {
        // Map API data to expected format
        const mappedData = response.data.data.map(user => ({
          id: user.id,
          name: user.name,
          organization_name: user.organization_name,
          email: user.email,
          level: user.level,
          reflections: user.reflections,
          total_paid: Math.round(user.total_paid) // Round to integer as expected
        }))

        setUsersData(mappedData)
        setUsersPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users data')
    } finally {
      setUsersLoading(false)
    }
  }

  // Fetch users when component mounts or when debounced search/page changes
  useEffect(() => {
    if (activeTab === 'Users') {
      fetchUsers(currentPage, debouncedSearchQuery)
    }
  }, [activeTab, currentPage, debouncedSearchQuery])

  const organizationsColumns = useMemo(() => [
    {
      key: 'name',
      title: 'ORGANIZATION NAME',
      sortable: true,
      filterable: true,
      render: (value, item) => (
        <div className="organization-info">
          <div className="status-indicator"></div>
          <div className="organization-details">
            <div className="organization-name">{item.name}</div>
            <div className="organization-domain">{item.domain}</div>
          </div>
        </div>
      )
    },
    {
      key: 'totalUsers',
      title: 'TOTAL USERS',
      sortable: true,
      className: 'total-users-column',
      render: (value) => <span className="users-count">{value}</span>
    },
    {
      key: 'monthlyFee',
      title: 'MONTHLY FEE',
      sortable: true,
      className: 'monthly-fee-column',
      render: (value) => <span className="fee-amount">{value}</span>
    }
  ], [])

  const usersColumns = useMemo(() => [
    {
      key: 'name',
      title: 'LEARNER NAME',
      sortable: true,
      filterable: true,
      render: (value, item) => (
        <div className="learner-info">
          <div className="status-indicator"></div>
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
      render: (value) => (
        <span className={`level-badge level-${value.toLowerCase()}`}>
          {value}
        </span>
      )
    },
    {
      key: 'reflections',
      title: 'REFLECTIONS',
      sortable: true,
      render: (value) => <span className="reflections-count">{value}</span>
    },
    {
      key: 'total_paid',
      title: 'TOTAL PAID',
      sortable: true,
      render: (value) => <span className="total-paid">${value}</span>
    }
  ], [])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRowAction = (actionType, item) => {
    console.log(`${actionType} action for:`, item)
    
    switch (actionType) {
      case 'view-learners':
        handleViewLearners(item)
        break
      case 'add-learners':
        setSelectedOrgForLearners(item)
        setShowBulkAddLearnersModal(true)
        break
      case 'view':
        handleViewLearner(item)
        break
      case 'edit':
        handleEditLearner(item)
        break
      case 'view-organization':
        handleViewOrganization(item)
        break
      case 'edit-organization':
        handleEditOrganization(item)
        break
      case 'deactivate-organization':
        setActionContext('organizations')
        setSelectedItems([item])
        setIsSingleAction(true)
        setShowDeactivatePopup(true)
        break
      case 'delete-organization':
        setActionContext('organizations')
        setSelectedItems([item])
        setIsSingleAction(true)
        setShowDeletePopup(true)
        break
      case 'export-organization':
        handleExportOrganization(item)
        break
      case 'deactivate-learner':
        setActionContext('users')
        setSelectedItems([item])
        setIsSingleAction(true)
        setShowDeactivatePopup(true)
        break
      case 'delete-learner':
        setActionContext('users')
        setSelectedItems([item])
        setIsSingleAction(true)
        setShowDeletePopup(true)
        break
      default:
        break
    }
  }

  const handleViewLearners = (organization) => {
    setSelectedOrgForLearners(organization)
    setShowLearnersModal(true)
  }

  const handleViewOrganization = (organization) => {
    setSelectedOrganization(organization)
    setModalMode('view')
    setShowAddOrganizationModal(true)
  }

  const handleEditOrganization = (organization) => {
    setSelectedOrganization(organization)
    setModalMode('edit')
    setShowAddOrganizationModal(true)
  }

  const handleAddOrganization = () => {
    setSelectedOrganization(null)
    setModalMode('add')
    setShowAddOrganizationModal(true)
  }

  const handleModalSuccess = () => {
    toast.success('Organization saved successfully!')
    setShowAddOrganizationModal(false)
  }

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

  const handleLearnerModalSuccess = () => {
    toast.success('Learner saved successfully!')
    setShowAddLearnerModal(false)
  }

  const handleExportOrganization = (organization) => {
    console.log('Exporting organization:', organization)
    toast.success(`Exported ${organization.name} data successfully!`)
  }

  const addSingleOrganization = () => {
    handleAddOrganization()
    setShowAddDropdown(false)
  }

  const bulkAddOrganizations = () => {
    setShowBulkAddOrganizationsModal(true)
    setShowAddDropdown(false)
  }

  const bulkAddUsers = () => {
    setShowBulkAddLearnersModal(true)
    setShowAddDropdown(false)
  }

  const deactivateOrganizations = () => {
    setActionContext('organizations')
    setIsSingleAction(false)
    setShowDeactivatePopup(true)
    setShowBulkDropdown(false)
  }

  const deleteOrganizations = () => {
    setActionContext('organizations')
    setIsSingleAction(false)
    setShowDeletePopup(true)
    setShowBulkDropdown(false)
  }

  const exportOrganizations = () => {
    toast.success('Organizations exported successfully!')
    setShowBulkDropdown(false)
  }

  const resetPasswords = () => {
    setActionContext('users')
    setIsSingleAction(false)
    setShowResetPasswordPopup(true)
    setShowBulkDropdown(false)
  }

  const deactivateUsers = () => {
    setActionContext('users')
    setIsSingleAction(false)
    setShowDeactivatePopup(true)
    setShowBulkDropdown(false)
  }

  const deleteUsers = () => {
    setActionContext('users')
    setIsSingleAction(false)
    setShowDeletePopup(true)
    setShowBulkDropdown(false)
  }

  const exportUsers = () => {
    toast.success('Users exported successfully!')
    setShowBulkDropdown(false)
  }

  const optionsOrganizations = [
    {
      name: 'Add Single Organization',
      action: () => addSingleOrganization(),
      icon: <img src={userPlus} alt="user add" className="admin-icons-dropdown" />
    },
    {
      name: 'Bulk Add Organizations',
      action: () => bulkAddOrganizations(),
      icon: <img src={groupAdd} alt="group add" className="admin-icons-dropdown" />
    }
  ]

  const optionsUsers = [
    {
      name: 'Add Single User',
      action: () => handleAddSingleUser(),
      icon: <img src={userPlus} alt="user add" className="admin-icons-dropdown" />
    },
    {
      name: 'Bulk Add Users',
      action: () => bulkAddUsers(),
      icon: <img src={groupAdd} alt="group add" className="admin-icons-dropdown" />
    }
  ]

  const bulkOptionsOrganizations = [
    {
      name: 'Deactivate Organizations',
      action: () => deactivateOrganizations(),
      icons: <img src={userDeactivate} alt="deactivate" className="admin-icons-dropdown" />
    },
    {
      name: 'Delete Organizations',
      action: () => deleteOrganizations(),
      icons: <img src={warningTriangle} alt="warning" className="admin-icons-dropdown" />
    },
    {
      name: 'Export Organizations',
      action: () => exportOrganizations(),
      icons: <img src={download} alt="download" className="admin-icons-dropdown" />
    }
  ]

  const bulkOptionsUsers = [
    {
      name: 'Reset Passwords',
      action: () => resetPasswords(),
      icons: <img src={userPassword} alt="password" className="admin-icons-dropdown" />
    },
    {
      name: 'Deactivate Users',
      action: () => deactivateUsers(),
      icons: <img src={userDeactivate} alt="deactivate" className="admin-icons-dropdown" />
    },
    {
      name: 'Delete Users',
      action: () => deleteUsers(),
      icons: <img src={warningTriangle} alt="warning" className="admin-icons-dropdown" />
    },
    {
      name: 'Export Users',
      action: () => exportUsers(),
      icons: <img src={download} alt="download" className="admin-icons-dropdown" />
    }
  ]

  const handleDeleteCancel = () => {
    setShowDeletePopup(false)
    setSelectedItems([])
    setIsSingleAction(false)
  }

  const handleResetPasswordCancel = () => {
    setShowResetPasswordPopup(false)
    setSelectedItems([])
    setIsSingleAction(false)
  }

  const handleDeactivateCancel = () => {
    setShowDeactivatePopup(false)
    setSelectedItems([])
    setIsSingleAction(false)
  }

  const handleConfirmDelete = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (actionContext === 'organizations') {
        console.log('Deleting organizations:', selectedItems)
        toast.success(
          isSingleAction 
            ? 'Organization deleted successfully!' 
            : 'Organizations deleted successfully!'
        )
      } else {
        console.log('Deleting users:', selectedItems)
        toast.success(
          isSingleAction 
            ? 'User deleted successfully!' 
            : 'Users deleted successfully!'
        )
      }
      
      setShowDeletePopup(false)
      setSelectedItems([])
      setIsSingleAction(false)
    } catch (error) {
      toast.error('Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmResetPassword = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Resetting passwords for users:', selectedItems)
      toast.success(
        isSingleAction 
          ? 'Password reset successfully!' 
          : 'Passwords reset successfully!'
      )
      setShowResetPasswordPopup(false)
      setSelectedItems([])
      setIsSingleAction(false)
    } catch (error) {
      toast.error('Failed to reset passwords')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDeactivate = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (actionContext === 'organizations') {
        console.log('Deactivating organizations:', selectedItems)
        toast.success(
          isSingleAction 
            ? 'Organization deactivated successfully!' 
            : 'Organizations deactivated successfully!'
        )
      } else {
        console.log('Deactivating users:', selectedItems)
        toast.success(
          isSingleAction 
            ? 'User deactivated successfully!' 
            : 'Users deactivated successfully!'
        )
      }
      
      setShowDeactivatePopup(false)
      setSelectedItems([])
      setIsSingleAction(false)
    } catch (error) {
      toast.error('Failed to deactivate')
    } finally {
      setLoading(false)
    }
  }

  const addDropdownRef = useRef(null)
  const bulkDropdownRef = useRef(null)

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

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= usersPagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  const currentData = activeTab === 'Organizations' ? organizationsData : usersData
  const currentColumns = activeTab === 'Organizations' ? organizationsColumns : usersColumns
  const currentOptions = activeTab === 'Organizations' ? optionsOrganizations : optionsUsers
  const currentBulkOptions = activeTab === 'Organizations' ? bulkOptionsOrganizations : bulkOptionsUsers
  const isLoading = activeTab === 'Users' ? usersLoading : false

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
                USER MANAGEMENT
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
                {isInstructor ? 'View your learners' : 'View user details'}
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
      
      <div className="user-management-container position-relative">
        <img src={blueManagerBG} alt="blue-manager-bg" className='position-absolute user-select-none' style={{right: '50%', translate: '50% 0'}} />
        
        {!isInstructor && (
          <div className="header-tabs">
            <button
              className={`tab-button ${activeTab === 'Organizations' ? 'active' : ''}`}
              onClick={() => setActiveTab('Organizations')}
            >
              Organizations
            </button>
            <button
              className={`tab-button ${activeTab === 'Users' ? 'active' : ''}`}
              onClick={() => setActiveTab('Users')}
            >
              Users
            </button>
          </div>
        )}

        <div className="search-actions-bar">
          <div className="search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder={`Search for ${activeTab === 'Organizations' ? 'Organization' : 'Learner'}`}
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 17L21 21" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="actions-container">
            <div className="dropdown-wrapper" style={{ position: 'relative' }} ref={addDropdownRef}>
              <div className="add-button-wrapper">
                <AcademyBtn
                  title={`Add New ${activeTab === 'Organizations' ? 'Organization' : 'User'}`}
                  icon={plusIcon}
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
                  {currentOptions.map((option, index) => (
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
                  {currentBulkOptions.map((option, index) => (
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

        <div className="table-container">
          <DataTable 
            columns={currentColumns}
            data={currentData}
            searchQuery={searchQuery}
            onRowAction={handleRowAction}
            showCheckbox={true}
            activeTab={activeTab}
            loading={isLoading}
          />
        </div>

        {activeTab === 'Users' && (
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
            <span className="pagination-info">{currentPage} / {usersPagination.totalPages}</span>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === usersPagination.totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M9.25 6L15.25 12L9.25 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(usersPagination.totalPages)}
              disabled={currentPage === usersPagination.totalPages}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 6L19 12L13 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 6L11 12L5 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}

        {!activeTab === 'Users' && (
          <div className="pagination-container">
            <button className="pagination-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 6L5 12L11 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 6L13 12L19 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="pagination-btn">
             <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
              <path d="M15.75 6L9.75 12L15.75 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            </button>
            <span className="pagination-info">1 / 2</span>
            <button className="pagination-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M9.25 6L15.25 12L9.25 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="pagination-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M13 6L19 12L13 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 6L11 12L5 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {!isInstructor && (
        <AddNewOrganization
          show={showAddOrganizationModal}
          onHide={() => setShowAddOrganizationModal(false)}
          onSuccess={handleModalSuccess}
          mode={modalMode}
          organizationData={selectedOrganization}
        />
      )}

      {!isInstructor && (
        <ViewOrganizationLearnersModal
          show={showLearnersModal}
          onHide={() => setShowLearnersModal(false)}
          organizationName={selectedOrgForLearners?.name || ''}
        />
      )}

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

      <ViewLearnerModal
        show={showViewLearnerModal}
        onHide={() => setShowViewLearnerModal(false)}
        learner={selectedLearner}
        onEdit={handleEditLearner}
      />

      <UserManagementPopup
        show={showDeletePopup}
        onHide={handleDeleteCancel}
        onConfirm={handleConfirmDelete}
        title={
          isSingleAction
            ? `Delete ${actionContext === 'organizations' ? 'Organization' : 'User'}?`
            : `Delete ${actionContext === 'organizations' ? 'Organization(s)' : 'User(s)'}?`
        }
        message={
          isSingleAction
            ? `Are you sure you want to delete this ${actionContext === 'organizations' ? 'organization' : 'user'}? ${
                actionContext === 'users' ? 'User and all work' : 'All data'
              } will be removed from the system. This action cannot be undone.`
            : `Are you sure you want to delete the selected ${actionContext === 'organizations' ? 'organization(s)' : 'user(s)'}? All data will be removed from the system. This action cannot be undone.`
        }
        cancelText="NO, TAKE ME BACK"
        confirmText={
          isSingleAction
            ? `YES, DELETE ${actionContext === 'organizations' ? 'ORGANIZATION' : 'USER'}`
            : `YES, DELETE ${actionContext === 'organizations' ? 'ORGANIZATION(S)' : 'USER(S)'}` 
        }
        loading={loading}
      />

      <UserManagementPopup
        show={showResetPasswordPopup}
        onHide={handleResetPasswordCancel}
        onConfirm={handleConfirmResetPassword}
        title={isSingleAction ? "Reset Password?" : "Reset Password(s)?"}
        message={
          isSingleAction
            ? `Are you sure you want to reset ${selectedItems[0]?.name}'s password to the default (Learntostart1!)? The user will need to use this password on their next login.`
            : "Are you sure you want to reset passwords for the selected user(s) to the default (Learntostart1!)? The users will need to use this password on their next login."
        }
        cancelText="NO, TAKE ME BACK"
        confirmText={isSingleAction ? "YES, RESET PASSWORD" : "YES, RESET PASSWORD(S)"}
        loading={loading}
      />

      <UserManagementPopup
        show={showDeactivatePopup}
        onHide={handleDeactivateCancel}
        onConfirm={handleConfirmDeactivate}
        title={
          isSingleAction
            ? `Deactivate ${actionContext === 'organizations' ? 'Organization' : 'User'}?`
            : `Deactivate ${actionContext === 'organizations' ? 'Organization(s)' : 'User(s)'}?`
        }
        message={
          isSingleAction
            ? `Are you sure you want to deactivate this ${actionContext === 'organizations' ? 'organization' : 'user'}? Work and settings will be preserved, but they will no longer have access to the platform.`
            : `Are you sure you want to deactivate the selected ${actionContext === 'organizations' ? 'organization(s)' : 'user(s)'}? Work and settings will be preserved, but they will no longer have access to the platform.`
        }
        cancelText="NO, TAKE ME BACK"
        confirmText={
          isSingleAction
            ? `YES, DEACTIVATE ${actionContext === 'organizations' ? 'ORGANIZATION' : 'USER'}`
            : `YES, DEACTIVATE ${actionContext === 'organizations' ? 'ORGANIZATION(S)' : 'USER(S)'}` 
        }
        loading={loading}
      />

      <BulkAddLearnersModal
        show={showBulkAddLearnersModal}
        onHide={() => setShowBulkAddLearnersModal(false)}
        onSuccess={() => {
          setShowBulkAddLearnersModal(false)
          toast.success('Learners added successfully!')
        }}
        mode="learners"
      />

      {!isInstructor && (
        <BulkAddLearnersModal
          show={showBulkAddOrganizationsModal}
          onHide={() => setShowBulkAddOrganizationsModal(false)}
          onSuccess={() => {
            setShowBulkAddOrganizationsModal(false)
            toast.success('Organizations added successfully!')
          }}
          mode="organizations"
        />
      )}
    </div>
  )
}

export default UserManagement