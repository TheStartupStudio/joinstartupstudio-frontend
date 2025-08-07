import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faHeart as heartNotSaved
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import IntlMessages from '../../utils/IntlMessages'
import { VideoModal } from '../Modals/videoModal'
import { useState, useEffect } from 'react'
import StartupLiveEn from '../../assets/images/startup-live-en.jpg'
import { faHeart as heartSaved } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'

export default function VideoView(props) {
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showNotesButton, setShowNotesButton] = useState(false)
  const url = ''
  const [videoData, setVideoData] = useState([])

  useEffect(() => {
    setVideoData(props.videoData)
  }, [props.videoData])

  const updateFavorite = async (value) => {
    if (props.type === 'widget')
      return props.removeSavedVideo(videoData.id, videoData.type)

    if (props.isMainPage)
      return props.updateFavorite(videoData.id, videoData.type, value)

    if (props.page === 'saved-videos') props.removeSavedVideo(videoData.id)

    const oldFavoriteValue = videoData.favorite
    setVideoData({ ...videoData, favorite: !oldFavoriteValue })
    if (value) {
      await axiosInstance
        .post(`/favorites`, { contentId: videoData.id })
        .then((response) => {
          if (response.status === 200) {
            toast.success('Your changes has been saved successfully')
          }
          return response
        })
        .catch((err) =>
          setVideoData({ ...videoData, favorite: oldFavoriteValue })
        )
    } else {
      await axiosInstance
        .delete(`/favorites/${videoData.id}`)
        .then((response) => {
          if (response.status === 200) {
            toast.success('Your changes has been saved successfully')
          }
        })
        .catch((err) =>
          setVideoData({ ...videoData, favorite: oldFavoriteValue })
        )
    }
  }

  const handleClick = () => {
    if (props.page === 'startup-live') {
      props.onClick && props.onClick(props.videoData);
    } else {
      setShowNotesButton(true);
      setShowVideoModal(true);
    }
  }

  return (
    <>
      {props.type !== 'view-all' ? (
        <div style={{ borderRadius:'25px' }}
          className={`${
            props.type !== 'widget' ? 'beyond-your-course-videos' : 'mt-2'
          }`}
        >
          <Link to={url ? url : '#'}>
            <div
              onClick={handleClick}
              className='beyond-your-course-video-thumb'
              style={{ borderRadius:'25px' }}
            >
              {/* <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
                <FontAwesomeIcon
                  icon={videoData.favorite ? heartSaved : heartNotSaved}
                  style={{
                    width: '25px',
                    height: '25px',
                    color: videoData.favorite ? '#F2359D' : 'grey'
                  }}
                  onClick={() =>
                    props.type !== 'widget'
                      ? updateFavorite(!videoData.favorite)
                      : props.removeSavedVideo()
                  }
                />
              </div> */}

                <img
                style={{borderRadius:'20px',boxShadow:'0px 10px 10px 8px rgba(0, 0, 0, 0.09)'}}
                  src={props.thumbnail}
                  width='100%'
                  alt='video'
                />
                <div className='beyond-your-course-video-thumb-icon' style={{border:'4px solid white',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <FontAwesomeIcon icon={faPlay} />
                </div>
              </div>
            <div
              className='card-body-video'
              onClick={() => setShowVideoModal(true)}
            >
              <>
                <h5 style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                }}>
                  <IntlMessages id={props.title} />
                </h5>
                {videoData?.type === 'master' && (
                  <p
                    className='card-text'
                    style={{
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#666'
                    }}
                  >
                    by <IntlMessages id={props.description} />
                  </p>
                )}
                {videoData?.type === 'podcast' && (
                  <p
                    className='card-text'
                    style={{
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#666'
                    }}
                  >
                    by <IntlMessages id={props.description} />
                  </p>
                )}
                {videoData?.type === 'live-qa' && (
                  <p
                    className='card-text'
                    style={{
                      textAlign: 'center',
                      fontSize: '13px',
                      color: '#666'
                    }}
                  >
                    {props.description}
                  </p>
                )}
              </>
            </div>
          </Link>
          {props.type === 'widget' && (
            <hr
              className='mx-auto mt-1 mt-2 mb-3'
              style={{ color: '#333D3D83' }}
            />
          )}
        </div>
      ) : (
        <div className='video-cards'>
            <Link to={url ? url : '#'}>
              <div className='beyond-your-course-video-thumb beyound-all-videos-thumb' style={{width:'100%'}}>
                <div
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px'
                  }}
                >
                </div>
                <div
                  onClick={() => {
                    setShowNotesButton(true)
                    setShowVideoModal(true)
                  }}
                >
                  <img
                  className='border-radius-25'
                    src={props.thumbnail}
                    width='100%'
                    alt='#'
                    style={{
                      borderRadius:'25px',
                      objectFit:
                        props.page === 'startup-live' ? 'cover' : 'cover'
                    }}
                  />
                  <div className='beyond-your-course-video-thumb-icon' style={{border:'5px solid white',borderRadius:'50%',padding:'1.5rem',display:'flex',alignItems:'center',justifyContent:'center'}}>
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
                </div>
              </div>
              <div
                className='card-body-video'
                onClick={() => {
                  setShowVideoModal(true)
                }}
              >
                {props.videoData && (
                  <>
                    <h5>
                      <IntlMessages id={props.title} />
                    </h5>
                  </>
                )}
              </div>
            </Link>
          </div>
      )}


      <VideoModal
        show={showVideoModal}
        onHide={() => {
          setShowVideoModal(false)
          setShowNotesButton(false)
        }}
        videoData={videoData}
        showNotesButton={showNotesButton}
        connections={props.connections}
        page={props.page}
        removeSavedVideo={(id) => props.removeSavedVideo(id)}
        updateFavorite={(value) => updateFavorite(value)}
      />
    </>
  )
}
