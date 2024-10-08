import React, { useEffect, useState } from 'react'
import { faPause, faPlay, faHeart } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heart } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment from 'moment'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'
import { faOldRepublic } from '@fortawesome/free-brands-svg-icons'

const Podcast = ({
  title,
  date,
  description,
  onClick,
  icon,
  id,
  saved,
  url,
  lastSaved,
  setLastSaved,
  remove
}) => {
  const [isSaved, setIsSaved] = useState(saved)
  const [duration, setduration] = useState(saved)
  const [descriptionLimit, setDescriptionLimit] = useState(100)

  useEffect(() => {
    setIsSaved(saved)
  }, [saved])
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

  const savePodcast = (id) => {
    axiosInstance
      .post('/userSaved/', {
        type: 'Podcast',
        podcast: id
      })
      .then((res) => {
        setIsSaved(true)
        setLastSaved((old) => [
          ...old,
          {
            date,
            description,
            id,
            title,
            url,
            saved
          }
        ])

        toast.success(
          <IntlMessages id={'alerts.success_change'}></IntlMessages>
        )
      })
      .catch((res) => {
        toast.error(
          <IntlMessages id={'my_saved.alredy_saved_PODCASTS'}></IntlMessages>
        )
      })
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
    <div className='row mt-md-auto mx-0 mx-sm-auto'>
      <div className='col-1 col-md-1 my-auto order-3 order-md-0 my-sm-0 col-md-1 text-center pe-3 mt-3'>
        {!icon ? (
          <FontAwesomeIcon
            icon={faPlay}
            style={{ fontSize: '17px' }}
            className='mt-md-3 mt-sm-0 mx-1 ms-sm-4 ms-md-2 ms-lg-1 h3 story-in-motion-podcast-icon'
            onClick={() => onClick('play')}
          />
        ) : (
          <FontAwesomeIcon
            icon={faPause}
            style={{ fontSize: '17px' }}
            onClick={() => onClick('pause')}
            className='mt-md-3 mt-sm-0 mx-1 ms-sm-4 h3 ms-lg-1 story-in-motion-podcast-icon'
          />
        )}
      </div>
      <div className='col-8 col-sm-9 order-2 order-md-1 px-0'>
        <h5 className=' my-0 mx-auto h3 story-in-motion-podcast-title'>
          {title}
        </h5>
        <p className='my-0 mx-auto h3 story-in-motion-podcast-date mt-1'>
          {moment(date).format('MMM. D, YYYY')}
          <span className='mx-2' />
          {duration ? getMinutes(duration) : '00:00'}
        </p>
        <p className='mt-2 story-in-motion-podcast-description'>
          {descriptionLimit < description.length ? (
            <span>{description.substr(0, descriptionLimit)}...</span>
          ) : (
            <span>{description}</span>
          )}

          {descriptionLimit < description.length && (
            <div>
              <a
                href=''
                onClick={(e) => {
                  e.preventDefault()
                  setDescriptionLimit(description.length)
                }}
              >
                read more
              </a>
            </div>
          )}
        </p>
      </div>
      <div className='col-1 col-sm-2 order-3 order-md-2 my-auto text-center text-sm-end mb-sm-5 pt-sm-0 mt-sm-0 px-sm-0 mx-sm-auto mt-3'>
        {isSaved ? (
          <FontAwesomeIcon
            icon={faHeart}
            className='mx-auto  mx-auto mb-1 my-md-auto'
            style={{ color: '#F2359D', fontSize: '17px' }}
            onClick={() => {
              remove({ date, description, id, title, url, saved })
              removeSaved(id)
            }}
          ></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon
            icon={heart}
            className='  mx-auto  mx-auto mb-1 my-md-auto'
            style={{ fontSize: '17px', cursor: 'pointer', color: 'black' }}
            onClick={() => {
              savePodcast(id)
            }}
          ></FontAwesomeIcon>
        )}
      </div>
    </div>
  )
}

export default Podcast
