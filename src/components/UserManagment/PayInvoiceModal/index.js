import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPencilAlt, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import CustomBirthDateCalendar from '../../CustomBirthDateCalendar'
import { invoiceApi } from '../../../utils/invoiceApi'
import { useSelector } from 'react-redux'
import axiosInstance from '../../../utils/AxiosInstance'
import './PayInvoiceModal.css'

const PayInvoiceModal = ({ show, onHide, invoiceData, onPay }) => {
  const [loading, setLoading] = useState(false)
  const [loadingPaymentMethod, setLoadingPaymentMethod] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [existingPaymentMethod, setExistingPaymentMethod] = useState(null)
  const [sendDate, setSendDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [formData, setFormData] = useState({
    billingAddress: '',
    city: '',
    state: '',
    billingZipCode: ''
  })

  const { user } = useSelector((state) => state.user.user)

  useEffect(() => {
    if (show) {
      fetchPaymentMethod()
    }
  }, [show])

  const fetchPaymentMethod = async () => {
    setLoadingPaymentMethod(true)
    try {
      const response = await axiosInstance.get('/client/payment-method')
      
      if (response.data?.data) {
        const payment = response.data.data
        setExistingPaymentMethod(payment)
        
        if (payment.type === 'card') {
          setPaymentMethod('credit-card')
        } else if (payment.type === 'us_bank_account') {
          setPaymentMethod('bank-account')
        }
        
        // Set billing address from payment method or fall back to university data
        if (payment.billing_details) {
          setFormData(prev => ({
            ...prev,
            billingAddress: payment.billing_details.address?.line1 || user?.University?.address || '',
            city: payment.billing_details.address?.city || user?.University?.city || '',
            state: payment.billing_details.address?.state || String(user?.University?.state || ''),
            billingZipCode: payment.billing_details.address?.postal_code || String(user?.University?.zipCode || '')
          }))
        } else {
          // Use university data if no payment billing details exist
          setFormData(prev => ({
            ...prev,
            billingAddress: user?.University?.address || '',
            city: user?.University?.city || '',
            state: String(user?.University?.state || ''),
            billingZipCode: String(user?.University?.zipCode || '')
          }))
        }
      } else {
        // No existing payment method, use university data
        setFormData(prev => ({
          ...prev,
          billingAddress: user?.University?.address || '',
          city: user?.University?.city || '',
          state: String(user?.University?.state || ''),
          billingZipCode: String(user?.University?.zipCode || '')
        }))
      }
    } catch (error) {
      console.error('Error fetching payment method:', error)
      if (error.response?.status !== 404) {
        toast.error('Failed to load payment method')
      } else {
        // 404 means no payment method exists, use university data
        setFormData(prev => ({
          ...prev,
          billingAddress: user?.University?.address || '',
          city: user?.University?.city || '',
          state: String(user?.University?.state || ''),
          billingZipCode: String(user?.University?.zipCode || '')
        }))
      }
    } finally {
      setLoadingPaymentMethod(false)
    }
  }

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
    // ✅ Validate that date is not in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const selectedDate = new Date(date)
    selectedDate.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      toast.error('Payment date must be in the future')
      return
    }
    
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
    if (!invoiceData?.id) {
      toast.error('Invoice ID is required')
      return
    }

    if (!existingPaymentMethod) {
      toast.error('No payment method on file. Please add a payment method first.')
      return
    }

    // ✅ Check if bank account is verified
    if (existingPaymentMethod.type === 'us_bank_account') {
      const status = existingPaymentMethod.us_bank_account?.status
      
      if (status !== 'verified' && status !== 'verified_by_stripe') {
        toast.error(
          '⚠️ Your bank account is not yet verified. Please complete the verification process before making payments.',
          { autoClose: 8000 }
        )
        return
      }
    }

    // ✅ Validate scheduled payment date
    if (sendDate) {
      const now = new Date()
      const scheduledDate = new Date(sendDate)
      
      if (scheduledDate <= now) {
        toast.error('Payment date must be in the future.')
        return
      }
    }

    setLoading(true)
    try {
      let response
      
      if (sendDate) {
        // ✅ Schedule payment with Stripe
        response = await invoiceApi.scheduleInvoicePayment(invoiceData.id, {
          scheduledDate: sendDate.toISOString(),
          paymentMethodType: existingPaymentMethod.type
        })
        
        toast.success(`✅ Payment scheduled! Stripe will automatically charge on ${formatDate(sendDate)}`)
      } else {
        // ✅ Pay immediately with proper payment method type
        response = await invoiceApi.payClientInvoice(invoiceData.id, {
          paymentMethodType: existingPaymentMethod.type
        })
        
        // ✅ Handle bank account payment confirmation
        if (existingPaymentMethod.type === 'us_bank_account') {
          toast.success('✅ Bank account payment initiated! Processing may take 1-2 business days.')
        } else {
          toast.success('✅ Payment processed successfully!')
        }
      }
      
      if (onPay) {
        await onPay(response.data)
      }
      
      onHide()
    } catch (error) {
      console.error('❌ Error processing payment:', error)
      const errorMessage = error.response?.data?.message || 'Failed to process payment'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onHide()
  }

  const getBankAccountStatusBadge = (status) => {
    const statusMap = {
      'new': { color: 'warning', text: 'Pending Verification', icon: '⏳' },
      'verified': { color: 'success', text: 'Verified', icon: '✅' },
      'verified_by_stripe': { color: 'success', text: 'Verified', icon: '✅' },
      'verification_failed': { color: 'danger', text: 'Verification Failed', icon: '❌' },
      'errored': { color: 'danger', text: 'Error', icon: '❌' }
    }

    const statusInfo = statusMap[status] || statusMap['new']
    
    return (
      <span className={`badge badge-${statusInfo.color}`}>
        {statusInfo.icon} {statusInfo.text}
      </span>
    )
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

        {/* ✅ Updated Payment Send Date Section with validation message */}
        <div className="payment-send-date-section">
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_3587_14757)">
                <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
              </g>
            </svg>
            <span>Payment Send Date (Optional)</span>
          </div>
          <div className="send-date-content">
            <label>Schedule Payment for Future Date</label>
            <div className="date-input-wrapper" style={{width: 'fit-content'}}>
              <input
                type="text"
                className="date-input"
                value={formatDate(sendDate)}
                onClick={() => setShowCalendar(!showCalendar)}
                placeholder="Pay Now or Choose Future Date"
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
            {sendDate && (
              <p className="scheduled-date-note">
                💡 Payment will be automatically processed on {formatDate(sendDate)}
              </p>
            )}
            {!sendDate && (
              <p className="payment-note">
                Leave empty to pay immediately
              </p>
            )}
          </div>
        </div>

        {/* Payment Method Section */}
        {loadingPaymentMethod ? (
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-2">Loading payment method...</p>
          </div>
        ) : (
          <>
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
                    disabled
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
                    disabled
                  />
                  <span className="radio-custom"></span>
                  <span className="radio-label">US Bank Account</span>
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
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19 C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                  </svg>
                  <span>Card Information</span>
                </div>
                
                {existingPaymentMethod && existingPaymentMethod.card ? (
                  <div className="card-info-fields">
                    <div className="form-group stripe-card-element">
                      <label className="field-label">Card Number *</label>
                      <div className="stripe-card-container disabled-field">
                        <input
                          type="text"
                          value={`•••• •••• •••• ${existingPaymentMethod.card.last4}`}
                          disabled
                          className="stripe-disabled-input"
                        />
                      </div>
                    </div>
                    
                    <div className="card-details-row">
                      <div className="form-group stripe-card-element">
                        <label className="field-label">Expiration Date *</label>
                        <div className="stripe-card-container disabled-field">
                          <input
                            type="text"
                            value={`${String(existingPaymentMethod.card.exp_month).padStart(2, '0')}/${String(existingPaymentMethod.card.exp_year).slice(-2)}`}
                            disabled
                            className="stripe-disabled-input"
                          />
                        </div>
                      </div>
                      
                      <div className="form-group stripe-card-element">
                        <label className="field-label">CVC *</label>
                        <div className="stripe-card-container disabled-field">
                          <input
                            type="text"
                            value="•••"
                            disabled
                            className="stripe-disabled-input"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    No credit card on file. Please add a payment method in the Manage Payment section.
                  </div>
                )}
              </div>
            )}

            {/* Bank Account Information Section */}
            {paymentMethod === 'bank-account' && (
              <div>
                <div className="section-header">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_3587_14757)">
                      <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                    </g>
                  </svg>
                  <span>Bank Account Information</span>
                </div>
                
                {existingPaymentMethod && existingPaymentMethod.us_bank_account ? (
                  <div className="bank-info-fields">
                    <div className="form-group">
                      <label className="field-label">Account Holder Name *</label>
                      <input
                        type="text"
                        className="input-with-icon disabled-field"
                        value={existingPaymentMethod.billing_details?.name || 'Account Holder'}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label className="field-label">Bank Name</label>
                      <input
                        type="text"
                        className="input-with-icon disabled-field"
                        value={existingPaymentMethod.us_bank_account.bank_name || 'Bank Account'}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label className="field-label">Account Number *</label>
                      <input
                        type="text"
                        className="input-with-icon disabled-field"
                        value={`••••••${existingPaymentMethod.us_bank_account.last4}`}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label className="field-label">Account Holder Type *</label>
                      <input
                        type="text"
                        className="input-with-icon disabled-field"
                        value={existingPaymentMethod.us_bank_account.account_holder_type === 'company' ? 'Company/Organization' : 'Individual'}
                        disabled
                      />
                    </div>

                    {existingPaymentMethod.us_bank_account.status && (
                      <div className="form-group">
                        <label className="field-label">Verification Status</label>
                        <div className="mt-2">
                          {getBankAccountStatusBadge(existingPaymentMethod.us_bank_account.status)}
                        </div>
                        {(existingPaymentMethod.us_bank_account.status === 'new' || 
                          existingPaymentMethod.us_bank_account.status === 'verification_failed') && (
                          <small className="d-block mt-2 text-warning">
                            ⚠️ Payment cannot be processed until bank account is verified
                          </small>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    No bank account on file. Please add a payment method in the Manage Payment section.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Billing Address Section */}
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
              <label className="field-label">Address *</label>
              <div>
                <input
                  type="text"
                  className="input-with-icon"
                  value={formData.billingAddress}
                  onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                  placeholder="1234 Main Street"
                />
                <button className="edit-icon-btn" type="button">
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
              </div>
            </div>

            <div className="address-details-row">
              <div className="form-group">
                <label className="field-label">City *</label>
                <div>
                  <input
                    type="text"
                    className="input-with-icon"
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
                <label className="field-label">State *</label>
                <div>
                  <input
                    type="text"
                    className="input-with-icon"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                    placeholder="FL"
                    maxLength="2"
                  />
                  <button className="edit-icon-btn" type="button">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Zip Code *</label>
                <div>
                  <input
                    type="text"
                    className="input-with-icon"
                    value={formData.billingZipCode}
                    onChange={(e) => handleInputChange('billingZipCode', e.target.value)}
                    placeholder="12345"
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
            disabled={loading || !existingPaymentMethod}
          >
            {loading ? 'PROCESSING...' : 'PAY NOW'}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default PayInvoiceModal