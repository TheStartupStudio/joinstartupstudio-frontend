import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import 'react-quill/dist/quill.snow.css'
import { useDispatch, useSelector } from 'react-redux'
import './BriefingModal.css'
import { getBriefingsStart } from '../../redux/header/Actions'

const BriefingModal = (props) => {
  const dispatch = useDispatch()

  const briefings = useSelector((state) => state?.header?.briefings)
  useEffect(() => {
    dispatch(getBriefingsStart())
  }, [])

  const briefing = briefings[0]

  useEffect(() => {
    // dispatch(getPeriodsStart())
  }, [])

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
        id="briefing-modal"
        className="briefing-modal"
      >
        <Modal.Header>
          <Modal.Title>Briefing</Modal.Title>
          <button
            type="button"
            className="btn-close mb-1 close-briefing-modal"
            aria-label="Close"
            onClick={props.onHide}
          />
        </Modal.Header>
        <Modal.Body className={'briefing-modal-body'}>
          {
            <ContentItem
              content={{
                title: 'Date',
                description: new Date(briefing?.date).toLocaleDateString(
                  'en-US',
                  { month: 'long', day: 'numeric', year: 'numeric' }
                )
                // description: 'January 1, 2023',
              }}
            />
          }
          <ContentItem
            content={{
              title: 'Source',
              description: briefing?.source
            }}
          />
          <ContentItem
            content={{
              title: 'Title',
              description: briefing?.title
            }}
          />
          <ContentItem
            content={{
              title: 'Synopsis',
              description: briefing?.synopsis
            }}
          />
          <ContentItem
            content={{
              title: 'Discussion Question',
              description: briefing?.discussionQuestion
            }}
          />
          <ContentItem
            content={{
              title: 'Discussion Points',
              description: briefing?.discussionPoints
            }}
          />
        </Modal.Body>
      </Modal>
    </>
  )
}
export default BriefingModal
