import React from 'react'
import { useState } from 'react'
// import axios from 'axios'
import { userLogin } from '../../redux'
import { useDispatch } from 'react-redux'
import './index.css'
import IntlMessages from '../../utils/IntlMessages'

const VerifyEmailByCode = (props) => {
  const url = new URL(window.location.href)
  const [code, setCode] = useState(null)
  const [error, setError] = useState(null)
  const [buttonLoading, setButtonLoading] = useState(false)
  const dispatch = useDispatch()

  const submitCode = (e) => {
    e.preventDefault()
    if (code === '' || !code) {
      setError('Enter Code')
      return
    }

    setButtonLoading(true)
    fetch(`${process.env.REACT_APP_SERVER_BASE_URL}/users/verify`, {
      method: 'post',
      headers: new Headers({
        Authorization: `Basic ${localStorage.getItem('access_token')}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ email: localStorage.getItem('email') })
    })
      .then((res) => res.json())
      .then((data) => {
        const params = {
          code: code
        }
        if (url.searchParams.has('hash')) {
          params['hash'] = url.searchParams.get('hash')
        } else {
          params['email'] = localStorage.getItem('email')
        }

        fetch(
          `${process.env.REACT_APP_SERVER_BASE_URL}/users/verify-email-by-code`,
          {
            method: 'post',
            headers: new Headers({
              Authorization: `Basic ${localStorage.getItem('access_token')}`,
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
            } else {
              setError(expiration.error)
            }
          })
      })
      .catch((err) => {
        setButtonLoading(false)
      })
  }

  return (
    <div className='verify-wrapper'>
      <div className='verify-form public-page-form'>
        <h1>
          <span>Verify Your Account</span>
        </h1>
        <p>
          Please check your email for your unique verification code and then
          enter your code below.
        </p>
        <input
          className='form-item'
          type='number'
          onChange={(e) => setCode(e.target.value)}
        />
        {error && <p className='verify-error'>{error}</p>}
        <div className='verify-btn-wrapper'>
          <button className='verify-btn' onClick={submitCode}>
            {buttonLoading ? (
              <span className='spinner-border spinner-border-sm' />
            ) : (
              <IntlMessages id='general.go_next' />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailByCode
