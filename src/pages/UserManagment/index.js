import './index.css'
import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
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
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import DataTable from '../../components/DataTable'


const UserManagement = () => {
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState('Organizations')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Dummy data for organizations
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
    }
  ]

  // Dummy data for users
  const usersData = [
    {
      id: 1,
      name: 'Learner Name',
      organization_name: 'Organization',
      email: 'name@email.com',
      level: 'L2',
      reflections: 24,
      total_paid: 299
    },
    {
      id: 2,
      name: 'Learner Name',
      organization_name: 'Organization',
      email: 'name@email.com',
      level: 'L1',
      reflections: 18,
      total_paid: 199
    },
    {
      id: 3,
      name: 'Learner Name',
      organization_name: 'Organization',
      email: 'name@email.com',
      level: 'L3',
      reflections: 32,
      total_paid: 399
    }
  ]

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
      case 'view':
        if (activeTab === 'Organizations') {
          console.log('View organization learners:', item.id)
        } else {
          console.log('View learner details:', item.id)
        }
        break
      case 'edit':
        if (activeTab === 'Organizations') {
          console.log('Edit organization:', item.id)
        } else {
          console.log('Edit learner:', item.id)
        }
        break
      case 'more':
        console.log('More actions for:', item.id)
        break
      default:
        break
    }
  }

  const currentData = activeTab === 'Organizations' ? organizationsData : usersData
  const currentColumns = activeTab === 'Organizations' ? organizationsColumns : usersColumns

  return (
    <div>
      <div>
        <div className="col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
          <div className="account-page-padding d-flex justify-content-between flex-col-tab align-start-tab">
            <div>
              <h3 className="page-title bold-page-title text-black mb-0">
                AIE super Admin Dashboard
              </h3>
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
      
      <div className="user-management-container">
        {/* Header Tabs */}
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

        {/* Search and Actions Bar */}
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
              <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="actions-container">
            <AcademyBtn
              title={`Add New ${activeTab === 'Organizations' ? 'Organization' : 'User'}`}
              icon={faPlus}
            />
            <div className="bulk-actions">
              <span>BULK ACTIONS</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Reusable Data Table */}
        <div className="table-container">
          <DataTable 
            columns={currentColumns}
            data={currentData}
            searchQuery={searchQuery}
            onRowAction={handleRowAction}
            showCheckbox={true}
          />
        </div>

        {/* Pagination */}
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
      </div>
    </div>
  )
}

export default UserManagement