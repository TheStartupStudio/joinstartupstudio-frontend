import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import './index.css'

const CustomBirthDateCalendar = ({ selectedDate, onDateChange }) => {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())
  const [viewDate, setViewDate] = useState(selectedDate || new Date())
  const [showYearPicker, setShowYearPicker] = useState(false)
  const [showMonthPicker, setShowMonthPicker] = useState(false)

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i)

  const createDateAtNoon = (year, month, day) => {
    const date = new Date(year, month, day, 12, 0, 0, 0)
    return date
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: createDateAtNoon(year, month - 1, prevMonthLastDay - i)
      })
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: createDateAtNoon(year, month, day)
      })
    }

    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: createDateAtNoon(year, month + 1, day)
      })
    }

    return days
  }

  const isToday = (date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date) => {
    if (!selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const handleDateClick = (dayObj) => {
    if (dayObj.isCurrentMonth) {
      const selectedDate = createDateAtNoon(
        dayObj.date.getFullYear(),
        dayObj.date.getMonth(),
        dayObj.date.getDate()
      )
      setCurrentDate(selectedDate)
      onDateChange(selectedDate)
    }
  }

  const handleMonthSelect = (monthIndex) => {
    setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1))
    setShowMonthPicker(false)
  }

  const handleYearSelect = (year) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1))
    setShowYearPicker(false)
  }

  const days = getDaysInMonth(viewDate)

  return (
    <div className="custom-birth-calendar">
      <div className="calendar-header">
        <button 
          className="nav-arrow" 
          onClick={handlePrevMonth}
          type="button"
        >
          <FaChevronLeft />
        </button>
        
        <div className="month-year-container">
          {/* Month/Year Display - clickable */}
          {!showMonthPicker && !showYearPicker && (
            <div className="month-year-display">
              <span 
                className="month-selector"
                onClick={() => setShowMonthPicker(true)}
              >
                {months[viewDate.getMonth()]}
              </span>
              {' '}
              <span 
                className="year-selector"
                onClick={() => setShowYearPicker(true)}
              >
                {viewDate.getFullYear()}
              </span>
            </div>
          )}

          {/* Month Picker */}
          {showMonthPicker && (
            <div className="picker-dropdown month-picker">
              <div className="picker-header">
                <button
                  className="picker-close"
                  onClick={() => setShowMonthPicker(false)}
                  type="button"
                >
                  ×
                </button>
                <span>Select Month</span>
              </div>
              <div className="picker-grid">
                {months.map((month, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`picker-option ${
                      viewDate.getMonth() === index ? 'selected' : ''
                    }`}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Year Picker */}
          {showYearPicker && (
            <div className="picker-dropdown year-picker">
              <div className="picker-header">
                <button
                  className="picker-close"
                  onClick={() => setShowYearPicker(false)}
                  type="button"
                >
                  ×
                </button>
                <span>Select Year</span>
              </div>
              <div className="picker-grid year-grid">
                {years.map((year) => (
                  <button
                    key={year}
                    type="button"
                    className={`picker-option ${
                      viewDate.getFullYear() === year ? 'selected' : ''
                    }`}
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button 
          className="nav-arrow" 
          onClick={handleNextMonth}
          type="button"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Only show calendar days when not picking month/year */}
      {!showMonthPicker && !showYearPicker && (
        <div className="calendar-grid">
          <div className="days-header">
            {daysOfWeek.map(day => (
              <div key={day} className="day-name">{day}</div>
            ))}
          </div>

          <div className="days-grid">
            {days.map((dayObj, index) => (
              <button
                key={index}
                type="button"
                className={`calendar-day ${
                  !dayObj.isCurrentMonth ? 'other-month' : ''
                } ${isToday(dayObj.date) ? 'today' : ''} ${
                  isSelected(dayObj.date) ? 'selected' : ''
                }`}
                onClick={() => handleDateClick(dayObj)}
              >
                {dayObj.day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomBirthDateCalendar