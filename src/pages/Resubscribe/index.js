import React from 'react'
import IntlMessages from '../../utils/IntlMessages'
import RegisterBottomGraphic from '../../assets/images/register-graphic.png'
import PaymentForm from '../../components/Pay'

function Resubscribe() {
  return (
    <div
      className='container-fluid secure-page-padding'
      style={{ backgroundColor: '#F8F7F7', minHeight: ' calc(100vh - 90px)' }}
    >
      <div className='row mx-0 subscription-ended'>
        <div className='col-12 col-lg-5'>
          <h6 className='mb-4'>
            {window.location.href.includes('trial') ? (
              <IntlMessages id='subscription.trial_ended' />
            ) : (
              <IntlMessages id='subscription.subscription_ended' />
            )}
          </h6>
          <p style={{ fontWeight: 600 }}>
            {window.location.href.includes('trial') ? (
              <IntlMessages id='subscription.subscribe' />
            ) : (
              <IntlMessages id='subscription.resubscribe' />
            )}
          </p>
          <p>
            <IntlMessages id='subscription.charge' />
          </p>
          <img src={RegisterBottomGraphic} className='mt-3' width='85%' />
        </div>
        <div className='col-12 col-lg-7 text-center'>
          <div className='text-center monthly-payment'>
            <h3 className='pb-4'>
              <IntlMessages id='register.monthly_payment' />
            </h3>
            <PaymentForm style={{ width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Resubscribe
