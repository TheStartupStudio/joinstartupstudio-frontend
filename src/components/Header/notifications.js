import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import NotificationTypes from '../../utils/notificationTypes'

const Notifications = (props) => {
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return () => {}
  }, [])

  const notificationClick = (notification) => {
    setLoading(true)
    axiosInstance
      .patch('/notifications', {
        id: notification.id
      })
      .then(() => {
        if (!notification.read) {
          props.setUnreadNotifications(props.unreadNotifications - 1)
        }
        notification.read = true
        props.setShowNotifications(false)
        setLoading(false)
        history.push(notification.url)
      })
  }

  return (
    <div className='notifications-wrapper'>
      <div className='position-relative'>
        {loading && (
          <div className='notifications-loader'>
            <FontAwesomeIcon
              icon={faSpinner}
              className='notifications-spinner'
              spin
            />
          </div>
        )}
        {props.notifications.length > 0 ? (
          <>
            {props.notifications.map((notification) => {
              return (
                <a
                  className={`nav-link notification-link px-0`}
                  onClick={() => notificationClick(notification)}
                  key={notification.id}
                  style={{
                    color: notification.read ? 'rgba(0,0,0,.55)' : 'black'
                  }}
                >
                  {notification.Sender.name}
                  {NotificationTypes[notification.type]?.value}
                </a>
              )
            })}
          </>
        ) : (
          <span>You dont have any notifications!</span>
        )}
      </div>
    </div>
  )
}

export default Notifications
