import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import avator from '../../assets/images/profile-image.png'
import { IsUserLevelAuthorized, isValidHttpUrl } from '../../utils/helpers'
import Questions from '../../assets/images/questions.png'
import Feedbacks from '../../assets/images/feedbacks.png'
import listen from '../../assets/images/read_watch_listen_Listen_with typo.png'
import read from '../../assets/images/read_watch_listen_Read_with typo.png'
import watch from '../../assets/images/read_watch_listen_Watch_with typo.png'
import './index.css'
import BriefingModal from '../Modals/BriefingModal'
import { Link } from 'react-router-dom'
import { getSelectedBriefingStart } from '../../redux/header/Actions'

function Profile(props) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user.user)
  const [lastLogin, setLastLogin] = useState(null)
  const [newMessages, setNewMessages] = useState([])
  const isAllowedLevel = IsUserLevelAuthorized()
  const [dashboardWidget, setDashboardWidget] = useState({})
  const [studentQuestions, setStudentQuestions] = useState({})
  const [feedbackRequests, setFeedbackRequests] = useState({})
  const [briefingModal, setBriefingModal] = useState(false)
  const briefing = useSelector((state) => state?.header?.selectedBriefing)

  useEffect(() => {
    dispatch(getSelectedBriefingStart())
  }, [dispatch])

  const handleOpenBriefingModal = () => {
    setBriefingModal(true)
  }
  const handleCloseBriefingModal = () => {
    setBriefingModal(false)
  }

  useEffect(() => {
    const questionAndFeedbacksHandler = async () => {
      await axiosInstance.get('/instructor/iamr/tickets').then((res) => {
        setStudentQuestions(res.data.student_questions)
        setFeedbackRequests(res.data.certification_feedback_requests)
      })
    }
    questionAndFeedbacksHandler()
  }, [])

  useEffect(() => {
    getDashboardWidgetData()
    getNewMessages()
  }, [])

  const getDashboardWidgetData = async () => {
    await axiosInstance.get('/dashboard').then((res) => {
      setDashboardWidget(res.data)
      const cookies = res.headers['set-cookie']
    })
  }

  useEffect(() => {
    if (props.newMessage?.length === 0) return
    const arrivalMessage = props.newMessage
    if (
      arrivalMessage?.chatOpen &&
      arrivalMessage?.currentConversation ==
        arrivalMessage?.arrivalMessage.room_id
    )
      return

    const unReadMessageExists = newMessages.some(
      (newMessage) => newMessage.id === arrivalMessage?.arrivalMessage.room_id
    )

    if (
      !unReadMessageExists &&
      arrivalMessage?.arrivalMessage.from !== user.id
    ) {
      setNewMessages([
        ...newMessages,
        { id: arrivalMessage?.arrivalMessage.room_id }
      ])
    } else if (
      unReadMessageExists &&
      arrivalMessage?.arrivalMessage.from === user.id
    ) {
      setNewMessages(
        newMessages.filter(
          (message) => message.id !== arrivalMessage?.arrivalMessage.room_id
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
    if (user?.last_login === null) {
      return setLastLogin('None')
    }
    const milliseconds = user?.last_login * 1000
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
            {/* {user?.social_links?.linkedIn && (
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
            )} */}
            {/* {user?.social_links?.twitter && (
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
            )} */}
            {/* {user?.social_links?.instagram && (
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
            )} */}
            {/* {user?.social_links?.website && (
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
            )} */}
            {/* {user?.social_links?.facebook && (
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
            )} */}
            <div className='dashboard_lastLogin w-100'>
              <span className='me-1'>Last Login:</span>
              {lastLogin}
            </div>
          </div>
        </div>
      </Col>
      <div
        style={{
          minHeight: '166px',
          cursor: 'pointer'
        }}
        onClick={() => redirect(dashboardWidget?.link)}
        className='mx-0 px-0 col-12 col-lg-6 row mt-4 mt-md-0 widget-interesting text-center '
      >
        <div className='col-4 col-md-4 mx-auto my-auto fw-bold py-4 '>
          <div className='h-auto w-auto user-select-none'>
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
          <button
            className='py-2 border-0 color transform text-uppercase text-center  w-100 my-1'
            style={{
              backgroundColor: 'rgb(81, 199, 223)',
              color: 'rgb(255, 255, 255)',
              fontSize: 14
            }}
            onClick={(event) => {
              event.stopPropagation()
              handleOpenBriefingModal()
              axiosInstance
                .post('/briefings/increaseBriefings')
                .then((res) => {})
            }}
          >
            Briefing
          </button>
        </div>
        <div
          className='col-8 col-md-8 text-start my-auto info-text-dashboard'
          style={{ fontSize: '14px', wordBreak: 'break-word' }}
        >
          {dashboardWidget?.description}
        </div>
      </div>
      {/* end of twitter widget */}
      {/* read watch listen widget */}
      {/* certification status */}
      <div
        style={{
          backgroundColor: '#F8F7F7',
          marginLeft: '0',
          minHeight: '166px',
          height: '250px',
          fontWeight: '600'
        }}
        className='notification-box col-lg-6 col-sm-12 mt-4 row position-relative'
      >
        <p
          className='text-center certification-progress mt-4'
          style={{ fontSize: '20px', height: 'auto' }}
        >
          Inbox
        </p>
        <div
          className='col-6 text-center fw-bold'
          style={{ marginTop: '-3rem' }}
        >
          <img src={Questions} style={{ width: '180px' }} alt='' />

          <a href={`/my-inbox`} className='iamr-inbox_link m-0'>
            {studentQuestions.unreadCount ? studentQuestions?.unreadCount : 0}
            <span className='ml-2'>Questions</span>
          </a>
        </div>
        <div
          className='col-6 text-center fw-bold'
          style={{ marginTop: '-3rem' }}
        >
          <img src={Feedbacks} style={{ width: '180px' }} alt='' />
          <a href='/my-inbox' className='iamr-inbox_link'>
            {feedbackRequests.unreadCount ? feedbackRequests.unreadCount : 0}
            <span className='ml-2'>Requests</span>
          </a>
        </div>
      </div>
      {/* end of certification status */}
      {/* read and more */}
      <div
        className='col-lg-6 col-12 mt-4 row px-md-4 gx-0 float-end ps-auto ms-auto'
        style={{
          backgroundColor: '#F8F7F7',
          minHeight: '166px',
          height: '250px',
          fontWeight: '600'
        }}
      >
        <div
          className='read-section w-100 border-bottom row gx-0'
          style={{ height: '33.3%' }}
        >
          <div className=' col-5 col-md-3 text-start text-md-start read-watch-listen-image-div p-4'>
            <div className='read-bg__img'></div>
          </div>
          <div
            style={{ float: 'right' }}
            className={'text-start my-auto col-7 read-watch-listen-text-div'}
          >
            <p className='my-0 text-start read-watch-listen-title'>
              {dashboardWidget?.read?.title}
            </p>
            <p
              className='text-start my-0 read-watch-listen-author'
              style={{ fontSize: '10px' }}
            >
              {dashboardWidget?.read?.author}
            </p>
          </div>
        </div>
        {/* second */}
        <div
          className='read-section w-100 border-bottom row gx-0'
          style={{ height: '33.3%' }}
        >
          <div className='col-5 col-md-3 text-start text-md-start read-watch-listen-image-div p-4'>
            <div className='watch-bg__img'></div>
          </div>
          <div
            style={{ float: 'right' }}
            className={
              'text-start my-auto col-7 col-md-9 read-watch-listen-text-div'
            }
          >
            <p className='my-0 text-start w-100 read-watch-listen-title'>
              {dashboardWidget?.watch?.title}
            </p>
            <p
              className='text-start my-0 read-watch-listen-author'
              style={{ fontSize: '10px' }}
            >
              {dashboardWidget?.watch?.author}
            </p>
          </div>
        </div>
        {/* third  */}
        <div
          className='read-section w-100 row gx-0'
          style={{ borderBottom: '0px', height: '33.3%' }}
        >
          <div className='col-5 col-md-3 text-start text-md-start read-watch-listen-image-div p-4'>
            <div className='listen-bg__img'></div>
          </div>
          <div
            style={{ float: 'right' }}
            className={'text-center my-auto col-7 read-watch-listen-text-div'}
          >
            <p className='my-0 text-start read-watch-listen-title'>
              {dashboardWidget?.listen?.title}
            </p>
            <p
              className='text-start my-0 read-watch-listen-author'
              style={{ fontSize: '10px' }}
            >
              {dashboardWidget?.listen?.author}
            </p>
          </div>
        </div>
      </div>
      <BriefingModal
        briefing={briefing}
        show={briefingModal}
        onHide={handleCloseBriefingModal}
      />
    </Row>
  )
}

export default Profile
