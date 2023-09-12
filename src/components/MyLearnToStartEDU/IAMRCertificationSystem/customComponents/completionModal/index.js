import React from 'react'
import { Modal } from 'react-bootstrap'
import './style.css'

const CompletionModal = ({ show, onHide, loading, title, description }) => {
  const hideModal = () => {
    if (loading) return
    onHide()
  }

  console.log('show', show)

  return (
    <Modal
      show={show}
      onHide={hideModal}
      backdrop="static"
      className="completion-modal"
      keyboard={false}
      centered
    >
      <Modal.Header
        className="contact-us-title my-auto p-0 mx-4"
        style={{ border: 0 }}
      >
        <button
          type="button"
          className="btn-close mt-2"
          aria-label="Close"
          onClick={hideModal}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="my-2 my-md-4 mx-2 mx-md-5 text-center">
          <h3 className="title fw-bold" style={{ fontSize: '21px' }}>
            {title}
          </h3>
          <p className="description my-3 " style={{ fontSize: '18px' }}>
            {description}
          </p>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CompletionModal
