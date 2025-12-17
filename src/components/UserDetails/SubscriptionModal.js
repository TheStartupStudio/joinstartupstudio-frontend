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
  const [billingInfo, setBillingInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  const userState = useSelector((state) => state.user?.user) || {}
  const user = userState?.user || {}

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.customer_id) return

        // Fetch invoices
        const invoicesResponse = await axiosInstance.get(
          `/course-subscription/invoices/${user.customer_id}`
        )
        setInvoices(invoicesResponse.data)

        // Fetch billing info (card and address)
        const billingResponse = await axiosInstance.get(
          `/course-subscription/manage-billing/${user.customer_id}`
        )
        setBillingInfo(billingResponse.data)

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (subsbsciptionModal) {
      fetchData()
    }
  }, [user?.customer_id, subsbsciptionModal])

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
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className='d-flex flex-column gap-3'>
                <ModalInput
                  id={'creditCardName'}
                  labelTitle={'Name on Credit Card'}
                  imgSrc={penIcon}
                  value={billingInfo?.paymentMethod?.nameOnCard || ''}
                  readOnly={true}
                />
                <ModalInput
                  id={'cardNumber'}
                  labelTitle={'Card Number'}
                  imgSrc={penIcon}
                  value={billingInfo?.paymentMethod?.cardNumber || ''}
                  readOnly={true}
                />
                <div
                  className='d-grid gap-2'
                  style={{ gridTemplateColumns: '2fr 1fr 2fr' }}
                >
                  <ModalInput
                    id={'expiration'}
                    labelTitle={'Expiration (MM/YY)'}
                    imgSrc={penIcon}
                    value={billingInfo?.paymentMethod?.expiration || ''}
                    readOnly={true}
                  />
                  <ModalInput 
                    id={'CVC'} 
                    labelTitle={'CVC'} 
                    imgSrc={penIcon}
                    value={'•••'}
                    readOnly={true}
                  />
                  <ModalInput
                    id={'zipCode'}
                    labelTitle={'Zip Code'}
                    imgSrc={penIcon}
                    value={billingInfo?.billingAddress?.postalCode || ''}
                    readOnly={true}
                  />
                </div>
              </div>
            )}
          </div>

          <div className='mt-5'>
            <h4 className='fs-15'>Billing Address</h4>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className='d-flex flex-column gap-3'>
                <ModalInput
                  id={'address'}
                  labelTitle={'Address'}
                  imgSrc={penIcon}
                  value={billingInfo?.billingAddress?.line1 || ''}
                  readOnly={true}
                />
                <div
                  className='d-grid gap-2'
                  style={{ gridTemplateColumns: '2fr 1fr 2fr' }}
                >
                  <ModalInput 
                    id={'city'} 
                    labelTitle={'City'} 
                    imgSrc={penIcon}
                    value={billingInfo?.billingAddress?.city || ''}
                    readOnly={true}
                  />
                  <ModalInput
                    id={'state'}
                    labelTitle={'State'}
                    imgSrc={penIcon}
                    value={billingInfo?.billingAddress?.state || ''}
                    readOnly={true}
                  />
                  <ModalInput
                    id={'zipCode2'}
                    labelTitle={'Zip Code'}
                    imgSrc={penIcon}
                    value={billingInfo?.billingAddress?.postalCode || ''}
                    readOnly={true}
                  />
                </div>
              </div>
            )}
          </div>

          <table className='table table-bordered table-striped mt-3 sub-table'>
            <thead className='table-light'>
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
                    <a href={data.hosted_invoice_url} target='_blank' rel='noreferrer'>
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className='d-flex gap-3 justify-content-center mt-5'>
            <Button
              className='close-btn'
              onClick={() => setSubscriptionModal((prev) => !prev)}
            >
              CLOSE
            </Button>

             <Button
              className='modal-save-btn'
              onClick={() => setSubscriptionModal((prev) => !prev)}
            >
              Save
            </Button>
          </div>
        </form>

        <div
          className='d-flex align-items-center justify-content-center gap-2 cursor-pointer mt-5'
          onClick={toggleCancelModal}
        >
          <img src={cancelRenewal} alt='cancel-renewal' />
          <p className='mb-0 fs-15 fw-medium'>Cancel Subscription</p>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default SubscriptionModal