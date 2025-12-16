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
import { CustomInput } from '../../../ui/ContentItems'
import axiosInstance from '../../../utils/AxiosInstance'
import StartupStudioLogo from '../../../assets/images/Startup Studio Logo v1x1200.png'


const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const userEmail = window.location.search
    ?.split('&')[0]
    ?.replace('?email=', '')
    ?.trim()
  const verificationToken = window.location.search
    ?.split('&')[1]
    ?.replace('token=', '')
    ?.trim()

  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL

  const [userInput, setUserInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      new_password: '',
      confirm_new_password: ''
    }
  )

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
    if (!verificationToken || !userEmail) {
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

      await axiosInstance
        .post(`/auth/reset-password?email=${userEmail}`, {
          token: verificationToken,
          password: userInput.new_password
        })
        .then(() => {
          setLoading(false)
          toast.success(
            <IntlMessages id='alert.my_account.password_change_success' />
          )
          setTimeout(() => {
            window.location.href = `/`
          }, 5000)
        })
        .catch((error) => {
          toast.error(
            error.response.data.message || (
              <IntlMessages id='alerts.something_went_wrong' />
            )
          )
        })
        .finally(() => {
          setLoading(false)
        })

      // Auth.forgotPasswordSubmit(
      //   userEmail,
      //   verificationCode,
      //   userInput.new_password
      // )
      //   .then(() => {
      // setLoading(false)
      // toast.success(
      //   <IntlMessages id='alert.my_account.password_change_success' />
      // )
      // setTimeout(() => {
      //   window.location.href = `/`
      // }, 5000)
      //     // sendChangedPasswordEmail(email)
      //   })
      //   .catch((err) => {
      //     setLoading(false)
      //     if (
      //       err.code === 'ExpiredCodeException' ||
      //       err.code === 'LimitExceededException'
      //     )
      //       toast.error(err.message)
      //     else toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      //   })
    }
  }

  return (
    <div
      className=' md-px-5 ps-md-5 d-flex align-items-center justify-content-center choose-login_container'
      style={{
        backgroundColor: '#e4e9f4',
        minHeight: 'calc(100vh - 42px)'
        // overflow: 'hidden'
      }}
    >
      <img
                        src={StartupStudioLogo}
                        alt='logo'
                        style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 1000, height: '40px', width: '250px' }}
                      />
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
              Enter your new password below. Your password must include at least
              one lower case letter, one upper case letter, and one number.
            </p>
            <FormattedMessage
              id='reset.new_password'
              defaultMessage='New Password'
            >
              {(placeholder) => (
                <CustomInput
                  placeholder={placeholder}
                  type={'password'}
                  name='new_password'
                  handleChange={(event) => handleChange(event)}
                />
              )}
            </FormattedMessage>
            <FormattedMessage
              id='reset.confirm_new_password'
              defaultMessage='Confirm New Password'
            >
              {(placeholder) => (
                <CustomInput
                  placeholder={placeholder}
                  type={'password'}
                  name='confirm_new_password'
                  handleChange={(event) => handleChange(event)}
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
  )
}

export default ResetPassword
