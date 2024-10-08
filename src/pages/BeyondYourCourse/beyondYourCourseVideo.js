import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { useParams, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { changeSidebarState } from '../../redux'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import StartupLiveEn from '../../assets/images/startup-live-en.jpg'
import StartupLiveEs from '../../assets/images/startup-live-es.jpg'
import Video from '../../components/Video'
import { ShowMessenger } from '../../utils/helpers'

export default function BeyondYourCourseVideo(props) {
  const id = useParams().id
  const [pageTitle, setPageTitle] = useState('')
  const [pageDescription, setPageDescription] = useState('')
  const [beyondYourCourseVideos, setBeyondYourCourseVideos] = useState([])
  const [videoData, setVideoData] = useState('')
  const currentLanguage = useSelector((state) => state.lang.locale)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(4)
  const [width, setWidth] = useState(null)
  const actualpage = window.location.href.includes('encouragement')
    ? 'encouragement'
    : window.location.href.includes('master-classes')
    ? 'master-classes'
    : 'startup-live'

  const dispatch = useDispatch()
  const [connections, setConnections] = useState([])

  useEffect(() => {
    const myWidth = window.innerWidth
    setWidth(myWidth)
    getUserConnections()
  }, [])

  const getUserConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      setConnections(res.data.data)
    })
  }

  const resize = () => {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    dispatch(changeSidebarState(false))
    if (window.location.href.includes('encouragement')) {
      setPageTitle('beyond_your_course.encouragement')
      setPageDescription('beyond_your_course.encouragement_description')
      getBeyondYourCourseVideos('guidance')
    } else if (window.location.href.includes('master-classes')) {
      setPageTitle('beyond_your_course.master_classes')
      setPageDescription('beyond_your_course.master_classes_description')
      getBeyondYourCourseVideos('master')
    } else if (window.location.href.includes('startup-live')) {
      setPageTitle('startup_live.startup_archive')
      setPageDescription('startup_live.startup_archive_description')
      getBeyondYourCourseVideos('startup-live')
    }
    getVideo()
  }, [id, pageTitle])

  const getVideo = async () => {
    await axiosInstance
      .get(`/contents/${id}`)
      .then((response) => {
        setVideoData(response.data)
      })
      .catch((err) => err)
  }

  const getBeyondYourCourseVideos = async (page) => {
    await axiosInstance
      .get(`/contents/by-type/${page}`)
      .then((response) => {
        setBeyondYourCourseVideos(response.data)
      })
      .catch((err) => err)
  }
  useEffect(() => {
    if (width > 1317) {
      setEndIndex(4)
    } else if (width > 750 && width < 1316.9) {
      setEndIndex(3)
    } else if (width > 585 && width < 750) {
      setEndIndex(2)
    } else {
      setEndIndex(1)
    }
  }, [width])

  const handlePreviousVideo = async (page, startIndex, endIndex) => {
    if (startIndex > 0) {
      if (startIndex > 0) {
        setStartIndex(startIndex - 1)
        setEndIndex(endIndex - 1)
      }
    }
  }

  const handleNextVideo = async (page, startIndex, endIndex) => {
    if (endIndex < beyondYourCourseVideos.length) {
      setStartIndex(startIndex + 1)
      setEndIndex(endIndex + 1)
    }
  }

  return (
    <div id='main-body'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-lg-12 col-xl-8 px-0'>
            <div className='beyond-your-course-main'>
              <h3 className='page-title'>
                {pageTitle && <IntlMessages id={`${pageTitle}`} />}
              </h3>
              <p className='page-description'>
                {pageDescription && <IntlMessages id={`${pageDescription}`} />}
              </p>
              {!window.location.href.includes('startup-live') ? (
                <div>
                  {videoData !== '' ? (
                    <React.Fragment>
                      <div className='player-wrapper'>
                        <ReactPlayer
                          className='react-player'
                          url={videoData.url}
                          controls={true}
                          width='100%'
                          height='100%'
                          config={{
                            file: { attributes: { controlsList: 'nodownload' } }
                          }}
                          playing={true}
                        />
                      </div>
                      <div className='mt-4 mb-5'>
                        <div className='beyond-your-course-video'>
                          <h5 style={{ textTransform: 'uppercase' }}>
                            <IntlMessages id='video.now_playing' />
                          </h5>
                          <h5
                            className='beyond-your-course-video-title'
                            style={{ letterSpacing: '0.8px' }}
                          >
                            <IntlMessages id={videoData.title} />
                          </h5>
                        </div>
                        <p className='card-text'>
                          <IntlMessages id={videoData.description} />
                        </p>
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
              ) : (
                <div>
                  {videoData !== '' ? (
                    <>
                      <iframe
                        src={`${videoData.url}`}
                        height='500px'
                        width='100%'
                        style={{ border: 'none' }}
                        allow='autoplay'
                      ></iframe>
                      <div className='mt-2'>
                        <div className='beyond-your-course-video'>
                          <h5 style={{ textTransform: 'uppercase' }}>
                            <IntlMessages id='video.now_playing' />
                          </h5>
                          <h5
                            className='beyond-your-course-video-title'
                            style={{ letterSpacing: '0.8px' }}
                          >
                            <IntlMessages id={videoData.title} />
                          </h5>
                        </div>
                        <p className='card-text'>
                          <IntlMessages id={videoData.description} />
                        </p>
                      </div>
                    </>
                  ) : null}
                </div>
              )}
              <div className='beyond-videos-desktop mt-2'>
                <div className='arrow-icon-1'>
                  <button
                    className='videos-track'
                    onClick={() => {
                      handlePreviousVideo(1, startIndex, endIndex)
                    }}
                    style={{ width: '2%' }}
                  >
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className='videos-track-icon'
                      style={{ marginRight: '20px' }}
                    />
                  </button>
                </div>
                <div
                  className='card-group desktop-menu card-group-beyond-your-course'
                  // style={{ marginTop: '15px' }}
                >
                  {beyondYourCourseVideos
                    ?.slice(startIndex, endIndex)
                    .map((video, index) => (
                      <Video
                        id={video.id}
                        key={index}
                        thumbnail={video.thumbnail}
                        title={video.title}
                        description={video.description}
                        page={actualpage}
                        videoData={video}
                        connections={connections}
                      />
                    ))}
                </div>
                <div className='arrow-icon-1 justify-content-start'>
                  <button
                    className='videos-track'
                    style={{ width: '2%' }}
                    onClick={() => handleNextVideo(1, startIndex, endIndex)}
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className='videos-track-icon'
                    />
                  </button>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='beyond-videos-mobile'>
                  <div className='arrow-icon-1'>
                    <button
                      className='videos-track'
                      onClick={() => {
                        handlePreviousVideo(1, startIndex, endIndex)
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className='videos-track-icon'
                      />
                    </button>
                  </div>
                  <div className='card-group mobile-menu card-group-beyond-your-course px-3 card-mobile-menu'>
                    {beyondYourCourseVideos
                      ?.slice(startIndex, endIndex)
                      .map((video, index) => (
                        <Video
                          id={video.id}
                          key={index}
                          thumbnail={video.thumbnail}
                          title={video.title}
                          description={video.description}
                          page={actualpage}
                          videoData={video}
                          connections={connections}
                        />
                      ))}
                  </div>
                  <div className='arrow-icon-1 justify-content-start'>
                    <button
                      className='videos-track'
                      onClick={() => handleNextVideo(1, startIndex, endIndex)}
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className='videos-track-icon'
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* </div> */}
            </div>
          </div>
          <div className='col-lg-12 col-xl-4 px-0'>
            <div className='my-page-right'>
              <ShowMessenger />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
