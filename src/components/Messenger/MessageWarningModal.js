import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'

export const MessageWarningModal = (props) => {
  const [checked, setChecked] = useState(false)

  const agreed = () => {
    localStorage.setItem('agreedMessages', true)
    props.onHide()
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='warning-modal'
      className='edit-profile-modal'
    >
      <Modal.Body className='py-xs-2 py-sm-5'>
        <div className='mt-4 mb-4 px-lg-5 text-start'>
          <p>
            The Startup Studio Learner Platform has been designed to allow
            participants to build the best version of themselves. All
            participants are expected to act professionally at all times and in
            accordance with the terms and conditions set out by The Startup
            Studio. To ensure the safety and security of our participants we are
            constantly monitoring the platform for inappropriate or offensive
            language or images and chat you need to aggred.
          </p>
          <p className='fst-italic pt-2'>
            Warning: Any participants found using inappropriate language in
            message or images will be removed from the platform immediately and
            terminated from the Learn to Start program.
          </p>
        </div>
        <div className='text-center px-lg-5 d-flex flex-column align-items-center'>
          <div className='mb-3 d-flex justify-content-center'>
            <input
              className='me-2'
              type='checkbox'
              value=''
              id='flexCheckDefault'
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
            <label className='my-auto' htmlFor='flexCheckDefault'>
              I understand and agree to abide by these guidelines.
            </label>
          </div>

          <button
            className='edit-account'
            disabled={!checked}
            // style={{ backgroundColor: '#F2359D' }}
            onClick={() => agreed()}
          >
            GOT IT!
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
