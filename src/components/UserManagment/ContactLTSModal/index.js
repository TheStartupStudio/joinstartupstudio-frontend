import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axiosInstance from '../../../utils/AxiosInstance'
import './index.css'

const ContactLTSModal = ({ show, onHide }) => {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubjectChange = (e) => {
    setSubject(e.target.value)
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSubmit = async () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject')
      return
    }

    if (!message.trim()) {
      toast.error('Please enter a message')
      return
    }

    setLoading(true)
    try {
      const response = await axiosInstance.post('/admin-info/contact-lts', {
        subject,
        message
      })

      if (response.data.success) {
        toast.success('Your message has been sent to LTS administrators!')
        setSubject('')
        setMessage('')
        onHide()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setSubject('')
      setMessage('')
      onHide()
    }
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="contact-lts-modal"
      backdrop={loading ? 'static' : true}
    >
      <Modal.Header className="contact-lts-modal-header">
        <div className="modal-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5.83301 7.5013L9.99968 10.418L14.1663 7.5013" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.5 13.3346V6.66797C2.5 5.74749 3.24619 5.0013 4.16667 5.0013H15.8333C16.7538 5.0013 17.5 5.74749 17.5 6.66797V13.3346C17.5 14.2551 16.7538 15.0013 15.8333 15.0013H4.16667C3.24619 15.0013 2.5 14.2551 2.5 13.3346Z" stroke="black" strokeWidth="1.5"/>
          </svg>
        </div>
        <h5 className="modal-title">Contact LTS</h5>
      </Modal.Header>

      <Modal.Body className="contact-lts-modal-body">

        <div className="form-group">
          <input
            id="subject"
            type="text"
            className="form-control"
            placeholder="Enter subject..."
            value={subject}
            onChange={handleSubjectChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <textarea
            id="message"
            className="form-control"
            rows="6"
            placeholder="Enter your message..."
            value={message}
            onChange={handleMessageChange}
            disabled={loading}
          />
        </div>

        <div className="modal-actions">
          <button
            className="btn-cancel"
            onClick={handleClose}
            disabled={loading}
          >
            CANCEL
          </button>
          <button
            className="btn-send"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ContactLTSModal
