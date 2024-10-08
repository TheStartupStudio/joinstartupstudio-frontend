import React, { useState } from 'react'
import { faUserLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Modal, Row } from 'react-bootstrap'
import './style.css'
import { CustomInput, SubmitButton } from './ContentItems'
import configureAwsSdk from '../../../config/configAwsSdk'
import { useForm } from '../../../hooks/useForm'
import { useValidation } from '../../../hooks/useValidation'
import { toast } from 'react-toastify'
import { LtsButton } from '../../../ui/ContentItems'

const changeUserPassword = async (cognito_Id, newPassword) => {
  const cognito = configureAwsSdk()

  const params = {
    UserPoolId: cognito.config.UserPoolId,
    Username: cognito_Id,
    Password: newPassword,
    Permanent: true
  }

  try {
    await cognito.adminSetUserPassword(params).promise()
  } catch (error) {
    throw error
  }
}

const ResetPasswordModal = ({ show, onHide, user, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const initialState = {
    password: '',
    confirmPassword: ''
  }

  const { formData, handleChange } = useForm(initialState, user, loading)
  const { handleSubmit } = useValidation(formData, setFormSubmitted)

  const submitHandler = () => {
    handleSubmit(async () => {
      setLoading(true)
      try {
        await changeUserPassword(user.cognito_Id, formData.password)
        onSuccess()
        setLoading(false)
        toast.success('Password changed successfully!')
        onHide()
      } catch (error) {
        setLoading(false)
        toast.error('Failed to change password.')
      }
    })
  }
  return (
    <>
      <Modal
        show={show}
        className={''}
        onHide={() => {
          onHide()
        }}
        centered
        size='sm'
      >
        <Modal.Header className='position-relative p-3'>
          <Modal.Title
            className='px-3 py-3 d-flex fw-normal flex-column'
            style={{ fontSize: '16px' }}
          >
            <div
              className='d-flex align-items-center justify-content-center mb-3'
              style={{
                width: '36px',
                height: '36px',
                background: '#C8CDD880',
                fontSize: '15px',
                borderRadius: '50%'
              }}
            >
              <FontAwesomeIcon icon={faUserLock} />
            </div>
            Reset Password
          </Modal.Title>

          <div className={`check-button fw-bold`} onClick={() => onHide()}>
            X
          </div>
        </Modal.Header>
        <Modal.Body>
          <Col>
            <p>User details</p>
            <CustomInput
              placeholder={'New Password'}
              type={'text'}
              name='password'
              handleChange={handleChange}
            />
            <CustomInput
              placeholder={'Repeat Password'}
              type={'text'}
              name='confirmPassword'
              handleChange={handleChange}
            />
          </Col>
          <Col md='12' className='d-flex justify-content-end pt-3'>
            <Row className='m-0 col-5 justify-content-end'>
              <LtsButton
                text={'CANCEL'}
                background={'transparent'}
                color={'#000'}
                border={'1px solid #ccc'}
                onClick={() => onHide()}
              />
              <LtsButton
                text={
                  loading ? (
                    <span className='spinner-border spinner-border-sm' />
                  ) : (
                    'RESET'
                  )
                }
                background={'#52C7DE'}
                className={'ms-2'}
                color={'#fff'}
                border={'none'}
                onClick={submitHandler}
              />
            </Row>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ResetPasswordModal
