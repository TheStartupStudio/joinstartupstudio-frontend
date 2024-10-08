import React, { useState } from 'react'
import moment from 'moment'
import {
  faPause,
  faPlay,
  faHeart as Heart
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SPodcast = (data, playingUrl, audioPlaying, url) => {
  const [duration, setduration] = useState()
  const [descriptionLimit, setDescriptionLimit] = useState(100)

  const style = {
    firstDiv: {
      // maxHeight: '160px',
      minHeight: '188px',
      overflow: 'hidden',
      paddingTop: '1rem'
    }
  }

  var au = document.createElement('audio')

  // Define the URL of the MP3 audio file
  au.src = data.data.url

  // Once the metadata has been loaded, display the duration in the console
  au.addEventListener(
    'loadedmetadata',
    function () {
      // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
      setduration(au.duration)
    },
    false
  )
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
    <div className='col-12 col-lg-4 my-2 px-lg-2'>
      <div
        className='col-12 align-center border rounded me-1 px-2 py-2 saved-page-podcast'
        style={style.firstDiv}
      >
        <h3>{data.data.title}</h3>
        <div className='row my-3'>
          <div className='col-7 col-lg-8 saved-page-podcast-date'>
            <span> {moment(data.data.date).format('MMM.  d, YYYY')}</span>
            <span className='mx-2'>
              {duration ? getMinutes(duration) : '00:00'}
            </span>
            <span className='ps-2'>
              {/* {getMinutes(data.data.url)} */}
              {/* {getDuration(data.data.url)} */}
            </span>
          </div>
          <div
            className='col-5 ps-xlg-4 pe-2 col-md-5 col-lg-4 justify-content-between'
            style={{ marginTop: '-4px' }}
          >
            <div className='float-end'>
              {data.data.url == data.playingUrl && data.audioPlaying ? (
                <FontAwesomeIcon
                  icon={faPause}
                  onClick={() => {
                    // data.url(data.data.url)
                    data.setAudioPlaying(false)
                  }}
                  style={{ fontSize: '17px', color: '#bbbdbf' }}
                  className=''
                  // style={darts}
                  // className='mt-3 mx-auto ms-sm-4 h3 story-in-motion-podcast-icon'
                />
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faPlay}
                    onClick={() => {
                      data.url(data.data.url)
                      // data.url(data.data.url)
                      data.setAudioPlaying(true)

                      // setSong(data.data.url)
                      // handlePlayPause()
                    }}
                    style={{ fontSize: '17px', color: '#bbbdbf' }}
                  ></FontAwesomeIcon>
                </>
              )}
              <span
                className='mx-sm-2 float-end float-sm-none order-0 pe-4 pe-lg-0'
                onClick={() => data.removeSavede(data.props.SavedId)}
              >
                <FontAwesomeIcon
                  icon={Heart}
                  className='ms-3 ms-md-auto'
                  style={{ color: '#F2359D', fontSize: '17px' }}
                ></FontAwesomeIcon>
              </span>
            </div>
          </div>
        </div>
        <p
          className='my-0 gy-0 py-0 saved-page-podcast-description'
          style={{ wordBreak: ' break-words', marginTop: '-10px' }}
        >
          {descriptionLimit < data.data.description.length ? (
            <span>{data.data.description.substr(0, descriptionLimit)}...</span>
          ) : (
            <span>{data.data.description}</span>
          )}
        </p>

        {descriptionLimit < data.data.description.length && (
          <div>
            <a
              href=''
              onClick={(e) => {
                e.preventDefault()
                setDescriptionLimit(data.data.description.length)
              }}
            >
              read more
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default SPodcast
