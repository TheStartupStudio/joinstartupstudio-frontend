import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Modal, ModalBody } from 'reactstrap'
import { setGeneralLoading } from '../../redux/general/Actions'
import cancelRenewal from '../../assets/images/academy-icons/cancel-renewal.png'
import { userLogout } from '../../redux'

function CancelRenewalModal({ canceledRenewal, setCanceledRenewal }) {
  const dispatch = useDispatch()

  const handleLogout = async () => {
    dispatch(setGeneralLoading(true))
    await dispatch(userLogout())
      .then(() => {
        localStorage.clear()
        // history.push('/')
        window.location.href = '/'
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => {
        window.location.href = '/'
        dispatch(setGeneralLoading(false))
      })
  }

  return (
    <Modal
      isOpen={canceledRenewal}
      toggle={() => setCanceledRenewal((prev) => !prev)}
    >
      <ModalBody>
        <div>
          <img
            className='modal-credit rounded-circle p-2 mb-2'
            src={cancelRenewal}
            alt='Credit'
          />
          <p className='mb-0 fs-15 fw-medium'>Subscription Cancelled</p>
        </div>
        <p className='mt-5 text-center fw-medium'>
          Your subscription has been canceled and you will no longer be billed.
          You will have access to the platform until the end of your billing
          period.
        </p>
        <div className='d-flex gap-3 justify-content-center mt-5 mb-3'>
          <button
            className='sub-modal-save-btn'
            style={{ backgroundColor: '#DEE1E6', color: 'black' }}
            onClick={handleLogout}
          >
            LOG OUT
          </button>
          <Button
            color='info'
            className='sub-close-btn'
            onClick={() => setCanceledRenewal((prev) => !prev)}
          >
            RETURN TO DASHBOARD
          </Button>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default CancelRenewalModal
