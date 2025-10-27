import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import AcademyBtn from '../../components/AcademyBtn'
import ModalInput from '../../components/ModalInput/ModalInput'
import InfoPageHeader from '../../components/WelcomeToCourse/InfoPageHeader'
import IntlMessages from '../../utils/IntlMessages'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import HowWeProtect from '../../components/HowWeProtect'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import StartupStudioLogo from '../../assets/images/academy-icons/SUS OAE Logox800 1.png'
import facebookLogo from '../../assets/images/academy-icons/svg/icons8-facebook.svg'
import googleLogo from '../../assets/images/academy-icons/svg/icons8-google.svg'
import microsoftLogo from '../../assets/images/academy-icons/svg/icons8-microsoft.svg'
import { loadStripe } from '@stripe/stripe-js'
import { 
  Elements, 
  CardNumberElement, 
  CardExpiryElement, 
  CardCvcElement, 
  useStripe, 
  useElements,
  PaymentRequestButtonElement
} from '@stripe/react-stripe-js'
import CheckSubscriptionModal from './CheckSubscriptionModal'
import closeBtn from '../../assets/images/academy-icons/svg/icons8-close (1).svg'
// ✅ ADD FACEBOOK PIXEL IMPORTS
import { trackTrialStarted, trackInitiateCheckout, trackLead } from '../../utils/FacebookPixel'

// Initialize Stripe
// const stripePromise = loadStripe(
//   'pk_test_51RTfyARsRTWEGaAp4zxg2AegOVpnOw6MXZG2qSfmT91KqlRhD3buK7X8A9m63EDc4W87lzYmycQ82ClJWndZJYr600RCjzzCDK'
// )

const stripePromise = loadStripe('pk_live_JnvIkZtjpceE5fSdedKFtdJN00rAR0j6Z4')

// Update the card element options for individual fields
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#333',
      fontFamily: 'inherit',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
}

