import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import axiosInstance from '../../../utils/AxiosInstance'
import './index.css'

const stripePromise = loadStripe(
  'pk_test_51RTfyARsRTWEGaAp4zxg2AegOVpnOw6MXZG2qSfmT91KqlRhD3buK7X8A9m63EDc4W87lzYmycQ82ClJWndZJYr600RCjzzCDK'
)

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      color: '#000',
      fontFamily: 'Montserrat, sans-serif',
      '::placeholder': {
        color: '#BBBDBF'
      }
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444'
    }
  },
  hidePostalCode: false
}

const ManagePaymentModalContent = ({ show, onHide, onSave }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [isDefaultPayment, setIsDefaultPayment] = useState(true)
  const [existingPaymentMethod, setExistingPaymentMethod] = useState(null)
  const [clientSecret, setClientSecret] = useState('')
  
  const [formData, setFormData] = useState({
    accountHolderName: '',
    routingNumber: '',
    accountNumber: '',
    accountHolderType: 'company',
    billingAddress: '',
    city: '',
    state: '',
    billingZipCode: ''
  })

  const { user } = useSelector((state) => state.user.user)

  useEffect(() => {
    if (show) {
      fetchPaymentMethod()
      createSetupIntent()
    }
  }, [show])


  const createSetupIntent = async () => {
    try {
      const response = await axiosInstance.post('/client/payment-method/setup-intent')
      setClientSecret(response.data.data.clientSecret)
    } catch (error) {
      console.error('Error creating setup intent:', error)
      toast.error('Failed to initialize payment setup')
    }
  }

  const fetchPaymentMethod = async () => {
    setLoadingData(true)
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
        
        if (payment.billing_details) {
          setFormData(prev => ({
            ...prev,
            billingAddress: payment.billing_details.address?.line1 || '',
            city: payment.billing_details.address?.city || '',
            state: payment.billing_details.address?.state || '',
            billingZipCode: payment.billing_details.address?.postal_code || ''
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching payment method:', error)
      if (error.response?.status !== 404) {
        toast.error('Failed to load payment information')
      }
    } finally {
      setLoadingData(false)
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

  const validateBankAccount = () => {
    if (!/^\d{9}$/.test(formData.routingNumber)) {
      toast.error('Routing number must be 9 digits')
      return false
    }

    if (!/^\d{4,17}$/.test(formData.accountNumber)) {
      toast.error('Account number must be between 4-17 digits')
      return false
    }

    return true
  }

  const handleSaveChanges = async () => {
  if (!stripe || !elements) {
    toast.error('Stripe not loaded. Please refresh the page.')
    return
  }

  if (!formData.billingAddress || !formData.city || !formData.state || !formData.billingZipCode) {
    toast.warning('Please fill in all billing address fields')
    return
  }
  
  if (!/^\d{5}(-\d{4})?$/.test(formData.billingZipCode)) {
    toast.error('Invalid zip code format')
    return
  }

  setLoading(true)
  try {
    let requestData = {
      paymentMethodType: paymentMethod === 'credit-card' ? 'card' : 'bank_account',
      setAsDefault: isDefaultPayment,
      billingAddress: formData.billingAddress,
      city: formData.city,
      state: formData.state,
      zipCode: formData.billingZipCode
    }

    if (paymentMethod === 'credit-card') {
      const cardElement = elements.getElement(CardElement)
      
      if (!cardElement) {
        throw new Error('Card information is required')
      }

      const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user?.name || '',
          email: user?.email || '',
          address: {
            line1: formData.billingAddress,
            city: formData.city,
            state: formData.state,
            postal_code: formData.billingZipCode,
            country: 'US'
          }
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      requestData.cardToken = stripePaymentMethod.id

    } else if (paymentMethod === 'bank-account') {
      if (!formData.accountHolderName || !formData.routingNumber || !formData.accountNumber) {
        throw new Error('Please fill in all bank account fields')
      }

      if (!validateBankAccount()) {
        setLoading(false)
        return
      }

      if (!clientSecret) {
        throw new Error('Setup intent not ready. Please refresh and try again.')
      }

      const { error, setupIntent } = await stripe.confirmUsBankAccountSetup(clientSecret, {
        payment_method: {
          us_bank_account: {
            account_holder_type: formData.accountHolderType,
            routing_number: formData.routingNumber,
            account_number: formData.accountNumber
          },
          billing_details: {
            name: formData.accountHolderName,
            email: user?.email || '',
            address: {
              line1: formData.billingAddress,
              city: formData.city,
              state: formData.state,
              postal_code: formData.billingZipCode,
              country: 'US'
            }
          }
        }
      })

      if (error) {
        throw new Error(error.message)
      }

      console.log('SetupIntent confirmed:', setupIntent.status)

      requestData.setupIntentId = setupIntent.id
    }

    const response = await axiosInstance.post('/client/payment-method', requestData)

    if (response.data.data.needsVerification) {
      toast.info(
        '🏦 Bank account added successfully! Check your email for verification instructions from Stripe. ' +
        'You may also see a small deposit in your account within 1-2 business days.',
        { autoClose: 8000 }
      )
    } else {
      toast.success('Payment method saved successfully!')
    }
    
    if (onSave) {
      await onSave(response.data.data)
    }
    
    onHide()
  } catch (error) {
    console.error('Error saving payment information:', error)
    toast.error(error.message || 'Failed to save payment information')
  } finally {
    setLoading(false)
  }
}

  const handleRemovePaymentMethod = async () => {
    if (!window.confirm('Are you sure you want to remove this payment method?')) {
      return
    }

    setLoading(true)
    try {
      await axiosInstance.delete('/client/payment-method')
      toast.success('Payment method removed successfully!')
      setExistingPaymentMethod(null)
      onHide()
    } catch (error) {
      console.error('Error removing payment method:', error)
      toast.error(error.response?.data?.message || 'Failed to remove payment method')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onHide()
  }

  if (loadingData) {
    return (
      <Modal show={show} onHide={onHide} centered size="sm">
        <Modal.Body className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-3">Loading payment information...</p>
        </Modal.Body>
      </Modal>
    )
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
          <button className="back-button" onClick={handleCancel}>
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
        {/* Existing Payment Method */}
        {existingPaymentMethod && (
          <div className="existing-payment-info">
            <div className="section-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_3587_14757)">
                  <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
                </g>
              </svg>
              <span>Current Payment Method</span>
            </div>
            <div className="current-payment-card">
              {existingPaymentMethod.card && (
                <div className="payment-info-row">
                  <div>
                    <strong>{existingPaymentMethod.card.brand.toUpperCase()}</strong> ending in {existingPaymentMethod.card.last4}
                    <br />
                    <small>Expires {existingPaymentMethod.card.exp_month}/{existingPaymentMethod.card.exp_year}</small>
                  </div>
                  <button className="btn-remove-payment" onClick={handleRemovePaymentMethod} disabled={loading}>
                    Remove
                  </button>
                </div>
              )}
              {existingPaymentMethod.us_bank_account && (
                <div className="payment-info-row">
                  <div>
                    <strong>{existingPaymentMethod.us_bank_account.bank_name || 'Bank Account'}</strong>
                    <br />
                    <small>
                      {existingPaymentMethod.us_bank_account.account_holder_type} - 
                      Account ending in {existingPaymentMethod.us_bank_account.last4}
                    </small>
                    {existingPaymentMethod.us_bank_account.status && (
                      <span className={`badge badge-${existingPaymentMethod.us_bank_account.status === 'verified' ? 'success' : 'warning'} ml-2`}>
                        {existingPaymentMethod.us_bank_account.status}
                      </span>
                    )}
                  </div>
                  <button className="btn-remove-payment" onClick={handleRemovePaymentMethod} disabled={loading}>
                    Remove
                  </button>
                </div>
              )}
            </div>
            <hr />
          </div>
        )}

        {/* Payment Method Selection */}
        <div>
          <div className="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_3587_14757)">
                <path d="M1 10C7.26752 10 10 7.36306 10 1C10 7.36306 12.7134 10 19 10C12.7134 10 10 12.7134 10 19C10 12.7134 7.26752 10 1 10Z" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
              </g>
            </svg>
            <span>{existingPaymentMethod ? 'Update Payment Method' : 'Add Payment Method'}</span>
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
              <span className="radio-label">US Bank Account</span>
            </label>
          </div>
          <p className="payment-note">*This payment method will be used for automatic invoice payments</p>
          
          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="defaultPayment"
              checked={isDefaultPayment}
              onChange={(e) => setIsDefaultPayment(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="defaultPayment">
              Set as default payment method
            </label>
          </div>
        </div>

        {/* Card Information */}
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
            <div className="card-info-fields">
              <div className="form-group stripe-card-element">
                <label className="field-label">Card Details *</label>
                <div className="stripe-card-container">
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bank Account Information */}
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
            <div className="bank-info-fields">
              <div className="alert alert-info">
                <i className="fas fa-info-circle mr-2"></i>
                <strong>Test Mode:</strong> Use routing number <code>110000000</code> and account number <code>000123456789</code> for testing.
              </div>

              <div className="form-group">
                <label className="field-label">Account Holder Name *</label>
                <input
                  type="text"
                  className="input-with-icon"
                  value={formData.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  placeholder="John Doe or Company Name"
                />
              </div>

              <div className="form-group">
                <label className="field-label">Routing Number *</label>
                <input
                  type="text"
                  className="input-with-icon"
                  value={formData.routingNumber}
                  onChange={(e) => handleInputChange('routingNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="110000000"
                  maxLength="9"
                />
                <small className="text-muted">
                  Test mode: Use <strong>110000000</strong>
                </small>
              </div>

              <div className="form-group">
                <label className="field-label">Account Number *</label>
                <input
                  type="text"
                  className="input-with-icon"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="000123456789"
                  maxLength="17"
                />
                <small className="text-muted">
                  Test mode: Use <strong>000123456789</strong> (success) or <strong>000111111113</strong> (verification required)
                </small>
              </div>

              <div className="form-group">
                <label className="field-label">Account Holder Type *</label>
                <div className="payment-method-options">
                  <label className="payment-method-radio">
                    <input
                      type="radio"
                      name="accountHolderType"
                      value="company"
                      checked={formData.accountHolderType === 'company'}
                      onChange={(e) => handleInputChange('accountHolderType', e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">Company/Organization</span>
                  </label>
                  <label className="payment-method-radio">
                    <input
                      type="radio"
                      name="accountHolderType"
                      value="individual"
                      checked={formData.accountHolderType === 'individual'}
                      onChange={(e) => handleInputChange('accountHolderType', e.target.value)}
                    />
                    <span className="radio-custom"></span>
                    <span className="radio-label">Individual</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Address */}
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
                <div >
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
                <div >
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
                <div >
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

        {/* Security Notice */}
        <div className="security-notice mt-3">
          <small className="text-muted">
            <i className="fas fa-lock mr-2"></i>
            Your payment information is encrypted and stored securely by Stripe. We never store your card numbers or bank account details.
          </small>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button className="btn-cancel-payment" onClick={handleCancel} disabled={loading}>
            CANCEL
          </button>
          <button className="btn-save-payment" onClick={handleSaveChanges} disabled={loading || !stripe}>
            {loading ? 'SAVING...' : 'SAVE PAYMENT METHOD'}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

const ManagePaymentModal = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <ManagePaymentModalContent {...props} />
    </Elements>
  )
}

export default ManagePaymentModal