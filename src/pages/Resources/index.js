import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Calendar from '../../components/Calendar'
import { changeSidebarState } from '../../redux'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../utils/AxiosInstance'
import ResourceCard from '../../components/Resources/resourceCard'
import {
  closeTaskModal,
  getEventsStart,
  getPeriodsStart,
  openTaskModal
} from '../../redux/dashboard/Actions'
import FullCalendarComponent from '../../components/Calendar/FullCalendar'
import TaskEventModal from '../../components/Modals/TaskEventModal'
import CertificationRequestsWidget from '../../components/MyStudents/certificationRequests/certificationRequestsWidget'

function Dashboard() {
  const dispatch = useDispatch()
  const [resources, setResources] = useState([])
  const periods = useSelector((state) => state.dashboard.periods)
  const events = useSelector((state) => state.dashboard.events)

  useEffect(() => {
    dispatch(changeSidebarState(false))
  }, [dispatch])

  useEffect(() => {
    getResources()
  }, [])

  const getResources = async () => {
    await axiosInstance
      .get('/resources')
      .then((res) => {
        setResources(res.data)
      })
      .catch((e) => e)
  }

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
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 col-xl-9 pe-0 me-0'>
          <div className='account-page-padding page-border'>
            <h3 className='page-title'>Resources</h3>
            <p className='page-description'>
              Resources for setting up your Learn to Start classrooms.
            </p>
            <div className='resource-cards-container my-4'>
              {resources.length > 0 &&
                resources.map((resource) => (
                  <ResourceCard data={resource} key={resource.id} />
                ))}
            </div>
          </div>
        </div>
        <div className='col-12 col-xl-3 px-0'>
          <div className='account-page-padding' style={{ paddingLeft: '20px' }}>
            <FullCalendarComponent events={events} periods={periods} />
            <button
              style={{
                backgroundColor: '#51c7df',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 14
              }}
              onClick={openTaskEventModal}
              className='px-4 py-2 border-0 rounded color transform text-uppercase font-weight-bold w-100 my-1'
            >
              Create Task/Event
            </button>
            {taskEventModal && (
              <TaskEventModal
                show={taskEventModal}
                onHide={closeTaskEventModal}
                periods={periods}
                event={null}
                onEdit={null}
                startDate={null}
              />
            )}
            {/* <CertificationRequestsWidget /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
