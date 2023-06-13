import React, { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import CountdownTimer from 'react-component-countdown-timer'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import IntMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { changeSidebarState } from '../../redux'
import Video from '../../components/Video'
import SpotlightImg from '../../assets/images/spotlight-thumbnail.png'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

import { ShowMessenger } from '../../utils/helpers'
import ApplyForPitch from '../StartupProfile/components/Modals/ApplyForPitch'
import Countdown from 'react-countdown'
import Chat from '../../components/NoteAndChat/chat'

function StartupLive() {
  const startDate = new Date()
  const firstEvent = moment(startDate).format('2021-06-26T24:00:00')
  const firstEventTime = new Date('2023-01-30T16:30:00').getTime()
  const secondEvent = moment(startDate).format('2021-05-27T16:30:00')
  const [timeLeft, setTimeLeft] = useState(null)
  const [showButton, setShowButton] = useState(false)
  const [startStartupLiveVideoIndex, setStartStartupLiveVideoIndex] =
    useState(0)
  const [endStartupLiveVideoIndex, setEndStartupLiveVideoIndex] = useState(3)
  const [endStartupLiveVideoIndexMobile, setEndStartupLiveVideoIndexMobile] =
    useState(1)
  const [startupLiveVideos, setStartupLiveVideos] = useState([])
  const currentLanguage = useSelector((state) => state.lang.locale)
  const dispatch = useDispatch()
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [state, setState] = useState({})
  const [PitchApplyModal, setPitchApplyModal] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)

  const resize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    setWidth(window.innerWidth)

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    // getStartupLiveVideos()
    setTimeout(() => {
      setShowSpotlight(true)
    }, 3000)
  }, [])

  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  const getStartupLiveVideos = async () => {
    await axiosInstance
      .get(`/contents/by-type/startup-live`)
      .then((response) => {
        setStartupLiveVideos(response.data)
      })
      .catch((err) => err)
  }

  const handlePreviousVideo = async (page, startIndex, endIndex) => {
    if (startIndex > 0) {
      setStartStartupLiveVideoIndex(startIndex - 1)
      setEndStartupLiveVideoIndex(endIndex - 1)
    }
  }

  const handleNextVideo = async (page, startIndex, endIndex) => {
    if (endIndex < startupLiveVideos.length) {
      setStartStartupLiveVideoIndex(startIndex + 1)
      setEndStartupLiveVideoIndex(endIndex + 1)
    }
  }

  const handleNextVideoMobile = async (page, startIndex, endIndexMobile) => {
    if (endIndexMobile < startupLiveVideos.length) {
      setStartStartupLiveVideoIndex(startIndex + 1)
      setEndStartupLiveVideoIndexMobile(endIndexMobile + 1)
    }
  }

  const handlePreviousVideoMobile = async (
    page,
    startIndex,
    endIndexMobile
  ) => {
    if (startIndex > 0) {
      setStartStartupLiveVideoIndex(startIndex - 1)
      setEndStartupLiveVideoIndexMobile(endIndexMobile - 1)
    }
  }

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return ' SOON'
    } else {
      return (
        <span>
          {' IN ' + days + ' DAYS ' + hours + ' HOURS ' + minutes + ' MINUTES '}
          {minutes === 0 ? seconds + ' SECONDS' : ''}
        </span>
      )
    }
  }

  return (
    <Container fluid>
      <Row>
        <div className="col-12 col-xl-9 pe-0">
          <div
            className="account-page-padding page-border spotlight-container"
            style={{ minHeight: '100vh' }}
          >
            <h3 className="page-title">SPOTLIGHT®</h3>
            <p className="page-description">
              Pitch your startup to the Learn to Start community.
            </p>
            <Row>
              <div
                className="col-12"
                style={{ visibility: showSpotlight ? 'visible' : 'hidden' }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '650px'
                  }}
                >
                  <iframe
                    src="https://stream.joinstartuplive.com/view/48dc5f73-924a-4b32-8457-1dcca27734e6/?embedded=True"
                    scrolling="no"
                    width="100%"
                    // height='380px'
                    height={width < 700 ? (width + 75) / 2.15 : 380}
                    className="spl-offline-image-preview"
                    style={{
                      border: '1px solid #BBBDBF'
                    }}
                  ></iframe>
                  <div className="row pitch-apply">
                    <div className="col-12 col-md-7 my-2 d-flex">
                      <p className="my-auto">
                        NEXT PITCH IS
                        <Countdown date={firstEventTime} renderer={renderer} />
                      </p>
                    </div>
                    <div className="col-12 col-md-5 my-2">
                      <button
                        className="d-block float-start float-md-end"
                        onClick={(e) => {
                          setPitchApplyModal(true)
                          e.preventDefault()
                        }}
                      >
                        APPLICATIONS OPEN JAN 2023
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Row>
            <Row>
              <div>
                <div className="guidance-videos-top mt-5 guidance-encouragement-page-titles ">
                  <h3>SPOTLIGHT® Archive</h3>
                  {/* <Link className='guidance-link' to={`/startup-live/videos`}>
                    <IntMessages id='general.view_all' />
                  </Link> */}
                </div>
                <div className="card-group desktop-menu startuplive-archive-videos card-group-beyond-your-course w-100 justify-content-start flex-column flex-sm-row">
                  {[0, 0].map((item, index) => (
                    <div
                      className="card-group mt-4 all-videos-beyond-your-course-videos col-12 col-sm-5 col-md-4 me-4"
                      key={index}
                    >
                      <div
                        className="card mobile-card"
                        // style={{ paddingRight: '20px' }}
                      >
                        <Link to={'#'}>
                          <div className="beyond-your-course-video-thumb beyound-all-videos-thumb">
                            <div
                              style={{
                                position: 'absolute',
                                right: '10px',
                                top: '10px'
                              }}
                            ></div>
                            <div>
                              <img
                                src={SpotlightImg}
                                // style={{ height: '200px' }}
                                width="100%"
                                // height=''
                              />
                              <div className="beyond-your-course-video-thumb-icon">
                                {/* <FontAwesomeIcon icon={faPlay} /> */}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Row>
          </div>
        </div>
        <div className="col-12 col-xl-3 px-3">
          <div className="msg-widget-startup-live d-none">
            {/* <ShowMessenger /> */}
            {/* <Chat room={'spotlight-room'} /> */}
            {/* <NotesButton /> */}

            {/* <div className={'community-connect my-2'}>
              <Link to='/my-connections'>
                <FontAwesomeIcon
                  icon={faUsers}
                  style={{
                    color: '#01C5D1',
                    background: 'white',
                    borderRadius: '50%',
                    height: '25px',
                    width: '36px',
                    opacity: '1'
                  }}
                />
              </Link>
              <Link to='/my-connections'>
                <p className='my-auto ms-2'>Connect with my community</p>
              </Link>
            </div> */}
          </div>
        </div>
      </Row>
      <ApplyForPitch
        show={PitchApplyModal}
        onHide={() => setPitchApplyModal(false)}
      />
    </Container>
  )
}

export default StartupLive
