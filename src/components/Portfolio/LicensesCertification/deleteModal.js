import React from 'react'
import { Modal } from 'react-bootstrap'

const DeleteModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      keyboard={true}
      backdrop='static'
      backdropClassName={'static'}
      className='mt-md-5 border-1 pt-md-5 px-md-5 row gx-md-5'
    >
      <Modal.Body
        className='px-md-5 '
        style={{
          border: '.2px solid rgba(0,0,0,0.4)'
        }}
      >
        <div className='cancel-subscription mt-5 px-md-5'>
          Are you sure you want to delete your license or certificate?
        </div>
        <div className='mt-4 text-center'>
          <button
            className='cancel-subscription-button'
            style={{ backgroundColor: '#01C5D1' }}
            onClick={() => {
              props.updateSelect('true')
              props.onHide()
            }}
          >
            YES, DELETE IT
          </button>
        </div>
        <div className='mt-2 mb-5 text-center'>
          <button
            className='cancel-subscription-button'
            style={{ backgroundColor: 'none', color: '#BBBDBF' }}
            onClick={() => props.onHide()}
          >
            NO! DON’T DELETE IT
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DeleteModal
