import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import 'react-quill/dist/quill.snow.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  closeTaskModal,
  closeCalendarDeleteEventModal,
  deleteEventStart,
  getPeriodsStart,
  openTaskModal,
  openCalendarDeleteEventModal
} from '../../redux/dashboard/Actions'
import TaskEventModal from './TaskEventModal'
import DeleteEventModal from './DeleteEventModal'
import IntlMessages from '../../utils/IntlMessages'
import { FormattedMessage } from 'react-intl'
import './CalendarEventModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClock,
  faEdit,
  faTrashAlt
} from '@fortawesome/free-regular-svg-icons'
import '../MultipleSelect/MultipleSelect.css'
import ChipComponent from '../ChipComponent/ChipComponent'

const CalendarModal = (props) => {
  const taskEventModal = useSelector(
    (state) => state.dashboard.editTaskEventModal
  )
  const openTaskEventModal = () => {
    dispatch(openTaskModal('update'))
  }

  const closeTaskEventModal = () => {
    dispatch(closeTaskModal('update'))
  }

  const calendarDeleteEventModal = useSelector(
    (state) => state.dashboard.calendarDeleteEventModal
  )
  const openDeleteEventModal = () => {
    dispatch(openCalendarDeleteEventModal())
  }

  const closeDeleteEventModal = () => {
    dispatch(closeCalendarDeleteEventModal())
  }
  const periods = useSelector((state) => state.dashboard.periods)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPeriodsStart())
  }, [])

  const onDeleteEvent = () => {
    return dispatch(deleteEventStart(props.event?.id))
  }

  const convertDate = (date) => {
    const inputDate = new Date(date)
    const day = inputDate.getDate()
    const month = inputDate.toLocaleString('default', { month: 'long' })
    const year = inputDate.getFullYear()

    const formattedDate = `${day} ${month}`
    return formattedDate
  }

  function convertToAMPM(time) {
    if (time) {
      const [hours, minutes] = time.split(':')
      const date = new Date()
      date.setHours(hours)
      date.setMinutes(minutes)
      const options = { hour: 'numeric', minute: 'numeric', hour12: true }
      return date.toLocaleString('en-US', options)
    }
  }

  const isSingleReactElement = (element) => {
    return React.isValidElement(element) && !Array.isArray(element);
  };

  const Event = (props) => {
    const { type, title, eventInfo } = props;

    return (
      <div style={{ marginBottom: 4 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              backgroundColor: type === 'event' ? '#ff3399' : '#a7ca42',
              marginRight: 10,
            }}
          ></div>
          <FormattedMessage id={`calendar_task-events.${title}`} />
        </div>
        <div style={{ marginLeft: 26 }}>
          {Array.isArray(eventInfo) ? (
            eventInfo.map((item, index) => (
              <div key={index}>{item}</div>
            ))
          ) : isSingleReactElement(eventInfo) ? (
            eventInfo
          ) : typeof eventInfo === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: eventInfo }} />
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop='static'
        keyboard={false}
        style={{ marginTop: '3.9%' }}
        className='edit-modal general-modal-header'
      >
        <Modal.Header
          style={{
            backgroundColor:
              props.event?.type === 'event' ? '#FF3399' : '#A7CA42',
            color: '#fff'
          }}
          className='add-new-note-title general-modal-header my-auto p-2 d-flex flex-column justify-start calendar-modal-header'
        >
          <div
            className={
              'py-2 w-100 d-flex justify-content-between border-bottom align-items-center'
            }
          >
            <h3
              className='mb-0 pb-0 '
              style={{
                color: '#fff'
              }}
            >
              {props.event?.type === 'event' ? (
                <IntlMessages id='calendar_task-events.event' />
              ) : (
                <IntlMessages id='calendar_task-events.task' />
              )}{' '}
              DETAILS
            </h3>
            <button
              type='button'
              className='btn-close mb-1 '
              aria-label='Close'
              onClick={props.onHide}
              style={{ color: '#fff', opacity: 1 }}
            />
          </div>
          <div
            className={
              'd-flex justify-content-between align-items-center w-100 py-2'
            }
          >
            <h2 className={'text-white text-center '}>{props.event?.name}</h2>
            <div style={{ display: 'flex', gap: 10 }}>
              <div
                className='float-end  add-new-note-button-text '
                onClick={openTaskEventModal}
                style={{ cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </div>
              <div
                className='float-end   add-new-note-button-text '
                onClick={openDeleteEventModal}
                style={{ cursor: 'pointer' }}
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </div>
            </div>
          </div>
          <div className={'d-flex align-items-center w-100 '}>
            <div style={{ marginRight: 5 }}>
              <FontAwesomeIcon icon={faClock} />
            </div>

            <div className={'d-flex g-2 w-100 '}>
              <div>
                {convertDate(props.event?.startDate)}
                {!!props.event?.endDate &&
                  ' - ' + convertDate(props.event?.endDate)}
                ,
              </div>
              <div className={'ml-2'}>
                {convertToAMPM(props.event?.startTime.slice(0, 5))} -{' '}
                {convertToAMPM(props.event?.endTime.slice(0, 5))}
              </div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className='mt-4 mb-3 mx-4 add-new-note'>
          <Event
            eventInfo={props.event?.description}
            type={props.event?.type}
            title={
              props.event?.type === 'event'
                ? 'description_of_event'
                : 'description_of_task'
            }
          />
          <Event
            eventInfo={props.event?.requirements}
            type={props.event?.type}
            title={'requirements'}
          />
          <Event
            eventInfo={
            <div className={'d-flex gap-1 flex-wrap'}>
              {props.event?.periods?.map((period) =>


                <ChipComponent
              label={period.name} />
              )}</div>}
              type={props.event?.type}
              title={'chosen_classes'}
              />

            </Modal.Body>
              </Modal>
            {taskEventModal && <TaskEventModal
              event={props.event}
            eventPeriods={props.eventPeriods}
            show={taskEventModal}
        onHide={closeTaskEventModal}
        periods={periods}
        onEdit={props.onEdit}
        startDate={null}
      />}
      <DeleteEventModal
        show={calendarDeleteEventModal}
        onHide={closeDeleteEventModal}
        onDelete={onDeleteEvent}
        type={props.event?.type}
      />
    </>
  )
}
export default CalendarModal
