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

  // const style = {
  //   firstDiv: {
  //     maxHeight: '160px',
  //     minHeight: '160px',
  //     overflow: 'hidden',
  //     paddingTop: '1rem'
  //   }
  // }

  //  getMinutes = async(url)=> {
  //   var au = document.createElement('audio')
  //   await au.setAttribute('id', 'audio')
  //   await au.src = url
  //   console.log(au)
  //    let time =await document
  //     .getElementById('audio')
  //     .addEventListener('loadeddata', myFunction)
  //   let timeDuration
  //   // au.onloadedmetadata = async function (e) {
  //   // console.log(e.path[0].duration, 'e')
  //   // await return ()=>{
  //   //    this.timeDuration = e.path[0].duration

  //   function myFunction(params) {
  //     console.log(`heree`)
  //   }
  //   // }
  //   // console.log(
  //   au.addEventListener('loadeddata', function () {
  //     console.log('Audio data loaded')
  //     console.log(this.duration)
  //   })
  //   // )
  //   // if (getmetadata(au.duration)) {
  //   //   timeDuration = getmetadata(au.duration)
  //   //   a(getmetadata(au.duration))
  //   // }
  //   // return timeDuration
  // }

  // function getmetadata(t) {
  //   var min = parseInt(parseInt(t) / 60)
  //   var sec = parseInt(t % 60)
  //   if (sec < 10) {
  //     sec = '0' + sec
  //   }
  //   if (min < 10) {
  //     min = '0' + min
  //   }
  //   return min + ':' + sec
  // }
  // console.log(
  //   getMinutes(
  //     'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3'
  //   )
  // )

  // const style = {
  //   firstDiv: {
  //     maxHeight: '160px',
  //     minHeight: '160px',
  //     overflow: 'hidden',
  //     paddingTop: '1rem'
  //   }
  // }

  function getMinutes(url) {
    var au = document.createElement('audio')

    au.src = url

    au.onloadedmetadata = () => {
      // console.log(au.duration)
      getmetadata(au.duration)
    }
  }

  function getmetadata(t) {
    // console.log('10')
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
