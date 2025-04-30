import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import axiosInstance from '../../utils/AxiosInstance'
import { setCustomerId, setStripe } from '../../redux/user/Actions'
import { toast } from 'react-toastify'

function Payment() {
  const dispatch = useDispatch()
  const history = useHistory()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/users')
        const user = response.data

        if (user?.customerId) {
          dispatch(setCustomerId(user?.customerId))
        }

        if (user?.stripe_subscription_id) {
          dispatch(setStripe(user.stripe_subscription_id))
          toast.success('✅ Subscription successful:')

          setTimeout(() => {
            history.push('/dashboard')
          }, 2000)
        } else {
          toast.error('⚠️ No subscription ID found for user.')
          setLoading(false)
          history.push('/subscribe')
        }
      } catch (error) {
        toast.error('❌ Error fetching user')
        setLoading(false)
      }
    }

    fetchUser()
  }, [dispatch, history.push])

  if (loading) {
    return (
      <div className='d-flex justify-content-center align-items-center vh-100'>
        <h3 className='text-black'>Processing your payment...</h3>
      </div>
    )
  }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
      <h3 className='text-black'>
        Could not confirm payment. Please try again.
      </h3>
    </div>
  )
}

export default Payment
