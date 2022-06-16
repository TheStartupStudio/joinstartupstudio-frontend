import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../utils/AxiosInstance'
import IntMessages from '../../utils/IntlMessages'
import { useDispatch } from 'react-redux'
import { changeSidebarState } from '../../redux'
import Video from '../../components/Video'
import SavedVideosWidget from '../../components/Video/savedVideosWidget'
import { VideoModal } from '../../components/Modals/videoModal'
import { NotesButton } from '../../components/Notes'

export default function BeyondYourCourse() {
  const dispatch = useDispatch()
  const [encouragementVideos, setEncouragementVideos] = useState([])
  const [masterClassVideos, setMasterClassVideos] = useState([])
  const [startupLiveVideos, setStartupLiveVideos] = useState([])
  const [startVideoIndex, setStartVideoIndex] = useState(0)
  const [endVideoIndex, setEndVideoIndex] = useState(4)
  const [endVideoIndexMobile, setEndVideoIndexMobile] = useState(2)
  const [startMasterClassVideoIndex, setStartMasterClassVideoIndex] =
    useState(0)
  const [endMasterClassVideoIndex, setEndMasterClassVideoIndex] = useState(4)
  const [endMasterClassVideoIndexMobile, setEndMasterClassVideoIndexMobile] =
    useState(1)
  const [connections, setConnections] = useState([])
  const videoId = useParams().id
  const [videoData, setVideoData] = useState(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [savedVideos, setSavedVideos] = useState([])
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    dispatch(changeSidebarState(false))

    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
    })
  })

  useEffect(() => {
    if (width < 580) {
      setEndVideoIndexMobile(1)
    } else {
      setEndVideoIndexMobile(2)
    }
  }, [width])

  const getSavedVideos = async () => {
    await axiosInstance
      .get(`/favorites`)
      .then((response) => setSavedVideos(response.data))
      .catch((e) => e)
  }

  const updateFavorite = async (id, type, value, isSharedVideo) => {
    let foundVideo = {}

    if (isSharedVideo && videoData) {
      setVideoData((prevState) => ({
        ...prevState,
        favorite: !videoData.favorite
      }))
    }

    if (type === 'guidance') {
      setEncouragementVideos(
        encouragementVideos.map((video) => {
          if (video.id === id) {
            video.favorite = !video.favorite
            foundVideo = video
          }
          return video
        })
      )
    }

    if (type === 'master') {
      setMasterClassVideos(
        masterClassVideos.map((video) => {
          if (video.id === id) {
            video.favorite = !video.favorite
            foundVideo = video
          }
          return video
        })
      )
    }

    if (value) {
      setSavedVideos((oldVideos) => [foundVideo, ...oldVideos])
      await axiosInstance
        .post(`/favorites`, { contentId: id })
        .then((response) => response)
        .catch(
          (err) => err
          // setVideoData({ ...videoData, favorite: oldFavoriteValue })
        )
    } else {
      setSavedVideos(savedVideos.filter((video) => video.id !== id))
      await axiosInstance
        .delete(`/favorites/${id}`)
        .then(() => {})
        .catch(
          (err) => err
          // setVideoData({ ...videoData, favorite: oldFavoriteValue })
        )
    }
  }

  const removeSavedVideo = async (id, type) => {
    setSavedVideos(savedVideos.filter((video) => video.id !== id))

    if (type === 'guidance') {
      setEncouragementVideos(
        encouragementVideos.map((video) => {
          if (video.id === id) video.favorite = false
          return video
        })
      )
    }

    if (type === 'master') {
      setMasterClassVideos(
        masterClassVideos.map((video) => {
          if (video.id === id) video.favorite = false
          return video
        })
      )
    }

    await axiosInstance
      .delete(`/favorites/${id}`)
      .then(() => {})
      .catch((err) => err)
  }

  useEffect(() => {
    getEncouragementVideos()
    getMasterClassVideos()
    getUserConnections()
    getSavedVideos()
    if (!isNaN(videoId)) getVideoData()
  }, [])

  useEffect(() => {
    videoData && setShowVideoModal(true)
  }, [videoData])

  const getVideoData = async () => {
    await axiosInstance
      .get(`/contents/${videoId}`)
      .then((response) => {
        if (
          response.data &&
          (response.data.type === 'master' || response.data.type === 'guidance')
        )
          setVideoData(response.data)
      })
      .catch((err) => err)
  }

  const getUserConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      setConnections(res.data.data)
    })
  }

  const getEncouragementVideos = async () => {
    await axiosInstance
      .get(`/contents/user-contents/guidance`)
      .then((response) => {
        setEncouragementVideos(response.data)
      })
      .catch((err) => err)
  }

  const getMasterClassVideos = async () => {
    await axiosInstance
      .get(`/contents/user-contents/master`)
      .then((response) => {
        setMasterClassVideos(response.data)
      })
      .catch((err) => err)
  }

  const handlePreviousVideo = async (page, startIndex, endIndex) => {
    if (startIndex > 0) {
      if (page == 1) {
        setStartVideoIndex(startIndex - 1)
        setEndVideoIndex(endIndex - 1)
      } else if (page == 2) {
        setStartMasterClassVideoIndex(startIndex - 1)
        setEndMasterClassVideoIndex(endIndex - 1)
      }
    }
  }

  const handleNextVideo = async (page, startIndex, endIndex) => {
    if (page == 1) {
      if (endIndex < encouragementVideos.length) {
        setStartVideoIndex(startIndex + 1)
        setEndVideoIndex(endIndex + 1)
      }
    } else if (page == 2) {
      if (endIndex < masterClassVideos.length) {
        setStartMasterClassVideoIndex(startIndex + 1)
        setEndMasterClassVideoIndex(endIndex + 1)
      }
    }
  }

  const handleNextVideoMobile = async (page, startIndex, endIndexMobile) => {
    if (page == 1) {
      if (endIndexMobile < encouragementVideos.length) {
        setStartVideoIndex(startIndex + 1)
        setEndVideoIndexMobile(endIndexMobile + 1)
      }
    } else if (page == 2) {
      if (endIndexMobile < masterClassVideos.length) {
        setStartMasterClassVideoIndex(startIndex + 1)
        setEndMasterClassVideoIndexMobile(endIndexMobile + 1)
      }
    }
  }

  const handlePreviousVideoMobile = async (
    page,
    startIndex,
    endIndexMobile
  ) => {
    if (startIndex > 0) {
      if (page == 1) {
        setStartVideoIndex(startIndex - 1)
        setEndVideoIndexMobile(endIndexMobile - 1)
      } else if (page == 2) {
        setStartMasterClassVideoIndex(startIndex - 1)
        setEndMasterClassVideoIndexMobile(endIndexMobile - 1)
      }
    }
  }

  return (
    <>
      <div id='main-body'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='col-12 col-xl-9 pe-0 me-0'>
              <div className='account-page-padding page-border'>
                <h3 className='page-title'>
                  <IntMessages id='beyond_your_course.master_classes_upper' />
                </h3>
                <p className='page-description' style={{ fontWeight: '500' }}>
                  <IntMessages id='beyond_your_course.page_description' />
                </p>
                <div className='guidance-videos-top mt-5 mb-3 guidance-encouragement-page-titles'>
                  <h3>
                    <IntMessages id='beyond_your_course.encouragement_no_videos' />
                  </h3>
                  <Link className='guidance-link' to={`/encouragement/videos`}>
                    <IntMessages id='general.view_all' />
                  </Link>
                </div>

                <div className='beyond-videos-desktop'>
                  <div className='arrow-icon-1'>
                    <button
                      className={`videos-track ${
                        window.location.pathname.includes(
                          '/beyond-your-course'
                        ) && 'slider-arrow-first'
                      }`}
                      onClick={() => {
                        handlePreviousVideo(1, startVideoIndex, endVideoIndex)
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
                  <div
                    className='card-group desktop-menu card-group-beyond-your-course w-100'
                    // style={{ marginTop: '15px' }}
                  >
                    {encouragementVideos
                      ?.slice(startVideoIndex, endVideoIndex)
                      .map((video, index) => (
                        <Video
                          id={video.id}
                          key={index}
                          thumbnail={video.thumbnail}
                          title={video.title}
                          description={video.description}
                          page={'encouragement'}
                          isMainPage={true}
                          updateFavorite={(id, type, value) =>
                            updateFavorite(id, type, value)
                          }
                          videoData={video}
                          connections={connections}
                        />
                      ))}
                  </div>
                  <div className='arrow-icon-1 justify-content-start'>
                    <button
                      className={`videos-track ${
                        window.location.pathname.includes(
                          '/beyond-your-course'
                        ) && 'slider-arrow-second'
                      }`}
                      style={{ width: '2%' }}
                      onClick={() => {
                        handleNextVideo(1, startVideoIndex, endVideoIndex)
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
                            1,
                            startVideoIndex,
                            endVideoIndexMobile
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
                      {encouragementVideos
                        ?.slice(startVideoIndex, endVideoIndexMobile)
                        .map((video, index) => (
                          <Video
                            id={video.id}
                            key={index}
                            thumbnail={video.thumbnail}
                            title={video.title}
                            description={video.description}
                            page={'encouragement'}
                            isMainPage={true}
                            updateFavorite={(id, type, value) =>
                              updateFavorite(id, type, value)
                            }
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
                            1,
                            startVideoIndex,
                            endVideoIndexMobile
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
                <div className='guidance-videos-top mt-5 mb-3 guidance-encouragement-page-titles'>
                  <h3>
                    <IntMessages id='beyond_your_course.Career_Guidance' />
                  </h3>
                  <Link className='guidance-link' to={`/master-classes/videos`}>
                    <IntMessages id='general.view_all' />
                  </Link>
                </div>

                <div className='beyond-videos-desktop'>
                  <div className='arrow-icon-1'>
                    <button
                      className='videos-track'
                      onClick={() => {
                        handlePreviousVideo(
                          2,
                          startMasterClassVideoIndex,
                          endMasterClassVideoIndex
                        )
                      }}
                      // style={{ width: '2%' }}
                    >
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className='videos-track-icon'
                        // style={{ marginRight: '20px' }}
                      />
                    </button>
                  </div>
                  <div
                    className='card-group desktop-menu card-group-beyond-your-course w-100'
                    // style={{ marginTop: '15px' }}
                  >
                    {masterClassVideos
                      ?.slice(
                        startMasterClassVideoIndex,
                        endMasterClassVideoIndex
                      )
                      .map((video, index) => (
                        <Video
                          id={video.id}
                          key={index}
                          thumbnail={video.thumbnail}
                          title={video.title}
                          description={video.description}
                          page={'master-classes'}
                          isMainPage={true}
                          updateFavorite={(id, type, value) =>
                            updateFavorite(id, type, value)
                          }
                          videoData={video}
                          connections={connections}
                        />
                      ))}
                  </div>
                  <div className='arrow-icon-1 justify-content-start'>
                    <button
                      className='videos-track'
                      style={{ width: '2%' }}
                      onClick={() =>
                        handleNextVideo(
                          2,
                          startMasterClassVideoIndex,
                          endMasterClassVideoIndex
                        )
                      }
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
                            2,
                            startMasterClassVideoIndex,
                            endMasterClassVideoIndexMobile
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
                      {masterClassVideos
                        ?.slice(
                          startMasterClassVideoIndex,
                          endMasterClassVideoIndexMobile
                        )
                        .map((video, index) => (
                          <Video
                            id={video.id}
                            key={index}
                            thumbnail={video.thumbnail}
                            title={video.title}
                            description={video.description}
                            page={'master-classes'}
                            isMainPage={true}
                            updateFavorite={(id, type, value) =>
                              updateFavorite(id, type, value)
                            }
                            videoData={video}
                            connections={connections}
                          />
                        ))}
                    </div>
                    <div className='arrow-icon-1 justify-content-start'>
                      <button
                        className='videos-track'
                        onClick={() =>
                          handleNextVideoMobile(
                            2,
                            startMasterClassVideoIndex,
                            endMasterClassVideoIndexMobile
                          )
                        }
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
            </div>
            <div className='col-12 col-xl-3 px-0'>
              <hr
                className='d-block d-xl-none mx-auto mt-1 mt-2 mb-3'
                style={{ color: '#333D3D83' }}
              />
              <div
                className='account-page-padding'
                style={{ paddingLeft: '20px' }}
              >
                <SavedVideosWidget
                  connections={connections}
                  savedVideos={savedVideos}
                  removeSavedVideo={(id, type) => removeSavedVideo(id, type)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {videoData && (
        <VideoModal
          show={showVideoModal}
          onHide={() => setShowVideoModal(false)}
          videoData={videoData}
          connections={connections}
          updateFavorite={(id, type, value) =>
            updateFavorite(id, type, value, true)
          }
          isMainPage={true}
        />
      )}
    </>
  )
}
