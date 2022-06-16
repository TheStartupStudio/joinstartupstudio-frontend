import React, { useEffect, useState } from 'react'
import {
  faPause,
  faPlay,
  faHeart as Heart
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'

export const LastSaved = ({
  data,
  title,
  date,
  description,
  onClick,
  icon,
  id,
  saved = true,
  remove,
  url
}) => {
  const [isSaved, setIsSaved] = useState(true)
  const [descriptionLimit, setDescriptionLimit] = useState(100)

  const style = {
    icon: { color: '#F2359D', fontSize: '17px' },
    play: {
      fontSize: '17px'
    }
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

  const [duration, setduration] = useState()
  var au = document.createElement('audio')

  // Define the URL of the MP3 audio file
  au.src = url

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

  const removeSaved = async (id) => {
    await axiosInstance
      .delete(`/userSaved/${id}?from=podcast`)
      .then((res) => {
        setIsSaved(false)
        toast.success(<IntlMessages id={'alerts.success_change'} />)
      })
      .catch((res) => {
        toast.error(<IntlMessages id={'alerts.something_went_wrong'} />)
      })
  }
  return (
    <>
      <div className='col-12 align-center me-1 px-3 pt-2 saved-page-podcast'>
        <h3>{data?.title}</h3>
        <div className='row mt-1 mb-3'>
          <div className='col-9 col-lg-6 saved-page-podcast-date'>
            <span>
              {moment(date).format('MMM. d, YYYY')}{' '}
              <span className='ps-2'>
                {duration ? getMinutes(duration) : '00:00'}
              </span>
            </span>
          </div>
          <div className='col-3 col-lg-6 ps-lg-4 ps-sm-4 ps-md-4 pe-lg-2 justify-content-between'>
            <span className='my-auto'>
              {isSaved ? (
                <FontAwesomeIcon
                  icon={Heart}
                  className='float-sm-end'
                  style={style.icon}
                  onClick={() => {
                    remove(data)
                    removeSaved(data?.id)
                  }}
                ></FontAwesomeIcon>
              ) : (
                <span
                  className='col-6 col-sm-1 float-sm-end  mx-auto my-auto'
                  style={{
                    fontSize: '23px',
                    cursor: 'pointer',
                    color: 'black'
                  }}
                  onClick={() => {
                    // savePodcast(id)
                  }}
                >
                  ♡{/* &#9825; */}
                </span>
              )}
              {!icon ? (
                <FontAwesomeIcon
                  icon={faPlay}
                  style={style.play}
                  className='mx-auto h3 float-end me-md-3 story-in-motion-podcast-icon mb-0 p-0'
                  onClick={() => onClick('play')}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faPause}
                  style={style.play}
                  onClick={() => onClick('pause')}
                  className='mx-auto h3 float-end story-in-motion-podcast-icon mb-0 p-0 z'
                />
              )}
            </span>
          </div>
        </div>
        <p className='col-12 saved-page-podcast-description'>
          {descriptionLimit < data?.description.length ? (
            <span>{data?.description.substr(0, descriptionLimit)}...</span>
          ) : (
            <span>{data?.description}</span>
          )}
        </p>

        {descriptionLimit < data?.description.length && (
          <div>
            <a
              href=''
              onClick={(e) => {
                e.preventDefault()
                setDescriptionLimit(data?.description.length)
              }}
            >
              read more
            </a>
          </div>
        )}
        <hr style={Style.hr} />
      </div>
    </>
  )
}
