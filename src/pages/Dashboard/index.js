import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IntlMessages from '../../utils/IntlMessages'
import Profile from '../../components/Profile'
import { changeSidebarState } from '../../redux'
import {
  closeTaskModal,
  getEventsStart,
  getPeriodsStart,
  openTaskModal
} from '../../redux/dashboard/Actions'
import FullCalendarComponent from '../../components/Calendar/FullCalendar'
import TaskEventModal from '../../components/Modals/TaskEventModal'
import NotificationSection from '../NotificationSection-dashboard/NotificationSection'
import useImpersonation from '../../hooks/useImpersonation'
import RecentAchievements from './RecentAchievement'
import Select from 'react-select'

function Dashboard() {
  const originalToken = localStorage.getItem('original_access_token')
  const userRole = localStorage.getItem('role')
  const dispatch = useDispatch()
  const periods = useSelector((state) => state.dashboard.periods)
  const events = useSelector((state) => state.dashboard.events)
  const [chatId, setChatId] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  useImpersonation(originalToken)

  useEffect(() => {
    dispatch(changeSidebarState(false))
  }, [dispatch])

  useEffect(() => {
    dispatch(getPeriodsStart())
    dispatch(getEventsStart())
  }, [dispatch])

  function getFormattedDate() {
    const today = new Date()
    const year = today.getFullYear().toString()
    let month = (today.getMonth() + 1).toString().padStart(2, '0')
    let day = today.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const taskEventModal = useSelector(
    (state) => state.dashboard.addTaskEventModal
  )
  const openTaskEventModal = () => {
    dispatch(openTaskModal('create'))
  }

  const closeTaskEventModal = () => {
    dispatch(closeTaskModal('create'))
  }

  const options = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' }
  ]

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption)
    console.log('Selected Language:', selectedOption.value)
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 pe-0 me-0'>
          <div className='account-page-padding d-flex justify-content-between align-items-center'>
            <h3 className='page-title bold-page-title'>
              <IntlMessages id='navigation.dashboard' />
            </h3>

            <div
              style={{
                display: 'inline-block',
                borderRadius: '8px',
                background:
                  'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                padding: '1px', // Adjust this value to control border thickness
                height: '58px',
                boxShadow: '0px 4px 10px 0px #00000040'
              }}
            >
              <Select
                options={options}
                value={selectedLanguage}
                onChange={handleChange}
                placeholder='Select Language'
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    width: '250px', // Fixed width
                    minHeight: '40px', // Fixed height
                    overflow: 'hidden',
                    border: 'none', // Remove the default border
                    borderRadius: '6px' // Slightly smaller than the outer container radius
                  }),
                  singleValue: (base) => ({
                    ...base,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  })
                }}
                components={{
                  IndicatorSeparator: () => null // Remove separator
                }}
              />
            </div>
          </div>
        </div>
        {/* <div className='col-12 col-xl-3 px-0'>
          <div className='account-page-padding' style={{ paddingLeft: '20px' }}>
            <FullCalendarComponent
              events={events}
              periods={periods}
              userRole={userRole}
              // startDate={getFormattedDate()}
            />
            {userRole !== 'student' && (
              <button
                style={{
                  backgroundColor: '#51c7df',
                  color: '#fff',
                  fontSize: 14
                }}
                onClick={openTaskEventModal}
                className='px-4 py-2 border-0 color transform text-uppercase  w-100 my-1'
              >
                Create Task/Event
              </button>
            )}
            {taskEventModal && (
              <TaskEventModal
                show={taskEventModal}
                onHide={closeTaskEventModal}
                periods={periods}
                startDate={getFormattedDate()}
              />
            )}
            <NotificationSection />
            <CertificationRequestsWidget />
            <Messenger
              chatOpened={(id) => setChatId(id)}
              newMessage={(message) => setNewMessage(message)}
            />

            <div className={`community-connect px-3`}>
              <Link to='/my-connections'>
                <FontAwesomeIcon
                  icon={faUsers}
                  style={{
                    color: '#01C5D1',
                    background: 'white',
                    borderRadius: '50%',
                    height: '25px',
                    width: '36px',
                    opacity: '1'
                  }}
                />
              </Link>
              <Link to='/my-connections'>
                <p className='my-auto ms-2'>Connect with my community</p>
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Dashboard
