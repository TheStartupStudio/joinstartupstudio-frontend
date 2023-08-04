import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import 'react-quill/dist/quill.snow.css'
import { useDispatch, useSelector } from 'react-redux'
import './BreakdownPopup.css'

const BreakdownPopup = (props) => {
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop="static"
        keyboard={false}
        id="subscription-modal"
        className="breakdown_popup-modal"
      >
        <Modal.Header>
          <button
            type="button"
            className="btn-close mb-1 close-briefing-modal"
            aria-label="Close"
            onClick={props.onHide}
          />
        </Modal.Header>
        <Modal.Body
          className={'briefing-modal-body'}
          style={{ font: ' normal normal 400 20px/22px Montserrat' }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: props.popupContent
            }}
          />
          <div className={'d-flex justify-content-center mt-3'}>
            <button
              style={{
                backgroundColor: '#51c7df',
                color: '#fff',
                fontSize: 16,
                font: 'normal normal 600 18px/16px Montserrat',
                letterSpacing: '0.8px'
              }}
              className="px-5 py-3 border-0 color transform my-1"
              onClick={() => props.onHide()}
            >
              Got It!
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}
export default BreakdownPopup
