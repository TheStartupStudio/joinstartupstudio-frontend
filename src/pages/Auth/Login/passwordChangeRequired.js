import React, { useState, useReducer } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { FormattedMessage } from 'react-intl'
import { validatePassword } from '../../../utils/helpers'
import IntlMessages from '../../../utils/IntlMessages'
import axiosInstance from '../../../utils/AxiosInstance'
import { userLogin } from '../../../redux'

const getDashboardRoute = (roleId) => {
  if (roleId === 2 || roleId === 3) {
    return '/admin-dashboard'
  }
  return '/dashboard'
}

const PasswordChangeRequired = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async (event) => {
    event.preventDefault()
    // if (!old_password) {
    //   toast.error('Invalid parameters provided!!')
    //   return setLoading(false)
    // }

    if (userInput.new_password === '') {
      toast.error(<IntlMessages id='reset.password_field_empty' />)
    } else if (userInput.new_password !== userInput.confirm_new_password) {
      toast.error(<IntlMessages id='reset.password_not_match' />)
    } else if (userInput.new_password && userInput.new_password.length < 8) {
      toast.error(<IntlMessages id='reset.password_conform_policy' />)
    } else if (!validatePassword(userInput.new_password)) {
      toast.error(<IntlMessages id='reset.password_conform_policy' />)
    } else {
      setLoading(true)

      try {
        await axiosInstance.post('/auth/update-password', {
          password: userInput.new_password
        })
        await axiosInstance.put('/users/lastlogin')

        const loginResult = await dispatch(userLogin(userInput.new_password))

        if (!loginResult || loginResult === 'passwordResetRequired') {
          toast.error(
            'Password saved. Please sign in with your new password.'
          )
          history.push('/')
          return
        }

        toast.success(
          <IntlMessages id='alert.my_account.password_change_success' />
        )

        const storedUser = JSON.parse(localStorage.getItem('user'))
        const roleId = storedUser?.user?.role_id
        history.push(getDashboardRoute(roleId))
      } catch (err) {
        if (
          err.code === 'ExpiredCodeException' ||
          err.code === 'LimitExceededException'
        ) {
          toast.error(err.message)
        } else {
          toast.error(
            err.response?.data?.message || (
              <IntlMessages id='alerts.something_went_wrong' />
            )
          )
        }
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div>
      <div
        className='container-fluid my-auto px-5 d-flex align-items-center justify-content-center'
        style={{
          backgroundColor: '#e4e9f4',
          minHeight: 'calc(100vh - 54px)'
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

export default PasswordChangeRequired
