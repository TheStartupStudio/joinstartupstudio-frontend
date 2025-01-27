import React, { useState } from 'react'
import { Col, Modal, Row } from 'react-bootstrap'
import './style.css'
import { useForm } from '../../../hooks/useForm'
import { useValidation } from '../../../hooks/useValidation'
import { toast } from 'react-toastify'
import { CustomInput, LtsButton } from '../../../ui/ContentItems'
import personwkeyIcon from '../../../assets/images/personwkey.png'
import tickIcon from '../../../assets/images/tick.png'
import axiosInstance from '../../../utils/AxiosInstance'

const ResetPasswordModal = ({ show, onHide, user, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const initialState = {
    password: '',
    confirmPassword: ''
  }

  const { formData, handleChange } = useForm(initialState, user, loading)
  const { errors, handleSubmit } = useValidation(formData, setFormSubmitted)

  const submitHandler = () => {
    handleSubmit(async () => {
      setLoading(true)

      await axiosInstance
        .patch(`/auth/adminSetUserPassword/${user.id}`, {
          newPassword: formData.password
        })
        .then((res) => {
          onSuccess()
          toast.success(res.data.message)
          setLoading(false)
        })
        .catch((error) => {
          toast.error(error.response.data.message || 'Something went wrong')
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }
  return (
    <>
      <Modal
        show={show}
        className={'reset-password-modal'}
        onHide={() => {
          onHide()
        }}
        centered
        size='sm'
      >
        <Modal.Header className='position-relative p-3 reset-password-modal'>
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
              <img
                src={personwkeyIcon}
                width={21}
                height={24}
                alt='tick icon'
              />
            </div>
            Reset Password
          </Modal.Title>

          <div
            className={`check-button reset-pasw-checkbtn fw-bold`}
            onClick={() => onHide()}
          >
            <img src={tickIcon} width={50} height={38} alt='tick icon' />
          </div>
        </Modal.Header>
        <Modal.Body>
          <Col>
            <p className='userdetails'>Create a new password</p>
            <CustomInput
              placeholder={'New Password'}
              type={'password'}
              name='password'
              handleChange={handleChange}
              showError={formSubmitted}
              error={errors.password}
            />
            <CustomInput
              placeholder={'Repeat Password'}
              type={'password'}
              name='confirmPassword'
              handleChange={handleChange}
            />
          </Col>
          <Col md='12' className='d-flex justify-content-end pt-3'>
            <Row
              className='m-0 col-5 justify-content-between'
              style={{
                width: '100%'
              }}
            >
              <LtsButton
                className={'cancel-btns'}
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
                className={'ms-2 cancel-btns'}
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
