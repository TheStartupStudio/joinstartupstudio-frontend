import './index.css'
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
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
import ViewOrganizationInvoicesModal from '../../components/UserManagment/ViewOrganizationInvoicesModal'
import NotificationBell from '../../components/NotificationBell'



const UserManagement = () => {
  const history = useHistory()
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
  const [showInvoicesModal, setShowInvoicesModal] = useState(false)
  const [selectedOrgForInvoices, setSelectedOrgForInvoices] = useState(null)

  const [usersData, setUsersData] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersPagination, setUsersPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })

  const [organizationsData, setOrganizationsData] = useState([])
  const [organizationsLoading, setOrganizationsLoading] = useState(false)
  const [organizationsPagination, setOrganizationsPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  })

  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedOrganizations, setSelectedOrganizations] = useState([])
  const [searchFilter, setSearchFilter] = useState('all')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1) 
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchOrganizations = async (page = 1, search = '') => {
    setOrganizationsLoading(true)
    try {
      const response = await axiosInstance.get('/super-admin/organizations', {
        params: {
          page,
          limit: 10,
          search: search || undefined
        }
      })

      if (response.data.success) {
        const mappedData = response.data.data.map(org => ({
          id: org.id,
          name: org.name,
          domain: org.domainUrl || org.domain,
          totalUsers: org.totalUsers || 0,
          monthlyFee: org.organizationPricing && org.organizationPricing.length > 0
            ? `$${org.organizationPricing[0].amount} / ${org.organizationPricing[0].frequency}`
            : 'N/A',
          address: org.address,
          city: org.city,
          state: org.state,
          zipCode: org.zipCode,
          administratorName: org.administratorName,
          administratorEmail: org.administratorEmail,
          features: org.features,
          organizationPricing: org.organizationPricing,
          learnerPricing: org.learnerPricing,
                    isActive: org.isActive !== undefined ? org.isActive : true

        }))

        setOrganizationsData(mappedData)
        setOrganizationsPagination(response.data.pagination)
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      toast.error('Failed to load organizations data')
    } finally {
      setOrganizationsLoading(false)
    }
  }

  const fetchUsers = async (page = 1, search = '', role = 'all') => {
    setUsersLoading(true)
    try {
      const response = await axiosInstance.get('/super-admin/users', {
        params: {
          page,
          limit: 10,
          search: search || undefined,
          role: role !== 'all' ? role : undefined
        }
      })

      if (response.data.success) {
        const mappedData = response.data.data.map(user => ({
          id: user.id,
          name: user.name,
          organization_name: user.organization_name,
          email: user.email,
          level: user.level,
          reflections: user.reflections,
          total_paid: Math.round(user.total_paid),
          last_active: user.last_active,
          trial_start: user.trial_start,
          activation_date: user.member_since,
          activeStatus: user.activeStatus
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

  useEffect(() => {
    if (activeTab === 'Users') {
      fetchUsers(currentPage, debouncedSearchQuery, searchFilter)
    } else if (activeTab === 'Organizations') {
      fetchOrganizations(currentPage, debouncedSearchQuery)
    }
  }, [activeTab, currentPage, debouncedSearchQuery, searchFilter])

  const organizationsColumns = useMemo(() => [
    {
      key: 'name',
      title: 'ORGANIZATION NAME',
      sortable: true,
      filterable: true,
      render: (value, item) => (
        <div className="organization-info">
          <div className={`status-indicator ${item.isActive ? 'active' : 'inactive'}`}></div>
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
      render: (value) => (
        <span className={`level-badge level-${value.toLowerCase()}`}>
          {value}
        </span>
      )
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleRowAction = (actionType, item) => {
    console.log(`${actionType} action for:`, item)
    
    switch (actionType) {
      case 'view-learners':
        handleViewLearners(item)
        break
      case 'view-invoices':
        handleViewInvoices(item)
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
        exportOrganization(item) 
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

  const handleViewInvoices = (organization) => {
    setSelectedOrgForInvoices(organization)
    setShowInvoicesModal(true)
  }

  const handleViewOrganization = async (organization) => {
    try {
      const response = await axiosInstance.get(`/super-admin/organizations/${organization.id}`)
      if (response.data.success) {
        setSelectedOrganization(response.data.data)
        setModalMode('view')
        setShowAddOrganizationModal(true)
      }
    } catch (error) {
      console.error('Error fetching organization details:', error)
      toast.error('Failed to load organization details')
    }
  }

  const handleBulkAddOrganizationsSuccess = async () => {
    try {
      await axiosInstance.post('/super-admin/organizations/sync-all-stripe-prices')
      console.log('✅ Stripe prices synced successfully')
    } catch (syncError) {
      console.error('⚠️ Failed to sync Stripe prices:', syncError)
      toast.warning('Organizations created, but failed to sync some Stripe prices')
    }

    setShowBulkAddOrganizationsModal(false)
    toast.success('Organizations added successfully!')
    fetchOrganizations(currentPage, debouncedSearchQuery)
  }

  const exportOrganizations = async () => {
    try {
      const organizationIds = selectedOrganizations.length > 0 
        ? selectedOrganizations.map(org => org.id).join(',')
        : undefined

      const response = await axiosInstance.get('/super-admin/organizations-csv/export', {
        params: organizationIds ? { organizationIds } : {},
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `organizations_export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success(
        selectedOrganizations.length > 0
          ? `${selectedOrganizations.length} organization(s) exported successfully!`
          : 'All organizations exported successfully!'
      )
    } catch (error) {
      console.error('Error exporting organizations:', error)
      toast.error('Failed to export organizations')
    }
    setShowBulkDropdown(false)
  }

  const handleEditOrganization = async (organization) => {
    try {
      const response = await axiosInstance.get(`/super-admin/organizations/${organization.id}`)
      if (response.data.success) {
        setSelectedOrganization(response.data.data)
        setModalMode('edit')
        setShowAddOrganizationModal(true)
      }
    } catch (error) {
      console.error('Error fetching organization details:', error)
      toast.error('Failed to load organization details')
    }
  }

  const handleAddOrganization = () => {
    setSelectedOrganization(null)
    setModalMode('add')
    setShowAddOrganizationModal(true)
  }

  const handleModalSuccess = () => {
    toast.success('Organization saved successfully!')
    setShowAddOrganizationModal(false)
    if (activeTab === 'Organizations') {
      fetchOrganizations(currentPage, debouncedSearchQuery)
    }
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
    if (activeTab === 'Users') {
      fetchUsers(currentPage, debouncedSearchQuery)
    }
  }

  const handleExportOrganization = async (organization) => {
    try {
      const response = await axiosInstance.get(`/super-admin/organizations/${organization.id}/export`)
      if (response.data.success) {
        const dataStr = JSON.stringify(response.data.data, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
        
        const exportFileDefaultName = `organization_${organization.name}_${new Date().toISOString()}.json`
        
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
        
        toast.success(`Exported ${organization.name} data successfully!`)
      }
    } catch (error) {
      console.error('Error exporting organization:', error)
      toast.error('Failed to export organization data')
    }
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

  // const deactivateOrganizations = () => {
  //   setActionContext('organizations')
  //   setIsSingleAction(false)
  //   setShowDeactivatePopup(true)
  //   setShowBulkDropdown(false)
  // }

  // const deleteOrganizations = () => {
  //   setActionContext('organizations')
  //   setIsSingleAction(false)
  //   setShowDeletePopup(true)
  //   setShowBulkDropdown(false)
  // }

  // const exportOrganizations = async () => {
  //   try {
  //     const response = await axiosInstance.get('/super-admin/organizations/export')
  //     if (response.data.success) {
  //       const dataStr = JSON.stringify(response.data.data, null, 2)
  //       const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
        
  //       const exportFileDefaultName = `all_organizations_${new Date().toISOString()}.json`
        
  //       const linkElement = document.createElement('a')
  //       linkElement.setAttribute('href', dataUri)
  //       linkElement.setAttribute('download', exportFileDefaultName)
  //       linkElement.click()
        
  //       toast.success('Organizations exported successfully!')
  //     }
  //   } catch (error) {
  //     console.error('Error exporting organizations:', error)
  //     toast.error('Failed to export organizations')
  //   }
  //   setShowBulkDropdown(false)
  // }

  const resetPasswords = () => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select at least one user')
      return
    }
    setActionContext('users')
    setSelectedItems(selectedUsers)
    setIsSingleAction(false)
    setShowResetPasswordPopup(true)
    setShowBulkDropdown(false)
  }

  const deactivateUsers = () => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select at least one user')
      return
    }
    setActionContext('users')
    setSelectedItems(selectedUsers)
    setIsSingleAction(false)
    setShowDeactivatePopup(true)
    setShowBulkDropdown(false)
  }

  const deleteUsers = () => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select at least one user')
      return
    }
    setActionContext('users')
    setSelectedItems(selectedUsers)
    setIsSingleAction(false)
    setShowDeletePopup(true)
    setShowBulkDropdown(false)
  }

  const exportUsers = async () => {
    try {
      const userIds = selectedUsers.length > 0 
        ? selectedUsers.map(user => user.id).join(',')
        : undefined

      const response = await axiosInstance.get('/super-admin/users-csv/export', {
        params: userIds ? { userIds } : {},
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `users_export_${new Date().toISOString()}.csv`)
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

  const deactivateOrganizations = () => {
    if (selectedOrganizations.length === 0) {
      toast.warning('Please select at least one organization')
      return
    }
    setActionContext('organizations')
    setSelectedItems(selectedOrganizations)
    setIsSingleAction(false)
    setShowDeactivatePopup(true)
    setShowBulkDropdown(false)
  }

  const deleteOrganizations = () => {
    if (selectedOrganizations.length === 0) {
      toast.warning('Please select at least one organization')
      return
    }
    setActionContext('organizations')
    setSelectedItems(selectedOrganizations)
    setIsSingleAction(false)
    setShowDeletePopup(true)
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
      name: 'Activate Organizations',
      action: () => activateOrganizations(),
      icons: <img src={userPlus} alt="activate" className="admin-icons-dropdown" />
    },
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
      action: () => exportOrganizations(), // Updated to use new function
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
      if (actionContext === 'organizations') {
        if (isSingleAction) {
          await axiosInstance.delete(`/super-admin/organizations/${selectedItems[0].id}`)
          toast.success('Organization deleted successfully!')
        } else {
          const organizationIds = selectedItems.map(item => item.id)
          await axiosInstance.post('/super-admin/organizations/bulk-delete', { organizationIds })
          toast.success(`${organizationIds.length} organization(s) deleted successfully!`)
        }
        setSelectedOrganizations([])
        fetchOrganizations(currentPage, debouncedSearchQuery)
      } else {
        if (isSingleAction) {
          await axiosInstance.delete(`/super-admin/users/${selectedItems[0].id}`)
          toast.success('User deleted successfully!')
        } else {
          const userIds = selectedItems.map(item => item.id)
          await axiosInstance.post('/super-admin/users/bulk-delete', {
            data: { userIds }
          })
          toast.success(`${userIds.length} user(s) deleted successfully!`)
        }
        setSelectedUsers([])
        fetchUsers(currentPage, debouncedSearchQuery)
      }
      
      setShowDeletePopup(false)
      setSelectedItems([])
      setIsSingleAction(false)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmResetPassword = async () => {
    setLoading(true)
    try {
      if (isSingleAction) {
        await axiosInstance.patch(`/auth/setDefaultUserPassword/${selectedItems[0].id}`)
        toast.success('Password reset successfully!')
      } else {
        const userIds = selectedItems.map(item => item.id)
        await axiosInstance.post('/super-admin/users/bulk-reset-passwords', { userIds })
        toast.success(`${userIds.length} password(s) reset successfully!`)
      }
      
      setShowResetPasswordPopup(false)
      setSelectedItems([])
      setSelectedUsers([])
      setIsSingleAction(false)
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error(error.response?.data?.message || 'Failed to reset password(s)')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmDeactivate = async () => {
    setLoading(true)
    try {
      if (actionContext === 'organizations') {
        if (isSingleAction) {
          await axiosInstance.post(`/super-admin/organizations/${selectedItems[0].id}/deactivate`)
          toast.success('Organization deactivated successfully!')
        } else {
          const organizationIds = selectedItems.map(item => item.id)
          await axiosInstance.post('/super-admin/organizations/bulk-deactivate', { organizationIds })
          toast.success(`${organizationIds.length} organization(s) deactivated successfully!`)
        }
        setSelectedOrganizations([])
        fetchOrganizations(currentPage, debouncedSearchQuery)
      } else {
        if (isSingleAction) {
          const userIds = [selectedItems[0].id]
          await axiosInstance.post('/super-admin/users/bulk-deactivate', { userIds })
          toast.success('User deactivated successfully!')
        } else {
          const userIds = selectedItems.map(item => item.id)
          await axiosInstance.post('/super-admin/users/bulk-deactivate', { userIds })
          toast.success(`${userIds.length} user(s) deactivated successfully!`)
        }
        setSelectedUsers([])
        fetchUsers(currentPage, debouncedSearchQuery)
      }
      
      setShowDeactivatePopup(false)
      setSelectedItems([])
      setIsSingleAction(false)
    } catch (error) {
      console.error('Deactivate error:', error)
      toast.error(error.response?.data?.message || 'Failed to deactivate')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setSelectedUsers([])
    setSelectedOrganizations([])
  }, [activeTab])

  const addDropdownRef = useRef(null)
  const bulkDropdownRef = useRef(null)
  const filterRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target)) {
        setShowAddDropdown(false)
      }
      
      if (bulkDropdownRef.current && !bulkDropdownRef.current.contains(event.target)) {
        setShowBulkDropdown(false)
      }

      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handlePageChange = (newPage) => {
    const pagination = activeTab === 'Users' ? usersPagination : organizationsPagination
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage)
    }
  }

  const currentData = activeTab === 'Organizations' ? organizationsData : usersData
  const currentColumns = activeTab === 'Organizations' ? organizationsColumns : usersColumns
  const currentOptions = activeTab === 'Organizations' ? optionsOrganizations : optionsUsers
  const currentBulkOptions = activeTab === 'Organizations' ? bulkOptionsOrganizations : bulkOptionsUsers
  const isLoading = activeTab === 'Users' ? usersLoading : organizationsLoading
  const currentPagination = activeTab === 'Users' ? usersPagination : organizationsPagination

  const handleSelectionChange = (selectedItems) => {
    if (activeTab === 'Users') {
      setSelectedUsers(selectedItems)
    } else {
      setSelectedOrganizations(selectedItems)
    }
  }


  const activateOrganizations = async () => {
    if (selectedOrganizations.length === 0) {
      toast.warning('Please select at least one organization')
      return
    }

    try {
      setLoading(true)
      const organizationIds = selectedOrganizations.map(org => org.id)
      
      const response = await axiosInstance.post('/super-admin/organizations/bulk-activate', {
        organizationIds
      })

      if (response.data.success) {
        toast.success(`${response.data.affectedOrganizations} organization(s) and their users activated successfully!`)
        setSelectedOrganizations([])
        fetchOrganizations(currentPage, debouncedSearchQuery)
      }
    } catch (error) {
      console.error('Error activating organizations:', error)
      toast.error(error.response?.data?.error || 'Failed to activate organizations')
    } finally {
      setLoading(false)
      setShowBulkDropdown(false)
    }
  }

  return (
    <div>
      <div>
        <div className="col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
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
          
          <div className="d-flex align-items-center justify-content-center">
            {isInstructor ? (<NotificationBell />) : null}
            <img
              src={MenuIcon}
              alt='menu'
              className='menu-icon-cie self-start-tab cursor-pointer'
              onClick={() => dispatch(toggleCollapse())}
            />
          </div>
        </div>
      </div>
      
      <div className="user-management-container position-relative">
        <img src={blueManagerBG} alt="blue-manager-bg" className='position-absolute user-select-none' style={{right: '50%', translate: '50% 0'}} />
        
        {!isInstructor && (
          <div className="header-tabs">
            <button
              className={`tab-button ${activeTab === 'Organizations' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('Organizations')
                setCurrentPage(1)
                setSearchQuery('')
                setSearchFilter('all')
              }}
            >
              Organizations
            </button>
            <button
              className={`tab-button ${activeTab === 'Users' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('Users')
                setCurrentPage(1)
                setSearchQuery('')
                setSearchFilter('all')
              }}
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
                style={{
                  padding: activeTab === 'Organizations' ? "12px 40px 12px 18px" : "12px 40px 12px 120px",
                }}
              />
              {activeTab === 'Users' && (
                <div className="search-filter-container" ref={filterRef}>
                  <div
                    className="search-filter"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  >
                    {searchFilter === 'all' ? 'All' : searchFilter.charAt(0).toUpperCase() + searchFilter.slice(1)}
                    <svg className="filter-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {showFilterDropdown && (
                    <div className="filter-dropdown">
                      <div className="filter-option" onClick={() => { setSearchFilter('all'); setShowFilterDropdown(false); }}>All</div>
                      <div className="filter-option" onClick={() => { setSearchFilter('admin'); setShowFilterDropdown(false); }}>Admin</div>
                      <div className="filter-option" onClick={() => { setSearchFilter('client'); setShowFilterDropdown(false); }}>Client</div>
                      <div className="filter-option" onClick={() => { setSearchFilter('learner'); setShowFilterDropdown(false); }}>Learner</div>
                    </div>
                  )}
                </div>
              )}
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 17L21 21" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="actions-container">
            <div className="dropdown-wrapper" style={{ position: 'relative' }} ref={addDropdownRef}>
              <div className="add-button-wrapper">
                <AcademyBtn
                  title={`Add New ${activeTab === 'Organizations' ? 'Organization' : 'Learner'}`}
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

            <div className="add-button-wrapper" style={{position: 'relative'}}>
              <AcademyBtn
                    title={`View Invoices`}
                    icon={plusIcon}
                    onClick={() => history.push('/view-invoices')}
                  />
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
            onSelectionChange={handleSelectionChange}
            selectedItems={activeTab === 'Users' ? selectedUsers : selectedOrganizations}
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
          <span className="pagination-info">{currentPage} / {currentPagination.totalPages}</span>
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === currentPagination.totalPages}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
              <path d="M9.25 6L15.25 12L9.25 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPagination.totalPages)}
            disabled={currentPage === currentPagination.totalPages}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 6L19 12L13 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 6L11 12L5 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
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
          organizationId={selectedOrgForLearners?.id}
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
          fetchUsers(currentPage, debouncedSearchQuery)
        }}
        mode="learners"
      />

      {!isInstructor && (
        <BulkAddLearnersModal
          show={showBulkAddOrganizationsModal}
          onHide={() => setShowBulkAddOrganizationsModal(false)}
          onSuccess={handleBulkAddOrganizationsSuccess}
          mode="organizations"
        />
      )}

      {!isInstructor && (
        <ViewOrganizationInvoicesModal
          show={showInvoicesModal}
          onHide={() => setShowInvoicesModal(false)}
          organizationName={selectedOrgForInvoices?.name || ''}
          organizationId={selectedOrgForInvoices?.id}
        />
      )}
    </div>
  )
}

export default UserManagement