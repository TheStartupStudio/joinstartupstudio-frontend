import React from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'

const NotSavedModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      style={{ marginTop: '15%' }}
    >
      <Modal.Body>
        <div className='save-modal mt-5'>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            style={{
              color: '#F2359D',
              marginRight: '10px',
              fontSize: '25px'
            }}
          />
          <IntlMessages id='my_notes.leave_without_saving' />
        </div>
        <div className='mt-4 text-center'>
          <button
            className='save-modal-button'
            style={{ backgroundColor: '#01C5D1', color: '#FFFFFF' }}
            onClick={props.onHide}
          >
            <IntlMessages id='my_notes.go_back' />
          </button>
        </div>
        <div className='mt-2 mb-5 text-center'>
          <button
            className='save-modal-button'
            style={{
              backgroundColor: '#FFF',
              color: '#01C5D1',
              textTransform: 'none'
            }}
            onClick={props.continue}
          >
            <IntlMessages id='my_notes.leave_anyway' />
          </button>
        </div>
      </Modal.Body>
    </Modal>
  )
}
export default NotSavedModal
