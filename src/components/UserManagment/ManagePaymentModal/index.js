import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { loadStripe } from '@stripe/stripe-js'
import { 
  Elements, 
  useStripe, 
  useElements, 
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from '@stripe/react-stripe-js'
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
  }
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
  const [showVerificationInfo, setShowVerificationInfo] = useState(false)
  
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
        
        // Set payment method type based on what exists
        if (payment.type === 'card') {
          setPaymentMethod('credit-card')
        } else if (payment.type === 'us_bank_account') {
          setPaymentMethod('bank-account')
          
          // Show verification info if bank account is not verified
          if (payment.us_bank_account?.status && 
              payment.us_bank_account.status !== 'verified' && 
              payment.us_bank_account.status !== 'verified_by_stripe') {
            setShowVerificationInfo(true)
          }
        }
        
        // Set billing address from payment method or university data
        if (payment.billing_details) {
          setFormData(prev => ({
            ...prev,
            billingAddress: payment.billing_details.address?.line1 || user?.University?.address || '',
            city: payment.billing_details.address?.city || user?.University?.city || '',
            state: payment.billing_details.address?.state || String(user?.University?.state || ''),
            billingZipCode: payment.billing_details.address?.postal_code || String(user?.University?.zipCode || '')
          }))
        } else {
          setFormData(prev => ({
            ...prev,
            billingAddress: user?.University?.address || '',
            city: user?.University?.city || '',
            state: String(user?.University?.state || ''),
            billingZipCode: String(user?.University?.zipCode || '')
          }))
        }
      } else {
        // No existing payment method
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
        toast.error('Failed to load payment information')
      }
      // Use university data as fallback
      setFormData(prev => ({
        ...prev,
        billingAddress: user?.University?.address || '',
        city: user?.University?.city || '',
        state: String(user?.University?.state || ''),
        billingZipCode: String(user?.University?.zipCode || '')
      }))
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
    setShowVerificationInfo(false)
  }

  const validateBankAccount = () => {
    if (!formData.accountHolderName.trim()) {
      toast.error('Account holder name is required')
      return false
    }

    if (!/^\d{9}$/.test(formData.routingNumber)) {
      toast.error('Routing number must be exactly 9 digits')
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
        const cardNumberElement = elements.getElement(CardNumberElement)
        
        if (!cardNumberElement) {
          throw new Error('Card information is required')
        }

        const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardNumberElement,
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
        // Validate bank account fields
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

        console.log('🏦 Confirming US Bank Account Setup...')

        // ✅ Properly confirm bank account setup with Stripe
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
          console.error('❌ Bank account setup error:', error)
          throw new Error(error.message)
        }

        console.log('✅ SetupIntent Status:', setupIntent.status)
        console.log('✅ Payment Method ID:', setupIntent.payment_method)

        // Add setup intent ID to request
        requestData.setupIntentId = setupIntent.id
        requestData.paymentMethodId = setupIntent.payment_method
      }

      // Send to backend
      const response = await axiosInstance.post('/client/payment-method', requestData)

      if (response.data.data.needsVerification) {
        setShowVerificationInfo(true)
        toast.info(
          '🏦 Bank account added! Check your email for verification instructions from Stripe. ' +
          'Verification is required before you can make payments.',
          { autoClose: 10000 }
        )
      } else {
        toast.success('✅ Payment method saved successfully!')
      }
      
      if (onSave) {
        await onSave(response.data.data)
      }
      
      // Refresh payment method data
      await fetchPaymentMethod()
      
      // Don't close modal if verification is needed
      if (!response.data.data.needsVerification) {
        onHide()
      }
      
    } catch (error) {
      console.error('❌ Error saving payment information:', error)
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
      setShowVerificationInfo(false)
      onHide()
    } catch (error) {
      console.error('Error removing payment method:', error)
      toast.error(error.response?.data?.message || 'Failed to remove payment method')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowVerificationInfo(false)
    onHide()
  }

  const getBankAccountStatusBadge = (status) => {
    const statusMap = {
      'new': { color: 'warning', text: 'Pending Verification', icon: '⏳' },
      'verified': { color: 'success', text: 'Verified', icon: '✅' },
      'verified_by_stripe': { color: 'success', text: 'Verified by Stripe', icon: '✅' },
      'verification_failed': { color: 'danger', text: 'Verification Failed', icon: '❌' },
      'errored': { color: 'danger', text: 'Error', icon: '❌' }
    }

    const statusInfo = statusMap[status] || statusMap['new']
    
    return (
      <span className={`badge badge-${statusInfo.color}`} style={{
        padding: '6px 12px',
        fontSize: '13px',
        fontWeight: '500'
      }}>
        {statusInfo.icon} {statusInfo.text}
      </span>
    )
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
        {/* Show verification alert if bank account needs verification */}
        {showVerificationInfo && existingPaymentMethod?.us_bank_account && (
          <div className="alert alert-info mb-4" style={{
            backgroundColor: '#e3f2fd',
            border: '1px solid #2196F3',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h6 style={{ color: '#1976d2', marginBottom: '10px' }}>
              <i className="fas fa-info-circle mr-2"></i>
              Bank Account Verification Required
            </h6>
            <p style={{ marginBottom: '10px', fontSize: '14px' }}>
              Your bank account has been added but needs to be verified before you can make payments.
            </p>
            <ul style={{ marginBottom: '10px', fontSize: '14px', paddingLeft: '20px' }}>
              <li><strong>Check your email</strong> from Stripe for verification instructions</li>
              <li>You may receive <strong>micro-deposits</strong> (2 small amounts) in your bank account within 1-2 business days</li>
              <li>Or you may receive a <strong>descriptor code</strong> via email for instant verification</li>
            </ul>
            <p style={{ marginBottom: '0', fontSize: '13px', color: '#666' }}>
              💡 Once verified, this payment method will be available for automatic invoice payments
            </p>
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
                
                <div className="d-flex justify-content-end">
                  <button 
                    className="btn-remove-payment" 
                    onClick={handleRemovePaymentMethod} 
                    disabled={loading}
                  >
                    {loading ? 'Removing...' : 'Remove Payment Method'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="card-info-fields">
                <div className="form-group stripe-card-element">
                  <label className="field-label">Card Number *</label>
                  <div className="stripe-card-container">
                    <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                  </div>
                </div>
                
                <div className="card-details-row">
                  <div className="form-group stripe-card-element">
                    <label className="field-label">Expiration Date *</label>
                    <div className="stripe-card-container">
                      <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                  
                  <div className="form-group stripe-card-element">
                    <label className="field-label">CVC *</label>
                    <div className="stripe-card-container">
                      <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                      <small className="d-block mt-2 text-muted">
                        Check your email for verification instructions from Stripe
                      </small>
                    )}
                  </div>
                )}
                
                <div className="d-flex justify-content-end mt-3">
                  <button 
                    className="btn-remove-payment" 
                    onClick={handleRemovePaymentMethod} 
                    disabled={loading}
                  >
                    {loading ? 'Removing...' : 'Remove Payment Method'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bank-info-fields">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle mr-2"></i>
                  <strong>Test Mode - Bank Account Numbers:</strong>
                  <ul className="mb-0 mt-2" style={{ fontSize: '13px' }}>
                    <li><strong>Routing:</strong> <code>110000000</code> (test routing number)</li>
                    <li><strong>Account (instant success):</strong> <code>000123456789</code></li>
                    <li><strong>Account (requires verification):</strong> <code>000111111113</code></li>
                  </ul>
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
                  <label className="field-label">Routing Number * (9 digits)</label>
                  <input
                    type="text"
                    className="input-with-icon"
                    value={formData.routingNumber}
                    onChange={(e) => handleInputChange('routingNumber', e.target.value.replace(/\D/g, ''))}
                    placeholder="110000000"
                    maxLength="9"
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Account Number * (4-17 digits)</label>
                  <input
                    type="text"
                    className="input-with-icon"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                    placeholder="000123456789"
                    maxLength="17"
                  />
                </div>

                <div>
                  <label>Account Holder Type *</label>
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
            )}
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