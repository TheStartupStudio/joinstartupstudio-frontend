import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import 'react-quill/dist/quill.snow.css'
import { useDispatch, useSelector } from 'react-redux'
import '../BriefingModal.css'
import './SpotlightModal.css'

const ModalWrapper = (props) => {
  const ContentItem = (contentData) => {
    return (
      <div className={'content-item-container'}>
        <span className={'content-item-title'}>
          {contentData?.content?.title}:
        </span>
        <span className={'content-item-description'}>
          {contentData?.content?.description}
        </span>
      </div>
    )
  }

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop="static"
        keyboard={false}
        id="general-modal-wrapper"
        className={`general-modal-wrapper ${props.class ? props.class : ''}`}

        // className={props.class ? props.class : 'general-modal-wrapper'}
      >
        {/*<Modal.Header>*/}
        {/*  <Modal.Title>{props.title}</Modal.Title>*/}
        {/*  <button*/}
        {/*    type="button"*/}
        {/*    className="btn-close mb-1 close-general-modal"*/}
        {/*    aria-label="Close"*/}
        {/*    onClick={props.onHide}*/}
        {/*  />*/}
        {/*</Modal.Header>*/}
        {props.showHeader ?? (
          <Modal.Header>
            <Modal.Title>{props.title}</Modal.Title>
            <button
              type="button"
              className="btn-close mb-1 close-general-modal"
              aria-label="Close"
              onClick={props.onHide}
            />
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
