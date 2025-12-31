import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './index.css'
import axiosInstance from '../../utils/AxiosInstance'

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const history = useHistory()

  useEffect(() => {
    fetchNotifications()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const fetchNotifications = async () => {
    try {
      const { data } = await axiosInstance.get(`/notifications`)
      if (data?.data?.length > 0) {
        setNotifications(data.data)
      }
      setUnreadCount(data.unreadCount || 0)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      await axiosInstance.patch(`/notifications/${notification.id}/read`)
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
      
      // Navigate to action link
      setIsOpen(false)
      if (notification.actionLink) {
        history.push(notification.actionLink)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await axiosInstance.patch('/notifications/mark-all-read')
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  return (
    <div style={{ marginRight: '15px', position: 'relative' }} ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="25" 
          height="30" 
          viewBox="0 0 25 30" 
          fill="none"
        >
          <path 
            d="M12.169 29.663C12.9751 29.6606 13.7474 29.3394 14.3174 28.7694C14.8874 28.1994 15.2086 27.4271 15.211 26.621H9.127C9.127 27.4278 9.44749 28.2015 10.018 28.772C10.5885 29.3425 11.3622 29.663 12.169 29.663ZM21.3 20.536V12.93C21.3 8.26 18.805 4.351 14.455 3.316V2.282C14.455 1.67678 14.2146 1.09634 13.7866 0.668382C13.3587 0.240424 12.7782 0 12.173 0C11.5678 0 10.9873 0.240424 10.5594 0.668382C10.1314 1.09634 9.891 1.67678 9.891 2.282V3.316C5.522 4.35 3.042 8.245 3.042 12.93V20.536L0 23.578V25.1H24.339V23.578L21.3 20.536Z" 
            fill="#231F20"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.read && <span className="unread-indicator"></span>}
                  <h4 className="notification-title">
                    {notification.date}: {notification.title}
                  </h4>
                  <p className="notification-description">
                    {notification.description}
                  </p>
                  <p className="notification-action">
                    {notification.actionText}
                  </p>
                </div>
              ))
            ) : (
              <div className="notification-empty">
                <p>You don't have any notifications!</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default NotificationBell