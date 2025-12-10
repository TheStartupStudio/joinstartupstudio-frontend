import React from 'react'
import { Modal } from 'react-bootstrap'
import '../AlertPopup/index.css'

const GenerateMultipleInvoicesPopup = ({ show, onHide, onConfirm, selectedOrganizations = [] }) => {
  // Get unique organization IDs count
  const uniqueOrgIds = [...new Set(selectedOrganizations.map(inv => inv.organizationId).filter(Boolean))]
  const orgCount = uniqueOrgIds.length

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop={true}
      keyboard={true}
      className="user-management-popup-modal"
      centered
    >
      <div className="popup-content user-management-popup-content">
        <div className="popup-icon-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.1256 17.4997H3.87307C2.33504 17.4997 1.37259 15.8361 2.13926 14.5027L8.26554 3.84833C9.03455 2.51092 10.9641 2.51092 11.7332 3.84833L17.8594 14.5027C18.6261 15.8361 17.6637 17.4997 16.1256 17.4997Z" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M10 7.5V10.8333" stroke="black" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M10 14.1753L10.0083 14.1661" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h3 className="popup-title">Generate Multiple Invoices?</h3>
        
        <p className="popup-message">
         Clicking continue will generate invoices for all selected organizations. Once generated, you can view 
         the invoices by clicking “View Invoices “ above the main Organization list.
        </p>

        <div className="popup-actions">
          <button
            type="button"
            className="confirm-btn"
            style={{
              maxWidth: '250px',
              width: '100%',
              borderRadius: '8px',
              background: 'var(--COLORS-Light-Grey, #DEE1E6)',
              boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)',
              color: '#000',
            }}
            onClick={onHide}
          >
            No, take me back
          </button>
          <button
            type="button"
            className=" cancel-btn"
            style={{
              maxWidth: '250px',
              width: '100%'
            }}
            onClick={onConfirm}
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default GenerateMultipleInvoicesPopup