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
import { NotesButton } from '../Notes'

export default function VideoView(props) {
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showNotesButton, setShowNotesButton] = useState(false)
  const url = ''
  // props.page === 'startup-live' ? `/${props.page}/video/${props.id}` : ''
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
        .then((response) => response)
        .catch((err) =>
          setVideoData({ ...videoData, favorite: oldFavoriteValue })
        )
    } else {
      await axiosInstance
        .delete(`/favorites/${videoData.id}`)
        .then(() => {})
        .catch((err) =>
          setVideoData({ ...videoData, favorite: oldFavoriteValue })
        )
    }
  }

  return (
    <>
      {props.type !== 'view-all' ? (
        <div
          className={`${
            props.type !== 'widget' ? 'beyond-your-course-videos' : 'mt-2'
          }`}
        >
          <Link to={url ? url : '#'}>
            <div
              className='beyond-your-course-video-thumb'
              style={{ width: '100%' }}
            >
              <div style={{ position: 'absolute', right: '10px', top: '10px' }}>
                <FontAwesomeIcon
                  icon={videoData.favorite ? heartSaved : heartNotSaved}
                  style={{
                    width: '25px',
                    height: '25px',
                    color: videoData.favorite ? '#F2359D' : '#FFFFFF'
                  }}
                  onClick={() =>
                    props.type !== 'widget'
                      ? updateFavorite(!videoData.favorite)
                      : props.removeSavedVideo()
                  }
                />
              </div>

              <div
                onClick={() => {
                  setShowVideoModal(true)
                  setShowNotesButton(true)
                }}
              >
                <img
                  src={props.thumbnail}
                  width='100%'
                  height='250px'
                  alt='video'
                />
                <div className='beyond-your-course-video-thumb-icon'>
                  <FontAwesomeIcon icon={faPlay} />
                </div>
              </div>
            </div>
            <div
              className='card-body-video'
              onClick={() => setShowVideoModal(true)}
            >
              <>
                <h5>
                  <IntlMessages id={props.title} />
                </h5>
                <p
                  className='card-text'
                  style={{
                    textAlign:
                      props.page === 'master-classes' ? 'center' : 'left'
                  }}
                >
                  <IntlMessages id={props.description} />
                </p>
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
        <div className='card-group my-2 all-videos-beyond-your-course-videos col-12 col-sm-6 col-md-4 px-2'>
          <div
            className='card mobile-card'
            // style={{ paddingRight: '20px' }}
          >
            <Link to={url ? url : '#'}>
              <div className='beyond-your-course-video-thumb beyound-all-videos-thumb'>
                <div
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '10px'
                  }}
                >
                  <FontAwesomeIcon
                    icon={videoData.favorite ? heartSaved : heartNotSaved}
                    style={{
                      width: '25px',
                      height: '25px',
                      color: videoData.favorite
                        ? '#F2359D'
                        : props.page === 'startup-live'
                        ? 'grey'
                        : '#FFFFFF'
                    }}
                    onClick={() =>
                      props.type !== 'widget'
                        ? updateFavorite(!videoData.favorite)
                        : props.removeSavedVideo()
                    }
                  />
                </div>
                <div
                  onClick={() => {
                    setShowNotesButton(true)
                    setShowVideoModal(true)
                  }}
                >
                  <img
                    src={
                      props.thumbnail
                      // window.location.href.includes('startup-live')
                      //   ? StartupLiveEn
                      //   : props.thumbnail
                    }
                    // style={{ height: '200px' }}
                    width='100%'
                    // height=''
                    alt='#'
                    style={{
                      objectFit:
                        props.page === 'startup-live' ? 'contain' : 'cover'
                    }}
                  />
                  <div className='beyond-your-course-video-thumb-icon'>
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
                    <p
                      className='card-text'
                      style={{
                        textAlign:
                          props.page === 'master-classes' ? 'center' : 'left'
                      }}
                    >
                      {!props.description?.includes(' ') ? (
                        <IntlMessages id={props.description} />
                      ) : (
                        props.description
                      )}
                    </p>
                  </>
                )}
              </div>
            </Link>
          </div>
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
