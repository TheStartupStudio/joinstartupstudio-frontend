import React from 'react'
import { Modal } from 'react-bootstrap'

export const DeactivateDialogModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='subscription-modal'
    >
      <Modal.Body
        style={{
          color: props.action_type === 'activate' ? '#01C5D1' : '#FF3399',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: ' column'
        }}
      >
        <div
          className='cancel-subscription mt-5 px-2'
          style={{
            color: props.action_type === 'activate' ? '#01C5D1' : '#FF3399',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: ' column'
          }}
        >
          Are you sure you want to deactivate Items ?
        </div>
        <div className='mt-4 text-center'>
          <button
            className='cancel-subscription-button'
            style={{
              backgroundColor:
                props.action_type === 'activate' ? '#01C5D1' : '#FF3399'
            }}
            onClick={() => {
              props.handleAction()
            }}
          >
            {props.deactivateLoading ? (
              <span className='spinner-border spinner-border-sm' />
            ) : (
              `YES ${
                props.action_type === 'activate' ? 'activate' : 'deactivate'
              } ITEMS`
            )}
          </button>
        </div>
        <div className='mt-2 mb-5 text-center fw-bold'>
          <span
            style={{ color: '#707070', fontSize: '12px', cursor: 'pointer' }}
            onClick={props.onHide}
          >
            CANCEL & GO BACK
          </span>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export const RemoveDialogModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='subscription-modal'
    >
      <Modal.Body
        style={{
          color: props.action_type === 'activate' ? '#01C5D1' : '#FF3399',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: ' column'
        }}
      >
        <div
          className='cancel-subscription mt-5 px-2'
          style={{
            color: props.action_type === 'activate' ? '#01C5D1' : '#FF3399',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: ' column'
          }}
        >
          Are you sure you want to remove this item ?
        </div>
        <div className='mt-4 text-center'>
          <button
            className='cancel-subscription-button'
            style={{
              backgroundColor:
                props.action_type === 'activate' ? '#01C5D1' : '#FF3399'
            }}
            onClick={() => {
              props.handleAction()
            }}
          >
            {props.deactivateLoading ? (
              <span className='spinner-border spinner-border-sm' />
            ) : (
              `YES Delete Item`
            )}
          </button>
        </div>
        <div className='mt-2 mb-5 text-center fw-bold'>
          <span
            style={{ color: '#707070', fontSize: '12px', cursor: 'pointer' }}
            onClick={props.onHide}
          >
            CANCEL & GO BACK
          </span>
        </div>
      </Modal.Body>
    </Modal>
  )
}
