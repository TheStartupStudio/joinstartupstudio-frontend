import React from 'react'
import Modal from 'react-bootstrap/Modal'

const PrerequisiteModal = (props) => {
  return (
    <Modal
      {...props}
      show={props.show}
      onHide={props.onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div
          className="d-flex justify-content-end cursor-pointer fw-bold pb-3"
          style={{ fontSize: '18px' }}
          onClick={() => props.onHide()}
        >
          X
        </div>
        <h3
          className="d-flex justify-content-center fw-bold"
          style={{ color: 'rgba(219, 54, 148, 1)' }}
        >
          {props.title}
        </h3>
        <div className="p-5">
          <p
            className="d-flex justify-content-center text-center align-items-center h-100"
            style={{ fontSize: '19px' }}
          >
            {props.content}
          </p>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PrerequisiteModal
