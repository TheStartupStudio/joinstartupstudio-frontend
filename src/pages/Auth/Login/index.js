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
import IntlMessages from '../../../utils/IntlMessages'
import { validateEmail } from '../../../utils/helpers'
import FormWrapper from './ui/FormWrapper'
import { setLoginLoading } from '../../../redux/user/Actions'
import axiosInstance from '../../../utils/AxiosInstance'
import { Link, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import StartupStudioLogo from '../../../assets/images/academy-icons/SUS OAE Logox800 1.png'
import facebookLogo from '../../../assets/images/academy-icons/svg/icons8-facebook.svg'
import googleLogo from '../../../assets/images/academy-icons/svg/icons8-google.svg'
import microsoftLogo from '../../../assets/images/academy-icons/svg/icons8-microsoft.svg'

import Footer from '../../../components/Footer'
import Faq from '../../../components/FAQ/Faq'
import HowWeProtect from '../../../components/HowWeProtect'
const ChooseLogin = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.user.loginLoading)
  const [user, setUser] = useState({})
  const location = useLocation()
  const [faqModal, setFaqModal] = useState(false)
  const [protectModal, setProtectModal] = useState(false)

  const confirmEmail = location?.state?.confirmEmail

  const currentUrl = window.location.href

  const handleChange = (event) => {
    const { name, value } = event.target
    setUser((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
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
      await axiosInstance
        .post('/auth/login', {
          email: user.email,
          password: user.password
        })
        .then(({ data }) => {
          localStorage.setItem('access_token', data.access_token)
          localStorage.setItem('refresh_token', data.refresh_token)
          dispatch(userLogin(user.password))
            .then((res) => {
              if (res === 'passwordResetRequired') {
                history.push('/password-change-required')
              } else if (!res) {
                toast.error('Wrong email or password!')
                dispatch(setLoginLoading(false))
              } else {
                history.push('/dashboard')
              }
            })
            .catch((err) => {
              console.log('err', err)
            })
        })
        .catch((error) => {
          if (error.response) {
            toast.error(
              error.response.data.message ||
                'An error occurred. Please try again'
            )
          } else {
            toast.error(
              'Something went wrong. Please check your internet connection.'
            )
          }
          dispatch(setLoginLoading(false))
        })

      // await Auth.signIn(user.email, user.password)
      //   .then(async (response) => {
      // localStorage.setItem(
      //   'access_token',
      //   response.signInUserSession.idToken.jwtToken
      // )
      //     localStorage.setItem(
      //       'language',
      //       response.attributes['custom:language']
      //     )
      //     localStorage.setItem('email', user.email)

      // dispatch(userLogin(user.password)).then((res) => {
      //   if (res === 'passwordResetRequired') {
      //     history.push('/password-change-required')
      //   } else if (!res) {
      //     toast.error('Wrong email or password!')
      //     dispatch(setLoginLoading(false))
      //   } else {
      //     history.push('/dashboard')
      //   }
      // })
      //   })
      //   .catch((err) => {
      //     dispatch(loginLoading(false))
      //     if (err.message === 'Incorrect username or password.') {
      //       toast.error(<IntlMessages id='alerts.email_password_incorrect' />)
      //     } else {
      //       toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      //     }
      //   })
    }
    // dispatch(loginLoading(false))
  }

  const enterLogin = (e) => {
    if (e.key.toLowerCase() === 'enter') handleSubmit(e)
  }

  return (
    <div className='container-fluid md-px-5 ps-md-5 choose-login_container-academy gradient-background'>

      <div className='d-flex align-items-center justify-content-center flex-wrap justify-content-sm-between gap-3'>
        <a href='https://academy.learntostart.com/'>
          <img
            src={StartupStudioLogo}
            alt='course-logo'
            className='my-3 img-register-login'
          />
        </a>
        <div className="d-flex gap-4 text-black pe-md-5" style={{ fontSize: '0.8125rem' }}>
          <a href='https://academy.learntostart.com/' className="text-decoration-none text-black">HOME</a>
          <a href='https://academy.learntostart.com/contact.html' className="text-decoration-none text-black">CONTACT US</a>
        </div>
      </div>

      <Row className='m-0 p-0 align-items-center center-content justify-evenly'>
        <Col md='10' lg='8' className='main-login-container'>
          <FormWrapper className='login-content-wrapper'>
            <div className='welcome-content'>
              <div className='login-logo d-none-mob'>
                <img
                  src={StartupStudioLogo}
                  alt='logo'
                  style={{ width: '200px' }}
                />
              </div>
              {confirmEmail ? (
                <>
                  <h1 className='login-title text-black'>Thanks !</h1>
                  <p className='text-black fs-5 fw-light lh-sm'>
                    Your email address is confirmed.
                    <br />
                    You can now log into your account.
                  </p>
                </>
              ) : (
                <>
                  <h1 className='login-title text-black'>Welcome...</h1>
                  <p className='text-black fs-5 fw-light'>
                    to The Startup Studio Online Academy in Entrepreneurship{' '}
                    <br className='d-none-mob' /> powered by Learn to Start.
                    Please log in or create <br className='d-none-mob' /> an
                    account.
                  </p>
                </>
              )}
            </div>

            {/* Right side - Login Form */}
            <div className='login-form-container'>
              <FormattedMessage id='login.email' defaultMessage='Email'>
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

              <FormattedMessage id='login.password' defaultMessage='Password'>
                {(placeholder) => (
                  <CustomLoginInput
                    placeholder={placeholder}
                    enterLogin={enterLogin}
                    inputName='password'
                    inputType='password'
                    onChange={(event) => handleChange(event)}
                  />
                )}
              </FormattedMessage>

              <div
                className='login-button'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '150px',
                  borderRadius: '8px',
                  background: 'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                  padding: '2px',
                  height: '58px',
                  boxShadow: '0px 4px 10px 0px #00000040'
                }}
              >
                <button
                  type='submit'
                  className={`w-100 login-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <span 
                        className='spinner-border spinner-border-sm' 
                        style={{
                          width: '1.2rem',
                          height: '1.2rem',
                          borderColor: '#51C7DF',
                          borderRightColor: 'transparent'
                        }}
                      />
                      <span style={{ color: '#51C7DF' }}>Loading...</span>
                    </div>
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
              </div>

              <p className='text-center public-page-text m-0-mob m-1'>
                <IntlMessages id='login.forgot_password' />
                <Link to='/forgot-password' className='ml-2 link fw-bold'>
                  <IntlMessages id='general.click_here' />
                </Link>
              </p>
              <p className='text-center public-page-text m-0-mob m-1'>
                <IntlMessages id='login.register' />
                <Link to='/register' className='ml-2 link fw-bold'>
                  <IntlMessages id='login.register_link' />
                </Link>
              </p>
              <div className='d-flex flex-column align-items-center justify-content-center mb-3'>
                <span className='mb-2 public-page-text'>OR USE</span>
                <div className='d-flex gap-3 auth-logos-buttons'>
                  <a
                    href={`${process.env.REACT_APP_SERVER_BASE_URL}auth/google`}
                    className='cursor-pointer'
                  >
                    <img className='auth-logos' src={googleLogo} alt='google' />
                  </a>
                  <a
                    href={`${
                      process.env.REACT_APP_SERVER_BASE_URL
                    }auth/facebook?from=${encodeURIComponent(currentUrl)}`}
                    className='cursor-pointer'
                  >
                    <img
                      className='auth-logos'
                      src={facebookLogo}
                      alt='facebook'
                    />
                  </a>

                   <a
                    href={`${process.env.REACT_APP_SERVER_BASE_URL}auth/microsoft`}
                    className='cursor-pointer'
                  >
                    <img className='auth-logos' src={microsoftLogo} alt='microsoft' />
                  </a>
                </div>
              </div>
              <p className='text-center public-page-text font-12 m-0'>
                <IntlMessages id='login.security' />
              </p>
              <p
                onClick={() => setProtectModal(true)}
                className='link fw-bold font-12 security-text blue-color cursor-pointer'
              >
                <IntlMessages id='login.protect_data' />
              </p>
              <HowWeProtect isOpen={protectModal} setIsOpen={setProtectModal} />
            </div>
          </FormWrapper>
        </Col>
      </Row>
    </div>
  )
}

export default ChooseLogin
