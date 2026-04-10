import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import '../ViewLearnerModal/index.css'

/**
 * Standalone email modal (same UI as ViewLearnerModal email step).
 * POST /super-admin/send-email/:recipientId
 */
const EmailLearnerModal = ({
  show,
  onHide,
  recipientId,
  title = 'Email Client'
}) => {
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    if (!show) {
      setEmailSubject('')
      setEmailMessage('')
      setSendingEmail(false)
    }
  }, [show])

  const handleClose = () => {
    if (!sendingEmail) {
      setEmailSubject('')
      setEmailMessage('')
      onHide()
    }
  }

  const handleSendEmail = async () => {
    if (!recipientId) {
      toast.error('Missing recipient')
      return
    }
    if (!emailSubject.trim()) {
      toast.error('Please enter a subject')
      return
    }
    if (!emailMessage.trim()) {
      toast.error('Please enter a message')
      return
    }

    setSendingEmail(true)
    try {
      await axiosInstance.post(`/super-admin/send-email/${recipientId}`, {
        subject: emailSubject,
        message: emailMessage
      })
      toast.success('Email sent successfully!')
      setEmailSubject('')
      setEmailMessage('')
      setSendingEmail(false)
      onHide()
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error(error.response?.data?.message || 'Failed to send email')
    } finally {
      setSendingEmail(false)
    }
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop={true}
      keyboard={!sendingEmail}
      className="email-learner-modal"
      centered
      size="md"
    >
      <div className="email-modal-content">
        <div className="email-modal-back" onClick={handleClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path d="M23.125 15H7.5M7.5 15L15 7.5M7.5 15L15 22.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="email-modal-header">
          <div className="email-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5.83301 7.50032L9.99968 10.417L14.1663 7.50032" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1.66699 13.8337V6.16699C1.66699 5.06242 2.56242 4.16699 3.66699 4.16699H16.3337C17.4382 4.16699 18.3337 5.06242 18.3337 6.16699V13.8337C18.3337 14.9382 17.4382 15.8337 16.3337 15.8337H3.66699C2.56242 15.8337 1.66699 14.9382 1.66699 13.8337Z" stroke="black" strokeWidth="1.5"/>
            </svg>
          </div>
          <h3 className="email-modal-title">{title}</h3>
        </div>

        <div className="email-form">
          <input
            type="text"
            className="email-subject-input"
            placeholder="Subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
            disabled={sendingEmail}
          />

          <textarea
            className="email-message-textarea"
            placeholder="Add message..."
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
            disabled={sendingEmail}
            rows={8}
          />

          <button
            type="button"
            className="email-send-btn"
            onClick={handleSendEmail}
            disabled={sendingEmail || !recipientId}
          >
            {sendingEmail ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              'SEND'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default EmailLearnerModal
