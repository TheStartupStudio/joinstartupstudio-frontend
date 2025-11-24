import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import './index.css'

const ManagePaymentModal = ({ show, onHide, paymentData, onSave }) => {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [formData, setFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    zipCode: '',
    billingAddress: '',
    city: '',
    state: '',
    billingZipCode: ''
  })

  useEffect(() => {
    if (paymentData) {
      setFormData({
        nameOnCard: paymentData.nameOnCard || 'My Organization',
        cardNumber: paymentData.cardNumber || '1234567890',
        expirationDate: paymentData.expirationDate || '10/27',
        cvc: paymentData.cvc || '123',
        zipCode: paymentData.zipCode || '36741',
        billingAddress: paymentData.billingAddress || '1234 My Home Street',
        city: paymentData.city || 'Orlando',
        state: paymentData.state || 'FL',
        billingZipCode: paymentData.billingZipCode || '34761'
      })
      setPaymentMethod(paymentData.paymentMethod || 'credit-card')
    }
  }, [paymentData, show])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)
  }

  const handleSaveChanges = async () => {
    // Validate required fields
    if (paymentMethod === 'credit-card') {
      if (!formData.nameOnCard || !formData.cardNumber || !formData.expirationDate || !formData.cvc) {
        toast.warning('Please fill in all card information fields')
        return
      }
    }

    if (!formData.billingAddress || !formData.city || !formData.state || !formData.billingZipCode) {
      toast.warning('Please fill in all billing address fields')
      return
    }

    setLoading(true)
    try {
      if (onSave) {
        await onSave({ ...formData, paymentMethod })
      }
      toast.success('Payment information updated successfully!')
      setLoading(false)
      onHide()
    } catch (error) {
      console.error('Error saving payment information:', error)
      toast.error('Failed to update payment information')
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onHide()
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="md"
      className="manage-payment-modal"
    >
      <Modal.Header className="payment-modal-header">
        <div className="header-btn-container">
          <button 
            className="back-button"
            onClick={handleCancel}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M23.125 15H7.5M7.5 15L15 7.5M7.5 15L15 22.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2.5 6.66667C2.5 5.74619 3.24619 5 4.16667 5H15.8333C16.7538 5 17.5 5.74619 17.5 6.66667V13.3333C17.5 14.2538 16.7538 15 15.8333 15H4.16667C3.24619 15 2.5 14.2538 2.5 13.3333V6.66667Z" stroke="black" strokeWidth="1.5"/>
            <path d="M2.5 8.33333H17.5" stroke="black" strokeWidth="1.5"/>
          </svg>
        </div>
        <h5 className="modal-title">Manage Payment Information</h5>
      </Modal.Header>

      <Modal.Body className="payment-modal-body">
        {/* Payment Method Section */}
        <div className="payment-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_3587_14757)">
                <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
              </g>
            </svg>
            <span>Payment Method*</span>
          </div>
          <div className="payment-method-options">
            <label className="payment-method-radio">
              <input
                type="radio"
                name="paymentMethod"
                value="credit-card"
                checked={paymentMethod === 'credit-card'}
                onChange={() => handlePaymentMethodChange('credit-card')}
              />
              <span className="radio-custom"></span>
              <span className="radio-label">Credit Card</span>
            </label>
            <label className="payment-method-radio">
              <input
                type="radio"
                name="paymentMethod"
                value="bank-account"
                checked={paymentMethod === 'bank-account'}
                onChange={() => handlePaymentMethodChange('bank-account')}
              />
              <span className="radio-custom"></span>
              <span className="radio-label">Bank Account</span>
            </label>
          </div>
          <p className="payment-note">*Invoices will automatically be paid using this payment method</p>
        </div>

        {/* Card Information Section */}
        {paymentMethod === 'credit-card' && (
          <div className="payment-section">
            <div className="section-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_3587_14757)">
                  <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                </g>
              </svg>
              <span>Card Information</span>
            </div>
            <div className="card-info-fields">
              <div className="form-group">
                <label className="field-label">Name On Credit Card</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="payment-input"
                    value={formData.nameOnCard}
                    onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                    placeholder="My Organization"
                  />
                  <button className="edit-icon-btn" type="button">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Card Number</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="payment-input"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                    placeholder="1234567890"
                    maxLength="16"
                  />
                  <button className="edit-icon-btn" type="button">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </div>
              </div>

              <div className="card-details-row">
                <div className="form-group">
                  <label className="field-label">Expiration (MM/YY)</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      className="payment-input"
                      value={formData.expirationDate}
                      onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                      placeholder="10/27"
                      maxLength="5"
                    />
                    <button className="edit-icon-btn" type="button">
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">CVC</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      className="payment-input"
                      value={formData.cvc}
                      onChange={(e) => handleInputChange('cvc', e.target.value)}
                      placeholder="123"
                      maxLength="4"
                    />
                    <button className="edit-icon-btn" type="button">
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label">Zip Code</label>
                  <div className="input-with-icon">
                    <input
                      type="text"
                      className="payment-input"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="36741"
                      maxLength="10"
                    />
                    <button className="edit-icon-btn" type="button">
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Address Section */}
        <div className="payment-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_3587_14757)">
                <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
              </g>
            </svg>
            <span>Billing Address</span>
          </div>
          <div className="billing-address-fields">
            <div className="form-group">
              <label className="field-label">Address</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  className="payment-input"
                  value={formData.billingAddress}
                  onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                  placeholder="1234 My Home Street"
                />
                <button className="edit-icon-btn" type="button">
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
              </div>
            </div>

            <div className="address-details-row">
              <div className="form-group">
                <label className="field-label">City</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="payment-input"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Orlando"
                  />
                  <button className="edit-icon-btn" type="button">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">State</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="payment-input"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="FL"
                    maxLength="2"
                  />
                  <button className="edit-icon-btn" type="button">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Zip Code</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="payment-input"
                    value={formData.billingZipCode}
                    onChange={(e) => handleInputChange('billingZipCode', e.target.value)}
                    placeholder="34761"
                    maxLength="10"
                  />
                  <button className="edit-icon-btn" type="button">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button 
            className="btn-cancel-payment"
            onClick={handleCancel}
            disabled={loading}
          >
            CANCEL
          </button>
          <button 
            className="btn-save-payment"
            onClick={handleSaveChanges}
            disabled={loading}
          >
            {loading ? 'SAVING...' : 'SAVE'}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ManagePaymentModal