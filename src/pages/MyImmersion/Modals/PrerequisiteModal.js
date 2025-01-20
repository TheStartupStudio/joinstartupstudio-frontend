import React from 'react'
import Modal from 'react-bootstrap/Modal'

const PrerequisiteModal = (props) => {
  return (
    <Modal
      {...props}
      show={props.show}
      onHide={props.onHide}
      size='xl'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Body style={{ height: '300px' }}>
        <div
          className='d-flex justify-content-end cursor-pointer fw-bold pb-3'
          style={{ fontSize: '18px' }}
          onClick={() => props.onHide()}
        >
          X
        </div>
        <h3
          className='prerequisite-title d-flex justify-content-center '
          style={{
            color: '#ff3399',
            fontSize: ' 17px',
            marginBottom: '-30px',
            marginTop: '35px',
            fontWeight: '600'
          }}
        >
          {props.title}
        </h3>
        <div className='p-5'>
          <p
            className='prerequisite-subtitle d-flex justify-content-center text-center align-items-center h-100'
            style={{ fontSize: '19px', marginTop: '-10px', fontWeight: '100' }}
          >
            {props.content}
          </p>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PrerequisiteModal
