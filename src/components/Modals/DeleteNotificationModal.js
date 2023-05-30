import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import 'react-quill/dist/quill.snow.css'

const DeleteNotificationModal = (props) => {
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop="static"
        keyboard={false}
        id="subscription-modal"
      >
        <Modal.Body
          style={{
            borderRadius: 5,
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
          }}
        >
          <div className="mt-4 mb-4 blocked-user-modal confirmation-modal px-md-5 text-center">
            <p>{`Are you sure that you want to delete this notification`}</p>
            <button
              className="cancel-subscription-button"
              style={{ background: '#51C7DF' }}
              onClick={() => props.onDelete()}
            >
              Yes, delete the notification
            </button>
            <button
              className="cancel-subscription-button mt-2"
              onClick={() => props.onHide()}
              style={{
                color: '#BBBDBF',
                background: '#fff',
                border: '1px solid #BBBDBF',
              }}
            >
              No, don't delete my notification
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
export default DeleteNotificationModal
