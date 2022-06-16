import React from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'

const DeleteConfirmedModal = (props) => {
  const type =
    props.type === 'experience'
      ? 'experience'
      : props.type === 'education'
      ? 'educational experience'
      : 'accomplishment'

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      // id='subscription-modal'
      className='background-delete-modal'
    >
      <Modal.Header className='pb-0 mx-4 d-flex justify-content-end'>
        <button
          type='button'
          className='btn-close mt-4'
          aria-label='Close'
          onClick={() => {
            props.onHide()
          }}
          style={{ opacity: '1' }}
        />
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex justify-content-center align-items-center flex-column'>
          <h1>Your {type} was deleted.</h1>
          <button
            className='d-block mx-auto mt-2 mt-md-5'
            onClick={() => {
              props.onHide()
            }}
          >
            GOT IT!
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default DeleteConfirmedModal
