import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPencilAlt, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import CustomBirthDateCalendar from '../../CustomBirthDateCalendar'
import { invoiceApi } from '../../../utils/invoiceApi'
import './PayInvoiceModal.css'

const PayInvoiceModal = ({ show, onHide, invoiceData, onPay }) => {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [sendDate, setSendDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
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
    if (invoiceData) {
      setFormData({
        nameOnCard: invoiceData.nameOnCard || 'My Organization',
        cardNumber: invoiceData.cardNumber || '1234567890',
        expirationDate: invoiceData.expirationDate || '10/27',
        cvc: invoiceData.cvc || '123',
        zipCode: invoiceData.zipCode || '36741',
        // Bank Account
        nameOnBankAccount: invoiceData.nameOnBankAccount || 'My Organization',
        routingNumber: invoiceData.routingNumber || '1234567890',
        accountNumber: invoiceData.accountNumber || '1234567890',
        accountType: invoiceData.accountType || 'checking',
        // Billing Address
        billingAddress: invoiceData.billingAddress || '1234 My Home Street',
        city: invoiceData.city || 'Orlando',
        state: invoiceData.state || 'FL',
        billingZipCode: invoiceData.billingZipCode || '34761'
      })
      setPaymentMethod(invoiceData.paymentMethod || 'credit-card')
    }
  }, [invoiceData, show])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)
  }

  const handleDateChange = (date) => {
    setSendDate(date)
    setShowCalendar(false)
  }

  const formatDate = (date) => {
    if (!date) return ''
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${day}/${year}`
  }

  const handlePayNow = async () => {
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

    if (!invoiceData?.id) {
      toast.error('Invoice ID is required')
      return
    }

    setLoading(true)
    try {
      await invoiceApi.payInvoice(invoiceData.id, {
        paymentMethod,
        sendDate,
        ...formData
      })
      
      toast.success('Payment processed successfully!')
      if (onPay) {
        await onPay({ ...formData, paymentMethod, sendDate })
      }
      onHide()
    } catch (error) {
      console.error('Error processing payment:', error)
      toast.error(error.response?.data?.message || 'Failed to process payment')
    } finally {
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
      className="pay-invoice-modal"
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
        <h5 className="modal-title">Pay Invoice</h5>
      </Modal.Header>

      <Modal.Body className="payment-modal-body">
        {/* Payment Details Section */}
        <div className="payment-details-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_3587_14757)">
                <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
              </g>
            </svg>
            <span>Payment Details</span>
          </div>
          <div className="payment-details-content">
            <div className="payment-detail-row">
              <span className="detail-label">Invoice Total:</span>
              <span className="detail-value">${invoiceData?.total || '30,030.00'}</span>
            </div>
            <div className="payment-detail-row">
              <span className="detail-label">Due Date</span>
              <span className="detail-value">{invoiceData?.dueDate || '11/30/2025'}</span>
            </div>
          </div>
        </div>

        {/* Payment Send Date Section */}
        <div className="payment-send-date-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_3587_14757)">
                <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
              </g>
            </svg>
            <span>Payment Send Date</span>
          </div>
          <div className="send-date-content">
            <label>Select Date To Send Payment</label>
            <div className="date-input-wrapper" style={{width: 'fit-content'}}>
              <input
                type="text"
                className="date-input"
                value={formatDate(sendDate)}
                onClick={() => setShowCalendar(!showCalendar)}
                placeholder="Choose Date"
                readOnly
              />
              <FontAwesomeIcon 
                icon={faCalendar} 
                className="calendar-icon"
                onClick={() => setShowCalendar(!showCalendar)}
              />
              {showCalendar && (
              <div className="calendar-dropdown">
                <CustomBirthDateCalendar
                  selectedDate={sendDate}
                  onDateChange={handleDateChange}
                />
              </div>
            )}
            </div>
            
          </div>
        </div>

        {/* Payment Method Section */}
        <div>
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
          <div>
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

        {/* Bank Account Information Section - Only show when bank-account is selected */}
        {paymentMethod === 'bank-account' && (
          <div>
            <div className="section-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_3587_14757)">
                  <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                </g>
              </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_3587_14757)">
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                  </svg>
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
            onClick={handlePayNow}
            disabled={loading}
          >
            {loading ? 'PROCESSING...' : 'PAY NOW'}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PayInvoiceModal