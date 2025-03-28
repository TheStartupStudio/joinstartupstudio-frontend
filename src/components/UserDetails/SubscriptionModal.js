import React from 'react'
import { Button, Modal, ModalBody } from 'reactstrap'
import cancelRenewal from '../../assets/images/academy-icons/cancel-renewal.png'
import creditCard from '../../assets/images/academy-icons/credit-card.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import ModalInput from '../ModalInput/ModalInput'

function SubscriptionModal({
  subsbsciptionModal,
  setSubscriptionModal,
  toggleCancelModal
}) {
  return (
    <Modal
      isOpen={subsbsciptionModal}
      toggle={() => setSubscriptionModal((prev) => !prev)}
      size='sm'
      style={{ maxWidth: '600px', width: '100%' }}
    >
      <ModalBody>
        <img
          className='modal-credit rounded-circle p-2 mb-2'
          src={creditCard}
          alt='Credit'
        />
        <p className='mb-0 fs-15 fw-medium'>Manage Subscription & Billing</p>

        <form>
          <div className='mt-5'>
            <h4 className='fs-15'>Card Information</h4>
            <div className='d-flex flex-column gap-3'>
              <ModalInput
                id={'creditCardName'}
                labelTitle={'Name on Credit Card'}
                imgSrc={penIcon}
              />
              <ModalInput
                id={'cardNumber'}
                labelTitle={'Card Number'}
                imgSrc={penIcon}
              />
              <div
                className='d-grid gap-2'
                style={{ gridTemplateColumns: '2fr 1fr 2fr' }}
              >
                <ModalInput
                  id={'expiration'}
                  labelTitle={'Expiration (MM/YY)'}
                  imgSrc={penIcon}
                />
                <ModalInput id={'CVC'} labelTitle={'CVC'} imgSrc={penIcon} />
                <ModalInput
                  id={'zipCode'}
                  labelTitle={'Zip Code'}
                  imgSrc={penIcon}
                />
              </div>
            </div>
          </div>
          <div className='mt-5'>
            <h4 className='fs-15'>Billing Adress</h4>
            <div className='d-flex flex-column gap-3'>
              <ModalInput
                id={'address'}
                labelTitle={'Address'}
                imgSrc={penIcon}
              />
              <div
                className='d-grid gap-2'
                style={{ gridTemplateColumns: '2fr 1fr 2fr' }}
              >
                <ModalInput id={'city'} labelTitle={'City'} imgSrc={penIcon} />
                <ModalInput
                  id={'state'}
                  labelTitle={'State'}
                  imgSrc={penIcon}
                />
                <ModalInput
                  id={'zipCode2'}
                  labelTitle={'Zip Code'}
                  imgSrc={penIcon}
                />
              </div>
            </div>
          </div>
          <div className='d-flex gap-3 justify-content-center mt-5'>
            <Button
              className='close-btn'
              onClick={() => setSubscriptionModal((prev) => !prev)}
            >
              CANCEL
            </Button>
            <button className='modal-save-btn'>SAVE</button>
          </div>
        </form>
        <div
          className='d-flex align-items-center justify-content-center gap-2 cursor-pointer mt-5'
          onClick={toggleCancelModal}
        >
          <img src={cancelRenewal} alt='credit-card' />
          <p className='mb-0 fs-15 fw-medium'>Cancel Subscription</p>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default SubscriptionModal
