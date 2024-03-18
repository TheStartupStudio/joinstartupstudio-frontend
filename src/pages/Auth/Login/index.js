import React, { useState } from 'react'
import { Link, NavLink, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { FormattedMessage } from 'react-intl'
import { Auth } from 'aws-amplify'
import { userLogin, loginLoading } from '../../../redux'
import IntlMessages from '../../../utils/IntlMessages'
import { validateEmail } from '../../../utils/helpers'
import './index.css'
import triangleIcon from '../../../assets/images/triangle.png'
import axiosInstance from '../../../utils/AxiosInstance'
import {
  updateStartTime,
  updateUserActivity
} from '../../../redux/user/Actions'

function Login() {
  const [user, setUser] = useState({})
  const currentLanguage =
    localStorage.getItem('currentLanguage') !== undefined ||
    localStorage.getItem('currentLanguage') !== ''
      ? localStorage.getItem('currentLanguage')
      : 'en'
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
      toast.error(<IntlMessages id="alerts.email_required" />)
      dispatch(loginLoading(false))
    } else if (!user.password || user.password === '') {
      toast.error(<IntlMessages id="alerts.password_required" />)
      dispatch(loginLoading(false))
    } else if (!validateEmail(user.email)) {
      toast.error(<IntlMessages id="alerts.valid_email" />)
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

          debugger
          if (response.signInUserSession.idToken.jwtToken) {
            const newTime = await axiosInstance.put(
              '/myPerformanceData/updateActivity/startTime',
              {},
              {
                headers: {
                  Authorization: `Bearer ${response.signInUserSession.idToken.jwtToken}`
                }
              }
            )
            debugger
            console.log(newTime)
          }

          // if (response) {
          //   console.log(response)
          //   axiosInstance
          //     .put(`/myPerformanceData/updateActivity`)
          //     .then(({ data }) => {
          //       debugger
          //       dispatch(updateUserActivity(data))
          //     })
          // }

          dispatch(userLogin(user.password)).then((res) => {
            if (res === 'passwordResetRequired') {
              history.push('/password-change-required')
            }
            history.push('/dashboard')
          })
        })
        .catch((err) => {
          dispatch(loginLoading(false))
          if (err.message === 'Incorrect username or password.') {
            toast.error(<IntlMessages id="alerts.email_password_incorrect" />)
          } else {
            toast.error(<IntlMessages id="alerts.something_went_wrong" />)
          }
        })
    }
    // dispatch(loginLoading(false))
  }

  return (
    <div
      className="container-fluid md-px-5 ps-md-5"
      style={{ backgroundColor: '#F8F7F7', minHeight: ' calc(100vh - 90px)' }}
    >
      {/* <div className='login-create-account'>
				<Link to='/create-account'>Create your Account</Link>
			</div> */}
      <div className="row pt-5 center-content">
        <div className="col-md-6 d-flex justify-content-center">
          <img src={triangleIcon} style={{ width: '400px', height: '100%' }} />
        </div>
        <div className="col-md-5">
          <div
            className="col-lg-9 mx-auto public-page-form px-4 pb-3 pt-4"
            style={{ backgroundColor: 'white' }}
          >
            {/* <h3 className='text-center'>
              <IntlMessages id='login.title' />
            </h3> */}
            <FormattedMessage id="login.email" defaultMessage="login.email">
              {(placeholder) => (
                <input
                  className="mt-2 mb-3"
                  type="text"
                  name="email"
                  placeholder={placeholder}
                  onKeyDown={enterLogin}
                  onChange={(event) => handleChange(event)}
                />
              )}
            </FormattedMessage>
            <FormattedMessage
              id="login.password"
              defaultMessage="login.password"
            >
              {(placeholder) => (
                <input
                  className="mb-3"
                  type="password"
                  name="password"
                  placeholder={placeholder}
                  onKeyDown={enterLogin}
                  onChange={(event) => handleChange(event)}
                />
              )}
            </FormattedMessage>
            <button
              type="submit"
              className="mt-2"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <IntlMessages id="general.start" />
              )}
            </button>
            <p className="my-4">
              <IntlMessages id="login.security" />
              <a href="/lts-secure" className="ml-2 link">
                <IntlMessages id="login.protect_data" />
              </a>
            </p>
            <p className="text-center public-page-text">
              <IntlMessages id="login.forgot_password" />
              <NavLink to={'/forgot-password'} className="ml-2 link">
                <IntlMessages id="general.click_here" />
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
