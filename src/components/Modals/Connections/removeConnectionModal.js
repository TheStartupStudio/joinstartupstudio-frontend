import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'

const RemoveConnectionModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='subscription-modal'
    >
      <Modal.Header
        className='contact-us-title my-auto p-0 mx-4'
        style={{ border: 0 }}
      >
        <button
          type='button'
          className='btn-close mt-2'
          aria-label='Close'
          // onClick={() => closeModal()}
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body>
        <div className='blocked-user-modal my-2 my-md-4 mx-2 mx-md-5'>
          <p>
            Are you sure you want to remove your connection to this user? Once
            removed, they will not be able to contact you.
            <br />
            <br />
            <i>
              If you want to keep them from contacting you in the future, please
              block the user.
            </i>
          </p>
          <div className='mt-4 text-center'>
            <button
              className='cancel-subscription-button'
              disabled={props.removingLoader}
              style={{ backgroundColor: '#01C5D1', width: '100%' }}
              onClick={() => {
                props.removeConnection()
              }}
            >
              {props.removingLoader ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                `END CONNECTION`
              )}
            </button>
          </div>
          <div className='mt-2 text-center'>
            <p
              style={{
                color: '#F2359D',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onClick={() => !props.removingLoader && props.blockAndReport()}
              // disabled={props.removingLoader}
            >
              BLOCK & REPORT USER
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default RemoveConnectionModal
