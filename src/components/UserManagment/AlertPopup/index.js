import React from 'react'
import { Modal } from 'react-bootstrap'
import './index.css'

const UserManagementPopup = ({ 
  show, 
  onHide, 
  onConfirm,
  title = 'Delete User?',
  message = "Are you sure you want to delete the user(s)? User and all work will be removed from the system. This action cannot be undone.",
  cancelText = 'NO, TAKE ME BACK',
  confirmText = 'Yes, Delete User(s)',
  loading = false,
  icon = null
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
        {/* Icon */}

        <div className="d-flex flex-column justify-content-start">
        <div className="popup-icon-container">
          {icon ? (
            icon
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.1266 17.4997H3.87405C2.33601 17.4997 1.37357 15.8361 2.14023 14.5027L8.26651 3.84833C9.03552 2.51092 10.9651 2.51092 11.7341 3.84833L17.8604 14.5027C18.6271 15.8361 17.6646 17.4997 16.1266 17.4997Z" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10 7.5V10.8333" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10 14.1753L10.0083 14.1661" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          )}
        </div>

        {/* Title */}
        <h3 className="popup-title">{title}</h3>
        </div>
        {/* Message */}
        <p className="popup-message">{message}</p>

        {/* Action Buttons */}
        <div className="popup-actions">
          <button
            type="button"
            className="popup-btn cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
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
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default UserManagementPopup