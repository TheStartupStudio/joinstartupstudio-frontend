import React, { useEffect, useRef, useState } from 'react'
import {
  faPlay,
  faPause,
  faBackward,
  faForward
} from '@fortawesome/free-solid-svg-icons'
import WaveSurfer from 'wavesurfer.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { is } from 'date-fns/locale'

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: '#BBBDBF',
  progressColor: '#7F7F7F',
  cursorColor: '#7F7F7F',
  barWidth: 1,
  background: '#fff !important',
  barRadius: 1,
  responsive: true,
  height: 140,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true
})

const playBtn = {
  alignItems: 'center',
  width: ' 60px',
  height: '60px',
  background: '#FFFF',
  borderRadius: '50%',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  color: '#707070'
}

const darts = {
  alignItems: 'center',
  width: ' 15px',
  height: '60px',
  background: '#FFFF',
  borderRadius: '50%',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  color: '#707070'
}

export default function Waveform({ url, isPlaying, setMusicIsPlaying }) {
  const waveformRef = useRef(null)
  const wavesurfer = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [duration, setDuration] = useState()
  const [now, setNow] = useState()

  // create new WaveSurfer instance
  // On component mount and when url changes
  // useEffect(() => {
  //   wavesurfer?.current?.playPause()
  // }, [isPlaying])

  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      container: document.querySelector('#waveform'),
      backend: 'MediaElement'
    })
    if (url) {
      wavesurfer?.current?.load(url)
      wavesurfer.current.on('ready', function async() {
        setDuration(wavesurfer.current.getDuration())
      })
      return () => wavesurfer.current.destroy()
    }
  }, [url, isPlaying])

  useEffect(() => {
    if (isPlaying) {
      wavesurfer.current.pause()
    } else {
      wavesurfer.current.play()
    }
    handlePlayPause()
  }, [isPlaying])

  wavesurfer?.current?.on('finish', function async() {
    setMusicIsPlaying(false)
  })

  wavesurfer?.current?.on('audioprocess', function async() {
    setNow(wavesurfer.current.getCurrentTime())
  })

  const handlePlayPause = async () => {
    setPlaying(!playing)
    wavesurfer?.current?.playPause()
  }

  useEffect(() => {
    // setPlaying(wavesurfer.current.playPause())
  }, [url])
  const goBackward = () => {
    wavesurfer.current.skip(-10)
    setNow(wavesurfer.current.getCurrentTime())
  }
  const goForward = () => {
    wavesurfer.current.skip(10)
    setNow(wavesurfer.current.getCurrentTime())
  }
  // wavesurfer?.current?.play()

  ////////
  // isPlayingParent(playing)
  function getMinutes(t) {
    var min = parseInt(parseInt(t) / 60)
    var sec = parseInt(t % 60)
    if (sec < 10) {
      sec = '0' + sec
    }
    if (min < 10) {
      min = '0' + min
    }
    return min + ':' + sec
  }
  return (
    <div className='d-none'>
      {/* <div> */}
      <div
        id='waveform'
        className='waveform formWaveSurferOptions row'
        // ref={waveformRef}
      />
      <div className='controls row'>
        <span className='float-start col-1 col-sm-4 my-auto'>
          {now ? getMinutes(now) : '00:00'}
        </span>

        <div className='col-10 col-sm-4 text-center'>
          <FontAwesomeIcon
            icon={faBackward}
            style={darts}
            onClick={goBackward}
          />
          {!playing ? (
            <FontAwesomeIcon
              icon={faPlay}
              style={darts}
              className='mx-4'
              onClick={handlePlayPause}
            />
          ) : (
            <FontAwesomeIcon
              icon={faPause}
              style={darts}
              className='mx-4'
              onClick={handlePlayPause}
            />
          )}
          <span className='my-auto'>
            <FontAwesomeIcon
              icon={faForward}
              style={darts}
              onClick={goForward}
            />
          </span>
        </div>
        <span className='float-end col-1 col-sm-4 my-auto'>
          <span className='float-end my-auto'>
            {duration ? getMinutes(duration) : '00:00'}
          </span>
        </span>
      </div>
    </div>
  )
}
