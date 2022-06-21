import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FormattedMessage } from 'react-intl'
import { Auth } from 'aws-amplify'
import { userLogin, loginLoading } from '../../../redux'
import IntlMessages from '../../../utils/IntlMessages'
import { validateEmail } from '../../../utils/helpers'
import SUSLogo from '../../../assets/images/sus-institute-logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import landingVideoPosterEn from '../../../assets/images/landing-video-poster-en.png'
import landingVideoPosterEs from '../../../assets/images/landing-video-poster-es.jpg'
import './index.css'
import {
  faTwitter,
  faFacebook,
  faInstagram,
  faVimeo,
  faLinkedin,
  faSpotify
} from '@fortawesome/free-brands-svg-icons'

function Login() {
  const [user, setUser] = useState({})
  const currentLanguage =
    localStorage.getItem('currentLanguage') !== undefined ||
    localStorage.getItem('currentLanguage') !== ''
      ? localStorage.getItem('currentLanguage')
      : 'en'
  const [loading, setLoading] = useState(false)
  const isLoading = useSelector((state) => state.user.loginLoading)

  const dispatch = useDispatch()

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
        .then((response) => {
          localStorage.setItem(
            'access_token',
            response.signInUserSession.idToken.jwtToken
          )
          localStorage.setItem(
            'language',
            response.attributes['custom:language']
          )
          localStorage.setItem('email', user.email)
          dispatch(userLogin())
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
      className='container-fluid md-px-5 ps-md-5'
      style={{ backgroundColor: '#F8F7F7', minHeight: ' calc(100vh - 90px)' }}
    >
      {/* <div className='login-create-account'>
				<Link to='/create-account'>Create your Account</Link>
			</div> */}
      <div className='row pt-5 center-content'>
        <div className='col-md-6'>
          <div className='row'>
            <div className='col-md-9 mx-auto'>
              <div className='login-left-content'>
                <img className='login-logo' src={SUSLogo} alt='logo' />
                <h1 className='login-title'>Welcome...</h1>
                <p>
                  ...to the Learn to Start Student Platform. Please log in to
                  access your platform.
                </p>

                <div className='social-media-items'>
                  {/* <a className='social-media-item' href='' target='_blank'>
										<FontAwesomeIcon icon={faFacebook} />
									</a> */}
                  <a
                    className='social-media-item'
                    href='https://twitter.com/learntostart'
                    target='_blank'
                  >
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                  <a
                    className='social-media-item'
                    href='https://www.linkedin.com/company/learntostart/'
                    target='_blank'
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                  <a
                    className='social-media-item'
                    href='https://vimeo.com/showcase/9368302'
                    target='_blank'
                  >
                    <FontAwesomeIcon icon={faVimeo} />
                  </a>
                  <a
                    className='social-media-item'
                    href='https://open.spotify.com/show/0LZ1HxvXnMf6IAdyY8M9q3'
                    target='_blank'
                  >
                    <FontAwesomeIcon icon={faSpotify} />
                  </a>
                  {/* <a className='social-media-item' href='' target='_blank'>
										<FontAwesomeIcon icon={faInstagram} />
									</a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-5'>
          <div
            className='col-lg-9 mx-auto public-page-form px-4 pb-3 pt-4'
            style={{ backgroundColor: 'white' }}
          >
            {/* <h3 className='text-center'>
              <IntlMessages id='login.title' />
            </h3> */}
            <FormattedMessage id='login.email' defaultMessage='login.email'>
              {(placeholder) => (
                <input
                  className='mt-2 mb-3'
                  type='text'
                  name='email'
                  placeholder={placeholder}
                  onChange={(event) => handleChange(event)}
                />
              )}
            </FormattedMessage>
            <FormattedMessage
              id='login.password'
              defaultMessage='login.password'
            >
              {(placeholder) => (
                <input
                  className='mb-3'
                  type='password'
                  name='password'
                  placeholder={placeholder}
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
                <span className='spinner-border spinner-border-sm' />
              ) : (
                <IntlMessages id='general.start' />
              )}
            </button>
            <p className='my-4'>
              <IntlMessages id='login.security' />
              <a href='/lts-secure' className='ml-2 link'>
                <IntlMessages id='login.protect_data' />
              </a>
            </p>
            <p className='text-center public-page-text'>
              <IntlMessages id='login.forgot_password' />
              <NavLink to={'/forgot-password'} className='ml-2 link'>
                <IntlMessages id='general.click_here' />
              </NavLink>
            </p>
          </div>
          {/* <p className='text-center mt-3 public-page-text link'>
            <IntlMessages id='login.register' />
            <a href='/create-account' className='ml-2 link'>
              <IntlMessages id='login.register_link' />
            </a>
          </p> */}
        </div>
      </div>
    </div>
  )
}

export default Login
