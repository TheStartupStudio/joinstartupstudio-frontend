import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IntlMessages from '../../utils/IntlMessages'
import Profile from '../../components/Profile'
import { changeSidebarState } from '../../redux'
import { ActiveStudents } from '../../components/ActiveStudents'
import CertificationRequestsWidget from '../../components/MyStudents/certificationRequests/certificationRequestsWidget'
import TaskEventModal from '../../components/Modals/TaskEventModal'
import {
  closeTaskModal,
  getEventsStart,
  getPeriodsStart,
  openTaskModal,
} from '../../redux/dashboard/Actions'
import LevelWrapper from '../../components/LevelWrapper'

import FullCalendarComponent from '../../components/Calendar/FullCalendar'
import NotificationBox from '../NotificationSection-dashboard/NotificationBox'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NotificationSection from '../NotificationSection-dashboard/NotificationSection'

function Dashboard() {
  const dispatch = useDispatch()
  const periods = useSelector((state) => state.dashboard.periods)
  const events = useSelector((state) => state.dashboard.events)

  const user = {
    level: 'HS',
  }

  const [newMessage, setNewMessage] = useState([])
  const [chatId, setChatId] = useState('')
  useEffect(() => {
    dispatch(changeSidebarState(false))
  }, [])
  useEffect(() => {
    dispatch(getPeriodsStart())
    dispatch(getEventsStart())
  }, [])

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
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-12 col-xl-9 pe-0 me-0">
          <div className="account-page-padding page-border">
            <h3 className="page-title">
              <IntlMessages id="navigation.dashboard" />
            </h3>
            <p className="page-description">
              <IntlMessages id="dashboard.page_description" />
            </p>

            <LevelWrapper user={user}>
              <Profile
                newMessage={newMessage}
                chatOpened={chatId}
                clearChat={() => setChatId('')}
                level={'MS'}
              />
              <Profile
                newMessage={newMessage}
                chatOpened={chatId}
                clearChat={() => setChatId('')}
                level={'HS'}
              />
            </LevelWrapper>

            {/*<div className="my-4">*/}
            {/*  <div className="row">*/}
            {/*    <div className="col-md-12 col-lg-8">*/}
            {/*      <h3*/}
            {/*        className="page-title"*/}
            {/*        style={{ textTransform: 'capitalize' }}*/}
            {/*      >*/}
            {/*        Recently Active Students*/}
            {/*      </h3>*/}
            {/*    </div>*/}
            {/*    <ActiveStudents />*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        </div>
        <div className="col-12 col-xl-3 px-0">
          <div className="account-page-padding" style={{ paddingLeft: '20px' }}>
            <FullCalendarComponent events={events} periods={periods} />

            <button
              style={{
                backgroundColor: '#51c7df',
                color: '#fff',
                fontSize: 14,
              }}
              onClick={openTaskEventModal}
              className="px-4 py-2 border-0 color transform text-uppercase  w-100 my-1"
            >
              Create Task/Event
            </button>
            <TaskEventModal
              show={taskEventModal}
              onHide={closeTaskEventModal}
              periods={periods}
              event={null}
              onEdit={null}
              startDate={null}
            />
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
