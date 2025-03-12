import { Button, Modal, ModalBody } from 'reactstrap'
import warningTriangle from '../../assets/images/academy-icons/warning-triangle.png'

function CancelSubModal({
  cancelSubModal,
  setCancelSubModal,
  toggleCancelModal,
  toggleCancelRenewal
}) {
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

        <div className='d-flex gap-3 justify-content-center mt-5 mb-3'>
          <Button
            color='info'
            className='sub-close-btn'
            onClick={toggleCancelModal}
          >
            NO, TAKE ME BACK
          </Button>
          <button className='sub-modal-save-btn' onClick={toggleCancelRenewal}>
            YES, CANCEL SUBSCRIPTION
          </button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default CancelSubModal
