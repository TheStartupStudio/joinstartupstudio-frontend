import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import './UpcomingEventsCalendar.css'
import calendar from '../../assets/images/academy-icons/svg/calendar.svg'

const UpcomingEventsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const events = useSelector((state) => state.dashboard.events) || []

  // Dummy events data for demonstration
  const dummyEvents = [
    {
      id: 1,
      title: 'Team Meeting',
      start: '2025-01-25T10:00:00',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Project Review',
      start: '2025-01-26T14:30:00',
      type: 'review'
    },
    {
      id: 3,
      title: 'Client Presentation',
      start: '2025-01-28T09:00:00',
      type: 'presentation'
    },
    {
      id: 4,
      title: 'Workshop Session',
      start: '2025-01-29T15:00:00',
      type: 'workshop'
    }
  ]

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonth.getDate() - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonth.getDate() - i)
      })
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day)
      })
    }

    // Next month's leading days (fill to complete 6 rows)
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7
    const remainingCells = totalCells - days.length
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day)
      })
    }

    return days
  }

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const formatEventDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit'
    })
  }

  const formatEventTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getUpcomingEvents = () => {
    const allEvents = [...events, ...dummyEvents]
    const now = new Date()
    return allEvents
      .filter(event => new Date(event.start) > now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 4)
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const hasEvent = (date) => {
    const allEvents = [...events, ...dummyEvents]
    return allEvents.some(event => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const days = getDaysInMonth(currentDate)
  const upcomingEvents = getUpcomingEvents()

  return (
    <div className="upcoming-events-calendar">
      <div className="calendar-header">
        <div className="calendar-icon gap-3"><img src={calendar} alt="calendar" /></div>
        <h3>Upcoming Events</h3>
      </div>

      <div className="calendar-display">

      <div className="calendar-container">
        <div className="calendar-navigation">
          <button 
            className="nav-button" 
            onClick={() => navigateMonth(-1)}
          >
            ‹
          </button>
          <span className="month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button 
            className="nav-button" 
            onClick={() => navigateMonth(1)}
          >
            ›
          </button>
        </div>

        <div className="calendar-grid">
          <div className="days-header">
            {daysOfWeek.map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
          </div>
          
          <div className="days-grid">
            {days.map((dayObj, index) => (
              <div
                key={index}
                className={`calendar-day ${
                  !dayObj.isCurrentMonth ? 'other-month' : ''
                } ${isToday(dayObj.date) ? 'today' : ''} ${
                  hasEvent(dayObj.date) ? 'has-event' : ''
                }`}
              >
                {dayObj.day}
                {hasEvent(dayObj.date) && <div className="event-dot"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="events-section">
        <h4 className="events-title">EVENT INFO</h4>
        <div className="events-list">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <div key={index} className="event-item">
                <div className="event-bullet"></div>
                <div className="event-details">
                  <div className="event-date">{formatEventDate(event.start)}</div>
                  <div className="event-info">
                    {formatEventTime(event.start)}: <span className="event-title">{event.title}</span>
                    <span className="event-link"> (Join)</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-events">No upcoming events</div>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

export default UpcomingEventsCalendar