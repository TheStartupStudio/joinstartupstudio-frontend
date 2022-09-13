import React from 'react'
import { Modal } from 'react-bootstrap'

const DeleteNoteModal = (props) => {
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
            className='cancel-subscription-button'
            style={{ backgroundColor: '#F2359D' }}
            onClick={() => props.deleteNote()}
          >
            Yes
          </button>
          <button
            className='cancel-subscription-button mt-2'
            style={{ backgroundColor: '#01c5d1' }}
            onClick={() => props.onHide()}
          >
            No, THANKS
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DeleteNoteModal
