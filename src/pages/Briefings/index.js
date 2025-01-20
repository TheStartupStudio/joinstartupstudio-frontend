import React, { useEffect } from 'react'
import BriefingsArchive from '../../components/Briefings'
import './style.css'
import NotificationSection from '../NotificationSection-dashboard/NotificationSection'
import { useDispatch, useSelector } from 'react-redux'
import FullCalendarComponent from '../../components/Calendar/FullCalendar'
import TaskEventModal from '../../components/Modals/TaskEventModal'
import { closeTaskModal, getEventsStart, getPeriodsStart, openTaskModal } from '../../redux/dashboard/Actions'

const Briefings = () => {
  const dispatch = useDispatch()
  const periods = useSelector((state) => state.dashboard.periods)
  const events = useSelector((state) => state.dashboard.events)

  const taskEventModal = useSelector(
    (state) => state.dashboard.addTaskEventModal
  )
  const openTaskEventModal = () => {
    dispatch(openTaskModal('create'))
  }

  const closeTaskEventModal = () => {
    dispatch(closeTaskModal('create'))
  }

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

  return (
    <div className="container-fluid">
      <div className="row">
        <BriefingsArchive />
        <div className="col-12 col-xl-3 px-0">
          <div className="account-page-padding" style={{ paddingLeft: '20px' }}>
            <FullCalendarComponent events={events} periods={periods} />

            <button
              style={{
                backgroundColor: '#51c7df',
                color: '#fff',
                fontSize: 14
              }}
              onClick={openTaskEventModal}
              className="px-4 py-2 border-0 color transform text-uppercase  w-100 my-1"
            >
              Create Task/Event
            </button>
            {taskEventModal && <TaskEventModal
              show={taskEventModal}
              onHide={closeTaskEventModal}
              periods={periods}
              startDate={getFormattedDate()}
            />}
            <NotificationSection />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Briefings
