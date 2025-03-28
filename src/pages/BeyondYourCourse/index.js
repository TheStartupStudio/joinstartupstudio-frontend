import React, { useState, useEffect, useCallback } from 'react'
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
import './index.css'
import masterIcon from '../../assets/images/master-icon.png'
import storyInMotion from '../../assets/images/story-in-motion-logo.png'
import Select from 'react-select'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import Waveform from '../StoryInMotion/waveform'
import { Modal } from 'react-bootstrap'
import storyInMotionPodcast from '../../assets/images/story-in-motion-podcast.png';
import { useLocation } from 'react-router-dom';
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'


export default function BeyondYourCourse() {
  const dispatch = useDispatch()
  const [encouragementVideos, setEncouragementVideos] = useState([])
  const [masterClassVideos, setMasterClassVideos] = useState([])
  const [startupLiveVideos,setStartupLiveVideos]=useState([])
  const [startVideoIndex, setStartVideoIndex] = useState(0)
  const [endVideoIndex, setEndVideoIndex] = useState(5)
  const [endVideoIndexMobile, setEndVideoIndexMobile] = useState(2)
  const [startMasterClassVideoIndex, setStartMasterClassVideoIndex] =
    useState(0)
  const [endMasterClassVideoIndex, setEndMasterClassVideoIndex] = useState(5)
  const [endMasterClassVideoIndexMobile, setEndMasterClassVideoIndexMobile] =
    useState(1)
  const [connections, setConnections] = useState([])
  const videoId = useParams().id
  const [videoData, setVideoData] = useState(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [savedVideos, setSavedVideos] = useState([])
  const [width, setWidth] = useState(window.innerWidth)
   const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [startStartupLiveVideosIndex, setStartStartupLiveVideosIndex] = useState(0);
  const [endStartupLiveVideosIndex, setEndStartupLiveVideosIndex] = useState(5);
  const [showAudioModal, setShowAudioModal] = useState(false)
  const [selectedAudio, setSelectedAudio] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [podcastEpisodes, setPodcastEpisodes] = useState([]);
  const location = useLocation();
  const [isViewAll, setIsViewAll] = useState(false);

  const options = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' }
  ]

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption)
    console.log('Selected Language:', selectedOption.value)
  }

  useEffect(() => {
    dispatch(changeSidebarState(false))

    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
    })
  }, [dispatch])

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

    if (type === 'startup') {
      setStartupLiveVideos(
        startupLiveVideos.map((video) => {
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
    if (type === 'startup') {
      setStartupLiveVideos(
        startupLiveVideos.map((video) => {
          if (video.id === id) {
            video.favorite = !video.favorite
            foundVideo = video
          }
          return video
        })
      )
    }

    await axiosInstance
      .delete(`/favorites/${id}`)
      .then(() => {})
      .catch((err) => err)
  }

  const getVideoData = useCallback(async () => {
    await axiosInstance
      .get(`/contents/${videoId}`)
      .then((response) => {
        if (
          response.data &&
          (response.data.type === 'master' || response.data.type === 'guidance' || response.data.type === 'startup')
        )
          setVideoData(response.data)
      })
      .catch((err) => err)
  }, [videoId])

  useEffect(() => {
    getEncouragementVideos()
    getMasterClassVideos()
    getStartupLiveVideos()
    getUserConnections()
    getSavedVideos()
    if (!isNaN(videoId)) getVideoData()
  }, [videoId, getVideoData])

  useEffect(() => {
    videoData && setShowVideoModal(true)
  }, [videoData])

  useEffect(() => {
    const fetchPodcastEpisodes = async () => {
      try {
        const response = await axiosInstance.get('/podcast?page=0&size=5');
        setPodcastEpisodes(response.data.data);
      } catch (error) {
        console.error('Error fetching podcast episodes:', error);
      }
    };

    fetchPodcastEpisodes();
  }, []);

  useEffect(() => {
    // Check if the query parameter `view=podcasts` is present
    const params = new URLSearchParams(location.search);
    setIsViewAll(params.get('view') === 'podcasts');
  }, [location.search]);

  useEffect(() => {
    const fetchPodcastEpisodes = async () => {
      try {
        const endpoint = isViewAll
          ? '/podcast?page=0&size=100' // Fetch all episodes
          : '/podcast?page=0&size=5'; // Fetch only 5 episodes
        const response = await axiosInstance.get(endpoint);
        setPodcastEpisodes(response.data.data);
      } catch (error) {
        console.error('Error fetching podcast episodes:', error);
      }
    };

    fetchPodcastEpisodes();
  }, [isViewAll]);

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

  const getStartupLiveVideos = async () => {
    await axiosInstance
      .get(`/contents/user-contents/story-in-motion`) 
      .then((response) => {
        setStartupLiveVideos(response.data)
      })
      .catch((err) => err)
  }

  const handlePreviousVideo = async (page, startIndex, endIndex) => {
    if (startIndex > 0) {
      if (page === 1) {
        setStartVideoIndex(startIndex - 1)
        setEndVideoIndex(endIndex - 1)
      } else if (page === 2) {
        setStartMasterClassVideoIndex(startIndex - 1)
        setEndMasterClassVideoIndex(endIndex - 1)
      } else if (page === 3) {
        setStartStartupLiveVideosIndex(startIndex - 1)
        setEndStartupLiveVideosIndex(endIndex - 1)
      }
    }
  }

  const handleNextVideo = async (page, startIndex, endIndex) => {
    if (page === 1) {
      if (endIndex < encouragementVideos.length) {
        setStartVideoIndex(startIndex + 1)
        setEndVideoIndex(endIndex + 1)
      }
    } else if (page === 2) {
      if (endIndex < masterClassVideos.length) {
        setStartMasterClassVideoIndex(startIndex + 1)
        setEndMasterClassVideoIndex(endIndex + 1)
      }
    } else if (page === 3) {
      if (endIndex < startupLiveVideos.length) {
        setStartStartupLiveVideosIndex(startIndex + 1)
        setEndStartupLiveVideosIndex(endIndex + 1)
      }
    }
  }

  const handleNextVideoMobile = async (page, startIndex, endIndexMobile) => {
    if (page === 1) {
      if (endIndexMobile < encouragementVideos.length) {
        setStartVideoIndex(startIndex + 1)
        setEndVideoIndexMobile(endIndexMobile + 1)
      }
    } else if (page === 2) {
      if (endIndexMobile < masterClassVideos.length) {
        setStartMasterClassVideoIndex(startIndex + 1)
        setEndMasterClassVideoIndexMobile(endIndexMobile + 1)
      }
    }
    else if (page === 3) {
      if (endIndex < startupLiveVideos.length) {
        setStartStartupLiveVideosIndex(startIndex + 1)
        setEndStartupLiveVideosIndex(endIndex + 1)
      }}
  }

  const handlePreviousVideoMobile = async (
    page,
    startIndex,
    endIndexMobile
  ) => {
    if (startIndex > 0) {
      if (page === 1) {
        setStartVideoIndex(startIndex - 1)
        setEndVideoIndexMobile(endIndexMobile - 1)
      } else if (page === 2) {
        setStartMasterClassVideoIndex(startIndex - 1)
        setEndMasterClassVideoIndexMobile(endIndexMobile - 1)
      }
    }
  }

  const handleAudioClick = (podcast) => {
    setSelectedAudio(podcast); // Set the selected podcast
    setShowAudioModal(true); // Show the audio modal
  }

  return (
    <>
      <div id='main-body'>
        
          <div className='row'>
            
              <div>
              <div className='header-select-btn'>
              <div className='account-page-padding'>
                <h3 className='page-title' style={{marginLeft: '20px'}}>
                  <IntMessages id='beyond_your_course.master_classes_upper' />
                </h3>
                <p className='page-description' style={{ fontWeight: '500',marginLeft: '20px' }}>
                  <IntMessages id='beyond_your_course.page_description' />
                </p>
                </div>
                <div
                          style={{
                            display: 'inline-block',
                            borderRadius: '8px',
                            background:
                              'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                            padding: '1px', // Adjust this value to control border thickness
                            height: '58px',
                            boxShadow: '0px 4px 10px 0px #00000040',
                            marginRight:'20px',
                            marginTop:'-20px'
                          }}
                        >
                          <Select
                            options={options}
                            value={selectedLanguage}
                            onChange={handleChange}
                            placeholder='Select Language'
                            menuPortalTarget={document.body}
                            isSearchable={false}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              control: (base) => ({
                                ...base,
                                width: '250px', // Fixed width
                                minHeight: '40px', // Fixed height
                                overflow: 'hidden',
                                border: 'none', // Remove the default border
                                borderRadius: '6px' // Slightly smaller than the outer container radius
                              }),
                              singleValue: (base) => ({
                                ...base,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              })
                            }}
                            components={{
                              IndicatorSeparator: () => null // Remove separator
                            }}
                          />
              </div>
                </div>
                <div className='gradient-background-master'>
                <div className='videos-container'>
                <div className='guidance-videos-top mb-3 guidance-encouragement-page-titles'>
                  <div className='title-container'>
                   <img 
                                    src={masterIcon}
                                    alt='logo'
                                    style={{ width: '36px', height: '36px' }}
                                    className='welcome-journey-text__icon'
                                  />
                  <h3>
                    <IntMessages id='beyond_your_course.encouragement_no_videos' />
                  </h3>
                  </div>
                  <Link className='guidance-link' to={`/encouragement/videos`} style={{marginRight:'1rem'}}>
                    <IntMessages id='general.view_all' />
                    <img src={rightArrow} style={{marginLeft:'10px',marginBottom:'3px'}}/>
                  </Link>
                </div>

                <div className='beyond-videos-desktop'>
                  {/* <div className='arrow-icon-1'>
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
                  </div> */}
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
                  {/* <div className='arrow-icon-1 justify-content-start'>
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
                  </div> */}
                </div>
                </div>

                <div className='row mt-2'>
                  <div className='beyond-videos-mobile mc-videos-mobile'>
                    {/* <div className='arrow-icon-1'>
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
                    </div> */}
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
                    {/* <div className='arrow-icon-1 justify-content-start'>
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
                    </div> */}
                  </div>
                </div>
                <div className='videos-container'>
                <div className='guidance-videos-top mb-3 guidance-encouragement-page-titles'>
                <div className='title-container'>
                  <img 
                                    src={masterIcon}
                                    alt='logo'
                                    style={{ width: '36px', height: '36px' }}
                                    className='welcome-journey-text__icon'
                                  />
                  <h3>
                    
                    <IntMessages id='beyond_your_course.Career_Guidance' />
                  </h3>
                  </div>
                  <Link className='guidance-link' to={`/master-classes/videos`} style={{marginRight:'1rem'}}>
                    <IntMessages id='general.view_all' />
                    <img src={rightArrow} style={{marginLeft:'10px',marginBottom:'3px'}}/>
                  </Link>
                </div>

                <div className='beyond-videos-desktop'>
                  {/* <div className='arrow-icon-1'>
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
                  </div> */}
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
                  {/* <div className='arrow-icon-1 justify-content-start'>
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
                  </div> */}
                </div>
                </div>
                <div className="videos-container">
  <div className="guidance-videos-top mb-3 guidance-encouragement-page-titles">
    <div className="title-container">
      <img
        src={storyInMotion}
        alt="logo"
        style={{ width: '36px', height: '36px' }}
        className="welcome-journey-text__icon"
      />
      <h3>
        <IntMessages id="beyond_your_course.startup_live" />
      </h3>
    </div>
    <Link
      className="guidance-link"
      to="/story-in-motion/videos"
      style={{ marginRight: '1rem' }}
    >
      <IntMessages id="general.view_all" />
      <img
        src={rightArrow}
        style={{ marginLeft: '10px', marginBottom: '3px' }}
        alt="View All"
      />
    </Link>
  </div>

  <div className="beyond-videos-desktop">
    <div className="card-group desktop-menu card-group-beyond-your-course w-100">
      {/* Render only podcast episodes */}
      {podcastEpisodes.map((podcast, index) => (
        <div
          key={index}
          className="beyond-your-course-video-thumb"
          style={{ width: '200px', margin: '10px' }}
          onClick={() => handleAudioClick({ ...podcast, page: 'podcast' })}
        >
          <img
            src={podcast.thumbnail || storyInMotionPodcast}
            alt={podcast.title}
            style={{
              width: '100%',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '25px',
            }}
          />
          <h5 style={{ textAlign: 'center', marginTop: '10px' }}>
            {podcast.title}
          </h5>
        </div>
      ))}
    </div>
  </div>
</div>

                <div className='row mt-2'>
                  <div className='beyond-videos-mobile mc-videos-mobile'>
                    {/* <div className='arrow-icon-1'>
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
                    </div> */}
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
                    </div>
                    {/* <div className='arrow-icon-1 justify-content-start'>
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
                    </div> */}
                  </div>
                </div>
              </div>
            
            {/* <div className='col-12 col-xl-3 px-0'>
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
            </div> */}
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
      {showAudioModal && selectedAudio && (
        <Modal
          show={showAudioModal}
          onHide={() => {
            setShowAudioModal(false);
            setIsPlaying(false);
          }}
          centered
          size="lg"
          className="podcast-modal"
        >
          <Modal.Header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={storyInMotion}
                    alt="Story in Motion Logo"
                    style={{ width: '36px', height: '36px' }}
                  />
                  <Modal.Title style={{ fontWeight: '400', fontSize: '15px' }}>
                    Story in Motion Podcast Episode
                  </Modal.Title>
                </div>
                <img
                  className="left-arrow-modal"
                  src={leftArrow} 
                  alt="Close"
                  style={{
                    cursor: 'pointer',
                    position: 'relative',
                    right: '20px',
                    top: '-15px',
                    width: '20px',
                    height: '20px',
                    boxShadow:' -4px 0px 3px rgba(0, 0, 0, 0.08), 0px 2px 3px rgba(0, 0, 0, 0.08)'
                  }}
                  onClick={() => {
                    setShowAudioModal(false);
                    setIsPlaying(false);
                  }}
                />
              </div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>
                Now Playing: {selectedAudio.title}
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Waveform
              url={selectedAudio.url}
              isPlayingParent={setIsPlaying}
              isPlaying={isPlaying}
              selectedTrack={selectedAudio}
            />
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}
