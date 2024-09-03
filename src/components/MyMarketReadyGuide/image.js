import React from 'react'
import { Modal } from 'react-bootstrap'

export const Image = (props) => {
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header className='border-0'>
          <button
            type='button'
            className='btn-close me-5 pe-2 cursor-pointer'
            aria-label='Close'
            style={{ border: 0, cursor: 'pointer' }}
            onClick={props.onHide}
          ></button>
        </Modal.Header>
        <Modal.Body>
          <img src={props.file} width='100%' />
        </Modal.Body>
      </Modal>
    </>
  )
}
