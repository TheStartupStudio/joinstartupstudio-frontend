import React, { useEffect, useRef, useState } from 'react'
import { FaPlay, FaPause, FaExpand, FaCompress } from 'react-icons/fa'
import { BsArrowRepeat } from 'react-icons/bs'
import './VideoPlayer.css'
import { useDispatch } from 'react-redux'
import { createWatchedMasterclass } from '../../redux/platformBadges/actions'

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

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`
  }

  return (
    <div
      className={`video-player ${
        showControls ? 'show-controls' : 'hide-controls'
      }`}
      ref={videoContainerRef}
      onClick={handleVideoClick}
    >
      <video
        ref={videoRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setPlayVideo(false)}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {showControls && (
        <div className="controls-container">
          <div className="w-100 d-flex align-items-center justify-content-between">
            <div>
              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <button onClick={handlePlayPause}>
                {isPlaying ? <FaPause /> : <FaPlay />}
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
