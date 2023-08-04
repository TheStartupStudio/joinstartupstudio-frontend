import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import { validateEmail } from '../../utils/helpers'
import { useSelector } from 'react-redux'

const ContactUsModal = (props) => {
  const user = useSelector((state) => state.user.user.user)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')

  const handleContactForm = (event) => {
    const { name, value } = event.target
    if (name === 'message') {
      setMessage(value)
    } else if (name === 'subject') {
      setSubject(value)
    }
  }

  const submitMessage = () => {
    // if (!validateEmail(email)) {
    //   toast.error(<IntlMessages id="alerts.valid_email" />)
    // } else
    if (subject.length === 0) {
      toast.error(<IntlMessages id="alerts.subject_required" />)
    } else if (message.length === 0) {
      toast.error(<IntlMessages id="alerts.contact_message" />)
    } else {
      const params = {
        message: message,
        email: user.email,
        subject: subject,
      }
      axiosInstance
        .post(process.env.REACT_APP_SERVER_BASE_URL + 'users/contact', params)
        .then(() => {
          setSubject('')
          setMessage('')
          toast.success(<IntlMessages id="general.message_success" />)
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
      backdrop="static"
      keyboard={false}
      id="contact-us-modal"
    >
      <Modal.Header className="contact-us-title general-modal-header my-auto p-0 mx-4">
        <h3 className="mb-0 pt-4 mt-2 ">
          <IntlMessages id="modal.contact_us" />
        </h3>
        <button
          type="button"
          className="btn-close me-1 mt-0 pt-1"
          aria-label="Close"
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="contact-us">
          <div>
            <label
              htmlFor="email"
              style={{ fontSize: '16px', fontWeight: 'bold' }}
            >
              <IntlMessages id="modal.contact_us_subject_label" />
            </label>
            <FormattedMessage
              id="modal.contact_us_subject_placeholder"
              defaultMessage="modal.contact_us_subject_placeholder"
            >
              {(placeholder) => (
                <input
                  className="mb-2 mt-1"
                  type="text"
                  name="subject"
                  placeholder={placeholder}
                  value={subject}
                  onChange={handleContactForm}
                />
              )}
            </FormattedMessage>
          </div>
          <div>
            <label
              htmlFor="message"
              style={{ fontSize: '16px', fontWeight: 'bold' }}
            >
              <IntlMessages id="modal.contact_us_message_label" />
            </label>
            <FormattedMessage
              id="modal.contact_us_message_placeholder"
              defaultMessage="modal.contact_us_message_placeholder"
            >
              {(placeholder) => (
                <textarea
                  className="mb-3 mt-1"
                  name="message"
                  placeholder={placeholder}
                  value={message}
                  onChange={handleContactForm}
                />
              )}
            </FormattedMessage>
          </div>

          <button onClick={submitMessage}>
            <IntlMessages id="modal.contact_us_send_message" />
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default ContactUsModal
