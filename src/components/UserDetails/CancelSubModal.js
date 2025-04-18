import { Button, Modal, ModalBody } from 'reactstrap'
import warningTriangle from '../../assets/images/academy-icons/warning-triangle.png'
import axiosInstance from '../../utils/AxiosInstance'

function CancelSubModal({
  cancelSubModal,
  setCancelSubModal,
  toggleCancelModal,
  toggleCancelRenewal
}) {
  const handleCancelSubscription = async () => {
    try {
      const response = await axiosInstance.post(
        '/course-subscription/cancel-subscription',
        {}
      )

      if (response.status === 200) {
        toggleCancelRenewal()
      }
    } catch (error) {
      console.error('Error canceling subscription:', error)
      alert(
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
