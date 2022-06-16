import React from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

export const ConnectionRequestedModal = (props) => {
  const navigate = useHistory()

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='subscription-modal'
      className='requested-modal'
    >
      <Modal.Header className='connection-modal-header mx-4'>
        <button
          type='button'
          className='btn-close me-3 mt-3'
          aria-label='Close'
          onClick={props.onHide}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <div className='mt-4 mb-5 blocked-user-modal px-md-3 text-center'>
          <h4>Your connection request was sent!</h4>
          <p>
            Once they respond, you’ll be able to view their portfolio and send
            them a message.
          </p>
          <button
            className='cancel-subscription-button accept-request-button'
            style={{ backgroundColor: '#F2359D' }}
            onClick={() => navigate.push('/my-connections')}
          >
            GREAT! THANKS
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
