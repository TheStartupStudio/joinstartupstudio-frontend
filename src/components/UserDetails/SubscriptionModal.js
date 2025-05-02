import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalBody } from 'reactstrap'
import cancelRenewal from '../../assets/images/academy-icons/cancel-renewal.png'
import creditCard from '../../assets/images/academy-icons/credit-card.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import ModalInput from '../ModalInput/ModalInput'
import axiosInstance from '../../utils/AxiosInstance'
import { useSelector } from 'react-redux'

function SubscriptionModal({
  subsbsciptionModal,
  setSubscriptionModal,
  toggleCancelModal
}) {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  const user = useSelector((state) => state.user.user.user)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get(
          `/course-subscription/invoices/${user?.customerId}`
        )
        setInvoices(response.data)
      } catch (error) {
        console.error('Error fetching invoices:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.customerId) fetchInvoices()
  }, [user?.customerId])

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

        {/* <form>
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
        </form> */}
        <div className='table-responsive'>
          <table className='table table-bordered table-striped mt-3 sub-table'>
            <thead className='table-dark'>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {invoices?.map((data) => (
                <tr key={data.id}>
                  <td>
                    {new Date(data.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td>$ {data.amount}</td>
                  <td className='text-capitalize'>{data.status}</td>
                  <td>
                    <a href={data.hosted_invoice_url} target='_blank'>
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
