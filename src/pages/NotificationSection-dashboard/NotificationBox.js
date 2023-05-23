import '../Dashboard/index.css'
import React, { useEffect, useState } from 'react'
import socket from '../../utils/notificationSocket'
import axiosInstance from '../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import NotificationModal from '../../components/Modals/NotificationModal'
import DeleteNotificationModal from '../../components/Modals/DeleteNotificationModal'
import { toast } from 'react-toastify'

const NotificationListItem = ({
  title,
  description,
  url,
  onEdit,
  onDelete,
}) => {
  return (
    <Link className="notification-content-list-container" to={url}>
      <div className={'notification-content'}>
        <div className={'dot-container'}>
          <span className={'notification-content-list-item-dot'}></span>
        </div>
        <span className="notification-content-title">
          {title}:{'  '}
          <span className="notification-content-description">
            {description}
          </span>
        </span>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        <div
          className="edit-notification notification-button"
          onClick={(e) => {
            e.preventDefault()
            onEdit()
          }}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faEdit} />
        </div>
        <div
          className="delete-notification notification-button"
          onClick={(e) => {
            e.preventDefault()
            onDelete()
          }}
          style={{ cursor: 'pointer' }}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </div>
      </div>
    </Link>
  )
}
const NotificationBox = (props) => {
  const { user } = useSelector((state) => state.user.user)
  const [receivedNotifications, setReceivedNotifications] = useState([])

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

  useEffect(() => {
    if (receivedNotifications.length) {
      socket?.on('updatedNotification', (data) => {
        let newReceivedNotifications = [...receivedNotifications]
        const foundedNotificationIndex = newReceivedNotifications?.findIndex(
          (n) => n.id === data.notification.id
        )
        newReceivedNotifications[foundedNotificationIndex] = data.notification

        setReceivedNotifications(newReceivedNotifications)
      })
      handleCloseNotificationModal()
    }
  }, [receivedNotifications])

  useEffect(() => {
    if (receivedNotifications.length) {
      socket?.on('deletedNotification', (data) => {
        let newReceivedNotifications = receivedNotifications.filter(
          (n) => n.id !== data.notificationId
        )
        setReceivedNotifications(newReceivedNotifications)
      })
      handleCloseDeleteNotificationModal()
    }
  }, [receivedNotifications])

  const [notificationModal, setNotificationModal] = useState(false)
  const [deleteNotificationModal, setDeleteNotificationModal] = useState(false)
  const [notification, setNotification] = useState(null)

  const handleOpenNotificationModal = (index) => {
    const notificationFounded = [...receivedNotifications].find(
      (n, i) => i === index
    )
    setNotification(notificationFounded)
    setNotificationModal(true)
  }
  const handleCloseNotificationModal = () => {
    setNotificationModal(false)
  }

  const handleOpenDeleteNotificationModal = (index) => {
    const notificationFounded = [...receivedNotifications].find(
      (n, i) => i === index
    )
    setNotification(notificationFounded)
    setDeleteNotificationModal(true)
  }
  const handleCloseDeleteNotificationModal = () => {
    setDeleteNotificationModal(false)
  }

  const handleUpdateNotification = (updatedNotification) => {
    try {
      socket?.emit('editNotification', {
        updatedNotification,
        notificationId: updatedNotification.id,
      })
      toast.success('Notification updated successfully!')
    } catch (e) {
      toast.error('Notification updating error!')
    }
  }

  const onDeleteNotification = () => {
    try {
      socket?.emit('deleteNotification', {
        notificationId: notification.id,
      })
      handleCloseDeleteNotificationModal()
      toast.success('Notification deleted successfully!')
    } catch (e) {
      toast.error('Notification deleting error!')
    }
  }
  return (
    <>
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
                  onEdit={() => handleOpenNotificationModal(index)}
                  onDelete={() => handleOpenDeleteNotificationModal(index)}
                />
              )
            })}
        </div>
      </div>

      <NotificationModal
        show={notificationModal}
        onHide={handleCloseNotificationModal}
        notification={notification}
        handleUpdateNotification={handleUpdateNotification}
      />
      <DeleteNotificationModal
        show={deleteNotificationModal}
        onHide={handleCloseDeleteNotificationModal}
        onDelete={onDeleteNotification}
      />
    </>
  )
}

export default NotificationBox
