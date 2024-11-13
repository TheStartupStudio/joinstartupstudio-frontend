import React, { useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FormattedMessage } from 'react-intl'
import { Auth } from 'aws-amplify'
import { userLogin, loginLoading } from '../../../redux'
import IntlMessages from '../../../utils/IntlMessages'
import { validateEmail } from '../../../utils/helpers'
import './index.css'
import FormWrapper from './ui/FormWrapper'
import CustomLoginInput from './ui/CustomLoginInput'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowRight,
  faBackward
} from '@fortawesome/free-solid-svg-icons'
import { Col, Row } from 'react-bootstrap'
import { setLoginLoading } from '../../../redux/user/Actions'

function Login() {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(false)
  const isLoading = useSelector((state) => state.user.loginLoading)
  const history = useHistory()

  const dispatch = useDispatch()

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const enterLogin = (e) => {
    if (e.key.toLowerCase() == 'enter') handleSubmit(e)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    dispatch(loginLoading(true))

    if (!user.email || user.email === '') {
      toast.error(<IntlMessages id='alerts.email_required' />)
      dispatch(loginLoading(false))
    } else if (!user.password || user.password === '') {
      toast.error(<IntlMessages id='alerts.password_required' />)
      dispatch(loginLoading(false))
    } else if (!validateEmail(user.email)) {
      toast.error(<IntlMessages id='alerts.valid_email' />)
      dispatch(loginLoading(false))
    } else {
      await Auth.signIn(user.email, user.password)
        .then(async (response) => {
          localStorage.setItem(
            'access_token',
            response.signInUserSession.idToken.jwtToken
          )
          localStorage.setItem(
            'language',
            response.attributes['custom:language']
          )
          localStorage.setItem('email', user.email)

          dispatch(userLogin(user.password)).then((res) => {
            if (res === 'passwordResetRequired') {
              history.push('/password-change-required')
            } else if (!res) {
              toast.error('Wrong email or password!')
              dispatch(setLoginLoading(false))
            } else {
              history.push('/dashboard')
            }
          })
        })
        .catch((err) => {
          dispatch(loginLoading(false))
          if (err.message === 'Incorrect username or password.') {
            toast.error(<IntlMessages id='alerts.email_password_incorrect' />)
          } else {
            toast.error(<IntlMessages id='alerts.something_went_wrong' />)
          }
        })
    }
    // dispatch(loginLoading(false))
  }

  return (
    <div
      className='container-fluid md-px-5 ps-md-5 login_container position-relative'
      style={{ backgroundColor: '#e4e9f4' }}
    >
      <a
        href='/'
        className=' d-flex align-items-center cursor-pointer'
        style={{ position: 'absolute', top: '20px', left: '20px' }}
      >
        <FontAwesomeIcon icon={faArrowLeft} className='me-2' />
        <h6 className='p-0 m-0'>Choose Login</h6>
      </a>
      <Row className='m-0 p-0 ps-md-5 center-content'>
        <Col md='7' lg='6' xl='5' className='ms-sm-1'>
          <FormWrapper
            className='col-xl-8 col-lg-12 col-md-12 mx-auto px-4 pb-3 pt-4 login-form-resp '
            style={{ height: '60vh', minHeight: '60vh' }}
          >
            <FormattedMessage id='login.email' defaultMessage='login.email'>
              {(placeholder) => (
                <CustomLoginInput
                  cn={'mt-2 mb-3'}
                  placeholder={placeholder}
                  inputName='email'
                  inputType='email'
                  enterLogin={enterLogin}
                  onChange={(event) => handleChange(event)}
                />
              )}
            </FormattedMessage>

            <FormattedMessage
              id='login.password'
              defaultMessage='login.password'
            >
              {(placeholder) => (
                <CustomLoginInput
                  placeholder={placeholder}
                  enterLogin={enterLogin}
                  inputName='password'
                  inputType={'password'}
                  onChange={(event) => handleChange(event)}
                />
              )}
            </FormattedMessage>

            <button
              type='submit'
              className='mt-2'
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <span className='spinner-border-info spinner-border-sm' />
              ) : (
                <span className='d-flex align-items-center justify-content-center'>
                  <IntlMessages id='general.login' />
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className='ms-2 fw-bold'
                  />
                </span>
              )}
            </button>
            <p className='text-center public-page-text my-4'>
              <IntlMessages id='login.forgot_password' />
              <NavLink to={'/forgot-password'} className='ml-2 link fw-bold'>
                <IntlMessages id='general.click_here' />
              </NavLink>
            </p>
            <p className=' text-center public-page-text'>
              <IntlMessages id='login.security' />
              <br />
              <a href='/lts-secure' className='ml-2 link fw-bold'>
                <IntlMessages id='login.protect_data' />
              </a>
            </p>
          </FormWrapper>
        </Col>
      </Row>
    </div>
  )
}

export default Login
