import moment from 'moment'
import React, { useState, useEffect } from 'react'
import {
  faPause,
  faPlay,
  faHeart as Heart
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'
import SPodcast from './sPodcast'

const Podcast = ({
  data,
  updatePodcast,
  loading,
  url,
  setAudioPlaying,
  audioPlaying,
  playingUrl
}) => {
  const removeSaved = async (id) => {
    await axiosInstance
      .delete(`/userSaved/${id}`)
      .then((res) => {
        updatePodcast(id)
        toast.success(<IntlMessages id={'alerts.success_change'} />)
      })
      .catch((res) => {
        toast.error(<IntlMessages id={'alerts.something_went_wrong'} />)
      })
  }

  function getMinutes(url) {
    var au = document.createElement('audio')

    au.src = url

    au.onloadedmetadata = () => {
      getmetadata(au.duration)
    }
  }

  function getmetadata(t) {
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
    <div className='row m-0 p-0'>
      {data.length > 0 &&
        data.map((data) => (
          <SPodcast
            props={data}
            savedid={'data'}
            url={url}
            key={data?.SavedId}
            data={data.Podcast}
            playingUrl={playingUrl}
            audioPlaying={audioPlaying}
            setAudioPlaying={setAudioPlaying}
            removeSavede={removeSaved}
          />
        ))}
    </div>
  )
}
export default Podcast
