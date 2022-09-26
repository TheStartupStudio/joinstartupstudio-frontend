import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es' // the locale you want
import Event from '../Event'
import './index.css'

// document.getElementsByClassName(
//   'react-datepicker__day--highlighted'
// ).onmouseover = (data) => alert('green-button')

export default function Calendar() {
  const [startDate, setStartDate] = useState(new Date())
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [selectedDate, setSelectedDate] = useState(startDate)
  const [todayEvents, setTodayEvents] = useState([])
  const [events, setEvents] = useState([
    {
      id: 1,
      title:
        'Live Q&A with Story in Motion Podcast Episode 1 Guest: Adam Marshall',
      author: 'Anastasia Hall',
      date: '2022,09,29',
      time: '12:44 pm'
    }
  ])

  let dates = events.map((data) => new Date(data.date))

  registerLocale('es', es)

  return (
    <div className='customDatePickerWidth'>
      <div className='row'>
        <div className='col-xl-12 col-md-6 col-sm-12'>
          <div className='col-md-12 col-12 mx-auto mx-md-auto mx-0 gx-0 gx-md-auto calendar-under-threehoundertpx pe-2'>
            <DatePicker
              locale={currentLanguage}
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              // onSelect={(e) => {
              //   setSelectedDate(e)
              //   setTodayEvents((old) => [])
              //   events.map((event) => {
              //     if (
              //       moment(new Date(event.date)).format('MMM Do YY') ==
              //       moment(new Date(e)).format('MMM Do YY')
              //     ) {
              //       setTodayEvents((old) => [...old, event])
              //     }
              //   })
              // }}
              // renderCalendarInfo={'renderCalendarInfo'}
              // weekLabel={'test'}
              // className='red-border'
              highlightDates={dates}
              // onChange={(date) => {
              //   alert(new Date(date))
              //   setStartDate(date)
              // }}
              inline
              // onDayMouseEnter={(day) => console.log(day, 'alter')}
              // onSelect={(day) => console.log(day, 'alter')}
              onFocus={'test'}
              // onBlur={(e) => 4 == 4 && <Info />}
              autoFocus={true}
            />
          </div>
        </div>
        {
          <div className='col-xl-12 col-md-6 col-sm-12'>
            {events.length != 0 && (
              <h4 className='upcoming-events-title mt-4 mt-lg-5 mt-xl-4'>
                UPCOMING LIVE EVENTS
                <br />
                {/* {moment(selectedDate).format('ll')} */}
                {/* <IntlMessages id='dashboard.upcoming_events' /> */}
              </h4>
            )}
            <div>
              {events.length == 0 && (
                <div
                  style={{
                    minHeight: '170px'
                  }}
                  className='d-flex w-100 text-center'
                >
                  <p
                    className='mx-auto my-auto no-selected-data'
                    style={{
                      fontWeigt: '900px',
                      fontSize: '16px'
                    }}
                  >
                    There not any event in the selected date
                  </p>
                </div>
              )}
              <React.Fragment>
                {events.map((event) => (
                  <Event
                    date={event.date}
                    time={event.time}
                    title={event.title}
                    author={event.author}
                  />
                ))}
              </React.Fragment>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
