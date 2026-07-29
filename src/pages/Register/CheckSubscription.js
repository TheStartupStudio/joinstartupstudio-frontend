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
import StartupStudioLogo from '../../assets/images/Startup Studio Logo v1x1200.png'
import {
  getOrganizationType,
  grantSubscriptionAccess,
  getPostSubscriptionAccessPath,
  hasSubscriptionAccess,
  shouldSkipSubscriptionFlow
} from '../../utils/subscriptionHelpers'
import {
  DEFAULT_TRIAL_SETTINGS,
  formatTrialLabel,
  getTrialSettingsFromUniversity
} from '../../utils/trialSettings'


// const stripePromise = loadStripe(
//   'pk_test_51RTfyARsRTWEGaAp4zxg2AegOVpnOw6MXZG2qSfmT91KqlRhD3buK7X8A9m63EDc4W87lzYmycQ82ClJWndZJYr600RCjzzCDK'
// )


const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ||
    'pk_live_JnvIkZtjpceE5fSdedKFtdJN00rAR0j6Z4'
)


function CheckSubscription() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [registrationData, setRegistrationData] = useState(null)
  const [isReturningUser, setIsReturningUser] = useState(false)
  const [userTrialUsed, setUserTrialUsed] = useState(false)
  const [organizationPricing, setOrganizationPricing] = useState(null) // ✅ New state
  const [loadingPricing, setLoadingPricing] = useState(true) // ✅ New state
  const [trialSettings, setTrialSettings] = useState(DEFAULT_TRIAL_SETTINGS)
  const dispatch = useDispatch()
  const history = useHistory()
  
  const user = useSelector((state) => state.user?.user?.user)

  const defaultPlanDetails = {
    monthly: {
      price: '15.00',
      total: '15.00',
      period: 'month',
      priceId: process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID,
      commitment: '12-months commitment'
    },
    annual: {
      price: '150.00',
      total: '150.00',
      period: 'year',
      priceId: process.env.REACT_APP_STRIPE_ANNUAL_PRICE_ID,
      commitment: 'Get 2 months free when you pay for the entire year'
    }
  }

  const planDetails = organizationPricing || defaultPlanDetails

  const refreshUserData = async () => {
    try {
      const response = await axiosInstance.get('/users')
      await dispatch(userLogin())
      return response.data
    } catch (error) {
      console.error('❌ Error refreshing user data:', error)
      throw error
    }
  }

