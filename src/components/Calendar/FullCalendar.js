import React, { useState, useEffect, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import 'tippy.js/dist/svg-arrow.css'
import moment from 'moment'
import './index.css'
import 'react-tippy/dist/tippy.css'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light-border.css'
import CalendarEventModal from '../Modals/CalendarEventModal'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeEventDateStart,
  closeCalendarEventModal,
  closeTaskModal,
  editEventStart,
  openCalendarEventModal,
  openTaskModal,
} from '../../redux/dashboard/Actions'
import TaskEventModal from '../Modals/TaskEventModal'

let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '')

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr,
  },
  {
    id: createEventId(),
    title: 'All-day event2',
    start: todayStr,
  },
  {
    id: createEventId(),
    title: 'All-day event3',
    start: todayStr,
  },
  {
    id: createEventId(),
    title: 'All-day event4',
    start: todayStr,
  },
]

export function createEventId() {
  return String(eventGuid++)
}

const FullCalendarComponent = (props) => {
  const calendarEventModal = useSelector(
    (state) => state.dashboard.calendarEventModal
  )
  const openCalendarModal = () => {
    dispatch(openCalendarEventModal())
  }

  const closeCalendarModal = () => {
    dispatch(closeCalendarEventModal())
  }
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState([])
  const dispatch = useDispatch()

  const handleEvents = (events) => {
    setCurrentEvents(events)
  }

  const renderEventContent = (eventInfo) => {
    const foundedEvent = props.events?.find(
      (ev) => ev?.id == +eventInfo.event?.id
    )
    let event = ''
    let color = ''
    const backgroundColor = () => {
      if (eventInfo.event.classNames[0] == 'event-event') {
        event = 'Event'
        color = '#FF3399'
        return '#FF3399'
      } else if (eventInfo.event.classNames[0] == 'event-task') {
        event = 'Task'
        color = '#A7CA42'
        return '#A7CA42'
      }
    }

    return (
      <div className={'custom-popover'}>
        <div className="d-flex g-2 w-100" style={{ margin: 0, padding: 0 }}>
          <ul
            className="event-ul"
            style={{
              width: '100%',
              margin: 0,
              paddingLeft: '1rem',
              fontSize: '14px',
            }}
          >
            <li
              className="event-li"
              style={{
                color: backgroundColor(),
                listStyleType: 'square',
                fontSize: '20px',
                margin: 0,
                padding: 0,
              }}
            >
              <span
                className="event-span"
                style={{
                  fontSize: '12.5px',
                  fontWeight: 400,
                  margin: 0,
                  padding: 0,
                }}
              >
                {foundedEvent.type == 'task' ? 'Task' : 'Event'}:{' '}
                {foundedEvent?.name}
              </span>
              <div
                className="event-name"
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#231F20',
                  fontFamily: 'Montserrat',
                }}
              >
                {foundedEvent?.user?.name}
              </div>
              <div
                className="event-time"
                style={{
                  fontSize: '10px',
                  color: '#231F20',
                  fontWeight: 'normal',
                }}
              >
                {convertToAMPM(foundedEvent?.startTime.slice(0, 5))} -{' '}
                {convertToAMPM(foundedEvent?.endTime.slice(0, 5))}
              </div>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  const [events, setEvents] = useState([])
  useEffect(() => {
    const convertedEvents = props.events?.map((event) => {
      const start = moment(event.startDate).toDate()
      const end = moment(event.endDate).toDate()
      const className = event.type === 'task' ? 'event-task' : 'event-event'
      const title = event.name
      const id = event.id

      return {
        id,
        start,
        end,
        className,
        title,
      }
    })

    setEvents(convertedEvents)
  }, [props.events])

  const [foundedEvent, setFoundedEvent] = useState(null)

  useEffect(() => {
    const event = props.events.find((event) => event.id == foundedEvent?.id)
    setFoundedEvent(event)
  }, [props.events])

  const foundEvent = (event) => {
    return props.events?.find((ev) => ev?.id == +event.event?.id)
  }

  const [startDate, setStartDate] = useState(null)

  const addOnDayClick = (event) => {
    setStartDate(event.startStr)
    openTaskEventModal()
  }
  const handleEventClick = (event) => {
    const eventFounded = foundEvent(event)
    setFoundedEvent(eventFounded)
    openCalendarModal()
  }

  const ISOtoUSDateFormat = (date) => {
    const dateObj = new Date(date)
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    const formattedDate = dateObj
      .toLocaleDateString('en-US', options)
      .replace(/\//g, '-')
    return formattedDate
  }

  const formatDate = (date) => {
    const parts = date.split('-')
    const newDate = parts[2] + '-' + parts[0] + '-' + parts[1]
    return newDate
  }

  function getDaysBetweenDates(date1, date2) {
    const parsedDate1 = Date.parse(date1)
    const parsedDate2 = Date.parse(date2)

    if (isNaN(parsedDate1) || isNaN(parsedDate2)) {
      throw new Error('Invalid date format')
    }

    const timestamp1 = parsedDate1 / 1000
    const timestamp2 = parsedDate2 / 1000

    const difference = timestamp2 - timestamp1

    const days = Math.floor(difference / (60 * 60 * 24))

    return days
  }

  function isValidDate(dateString) {
    var date = new Date(dateString)
    return !isNaN(date.getTime())
  }

  const handleChangeDate = (event) => {
    const eventFounded = foundEvent(event)
    const formattedStartDate = formatDate(ISOtoUSDateFormat(event.event.start))

    const days = getDaysBetweenDates(eventFounded.startDate, formattedStartDate)

    let endDate = ''

    if (eventFounded.endDate !== '0000-00-00') {
      endDate = new Date(eventFounded.endDate)
      endDate.setDate(endDate.getDate() + days)
    }

    const newEndDate = new Date(endDate)

    const formattedEndDate = formatDate(ISOtoUSDateFormat(newEndDate))

    dispatch(
      changeEventDateStart(
        {
          startDate: formattedStartDate,
          endDate: isValidDate(formattedEndDate) ? formattedEndDate : null,
        },
        { eventId: eventFounded.id }
      )
    )
  }

  const convertDate = (date) => {
    const inputDate = new Date(date)
    const day = inputDate.getDate()
    const month = inputDate.toLocaleString('default', { month: 'long' })
    const year = inputDate.getFullYear()

    const formattedDate = `${month} ${day}`
    return formattedDate
  }

  const getFullYear = (date) => {
    const inputDate = new Date(date)
    const year = inputDate.getFullYear()

    return year
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
  const handleMouseEnter = (arg) => {
    const condition =
      arg?.jsEvent?.target?.classList?.value?.includes('fc-event')
    const event = props.events.find((event) => event.id == arg.event?.id)
    if (condition) {
      tippy(arg.el, {
        theme: 'custom',
        arrow: true,
        placement: 'bottom',

        content: () => {
          const tooltip = document.createElement('div')
          tooltip.innerHTML =
            event.type === 'task'
              ? `<div style="width: 195px">
                               
                                  <div className={"d-flex g-2 w-100  "} style='margin:0px; padding:0px'>
                                       <div>
                                        <div
                                        style=
                                        "    text-transform: uppercase;
                                              text-align: center;
                                              margin-bottom: 4px;
                                              padding-bottom: 6px;
                                              border-bottom: 1px solid #e3e3e3;
                                              font-size: 12px;
                                              font-weight: 400;
                                              padding-top: 3px;
                                         "
                                        >
                                          ${convertDate(event?.startDate)}
                                          ${
                                            event?.endDate
                                              ? ' - ' +
                                                convertDate(event?.endDate)
                                              : ''
                                          },
                                          ${getFullYear(event?.startDate)}
                                         
                                        </div>
                                        </div>
                                        
                                      
                                        <ul 
                                        class="event-ul"
                                        style={"width:100%; margin:0px; padding-left:1rem; font-size:14px"}
                                        >
                                          <li class="event-li" style="color:#A7CA42;list-style-type:square;
                                           font-size: 20px;
                                            margin:0px; padding:0px
                                            ">
                                            <span class="event-span" style="font-size: 12.5px;
                                            font-weight:400;
                                            margin:0px; padding:0px">
                                            Task: ${event?.name}
                                            </span>
                                             <div class="event-name" style="font-size:12px;font-weight:500; color:#231F20; font: normal normal normal Montserrat;">
                                        ${event?.user?.name}
                                        </div>
                                          <div class="event-time" className={"ml-2"} style="font-size: 10px; color:#231F20; font-weight:normal">
                                          ${convertToAMPM(
                                            event?.startTime.slice(0, 5)
                                          )} -
                                          ${convertToAMPM(
                                            event?.endTime.slice(0, 5)
                                          )}
                                        </div>
                                          </li>
                                        
                                        
                                          </ul>
                                          
                                 
                            </div>`
              : `<div style="width: 195px">
                               
                                  <div className={"d-flex g-2 w-100  "} style='margin:0px; padding:0px'>
                                        <div
                                        style=
                                        "    text-transform: uppercase;
                                              text-align: center;
                                              margin-bottom: 4px;
                                              padding-bottom: 6px;
                                              border-bottom: 1px solid #e3e3e3;
                                              font-size: 12px;
                                              font-weight: 400;
                                              padding-top: 3px;
                                         "
                                        >
                                          ${convertDate(event?.startDate)}
                                          ${
                                            event?.endDate
                                              ? ' - ' +
                                                convertDate(event?.endDate)
                                              : ''
                                          },
                                          ${getFullYear(event?.startDate)}
                                         
                                        </div>
                                        
                                      
                                        <ul 
                                        class="event-ul"
                                        style={"width:100%; margin:0px; padding-left:1rem; font-size:14px"}
                                        >
                                          <li class="event-li" style="color:#FF3399;list-style-type:square;
                                           font-size: 20px;
                                            margin:0px; padding:0px
                                            ">
                                            <span class="event-span" style="font-size: 12.5px;
                                            font-weight:400;
                                            margin:0px; padding:0px">
                                            Event: ${event?.name}
                                            </span>
                                             <div class="event-name" style="font-size:12px;font-weight:500; color:#231F20; font: normal normal normal Montserrat;">
                                        ${event?.user?.name}
                                        </div>
                                          <div class="event-time" className={"ml-2"} style="font-size: 10px; color:#231F20; font-weight:normal">
                                          ${convertToAMPM(
                                            event?.startTime.slice(0, 5)
                                          )} -
                                          ${convertToAMPM(
                                            event?.endTime.slice(0, 5)
                                          )}
                                        </div>
                                          </li>
                                        
                                        
                                          </ul>
                                          
                                 
                            </div>`
          return tooltip
        },
      })
    }
  }

  const taskEventModal = useSelector(
    (state) => state.dashboard.taskEventModalInClick
  )
  const openTaskEventModal = () => {
    dispatch(openTaskModal('create-in-click'))
  }

  const closeTaskEventModal = () => {
    dispatch(closeTaskModal('create-in-click'))
  }

  return (
    <>
      <FullCalendar
        dayCellClassNames={'fc-cell-custom '}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={2}
        weekends={weekendsVisible}
        events={events}
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'prev,next',
        }}
        initialEvents={currentEvents}
        select={(event) => addOnDayClick(event)}
        eventContent={renderEventContent}
        eventClick={(event) => handleEventClick(event)}
        eventsSet={handleEvents}
        eventMouseEnter={handleMouseEnter}
        eventChange={handleChangeDate}
        eventRemove={function () {}}
        duration={{ weeks: 4 }}
        moreLinkContent={(n) => (
          <div
            style={{
              backgroundColor: '#1ea1f1',
              width: '100%',
              color: '#fff',
              textAlign: 'center',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 6,
            }}
          >
            {n.num} more
          </div>
        )}
        moreLinkClassNames={'more-link'}
      />
      <CalendarEventModal
        show={calendarEventModal}
        onHide={closeCalendarModal}
        event={foundedEvent}
        onEdit={(event) => dispatch(editEventStart(event))}
      />
      <TaskEventModal
        show={taskEventModal}
        onHide={closeTaskEventModal}
        periods={props.periods}
        event={null}
        onEdit={null}
        startDate={startDate}
      />
    </>
  )
}

export default FullCalendarComponent
