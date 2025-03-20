import { useState } from 'react'
import ReactPlayer from 'react-player'
import videoPlayerIcon from '../../assets/images/academy-icons/video-play-btn.png'

function VideoCourse({ videoSrc, imgSrc }) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div>
      <div
        style={{
          position: 'relative',
          width: '100%'
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
            src={imgSrc}
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
            url={videoSrc}
            playing={true}
            controls
            width='100%'
            height='auto'
          />
        )}
      </div>
    </div>
  )
}

export default VideoCourse
