import { loadStripe } from '@stripe/stripe-js'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import courseLogo from '../../assets/images/academy-icons/svg/AIE Logo 3x.png'
import AcademyBtn from '../../components/AcademyBtn'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setGeneralLoading } from '../../redux/general/Actions'
import { userLogout } from '../../redux'
import './index.css'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'

const stripePromise = loadStripe(
  'pk_test_51RTfyARsRTWEGaAp4zxg2AegOVpnOw6MXZG2qSfmT91KqlRhD3buK7X8A9m63EDc4W87lzYmycQ82ClJWndZJYr600RCjzzCDK'
)

function CheckSubscription() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [registrationData, setRegistrationData] = useState(null)
  const dispatch = useDispatch()
  const history = useHistory()

  const planDetails = {
    monthly: {
      price: '10.00',
      total: '10.00',
      period: 'month',
      priceId: process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID,
      commitment: '12 months'
    },
    annual: {
      price: '110.00',
      total: '110.00',
      period: 'year',
      priceId: process.env.REACT_APP_STRIPE_ANNUAL_PRICE_ID,
      commitment: 'year'
    }
  }

  useEffect(() => {
    // Get registration data from sessionStorage
    const storedData = sessionStorage.getItem('registrationData')
    if (!storedData) {
      // If no registration data, redirect back to register
      history.push('/register')
      return
    }
    setRegistrationData(JSON.parse(storedData))
  }, [history])

  const handleClick = async () => {
    if (!registrationData) {
      toast.error('Registration data not found. Please start over.')
      history.push('/register')
      return
    }

    setIsLoading(true)

    try {
      // Step 1: Register the user first
      const registrationResponse = await axiosInstance.post('/auth/register', {
        ...registrationData,
        selectedPlan: selectedPlan,
        priceId: planDetails[selectedPlan].priceId
      })

      if (registrationResponse.status === 200 || registrationResponse.status === 201) {
        // Step 2: Create checkout session with the registered user
        const checkoutResponse = await axiosInstance.post(
          '/course-subscription/create-checkout-session',
          {
            planType: selectedPlan,
            paymentMethodId: registrationData.paymentMethodId,
            email: registrationData.email
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        const { sessionId } = checkoutResponse.data
        const stripe = await stripePromise
        
        // Clear stored registration data
        sessionStorage.removeItem('registrationData')
        
        // Redirect to Stripe checkout
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (err) {
      console.error('Checkout error:', err)
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Something went wrong during checkout'
      toast.error(errorMessage)
      
      // If registration failed, redirect back to register
      if (err.response?.status === 400 || err.response?.status === 409) {
        sessionStorage.removeItem('registrationData')
        history.push('/register')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    dispatch(setGeneralLoading(true))
    await dispatch(userLogout())
      .then(() => {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/'
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => {
        window.location.href = '/'
        dispatch(setGeneralLoading(false))
      })
  }

  if (!registrationData) {
    return <div>Loading...</div>
  }

  return (
    <>
      <img
        src={MenuIcon}
        alt='menu'
        className='menu-icon-cie self-start-tab cursor-pointer menu-icon-right'
        onClick={() => dispatch(toggleCollapse())}
      />

      <div className='d-flex justify-content-center p-5'>
        <div className='d-flex align-items-center flex-column payment-main bck-gradient'>
          <img
            src={courseLogo}
            alt='course-logo'
            className='course-logo-image'
          />
          
          <h2 className='text-uppercase fs-24 fw-bold mt-5 text-black subscription-title'>
            Choose Your Subscription 
          </h2>

          <div className='subscription-plans mt-4'>
            <div 
              className={`plan-option ${selectedPlan === 'monthly' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <h5>Monthly Plan</h5>
              <p className='price'>${planDetails.monthly.price}/month</p>
              <p className='commitment'>12-month commitment</p>
            </div>

            <div 
              className={`plan-option ${selectedPlan === 'annual' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('annual')}
            >
              <h5>Annual Plan</h5>
              <p className='price'>${planDetails.annual.price}/year</p>
              <p className='commitment'>Pay once for full year</p>
            </div>
          </div>

          <div className='align-self-start mt-5 mb-5 payment-section mx-auto'>
            <h3 className='fs-21 fw-medium text-black'>
              {selectedPlan === 'annual' ? 'Annual' : 'Monthly'} Subscription to Learn to Start LLC
            </h3>
            <div className='d-flex justify-content-between payment-border'>
              <p className='fs-15 text-black'>
                Full access to Course in Entrepreneurship
              </p>
              <span>${planDetails[selectedPlan].price}</span>
            </div>
            <div className='d-flex justify-content-between mt-3'>
              <p className='fs-15 text-black mb-0'>Total Amount</p>
              <span>${planDetails[selectedPlan].total}</span>
            </div>
          </div>

          <AcademyBtn
            disabled={isLoading}
            title={`${isLoading ? 'Processing...' : 'Subscribe Now'}`}
            onClick={handleClick}
          />

          <p className='text-black fs-13 mt-4 text-center'>
            Secure payment powered by Stripe. You can cancel your subscription
            at any time.
          </p>

          <div className='mt-3 text-center'>
            <p className='text-black fs-13 mb-1'>
              Registering as: <strong>{registrationData?.email}</strong>
            </p>
            <button 
              onClick={() => {
                sessionStorage.removeItem('registrationData')
                history.push('/register')
              }}
              className='text-blue-500 fs-13 bg-transparent border-0 text-decoration-underline'
            >
              Change registration details
            </button>
          </div>

          <div>
            <p className='text-center text-black text-uppercase fs-13 fw-medium mb-0 mt-5'>
              The Startup Studio
            </p>
            <p className='fs-13 fw-medium text-black'>
              https://academy.learntostart.com/
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckSubscription
