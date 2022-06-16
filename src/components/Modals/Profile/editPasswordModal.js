import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { Auth } from 'aws-amplify'
import IntlMessages from '../../../utils/IntlMessages'
import { validatePassword } from '../../../utils/helpers'
const EditPasswordModal = (props) => {
  const [password, setPassword] = useState()
  const [loading, setLoading] = useState(false)

  const handlePasswordChange = (event) => {
    const { name, value } = event.target

    setPassword((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const changePassword = async (event) => {
    event.preventDefault()
    setLoading(true)
    setLoading(true)
    if (!password?.currentPassword || !password?.newPassword) {
      toast.error(<IntlMessages id='alert.fill_password_fields' />)
      setLoading(false)
    } else if (password?.newPassword && password?.newPassword.length < 8) {
      toast.error(<IntlMessages id='alert.password_min_8' />)

      setLoading(false)
    } else if (password?.newPassword !== password?.confirmPassword) {
      toast.error('Password and confirm password do not match!')
      setLoading(false)
    } else if (!validatePassword(password?.newPassword)) {
      toast.error(<IntlMessages id='reset.password_conform_policy' />)
    } else {
      const currentUser = await Auth.currentAuthenticatedUser()
      await Auth.changePassword(
        currentUser,
        password.currentPassword,
        password.newPassword
      )
        .then(() => {
          setPassword({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          })
          setLoading(false)
          toast.success(
            <IntlMessages id='alert.my_account.password_change_success' />
          )
        })
        .catch((err) => {
          if (err.message === 'Incorrect username or password.') {
            toast.error(<IntlMessages id='alert.incorrect_password' />)
          } else if (err.code === 'LimitExceededException') {
            toast.error(<IntlMessages id='alert.password_limit_exceededs' />)
          } else if (
            err.message ===
            'Password did not conform with policy: Password must have lowercase characters'
          ) {
            toast.error(<IntlMessages id='alert.password_conform_policy' />)
          } else {
            toast.error(<IntlMessages id='alert.something_went_wrong' />)
          }
          setLoading(false)
        })
    }
    setLoading(false)
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      className='edit-modal'
      id='password-modal'
    >
      <Modal.Header className='pb-0 mx-5'>
        <h3 className='mt-4 mb-0'>
          <IntlMessages id='my_account.update_password' />
        </h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={props.onHide}
        ></button>
      </Modal.Header>
      <Modal.Body className='mx-md-5 my-4 px-md-5'>
        <div className='w-100 mx-auto'>
          <p className='mb-0 password-label'>
            <IntlMessages id='my_account.original_password' />
          </p>
          <input
            className='mt-1 mb-4 px-2'
            type='password'
            name='currentPassword'
            onChange={handlePasswordChange}
          />

          <p className='mb-0 password-label'>
            <IntlMessages id='my_account.new_password' />
          </p>
          <input
            className='mt-1 mb-4 px-2'
            type='password'
            name='newPassword'
            onChange={handlePasswordChange}
          />
          <p className='mb-0 password-label'>
            <IntlMessages id='my_account.repeat_new_password' />
          </p>
          <input
            className='mt-1 mb-4 px-2'
            type='password'
            name='confirmPassword'
            onChange={handlePasswordChange}
          />
        </div>
        <div className='w-100 pb-5'>
          <div className='row float-end'>
            <button
              className='edit-account mx-2'
              disabled={loading}
              onClick={changePassword}
            >
              {loading ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                <IntlMessages id='general.save' />
              )}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default EditPasswordModal
