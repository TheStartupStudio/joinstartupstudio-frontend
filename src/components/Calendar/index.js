import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es' // the locale you want
import './index.css'
import {addDays, subDays} from "date-fns";

export default function Calendar() {
  const currentLanguage = useSelector((state) => state.lang.locale)
  registerLocale('es', es)
  const [startDate, setStartDate] = useState(new Date());
console.log(startDate)


  const calendar = {
  events: [
      new Date('05/01/2023'),
      new Date('05/02/2023')
  ],
    tasks:[
      new Date('04/23/2023'),
      new Date('04/01/2023')
    ]
  }
  const highlightWithRanges = [
    {
      'react-datepicker__day--highlighted-custom-1': calendar.events
    },
    {
      'react-datepicker__day--highlighted-custom-2': calendar.tasks
    }
  ];



  return (
    <div className='customDatePickerWidth'>
      <div className='row'>
        <div className='col-xl-12 col-md-6 col-sm-12'>
          <div className='col-md-12 col-12 mx-auto mx-md-auto mx-0 gx-0 gx-md-auto calendar-under-threehoundertpx pe-2'>
            <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                locale={currentLanguage}
                inline
                autoFocus={false}
                highlightDates={highlightWithRanges}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
