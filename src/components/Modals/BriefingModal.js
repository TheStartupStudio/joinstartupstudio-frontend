import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import 'react-quill/dist/quill.snow.css'
import { useDispatch, useSelector } from 'react-redux'
import './BriefingModal.css'

const BriefingModal = (props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    // dispatch(getPeriodsStart())
  }, [])

  const ContentItem = () => {
    return (
      <div>
        <span className={'content-item-title'}>Title:</span>
        <span className={'content-item-description'}>Description</span>
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
        id="subscription-modal"
        className="briefing-modal"
      >
        <Modal.Header>
          <Modal.Title>Briefing</Modal.Title>
          <button
            type="button"
            className="btn-close mb-1 close-briefing-modal"
            aria-label="Close"
            // onClick={props.onHide}
          />
        </Modal.Header>
        <Modal.Body className={'briefing-modal-body'}>
          <ContentItem />
          <ContentItem />
          <ContentItem />
        </Modal.Body>
      </Modal>
    </>
  )
}
export default BriefingModal
