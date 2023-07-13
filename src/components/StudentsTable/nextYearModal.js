import React from 'react'
import { Modal } from 'react-bootstrap'

export const NextYearModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      id="subscription-modal"
    >
      <Modal.Body>
        <div
          className="cancel-subscription mt-5 px-2"
          style={{
            color: props.action_type === 'activate' ? '#01C5D1' : '#FF3399',
          }}
        >
          Are you sure you want to update the student(s) year ?
        </div>
        <div className="mt-4 text-center">
          <button
            className="cancel-subscription-button"
            style={{
              backgroundColor:
                props.action_type === 'activate' ? '#01C5D1' : '#FF3399',
            }}
            onClick={() => {
              props.handleAction()
            }}
          >
            {props.nextYearLoading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              'YES'
            )}
          </button>
        </div>
        <div className="mt-2 mb-5 text-center fw-bold">
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
