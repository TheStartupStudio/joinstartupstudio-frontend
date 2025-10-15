import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userLogin } from '../../redux'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'

const SubscriptionSuccess = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [pollingAttempt, setPollingAttempt] = useState(0)
  const [status, setStatus] = useState('Verifying payment...')
  
  const MAX_POLLING_ATTEMPTS = 15 // 30 seconds (15 attempts × 2 seconds)
  const POLLING_INTERVAL = 2000 // 2 seconds
  const INITIAL_DELAY = 2000 // Wait 2 seconds before first check

  const refreshUserData = async () => {
    try {
      
      const response = await axiosInstance.get('/users')
      
      await dispatch(userLogin())
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  const verifyAndSyncSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new Error('No access token found')
      }
      
      const response = await axiosInstance.post(
        `/course-subscription/verify-and-sync/${sessionId}`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      
      if (response.data.success) {
        return {
          subscription_status: 'active',
          stripe_subscription_id: response.data.stripe_subscription_id,
          synced: response.data.synced,
          message: response.data.message
        }
      }
      
      return {
        subscription_status: response.data.subscription_status || 'pending',
        stripe_subscription_id: null,
        processing: true,
        message: response.data.message
      }
      
    } catch (error) {
      
      if (error.response?.status === 404) {
        return await refreshUserData()
      }
      
      throw error
    }
  }

  const pollSubscriptionStatus = (sessionId) => {
    
    let attempts = 0

    const poll = async () => {
      try {
        attempts++
        setPollingAttempt(attempts)
        setStatus(`Verifying with Stripe... (${attempts}/${MAX_POLLING_ATTEMPTS})`)
        
        const data = await verifyAndSyncSession(sessionId)

        const hasActiveSubscription = 
          data.subscription_status === 'active' && 
          data.stripe_subscription_id

        if (hasActiveSubscription) {
          
          setStatus('Subscription activated! Refreshing your account...')
          
          await refreshUserData()
          
          toast.success('🎉 Subscription activated successfully!')
          
          setTimeout(() => {
            setLoading(false)
            history.push('/dashboard')
          }, 2000)
          
          return 
        }

        if (attempts < MAX_POLLING_ATTEMPTS) {
          const statusText = data.processing 
            ? 'Processing payment with Stripe...' 
            : `Current status: ${data.subscription_status || 'pending'}`
          
          setStatus(`${statusText} (Attempt ${attempts}/${MAX_POLLING_ATTEMPTS})`)
          
          setTimeout(() => poll(), POLLING_INTERVAL)
        } else {
          setStatus('Still processing...')
          
          const finalUserData = await refreshUserData()
          
          if (finalUserData.subscription_status === 'active' && finalUserData.stripe_subscription_id) {
            toast.success('🎉 Subscription activated successfully!')
            
            setTimeout(() => {
              setLoading(false)
              history.push('/dashboard')
            }, 2000)
          } else {
            toast.warning(
              'Your subscription is being processed. Please refresh the page in a moment or contact support if issues persist.',
              { autoClose: 8000 }
            )
            
            setTimeout(() => {
              setLoading(false)
              history.push('/dashboard')
            }, 3000)
          }
        }
      } catch (error) {
        console.error('❌ Polling error:', error)
        
        if (error.response?.status === 401) {
          toast.error('Session expired. Please log in again.')
          history.push('/login')
          return
        }

        if (attempts < MAX_POLLING_ATTEMPTS) {
          setTimeout(() => poll(), POLLING_INTERVAL)
        } else {
          setStatus('Error verifying subscription')
          toast.error('Unable to verify subscription. Please refresh the page or contact support.')
          
          setTimeout(() => {
            setLoading(false)
            history.push('/dashboard')
          }, 3000)
        }
      }
    }

    setTimeout(() => {
      poll()
    }, INITIAL_DELAY)
  }

  useEffect(() => {
    
    const handleSuccess = () => {
      try {
        const params = new URLSearchParams(location.search)
        const sessionId = params.get('session_id')
        
        
        if (!sessionId) {
          toast.error('Invalid payment confirmation. Redirecting...')
          setTimeout(() => {
            history.push('/subscribe')
          }, 3000)
          return
        }

        const storedData = sessionStorage.getItem('subscription_in_progress')
        if (storedData) {
          const parsedData = JSON.parse(storedData)
        }

        setStatus('Payment successful! Verifying with Stripe...')
        
        pollSubscriptionStatus(sessionId)
        
      } catch (error) {
        console.error('❌ Error in handleSuccess:', error)
        setStatus('Error processing payment confirmation')
        
        toast.error('Payment completed, but there was an issue. Please contact support.')
        
        setTimeout(() => {
          setLoading(false)
          history.push('/dashboard')
        }, 5000)
      }
    }

    handleSuccess()

    return () => {
      sessionStorage.removeItem('subscription_in_progress')
    }
  }, [location.search, history, dispatch]) 

  if (loading) {
    const progressPercentage = Math.min((pollingAttempt / MAX_POLLING_ATTEMPTS) * 100, 100)
    
    return (
      <div 
        className="d-flex justify-content-center align-items-center" 
        style={{ 
          minHeight: '100vh', 
          backgroundColor: '#f8f9fa',
          fontFamily: 'Montserrat, sans-serif'
        }}
      >
        <div className="text-center p-5" style={{ maxWidth: '600px' }}>
          {/* Success Icon & Spinner */}
          <div className="mb-4">
            <div 
              className="spinner-border text-success" 
              role="status" 
              style={{ width: '4rem', height: '4rem' }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="mb-3" style={{ color: '#28a745', fontWeight: '600' }}>
            Payment Successful!
          </h1>
          
          {/* Status Message */}
          <p className="mb-4" style={{ fontSize: '18px', color: '#666' }}>
            {status}
          </p>

          {/* Progress Bar */}
          {pollingAttempt > 0 && (
            <div className="mb-4">
              <div className="progress mx-auto" style={{ height: '10px', maxWidth: '400px' }}>
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                  role="progressbar" 
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <p className="text-muted small mt-2">
                Verification attempt {pollingAttempt} of {MAX_POLLING_ATTEMPTS}
              </p>
            </div>
          )}

          {/* Information Box */}
          <div className="alert alert-info" role="alert">
            <p className="mb-0">
              <strong>What's happening?</strong>
            </p>
            <p className="mb-0 small">
              We're verifying your payment directly with Stripe and activating your subscription. 
              This usually takes just a few seconds.
            </p>
          </div>

          {/* Show warning if taking longer */}
          {pollingAttempt > 7 && pollingAttempt <= 12 && (
            <div className="alert alert-warning mt-3" role="alert">
              <p className="mb-0">
                <strong>Taking a bit longer than usual...</strong>
              </p>
              <p className="mb-0 small">
                Your payment is being verified. Please don't close this page.
              </p>
            </div>
          )}

          {/* Show action if taking too long */}
          {pollingAttempt > 12 && (
            <div className="alert alert-warning mt-3" role="alert">
              <p className="mb-2">
                <strong>This is taking longer than expected.</strong>
              </p>
              <p className="mb-3 small">
                Your subscription is being processed, but you can continue to the dashboard.
                You may need to refresh the page to see your active subscription.
              </p>
              <button 
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setLoading(false)
                  history.push('/')
                }}
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

export default SubscriptionSuccess