import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import CustomLoginInput from './ui/CustomLoginInput'
import SUSLogo from '../../../assets/images/LTS-logo-horizontal.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css'
import { loginLoading, userLogin } from '../../../redux'
import { Col, NavLink, Row } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Auth } from 'aws-amplify'
import IntlMessages from '../../../utils/IntlMessages'
import { validateEmail } from '../../../utils/helpers'
import FormWrapper from './ui/FormWrapper'
import { setLoginLoading } from '../../../redux/user/Actions'

const ChooseLogin = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const isLoading = useSelector((state) => state.user.loginLoading)
  const [user, setUser] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
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
            'auth_time',
            response.signInUserSession.idToken.payload.auth_time
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

  const enterLogin = (e) => {
    if (e.key.toLowerCase() == 'enter') handleSubmit(e)
  }

  return (
    <div
      className='container-fluid md-px-5 ps-md-5 choose-login_container'
      style={{
        backgroundColor: '#e4e9f4'
      }}
    >
      <Row className='m-0 p-0 align-items-center center-content justify-evenly'>
        <Col md='6' sm='12'>
          <div className='row'>
            <div className='col-sm-12 col-md-9  mx-auto'>
              <div className='login-left-content sfari-onlyyy'>
                <div className='login-logo'>
                  <img src={SUSLogo} alt='logo' />
                </div>
                <h1 className='login-title' style={{ color: '#000' }}>
                  Welcome...
                </h1>
                <p style={{ color: '#000' }}>
                  ...to Learn to Start Powered by The Startup Studio. Please
                  choose from the options to the right to begin your login.
                </p>
              </div>
            </div>
          </div>
        </Col>
        <Col md='5' sm='12' className='right-login-content'>
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

export default ChooseLogin
