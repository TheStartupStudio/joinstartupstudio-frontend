import { loadStripe } from '@stripe/stripe-js'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import courseLogo from '../../assets/images/academy-icons/svg/AIE Logo 3x.png'
import AcademyBtn from '../../components/AcademyBtn'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setGeneralLoading } from '../../redux/general/Actions'
import { userLogout, userLogin } from '../../redux'
import './index.css'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'

// const stripePromise = loadStripe(
//   'pk_test_51RTfyARsRTWEGaAp4zxg2AegOVpnOw6MXZG2qSfmT91KqlRhD3buK7X8A9m63EDc4W87lzYmycQ82ClJWndZJYr600RCjzzCDK'
// )

const stripePromise = loadStripe('pk_live_JnvIkZtjpceE5fSdedKFtdJN00rAR0j6Z4')

function CheckSubscription() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [registrationData, setRegistrationData] = useState(null)
  const [isReturningUser, setIsReturningUser] = useState(false)
  const [userTrialUsed, setUserTrialUsed] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  
  const user = useSelector((state) => state.user?.user?.user)

  const planDetails = {
    monthly: {
      price: '10.00',
      total: '10.00',
      period: 'month',
      priceId: process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID,
      commitment: '12 months'
    },
    annual: {
      price: '99.00',
      total: '99.00',
      period: 'year',
      priceId: process.env.REACT_APP_STRIPE_ANNUAL_PRICE_ID,
      commitment: 'year'
    }
  }

  // ✅ NEW: Function to refresh user data from backend
  const refreshUserData = async () => {
    try {
      
      // Fetch latest user data
      const response = await axiosInstance.get('/users')

      
      // Update Redux state with fresh data
      await dispatch(userLogin())
            
      return response.data
    } catch (error) {
      console.error('❌ Error refreshing user data:', error)
      throw error
    }
  }

  useEffect(() => {
    // Check if this is a returning user (logged in) or new registration
    if (user && user.id) {
      // ✅ UPDATED: Check if user already has active subscription OR is exempt
      if ((user.subscription_status === 'active' && user.stripe_subscription_id) || user.subscription_exempt) {
        toast.info(user.subscription_exempt 
          ? 'You have subscription access!' 
          : 'You already have an active subscription!')
        history.push('/dashboard')
        return
      }

      setIsReturningUser(true)
      setUserTrialUsed(user.trial_used || false)
      setRegistrationData({
        name: user.name,
        email: user.email,
      })
    } else {
      // New user registration flow
      const storedData = sessionStorage.getItem('registrationData')
      if (!storedData) {
        history.push('/register')
        return
      }
      setRegistrationData(JSON.parse(storedData))
      setIsReturningUser(false)
      setUserTrialUsed(false)
    }
  }, [history, user])

  const handleClick = async () => {
    if (!registrationData) {
      toast.error('Registration data not found. Please start over.')
      history.push(isReturningUser ? '/dashboard' : '/register')
      return
    }

    setIsLoading(true)

    try {
      if (isReturningUser) {
        
        const checkoutResponse = await axiosInstance.post(
          '/course-subscription/create-checkout-session',
          {
            planType: selectedPlan,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        )

        const { url, sessionId } = checkoutResponse.data

        // Store info for success page
        sessionStorage.setItem('subscription_in_progress', JSON.stringify({
          userId: user.id,
          email: registrationData.email,
          plan: selectedPlan,
          isReturning: true,
          timestamp: Date.now()
        }))

        // Clear registration data
        sessionStorage.removeItem('registrationData')

        // Redirect to Stripe
        if (url) {
          window.location.href = url
        } else if (sessionId) {
          const stripe = await stripePromise
          await stripe.redirectToCheckout({ sessionId })
        }
        
      } else {
        // New user registration flow
        const registrationResponse = await axiosInstance.post('/auth/register', {
          ...registrationData,
          selectedPlan: selectedPlan,
          priceId: planDetails[selectedPlan].priceId
        })

        if (registrationResponse.status === 200 || registrationResponse.status === 201) {
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

          const { sessionId, url } = checkoutResponse.data
          
          // Store registration data for success page
          sessionStorage.setItem('subscription_in_progress', JSON.stringify({
            email: registrationData.email,
            plan: selectedPlan,
            isReturning: false
          }))
          
          // Clear stored registration data
          sessionStorage.removeItem('registrationData')
          
          // Redirect to Stripe checkout
          if (url) {
            window.location.href = url
          } else {
            const stripe = await stripePromise
            await stripe.redirectToCheckout({ sessionId })
          }
        }
      }
    } catch (err) {
      console.error('❌ Checkout error:', err)
      console.error('Error response:', err.response?.data)
      
      // ✅ CHECK FOR needsRefresh FLAG
      if (err.response?.data?.needsRefresh === true) {
        
        try {
          // Refresh user data from backend
          await refreshUserData()
          
          // Show appropriate message
          const message = err.response?.data?.error || 
                         'You already have an active subscription. Your account has been updated.'
          toast.success(message)
          
          // Redirect to dashboard
          setTimeout(() => {
            history.push('/dashboard')
          }, 2000)
          
          return
        } catch (refreshError) {
          console.error('❌ Failed to refresh user data:', refreshError)
          toast.error('Unable to refresh account data. Please log out and log back in.')
        }
      }
      
      // Handle other error types
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Something went wrong during checkout'
      
      toast.error(errorMessage)
      
      // More specific error handling
      if (err.response?.status === 401) {
        toast.error('Please log in again to continue')
        history.push('/login')
      } else if (err.response?.status === 404) {
        toast.error('User not found. Please try registering again.')
        history.push('/register')
      } else if (err.response?.status === 400 && 
                 err.response?.data?.error?.includes('already have an active subscription')) {
        // Additional check for active subscription error
        try {
          await refreshUserData()
          toast.info('You already have an active subscription!')
          setTimeout(() => {
            history.push('/dashboard')
          }, 2000)
        } catch (refreshError) {
          console.error('❌ Failed to refresh user data:', refreshError)
        }
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
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
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
            {isReturningUser ? 'Resubscribe to Continue' : 'Choose Your Subscription'}
          </h2>

          {/* {isReturningUser && (
            <div className='mb-3 p-3 bg-light rounded text-center'>
              {userTrialUsed ? (
                <p className='mb-0 text-warning'>
                  <strong>Welcome back!</strong> Your 14-day trial has been used. 
                  Subscription will start immediately.
                </p>
              ) : (
                <p className='mb-0 text-success'>
                  <strong>Welcome back!</strong> You still have access to a 14-day free trial!
                </p>
              )}
            </div>
          )} */}

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
              <p className='commitment'>Get 1 month free when you pay for the entire year!</p>
            </div>
          </div>

          <div className='align-self-start mt-5 mb-5 payment-section mx-auto'>
            <h3 className='fs-21 fw-medium text-black text-center'>
              {selectedPlan === 'annual' ? 'Annual' : 'Monthly'} Subscription to Learn to Start LLC
            </h3>
            <div className='d-flex mt-5 justify-content-between payment-border'>
              <p className='fs-15 text-black'>
                Full access to Course in Entrepreneurship
              </p>
              <span>${planDetails[selectedPlan].price}</span>
            </div>
            <div className='d-flex justify-content-between mt-3'>
              <p className='text-black mb-0 fw-bold'>
                {isReturningUser && !userTrialUsed ? 'Trial Period' : 'Total Amount Due Today'}
              </p>
              <span className="text-black fw-bold">
                {isReturningUser && !userTrialUsed ? '$0 (14-day trial)' : `$${planDetails[selectedPlan].total}`}
              </span>
            </div>
          </div>

          <AcademyBtn
            disabled={isLoading}
            title={`${isLoading ? 'Processing...' : (isReturningUser ? 'Resubscribe Now' : 'Subscribe Now')}`}
            onClick={handleClick}
          />

          <p className='text-black fs-13 mt-4 text-center'>
            Secure payments powered by Stripe. You can cancel your subscription at any time. 
            Review our Terms of Use for more details.
          </p>

          <div className='mt-3 text-center'>
            {!isReturningUser && (
              <button 
                onClick={() => {
                  sessionStorage.removeItem('registrationData')
                  history.push('/register')
                }}
                className='text-blue-500 fs-13 bg-transparent border-0 text-decoration-underline'
              >
                Change registration details
              </button>
            )}
          </div>

          <div>
            <p className='text-center text-black text-uppercase fs-13 fw-medium mb-0'>
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
