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
    // Bank Account fields
    nameOnBankAccount: '',
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking',
    // Billing Address (shared)
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
        // Bank Account
        nameOnBankAccount: paymentData.nameOnBankAccount || 'My Organization',
        routingNumber: paymentData.routingNumber || '1234567890',
        accountNumber: paymentData.accountNumber || '1234567890',
        accountType: paymentData.accountType || 'checking',
        // Billing Address
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
    } else if (paymentMethod === 'bank-account') {
      if (!formData.nameOnBankAccount || !formData.routingNumber || !formData.accountNumber) {
        toast.warning('Please fill in all bank account information fields')
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
      size="sm"
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
            <path d="M18.3337 4.99992V14.9999C18.3337 15.4583 18.1706 15.8508 17.8445 16.1774C17.5184 16.5041 17.1259 16.6671 16.667 16.6666H3.33366C2.87533 16.6666 2.4831 16.5035 2.15699 16.1774C1.83088 15.8513 1.66755 15.4588 1.66699 14.9999V4.99992C1.66699 4.54159 1.83033 4.14936 2.15699 3.82325C2.48366 3.49714 2.87588 3.33381 3.33366 3.33325H16.667C17.1253 3.33325 17.5178 3.49659 17.8445 3.82325C18.1712 4.14992 18.3342 4.54214 18.3337 4.99992ZM3.33366 6.66659H16.667V4.99992H3.33366V6.66659ZM3.33366 9.99992V14.9999H16.667V9.99992H3.33366Z" fill="black"/>
          </svg>
        </div>
        <h5 className="modal-title">Manage Payment Information</h5>
      </Modal.Header>

      <Modal.Body className="payment-modal-body">
        {/* Payment Method Section */}
        <div>
          <div className="section-header">
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
          <div>
            <div className="section-header">
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

        {/* Bank Account Information Section - Only show when bank-account is selected */}
        {paymentMethod === 'bank-account' && (
          <div>
            <div className="section-header">
              <span>Bank Information</span>
            </div>
            <div className="bank-info-fields">
              <div className="form-group">
                <label className="field-label">Name On Bank Account</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="payment-input"
                    value={formData.nameOnBankAccount}
                    onChange={(e) => handleInputChange('nameOnBankAccount', e.target.value)}
                    placeholder="My Organization"
                  />
                  <button className="edit-icon-btn" type="button">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Routing Number</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="payment-input"
                    value={formData.routingNumber}
                    onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                    placeholder="1234567890"
                    maxLength="9"
                  />
                  <button className="edit-icon-btn" type="button">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Account Number</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    className="payment-input"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    placeholder="1234567890"
                    maxLength="17"
                  />
                  <button className="edit-icon-btn" type="button">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </div>
              </div>

              {/* Account Type */}
              <div>
                <div className="section-header">
                  <span>Account Type</span>
                </div>
                <div className="payment-method-options">
                  <label className="payment-method-radio">
                    <input
                      type="radio"
                      name="accountType"
                      value="checking"
                      checked={formData.accountType === 'checking'}
                      onChange={(e) => handleInputChange('accountType', e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">Checking</span>
                  </label>
                  <label className="payment-method-radio">
                    <input
                      type="radio"
                      name="accountType"
                      value="savings"
                      checked={formData.accountType === 'savings'}
                      onChange={(e) => handleInputChange('accountType', e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">Savings</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Address Section - Always visible */}
        <div>
          <div className="section-header">
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