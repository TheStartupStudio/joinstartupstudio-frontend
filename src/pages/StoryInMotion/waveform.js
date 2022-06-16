import React, { useEffect, useRef, useState } from 'react'
import {
  faPlay,
  faPause,
  faBackward,
  faStepForward,
  faStepBackward,
  faForward
} from '@fortawesome/free-solid-svg-icons'
import WaveSurfer from 'wavesurfer.js'
import './StoryInMotion.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
  width: '15px',
  height: '60px',
  background: '#FFFF',
  borderRadius: '50%',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  color: '#707070'
}
let Style = {
  hr: {
    backgroundColor: '#333D3D6D',
    height: ' 0.8px'
  },
  loadMore: {
    textAlign: 'left',
    font: 'normal normal 600 13px Montserrat',
    color: '#333d3d83',
    letterSpacing: '0px',
    cursor: 'pointer'
  }
}
export default function Waveform({
  url,
  isPlayingParent,
  setMusicIsPlaying,
  handle,
  isPlaying
}) {
  // const waveformRef = useRef(null)
  const wavesurfer = useRef(null)
  // const [playing, setPlaying] = useState(isPlaying)
  // console.log(`playing`, playing)
  const [duration, setDuration] = useState()
  const [now, setNow] = useState()
  // const [changed, setchanged] = useState(false)
  // create new WaveSurfer instance
  // On component mount and when url changes

  useEffect(() => {
    if (url) {
      // console.log('playingplayingplaying', playing)
      // isPlayingParent(true)
      // handlePlayPause()
      // // const options = formWaveSurferOptions(waveformRef.current)
      // const options = document.getElementById('#waveform')
      // setDuration('0')

      wavesurfer.current = WaveSurfer.create({
        container: document.querySelector('#waveform'),
        backend: 'MediaElement'
      })
      wavesurfer.current.load(url)
      if (isPlaying) {
        wavesurfer.current.on('ready', function async() {
          setDuration(wavesurfer?.current?.getDuration())
          wavesurfer.current.play()
        })
      }
      return () => wavesurfer.current.destroy()
    }
  }, [url])

  wavesurfer?.current?.on('finish', function async() {
    wavesurfer?.current?.pause()
    isPlayingParent(false)
  })

  wavesurfer?.current?.on('audioprocess', function async() {
    setNow(wavesurfer.current.getCurrentTime())
  })

  const handlePlayPause = async () => {
    if (url) {
      wavesurfer?.current?.playPause()
    }
  }
  // useEffect(() => {
  //   setPlaying(wavesurfer.current.playPause())
  // }, [url, changed])
  useEffect(() => {
    // console.log(url != url)
    setDuration(wavesurfer?.current?.getDuration())
    handlePlayPause()
  }, [isPlaying])

  // useEffect(() => {
  //   wavesurfer?.current?.play()
  // }, [url, isPlaying])

  const goBackward = () => {
    wavesurfer.current.skip(-10)
    setNow(wavesurfer.current.getCurrentTime())
  }
  const goForward = () => {
    wavesurfer.current.skip(10)
    setNow(wavesurfer.current.getCurrentTime())
  }

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
    <div>
      <div
        id='waveform'
        style={{ overflow: 'none' }}
        className='waveform formWaveSurferOptions wform '
        // ref={waveformRef}
      />
      <div className='controls row'>
        <span className='float-start col-1 col-sm-4 my-auto'>
          {now ? getMinutes(now) : '00:00'}
        </span>

        <div className='col-9 col-sm-4 text-center'>
          <FontAwesomeIcon
            icon={faStepBackward}
            style={darts}
            onClick={goBackward}
          />
          {isPlaying ? (
            <FontAwesomeIcon
              icon={faPause}
              style={darts}
              className='mx-4'
              onClick={() => isPlayingParent(false)}
            />
          ) : (
            <FontAwesomeIcon
              icon={faPlay}
              style={darts}
              className='mx-4'
              onClick={() => {
                isPlayingParent(true)
              }}
            />
          )}
          <span className='my-auto'>
            <FontAwesomeIcon
              icon={faStepForward}
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
        <hr style={Style.hr} />
      </div>
    </div>
  )
}
