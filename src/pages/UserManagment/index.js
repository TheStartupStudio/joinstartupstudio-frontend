import './index.css'
import React, { useEffect, useState } from 'react'
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
    },
    {
      id: 7,
      name: 'Organization Name',
      domain: 'organization.aie.com',
      totalUsers: 24,
      monthlyFee: '$15 / user / mo'
    },
    {
      id: 8,
      name: 'Organization Name',
      domain: 'organization.aie.com',
      totalUsers: 24,
      monthlyFee: '$15 / user / mo'
    },
    {
      id: 9,
      name: 'Organization Name',
      domain: 'organization.aie.com',
      totalUsers: 24,
      monthlyFee: '$15 / user / mo'
    },
    {
      id: 10,
      name: 'Organization Name',
      domain: 'organization.aie.com',
      totalUsers: 24,
      monthlyFee: '$15 / user / mo'
    }
  ]

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }
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
        <div className="user-management-container">
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
            <AcademyBtn
              title="Add New Organization"
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

        {/* Table */}
        {/* <div className="table-container">
          <table className="organizations-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input type="checkbox" className="checkbox" />
                </th>
                <th className="organization-name-column">
                  <div className="header-with-icons">
                    ORGANIZATION NAME
                    <div className="header-icons">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1L6 11M6 1L2 5M6 1L10 5" stroke="#666" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 6H9M3 3H9M3 9H7" stroke="#666" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="total-users-column">
                  <div className="header-with-icons">
                    TOTAL USERS
                    <div className="header-icons">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1L6 11M6 1L2 5M6 1L10 5" stroke="#666" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 6H9M3 3H9M3 9H7" stroke="#666" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="monthly-fee-column">
                  <div className="header-with-icons">
                    MONTHLY FEE
                    <div className="header-icons">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1L6 11M6 1L2 5M6 1L10 5" stroke="#666" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 6H9M3 3H9M3 9H7" stroke="#666" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </th>
                <th className="actions-column">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {organizationsData.map((org) => (
                <tr key={org.id}>
                  <td className="checkbox-column">
                    <input type="checkbox" className="checkbox" />
                  </td>
                  <td className="organization-name-column">
                    <div className="organization-info">
                      <div className="status-indicator"></div>
                      <div className="organization-details">
                        <div className="organization-name">{org.name}</div>
                        <div className="organization-domain">{org.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="total-users-column">
                    <span className="users-count">{org.totalUsers}</span>
                  </td>
                  <td className="monthly-fee-column">
                    <span className="fee-amount">{org.monthlyFee}</span>
                  </td>
                  <td className="actions-column">
                    <div className="action-buttons">
                      <button
                        className="action-btn view-learners-btn"
                        onClick={() => handleViewLearners(org.id)}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        View Learners
                      </button>
                      <button
                        className="action-btn add-learners-btn"
                        onClick={() => handleAddLearners(org.id)}
                      >
                        <span className="plus-icon">+</span>
                        Add Learners
                      </button>
                      <button
                        className="action-btn more-actions-btn"
                        onClick={() => handleMoreActions(org.id)}
                      >
                        <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                          <circle cx="2" cy="2" r="2" fill="currentColor" />
                          <circle cx="8" cy="2" r="2" fill="currentColor" />
                          <circle cx="14" cy="2" r="2" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        {/* Pagination */}
        <div className="pagination-container">
          <button className="pagination-btn">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M9 10L5 6L9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M9 10L5 6L9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="pagination-btn">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M9 10L5 6L9 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="pagination-info">1 / 2</span>
          <button className="pagination-btn">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 2L7 6L3 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="pagination-btn">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 2L7 6L3 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 2L7 6L3 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserManagement