import { Button, Modal, ModalBody } from 'reactstrap'
import { useRef } from 'react'
import warningTriangle from '../../assets/images/academy-icons/warning-triangle.png'
import axiosInstance from '../../utils/AxiosInstance'
import { trackCancelSubscription } from '../../utils/FacebookPixel'

function CancelSubModal({
  cancelSubModal,
  setCancelSubModal,
  toggleCancelModal,
  toggleCancelRenewal
}) {
  // ✅ ADD: Prevent duplicate tracking
  const hasTrackedRef = useRef(false)

  const handleCancelSubscription = async () => {
    try {
      const response = await axiosInstance.post(
        '/course-subscription/cancel-subscription'
      )

      if (response.status === 200) {
        // ✅ FIXED: Only track once
        if (!hasTrackedRef.current) {
          trackCancelSubscription({
            reason: 'user_initiated',
            value: 15,
            currency: 'USD',
            duration: response.data.subscriptionDuration || 0,
            userSegment: 'paid_subscriber'
          })
          hasTrackedRef.current = true
        }

        // alert(response.data.message)
        toggleCancelRenewal()
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      alert(
        error.response?.data?.error || 
        'Something went wrong while canceling the subscription. Please try again.'
      )
    }
  }

  return (
    <Modal
      isOpen={cancelSubModal}
      toggle={() => setCancelSubModal((prev) => !prev)}
    >
      <ModalBody>
        <div>
          <img
            className='modal-credit rounded-circle p-2 mb-2'
            src={warningTriangle}
            alt='Credit'
          />
          <p className='mb-0 fs-15 fw-medium'>Cancel Subscription?</p>
        </div>
        <p className='mt-5 text-center fw-medium'>
          Are you sure you want to cancel your subscription?
        </p>

        <div className='d-flex gap-3 justify-content-center mt-5 mb-3 flex-col-500'>
          <Button
            color='info'
            className='sub-close-btn'
            onClick={toggleCancelModal}
          >
            NO, TAKE ME BACK
          </Button>
          <button
            className='sub-modal-save-btn'
            onClick={handleCancelSubscription}
          >
            YES, CANCEL SUBSCRIPTION
          </button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default CancelSubModal
