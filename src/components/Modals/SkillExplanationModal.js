import React from 'react'
import { Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const SkillExplanationModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      id="archive-modal"
      className="archive-modal"
    >
      <Modal.Header className="connection-modal-header general-modal-header mx-4">
        <button
          type="button"
          className="btn-close me-3 mt-3"
          aria-label="Close"
          onClick={props.onHide}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <div className="mt-4 mb-5 blocked-user-modal px-md-3 text-center">
          <div
            className={
              'd-flex justify-content-center align-items-center flex-column'
            }
            style={{
              width: '100%',
              fontSize: 18,
              gap: 30,
              marginBottom: '4rem'
            }}
          >
            <div
              style={{
                color: '#51C7DF',
                font: 'normal normal 600 24px/24px Montserrat',
                letterSpacing: 1.2
              }}
            >
              {props.title}
            </div>
            <div
              style={{
                color: '#231F20',
                font: 'normal normal 400 24px/24px Montserrat',
                letterSpacing: 1.2
              }}
            >
              {props.content}
            </div>
          </div>
          <div
            style={{ marginTop: 14 }}
            className={
              'd-flex flex-column justify-content-center align-items-center'
            }
          >
            <button
              style={{
                backgroundColor: '#51c7df',
                color: '#fff',
                fontSize: 12,
                border: 0,
                width: '20%',
                padding: 10,
                textTransform: 'uppercase'
              }}
              onClick={() => props.onHide()}
            >
              GOT IT!
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default SkillExplanationModal
