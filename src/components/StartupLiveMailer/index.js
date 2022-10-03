import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import FoulWords from '../../utils/FoulWords'
import { USER_CONTACT_FORM } from '../../utils/constants'
import IntlMessages from '../../utils/IntlMessages'
import './index.css'

const StartupMailer = (props) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [foulWords, setFoulWords] = useState(null)

  const user = useSelector((state) => state.user.user.user)

  const sendEmail = async () => {
    if (loading) return
    setLoading(true)

    if (foulWords) {
      await FoulWords.register(user.id, foulWords, USER_CONTACT_FORM)
      setFoulWords(null)
    }

    axiosInstance
      .post('/users/send-user-email', {
        userLevel: props.userLevel,
        message
      })
      .then((res) => {
        toast.success('message sent successfully')
        setMessage('')
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        toast.error('Error sending email!')
      })
  }

  return (
    <>
      <div className='user-contact-form px-3 py-4 my-4 d-block send-email-ui'>
        <h3
          className='text-lg-center'
          style={{ fontWeight: '600', fontSize: '20px' }}
        >
          Ask a question
        </h3>
        <p style={{ fontSize: '12px' }} className='mb-0'>
          Send a question for the next Startup Live guest.
        </p>
        <div id='userContactForm'>
          <div>
            <textarea
              name='message'
              className='w-100 p-2 mt-3'
              rows='10'
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
              }}
              placeholder='Message...'
            ></textarea>
            <span className='field-error'></span>
          </div>
          <div>
            <button
              type='submit'
              className='lts-button w-100 mt-2'
              disabled={loading}
              onClick={() => sendEmail()}
            >
              {loading ? (
                <IntlMessages id='general.loading' />
              ) : (
                <span>Send</span>
              )}
            </button>
          </div>
          {foulWords && (
            <div className='p-2 foul-words-notice'>
              {FoulWords.printMessage(foulWords)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default StartupMailer
