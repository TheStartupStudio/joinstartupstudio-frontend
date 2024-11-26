import React from 'react'
import { Modal } from 'react-bootstrap'
import 'react-quill/dist/quill.snow.css'
import './BriefingModal.css'

const extractTextWithBulletPoints = (htmlString) => {
  const tempElement = document.createElement('div')
  tempElement.innerHTML = htmlString

  const listItems = tempElement.querySelectorAll('li')
  let textContent = '<br />'

  listItems.forEach((item, index) => {
    textContent += `<p class='ms-4 my-1 py-1'> • ${item.textContent.trim()}<br/></p>`
  })

  return textContent.trim()
}

const ContentItem = ({ content }) => {
  const { title, description } = content

  const listItemTitles = ['synopsis', 'discussion points']
  const shouldRenderList = listItemTitles.includes(title.toLowerCase())

  return (
    <div className='content-item-container '>
      <span className='content-item-title'>{title}:</span>
      {shouldRenderList ? (
        <span
          className='content-item-description '
          dangerouslySetInnerHTML={{
            __html: extractTextWithBulletPoints(description)
          }}
        />
      ) : (
        <span className='content-item-description '>{description}</span>
      )}
    </div>
  )
}

const BriefingModal = (props) => {
  const { briefing } = props

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
      id='briefing-modal'
      className='briefing-modal briefing-modal-backg'
    >
      <Modal.Header>
        <Modal.Title>Briefing</Modal.Title>
        <button
          type='button'
          className='btn-close mb-1 close-briefing-modal'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body className='briefing-modal-body'>
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
            title: 'Link',
            description: briefing?.link
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

export default BriefingModal
