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
  IsUserLevelAuthorized,
  isValidHttpUrl
} from '../../utils/helpers'
import marketReadyGuideOne from '../../assets/images/market-ready-1-badge.png'
import marketReadyGuideTwo from '../../assets/images/market-ready-2-badge.png'
import listen from '../../assets/images/read_watch_listen_Listen_with typo.png'
import read from '../../assets/images/read_watch_listen_Read_with typo.png'
import watch from '../../assets/images/read_watch_listen_Watch_with typo.png'
import './index.css'
import { Link } from 'react-router-dom'

export default function Profile(props) {
  const user = useSelector((state) => state.user.user.user)
  const [lastLogin, setLastLogin] = useState(null)
  const [newMessages, setNewMessages] = useState([])
  const isAllowedLevel = IsUserLevelAuthorized()
  const [totalStudents, setTotalStudents] = useState(0)
  const [dashboardInfo, setDashboardInfo] = useState({})

  useEffect(() => {
    setDashboardData()
    getNewMessages()
    getTotalStudents()
  }, [])

  const setDashboardData = async () => {
    await axiosInstance.get('/dashboard').then((res) => {
      setDashboardInfo(res.data)
    })
  }
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

  const redirect = (input) => {
    if (!isValidHttpUrl(input)) input = `http://${input}`
    window.open(input, '_blank')
  }
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
            <div className='dashboard_lastLogin w-100'>
              <span className='me-1'>Last Login:</span>
              {lastLogin}
            </div>
          </div>
        </div>
      </Col>
      {/* <Col
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
      </Col> */}
      <div
        style={{
          minHeight: '166px'
        }}
        className='mx-0 px-0 col-12 col-lg-6 row mt-4 mt-md-0 widget-interesting text-center '
      >
        <div className='col-4 col-md-4 mx-auto my-auto fw-bold py-4 '>
          <div
            className='h-auto w-auto user-select-none'
            onClick={() => redirect(dashboardInfo.link)}
          >
            <p className='my-0 mx-auto' style={{ color: '#FE43A1' }}>
              READ
            </p>
            <p className='my-0 mx-auto' style={{ color: '#99CC33' }}>
              WATCH
            </p>
            <p className='my-0 mx-auto' style={{ color: '#51C7DF' }}>
              LISTEN
            </p>
          </div>
        </div>
        <div
          className='col-8 col-md-8 text-start my-auto info-text-dashboard'
          style={{ fontSize: '14px', wordBreak: 'break-word' }}
        >
          {dashboardInfo.text}
        </div>
      </div>
      {/* end of twitter widget */}
      {/* read watch listen widget */}
      {/* certification status */}
      <div
        style={{
          minHeight: '166px'
        }}
        className='notification-box col-lg-6 col-sm-12 mt-4 row position-relative'
      >
        <p
          className='text-center certification-progress'
          style={{ fontSize: '20px' }}
        >
          My Certification Progress
        </p>
        <div className='col-6 text-center fw-bold'>
          <img src={marketReadyGuideOne} style={{ width: '100px' }} />
          <p className='mb-0 py-0 mt-2'>
            <span style={{ color: '#54C7DF' }}>0 </span> / 15 skills{' '}
          </p>
          <p className='mt-0 py-0'>Certified </p>
        </div>
        <div className='col-6 text-center fw-bold'>
          <img src={marketReadyGuideTwo} style={{ width: '100px' }} />
          <p className='mb-0 py-0 mt-2'>
            <span style={{ color: '#CF2E81' }}>0 </span> / 20 skills{' '}
          </p>
          <p className='mt-0 py-0'>Certified </p>
        </div>
        <p
          className='overlay-comming-soon position-absolute my-auto mx-auto text-center'
          style={{
            fontWeight: 'bold',
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 4,
            fontSize: '20px',
            color: 'white',
            transform: 'translate(-50%, -50%)'
          }}
        >
          Coming soon
        </p>
        <div
          className='overlay-comming-soon position-absolute'
          style={{
            height: '100%',
            width: '100%',
            zIndex: 2,
            backgroundColor: '#828888',
            opacity: '0.9'
          }}
        ></div>
      </div>
      {/* end of certification status */}
      {/* read and more */}
      <div
        className='col-lg-6 col-12 mt-4 row px-md-4 gx-0 float-end ps-auto ms-auto'
        style={{
          backgroundColor: '#F8F7F7',
          minHeight: '166px',
          fontWeight: '600'
        }}
      >
        <div className='read-section w-100 border-bottom row gx-0'>
          <div className='col-5 col-md-3 text-start text-md-start  read-watch-listen-image-div'>
            <img src={read} className={'w-auto '} style={{ height: '130px' }} />
          </div>
          <div
            style={{ float: 'right' }}
            className={'text-start my-auto col-7 read-watch-listen-text-div'}
          >
            <p className='my-0 text-start read-watch-listen-title'>
              LIKE, COMMENT, SUBSCRIBE
            </p>
            <p
              className='text-start my-0 read-watch-listen-author'
              style={{ fontSize: '10px' }}
            >
              Mark Bergen
            </p>
          </div>
        </div>
        {/* second */}
        <div className='read-section w-100 border-bottom row gx-0'>
          <div className='col-5 col-md-3 text-start text-md-start read-watch-listen-image-div'>
            <img
              src={watch}
              className={'w-auto '}
              style={{ height: '130px' }}
            />
          </div>
          <div
            style={{ float: 'right' }}
            className={
              'text-start my-auto col-7 col-md-9 read-watch-listen-text-div'
            }
          >
            <p className='my-0 text-start w-100 read-watch-listen-title'>
              VICTORIA'S SECRET: ANGELS AND DEMONS
            </p>
            <p
              className='text-start my-0 read-watch-listen-author'
              style={{ fontSize: '10px' }}
            >
              Hulu
            </p>
          </div>
        </div>
        {/* third  */}
        <div
          className='read-section w-100 row gx-0'
          style={{ borderBottom: '0px' }}
        >
          <div className='col-5 col-md-3 text-start text-md-start read-watch-listen-image-div'>
            <img src={listen} style={{ height: '130px' }} />
          </div>
          <div
            style={{ float: 'right' }}
            className={'text-center my-auto col-7 read-watch-listen-text-div'}
          >
            <p className='my-0 text-start read-watch-listen-title'>
              WISDOM FROM THE TOP WITH GUY RAZ
            </p>
            <p
              className='text-start my-0 read-watch-listen-author'
              style={{ fontSize: '10px' }}
            >
              Luminary and NPR
            </p>
          </div>
        </div>
        {/*  */}
      </div>
    </Row>
  )
}
