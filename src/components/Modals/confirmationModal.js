import React from 'react'
import { Modal } from 'react-bootstrap'

export const ConfirmationModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='subscription-modal'
    >
      <Modal.Body>
        <div className='mt-4 mb-4 blocked-user-modal confirmation-modal px-md-5 text-center'>
          <p>{props.message}</p>
          <button
            className='cancel-subscription-button accept-request-button'
            style={{ backgroundColor: '#F2359D' }}
            onClick={() => props.onHide()}
          >
            THANKS
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
