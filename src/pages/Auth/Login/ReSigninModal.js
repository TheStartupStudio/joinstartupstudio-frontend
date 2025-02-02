import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Modal } from 'react-bootstrap'
import { LtsButton } from '../../../ui/ContentItems'
import { setGeneralLoading } from '../../../redux/general/Actions'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userLogout } from '../../../redux'
import { setAuthModal } from '../../../redux/user/Actions'

const ReSigninModal = ({ show }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const handleAuthModalClose = async () => {
    dispatch(setGeneralLoading(true))
    await dispatch(userLogout())
      .then(() => {
        history.push('/')
        localStorage.clear()
        dispatch(setAuthModal(false))
      })
      .catch((error) => {
        console.log('error', error)
        dispatch(setGeneralLoading(false))
      })
      .finally(() => {
        window.location.href = '/'
        dispatch(setGeneralLoading(false))
      })
  }
  return (
    <Modal
      show={show}
      className={`resignin-modal ${show ? 'd-flex' : ''} `}
      onHide={handleAuthModalClose}
      size='SM'
      centered
    >
      <Modal.Header className='position-relative p-3 d-flex justify-content-center'>
        <Modal.Title
          className=' px-3 py-3 fw-normal d-flex flex-column justify-content-center'
          style={{ fontSize: '16px' }}
        >
          <div className='d-flex align-items-center justify-content-center'>
            <div
              className='d-flex align-items-center justify-content-center mb-3 bg-warning'
              style={{
                width: '36px',
                height: '36px',
                fontSize: '15px',
                borderRadius: '50%'
              }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
          </div>
          <h6 className='text-warning'>Session Expired</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex flex-column justify-content-center'>
        <p className='text-center'>You need to log in again to continue.</p>
        <LtsButton
          text={'Go to Login'}
          background={'#52C7DE'}
          color={'#fff'}
          border={'none'}
          onClick={handleAuthModalClose}
        />
      </Modal.Body>
    </Modal>
  )
}

export default ReSigninModal
