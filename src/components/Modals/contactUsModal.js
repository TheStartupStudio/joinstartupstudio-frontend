import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { validateEmail } from '../../utils/helpers'

const ContactUsModal = (props) => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleContactForm = (event) => {
    const { name, value } = event.target
    if (name === 'message') {
      setMessage(value)
    } else if (name === 'email') {
      setEmail(value)
    }
  }

  const submitMessage = () => {
    if (!validateEmail(email)) {
      toast.error(<IntlMessages id='alerts.valid_email' />)
    } else if (message.length === 0) {
      toast.error(<IntlMessages id='alerts.contact_message' />)
    } else {
      const params = {
        message: message,
        email: email
      }

      axiosInstance
        .post(process.env.REACT_APP_SERVER_BASE_URL + '/users/contact', params)
        .then(() => {
          setEmail('')
          setMessage('')
          toast.success(<IntlMessages id='general.message_success' />)
          setTimeout(() => {
            props.onHide()
          }, 1000)
        })
        .catch((err) => err)
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='contact-us-modal'
    >
      <Modal.Header className='contact-us-title general-modal-header my-auto p-0 mx-4'>
        <h3 className='mb-0 pt-4 mt-2 '>
          <IntlMessages id='modal.contact_us' />
        </h3>
        <button
          type='button'
          className='btn-close me-1 mt-0 pt-1'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body>
        <div className='contact-us'>
          <FormattedMessage
            id='modal.contact_us_email'
            defaultMessage='modal.contact_us_email'
          >
            {(placeholder) => (
              <input
                className='mb-2'
                type='text'
                name='email'
                placeholder={placeholder}
                value={email}
                onChange={handleContactForm}
              />
            )}
          </FormattedMessage>
          <FormattedMessage
            id='modal.contact_us_message'
            defaultMessage='modal.contact_us_message'
          >
            {(placeholder) => (
              <textarea
                className='mb-3'
                name='message'
                placeholder={placeholder}
                value={message}
                onChange={handleContactForm}
              />
            )}
          </FormattedMessage>

          <button onClick={submitMessage}>
            <IntlMessages id='modal.contact_us_send_message' />
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default ContactUsModal
