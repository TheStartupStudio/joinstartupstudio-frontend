import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalBody } from 'reactstrap'
import cancelRenewal from '../../assets/images/academy-icons/cancel-renewal.png'
import creditCard from '../../assets/images/academy-icons/credit-card.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import ModalInput from '../ModalInput/ModalInput'
import axiosInstance from '../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import DeactivateAccountModal from './DeactivateAccountModal'

function SubscriptionModal({
  subsbsciptionModal,
  setSubscriptionModal,
  toggleCancelModal
}) {
  const [payments, setPayments] = useState([])
  const [billingInfo, setBillingInfo] = useState(null)
  const [planSummary, setPlanSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deactivateModal, setDeactivateModal] = useState(false)

  const userState = useSelector((state) => state.user?.user) || {}
  const user = userState?.user || {}

  const isOneTime =
    planSummary?.isOneTime ??
    (Boolean(user?.lifetime_access) ||
      (user?.subscription_status === 'active' &&
        !user?.stripe_subscription_id))

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const paymentsResponse = await axiosInstance.get(
          '/course-subscription/my-payments'
        )
        setPayments(paymentsResponse.data?.payments || [])
        setPlanSummary(paymentsResponse.data)

        const oneTime =
          paymentsResponse.data?.isOneTime ||
          paymentsResponse.data?.lifetimeAccess
        const customerId =
          paymentsResponse.data?.customerId || user?.customer_id

        if (customerId && !oneTime) {
          const billingResponse = await axiosInstance.get(
            `/course-subscription/manage-billing/${customerId}`
          )
          setBillingInfo(billingResponse.data)
        } else {
          setBillingInfo(null)
        }
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

  const openDeactivateModal = () => {
    setSubscriptionModal(false)
    setDeactivateModal(true)
  }

  const backToSubscriptionModal = () => {
    setDeactivateModal(false)
    setSubscriptionModal(true)
  }

  return (
    <>
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
            {isOneTime && (
              <div className='mt-4'>
                <h4 className='fs-15'>Your Plan</h4>
                <p className='mb-0 fs-15'>
                  {loading
                    ? 'Loading...'
                    : planSummary?.planLabel ||
                      'One-Time Payment (Lifetime Access)'}
                </p>
                {!loading && (
                  <p className='mb-0 fs-13 text-muted'>
                    You paid once for permanent access — there is nothing to
                    renew or cancel.
                  </p>
                )}
              </div>
            )}

            {!isOneTime && (
              <>
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
              </>
            )}

            <div className={isOneTime ? 'mt-4' : 'mt-5'}>
              <h4 className='fs-15'>Payment History</h4>
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
                  {loading ? (
                    <tr>
                      <td colSpan='4' className='text-center'>
                        Loading...
                      </td>
                    </tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan='4' className='text-center'>
                        There is no payment history
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>
                          {payment.date
                            ? new Date(payment.date).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                }
                              )
                            : 'N/A'}
                        </td>
                        <td>
                          $ {Number(payment.amount || 0).toFixed(2)}{' '}
                          {payment.currency || 'USD'}
                        </td>
                        <td className='text-capitalize'>{payment.status}</td>
                        <td>
                          {payment.url ? (
                            <a
                              href={payment.url}
                              target='_blank'
                              rel='noreferrer'
                            >
                              View
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

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
            onClick={isOneTime ? openDeactivateModal : toggleCancelModal}
          >
            <img src={cancelRenewal} alt='cancel-renewal' />
            <p className='mb-0 fs-15 fw-medium'>
              {isOneTime ? 'Deactivate Account' : 'Cancel Subscription'}
            </p>
          </div>
        </ModalBody>
      </Modal>

      <DeactivateAccountModal
        deactivateModal={deactivateModal}
        setDeactivateModal={setDeactivateModal}
        onBack={backToSubscriptionModal}
      />
    </>
  )
}

export default SubscriptionModal
