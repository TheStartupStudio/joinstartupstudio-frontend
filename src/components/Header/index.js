import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ReactGA from 'react-ga'
import { Auth } from 'aws-amplify'
import { getAllNotes, updateTnC } from '../../redux'
import ContactUsModal from '../Modals/contactUsModal'
import MisconductModal from '../Modals/misconductModal'
import axiosInstance from '../../utils/AxiosInstance'
import IntlMessages from '../../utils/IntlMessages'
import triangleAlertIcon from '../../assets/images/alert-triangle-icon.svg'
import socket from '../../utils/notificationSocket'
import TermAndCondition from './TermAndCondition'
import StudentOfInstructors from '../GetInstructorStudents/index.js'
import useOnClickOutside from 'use-onclickoutside'
import { useHistory } from 'react-router-dom'
import PeerSharingModal from '../Modals/PeerSharingModal'
import MobileNavbar from './MobileNavbar.js'
import Navbar from './Navbar.js'

function Header() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { user, isAdmin } = useSelector((state) => state.user.user)
  const mainState = useSelector((state) => state)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const sideBarState = useSelector((state) => state.general.sidebarState)
  const notes = useSelector((state) => state.course)
  const [TnCModal, setOpenTnCModal] = useState(false)
  const [firstNote, setFirstNote] = useState('')
  const [verifiedEmail, setVerifiedEmail] = useState(null)
  const [currentUser, setCurrentUser] = useState({})
  const [userMessage, setUserMessage] = useState('')
  const [showContactModal, setShowContactModal] = useState(false)
  const [showMisconductReportModal, setShowMisconductReportModal] =
    useState(false)
  const [countStudentOfInstructor, setCountStudentOfInstructor] =
    useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationsRef = useRef(null)
  const [peerSharingModal, setPeerSharingModal] = useState(false)
  const [peerSharingAccepted, setPeerSharingAccepted] = useState(false)

  useEffect(() => {
    axiosInstance.get('/peerSharing/').then(({ data }) => {
      if (data) {
        setPeerSharingAccepted(data.peerSharingAccepted)
      }
    })
  }, [])

  const acceptPeerSharing = (value) => {
    axiosInstance
      .post('/peerSharing/', { peerSharingAccepted: value })
      .then(({ data }) => {
        if (data) {
          setPeerSharingAccepted(data.peerSharingAccepted)
          history.push('/my-classroom')
          closePeerSharingModal()
        }
      })
  }

  const closePeerSharingModal = () => {
    setPeerSharingModal(false)
  }
  useOnClickOutside(notificationsRef, () => {
    setTimeout(() => {
      setShowNotifications(false)
    }, 100)
  })

  /**
   * we are using these temporary vars
   * since state is not updating immediately
   */

  useEffect(() => {
    isUserAgredToTnC()
    ReactGA.initialize('UA-130670492-3')
    ReactGA.pageview(window.location.href)
  })

  useEffect(() => {
    if (user) {
      socket?.emit('newNotificationUser', {
        name: user.name,
        id: user.id
      })

      socket?.on('getNotification', (data) => {
        setNotifications((notifications) => [
          {
            ...data.notification,
            Sender: { ...data.Sender }
          },
          ...notifications
        ])
        setUnreadNotifications(
          (unreadNotifications) => Number(unreadNotifications) + 1
        )
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [user?.id, user?.name])

  useEffect(() => {
    if (user) {
      checkIfUserHasVerifiedEmail()

      axiosInstance.get(`/notifications/${user.id}`).then((res) => {
        if (res.data.notifications?.length > 0) {
          setNotifications(res.data.notifications)
        }

        setUnreadNotifications(res.data.unreadNotifications)
      })
    }
  }, [user?.id])

  useEffect(
    function () {
      // dispatch(getAllPodcast({}))
      dispatch(
        getAllNotes({
          userId: user?.sub
        })
      )
    },
    [user?.sub, dispatch]
  )

  useEffect(() => {
    if (notes.notes?.length) {
      notes.notes.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
      setFirstNote(notes.notes[0].id)
    }
  }, [notes.notes])

  const isUserAgredToTnC = () => {
    var pathArray = window.location.pathname.split('/')[1]
    if (!user?.TnC && pathArray !== 'terms') {
      setOpenTnCModal(true)
    }
  }

  const checkIfUserHasVerifiedEmail = async () => {
    await Auth.currentAuthenticatedUser({ bypassCache: true })
      .then((res) => {
        setCurrentUser(res)
        if (res.attributes['custom:isVerified'] === '1') {
          setVerifiedEmail(true)
        } else {
          setVerifiedEmail(false)
        }
      })
      .catch((err) => err)
  }

  const sendVerifyEmail = async () => {
    let params = {
      email: currentUser.attributes.email,
      universityCode: currentUser.attributes['custom:universityCode'],
      language: currentLanguage
    }
    setUserMessage('user.sending_verification_email')
    await axiosInstance
      .post(
        `${process.env.REACT_APP_SERVER_BASE_URL}users/verify-email`,
        params
      )
      .then(() => {
        setUserMessage('user.verification_email_sent')
      })
  }

  const closeModal = () => {
    setShowContactModal(false)
  }
  const openPeerSharingModal = () => {
    setPeerSharingModal(true)
  }

  return (
    <div>
      {window.location.href.includes('demo') ? null : verifiedEmail === false &&
        (window.location.href.includes('dashboard') ||
          window.location.href ===
            `${process.env.REACT_APP_CLIENT_BASE_URL}/account`) ? (
        <div className='verify-email'>
          {userMessage !== '' ? (
            <p>
              <IntlMessages id={`${userMessage}`} />
            </p>
          ) : (
            <p>
              <img className='mr-2' src={triangleAlertIcon} alt='triangle' />
              <IntlMessages id='user.verify_email' />
              <Link to='#' className='link' onClick={() => sendVerifyEmail()}>
                <IntlMessages id='user.click_to_verify_email' />
              </Link>
              <IntlMessages id='user.resend_verification_email' />
            </p>
          )}
        </div>
      ) : null}
      <Navbar
        notifications={notifications}
        unreadNotifications={unreadNotifications}
        setUnreadNotifications={setUnreadNotifications}
        setPeerSharingModal={setPeerSharingModal}
        closePeerSharingModal={closePeerSharingModal}
        peerSharingAccepted={peerSharingAccepted}
        mainState={mainState}
        user={user}
        setCountStudentOfInstructor={setCountStudentOfInstructor}
        sideBarState={sideBarState}
        openPeerSharingModal={openPeerSharingModal}
        allowToShow={isAdmin}
        firstNote={firstNote}
      />

      <MobileNavbar
        firstNote={firstNote}
        setFirstNote={setFirstNote}
        unreadNotifications={unreadNotifications}
        setUnreadNotifications={setUnreadNotifications}
        notifications={notifications}
        sideBarState={sideBarState}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        mainState={mainState}
        allowToShow={isAdmin}
        setCountStudentOfInstructor={setCountStudentOfInstructor}
        setShowContactModal={setShowContactModal}
        user={user}
      />

      <ContactUsModal
        show={showContactModal}
        onHide={closeModal}
        user={currentUser}
      />

      <MisconductModal
        show={showMisconductReportModal}
        onHide={() => setShowMisconductReportModal(false)}
      />

      <TermAndCondition
        show={TnCModal}
        onHide={() => {
          user.TnC = true
          setOpenTnCModal(false)
          dispatch(updateTnC())
        }}
      />
      {isAdmin && (
        <StudentOfInstructors
          allow={() => isAdmin}
          onShow={countStudentOfInstructor}
          onHide={() => setCountStudentOfInstructor(false)}
        />
      )}
      <PeerSharingModal
        show={peerSharingModal}
        onHide={closePeerSharingModal}
        peerSharingAccepted={peerSharingAccepted}
        handleChange={(value) => acceptPeerSharing(value)}
      />
    </div>
  )
}

export default Header
