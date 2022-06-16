import React from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'

const BlockedUserModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='subscription-modal'
    >
      <Modal.Header className='connection-modal-header mx-4'>
        <button
          type='button'
          className='btn-close me-3 mt-3'
          aria-label='Close'
          onClick={() => props.onHide()}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <div className='blocked-user-modal my-2 my-md-4 mx-2 mx-md-5'>
          <p>
            {props?.status?.includes('block') ? (
              <IntlMessages id='connection.user_blocked' />
            ) : (
              <IntlMessages id='connection.request_ignored' />
            )}
          </p>
          <div className='mt-4 text-center'>
            <button
              className='cancel-subscription-button accept-request-button'
              style={{ backgroundColor: '#F2359D', width: '100%' }}
              onClick={() => props.onHide()}
            >
              THANKS
            </button>
            {props.status === 'block-report-allowed' && (
              <h3 className='mt-3' onClick={() => props.reportUser()}>
                REPORT USER
              </h3>
            )}

            {/* <button
            className='cancel-subscription-button'
            style={{ backgroundColor: '#F2359D' }}
            onClick={() => props.respondConnection(0)}
          >
          </button>
          <button
            className='cancel-subscription-button'
            style={{ backgroundColor: '#F2359D' }}
            onClick={() => props.respondConnection(2)}
          >
          </button> */}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default BlockedUserModal
