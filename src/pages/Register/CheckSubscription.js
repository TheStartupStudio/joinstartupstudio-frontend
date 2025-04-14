import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'
import courseLogo from '../../assets/images/academy-icons/svg/Startup-Studio-Logo.svg'
import AcademyBtn from '../../components/AcademyBtn'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'

const stripePromise = loadStripe(
  'pk_test_51R9mFsEAyLMjrgXG6pzfEQNhfYmglxIAcYKkcdAu3CAdv0fZ0AOfxeHeLZWsY1f4hR2GCf43CkqUAOUuLdRHi66p00WaeNlDaf'
)

function CheckSubscription() {
  const [isLoading, setIsLoading] = useState(false)
  const handleClick = async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.post(
        '/course-subscription/create-checkout-session'
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

  return (
    <>
      <div className='d-flex justify-content-center p-5'>
        <div className='d-flex align-items-center flex-column payment-main'>
          <img
            src={courseLogo}
            alt='course-logo'
            className='course-logo-image'
          />
          <h2 className='text-uppercase fs-24 fw-bold mt-5 text-black'>
            Complete Your Subscription
          </h2>
          <p className='fs-15 text-black text-center'>
            Get full access to{' '}
            <strong>
              The Startup Studio Online Course in Entrepreneurship
            </strong>
            .
          </p>

          <h3 className='fs-21 fw-medium mb-1 mt-3 text-black'>
            $15.00 / Month – Cancel anytime (48 hours notice required)
          </h3>

          <div className='align-self-start mt-5 mb-5 payment-section mx-auto'>
            <h3 className='fs-21 fw-medium text-black'>
              One Month Subscription to Learn to Start LLC
            </h3>
            <div
              className='d-flex justify-content-between payment-border'
              style={{ gap: '8.5rem' }}
            >
              <p className='fs-15 text-black'>
                Full access to Course in Entrepreneurship
              </p>
              <span>$15.00</span>
            </div>
            <div
              className='d-flex justify-content-between gap-5 mt-3'
              style={{ gap: '8.5rem' }}
            >
              <p className='fs-15 text-black mb-0'>Total Amount</p>
              <span>$15.00</span>
            </div>
          </div>

          <AcademyBtn
            disabled={isLoading}
            title={`${isLoading ? '...' : 'Subscribe Now'}`}
            onClick={handleClick}
          />

          <p className='text-black fs-13 mt-4 text-center'>
            Secure payment powered by Stripe. You can cancel your subscription
            at any time with at least 48 hours' notice before the next billing
            cycle.
          </p>

          <div>
            <p className='text-center text-black text-uppercase fs-13 fw-medium mb-0 mt-5'>
              The Startup Studio
            </p>
            <p className='fs-13 fw-medium text-black'>
              https://mystartupcourse.com
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckSubscription
