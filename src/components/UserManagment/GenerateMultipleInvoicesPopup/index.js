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
      <div className="popup-content">
        <div className="popup-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#FFF4E5"/>
            <path d="M24 16V26M24 30H24.01" stroke="#FF9800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h3 className="popup-title">Generate Multiple Invoices?</h3>
        
        <p className="popup-message">
          You are about to generate invoices for {selectedOrganizations.length} organization(s). 
          This will create new invoices based on each organization's current pricing and active user count.
        </p>

        <div className="popup-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onHide}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="confirm-btn"
            onClick={onConfirm}
          >
            YES, GENERATE INVOICES
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default GenerateMultipleInvoicesPopup