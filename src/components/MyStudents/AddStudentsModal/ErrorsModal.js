import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Modal } from 'react-bootstrap'
import '../index.css'
import { toast } from 'react-toastify'
import IndividualError from './IndividualError'
import _ from 'lodash'

const ErrorsModal = (props) => {
  return (
    <Modal
      show={props.show}
      className={'Add-Student-Modal mb-5 pb-5'}
      backdrop='static'
      onHide={() => {
        props.setErrors()
        props.onHide()
      }}
      style={{ marginTop: '3.9%' }}
    >
      <Modal.Header className='contact-us-title general-modal-header my-auto p-0 mx-4'>
        <h3 className='mb-0 pt-4 mt-2'>Add Users</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={() => {
            props.setErrors()
            props.onHide()
          }}
        />
      </Modal.Header>
      <Modal.Body className={'errors-modal-body'}>
        {/* {(props.errors.length, props.errors.message !== '')}
        {props.errors.length == 0 && props.errors.message == ''
          ? 'empty fields'
          : ''} */}
        <p className='mx-2 mb-2'>
          <span style={{ fontWeight: 500 }}>Report: </span>
          <br />
          Total:{' '}
          <span className='text-primary'> {props.finishedReport.total} </span> |
          Added:{' '}
          <span className='text-success'> {props.finishedReport.added} </span> |
          Failed:{' '}
          <span className='text-danger'> {props.finishedReport.failed} </span>
        </p>
        {/* {_.isEmpty(props.errors) && 'Plase fill a fields'} */}
        {props.errors.length > 0 && (
          <>
            <p className='mx-2 mb-0' style={{ fontWeight: 500 }}>
              Failed rows information:
            </p>
            {props.errors.map((error, index) => (
              <IndividualError
                message={error.message}
                user={error.user}
                code={error.code}
                key={index}
              />
            ))}
          </>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ErrorsModal
