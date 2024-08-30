import React, { useEffect, useState } from 'react'
import LoadingAnimation from '../../../../ui/loadingAnimation'
import { Col, Row } from 'react-bootstrap'
import DefaultImage from '../../../../assets/images/default-university-logo.jpg'
import { loadStripe } from '@stripe/stripe-js'
import axiosInstance from '../../../../utils/AxiosInstance'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from './CheckoutForm'

const PaymentForm = ({ onContinue, cancelHandler, signupData }) => {
  console.log('signupData payment form', signupData)
  const [loading, setLoading] = useState(false)
  const [stripePromise, setStripePromise] = useState(null)
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    setLoading(true)
    axiosInstance.get('/webhook/config').then(({ data }) => {
      setStripePromise(loadStripe(data.publishableKey))
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .post('/webhook/create-payment-intent', {
        amount: 37500,
        currency: 'usd',
        user_id: 1509,
        email: signupData.email,
        name: signupData.firstname + ' ' + signupData.lastname,
        address: signupData.address
      })
      .then(({ data }) => {
        console.log('data', data)
        setClientSecret(data.clientSecret)
        setLoading(false)
      })
  }, [
    signupData.email,
    signupData.firstname,
    signupData.lastname,
    signupData.address
  ])

  return (
    <section>
      {loading ? (
        <LoadingAnimation show={true} />
      ) : (
        <>
          <Col className='justify-content-center align-items-center'>
            <div className='header__details'>
              <img src={DefaultImage} alt='Profile' />
              <p className='p-0 m-0'>
                Apply for Learn to Start Virtual Academy
              </p>
            </div>
            <hr />
          </Col>

          <Row>
            <Col md='8'>
              {clientSecret && stripePromise && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    onContinue={onContinue}
                    cancelHandler={cancelHandler}
                  />
                </Elements>
              )}
            </Col>
            <Col
              md='4'
              className='customUI-item d-flex justify-content-center text-center'
            >
              <Col md='6' className='text-center' style={{ fontSize: '14px' }}>
                <h5>TOTAL</h5>
                <div
                  className='d-flex text-center justify-content-center'
                  style={{ fontWeight: '300' }}
                >
                  <span className='px-2'>One semester </span>
                  <span>$375</span>
                </div>
                <div
                  className='d-flex justify-content-center'
                  style={{ fontWeight: '300' }}
                >
                  <span className='px-2'>Discount </span>
                  <span>$-</span>
                </div>
                <hr className='mb-1 ' />
                <div
                  className='d-flex mb-2 fw-bold justify-content-center'
                  style={{ letterSpacing: ' 0.56px' }}
                >
                  <span className='px-2'>Today's charge* </span>
                  <span>$375</span>
                </div>
                <small
                  style={{ font: 'italic normal 300 10px/13px Montserrat' }}
                >
                  *Your card will be charged $375 prior to the start of each new
                  semester unless you cancel.
                </small>
              </Col>
            </Col>
          </Row>
        </>
      )}
    </section>
  )
}

export default PaymentForm
