import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import ReactPlayer from 'react-player'

function mergeIntervals(ranges) {
  ranges = ranges.sort(function (a, b) {
    return a[0] - b[0] || a[1] - b[1]
  })

  var result = [],
    last

  ranges.forEach(function (r) {
    if (!last || r[0] > last[1]) result.push((last = r))
    else if (r[1] > last[1]) last[1] = r[1]
  })

  return result
}

function calcWatchTime(ranges) {
  let intervals = mergeIntervals(ranges)
  let time = intervals.reduce((total, range) => {
    return total + Math.abs(range[1] - range[0])
  }, 0)
  return time
}

export default function MediaLightbox(props) {
  let [watchTime, setWatchTime] = useState(0)
  let [duration, setDuration] = useState(1)
  let [intervals, setIntervals] = useState(
    props.watchData && props.watchData.constructor == Array
      ? props.watchData
      : [[0, 0]]
  )
  let [saveTimer, setSaveTimer] = useState(0)
  let [watchedVideo, setWatchedVideo] = useState(false)
  const videoRef = useRef(null)
  const [isPiPActive, setIsPiPActive] = useState(false); //pip (picture to picture)

  const handleEnterPiP = () => {
    setIsPiPActive(true);
    videoRef.current.getInternalPlayer().play();
  };

  const handleLeavePiP = () => {
    setIsPiPActive(false);
    videoRef.current.getInternalPlayer().play();
  };


  useEffect(() => {
    setWatchTime(0)
    setDuration(1)
    setIntervals(
      props.watchData && props.watchData.constructor == Array
        ? props.watchData
        : [[0, 0]]
    )
  }, [props.video, props.watchData])

  useEffect(() => {
    if (!isPiPActive) {
      closeLightbox()
    }
  }, [isPiPActive])

  if (!props.show) return null

  function setNewInterval(time) {
    setIntervals([...mergeIntervals(intervals), [time, time]])
  }
  function updateLatestInterval(time) {
    if (intervals.length == 0) {
      intervals = [[time, time]]
    }

    if (Math.abs(intervals[intervals.length - 1][1] - time) > 2) {
      setNewInterval(time)
      return
    }
    intervals[intervals.length - 1][1] = time
    setIntervals([...intervals])

    let wt = calcWatchTime(intervals)

    setWatchTime(wt)

    if (saveTimer + 1 > 5) {
      props.onVideoData && props.onVideoData(mergeIntervals(intervals))
      setSaveTimer(0)
    } else {
      setSaveTimer(saveTimer + 1)
    }

    if (wt > duration * 0.8 && !watchedVideo) {
      props.onVideoWatched && props.onVideoWatched()
      setWatchedVideo(true)
    }
  }

  function closeLightbox() {
    if (props.onClose && props.onClose.constructor === Function) {
      props.onClose()
    }
  }

  const closeFn = (input) => {
    if (input == 'media-lightbox__content-scroll') {
      closeLightbox()
    }
  }

 
  return (
    <div className='media-lightbox' style={isPiPActive ? { visibility: 'hidden' } : {}}>
      <div className='media-lightbox__inner'>
        <div className='media-lightbox__overlay' />

        <div
          className='media-lightbox__content-scroll'
          onClick={(e) => closeFn(e.target.className)}
        >
          <div className='media-lightbox__content'>
            <button className='media-lightbox__close' onClick={closeLightbox}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className='media-lightbox__content-main'>
              <div className='media-lightbox__video'>
                <ReactPlayer
                  className='video_inner media-lightbox__video-player'
                  url={props.video.url}
                  controls={true}
                  width='100%'
                  height='100%'
                  onEnablePIP={handleEnterPiP}
                  onDisablePIP={(e) => {
                    console.log(e, "triumf140")
                    handleLeavePiP()
                  }}
                  config={{
                    file: { attributes: { controlsList: 'nodownload' } }
                  }}
                  ref={videoRef}
                  playing={true}
                  onProgress={({ playedSeconds }) => {
                    updateLatestInterval(playedSeconds)
                  }}
                  onDuration={(duration) => {
                    setDuration(duration)
                  }}
                  onSeek={(seconds) => {
                    setNewInterval(seconds)
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
