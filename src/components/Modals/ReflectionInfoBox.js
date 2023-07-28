import React from 'react'
import { Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

export const ReflectionInfoBox = (props) => {
  const navigate = useHistory()

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='reflection-infobox-modal'
      className='reflection-infobox-modal'
    >
      <Modal.Header className='connection-modal-header general-modal-header mx-4'>
        <button
          type='button'
          className='btn-close me-3 mt-3'
          aria-label='Close'
          onClick={props.onHide}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <div className='mt-4 mb-5 blocked-user-modal px-md-3 text-center'>
          <h4>{props.title}</h4>
          <div dangerouslySetInnerHTML={{ __html: props.content }}></div>
          <button
            className='cancel-subscription-button accept-request-button'
            style={{ backgroundColor: '#F2359D' }}
            onClick={() => props.onHide()}
          >
            I UNDERSTAND, CONTINUE
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
