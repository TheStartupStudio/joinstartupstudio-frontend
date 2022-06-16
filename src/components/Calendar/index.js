import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es' // the locale you want
import Event from '../Event'
import IntlMessages from '../../utils/IntlMessages'

export default function Calendar() {
  const [startDate, setStartDate] = useState(new Date())
  const currentLanguage = useSelector((state) => state.lang.locale)
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
              inline
              autoFocus={false}
            />
          </div>
        </div>
        <div className='col-xl-12 col-md-6 col-sm-12'>
          <h4 className='upcoming-events-title mt-4 mt-lg-5 mt-xl-4'>
            <IntlMessages id='dashboard.upcoming_events' />
          </h4>
          <div>
            <React.Fragment>
              <Event
                dateTime={<IntlMessages id='event.welcome_to_LTS_date_time' />}
                title={<IntlMessages id='event.welcome_to_LTS' />}
                auther='Anastasia Hall'
              />
            </React.Fragment>
          </div>
        </div>
      </div>
    </div>
  )
}
