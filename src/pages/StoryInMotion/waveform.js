import React, { useEffect, useRef, useState } from 'react'
import {
  faPlay,
  faPause,
  faStepForward,
  faStepBackward
} from '@fortawesome/free-solid-svg-icons'
import WaveSurfer from 'wavesurfer.js'
import './StoryInMotion.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useDispatch } from 'react-redux'
import { createWatchedPodcast } from '../../redux/platformBadges/actions'

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
  isPlaying,
  selectedTrack
}) {
  const dispatch = useDispatch();
  const wavesurfer = useRef(null);
  const [duration, setDuration] = useState();
  const [now, setNow] = useState();
  const [isPlayingLocal, setIsPlayingLocal] = useState(false); // Local state for play/pause button

  useEffect(() => {
    if (url) {
      wavesurfer.current = WaveSurfer.create({
        container: document.querySelector('#waveform'),
        backend: 'MediaElement',
        normalize: true,
        interact: false
      });
      wavesurfer.current.load(url);

      wavesurfer?.current?.on('finish', function async() {
        wavesurfer?.current?.pause();
        setIsPlayingLocal(false); // Reset to play button when finished
        isPlayingParent(false);
        dispatch(createWatchedPodcast(selectedTrack.id));
      });

      wavesurfer.current.on('ready', function async() {
        setDuration(wavesurfer?.current?.getDuration());
      });

      return () => wavesurfer.current.destroy();
    }
    // eslint-disable-next-line
  }, [url]);

  wavesurfer?.current?.on('audioprocess', function async() {
    setNow(wavesurfer.current.getCurrentTime());
  });

  const handlePlayPause = async () => {
    if (url) {
      wavesurfer?.current?.playPause();
      setIsPlayingLocal((prev) => !prev); // Toggle local play/pause state
      isPlayingParent(!isPlayingLocal); // Update parent state
    }
  };

  const goBackward = () => {
    wavesurfer.current.skip(-10);
    setNow(wavesurfer.current.getCurrentTime());
  };

  const goForward = () => {
    wavesurfer.current.skip(10);
    setNow(wavesurfer.current.getCurrentTime());
  };

  function getMinutes(t) {
    var min = parseInt(parseInt(t) / 60);
    var sec = parseInt(t % 60);
    if (sec < 10) {
      sec = '0' + sec;
    }
    if (min < 10) {
      min = '0' + min;
    }
    return min + ':' + sec;
  }

  return (
    <div>
      <div>
        <p style={{ color: '#666', fontSize: '14px' }}>
          {selectedTrack?.date
            ? new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }).format(new Date(selectedTrack.date))
            : 'Unknown Date'}
        </p>
      </div>
      <div
        id="waveform"
        style={{ overflow: 'none' }}
        className="waveform formWaveSurferOptions wform"
      />
      <div className="controls d-flex">
        <span className="float-start col-1 col-sm-4 my-auto">
          {now ? getMinutes(now) : '00:00'}
        </span>

        <div className="col-9 col-sm-4 text-center">
          <FontAwesomeIcon
            icon={faStepBackward}
            style={darts}
            onClick={goBackward}
          />
          {isPlayingLocal ? (
            <FontAwesomeIcon
              icon={faPause}
              style={darts}
              className="mx-4"
              onClick={handlePlayPause} // Pause when clicked
            />
          ) : (
            <FontAwesomeIcon
              icon={faPlay}
              style={darts}
              className="mx-4"
              onClick={handlePlayPause} // Play when clicked
            />
          )}
        </div>
        <span className="float-end col-1 col-sm-4 my-auto">
          <span className="float-end my-auto">
            {duration ? getMinutes(duration) : '00:00'}
          </span>
        </span>
        <hr style={Style.hr} />
      </div>
    </div>
  );
}
