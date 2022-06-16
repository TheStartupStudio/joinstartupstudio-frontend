import React, { useState } from 'react'
import { Modal, ModalBody, Form } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'
import axiosInstance from '../../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons'

const DeleteSubmissionModal = (props) => {
  const [loading, setLoading] = useState(false)

  const deleteSubmission = () => {
    setLoading(true)
    axiosInstance
      .delete(`/users/submissions/${props.submissionId}`)
      .then(() => {
        props.onSave(props.submissionId)
        props.onHide()
        setLoading(false)
      })
      .catch((err) => {
        toast.error('Error deleting submission, please try again!')
        setLoading(false)
      })
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      className='edit-modal '
    >
      <ModalBody className={`delete-submission-modal px-md-5 my-5 pb-0`}>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={props.onHide}
        />
        <div className='row'>
          <div className='col-12 text-center'>
            <h2>Are you sure you want to delete your submission?</h2>
          </div>
        </div>
        <div className='row p-0 mb-3'>
          <div className='col-md-12 text-center'>
            <button
              className='edit-account mt-4'
              disabled={loading}
              onClick={deleteSubmission}
            >
              {loading ? (
                <IntlMessages id='general.loading' />
              ) : (
                <span>YES, DELETE IT</span>
              )}
            </button>
          </div>
          <div className='col-12 text-center'>
            <a className='dont-del-submission' onClick={props.onHide}>
              NO, DON'T DELETE IT
            </a>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}

export default DeleteSubmissionModal
