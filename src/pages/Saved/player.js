import React, { useState, useEffect } from 'react'

const Player = (props) => {
  const [song, setSong] = useState()
  const audio = new Audio(song)

  const handlePlayPause = () => {
    audio.pause()
    if (props.isPlaying) {
      setSong(props.url)
      // props.isPlaying(true)
      audio.play()
    } else if (props.isPlaying == false) {
      // setIsaudionplaying(false)
      audio.pause()
    }
  }

  useEffect(() => {
    handlePlayPause()
  }, [props.url, props.isPlaying])

  return (
    <div className='col-12 d-flex justify-content-center my-2 '>
      <p onClick={handlePlayPause()}>
        {props.isPlaying ? 'Song is Playing' : 'Song is Paused'}
      </p>
    </div>
  )
}
export default Player
