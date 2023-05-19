import '../Dashboard/index.css'
import { useEffect, useState } from 'react'
import socket from '../../utils/notificationSocket'
import axiosInstance from '../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const NotificationListItem = ({ title, description, url }) => {
  return (
    <Link className="notification-content-list" to={url}>
      <div className={'dot-container'}>
        <span className={'notification-content-list-item-dot'}></span>
      </div>
      <span className="notification-content-title">
        {title}:{'  '}
        <span className="notification-content-description">{description}</span>
      </span>
    </Link>
  )
}
const NotificationBox = (props) => {
  const { user } = useSelector((state) => state.user.user)
  const [receivedNotifications, setReceivedNotifications] = useState([])
  console.log(receivedNotifications)

  useEffect(() => {
    axiosInstance
      .get(`/notifications/${user.id}/manual-notifications`)
      .then((res) => {
        if (res.data.notifications.length > 0) {
          setReceivedNotifications(res.data.notifications)
        }
      })
  }, [user.id])
  useEffect(() => {
    socket?.on('getNotifications', (data) => {
      const editedNotifications = data.notifications.map((notification) => {
        return {
          ...notification,
          Sender: { ...data.Sender },
        }
      })

      setReceivedNotifications((receivedNotifications) => {
        const newNotificationsArray = [
          ...editedNotifications,
          ...receivedNotifications,
        ]
        return newNotificationsArray
      })
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div>
      <div className={'notification-list'}>
        {receivedNotifications
          .slice(
            0,
            props.sliceIndex !== undefined ? props.sliceIndex : undefined
          )
          ?.map((notification, index) => {
            return (
              <NotificationListItem
                key={index}
                title={notification?.title}
                description={notification?.description}
                url={notification?.url}
              />
            )
          })}
      </div>
    </div>
  )
}

export default NotificationBox
