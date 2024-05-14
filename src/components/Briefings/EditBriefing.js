import React from 'react'
import { Modal } from 'react-bootstrap'

const processText = (text) => {
  const lines = text.split('\n').map((line) => line.trim())
  const validLines = lines.filter((line) => line.length > 0)

  return validLines.map((line) => {
    const match = line.match(/^\d+\.\s*(.*)$/)
    return match ? match[1] : line
  })
}

const ContentItem = ({ content }) => {
  const { title, description } = content

  const listItemTitles = ['synopsis', 'discussion points']
  const shouldRenderList = listItemTitles.includes(title.toLowerCase())

  return (
    <div className="content-item-container">
      <span className="content-item-title">{title}:</span>
      {shouldRenderList ? (
        <ul className="content-item-description">
          {processText(description).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <span className="content-item-description">{description}</span>
      )}
    </div>
  )
}

const EditBriefing = (props) => {
  const { briefing } = props

  return (
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
      <Modal.Body className="briefing-modal-body">
        <ContentItem
          content={{
            title: 'Date',
            description: new Date(briefing?.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })
          }}
        />
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
  )
}

export default EditBriefing
