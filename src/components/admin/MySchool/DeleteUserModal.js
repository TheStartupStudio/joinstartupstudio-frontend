import React, { useState } from 'react'
import { faCheck, faUserMinus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Modal } from 'react-bootstrap'
import './style.css'
import { SubmitButton } from './ContentItems'
import configureAwsSdk from '../../../config/configAwsSdk'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { LtsButton } from '../../../ui/ContentItems'

const deleteUserFromCognito = async (cognito_Id) => {
  const cognito = configureAwsSdk()

  const params = {
    UserPoolId: cognito.config.UserPoolId,
    Username: cognito_Id
  }

  try {
    await cognito.adminDeleteUser(params).promise()
  } catch (error) {
    throw error
  }
}

const normalizeUsers = (users) => {
  return Array.isArray(users) ? users : [users]
}

const DeleteUserModal = ({ show, onHide, users, onSuccess }) => {
  const [loading, setLoading] = useState(false)

  const handleDeleteUsers = async () => {
    setLoading(true)
    try {
      const normalizedUsers = normalizeUsers(users)

      for (const user of normalizedUsers) {
        await deleteUserFromCognito(user.cognito_Id)

        await axiosInstance.delete(`/instructor/${user.id}`)
      }

      setLoading(false)
      onSuccess()
      toast.success(
        `${normalizedUsers.length > 1 ? 'Users' : 'User'} deleted successfully!`
      )
      onHide()
    } catch (error) {
      console.log('error', error.message)
      setLoading(false)
      toast.error('Failed to delete user(s).')
    }
  }

  const isMultipleUsers = Array.isArray(users) && users.length > 1

  return (
    <>
      <Modal
        show={show}
        className={''}
        onHide={() => {
          onHide()
        }}
        centered
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
              <FontAwesomeIcon icon={faUserMinus} />
            </div>
            {`Delete ${isMultipleUsers ? 'Users' : 'User'}`}
          </Modal.Title>
          <div className={`check-button fw-bold`} onClick={() => onHide()}>
            X
          </div>
        </Modal.Header>
        <Modal.Body className='text-center '>
          <Col>
            <p className='text-center'>
              {`Are you sure you want to delete ${
                isMultipleUsers ? 'these users' : 'this user'
              }?`}
            </p>
          </Col>
          <Col md='12' className='d-flex justify-content-center'>
            <LtsButton
              text={
                loading ? (
                  <span className='spinner-border spinner-border-sm' />
                ) : (
                  `YES, DELETE ${isMultipleUsers ? 'USERS' : 'USER'}`
                )
              }
              background={'#EE3C96'}
              color={'#FFF'}
              border={'1px solid #ccc'}
              onClick={handleDeleteUsers}
            />
          </Col>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default DeleteUserModal
