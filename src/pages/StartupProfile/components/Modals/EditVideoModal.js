import { faLink } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import axiosInstance from '../../../../utils/AxiosInstance'
import { toast } from 'react-toastify'

const EditVideoModal = (props) => {
  const [video, setVideo] = useState(props?.project?.company_video)

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      className=''
    >
      <Modal.Header className='contact-us-title my-auto p-0 mx-4'>
        <h3 className='mb-0 pt-4 mt-2 '>EDIT PROMO VIDEO LINK</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body className='row'>
        <div className='col-12 col-md-8 mx-auto'>
          <span className='edit_video_modal_promo_title d-block mb-4 mt-4'>
            PROMO VIDEO
          </span>
          <div className='d-flex'>
            <FontAwesomeIcon icon={faLink} className='me-2 my-auto' />
            <input
              type='text'
              height={'36px'}
              onChange={(e) => setVideo(e.target.value)}
              className='flex-grow-1 edit-video-modal-input px-3 py-1'
              defaultValue={
                props?.project?.company_video
                  ? props?.project?.company_video
                  : ''
              }
            />
          </div>
          <button
            className='saveEditedVideo mt-4 '
            onClick={() => props.handleSubmit(video)}
          >
            Save
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default EditVideoModal
