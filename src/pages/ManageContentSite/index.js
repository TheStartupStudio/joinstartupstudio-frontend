import './index.css'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import AcademyBtn from '../../components/AcademyBtn'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import btnIcon from '../../assets/images/academy-icons/svg/material-symbols_file-copy-outline-rounded.svg'
import blueManagerBG from '../../assets/images/academy-icons/svg/bg-blue-menager.png'
import AddJournalModal from '../../components/ContentManagement/AddJournalModal'
import AddJournalIntroduction from '../../components/ContentManagement/AddJournalIntroduction'

const ManageContentSite = () => {
  const dispatch = useDispatch()
  const [showAddJournalModal, setShowAddJournalModal] = useState(false)
  const [showAddJournalIntroductionModal, setShowAddJournalIntroductionModal] = useState(false)
  const [journalData, setJournalData] = useState(null)

  const columns = [
    {
    key: 'name',
    title: 'TASK NAME',
    sortable: true,
    filterable: true,
    width: '100%',
    className: 'manage-content-task-name-column',
    render: (value, item) => (
      <div className="task-name-cell">
        <div className={`status-dot ${item.status}`}></div>
        <span>{value}</span>
      </div>
    )
  }
  ]

  const handleSearch = (e) => {
    // Static implementation - no functionality
  }

  const handleOpenAddJournalModal = () => {
    setShowAddJournalModal(true)
  }

  const handleCloseAddJournalModal = () => {
    setShowAddJournalModal(false)
  }

  const handleOpenAddJournalIntroductionModal = (data) => {
    setJournalData(data)
    setShowAddJournalModal(false)
    setShowAddJournalIntroductionModal(true)
  }

  const handleCloseAddJournalIntroductionModal = () => {
    setShowAddJournalIntroductionModal(false)
    setJournalData(null)
  }

  return (
    <div className="manage-content">
      <AddJournalModal
        show={showAddJournalModal}
        onClose={handleCloseAddJournalModal}
        onProceedToIntroduction={handleOpenAddJournalIntroductionModal}
      />
      <AddJournalIntroduction
        show={showAddJournalIntroductionModal}
        onClose={handleCloseAddJournalIntroductionModal}
        journalData={journalData}
      />
      <div>
        <div className="col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
          <div className="d-flex justify-content-between flex-col-tab align-start-tab" style={{padding: '40px 40px 10px 30px'}}>
            <div className="d-flex flex-column gap-2">
              <h3 className="text-black mb-0"
                style={{
                  color: '#231F20',
                  fontFamily: 'Montserrat',
                  fontSize: '23px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: 'normal',
                }}
              >
                MANAGE CONTENT SITE
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
                View and manage content site elements
              </p>
            </div>
          </div>
          <div className="menu-icon-container">
            <img
              src={require('../../assets/images/academy-icons/svg/icons8-menu.svg').default}
              alt='menu'
              className='menu-icon-cie self-start-tab cursor-pointer'
              onClick={() => dispatch(toggleCollapse())}
            />
          </div>
        </div>
      </div>

      <div className="manage-content-container position-relative">
        <img src={blueManagerBG} className='position-absolute'
        style={{
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 0,
          pointerEvents: 'none',
          width: '100dvw',
          height: '100dvh'
        }}
        alt="Decorative background"
        aria-hidden="true"
      />

        <div className='main-search-table-container'>
          <div className="search-actions-bar">
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Search for content"
                  value=""
                  onChange={handleSearch}
                  className="search-input"
                />
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <div className="actions-container">
              <div className="dropdown-wrapper">
                <div onClick={handleOpenAddJournalModal} style={{ cursor: 'pointer' }}>
                  <AcademyBtn
                    title="add new journal"
                    icon={faPlus}
                  />
                </div>
              </div>

              <div>
                <AcademyBtn
                  title="View Archive"
                  icon={btnIcon}
                />
              </div>

              <div className="dropdown-wrapper">
                <div
                  className="bulk-actions"
                >
                  <span>BULK ACTIONS</span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="table-container">
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="checkbox-column">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={false}
                      />
                    </th>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className={column.className || ''}
                        style={{ flex: 1 }}
                      >
                        <div className="header-with-icons">
                          {column.title}
                          {column.sortable && (
                            <div className="header-icons">
                              <img src={require('../../assets/images/academy-icons/svg/Icon_Sort.svg').default} alt="graph" className="header-icon" />
                            </div>
                          )}
                          {column.filterable && (
                            <div className="header-icons">
                              <img
                                src={require('../../assets/images/academy-icons/svg/Dropdown_ Filter by Level.svg').default}
                                alt="filter"
                                className="header-icon"
                              />
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="actions-column">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Sample static data */}
                  <tr>
                    <td className="checkbox-column">
                      <input
                        type="checkbox"
                        className="checkbox"
                      />
                    </td>
                    <td className="manage-content-task-name-column">
                      <div className="task-name-cell">
                        <div className="status-dot published"></div>
                        <span>Introduction to Entrepreneurship</span>
                      </div>
                    </td>
                    <td className="actions-column">
                      <div className="action-buttons">
                        <button className="action-btn view-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2.5 10.8335C5.5 4.16683 14.5 4.16683 17.5 10.8335" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 14.1665C8.61929 14.1665 7.5 13.0472 7.5 11.6665C7.5 10.2858 8.61929 9.1665 10 9.1665C11.3807 9.1665 12.5 10.2858 12.5 11.6665C12.5 13.0472 11.3807 14.1665 10 14.1665Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          View
                        </button>
                        <button className="action-btn edit-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Edit
                        </button>
                        <div className="dropdown-wrapper">
                          <button className="action-btn more-actions-btn">
                            <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                              <circle cx="2" cy="2" r="2" fill="currentColor" />
                              <circle cx="8" cy="2" r="2" fill="currentColor" />
                              <circle cx="14" cy="2" r="2" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="checkbox-column">
                      <input
                        type="checkbox"
                        className="checkbox"
                      />
                    </td>
                    <td className="manage-content-task-name-column">
                      <div className="task-name-cell">
                        <div className="status-dot unpublished"></div>
                        <span>Myths of Entrepreneurship</span>
                      </div>
                    </td>
                    <td className="actions-column">
                      <div className="action-buttons">
                        <button className="action-btn view-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2.5 10.8335C5.5 4.16683 14.5 4.16683 17.5 10.8335" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 14.1665C8.61929 14.1665 7.5 13.0472 7.5 11.6665C7.5 10.2858 8.61929 9.1665 10 9.1665C11.3807 9.1665 12.5 10.2858 12.5 11.6665C12.5 13.0472 11.3807 14.1665 10 14.1665Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          View
                        </button>
                        <button className="action-btn edit-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Edit
                        </button>
                        <div className="dropdown-wrapper">
                          <button className="action-btn more-actions-btn">
                            <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                              <circle cx="2" cy="2" r="2" fill="currentColor" />
                              <circle cx="8" cy="2" r="2" fill="currentColor" />
                              <circle cx="14" cy="2" r="2" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="checkbox-column">
                      <input
                        type="checkbox"
                        className="checkbox"
                      />
                    </td>
                    <td className="manage-content-task-name-column">
                      <div className="task-name-cell">
                        <div className="status-dot published"></div>
                        <span>Definition of Entrepreneurship</span>
                      </div>
                    </td>
                    <td className="actions-column">
                      <div className="action-buttons">
                        <button className="action-btn view-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2.5 10.8335C5.5 4.16683 14.5 4.16683 17.5 10.8335" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 14.1665C8.61929 14.1665 7.5 13.0472 7.5 11.6665C7.5 10.2858 8.61929 9.1665 10 9.1665C11.3807 9.1665 12.5 10.2858 12.5 11.6665C12.5 13.0472 11.3807 14.1665 10 14.1665Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          View
                        </button>
                        <button className="action-btn edit-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Edit
                        </button>
                        <div className="dropdown-wrapper">
                          <button className="action-btn more-actions-btn">
                            <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
                              <circle cx="2" cy="2" r="2" fill="currentColor" />
                              <circle cx="8" cy="2" r="2" fill="currentColor" />
                              <circle cx="14" cy="2" r="2" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageContentSite
