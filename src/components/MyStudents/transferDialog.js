import React from 'react'
import { Modal } from 'react-bootstrap'

export const TransferDialog = (props) => {
  return props.transferDialogData ? (
    <div className='bulk-deleting d-flex justify-content-center px-3 px-md-0'>
      <div className='d-flex h-100 justify-content-center align-items-center flex-column transfer-dialog'>
        <p className='pb-0 mb-2'>
          {props.transferDialogData.action === 'delete_pending'
            ? 'Are you sure you want to delete all pending sent student transfer requests?'
            : props.transferDialogData.action === 'delete_approved'
            ? 'Are you sure you want to delete all approved sent student transfer requests?'
            : props.transferDialogData.action === 'approved'
            ? 'Are you sure you want to approve all received pending student transfer requests?'
            : 'Are you sure you want to reject all received pending student transfer requests?'}
        </p>
        <div className='d-flex justify-content-center justify-content-md-between w-100'>
          <button
            className='lts-button'
            onClick={() => {
              props.action()
            }}
          >
            SUBMIT
          </button>
          <button
            className='lts-button'
            style={{ backgroundColor: '#ea3b97' }}
            onClick={() => {
              props.onHide()
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  ) : null
}
