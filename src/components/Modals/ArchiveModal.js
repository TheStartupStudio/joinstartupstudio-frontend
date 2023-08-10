import React from 'react'
import { Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const ArchiveModal = (props) => {
  const archiveModalTitle = () => {
    if (props.title === 'meetingTeam') {
      return 'meeting'
    } else if (props.title === 'feedback') {
      return 'feedback'
    } else if (props.title === 'mentorMeeting') {
      return 'meeting'
    }
  }

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
            className={'d-flex justify-content-center align-items-center'}
            style={{
              color: '#F2359D',
              fontWeight: 600,
              width: '100%',
              fontSize: 18
            }}
          >
            <div style={{ width: '100%' }}>
              Do you want to save you current {archiveModalTitle()} to the
              archive?
            </div>
          </div>
          <div
            className={
              'd-flex flex-column justify-content-center align-items-center'
            }
            style={{ marginTop: 14 }}
          >
            <button
              style={{
                backgroundColor: '#51c7df',
                color: '#fff',
                fontSize: 14,
                border: 0,
                width: '50%',
                padding: 6,
                textTransform: 'uppercase'
              }}
              onClick={() => props.saveChanged()}
            >
              Yes, Save it
            </button>
            <button
              style={{
                marginTop: 4,
                color: '#dfdfdf',
                fontSize: 14,
                border: 0,
                backgroundColor: 'inherit',
                width: '50%',
                padding: 6,
                textTransform: 'uppercase'
              }}
              onClick={() => props.saveUnChanged()}
            >
              No, Delete it
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default ArchiveModal
