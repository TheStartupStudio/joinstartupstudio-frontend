import React, { useState, useEffect } from 'react'
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

export const VideoModal = (props) => {
  const [loading, setLoading] = useState(false)
  const [playVideo, setPlayVideo] = useState(false)
  const [shareVideo, setShareVideo] = useState(false)
  const [videoData, setVideoData] = useState([])
  const [connections, setConnections] = useState([])
  const [showShareVideoModal, setShowShareVideoModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

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
        // backdrop='static'
        size='lg'
        aria-labelledby='contained-modal-title-vcenter'
        keyboard={true}
        className='videoPlayerModal d-lg-flex'
        centered={true}
      >
        <Modal.Body className='p-0 m-0'>
          {/* {shareVideo && (
            <div className='share-video-overlay'>
              <div className='d-flex h-100 justify-content-center align-items-center'>
                <div className='row justify-content-center'>
                  <div
                    className='col-6 d-flex share-container'
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setShowShareVideoModal(true)
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faUser}
                      // className='mt-2'
                      style={{
                        width: '46px',
                        height: '55px',
                        color: '#FFFFFF'
                      }}
                    />
                    <p className='mt-4'>SHARE WITH A CONNECTION</p>
                  </div>
                  <div className='col-6 d-flex share-container'>
                    <FontAwesomeIcon
                      icon={faUsers}
                      // className='mt-4'
                      style={{
                        width: '70px',
                        height: '55px',
                        color: '#FFFFFF'
                      }}
                    />
                    <p className='mt-4'>SHARE WITH THE COMMUNITY</p>
                  </div>
                  <div className='col-12'>
                    <p
                      className='text-center mt-2'
                      style={{ color: '#01C5D1', cursor: 'pointer' }}
                      onClick={() => setShareVideo(false)}
                    >
                      CANCEL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )} */}
          <div className='video-options d-flex'>
            <FontAwesomeIcon
              icon={faTimes}
              // className='mt-2'
              style={{ width: '25px', height: '30px', color: '#FFFFFF' }}
              onClick={() => {
                props.onHide()

                setPlayVideo(false)
              }}
            />
            <FontAwesomeIcon
              icon={videoData.favorite ? heartSaved : heartNotSaved}
              className='mt-3'
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
            />
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
            <div className='d-flex justify-content-center align-items-center'>
              <img
                src={videoData?.thumbnail}
                width='100%'
                alt='video'
                style={{ objectFit: 'cover' }}
              />
              {!shareVideo && (
                <div className='beyond-your-course-video-thumb-icon'>
                  <FontAwesomeIcon
                    icon={faPlay}
                    onClick={() => setPlayVideo(true)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              )}
            </div>
          ) : (
            <ReactPlayer
              // className='react-player'
              url={videoData?.url}
              controls={true}
              width='100%'
              height='100%'
              config={{
                file: { attributes: { controlsList: 'nodownload' } }
              }}
              playing={true}
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
