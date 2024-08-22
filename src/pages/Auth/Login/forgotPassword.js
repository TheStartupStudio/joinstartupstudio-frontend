import React, { useCallback, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FormattedMessage } from 'react-intl'
import { Auth } from 'aws-amplify'
import { validateEmail } from '../../../utils/helpers'
import LTSJourneyEn from '../../../assets/images/lts-journey-en.png'
import LTSJourneyEs from '../../../assets/images/lts-journey-es.png'
import IntlMessages from '../../../utils/IntlMessages'
import Footer from '../../../components/Footer'
import axiosInstance from '../../../utils/AxiosInstance'

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const currentLanguage =
    localStorage.getItem('currentLanguage') !== undefined ||
    localStorage.getItem('currentLanguage') !== ''
      ? localStorage.getItem('currentLanguage')
      : 'en'

  const handleChange = (event) => {
    setUserEmail(event.target.value)
  }

  const handleSubmit = async (event) => {
    setLoading(true)
    event.preventDefault()
    if (userEmail === '') {
      toast.error(<IntlMessages id='alert.email_fields_empty' />)
    } else if (!validateEmail(userEmail)) {
      toast.error(<IntlMessages id='alert.email_not_valid' />)
    } else {
      try {
        const res = await axiosInstance.post('/check-email', {
          email: userEmail
        })

        if (res.data.exists) {
          Auth.forgotPassword(userEmail)
            .then(() => {
              toast.success(<IntlMessages id='alert.check_email_redirect' />)
              setLoading(false)
              setTimeout(() => {
                window.location.href = `/`
              }, 2000)
            })
            .catch((err) => {
              if (err.code === 'LimitExceededException') {
                toast.error(
                  'Attempt limit exceeded, please try after some time.'
                )
              } else {
                toast.error(<IntlMessages id='alerts.something_went_wrong' />)
              }
            })
        } else {
          setLoading(false)
          return toast.error(res.data.message)
        }
      } catch (error) {}
    }
    // setLoading(false)
  }

  return (
    <div>
      <div
        className='container-fluid my-auto px-5 d-flex align-items-center justify-content-center'
        style={{
          backgroundColor: '#e4e9f4',
          minHeight: ' calc(100vh - 42px)'
        }}
      >
        {/* <div className='row '>
          <div className='col-12 col-10 col-md-6 mt-5 mx-auto text-center'>
            <img
              src={currentLanguage === 'es' ? LTSJourneyEs : LTSJourneyEn}
              alt='LEARN TO START'
              className='mt-2 img-fluid'
              width='80%'
            />
          </div>
        </div> */}

        <div className='w-100' style={{ marginTop: '-150px' }}>
          <div className='row my-auto'>
            <div
              className='col-md-8 col-lg-4 mx-auto p-4 public-page-form'
              style={{ backgroundColor: '#ffff' }}
            >
              <h3 className='text-center fw-bold'>
                <IntlMessages id='forgot_password.title' />
              </h3>
              <p className='mb-3 mt-4 public-page-text4'>
                <IntlMessages id='forgot_password.input_your_email' />
              </p>
              <FormattedMessage
                id='login.forgotPasswordEmail'
                defaultMessage='login.forgotPasswordEmail'
              >
                {(placeholder) => (
                  <input
                    className='mb-2 pl-5'
                    type='email'
                    name='email'
                    placeholder={placeholder}
                    style={{ padding: '8px' }}
                    onChange={(event) => handleChange(event)}
                  />
                )}
              </FormattedMessage>
              {/* <p className='text-center mt-3 public-page-text'>
                <IntlMessages id='forgot_password.associated' />
              </p> */}
              <button
                className='mt-2 float-end'
                onClick={(event) => handleSubmit(event)}
                style={{ width: '136px', height: '44px' }}
              >
                {loading ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  <IntlMessages id='general.submit' />
                )}
              </button>
            </div>
          </div>
          <p className='text-center mt-3 mb-0 pb-4 public-page-text link'>
            <IntlMessages id='forgot_password.mistake' />
            <NavLink to='/ims-login' className='ml-2 link'>
              <IntlMessages id='general.login' />
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
