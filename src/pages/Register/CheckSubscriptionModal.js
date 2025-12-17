import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import AcademyBtn from '../../components/AcademyBtn'
import courseLogo from '../../assets/images/academy-icons/svg/AIE Logo 3x.png'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { trackSubscribe, trackSignUp } from '../../utils/FacebookPixel'
import StartupStudioLogo from '../../assets/images/Startup Studio Logo v1x1200.png'

const CheckSubscriptionModal = ({ show, onHide, registrationData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [organizationPricing, setOrganizationPricing] = useState(null)
  const [loadingPricing, setLoadingPricing] = useState(true)
  const history = useHistory()

  const displayPlans = {
    monthly: {
      price: '15.00',
      total: '15.00',
      period: 'month',
      priceId: process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID || 'price_1RbhmbE4OMqDE3oQyb89B1dy',
      commitment: '12-months commitment'
    },
    annual: {
      price: '150.00',
      total: '150.00',
      period: 'year',
      priceId: process.env.REACT_APP_STRIPE_ANNUAL_PRICE_ID || 'price_1SFxTOE4OMqDE3oQ4QJgzMBZ',
      commitment: 'Get 2 months free when you pay for the entire year'
    }
  }

  const planDetails = organizationPricing || displayPlans

  // Fetch organization pricing based on email
  useEffect(() => {
    const fetchOrganizationPricing = async () => {
      if (!registrationData?.email) {
        console.log('❌ No email found, using default pricing')
        setLoadingPricing(false)
        return
      }

      try {
        console.log('📌 Checking organization pricing for email:', registrationData.email)
        
        // Try to fetch organization pricing by email (unauthenticated endpoint)
        const response = await axiosInstance.post('/auth/check-organization-pricing', {
          email: registrationData.email
        })

        console.log('✅ Organization pricing response:', response.data)

        if (response.data.success && response.data.hasOrganizationPricing && response.data.pricing) {
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
          
          // Set default selected plan based on available options
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
        }
      } catch (error) {
        console.error('❌ Error fetching organization pricing:', error)
        console.error('Error response:', error.response?.data)
        // If endpoint doesn't exist or fails, use default pricing
        setOrganizationPricing(null)
      } finally {
        setLoadingPricing(false)
      }
    }

    if (show) {
      fetchOrganizationPricing()
    }
  }, [registrationData, show])

  const handleSubscription = async () => {
    if (!registrationData || !registrationData.paymentMethodId) {
      toast.error('Registration data not found. Please try again.')
      onHide()
      return
    }

    setIsLoading(true)

    try {
      // Don't send priceId - let backend fetch from org 27
      const response = await axiosInstance.post('/auth/register-with-subscription', {
        ...registrationData,
        selectedPlan: selectedPlan
        // priceId is OPTIONAL - backend will fetch it from org 27
      })

      if (response.data.success) {
        sessionStorage.removeItem('registrationData')
        
        if (response.data.tokens) {
          localStorage.setItem('accessToken', response.data.tokens.accessToken)
          localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
        }

        const subscriptionValue = parseFloat(displayPlans[selectedPlan].price)
        
        trackSignUp('email')
        trackSubscribe({
          value: subscriptionValue,
          currency: 'USD',
          predictedLifetimeValue: selectedPlan === 'monthly' ? 119.88 : 99.00
        })

        toast.success('Registration and subscription successful!')
        
        onHide()
        history.push('/dashboard') 
      }
    } catch (error) {
      console.error('Subscription error:', error)
      const errorMessage = error.response?.data?.error || 
                          'Something went wrong during registration'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered
      className="check-subscription-transparent-modal" 
    >
      
      <Modal.Body>
        {loadingPricing ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading pricing...</span>
            </div>
          </div>
        ) : (
        <div className='d-flex justify-content-center p-sm-5 positon-relative'>

          <div className='d-flex align-items-center flex-column payment-main bck-gradient position-relative'>

                  <div className="subscription-close" onClick={onHide} style={{ cursor: 'pointer' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M1.44661 14.4459L7.99991 7.89258M14.5532 1.33928L7.99991 7.89258M7.99991 7.89258L1.44661 1.33928M7.99991 7.89258L14.5532 14.4459" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <img
                    src={StartupStudioLogo}
                    alt='course-logo'
                    className='course-logo-image'
                  />
                   
                  <h2 className='text-uppercase fs-24 fw-bold mt-5 text-black subscription-title'>
                    Choose Your Subscription 
                  </h2>
        
                  <div className='subscription-plans mt-4'>
                    {/* Monthly Plan */}
                    {planDetails.monthly && (
                      <div 
                        className={`plan-option ${selectedPlan === 'monthly' ? 'selected' : ''}`}
                        onClick={() => setSelectedPlan('monthly')}
                      >
                        <h5>Monthly Plan</h5>
                        <p className='price'>${planDetails.monthly.price}/month</p>
                        <p className='commitment'>12-months commitment</p>
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
                        <p className='commitment'>{planDetails['6-month'].commitment}</p>
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
                        <p className='commitment'>Get 2 months free when you pay for the entire year</p>
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
                        <p className='commitment'>{planDetails['one-time'].commitment}</p>
                      </div>
                    )}
                  </div>
        
                  <div className='align-self-start mt-5 mb-5 payment-section mx-auto'>
                    <h3 className='fs-21 fw-medium text-black text-center'>
                      {selectedPlan === 'annual' ? 'Annual' : 'Monthly'} Subscription to The Startup Studio Powered by Learn to Start
                    </h3>
                    <div className='d-flex mt-5 justify-content-between payment-border'>
                      <p className='fs-15 text-black'>
                        Full Access to the Startup Studio
                      </p>
                      <span>${planDetails[selectedPlan]?.price || '0.00'}</span>
                    </div>
                    <div className='d-flex justify-content-between mt-3'>
                      <p className='text-black mb-0 fw-bold'>Trial Period</p>
                      <span className="text-black fw-bold">$0 (14-day trial)</span>
                    </div>
                  </div>
        
                  <AcademyBtn
                    disabled={isLoading || !planDetails[selectedPlan]}
                    title={`${isLoading ? 'Processing...' : 'Subscribe Now'}`}
                    onClick={handleSubscription}
                  />
        
                  <p className='text-black fs-13 mt-4 text-center'>
                    Secure payments powered by Stripe. You can cancel your subscription at any time. 
                    Review our Terms of Use for more details.
                  </p>
        
                </div>


                <div style={{
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)', 
                      zIndex: -1,  // Changed from 1000000 to -1
                      pointerEvents: 'none' // Add this to ensure it doesn't block interactions
                    }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="610" height="767" viewBox="0 0 610 767" fill="none">
                    <path d="M610 288.48C610 552.547 473.447 766.616 305 766.616C136.553 766.616 0 552.547 0 288.48C0 24.4126 144.446 -5.38379 312.893 -5.38379C481.34 -5.38379 610 24.4126 610 288.48Z" fill="url(#paint0_radial_3290_19282)" fill-opacity="0.2"/>
                    <defs>
                      <radialGradient id="paint0_radial_3290_19282" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(305 288.48) rotate(90) scale(478.136 305)">
                        <stop offset="0.375" stopColor="#51C7DF"/>
                        <stop offset="1" stopColor="white" stopOpacity="0"/>
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
              </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default CheckSubscriptionModal