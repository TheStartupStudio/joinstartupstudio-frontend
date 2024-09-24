import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { LtsButton } from '../../../../ui/ContentItems'
import { useState } from 'react'

const CheckoutForm = ({ onContinue, cancelHandler }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    if (!stripe || !elements) {
      return
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/successful-signup'
      },
      redirect: 'if_required'
    })

    console.log('result', result)

    if (result.error) {
      console.log(result.error.message)
      setLoading(false)
    } else {
      toast.success('Payment is done successfully!')

      // onContinue()
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Row className='py-3 justify-content-between'>
        <LtsButton
          className={'mx-3'}
          onClick={cancelHandler}
          text={'Cancel'}
          background={'transparent'}
          color={'#707070'}
          border={'1px solid #707070'}
        />
        <LtsButton
          disabled={loading}
          text={
            loading ? (
              <span className='spinner-border spinner-border-sm' />
            ) : (
              'SUBMIT APPLICATION'
            )
          }
          background={'#52C7DE'}
          color={'#fff'}
          border={'none'}
          type='submit'
        />
      </Row>
    </form>
  )
}

export default CheckoutForm