// Registration Form Component (inside Elements wrapper)
function RegistrationForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [protectModal, setProtectModal] = useState(false)
  const [showCheckSubscription, setShowCheckSubscription] = useState(false)
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const currentUrl = window.location.origin

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // ✅ ADD: Track when user lands on registration page
  useEffect(() => {
    trackLead({
      contentName: 'Registration Page',
      contentCategory: 'signup'
    })
  }, [])

  const validateForm = () => {
    let newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Enter a valid email address.'
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one symbol.'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    // Validate required billing fields
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required.'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required.'
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required.'
    }
    // if (!formData.zipCode.trim()) {
    //   newErrors.zipCode = 'Zip Code is required.'
    // }
    if (!formData.nameOn.trim()) {
      newErrors.nameOn = 'Name on Credit Card is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    nameOn: '',
    zipC: '' // Add this for the card zip code
  })

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (!stripe || !elements) {
      toast.error('Stripe has not loaded yet. Please try again.')
      return
    }

    const cardNumberElement = elements.getElement(CardNumberElement)
    if (!cardNumberElement) {
      toast.error('Card information is required.')
      return
    }

    setIsLoading(true)

    trackInitiateCheckout({
      value: 0, // Free trial
      currency: 'USD',
      numItems: 1
    })

    try {
      const checkEmailResponse = await axiosInstance.post('/check-email', {
        email: formData.emailAddress
      })

      if (checkEmailResponse.data.exists) {
        setIsLoading(false)
        setErrors({
          ...errors,
          emailAddress: 'An account with this email already exists. Please use a different email or log in.'
        })
        toast.error('An account with this email already exists. Please log in or use a different email.')
        return
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: formData.nameOn,
          email: formData.emailAddress,
          address: {
            line1: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zipC,
          },
        },
      })

      if (error) {
        console.error('Payment method creation error:', error)
        toast.error(error.message)
        setIsLoading(false)
        return
      }

      const registrationData = {
        name: formData.fullName,
        email: formData.emailAddress,
        password: formData.password,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipC,
        nameOnCard: formData.nameOn,
        paymentMethodId: paymentMethod.id,
      }

      sessionStorage.setItem('registrationData', JSON.stringify(registrationData))
      
      trackTrialStarted({
        value: 0,
        currency: 'USD',
        predictedLifetimeValue: 119.88
      })

      setIsLoading(false)
      setShowCheckSubscription(true)
      
    } catch (error) {
      setIsLoading(false)
      console.error('Registration error:', error)
      
      // Handle specific error messages from the backend
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    }
  }


  const toggleMenu = () => {
    const navbar = document.querySelector("nav");
    const navList = document.getElementById("navList");
    const body = document.querySelector("body");
    const hamburger = document.getElementById("hamburger");
    const close = document.getElementById("close");

    navbar.classList.toggle("active");
    if (navList.style.display === "flex") {
      navList.style.display = "";
      hamburger.classList.remove("d-none");
      close.classList.add("d-none");
    } else {
      navList.style.display = "flex";
      hamburger.classList.add("d-none");
      close.classList.remove("d-none");
    }
    body.classList.toggle("nav-open");
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [paymentRequest, setPaymentRequest] = useState(null)

  // Add this useEffect to initialize Google Pay/Apple Pay
  useEffect(() => {
    if (!stripe) return
    
    // Only enable Payment Request on HTTPS
    const isSecureContext = window.isSecureContext || window.location.protocol === 'https:'
    
    if (!isSecureContext) {
      console.warn('Payment Request API requires HTTPS. Skipping initialization.')
      return
    }

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Learn to Start Subscription',
        amount: 0,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    })

    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr)
      }
    })

    pr.on('paymentmethod', async (e) => {
      try {
        const email = formData.emailAddress || e.paymentMethod.billing_details.email

        // Check if user exists
        const checkEmailResponse = await axiosInstance.post('/check-email', {
          email: email
        })

        if (checkEmailResponse.data.exists) {
          e.complete('fail')
          toast.error('An account with this email already exists. Please log in or use a different email.')
          return
        }

        // Auto-fill form data from payment method
        if (e.paymentMethod.billing_details) {
          const billing = e.paymentMethod.billing_details
          setFormData((prev) => ({
            ...prev,
            fullName: billing.name || prev.fullName,
            emailAddress: billing.email || prev.emailAddress,
            address: billing.address?.line1 || prev.address,
            city: billing.address?.city || prev.city,
            state: billing.address?.state || prev.state,
            zipC: billing.address?.postal_code || prev.zipC,
            nameOn: billing.name || prev.nameOn,
          }))
        }

        // Store payment method ID
        const registrationData = {
          name: formData.fullName || e.paymentMethod.billing_details.name,
          email: email,
          password: formData.password,
          address: formData.address || e.paymentMethod.billing_details.address?.line1,
          city: formData.city || e.paymentMethod.billing_details.address?.city,
          state: formData.state || e.paymentMethod.billing_details.address?.state,
          zipCode: formData.zipC || e.paymentMethod.billing_details.address?.postal_code,
          nameOnCard: formData.nameOn || e.paymentMethod.billing_details.name,
          paymentMethodId: e.paymentMethod.id,
        }

        sessionStorage.setItem('registrationData', JSON.stringify(registrationData))
        
        trackTrialStarted({
          value: 0,
          currency: 'USD',
          predictedLifetimeValue: 119.88
        })

        // Complete the payment request
        e.complete('success')
        
        // Show subscription modal
        setShowCheckSubscription(true)
      } catch (error) {
        e.complete('fail')
        console.error('Payment Request error:', error)
        toast.error(error.response?.data?.message || 'Payment failed. Please try again.')
      }
    })
  }, [stripe, formData.password, formData.emailAddress])

  return (
    <>

    <div className="header-login">
            <header className="py-4 px-5 d-flex justify-content-between align-items-start px-1-mob">
            {/* <img
              className="cursor-pointer w-200-mob img-register-login"
              src={StartupStudioLogo}
              alt="course logo"
              onClick={() => window.location.href = '/'}
            /> */}

            <div>
              
            </div>
      
            <nav className="mt-4">
              <ul className="list-unstyled gap-2-2" id="navList">
                <li>
                  <a
                    className="fs-13 fw-medium text-decoration-none text-black"
                    href="https://academy.learntostart.com/"
                  >
                    HOME
                  </a>
                </li>
                <li>
                  <a
                    className="fs-13 fw-medium text-decoration-none text-black"
                    href="https://academy.learntostart.com/contact.html"
                  >
                    CONTACT US
                  </a>
                </li>
              </ul>
              <div className="hamburger" id="hamburger" onClick={toggleMenu}>
                <span className="bar background-black"></span>
                <span className="bar background-black"></span>
                <span className="bar background-black"></span>
              </div>
              <img
                className="d-none pos-abs right-5"
                id="close"
                onClick={toggleMenu}
                src={closeBtn}
                alt="Close"
                  style={{ filter: 'brightness(0) invert(1)', cursor: 'pointer' }}
              />
            </nav>
          </header>
          </div>

      <main className='register-main'>
        <section className='px-5 pb-5 p-t-5 register-section'>
          <h1 className='text-center fs-48 fw-light'>
            {/* $15 per month subscription */}
            Start your free trial today
          </h1>

          {/* Add Google Pay button here - before the form */}
          {paymentRequest && (
            <div className='mt-4 mb-3'>
              <div className='d-flex flex-column align-items-center'>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                  <PaymentRequestButtonElement 
                    options={{ 
                      paymentRequest,
                      style: {
                        paymentRequestButton: {
                          type: 'default',
                          theme: 'dark',
                          height: '48px',
                        },
                      },
                    }} 
                  />
                </div>
                <div className='d-flex align-items-center gap-3 my-3 w-100' style={{ maxWidth: '400px' }}>
                  <hr style={{ flex: 1, borderTop: '1px solid #ccc' }} />
                  <span className='fs-13 fw-medium text-black'>OR</span>
                  <hr style={{ flex: 1, borderTop: '1px solid #ccc' }} />
                </div>
              </div>
            </div>
          )}

          <form className='mt-4-4' onSubmit={handleSubmit} autoComplete='off'>
            <div
    className='d-grid gap-4'
    style={{ 
      gridTemplateColumns: windowWidth <= 768 ? '1fr' : '4fr auto 2fr' 
    }}
  >
              <div>
                {/* Account Information Section */}
                <div>
                  <p className='mb-2 fs-13 fw-medium ms-3 text-black'>
                    Account Information
                  </p>
                  <div className='d-grid gap-3 grid-col-2 grid-col-1-mob'>
                    {/* Full Name */}
                    <div className='relative'>
                      <ModalInput
                        id={'fullName'}
                        labelTitle={'Full Name'}
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                      {errors.fullName && (
                        <p className='invalid-feedback d-block position-absolute fs-10'>
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className='relative'>
                      <ModalInput
                        id={'emailAddress'}
                        labelTitle={'Email Address'}
                        value={formData.emailAddress}
                        onChange={handleInputChange}
                        autoComplete={'new-email'}
                      />
                      {errors.emailAddress && (
                        <p className='invalid-feedback d-block position-absolute fs-10'>
                          {errors.emailAddress}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div className='relative'>
                      <div className='relative w-100 d-flex justify-content-between input-container-modal'>
                        <input
                          id={'password'}
                          type={showPassword ? 'text' : 'password'}
                          className='input-style'
                          placeholder=' '
                          value={formData.password}
                          onChange={handleInputChange}
                          autoComplete={false}
                        />
                        <label htmlFor={'password'} className='label-style'>
                          Password
                        </label>
                        <div
                          onClick={() => setShowPassword((prev) => !prev)}
                          style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                          />
                        </div>
                      </div>
                      {errors.password && (
                        <p className='invalid-feedback d-block position-absolute fs-10'>
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className='relative'>
                      <div className='relative w-100 d-flex justify-content-between input-container-modal'>
                        <input
                          id={'confirmPassword'}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className='input-style'
                          placeholder=' '
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          autoComplete={'new-password'}
                        />
                        <label
                          htmlFor={'confirmPassword'}
                          className='label-style'
                        >
                          Confirm Password
                        </label>
                        <div
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          style={{
                            cursor: 'pointer',
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        >
                          <FontAwesomeIcon
                            icon={showConfirmPassword ? faEye : faEyeSlash}
                          />
                        </div>
                      </div>
                      {errors.confirmPassword ? (
                        <p className='invalid-feedback d-block position-absolute fs-10'>
                          {errors.confirmPassword}
                        </p>
                      ) : (
                        <div className='position-absolute password-register'>
                          <IntlMessages id='create_account.password_policy' />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Billing Address Section */}
                <div className='mt-5'>
                  <p className='mb-2 fs-13 fw-medium ms-3 text-black'>
                    Billing Address
                  </p>
                  <div className='d-flex flex-column gap-3'>
                    <div className='relative'>
                      <ModalInput
                        id={'address'}
                        labelTitle={'Address'}
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                      {errors.address && (
                        <p className='invalid-feedback d-block position-absolute fs-10'>
                          {errors.address}
                        </p>
                      )}
                    </div>
                    <div
                      className='d-grid gap-3'
                      style={{ gridTemplateColumns: '1fr 1fr' }}
                    >
                      <div className='relative'>
                        <ModalInput
                          id={'city'}
                          labelTitle={'City'}
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                        {errors.city && (
                          <p className='invalid-feedback d-block position-absolute fs-10'>
                            {errors.city}
                          </p>
                        )}
                      </div>
                      <div className='relative'>
                        <ModalInput
                          id={'state'}
                          labelTitle={'State'}
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                        {errors.state && (
                          <p className='invalid-feedback d-block position-absolute fs-10'>
                            {errors.state}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <hr
                style={{
                  borderLeft: '1px solid rgb(165 167 169)',
                }}
              />
              
              <div>
                {/* Payment Information Section */}
                <div>
                  <p className='mb-2 fs-13 fw-medium ms-3 text-black'>
                    Payment Information
                  </p>
                  <div className='relative'>
                    <ModalInput
                      id={'nameOn'}
                      labelTitle={'Name on Credit Card'}
                      value={formData.nameOn}
                      onChange={handleInputChange}
                    />
                    {errors.nameOn && (
                      <p className='invalid-feedback d-block position-absolute fs-10'>
                        {errors.nameOn}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Information Section */}
                <div className='mt-3 register-card-info-fill'>
                  <div className='d-flex align-items-center justify-content-between mb-2'>
                    <p className='mb-0 fs-13 fw-medium ms-3 text-black'>
                      Card Information
                    </p>
                    {/* Optional: Add browser autofill hint */}
                    <button
                      type='button'
                      className='btn-link fs-11 text-decoration-none'
                      style={{ color: '#51C7DF', cursor: 'pointer' }}
                      onClick={() => {
                        // Trigger browser's native autofill
                        if (document.querySelector('[name="cardnumber"]')) {
                          document.querySelector('[name="cardnumber"]').focus()
                        }
                      }}
                    >
                      Use saved card
                    </button>
                  </div>
                  
                  {/* Card Number Field */}
                  <div className='relative mb-3'>
                    <div className='stripe-card-wrapper' style={{
                      borderRadius: '12px',
                        border: 'none',
                        padding: '1rem 0.625rem 0.625rem',
                        boxShadow: '0px 3px 6px #00000029',
                        background:' #ffffff'
                    }}>
                      <CardNumberElement 
                        options={{
                          ...CARD_ELEMENT_OPTIONS,
                          placeholder: 'Card Number'
                        }} 
                      />
                    </div>
                  </div>

                  {/* Row with Expiry, CVC, and Zip Code */}
                  <div className='d-grid gap-1' style={{ gridTemplateColumns: '2fr 80px 2fr' }}>
                    {/* Expiration */}
                    <div className='relative'>
                      <div className='stripe-card-wrapper' style={{
                        borderRadius: '12px',
                        border: 'none',
                        padding: '1rem 0.625rem 0.625rem',
                        boxShadow: '0px 3px 6px #00000029',
                        background:' #ffffff',
                        height: '47px',
                      }}>
                        <CardExpiryElement 
                          options={{
                            ...CARD_ELEMENT_OPTIONS,
                            placeholder: 'MM/YY'
                          }} 
                        />
                      </div>
                    </div>

                    {/* CVC */}
                    <div className='relative'>
                      <div className='stripe-card-wrapper' style={{
                        borderRadius: '12px',
                        border: 'none',
                        padding: '1rem 0.625rem 0.625rem',
                        boxShadow: '0px 3px 6px #00000029',
                        background:' #ffffff',
                        height: '47px',
                      }}>
                        <CardCvcElement 
                          options={{
                            ...CARD_ELEMENT_OPTIONS,
                            placeholder: 'CVC'
                          }} 
                        />
                      </div>
                    </div>

                    {/* Zip Code - Regular Input */}
                    <div className='relative'>
                      <ModalInput
                        id={'zipC'}
                        labelTitle={'Zip Code'}
                        value={formData.zipC || ''}
                        onChange={handleInputChange}
                      />
                      {errors.zipC && (
                        <p className='invalid-feedback d-block position-absolute fs-10'>
                          {errors.zipC}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className='fs-13 fw-light text-black mt-3'>
                    After your 14-day free trial, your card will be charged based on the plan you choose. 
                    You may cancel at any time by going to your account settings page. 
                    Cancellation must be submitted at least 48 hours prior to renewal.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className='d-flex flex-column align-items-center mt-3'>
              <p className='text-center fs-13 fw-medium mb-3 blue-color lh-sm'>
                By creating an account you agree to our
                <br />
                <a href="https://app.learntostart.com/terms" target="_blank" rel="noopener noreferrer" className="blue-color text-decoration-underline">
                  Terms of Service
                </a>
                <span> and </span>
                <a href="https://app.learntostart.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="blue-color text-decoration-underline">
                  Privacy Policy
                </a>
              </p>

              <div className='mb-3'>
                <div
                  className='login-button'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    background: 'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                    padding: '2px',
                    height: '58px',
                    boxShadow: '0px 4px 10px 0px #00000040',
                    width: '18.125rem'
                  }}
                >
                  <button
                    type='submit'
                    className={`w-100 register-btn ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading || !stripe}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <span 
                          className='spinner-border spinner-border-sm' 
                          style={{
                            width: '1.2rem',
                            height: '1.2rem',
                            borderColor: '#51C7DF',
                            borderRightColor: 'transparent'
                          }}
                        />
                        <span style={{ color: '#51C7DF' }}>Processing...</span>
                      </div>
                    ) : (
                      <span className='d-flex align-items-center justify-content-center gap-2' style={{fontWeight: 'bold', color: 'black'}}>
                        Select Your Plan
                        <FontAwesomeIcon icon={faArrowRight} className='ms-2 fw-bold' />
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* <div className='d-flex flex-column align-items-center justify-content-center mb-3'>
                <span className='mb-2 public-page-text'>OR USE</span>
                <div className='d-flex gap-3 auth-logos-buttons'>
                  <a
                    href={`${process.env.REACT_APP_SERVER_BASE_URL}auth/google`}
                    className='cursor-pointer'
                  >
                    <img className='auth-logos' src={googleLogo} alt='google' />
                  </a>
                  <a
                    href={`${
                      process.env.REACT_APP_SERVER_BASE_URL
                    }auth/facebook?from=${encodeURIComponent(currentUrl)}`}
                    className='cursor-pointer'
                  >
                    <img
                      className='auth-logos'
                      src={facebookLogo}
                      alt='facebook'
                    />
                  </a>
                  <a
                    href={`${process.env.REACT_APP_SERVER_BASE_URL}auth/microsoft`}
                    className='cursor-pointer'
                  >
                    <img className='auth-logos' src={microsoftLogo} alt='microsoft' />
                  </a>
                </div>
              </div> */}
              <p className='fs-13 fw-light text-black mb-0'>
                The security of your information is important.
              </p>
              <p
                className='fs-13 fw-medium blue-color cursor-pointer '
                onClick={() => setProtectModal(true)}
              >
                <IntlMessages id='login.protect_data' />
              </p>
            </div>
          </form>
        </section>
        <section className='d-flex justify-content-center mt-4 gap-2 mb-3 align-items-center'>
          <p className='fs-18 fw-light mb-0'>
            <IntlMessages id='create_account.already_registered' />
          </p>
          <Link className='fs-15 fw-medium blue-color' to='/'>
            Log in here
          </Link>
        </section>
        <HowWeProtect isOpen={protectModal} setIsOpen={setProtectModal} />
        <CheckSubscriptionModal 
          show={showCheckSubscription}
          onHide={() => setShowCheckSubscription(false)}
          registrationData={JSON.parse(sessionStorage.getItem('registrationData') || '{}')}
        />
      </main>
    </>
  )
}

// Main Register Component (wrapper with Elements provider)
function Register() {
  return (
    <Elements stripe={stripePromise}>
      <RegistrationForm />
    </Elements>
  )
}

export default Register
