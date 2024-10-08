import React, { useState } from 'react'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import VideoModal from './VideoModal'

const VideoPreview = (props) => {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <div className='col-12 col-lg-6'>
      <div className='vide row mt-5'>
        <div className='col-12 w-100' style={{ position: 'relative' }}>
          <img
            src={
              props.project.videoImage
                ? props.project.videoImage
                : props.project?.image
            }
            className='w-100'
            height={'250px'}
            style={{ objectFit: 'cover' }}
            onClick={(e) => setShowVideo(true)}
          />
          <div className='video-play-icon'>
            <FontAwesomeIcon
              icon={faPlay}
              onClick={(e) => {
                setShowVideo(true)
              }}
            />
          </div>
        </div>
      </div>
      <VideoModal
        show={showVideo}
        onHide={() => setShowVideo(false)}
        url={props.project?.company_video}
        thumbnail={
          props.project.videoImage
            ? props.project.videoImage
            : props.project?.image
        }
      />
    </div>
  )
}

export default VideoPreview
