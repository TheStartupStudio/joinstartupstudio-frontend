import React from 'react'
import { Modal } from 'react-bootstrap'
import '../AlertPopup/index.css'

const DeleteInvoicePopup = ({ 
  show, 
  onHide, 
  onConfirm,
  loading = false,
  count = 1
}) => {
  
  const handleConfirm = () => {
    if (!loading) {
      onConfirm()
    }
  }

  const handleCancel = () => {
    if (!loading) {
      onHide()
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop={loading ? 'static' : true}
      keyboard={!loading}
      className="user-management-popup-modal"
      centered
      size="md"
    >
      <div className="user-management-popup-content">
        <div className="d-flex flex-column justify-content-start">
          <div className="popup-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.1266 17.4997H3.87405C2.33601 17.4997 1.37357 15.8361 2.14023 14.5027L8.26651 3.84833C9.03552 2.51092 10.9651 2.51092 11.7341 3.84833L17.8604 14.5027C18.6271 15.8361 17.6646 17.4997 16.1266 17.4997Z" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 7.5V10.8333" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 14.1753L10.0083 14.1661" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h3 className="popup-title">Delete Invoice{count > 1 ? 's' : ''}?</h3>
        </div>

        <p className="popup-message" style={{textAlign: 'center', width: '100%'}}>
          Are you sure you want to delete the invoice{count > 1 ? 's' : ''}? This action cannot be undone.
        </p>

        <div className="popup-actions">
          <button
            type="button"
            className="popup-btn cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            NO, TAKE ME BACK
          </button>
          <button
            type="button"
            className="popup-btn confirm-btn"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              'YES, DELETE'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteInvoicePopup