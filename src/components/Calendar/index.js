import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es' // the locale you want
import Event from '../Event'
import './index.css'
import moment from 'moment'

export default function Calendar() {
  const [startDate, setStartDate] = useState(new Date())
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [selectedDate, setSelectedDate] = useState()
  // eslint-disable-next-line
  const [events, setEvents] = useState([])

  let dates = events.map((data) => new Date(data.date))

  registerLocale('es', es)

  return (
    <div className='customDatePickerWidth'>
      <div className='row'>
        <div className='col-xl-12 col-md-6 col-sm-12'>
          <div className='col-md-12 col-12 mx-auto mx-md-auto mx-0 gx-0 gx-md-auto calendar-under-threehoundertpx pe-2'>
            <DatePicker
              locale={currentLanguage}
              onChange={(date) => setStartDate(date)}
              selected={startDate}
              highlightDates={dates}
              inline
              autoFocus={false}
            />
          </div>
        </div>
        <div className='col-xl-12 col-md-6 col-sm-12'>
          {events.length != 0 && (
            <h4 className='upcoming-events-title mt-4 mt-lg-5 mt-xl-4'>
              UPCOMING LIVE EVENTS <br />
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
