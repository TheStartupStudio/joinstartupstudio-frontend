import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'
import PreviewUserBio from '../../Portfolio/preview/previewUserBio'

const RespondConnectionModal = (props) => {
  const [loading, setLoading] = useState(false)

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      style={{ marginTop: '3rem' }}
    >
      <Modal.Header
        className='contact-us-title my-auto p-0 mx-4'
        style={{ border: 0 }}
      >
        <button
          type='button'
          className='btn-close mt-2'
          aria-label='Close'
          // onClick={() => closeModal()}
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body className='mx-md-4 mb-4'>
        <div className='text-center'>
          <PreviewUserBio user={props.connectionRequestData} />
          <div className='respond-rcmd-request mt-5'>
            <div className='mt-2 text-center connection-modal d-flex flex-column'>
              <button
                className='cancel-subscription-button accept-request-button m-auto'
                onClick={() => {
                  if (!loading) {
                    props.respondConnection(1)
                  }
                  setLoading(true)
                }}
              >
                {loading ? (
                  <IntlMessages id='general.loading' />
                ) : (
                  <IntlMessages id='connection.accept_connection' />
                )}
              </button>
              <div className='mt-2 d-flex justify-content-center align-items-center'>
                <p
                  className='my-auto text-end'
                  onClick={() => {
                    props.respondConnection(0)
                  }}
                >
                  <IntlMessages id='connection.ignore_connection' />
                </p>
                <h2 className='my-auto mx-4'>|</h2>

                <p
                  className='my-auto text-start'
                  style={{ color: '#F2359D' }}
                  onClick={() => {
                    props.respondConnection(2)
                  }}
                >
                  {' '}
                  <IntlMessages id='connection.block_user' />
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default RespondConnectionModal
