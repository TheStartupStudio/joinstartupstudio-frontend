import React from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../utils/IntlMessages'

const CancelSubscriptionModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='subscription-modal'
    >
      {props.canceledSubscription ? (
        <Modal.Body style={{ padding: '15%' }}>
          <div className='cancel-subscription' style={{ textAlign: 'left' }}>
            <IntlMessages id='profile.unsubscribed' />
          </div>
          <div className='unsubscribed-text mt-4'>
            <IntlMessages id='profile.unsubscribed_text' />
          </div>
        </Modal.Body>
      ) : (
        <Modal.Body>
          <div className='cancel-subscription mt-5'>
            <IntlMessages id='profile.are_you_canceling_subscription' />
          </div>
          <div className='cancel-subscription-text mt-3'>
            <IntlMessages id='profile.cancel_subscription_text' />
          </div>
          <div className='mt-4 text-center'>
            <button
              className='cancel-subscription-button'
              style={{ backgroundColor: '#01C5D1' }}
              onClick={props.onHide}
            >
              <IntlMessages id='profile.keep_me_subscribed' />
            </button>
          </div>
          <div className='mt-2 mb-5 text-center'>
            <button
              className='cancel-subscription-button'
              style={{ backgroundColor: '#F2359D' }}
              onClick={props.cancelSubscription}
            >
              <IntlMessages id='profile.cancel_my_subscription' />
            </button>
          </div>
        </Modal.Body>
      )}
    </Modal>
  )
}
export default CancelSubscriptionModal
