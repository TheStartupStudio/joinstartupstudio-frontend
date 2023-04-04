import React from 'react'
import { Modal } from 'react-bootstrap'

const CertificationSubmitModal = ({ show, onHide, loading, submit }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop='static'
      keyboard={false}
      className='no-border-modal confirmation-modal approve'
      centered
    >
      <Modal.Header
        className='contact-us-title my-auto p-0 mx-4'
        style={{ border: 0 }}
      >
        <button
          type='button'
          className='btn-close mt-2'
          aria-label='Close'
          onClick={onHide}
        />
      </Modal.Header>
      <Modal.Body>
        <div className='my-2 my-md-4 mx-2 mx-md-5'>
          <h3 className='title'>
            Are you sure you want submit for certification?
          </h3>
          <div className='mt-4 text-center'>
            <button
              className='cancel-subscription-button'
              disabled={loading}
              style={{ backgroundColor: '#01C5D1', width: '100%' }}
              onClick={() => {
                submit()
              }}
            >
              {loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                `SUBMIT`
              )}
            </button>
          </div>
          <div className='mt-2 text-center'>
            <p onClick={onHide} className='cancel'>
              CANCEL
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default CertificationSubmitModal
