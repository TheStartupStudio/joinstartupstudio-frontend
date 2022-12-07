import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es' // the locale you want
import Event from '../Event'
import './index.css'
import moment from 'moment'
import { random } from 'lodash'

export default function Calendar() {
  const [startDate, setStartDate] = useState(new Date())
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [eventsForDay, setEventsForDay] = useState([])
  const [selectedDate, setSelectedDate] = useState()
  // eslint-disable-next-line
  const [events, setEvents] = useState([
    // {
    //   id: 2,
    //   title:
    //     'Live Q&A with Story in Motion Podcast Episode 2 Guest: Mehul Desai',
    //   author: 'Anastasia Hall',
    //   date: '2022/10/27',
    //   time: '2:00 pm'
    // },
    // {
    //   id: 3,
    //   title:
    //     'Live Q&A with Story in Motion Podcast Episode 3 Guest: Tonya Evans',
    //   author: 'Anastasia Hall',
    //   date: '2022/11/30',
    //   time: '01:30 pm EST'
    // },
    {
      id: 4,
      title:
        'Live Q&A with Story in Motion Podcast Episode 4 Guest: Emily Johnson',
      author: 'Anastasia Hall',
      date: '2022/12/14',
      time: '01:30 pm'
    }
  ])

  const filterEventsByDate = [
    // {
    //   id: 2,
    //   title:
    //     'Live Q&A with Story in Motion Podcast Episode 2 Guest: Mehul Desai',
    //   author: 'Anastasia Hall',
    //   date: '2022/10/27',
    //   time: '2:00 pm'
    // },
    // {
    //   id: 3,
    //   title:
    //     'Live Q&A with Story in Motion Podcast Episode 3 Guest: Tonya Evans',
    //   author: 'Anastasia Hall',
    //   date: '2022/11/30',
    //   time: '01:30 pm EST'
    // },
    {
      id: 4,
      title:
        'Live Q&A with Story in Motion Podcast Episode 4 Guest: Emily Johnson',
      author: 'Anastasia Hall',
      date: '2022/12/14',
      time: '01:30 pm'
    }
  ]

  let dates = events.map((data) => new Date(data.date))

  const filterUpComing = (data) => {
    setEventsForDay(
      events.filter((event) => moment(data).format('YYYY/MM/DD') == event.date)
    )
    setEvents(
      filterEventsByDate.filter(
        (event) => moment(data).format('YYYY/MM/DD') !== event.date
      )
    )
  }

  registerLocale('es', es)

  return (
    <div className='customDatePickerWidth'>
      <div className='row'>
        <div className='col-xl-12 col-md-6 col-sm-12'>
          <div className='col-md-12 col-12 mx-auto mx-md-auto mx-0 gx-0 gx-md-auto calendar-under-threehoundertpx pe-2'>
            <DatePicker
              locale={currentLanguage}
              onChange={(date) => {
                setSelectedDate(date ? date : startDate)
                filterUpComing(date)
                setStartDate(date)
              }}
              selected={startDate}
              highlightDates={dates}
              inline
              autoFocus={false}
            />
          </div>
        </div>
        <div className='mt-4'>
          {eventsForDay.length != 0 && (
            <p className='text-center' style={{ fontWeight: '600' }}>
              Events for this day
            </p>
          )}
          {eventsForDay.length != 0
            ? eventsForDay.map((event, index) => (
                <>
                  <Event
                    date={event.date}
                    time={event.time}
                    title={event.title}
                    key={index + 111}
                    author={event.author}
                  />
                </>
              ))
            : ''}
          {/* : 'There are not any events in the selected date.'} */}
        </div>
        <div className='col-xl-12 col-md-6 col-sm-12'>
          {events.length != 0 && (
            <h4 className='upcoming-events-title mt-4 mt-lg-5 mt-xl-4'>
              UPCOMING LIVE EVENTS <br />
            </h4>
          )}
          <div>
            <React.Fragment>
              {events.map((event, index) => (
                <>
                  {new Date(
                    moment(`${event.date} ${event.time}`).format(
                      'YYYY.MM.DD h:mm:ss a'
                    )
                  ).getTime() /
                    1000 <
                  new Date().getTime() / 1000 ? (
                    false
                  ) : (
                    <>
                      <Event
                        date={event.date}
                        time={event.time}
                        title={event.title}
                        key={index}
                        author={event.author}
                      />
                    </>
                  )}
                </>
              ))}
            </React.Fragment>
          </div>
        </div>
      </div>
    </div>
  )
}
