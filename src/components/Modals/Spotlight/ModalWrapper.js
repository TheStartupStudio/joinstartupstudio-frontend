import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import 'react-quill/dist/quill.snow.css'
import { useDispatch, useSelector } from 'react-redux'
import '../BriefingModal.css'
import './SpotlightModal.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { FaPencilAlt, FaCheck, FaEye } from 'react-icons/fa'

const ModalWrapper = (props) => {
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop='static'
        keyboard={false}
        id='general-modal-wrapper'
        className={`general-modal-wrapper ${
          props.classes ? props.classes : ''
        }`}

        // className={props.class ? props.class : 'general-modal-wrapper'}
      >
        {props.showHeader ?? (
          <Modal.Header>
            <Modal.Title>{props.title}</Modal.Title>
            <button
              type='button'
              className='btn-close mb-1 close-general-modal'
              aria-label='Close'
              onClick={props.onHide}
            />
            <div
              className='portfolio-actions portf-act-spot-dnone'
              style={{ borderRadius: ' 0px 28px' }}
            >
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  width: '65px',
                  height: '65px'
                }}
                className='action-box cursor-pointer'
                onClick={() => props.onHide()}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
            </div>
          </Modal.Header>
        )}
        <Modal.Body className={'general-modal-body'}>
          {props.children}
        </Modal.Body>
      </Modal>
    </>
  )
}
export default ModalWrapper
