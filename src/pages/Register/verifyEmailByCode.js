import React from 'react'
import { useState } from 'react'
// import axios from 'axios'
import { userLogin } from '../../redux'
import { useDispatch } from 'react-redux'
import './index.css'
import IntlMessages from '../../utils/IntlMessages'
import { jwtDecode } from 'jwt-decode'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import CourseLogo from '../../assets/images/academy-icons/svg/Startup-Studio-Logo.svg'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'

const VerifyEmailByCode = (props) => {
  const url = new URL(window.location.href)
  const [code, setCode] = useState(null)
  const [error, setError] = useState(null)
  const [buttonLoading, setButtonLoading] = useState(false)
  const dispatch = useDispatch()
  const jwtDecoded = jwtDecode(localStorage.getItem('access_token'))
  const history = useHistory()

  const submitCode = (e) => {
    e.preventDefault()
    if (code === '' || !code) {
      setError('Enter Code')
      return
    }

    setButtonLoading(true)
    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}users/verify`, {
      method: 'post',
      headers: new Headers({
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ email: jwtDecoded.email })
    })
      .then((res) => res.json())
      .then((data) => {
        const params = {
          code: code
        }
        if (url.searchParams.has('hash')) {
          params['hash'] = url.searchParams.get('hash')
        } else {
          params['email'] = jwtDecoded.email
        }

        fetch(
          `${process.env.REACT_APP_SERVER_BASE_URL}users/verify-email-by-code`,
          {
            method: 'post',
            headers: new Headers({
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              // 'Accept': 'application/json',
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify(params)
          }
        )
          .then((res) => res.json())
          .then((expiration) => {
            setButtonLoading(false)
            if (expiration.isValid) {
              dispatch(userLogin())
              history.push('/dashboard')
            } else {
              setError(expiration.error)
            }
          })
      })
      .catch((err) => {
        setButtonLoading(false)
      })
  }

  async function resendEmail(data) {
    console.log('resend email', data)
    try {
      await axiosInstance.post('/auth/resend-email', { email: data })
      toast.success('Verification email sent successfully')
    } catch (error) {
      toast.error('Failed to resend email')
      setError('Failed to resend email. Please try again.')
    }
  }

  return (
    <>
      <div className='d-flex justify-content-center p-5'>
        <div className='d-flex align-items-center flex-column payment-main'>
          <img
            src={CourseLogo}
            alt='course-logo'
            className='course-logo-image'
          />
          <h2 className='text-uppercase fs-24 fw-bold mt-5 text-black'>
            Check your email
          </h2>
          <p className='text-black fs-15'>
            We have sent you an email with a link to confirm your email address.
            Please check your inbox and click the link to complete your
            registration.
          </p>
          <p className='text-black fs-15'>
            If you don't see the email, please check your spam or junk folder.
          </p>
          <p className='text-black fs-15'>
            If you still don't see it, please click the button below to resend
            the email.
          </p>
          <button
            className='resend-btn'
            onClick={() => resendEmail(jwtDecoded?.email)}
          >
            Resend Email
          </button>
        </div>
      </div>
    </>
  )
}

export default VerifyEmailByCode
