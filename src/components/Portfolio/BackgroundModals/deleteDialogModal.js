import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import IntlMessages from '../../../utils/IntlMessages'

const DeleteDialogModal = (props) => {
  const type =
    props.type === 'experience'
      ? 'experience'
      : props.type === 'education'
      ? 'educational experience'
      : 'accomplishment'

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='subscription-modal'
    >
      <Modal.Body>
        <div className='cancel-subscription mt-5'>
          Are you sure you want to delete your {type} ?
        </div>
        <div className='mt-4 text-center'>
          <button
            className='cancel-subscription-button'
            style={{ backgroundColor: '#01C5D1' }}
            onClick={() => {
              props.deleteBackground()
            }}
          >
            {props.deleteLoading ? (
              <span className='spinner-border spinner-border-sm' />
            ) : (
              `YES DELETE MY ${type}`
            )}
          </button>
        </div>
        <div className='mt-2 mb-5 text-center'>
          <button
            className='cancel-subscription-button'
            style={{ backgroundColor: 'none', color: '#BBBDBF' }}
            onClick={() => props.onHide()}
          >
            NO DON’T DELETE MY {type}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default DeleteDialogModal
