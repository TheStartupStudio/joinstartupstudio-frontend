import React, { useState } from 'react'
import { Button, Modal, ModalBody } from 'reactstrap'
import { useDispatch } from 'react-redux'
import warningTriangle from '../../assets/images/academy-icons/warning-triangle.png'
import axiosInstance from '../../utils/AxiosInstance'
import { setGeneralLoading } from '../../redux/general/Actions'
import { userLogout } from '../../redux'
import { toggleCollapse } from '../../redux/sidebar/Actions'

function DeactivateAccountModal({
  deactivateModal,
  setDeactivateModal,
  onBack
}) {
  const dispatch = useDispatch()
  const [submitting, setSubmitting] = useState(false)
  const [deactivated, setDeactivated] = useState(false)
  const [error, setError] = useState('')

  const handleDeactivate = async () => {
    setSubmitting(true)
    setError('')

    try {
      await axiosInstance.post('/course-subscription/deactivate-account')
      setDeactivated(true)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Something went wrong while deactivating your account. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    dispatch(setGeneralLoading(true))
    dispatch(toggleCollapse())

    try {
      await dispatch(userLogout())
    } catch (err) {
      console.error('Error logging out:', err)
    } finally {
      localStorage.clear()
      window.location.href = '/'
    }
  }

  return (
    <Modal
      isOpen={deactivateModal}
      toggle={() => setDeactivateModal((prev) => !prev)}
    >
      <ModalBody>
        <div>
          <img
            className='modal-credit rounded-circle p-2 mb-2'
            src={warningTriangle}
            alt='Warning'
          />
          <p className='mb-0 fs-15 fw-medium'>
            {deactivated ? 'Account Deactivated' : 'Deactivate Account?'}
          </p>
        </div>

        {deactivated ? (
          <>
            <p className='mt-5 text-center fw-medium'>
              Your account has been deactivated and you will now be signed out.
              Thank you for being part of StudioOS.
            </p>
            <div className='d-flex gap-3 justify-content-center mt-5 mb-3 flex-col-500'>
              <button className='sub-modal-save-btn' onClick={handleLogout}>
                LOG OUT
              </button>
            </div>
          </>
        ) : (
          <>
            <p className='mt-5 text-center fw-medium'>
              Your one-time payment gave you permanent access, so there is no
              recurring subscription to cancel.
            </p>
            <p className='text-center fw-medium'>
              If you deactivate your account you will lose all of your progress,
              and your payment is non-refundable. If you want to come back later
              you will need to create a new account and pay again.
            </p>

            {error && (
              <p className='text-center text-danger fw-medium mt-3'>{error}</p>
            )}

            <div className='d-flex gap-3 justify-content-center mt-5 mb-3 flex-col-500'>
              <Button color='info' className='sub-close-btn' onClick={onBack}>
                NO, TAKE ME BACK
              </Button>
              <button
                className='sub-modal-save-btn'
                onClick={handleDeactivate}
                disabled={submitting}
              >
                {submitting ? 'DEACTIVATING...' : 'YES, DEACTIVATE MY ACCOUNT'}
              </button>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  )
}

export default DeactivateAccountModal
