import React from 'react'
import { Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import IntlMessages from '../../utils/IntlMessages'
import Calendar from '../../components/Calendar'
import NoteAndChat from '../../components/NoteAndChat/noteAndChat'
import FullCalendarComponent from '../../components/Calendar/FullCalendar'
import TaskEventModal from '../../components/Modals/TaskEventModal'
import CertificationRequestsWidget from '../../components/MyStudents/certificationRequests/certificationRequestsWidget'
import {
  closeTaskModal,
  getEventsStart,
  getPeriodsStart,
  openTaskModal
} from '../../redux/dashboard/Actions'
import { useEffect } from 'react'

function LiveStream() {
  const dispatch = useDispatch()
  const name = useSelector((state) => state.user.name)
  const periods = useSelector((state) => state.dashboard.periods)
  const events = useSelector((state) => state.dashboard.events)

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
    <Container fluid>
      <Row>
        <div className="col-12 col-md-9 px-0">
          <div className="page-padding page-border">
            <h3 className="page-title">
              <IntlMessages id="navigation.startup_live" />
            </h3>
            <p className="page-description">
              <IntlMessages id="startup_live.page_description" />
            </p>
            <Row>
              <div className="col-12 col-md-8">
                <div className="wiresquere">
                  <iframe
                    // src={`https://startupstudio.wiresquare.com/embed/gar-3TJ-66L?name=${name}`}
                    src={`http://startupstudio.wiresquare.com/embed/gar-3TJ-66L?name=${name}`}
                    height="360px"
                    width="100%"
                    title="Wiresquare Meeting Room"
                  />
                </div>
              </div>
              <div className="col-12 col-md-4">
                <NoteAndChat
                  room="5f96a12568d0c2c580fca9fe"
                  page="startup-live"
                  notesTitle="startup-live"
                />
              </div>
            </Row>
            <div className="col-12 px-0 countdown-wrapper mt-2">
              <h5>
                <IntlMessages id="startup_live.now_streaming" />
              </h5>
            </div>
            <div className="startup-live-info ">
              <h4>
                <IntlMessages id="event.welcome_to_LTS" />
              </h4>
              <p>Anastasia Hall</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 px-0">
          {' '}
          <FullCalendarComponent events={events} periods={periods} />
          <button
            style={{
              backgroundColor: '#51c7df',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 14
            }}
            onClick={openTaskEventModal}
            className="px-4 py-2 border-0 rounded color transform text-uppercase font-weight-bold w-100 my-1"
          >
            Create Task/Event
          </button>
          {taskEventModal && <TaskEventModal
            show={taskEventModal}
            onHide={closeTaskEventModal}
            periods={periods}
            event={null}
            onEdit={null}
            startDate={null}
          />}
          {/* <CertificationRequestsWidget /> */}
        </div>
      </Row>
    </Container>
  )
}

export default LiveStream
