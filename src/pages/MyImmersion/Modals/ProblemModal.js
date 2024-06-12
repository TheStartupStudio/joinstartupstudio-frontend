import React from 'react'
import Modal from 'react-bootstrap/Modal'

const ProblemModal = (props) => {
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
        <h4
          className="d-flex justify-content-center pb-4"
          style={{ color: '#51c7df' }}
        >
          {props.currentCompanyName}
        </h4>
        <div className="p-5">
          <p className="d-flex justify-content-center text-center align-items-center h-100">
            {props.problemDescription}
          </p>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ProblemModal
