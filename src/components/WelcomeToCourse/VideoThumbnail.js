import { useState } from 'react'
import ReactPlayer from 'react-player'
import videoPlayerIcon from '../../assets/images/academy-icons/video-play-btn.png'

function VideoThumbnail({ imageSource, videoUrl, content }) {
  const [isPlaying, setIsPlaying] = useState(false)
  return (
    <>
      <div>
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px'
          }}
        >
          {!isPlaying && (
            <div
              onClick={() => setIsPlaying(true)}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 2
              }}
            >
              <img
                src={videoPlayerIcon}
                alt='video-player'
                className='video-player-thumb'
              />
            </div>
          )}

          {!isPlaying ? (
            <img
              src={imageSource}
              alt='Video Thumbnail'
              style={{
                width: '100%',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
              onClick={() => setIsPlaying(true)}
            />
          ) : (
            <ReactPlayer
              url={videoUrl}
              playing={true}
              controls
              width='100%'
              height='auto'
            />
          )}
        </div>
        <span className='text-center fs-18 d-block fw-light lh-sm'>
          {content}
        </span>
      </div>
    </>
  )
}

export default VideoThumbnail
