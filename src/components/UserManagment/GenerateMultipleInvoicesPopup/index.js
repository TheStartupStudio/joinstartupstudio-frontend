import React from 'react'
import { Modal } from 'react-bootstrap'
import '../AlertPopup/index.css'

const GenerateMultipleInvoicesPopup = ({ 
  show, 
  onHide, 
  onConfirm,
  loading = false
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
              <path d="M10 9.16699H12.0833H14.1667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 5.83301H12.0833H14.1667" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.66667 12.5V3.1C6.66667 2.76863 6.93529 2.5 7.26667 2.5H16.9C17.2314 2.5 17.5 2.76863 17.5 3.1V14.1667C17.5 16.0076 16.0076 17.5 14.1667 17.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.49935 12.5H6.66602H10.2327C10.5641 12.5 10.8359 12.7682 10.8662 13.0982C10.9879 14.4253 11.5521 17.5 14.166 17.5H6.66602H5.49935C3.84249 17.5 2.49935 16.1569 2.49935 14.5C2.49935 13.3954 3.39478 12.5 4.49935 12.5Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h3 className="popup-title">Generate Multiple Invoices?</h3>
        </div>

        <p className="popup-message" style={{textAlign: 'center', width: '100%'}}>
          Clicking continue will generate invoices for all selected organizations. Once generated, you can view the invoices by clicking "View Invoices" above the main Organization list.
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
              'CONTINUE'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default GenerateMultipleInvoicesPopup