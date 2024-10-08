import React from 'react'
import { Modal } from 'react-bootstrap'
import '../../style/index.css'
const DeleteFounder = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      className='delete-Founder-Modal'
    >
      <Modal.Body
        className='mx-auto px-5 my-auto'
        style={{ minHeight: '360px' }}
      >
        <div className='delete-project-modal px-5 mx-lg-5 my-auto d-flex flex-row mt-5 row text-center'>
          <p className='px-lg-5 mx-lg-5 my-auto mb-2'>
            Are you sure you want to delete this Founder?
          </p>
          <span
            className='col-12 mt-5 py-2 mb-2'
            style={{ backgroundColor: '#51C7DF', color: '#ffff' }}
            onClick={() => {
              props.removeFounder()
            }}
          >
            I’M SURE. DELETE THIS FOUNDER.
          </span>
          <span className='col-12 py-2' onClick={() => props.onHide()}>
            NO! DON’T DELETE THIS FOUNDER
          </span>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default DeleteFounder
