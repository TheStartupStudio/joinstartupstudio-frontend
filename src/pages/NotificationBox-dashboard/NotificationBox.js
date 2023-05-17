import '../Dashboard/index.css'
import { useEffect, useState } from 'react'
import socket from '../../utils/notificationSocket'
import axiosInstance from '../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import notifications from '../../components/Header/notifications'

const NotificationListItem = ({ title, description }) => {
  return (
    <li className="notification-content-list-item-dot">
      <p className="notification-content-title">
        {title}:{'  '}
        <span className="notification-content-description">{description}</span>
      </p>
    </li>
  )
}
const NotificationBox = () => {
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

        // setUnreadNotifications(res.data.unreadNotifications)
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
      // setUnreadNotifications(
      //     (unreadNotifications) => Number(unreadNotifications) + 1
      // )
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <div className="notification-content-list">
      <ul>
        {receivedNotifications?.map((notification) => {
          return (
            <NotificationListItem
              title={notification?.title}
              description={notification?.description}
            />
          )
        })}
        {/*<NotificationListItem*/}
        {/*  title={'Notification Title'}*/}
        {/*  description={'Notification Description'}*/}
        {/*/>*/}
        {/*<NotificationListItem*/}
        {/*  title={'Notification Title'}*/}
        {/*  description={'Notification Description'}*/}
        {/*/>*/}
      </ul>
    </div>
  )
}

export default NotificationBox
