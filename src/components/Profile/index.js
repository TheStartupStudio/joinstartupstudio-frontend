import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
  faInstagram
} from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../utils/AxiosInstance'
import IntlMessages from '../../utils/IntlMessages'
import avator from '../../assets/images/profile-image.png'
import {
  getConnectionRequests,
  getConnections,
  IsUserLevelAuthorized
} from '../../utils/helpers'

export default function Profile(props) {
  const user = useSelector((state) => state.user.user.user)
  const [lastLogin, setLastLogin] = useState(null)
  const [newMessages, setNewMessages] = useState([])
  const isAllowedLevel = IsUserLevelAuthorized()
  const [totalStudents, setTotalStudents] = useState(0)

  useEffect(() => {
    getNewMessages()
    getTotalStudents()
  }, [])

  useEffect(() => {
    if (props.newMessage.length === 0) return
    const arrivalMessage = props.newMessage
    if (
      arrivalMessage.chatOpen &&
      arrivalMessage.currentConversation ==
        arrivalMessage.arrivalMessage.room_id
    )
      return

    const unReadMessageExists = newMessages.some(
      (newMessage) => newMessage.id === arrivalMessage.arrivalMessage.room_id
    )

    if (
      !unReadMessageExists &&
      arrivalMessage.arrivalMessage.from !== user.id
    ) {
      setNewMessages([
        ...newMessages,
        { id: arrivalMessage.arrivalMessage.room_id }
      ])
    } else if (
      unReadMessageExists &&
      arrivalMessage.arrivalMessage.from === user.id
    ) {
      setNewMessages(
        newMessages.filter(
          (message) => message.id !== arrivalMessage.arrivalMessage.room_id
        )
      )
    }
  }, [props.newMessage])

  useEffect(() => {
    if (!props.chatOpened) return
    const room_id = props.chatOpened
    setNewMessages(newMessages.filter((room) => room.id != room_id))
    props.clearChat('')
  }, [props.chatOpened])

  useEffect(() => {
    if (user.last_login === null) {
      return setLastLogin('None')
    }
    const milliseconds = user.last_login * 1000
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    const date = new Date(milliseconds)
    const formatedDate =
      monthNames[date.getMonth()] +
      ' ' +
      date.getUTCDate() +
      ', ' +
      date.getFullYear()
    setLastLogin(formatedDate)
  }, [])

  const getNewMessages = async () => {
    if (!isAllowedLevel) return
    await axiosInstance
      .get('/privateChat/unread-messages')
      .then((data) => {
        setNewMessages(data.data)
      })
      .catch((err) => err)
  }

  const getTotalStudents = async () => {
    await axiosInstance
      .get('/instructor/total-students')
      .then((data) => {
        setTotalStudents(data.data.total_students)
      })
      .catch((err) => err)
  }

  return (
    <Row className='mx-0'>
      <Col
        lg={6}
        sm={12}
        style={{
          backgroundColor: '#F8F7F7',
          borderRadius: 0,
          minHeight: '166px'
        }}
        className='notification-box'
      >
        <div className='dashboard-profile'>
          <img
            src={user?.profile_image ? user?.profile_image : avator}
            alt='Profile'
            className='ms-2'
          />
          <div className='profile-margin'>
            <h3>{user?.name}</h3>
            <p>{user?.profession}</p>
            {user?.social_links?.linkedIn && (
              <a
                href={
                  user.social_links.linkedIn.startsWith('https')
                    ? user.social_links.linkedIn
                    : `https://${user.social_links.linkedIn}`
                }
                rel='noreferrer'
                target='_blank'
                className='link me-1'
              >
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
            )}
            {user?.social_links?.twitter && (
              <a
                href={
                  user.social_links.twitter.startsWith('https')
                    ? user.social_links.twitter
                    : `https://${user.social_links.twitter}`
                }
                rel='noreferrer'
                target='_blank'
                className='link mx-1'
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
            )}
            {user?.social_links?.instagram && (
              <a
                href={
                  user.social_links.instagram.startsWith('https')
                    ? user.social_links.instagram
                    : `https://${user.social_links.instagram}`
                }
                rel='noreferrer'
                target='_blank'
                className='link mx-1'
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            )}
            {user?.social_links?.website && (
              <a
                href={
                  user.social_links.website.startsWith('https')
                    ? user.social_links.website
                    : `https://${user.social_links.website}`
                }
                rel='noreferrer'
                target='_blank'
                className='link mx-1'
              >
                <FontAwesomeIcon icon={faGlobe} />
              </a>
            )}
            {user?.social_links?.facebook && (
              <a
                href={
                  user.social_links.facebook.startsWith('https')
                    ? user.social_links.facebook
                    : `https://${user.social_links.facebook}`
                }
                rel='noreferrer'
                target='_blank'
                className='link mx-1'
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
            )}
          </div>
        </div>
      </Col>
      <Col
        lg={6}
        sm={12}
        style={{
          backgroundColor: '#F8F7F7',
          borderRadius: 0,
          minHeight: '166px'
        }}
        className='dashboard-notification'
      >
        <h3 className='text-lg-center' style={{ marginTop: '39px' }}>
          <IntlMessages id='dashboard.my_notifications' />
        </h3>
        <div className='row'>
          <div className='col-7'>
            {IsUserLevelAuthorized() && (
              <div className='row'>
                <div className='col-10'>
                  <p className='mt-2 mb-0'>New Messages</p>
                </div>
                <div className='col-1 text-left'>
                  <p className='mt-2 mb-0'>
                    {newMessages?.length ? newMessages.length : '0'}
                  </p>
                </div>
              </div>
            )}
            <div className='row'>
              <div className='col-10'>
                <p className='mt-2 mb-0'>Total Students</p>
              </div>
              <div className='col-1 text-left'>
                <p className='mt-2 mb-0'>{totalStudents}</p>
              </div>
            </div>
          </div>
          <div className='col-5'>
            <div className='row'>
              <div className='col-12'>
                <p className='mt-2 mb-0 last-login'>Last Login:</p>
              </div>
              <div className='col-12'>
                <p>{lastLogin}</p>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  )
}
