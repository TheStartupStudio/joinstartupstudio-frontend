import React, { useState, useMemo } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons'
import DataTable from '../DataTable'
import AcademyBtn from '../AcademyBtn'
import groupAdd from '../../assets/images/academy-icons/svg/user-group-add.svg'
import userPlus from '../../assets/images/academy-icons/svg/Icon_User_Add_Alt.svg'
import userDeactivate from '../../assets/images/academy-icons/svg/Icon_User_de.svg'
import warningTriangle from '../../assets/images/academy-icons/svg/warning-triangle.svg'
import userPassword from '../../assets/images/academy-icons/svg/Icon_User_Pass.svg'
import download from '../../assets/images/academy-icons/svg/download.svg'
import newCity from '../../assets/images/academy-icons/svg/city.svg'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import './ViewOrganizationLearnersModal.css'

const ViewOrganizationLearnersModal = ({ show, onHide, organizationName }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDropdown, setShowAddDropdown] = useState(false)
  const [showBulkDropdown, setShowBulkDropdown] = useState(false)

  // Dummy learners data
  const learnersData = [
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
    },
    {
      id: 4,
      name: 'Learner Name',
      organization_name: 'Organization',
      email: 'name@email.com',
      level: 'L2',
      reflections: 24,
      total_paid: 299
    },
    {
      id: 5,
      name: 'Learner Name',
      organization_name: 'Organization',
      email: 'name@email.com',
      level: 'L1',
      reflections: 18,
      total_paid: 199
    },
    {
      id: 6,
      name: 'Learner Name',
      organization_name: 'Organization',
      email: 'name@email.com',
      level: 'L3',
      reflections: 32,
      total_paid: 399
    },
    {
      id: 7,
      name: 'Learner Name',
      organization_name: 'Organization',
      email: 'name@email.com',
      level: 'L2',
      reflections: 24,
      total_paid: 299
    },
    {
      id: 8,
      name: 'Learner Name',
      organization_name: 'Organization',
      email: 'name@email.com',
      level: 'L1',
      reflections: 18,
      total_paid: 199
    }
  ]

  const learnersColumns = useMemo(() => [
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
    console.log(`${actionType} action for learner:`, item)
  }

  const addOptions = [
    {
      name: 'Add Single User',
      action: () => console.log('Add Single User'),
      icon: <img src={userPlus} alt="user add" className="admin-icons-dropdown" />
    },
    {
      name: 'Bulk Add Users',
      action: () => console.log('Bulk Add Users'),
      icon: <img src={groupAdd} alt="group add" className="admin-icons-dropdown" />
    }
  ]

  const bulkOptions = [
    {
      name: 'Reset Passwords',
      action: () => console.log('Reset Passwords'),
      icons: <img src={userPassword} alt="user password" className="admin-icons-dropdown" />
    },
    {
      name: 'Deactivate Users',
      action: () => console.log('Deactivate Users'),
      icons: <img src={userDeactivate} alt="user deactivate" className="admin-icons-dropdown" />
    },
    {
      name: 'Delete Users',
      action: () => console.log('Delete Users'),
      icons: <img src={warningTriangle} alt="warning" className="admin-icons-dropdown" />
    },
    {
      name: 'Export Users',
      action: () => console.log('Export Users'),
      icons: <img src={download} alt="download" className="admin-icons-dropdown" />
    }
  ]

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop={true}  // Changed from "static"
      keyboard={true}   // Changed from false
      className="view-organization-learners-modal"
      centered
      size="xl"
    >
      <div className="modal-content-wrapper">
        {/* Header */}
        <div className="modal-header-learners position-relative">
            <div className="d-flex flex-column gap-3">
                <img src={newCity} style={{padding: '8px', borderRadius:"50%", backgroundColor: "#E2E6EC", width: 'fit-content'}}  />
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
              <img src={leftArrow} />
            </div>
        </div>


        <div style={{borderRadius: 24,
                    background: 'var(--Glassy-White, rgba(255, 255, 255, 0.10))',

                    /* Drop+Blur Boxes */
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
            <div className="dropdown-wrapper" style={{ position: 'relative' }}>
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

            <div className="dropdown-wrapper" style={{ position: 'relative' }}>
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
                        setShowBulkDropdown(false)
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
    </Modal>
  )
}

export default ViewOrganizationLearnersModal