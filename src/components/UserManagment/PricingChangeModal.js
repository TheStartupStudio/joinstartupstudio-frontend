import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import warningTriangle from '../../assets/images/academy-icons/svg/warning-triangle.svg'
import './PricingChangeModal.css'

const PricingChangeModal = ({ show, onHide, onConfirm }) => {
  const [applyToCurrentUsers, setApplyToCurrentUsers] = useState(false)

  const handleConfirm = () => {
    onConfirm(applyToCurrentUsers)
    setApplyToCurrentUsers(false) // Reset for next time
  }

  const handleCancel = () => {
    setApplyToCurrentUsers(false) // Reset checkbox
    onHide()
  }

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      backdrop={true}
      keyboard={true}
      className="pricing-change-modal"
      centered
      size="md"
    >

        
        <div style={{padding: '40px'}}>
            <div className="warning-icon-container">
                <img src={warningTriangle} alt="Warning" className="warning-icon" />
            </div>

            <h3 className="pricing-modal-title">Change Pricing?</h3>
        </div>
    
      <div className="pricing-modal-content">

        {/* Description */}
        <p className="pricing-modal-description">
          Are you sure you want to change your custom pricing? This change will
          impact all new subscriptions. Please select below if you want changes to
          apply to current subscriptions.
        </p>

        {/* Subtitle */}
        <p className="pricing-modal-subtitle">
          (If selected, subscriptions will renew at the new price; if not, users will renew at the
          same rate at which they originally subscribed.)
        </p>

        {/* Checkbox */}
        <div className="checkbox-container">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={applyToCurrentUsers}
              onChange={(e) => setApplyToCurrentUsers(e.target.checked)}
              className="pricing-checkbox"
            />
            <span className="checkbox-text">Apply changes to current users</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pricing-modal-actions">
          <button
            className="pricing-cancel-btn"
            onClick={handleCancel}
          >
            NO, TAKE ME BACK
          </button>
          <button
            className="pricing-save-btn"
            onClick={handleConfirm}
          >
            YES, SAVE PRICING
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default PricingChangeModal