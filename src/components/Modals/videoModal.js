import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import ReactPlayer from 'react-player'
import { ShareVideoModal } from './shareVideoModal'
import { ConfirmationModal } from './confirmationModal'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPause,
  faPlay,
  faHeart as heartSaved,
  faTimes,
  faUser,
  faUsers,
  faShareAltSquare
} from '@fortawesome/free-solid-svg-icons'
import { IsUserLevelAuthorized } from '../../utils/helpers'
import { faHeart as heartNotSaved } from '@fortawesome/free-regular-svg-icons'
import { NotesButton } from '../Notes'
import CustomVideoPlayer from '../Video/CustomVideoPlayer'

export const VideoModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [playVideo, setPlayVideo] = useState(false)
  const [shareVideo, setShareVideo] = useState(false)
  const [videoData, setVideoData] = useState([])
  const [connections, setConnections] = useState([])
  const [showShareVideoModal, setShowShareVideoModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const videoRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const videoPlayer = videoRef.current

    const updateTime = (state) => {
      setCurrentTime(state.playedSeconds)
    }

    const handleDuration = (duration) => {
      setDuration(duration)
    }

    if (videoPlayer) {
      videoPlayer.addEventListener('progress', updateTime)
      videoPlayer.addEventListener('duration', handleDuration)
    }

    return () => {
      if (videoPlayer) {
        videoPlayer.removeEventListener('progress', updateTime)
        videoPlayer.removeEventListener('duration', handleDuration)
      }
    }
  }, [videoRef])

  useEffect(() => {
    if (props.connections?.length) {
      setConnections(props.connections)
    }
  }, [props.connections])

  useEffect(() => {
    setVideoData(props.videoData)
  }, [props.videoData])

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        keyboard={true}
        className="videoPlayerModal d-lg-flex"
        centered={true}
      >
        <Modal.Body className="p-0 m-0">
          <div className="video-options d-flex">
            <FontAwesomeIcon
              icon={faTimes}
              style={{ width: '25px', height: '30px', color: '#FFFFFF' }}
              onClick={() => {
                props.onHide()

                setPlayVideo(false)
              }}
            />
            {/* <FontAwesomeIcon
              icon={videoData.favorite ? heartSaved : heartNotSaved}
              className="mt-3"
              style={{
                width: '25px',
                height: '25px',
                color: videoData.favorite ? '#F2359D' : '#FFFFFF'
              }}
              onClick={() =>
                props.isMainPage
                  ? props.updateFavorite(
                      videoData.id,
                      videoData.type,
                      !videoData.favorite
                    )
                  : props.updateFavorite(!videoData.favorite)
              }
            /> */}
            {/* {IsUserLevelAuthorized() && (
              <FontAwesomeIcon
                icon={faShareAltSquare}
                className='mt-3'
                style={{ width: '25px', height: '25px', color: '#FFFFFF' }}
                onClick={() => setShowShareVideoModal(true)}
              />
            )} */}
          </div>
          {!playVideo ? (
            <div className="">
              <img
                src={videoData?.thumbnail}
                width="100%"
                alt="video"
                style={{ objectFit: 'cover',borderRadius:'25px' }}
              />
              {!shareVideo && (
                <div className="beyond-your-course-video-thumb-icon-fullscreen">
                  <FontAwesomeIcon
                    icon={faPlay}
                    onClick={() => setPlayVideo(true)}
                    style={{ cursor: 'pointer' ,
                      position: 'relative',
                             bottom: '.8rem',
                              
                             right: '6px'}}
                  />
                </div>
              )}
            </div>
          ) : (
            // <ReactPlayer
            //   // className='react-player'
            //   url={videoData?.url}
            //   controls={true}
            //   width='100%'
            //   height='100%'
            //   config={{
            //     file: { attributes: { controlsList: 'nodownload' } }
            //   }}
            //   playing={true}
            // />
            <CustomVideoPlayer
              videoUrl={videoData?.url}
              playVideo={playVideo}
              setPlayVideo={setPlayVideo}
              videoData={props.videoData}
            />
          )}

          {/* </div> */}
        </Modal.Body>
        {props.showNotesButton && (
          <NotesButton data={videoData} from={'video'} />
        )}
      </Modal>
      <ShareVideoModal
        connections={connections}
        videoData={videoData}
        show={showShareVideoModal}
        onHide={() => {
          setShowShareVideoModal(false)
        }}
        videoSharedSuccess={() => setShowConfirmationModal(true)}
      ></ShareVideoModal>
      <ConfirmationModal
        show={showConfirmationModal}
        onHide={() => {
          setShowConfirmationModal(false)
        }}
        message={'Success! The video has been shared.'}
      />
    </>
  )
}
