import React, { useEffect, useState, useRef } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import Select, { components } from 'react-select'
import { Link } from 'react-router-dom'
import CountdownTimer from 'react-component-countdown-timer'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import IntMessages from '../../utils/IntlMessages'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { changeSidebarState } from '../../redux'
import Video from '../../components/Video'
import Calendar from '../../components/Calendar'
import NoteAndChat from '../../components/NoteAndChat/noteAndChat'
import StartupLiveEn from '../../assets/images/startup-live-logo-new.png'
import StartupLiveEs from '../../assets/images/startup-live-es.jpg'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { ShowMessenger } from '../../utils/helpers'
import { NotesButton } from '../../components/Notes'
import Chat from '../../components/NoteAndChat/chat'
import Countdown from 'react-countdown'

function StartupLive() {
  const firstEventTime = new Date('2022-08-30T16:30:00').getTime()
  const [showButton, setShowButton] = useState(false)
  const [startStartupLiveVideoIndex, setStartStartupLiveVideoIndex] =
    useState(0)
  const [endStartupLiveVideoIndex, setEndStartupLiveVideoIndex] = useState(3)
  const [endStartupLiveVideoIndexMobile, setEndStartupLiveVideoIndexMobile] =
    useState(1)
  const [startupLiveVideos, setStartupLiveVideos] = useState([])
  const currentLanguage = useSelector((state) => state.lang.locale)
  const dispatch = useDispatch()
  const [showStartuplive, setShowstartuplive] = useState(false)
  const [state, setState] = useState({})
  const [connections, setConnections] = useState([])
  const [width, setWidth] = useState(window.innerWidth)
  const [allowedStartupLiveOptions, setAllowedStartupLiveOptions] = useState([])
  const [selectedStartupLive, setSelectedStartupLive] = useState()
  const AllStartupLiveOptions = [
    {
      label: 'Instructor Training',
      value: {
        id: 'instructors',
        room: 'startup-live-instructors',
        src_link:
          'https://stream.joinstartuplive.com/view/69fd2f33-c13c-48a6-90b6-52dac364d53c/?embedded=True'
      }
    },
    {
      label: 'Live Events for Elementary School',
      value: {
        id: 'L1',
        room: 'startup-live-l1',
        src_link:
          'https://stream.joinstartuplive.com/view/6ced9dec-0baf-4977-ae13-114cd6a7bf8e/?embedded=True'
      }
    },
    {
      label: 'Live Events for Middle School',
      value: {
        id: 'L2',
        room: 'startup-live-l2',
        src_link:
          'https://stream.joinstartuplive.com/view/6abf6fa6-4f1c-4a02-a772-145a711fa2d9/?embedded=True'
      }
    },
    {
      label: 'Live Events for HS & EDU',
      value: {
        id: 'L3',
        room: 'startup-live-l3',
        src_link:
          'https://stream.joinstartuplive.com/view/149ff6e6-1771-41f2-898a-fdcf7d35de6e/?embedded=True'
      }
    },
    {
      label: 'Live Events for Adult Participants',
      value: {
        id: 'L4',
        room: 'startup-live-l4',
        src_link:
          'https://stream.joinstartuplive.com/view/7f97514c-0324-4467-bacf-452920edcf3c/?embedded=True'
      }
    }
  ]

  useEffect(() => {
    setSelectedStartupLive(AllStartupLiveOptions[0])

    getUserLevels()
    getStartupLiveVideos()
    getUserConnections()

    setTimeout(() => {
      setShowstartuplive(true)
    }, 3000)

    return () => {
      setState({})
    }
  }, [])

  const resize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  const getUserConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      setConnections(res.data.data)
    })
  }

  const getUserLevels = async () => {
    await axiosInstance.get('/instructor/student-levels').then((res) => {
      setAllowedStartupLiveOptions([
        AllStartupLiveOptions[0],
        ...AllStartupLiveOptions.filter((level) =>
          res.data.levels.includes(level.value.id)
        )
      ])
    })
  }

  const dropDownStyles = {
    control: (provided, state) => ({
      ...provided,
      boxShadow: 'none',
      border: '1px solid #BBBDBF',
      borderRadius: '0',
      height: 15,
      fontSize: '16px',
      cursor: 'pointer',
      color: '#707070',
      fontWeight: '500',
      ':hover': {
        border: '1px solid #BBBDBF'
      },
      zIndex: 100
    }),
    menu: (base) => ({
      ...base,
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      margin: 0,
      paddingTop: 0,
      boxShadow: '0px 3px 6px #00000029',
      zIndex: 9999
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    valueContainer: (base) => ({
      ...base
    }),
    option: (styles, state) => ({
      ...styles,
      cursor: 'pointer',
      fontWeight: 600,
      color: '231F20',
      fontSize: '14px',
      paddingTop: '2px',
      paddingBottom: '2px',
      ':hover': {
        backgroundColor: 'white',
        background: 'white'
      },
      backgroundColor: 'white'
      // textTransform: 'uppercase'
    })
  }

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
          {'IN ' + days + ' DAYS ' + hours + ' HOURS ' + minutes + ' MINUTES '}
          {minutes === 0 ? seconds + ' SECONDS' : ''}
        </span>
      )
    }
  }

  return (
    <Container fluid>
      <Row>
        <div className='col-12 col-xl-9 pe-0'>
          <div
            className='account-page-padding page-border'
            style={{ minHeight: '100vh' }}
          >
            <h3 className='page-title'>
              <IntlMessages id='navigation.startup_live' />
            </h3>
            <p className='page-description'>
              <IntlMessages id='startup_live.page_description' />
            </p>
            <div className='row mb-2'>
              <div className='col-12 col-lg-4 col-md-6'>
                <p className='page-description m-0 p-0'>Select Startup Live</p>
                <Select
                  options={allowedStartupLiveOptions}
                  value={selectedStartupLive}
                  onChange={setSelectedStartupLive}
                  placeholder={'Select Startup Live'}
                  className='mb-0 me-0 custom-dropdown'
                  styles={dropDownStyles}
                  autoFocus={false}
                  isSearchable={false}
                />
              </div>
            </div>
            <Row>
              {selectedStartupLive && (
                <div
                  className='col-12'
                  style={{ visibility: showStartuplive ? 'visible' : 'hidden' }}
                >
                  <iframe
                    src={selectedStartupLive.value.src_link}
                    width={'100%'}
                    height={width < 700 ? (width + 75) / 2.15 : 380}
                    style={{
                      border: '1px solid #BBBDBF'
                    }}
                    scrolling='no'
                    className='sl-offline-image-preview'
                    title='startup live'
                  ></iframe>
                </div>
              )}

              <div className='spotlight-container'>
                <div className='row pitch-apply'>
                  <div className='col-12 my-2 d-flex'>
                    <p className='my-auto'>
                      STARTING{' '}
                      <Countdown date={firstEventTime} renderer={renderer} />
                    </p>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                  <h4
                    style={{ fontSize: '21px', letterSpacing: '0.84px' }}
                    className='m-0'
                  >
                    Welcome to StartupLive
                  </h4>
                  <p
                    style={{
                      fontSize: '14px',
                      letterSpacing: '0.56px',
                      fontWeight: '300'
                    }}
                  >
                    With Anastasia Hall, Gary Conroy, and the Global Ambassadors
                  </p>
                </div>
              </div>
            </Row>
            <Row>
              <div>
                <div className='guidance-videos-top mt-5 guidance-encouragement-page-titles '>
                  <h3>
                    <IntMessages id='startup_live.startup_archive' />
                  </h3>
                </div>
                <div className='card-group desktop-menu startuplive-archive-videos card-group-beyond-your-course w-100 justify-content-start flex-column flex-sm-row'>
                  {[0, 0].map((item, index) => (
                    <div
                      className='card-group mt-4 all-videos-beyond-your-course-videos col-12 col-sm-5 col-md-4 me-4'
                      key={index}
                    >
                      <div
                        className='card mobile-card'
                        // style={{ paddingRight: '20px' }}
                      >
                        <Link to={'#'}>
                          <div className='beyond-your-course-video-thumb beyound-all-videos-thumb'>
                            <div
                              style={{
                                position: 'absolute',
                                right: '10px',
                                top: '10px'
                              }}
                            ></div>
                            <div>
                              <img
                                src={StartupLiveEn}
                                // style={{ height: '200px' }}
                                width='100%'
                                // height=''
                              />
                              <div className='beyond-your-course-video-thumb-icon'>
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
            {startupLiveVideos.length > 0 && (
              <div>
                <div className='guidance-videos-top mt-5 guidance-encouragement-page-titles '>
                  <h3>
                    <IntMessages id='startup_live.startup_archive' />
                  </h3>
                  <Link className='guidance-link' to={`/startup-live/videos`}>
                    <IntMessages id='general.view_all' />
                  </Link>
                </div>
                <div className='beyond-videos-desktop'>
                  <div className='arrow-icon-1'>
                    <button
                      className={`videos-track`}
                      onClick={() => {
                        handlePreviousVideo(
                          3,
                          startStartupLiveVideoIndex,
                          endStartupLiveVideoIndex
                        )
                      }}
                      style={
                        {
                          // width: '2%'
                        }
                      }
                    >
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className='videos-track-icon'
                        // style={{ marginRight: '20px' }}
                      />
                    </button>
                  </div>
                  <div className='card-group desktop-menu startuplive-archive-videos card-group-beyond-your-course w-100'>
                    {startupLiveVideos
                      ?.slice(
                        startStartupLiveVideoIndex,
                        endStartupLiveVideoIndex
                      )
                      .map((video, index) => (
                        <Video
                          id={video.id}
                          key={index}
                          thumbnail={
                            currentLanguage === 'en'
                              ? StartupLiveEn
                              : StartupLiveEs
                          }
                          title={video.title}
                          description={video.description}
                          page={'startup-live'}
                          videoData={video}
                          connections={connections}
                        />
                      ))}
                  </div>
                  <div className='arrow-icon-1 justify-content-start'>
                    <button
                      className={`videos-track`}
                      style={{ width: '2%' }}
                      onClick={() => {
                        handleNextVideo(
                          3,
                          startStartupLiveVideoIndex,
                          endStartupLiveVideoIndex
                        )
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className='videos-track-icon'
                      />
                    </button>
                  </div>
                </div>
                <div className='row mt-2'>
                  <div className='beyond-videos-mobile mc-videos-mobile'>
                    <div className='arrow-icon-1'>
                      <button
                        className='videos-track'
                        onClick={() => {
                          handlePreviousVideoMobile(
                            3,
                            startStartupLiveVideoIndex,
                            endStartupLiveVideoIndexMobile
                          )
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faChevronLeft}
                          className='videos-track-icon'
                        />
                      </button>
                    </div>
                    <div className='card-group mobile-menu card-group-beyond-your-course px-3 card-mobile-menu'>
                      {startupLiveVideos
                        ?.slice(
                          startStartupLiveVideoIndex,
                          endStartupLiveVideoIndexMobile
                        )
                        .map((video, index) => (
                          <Video
                            id={video.id}
                            key={index}
                            thumbnail={
                              currentLanguage === 'en'
                                ? StartupLiveEn
                                : StartupLiveEs
                            }
                            title={video.title}
                            description={video.description}
                            page={'startup-live'}
                            videoData={video}
                            connections={connections}
                          />
                        ))}
                    </div>
                    <div className='arrow-icon-1 justify-content-start'>
                      <button
                        className='videos-track'
                        onClick={() => {
                          handleNextVideoMobile(
                            3,
                            startStartupLiveVideoIndex,
                            endStartupLiveVideoIndexMobile
                          )
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className='videos-track-icon'
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='col-12 col-xl-3 px-3'>
          <div className='msg-widget-startup-live d-none'>
            {/* {selectedStartupLive && (
              <Chat room={selectedStartupLive.value.room} />
            )} */}
            <NotesButton />

            <div className={'community-connect my-2'}>
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
            </div>
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default StartupLive
