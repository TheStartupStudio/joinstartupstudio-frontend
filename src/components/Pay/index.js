import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'

import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'react-toastify'
import { userLogin } from '../../redux'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'

const CheckoutForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [cardholderName, setCardholderName] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [validateMessageCardholderName, setValidateMessageCardholderName] =
    useState('')
  const [buttonLoading, setButtonLoading] = useState(false)
  const dispatch = useDispatch()
  const currentLanguage =
    localStorage.getItem('currentLanguage') !== undefined &&
    localStorage.getItem('currentLanguage') !== ''
      ? localStorage.getItem('currentLanguage')
      : 'en'

  const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
      base: {
        border: '1px solid #BBBDBF',
        iconColor: '#C4F0FF',
        color: '#BBBDBF',
        fontWeight: 300,
        fontFamily: 'Montserrat, sans-serif',
        fontSize: '12px',
        lineHeight: '22px',
        fontSmoothing: 'antialiased',
        ':-webkit-autofill': {
          color: '#BBBDBF'
        },
        '::placeholder': {
          color: '#BBBDBF'
        }
      },
      invalid: {
        iconColor: '#BBBDBF',
        color: '#BBBDBF'
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!cardholderName) {
      setValidateMessageCardholderName('alerts.card_holder_name_required')
    } else {
      setButtonLoading(true)
      await stripe
        .createToken(elements.getElement(CardElement))
        .then(async (res) => {
          if (res && res.token && res.token.id) {
            const result = await stripe.createPaymentMethod({
              type: 'card',
              card: elements.getElement(CardElement),
              billing_details: {
                email: localStorage.getItem('email')
              }
            })

            if (result.error) {
              setButtonLoading(false)
              toast.error(<IntlMessages id='alerts.something_went_wrong' />)
            } else {
              await axiosInstance
                .post(
                  '/users/sub',
                  {
                    payment_method: result.paymentMethod.id,
                    email: localStorage.getItem('email'),
                    coupon_code: couponCode
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem(
                        'access_token'
                      )}`
                    }
                  }
                )
                .then((res) => {
                  const { client_secret, status } = res.data
                  if (status === 'requires_action') {
                    stripe.confirmCardPayment(client_secret).then((result) => {
                      if (result.error) {
                        setButtonLoading(false)
                        toast.error(
                          <IntlMessages id='alerts.something_went_wrong' />
                        )
                      } else {
                        toast.success(<IntlMessages id='alerts.subscribed' />)
                        setButtonLoading(false)

                        setTimeout(() => {
                          dispatch(userLogin())
                        }, 5000)
                      }
                    })
                  } else if (
                    status === 'succeeded' ||
                    status == 'PAID-COUPON'
                  ) {
                    toast.success(<IntlMessages id='alerts.subscribed' />)
                    setButtonLoading(false)

                    setTimeout(() => {
                      dispatch(userLogin())
                    }, 5000)
                  } else {
                    setButtonLoading(false)
                    toast.error(
                      <IntlMessages id='alerts.something_went_wrong' />
                    )
                  }
                })
                .catch((e) => {
                  setButtonLoading(false)
                  if (e.response.data === 'coupon')
                    toast.error(<IntlMessages id='alerts.no_such_coupon' />)
                  else
                    toast.error(
                      <IntlMessages id='alerts.something_went_wrong' />
                    )
                })
            }
          } else {
            if (res.error.code === 'incomplete_number') {
              toast.error(<IntlMessages id='alerts.incomplete_number' />)
            } else if (res.error.code === 'incomplete_cvc') {
              toast.error(<IntlMessages id='alerts.incomplete_cvc' />)
            } else if (res.error.code === 'invalid_number') {
              toast.error(<IntlMessages id='alerts.invalid_number' />)
            } else if (res.error.code === 'incomplete_expiry') {
              toast.error(<IntlMessages id='alerts.incomplete_expiry' />)
            } else toast.error(<IntlMessages id='alerts.invalid_credit_card' />)
            setButtonLoading(false)
          }
        })
    }
  }

  return (
    <div className='register-form payment-alignment'>
      <form className='col-lg-7' onSubmit={handleSubmit}>
        <div className='cardholder'>
          <CardElement options={CARD_OPTIONS} />
        </div>
        <FormattedMessage
          id='register.cardholder_name'
          defaultMessage='register.cardholder_name'
        >
          {(placeholder) => (
            <input
              className='mt-3'
              type='text'
              name='cardholderName'
              placeholder={placeholder}
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
          )}
        </FormattedMessage>
        {validateMessageCardholderName !== '' && (
          <span className='validate-message my-1 text-start'>
            <IntlMessages id={`${validateMessageCardholderName}`} />
          </span>
        )}
        <FormattedMessage
          id='register.coupon_code'
          defaultMessage='register.coupon_code'
        >
          {(placeholder) => (
            <input
              className='mt-3'
              type='text'
              name='coupon'
              placeholder={placeholder}
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value)}
            />
          )}
        </FormattedMessage>
        <button className='mt-3' disabled={buttonLoading}>
          {buttonLoading ? (
            <span className='spinner-border spinner-border-sm' />
          ) : (
            <IntlMessages id='register.subscribe_now' />
          )}
        </button>
      </form>
    </div>
  )
}
const Pay = () => {
  const currentLanguage = useSelector((state) => state.lang.locale)
  const stripePromise = loadStripe(
    'pk_live_JnvIkZtjpceE5fSdedKFtdJN00rAR0j6Z4',
    {
      locale: currentLanguage
    }
  )
  return (
    <div>
      <Elements
        fonts={[
          {
            src: 'url(https://fonts.googleapis.com/css?family=Montserrat:300,300i,400,500,600)',
            family: 'Montserrat'
          }
        ]}
        stripe={stripePromise}
      >
        <CheckoutForm />
      </Elements>
    </div>
  )
}
export default Pay
