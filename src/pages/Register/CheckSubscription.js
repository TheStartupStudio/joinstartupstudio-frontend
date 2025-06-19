import { loadStripe } from '@stripe/stripe-js'
import { useState, useEffect } from 'react'
import courseLogo from '../../assets/images/academy-icons/svg/Startup-Studio-Logo.svg'
import AcademyBtn from '../../components/AcademyBtn'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setGeneralLoading } from '../../redux/general/Actions'
import { userLogout } from '../../redux'
import './index.css'

// const stripePromise = loadStripe(
//   'pk_test_51RTfyARsRTWEGaAp4zxg2AegOVpnOw6MXZG2qSfmT91KqlRhD3buK7X8A9m63EDc4W87lzYmycQ82ClJWndZJYr600RCjzzCDK'
// )
const stripePromise = loadStripe('pk_live_JnvIkZtjpceE5fSdedKFtdJN00rAR0j6Z4')

function CheckSubscription() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly') // monthly or annual
  const dispatch = useDispatch()

  const planDetails = {
  monthly: {
    price: '9.99',
    total: '119.88', // 9.99 * 12
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

  const handleClick = async () => {
    setIsLoading(true)
    console.log('ardi 39,', selectedPlan)
    try {
      const response = await axiosInstance.post(
        '/course-subscription/create-checkout-session',
        {
          planType: selectedPlan
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const { sessionId } = response.data
      const stripe = await stripePromise
      await stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      console.error('Checkout error:', err)
      const errorMessage =
        err.response?.data?.error || 'Something went wrong during checkout'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    dispatch(setGeneralLoading(true))
    await dispatch(userLogout())
      .then(() => {
        localStorage.clear()
        // history.push('/')
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

  return (
    <>
      {/* <div className='d-flex justify-content-end m-3'>
        <button onClick={handleLogout} className='log-out-btn-sub'>
          Log Out
        </button>
      </div> */}

      <div className='d-flex justify-content-center p-5'>
        <div className='d-flex align-items-center flex-column payment-main'>
          <img
            src={courseLogo}
            alt='course-logo'
            className='course-logo-image'
          />
          
          <h2 className='text-uppercase fs-24 fw-bold mt-5 text-black subscription-title'>
            Choose Your Subscription Plan
          </h2>

          <div className='subscription-plans mt-4'>
            <div 
              className={`plan-option ${selectedPlan === 'monthly' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <h3>Monthly Plan</h3>
              <p className='price'>${planDetails.monthly.price}/month</p>
              <p className='commitment'>12-month commitment</p>
            </div>

            <div 
              className={`plan-option ${selectedPlan === 'annual' ? 'selected' : ''}`}
              onClick={() => setSelectedPlan('annual')}
            >
              <h3>Annual Plan</h3>
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
            title={`${isLoading ? '...' : 'Subscribe Now'}`}
            onClick={handleClick}
          />

          <p className='text-black fs-13 mt-4 text-center'>
            Secure payment powered by Stripe. You can cancel your subscription
            at any time.
          </p>

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

// Add SubscriptionStatus component in the same file
const SubscriptionStatus = () => {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axiosInstance.get('/course-subscription/status')
        setStatus(response.data)
      } catch (error) {
        console.error('Error fetching subscription status:', error)
      }
    }
    checkStatus()
  }, [])

  if (!status) return null

  return (
    <div className="subscription-status">
      {status.isActive ? (
        <div className="status-active">
          {status.status === 'canceling' ? (
            <p>Your subscription will end in {status.remainingDays} days</p>
          ) : (
            <p>Your subscription is active</p>
          )}
        </div>
      ) : (
        <p>Your subscription has ended</p>
      )}
    </div>
  )
}

export default CheckSubscription
