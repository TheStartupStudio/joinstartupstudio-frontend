import { loadStripe } from '@stripe/stripe-js'
import axiosInstance from '../../utils/AxiosInstance'
import { useSelector } from 'react-redux'

const stripePromise = loadStripe(
  'pk_test_51R9mFsEAyLMjrgXG6pzfEQNhfYmglxIAcYKkcdAu3CAdv0fZ0AOfxeHeLZWsY1f4hR2GCf43CkqUAOUuLdRHi66p00WaeNlDaf'
)

function CheckSubscription() {
  const user = useSelector((state) => state.user.user.user)
  const handleClick = async () => {
    try {
      const response = await axiosInstance.post(
        '/course-subscription/create-checkout-session'
      )
      console.log('ridon15', user)

      const { sessionId } = response.data
      const stripe = await stripePromise
      stripe.redirectToCheckout({ sessionId })
    } catch (err) {
      console.error('Checkout error:', err)
    }
  }

  return (
    <>
      <button onClick={handleClick}>Subscribe Now</button>
    </>
  )
}

export default CheckSubscription
