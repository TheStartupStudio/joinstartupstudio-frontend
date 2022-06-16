import React, { useState, useReducer } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { NavLink } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import axios from 'axios'
import { Auth } from 'aws-amplify'
import { validatePassword } from '../../../utils/helpers'
import LTSJourneyEn from '../../../assets/images/lts-journey-en.png'
import LTSJourneyEs from '../../../assets/images/lts-journey-es.png'
import IntlMessages from '../../../utils/IntlMessages'

const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const userEmail = window.location.search
    ?.split('&')[0]
    ?.replace('?email=', '')
    ?.trim()
  const verificationCode = window.location.search
    ?.split('&')[1]
    ?.replace('code=', '')
    ?.trim()

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL

  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      new_password: '',
      confirm_new_password: ''
    }
  )

  const currentLanguage =
    localStorage.getItem('currentLanguage') !== undefined ||
    localStorage.getItem('currentLanguage') !== ''
      ? localStorage.getItem('currentLanguage')
      : 'en'

  const handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    setUserInput({ [name]: value })
  }

  const sendChangedPasswordEmail = async (email, language) => {
    const params = {
      email
    }
    await axios.post(`${baseUrl}users/password-changed`, params)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!verificationCode || !userEmail) {
      toast.error('Invalid parameters provided!!')
      return setLoading(false)
    }

    if (userInput.new_password == '') {
      toast.error(<IntlMessages id='reset.password_field_empty' />)
    } else if (userInput.new_password != userInput.confirm_new_password) {
      toast.error(<IntlMessages id='reset.password_not_match' />)
    } else if (userInput.new_password && userInput.new_password.length < 8) {
      toast.error(<IntlMessages id='reset.password_conform_policy' />)
    } else if (!validatePassword(userInput.new_password)) {
      toast.error(<IntlMessages id='reset.password_conform_policy' />)
    } else {
      setLoading(true)
      Auth.forgotPasswordSubmit(
        userEmail,
        verificationCode,
        userInput.new_password
      )
        .then(() => {
          setLoading(false)
          toast.success(
            <IntlMessages id='alert.my_account.password_change_success' />
          )
          setTimeout(() => {
            window.location.href = `/`
          }, 5000)
          // sendChangedPasswordEmail(email)
        })
        .catch((err) => {
          setLoading(false)
          if (
            err.code === 'ExpiredCodeException' ||
            err.code === 'LimitExceededException'
          )
            toast.error(err.message)
          else toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        })
    }
  }

  return (
    <div>
      <div
        className='container-fluid my-auto px-5 d-flex align-items-center justify-content-center'
        style={{
          backgroundColor: '#F8F7F7',
          minHeight: 'calc(100vh - 150px)'
        }}
      >
        <div className='w-100' style={{ marginTop: '-150px' }}>
          <div className='row my-auto'>
            <div
              className='col-md-8 col-lg-4 mx-auto p-4 public-page-form'
              style={{ backgroundColor: '#ffff' }}
            >
              <h3 className='text-center fw-bold'>
                <IntlMessages id='reset_password.title' />
              </h3>
              <p className='mb-3 mt-4 public-page-text4'>
                Enter your new password below. Your password must include at
                least one lower case letter, one upper case letter, and one
                number.
              </p>
              <FormattedMessage
                id='reset.new_password'
                defaultMessage='New Password'
              >
                {(placeholder) => (
                  <input
                    className='mb-3 w-100 pl-5'
                    type='password'
                    name='new_password'
                    placeholder={placeholder}
                    style={{ padding: '8px' }}
                    onChange={(event) => handleChange(event)}
                  />
                )}
              </FormattedMessage>
              <FormattedMessage
                id='reset.confirm_new_password'
                defaultMessage='Confirm New Password'
              >
                {(placeholder) => (
                  <input
                    className=' w-100 pl-5'
                    type='password'
                    name='confirm_new_password'
                    placeholder={placeholder}
                    style={{ padding: '8px' }}
                    onChange={(event) => handleChange(event)}
                  />
                )}
              </FormattedMessage>
              <button
                className='mt-3 float-end'
                onClick={(event) => handleSubmit(event)}
                style={{ width: '136px', height: '44px' }}
              >
                {loading ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  'SAVE'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        className='customToast'
        position='bottom-left'
        autoClose={5000}
      />
    </div>
  )
}

export default ResetPassword
