import React from 'react'
import { Modal } from 'react-bootstrap'
import ReactPlayer from 'react-player'
import {
  faPause,
  faPlay,
  faHeart as heartSaved,
  faTimes,
  faUser,
  faUsers,
  faShareAltSquare
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const VideoModal = (props) => {
  return (
    <>
      {' '}
      <Modal
        show={props.show}
        onHide={props.onHide}
        // backdrop='static'
        keyboard={false}
        // wrapper
        // style={{ width: '' }}
        centered={true}
        className='videoPlayerModal'
      >
        <div className='video-options d-flex'>
          <FontAwesomeIcon
            icon={faTimes}
            style={{ width: '25px', height: '30px', color: '#FFFFFF' }}
            onClick={() => {
              props.onHide()
            }}
          />
        </div>
        <Modal.Body className='p-0'>
          <ReactPlayer
            // className='react-player'
            url={props?.url}
            light={props?.thumbnail}
            controls={true}
            width='100%'
            // height='100%'
            config={{
              file: { attributes: { controlsList: 'nodownload' } }
            }}
            playing={true}
          />

          {/* </div> */}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default VideoModal