useEffect(() => {
  const fetchOrganizationPricing = async () => {
    if (!user || !user.id) {
      console.log('❌ No user found, skipping pricing fetch')
      setLoadingPricing(false)
      return
    }

    try {
      console.log('📌 Fetching organization pricing for user:', user.id)
      
      const response = await axiosInstance.get('/super-admin/user/organization-pricing', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      console.log('✅ Organization pricing response:', response.data)

      if (response.data.success) {
        if (response.data.trialSettings) {
          setTrialSettings(response.data.trialSettings)
        }

        if (shouldSkipSubscriptionFlow(response.data)) {
          grantSubscriptionAccess(getOrganizationType(response.data), user?.id)
          history.replace(
            getPostSubscriptionAccessPath(user, history.location.pathname)
          )
          return
        }

        if (response.data.hasOrganizationPricing && response.data.pricing) {
          console.log('✅ Organization pricing found:', response.data.pricing)
          
          const orgPricing = {}
          
          Object.keys(response.data.pricing).forEach(key => {
            const pricing = response.data.pricing[key]
            
            const periodMap = {
              'monthly': 'month',
              'yearly': 'year',
              'one-time': 'one-time',
              '6-month': '6 months'
            }
            
            const commitmentMap = {
              'monthly': '12 months',
              'yearly': 'year',
              'one-time': 'one-time payment',
              '6-month': '6 months'
            }
            
            orgPricing[key] = {
              price: pricing.amount.toFixed(2),
              total: pricing.amount.toFixed(2),
              period: periodMap[pricing.frequency] || pricing.frequency,
              priceId: pricing.priceId,
              commitment: commitmentMap[pricing.frequency] || pricing.frequency,
              description: pricing.description,
              frequency: pricing.frequency,
              isOrganizationPrice: true
            }
          })

          console.log('✅ Transformed org pricing:', orgPricing)
          setOrganizationPricing(orgPricing)
          
          if (orgPricing.monthly) {
            setSelectedPlan('monthly')
          } else if (orgPricing.annual) {
            setSelectedPlan('annual')
          } else if (orgPricing['6-month']) {
            setSelectedPlan('6-month')
          } else if (orgPricing['one-time']) {
            setSelectedPlan('one-time')
          } else {
            setSelectedPlan(Object.keys(orgPricing)[0])
          }
        } else {
          console.log('ℹ️ Using default pricing')
          setOrganizationPricing(null)
          if (response.data.trialSettings) {
            setTrialSettings(response.data.trialSettings)
          }
        }
      }
    } catch (error) {
      console.error('❌ Error fetching organization pricing:', error)
      console.error('Error response:', error.response?.data)
      setOrganizationPricing(null)
      if (user?.University) {
        setTrialSettings(getTrialSettingsFromUniversity(user.University))
      }
    } finally {
      setLoadingPricing(false)
    }
  }

  fetchOrganizationPricing()
}, [user?.id, history])


  useEffect(() => {
    if (user && user.id) {
      if (hasSubscriptionAccess(user)) {
        grantSubscriptionAccess(getOrganizationType(user), user?.id)

        const targetPath = getPostSubscriptionAccessPath(
          user,
          history.location.pathname
        )

        if (history.location.pathname !== targetPath) {
          history.replace(targetPath)
        }
        return
      }

      setIsReturningUser(true)
      setUserTrialUsed(user.trial_used || false)
      setRegistrationData({
        name: user.name,
        email: user.email,
      })
    } else {
      const storedData = sessionStorage.getItem('registrationData')
      if (!storedData) {
        history.push('/register')
        return
      }
      setRegistrationData(JSON.parse(storedData))
      setIsReturningUser(false)
      setUserTrialUsed(false)
    }
  }, [
    history,
    user?.id,
    user?.University,
    user?.subscription_status,
    user?.stripe_subscription_id,
    user?.subscription_exempt,
    user?.University?.organizationType,
    user?.University?.organization_type,
    user?.trial_used,
    user?.name,
    user?.email,
  ])

  useEffect(() => {
    if (user?.University) {
      setTrialSettings(getTrialSettingsFromUniversity(user.University))
    }
  }, [user?.University?.trialEnabled, user?.University?.trialPeriodDays])

  const trialApplies =
    isReturningUser && !userTrialUsed && trialSettings.trialEnabled
  const trialLabel = formatTrialLabel(trialSettings.trialPeriodDays)

  const handleClick = async () => {
    if (!registrationData) {
      toast.error('Registration data not found. Please start over.')
      history.push(isReturningUser ? '/dashboard' : '/register')
      return
    }

    setIsLoading(true)

    try {
      if (isReturningUser) {
        const selectedPlanDetails = planDetails[selectedPlan]
        const checkoutResponse = await axiosInstance.post(
          '/course-subscription/create-checkout-session',
          {
            planType: selectedPlan,
            organizationPriceId: selectedPlanDetails?.priceId,
            frequency: selectedPlanDetails?.frequency || selectedPlan,
            isOneTime:
              selectedPlan === 'one-time' ||
              selectedPlanDetails?.frequency === 'one-time'
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        )

        const { url, sessionId } = checkoutResponse.data

        sessionStorage.setItem('subscription_in_progress', JSON.stringify({
          userId: user.id,
          email: registrationData.email,
          plan: selectedPlan,
          isReturning: true,
          timestamp: Date.now()
        }))

        sessionStorage.removeItem('registrationData')

        if (url) {
          window.location.href = url
        } else if (sessionId) {
          const stripe = await stripePromise
          await stripe.redirectToCheckout({ sessionId })
        }
        
      } else {
        const registrationResponse = await axiosInstance.post('/auth/register', {
          ...registrationData,
          selectedPlan: selectedPlan,
          priceId: planDetails[selectedPlan].priceId
        })

        if (registrationResponse.status === 200 || registrationResponse.status === 201) {
          const selectedPlanDetails = planDetails[selectedPlan]
          const checkoutResponse = await axiosInstance.post(
            '/course-subscription/create-checkout-session',
            {
              planType: selectedPlan,
              paymentMethodId: registrationData.paymentMethodId,
              email: registrationData.email,
              organizationPriceId: selectedPlanDetails?.priceId,
              frequency: selectedPlanDetails?.frequency || selectedPlan,
              isOneTime:
                selectedPlan === 'one-time' ||
                selectedPlanDetails?.frequency === 'one-time'
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )

          const { sessionId, url } = checkoutResponse.data
          
          sessionStorage.setItem('subscription_in_progress', JSON.stringify({
            email: registrationData.email,
            plan: selectedPlan,
            isReturning: false
          }))
          
          sessionStorage.removeItem('registrationData')
          
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
      
      if (err.response?.data?.needsRefresh === true) {
        try {
          await refreshUserData()
          const message = err.response?.data?.error || 
                         'You already have an active subscription. Your account has been updated.'
          toast.success(message)
          setTimeout(() => {
            history.push('/dashboard')
          }, 2000)
          return
        } catch (refreshError) {
          console.error('❌ Failed to refresh user data:', refreshError)
          toast.error('Unable to refresh account data. Please log out and log back in.')
        }
      }
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Something went wrong during checkout'
      
      toast.error(errorMessage)
      
      if (err.response?.status === 401) {
        toast.error('Please log in again to continue')
        history.push('/login')
      } else if (err.response?.status === 404) {
        toast.error('User not found. Please try registering again.')
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

  if (!registrationData || loadingPricing) {
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
            src={StartupStudioLogo}
            alt='course-logo'
            className='course-logo-image'
          />
          
          <h2 className='text-uppercase fs-24 fw-bold mt-5 text-black subscription-title'>
            {"Choose Your Subscription"}
          </h2>

          <div className='subscription-plans mt-4 flex-wrap'>
            {/* Monthly Plan */}
            {planDetails.monthly && (
              <div 
                className={`plan-option ${selectedPlan === 'monthly' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <h5>Monthly Plan</h5>
                <p className='price'>${planDetails.monthly.price}/month</p>
                {/* <p className='commitment'>{planDetails.monthly.commitment}</p> */}
              </div>
            )}

            {/* 6-Month Plan */}
            {planDetails['6-month'] && (
              <div 
                className={`plan-option ${selectedPlan === '6-month' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('6-month')}
              >
                <h5>6-Month Plan</h5>
                <p className='price'>${planDetails['6-month'].price}/6 months</p>
                {/* <p className='commitment'>{planDetails['6-month'].commitment}</p> */}
                
              </div>
            )}

            {/* Annual Plan */}
            {planDetails.annual && (
              <div 
                className={`plan-option ${selectedPlan === 'annual' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('annual')}
              >
                <h5>Builders Plan</h5>
                <p className='price'>${planDetails.annual.price}/year</p>
                {/* <p className='commitment'>{planDetails.annual.commitment}</p> */}
                
              </div>
            )}

            {/* One-Time Plan */}
            {planDetails['one-time'] && (
              <div 
                className={`plan-option ${selectedPlan === 'one-time' ? 'selected' : ''}`}
                onClick={() => setSelectedPlan('one-time')}
              >
                <h5>One-Time Payment</h5>
                <p className='price'>${planDetails['one-time'].price}</p>
                {/* <p className='commitment'>{planDetails['one-time'].commitment}</p> */}
                
              </div>
            )}
          </div>

          <div className='align-self-start mt-5 mb-5 payment-section mx-auto'>
            <h3 className='fs-21 fw-medium text-black text-center'>
              {selectedPlan === 'annual' ? 'Annual' : 'Monthly'} Subscription to StudioOS Powered by Learn to Start
            </h3>
            <div className='d-flex mt-5 justify-content-between payment-border'>
              <p className='fs-15 text-black'>
                Full Access to StudioOS
              </p>
              <span>${planDetails[selectedPlan]?.price || '0.00'}</span>
            </div>
            <div className='d-flex justify-content-between mt-3'>
              <p className='text-black mb-0 fw-bold'>
                {trialApplies ? 'Trial Period' : 'Total Amount Due Today'}
              </p>
              <span className="text-black fw-bold">
                {trialApplies
                  ? `$0 (${trialLabel})`
                  : `$${planDetails[selectedPlan]?.total || '0.00'}`}
              </span>
            </div>
          </div>

          <AcademyBtn
            disabled={isLoading || !planDetails[selectedPlan]}
            title={`${isLoading ? 'Processing...' : (user?.trial_used ? 'Resubscribe Now' : 'Subscribe Now')}`}
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
              https://joinstudioos.com/
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckSubscription