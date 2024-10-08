import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { ConfirmationModal } from './confirmationModal'

export const ContactUserModal = (props) => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  const handleContactForm = (event) => {
    const { name, value } = event.target
    if (name === 'message') {
      setMessage(value)
    }
  }

  const submitMessage = () => {
    if (message.length === 0) {
      return toast.error(<IntlMessages id='alerts.contact_message' />)
    } else if (!props.email) {
      return toast.error(<IntlMessages id='alerts.something_went_wrong' />)
    }

    setLoading(true)
    const params = {
      message: message,
      email: props.email
    }

    axiosInstance
      .post('/users/contact-user', params)
      .then(() => {
        setMessage('')
        setLoading(false)
        props.onHide()
        setShowConfirmationModal(true)
        // toast.success(<IntlMessages id='general.message_success' />)
      })
      .catch((err) => err)
  }

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop='static'
        keyboard={false}
        id='contact-us-modal'
      >
        <Modal.Header className='contact-us-title my-auto general-modal-header p-0 mx-4'>
          <h3 className='mb-0 pt-4 mt-2 '>CONTACT USER</h3>
          <button
            type='button'
            className='btn-close me-1 mt-0 pt-1'
            aria-label='Close'
            onClick={props.onHide}
          />
        </Modal.Header>
        <Modal.Body className='m-4 p-0'>
          <div className='contact-us p-0'>
            <textarea
              className='mb-3'
              style={{
                borderRadius: '0px',
                border: '1px solid #BBBDBF',
                height: '300px'
              }}
              name='message'
              placeholder={'Message...'}
              value={message}
              onChange={handleContactForm}
            />

            <button
              disabled={loading}
              onClick={() => {
                submitMessage()
              }}
            >
              {loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                <IntlMessages id='modal.contact_us_send_message' />
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <ConfirmationModal
        show={showConfirmationModal}
        onHide={() => {
          setShowConfirmationModal(false)
        }}
        message={'Your message has been sent!'}
      />
    </>
  )
}
