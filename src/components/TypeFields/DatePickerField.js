import React, { forwardRef, useEffect, useRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './styles.css'
import { FaRegCalendar } from 'react-icons/fa6'

function DatePickerField(props) {
  const [date, setDate] = useState(null)
  const inputRef = useRef(null)
  useEffect(() => {
    if (props.value) {
      setDate(convertMonthDateToDate(props.value))
    }
  }, [])

  function formatDateToYearMonth(date) {
    const year = date?.getFullYear()
    let month = date?.getMonth() + 1

    month = month < 10 ? '0' + month : month

    return `${year}-${month}`
  }

  useEffect(() => {
    if (date) {
      props.onChange(formatDateToYearMonth(date))
    }
  }, [date])
  return (
    <div className={'d-flex flex-column'}>
      <label className={'mb-2'}>{props.label}</label>

      <DatePicker
        showIcon
        icon="fa fa-calendar"
        selected={date}
        customInput={
          <CustomInput inputRef={inputRef} isDisabled={props.isDisabled} />
        }
        onChange={(date) => setDate(date)}
        showMonthYearPicker
        dateFormat="MM/yyyy"
        disabled={props.isDisabled}
        ref={props.fieldRef}
      />
    </div>
  )
}

const CustomInput = forwardRef((props, ref) => {
  return (
    <div
      className={
        'custom-input-box d-flex justify-content-between align-items-center '
      }
      onClick={props.onClick}
    >
      <div className={`custom-input text-start `} ref={ref}>
        {props.value ? convertDate(props.value) : 'Select date'}
      </div>
      <div className={'pe-2 mb-1'}>
        <FaRegCalendar />
      </div>
    </div>
  )
})
function convertMonthDateToDate(dateStr) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const [year, month] = dateStr.split('-')
  const monthIndex = parseInt(month, 10) - 1

  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error('Invalid month')
  }

  return new Date(year, monthIndex, 1)
}
function convertDate(dateStr) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]

  const [month, year] = dateStr.split('/')
  const monthIndex = parseInt(month, 10) - 1
  if (monthIndex < 0 || monthIndex > 11) {
    throw new Error('Invalid month')
  }

  return `${months[monthIndex]} ${year}`
}
export default DatePickerField
