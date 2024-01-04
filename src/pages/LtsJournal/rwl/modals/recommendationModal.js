import React from 'react'
import { Modal } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import IntlMessages from '../../../../utils/IntlMessages'

const RecommendationModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop="static"
      keyboard={false}
      id="recommendation-modal"
    >
      <Modal.Header
        className="recommendation-modal-title my-auto p-0 mx-4"
        style={{ border: 'none' }}
      >
        <button
          type="button"
          className="btn-close me-1"
          aria-label="Close"
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body>
        <div className="recommendation-modal">
          <h3 className="">
            Return to recommendations <br /> when you completed the <br />{' '}
            resources you have selected.
          </h3>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default RecommendationModal
