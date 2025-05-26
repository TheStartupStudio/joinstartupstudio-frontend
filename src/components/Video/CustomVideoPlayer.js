import React, { useEffect, useRef, useState } from 'react'
import { FaPlay, FaPause, FaExpand, FaCompress } from 'react-icons/fa'
import { BsArrowRepeat } from 'react-icons/bs'
import './VideoPlayer.css'
import { useDispatch } from 'react-redux'
import { createWatchedMasterclass } from '../../redux/platformBadges/actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faForward } from '@fortawesome/free-solid-svg-icons';

const CustomVideoPlayer = ({
  videoUrl,
  playVideo,
  setPlayVideo,
  videoData
}) => {
  const dispatch = useDispatch()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true);
  const videoContainerRef = useRef(null)
  const videoRef = useRef(null)
  const hideControlsTimeoutRef = useRef(null)

  useEffect(() => {
    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    videoRef.current?.addEventListener('play', handlePlay)
    videoRef.current?.addEventListener('pause', handlePause)

    videoRef.current.play()

    return () => {
      videoRef.current?.removeEventListener('play', handlePlay)
      videoRef.current?.removeEventListener('pause', handlePause)
    }
  }, [])

  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current?.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(videoRef.current?.duration)
    }
    const handleEnded = () => {
      dispatch(createWatchedMasterclass(videoData.id))
    }

    videoRef.current?.addEventListener('timeupdate', handleTimeUpdate)
    videoRef.current?.addEventListener('durationchange', handleDurationChange)
    videoRef.current?.addEventListener('ended', handleEnded)

    return () => {
      videoRef.current?.removeEventListener('timeupdate', handleTimeUpdate)
      videoRef.current?.removeEventListener(
        'durationchange',
        handleDurationChange
      )
      videoRef.current?.removeEventListener('ended', handleEnded)
    }
  }, [])

  useEffect(() => {
    const timeoutHandler = (event) => {
      if (event.type === 'mouseenter') {
        setShowControls(true)
      } else if (event.type === 'mouseleave' && videoRef.current?.paused) {
        setShowControls(false)
      } else if (event.type === 'mouseleave') {
        hideControlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 4000)
      }
    }

    const handleMouseMoveInsideVideo = () => {
      setShowControls(true)
      clearTimeout(hideControlsTimeoutRef.current)
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 4000)
    }

    videoContainerRef.current?.addEventListener('mouseleave', timeoutHandler)
    videoContainerRef.current?.addEventListener('mouseenter', timeoutHandler)
    videoRef.current?.addEventListener('mousemove', handleMouseMoveInsideVideo)

    return () => {
      videoContainerRef.current?.removeEventListener(
        'mouseleave',
        timeoutHandler
      )
      videoContainerRef.current?.removeEventListener(
        'mouseenter',
        timeoutHandler
      )
      videoRef.current?.removeEventListener(
        'mousemove',
        handleMouseMoveInsideVideo
      )
      clearTimeout(hideControlsTimeoutRef.current)
    }
  }, [showControls])

  const handleFullScreen = () => {
    if (!isFullScreen) {
      videoContainerRef.current.requestFullscreen()
      setIsFullScreen(true)
    } else {
      document.exitFullscreen()
      setIsFullScreen(false)
    }
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pause()
      setIsPlaying(false)
      setShowControls(true)
    } else {
      videoRef.current?.play()
      setIsPlaying(true)
      setTimeout(() => {
        setShowControls(false)
      }, 4000)
    }
  }
  const handleVideoClick = () => {
    handlePlayPause()
  }

  const handleReplay = () => {
    if (videoRef.current) {
      // Go back 10 seconds
      const newTime = Math.max(0, videoRef.current.currentTime - 10)
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleForward = () => {
    if (videoRef.current) {
      // Go forward 10 seconds
      const newTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`
  }

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    videoRef.current?.addEventListener('loadeddata', handleLoadedData);
    return () => {
      videoRef.current?.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  return (
    <div
      className={`video-player ${
        showControls ? 'show-controls' : 'hide-controls'
      }`}
      ref={videoContainerRef}
      onClick={handleVideoClick}
    >
      {isLoading && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            borderRadius: '25px'
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <video
        style={{borderRadius:'25px'}}
        ref={videoRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setPlayVideo(false)}
        onLoadedData={handleLoadedData}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {showControls && (
        <div className="controls-container">
          <div className="w-100 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button onClick={handlePlayPause}>
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                onClick={handleReplay}
                className="replay-btn"
                title="Replay last 10 seconds"
              >
                <FontAwesomeIcon 
                  icon={faBackward} 
                  className="replay-icon"
                />
              </button>
              <button
                onClick={handleForward}
                className="replay-btn"
                title="Forward 10 seconds"
              >
                <FontAwesomeIcon 
                  icon={faForward} 
                  className="replay-icon"
                />
              </button>
            </div>
            <button onClick={handleFullScreen}>
              {isFullScreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
          <div className="w-100">
            <progress
              value={currentTime}
              className="w-100"
              max={duration || 1}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomVideoPlayer
