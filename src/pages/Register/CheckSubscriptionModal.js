import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import AcademyBtn from '../../components/AcademyBtn'
import courseLogo from '../../assets/images/academy-icons/svg/AIE Logo 3x.png'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'

const CheckSubscriptionModal = ({ show, onHide, registrationData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const history = useHistory()

  const planDetails = {
    monthly: {
      price: '9.99',
      total: '9.99',
      period: 'month',
      priceId: process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID || 'price_1RbgyFRsRTWEGaApy1Fql4H8',
      commitment: '12 months'
    },
    annual: {
      price: '99.00',
      total: '99.00',
      period: 'year',
      priceId: process.env.REACT_APP_STRIPE_ANNUAL_PRICE_ID || 'price_1RbgyFRsRTWEGaApHmVwRUj3',
      commitment: 'year'
    }
  }

const handleSubscription = async () => {
  if (!registrationData || !registrationData.paymentMethodId) {
    toast.error('Registration data not found. Please try again.')
    onHide()
    return
  }

  setIsLoading(true)

  try {
    const response = await axiosInstance.post('/auth/register-with-subscription', {
      ...registrationData,
      selectedPlan: selectedPlan,
      priceId: planDetails[selectedPlan].priceId
    })

    if (response.data.success) {
      sessionStorage.removeItem('registrationData')
      
      if (response.data.tokens) {
        localStorage.setItem('accessToken', response.data.tokens.accessToken)
        localStorage.setItem('refreshToken', response.data.tokens.refreshToken)
      }
      
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
          className="check-subscription-transparent-modal" // Add this class
      >
      
      <Modal.Body>
              <div className='d-flex justify-content-center p-5'>
                <div className='d-flex align-items-center flex-column payment-main bck-gradient position-relative'>

                  <div className="subscription-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M1.44661 14.4459L7.99991 7.89258M14.5532 1.33928L7.99991 7.89258M7.99991 7.89258L1.44661 1.33928M7.99991 7.89258L14.5532 14.4459" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
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
                      <p className='commitment'>Get 1 month free when you pay for the entire year! </p>
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
                      <p className='text-black mb-0 fw-bold'>Total Amount Due Today</p>
                      <span className="text-black fw-bold">$0</span>
                    </div>
                  </div>
        
                  <AcademyBtn
                    disabled={isLoading}
                    title={`${isLoading ? 'Processing...' : 'Subscribe Now'}`}
                    onClick={handleSubscription}
                  />
        
                  <p className='text-black fs-13 mt-4 text-center'>
                    Secure payments powered by Stripe. You can cancel your subscription at any time. 
                    Review our Terms of Use for more details.
                  </p>
        
                </div>
              </div>
      </Modal.Body>
    </Modal>
  )
}

export default CheckSubscriptionModal