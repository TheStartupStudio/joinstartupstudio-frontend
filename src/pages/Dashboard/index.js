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
import LevelWrapper from '../../components/LevelWrapper'
import FullCalendarComponent from '../../components/Calendar/FullCalendar'
import TaskEventModal from '../../components/Modals/TaskEventModal'
import NotificationSection from '../NotificationSection-dashboard/NotificationSection'
import useImpersonation from '../../hooks/useImpersonation'
import RecentAchievements from './RecentAchievement'

function Dashboard() {
  const originalToken = localStorage.getItem('original_access_token')
  const userRole = localStorage.getItem('role')
  const dispatch = useDispatch()
  const periods = useSelector((state) => state.dashboard.periods)
  const events = useSelector((state) => state.dashboard.events)

  const user = {
    level: 'HS'
  }
  const [chatId, setChatId] = useState('')

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

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 col-xl-9 pe-0 me-0'>
          <div className='account-page-padding page-border'>
            <h3 className='page-title'>
              <IntlMessages id='navigation.dashboard' />
            </h3>
            <p className='page-description'>
              <IntlMessages id='dashboard.page_description' />
            </p>

            {/* <LevelWrapper user={user}> */}
            {/* <Profile
                chatOpened={chatId}
                clearChat={() => setChatId('')}
                level={'MS'}
                userRole={userRole}
              /> */}
            <Profile
              chatOpened={chatId}
              clearChat={() => setChatId('')}
              level={'HS'}
              userRole={userRole}
            />
            {/* </LevelWrapper> */}
            {userRole === 'student' && <RecentAchievements />}
          </div>
        </div>
        <div className='col-12 col-xl-3 px-0'>
          <div className='account-page-padding' style={{ paddingLeft: '20px' }}>
            <FullCalendarComponent
              events={events}
              periods={periods}
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
            {/*<CertificationRequestsWidget />*/}
            {/* <Messenger
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
