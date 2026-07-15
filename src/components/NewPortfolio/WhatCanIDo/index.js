import React, { useState } from 'react'
import './index.css'
import linkIcon from '../../../assets/images/link.svg'
import nothingAdded from '../../../assets/images/nothing-added.svg'

const WhatCanIDoCard = ({
  children,
  onEdit,
  title,
  evidence = {},
  index = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleLinkClick = (e) => {
    e.preventDefault()

    if (evidence?.linkInputValue) {
      let link = evidence.linkInputValue.trim()

      if (!/^https?:\/\//i.test(link)) {
        link = 'https://' + link
      }

      window.open(link, '_blank', 'noopener,noreferrer')
    }
  }

  const isEmpty =
    !evidence?.evidenceTitle && !evidence?.imageUrl && !evidence?.linkInputValue

  const getTextContent = (content) => {
    if (typeof content === 'string') {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      return tempDiv.textContent || tempDiv.innerText || ''
    }
    return ''
  }

  const childrenTextContent = getTextContent(children)
  const evidenceTitleTextContent = getTextContent(evidence?.evidenceTitle || '')

  const contentToCheck =
    evidenceTitleTextContent.length > childrenTextContent.length
      ? evidenceTitleTextContent
      : childrenTextContent

  const characterLimit = 50
  const shouldShowReadMore = contentToCheck.length > characterLimit

  return (
    <div className='what-can-i-do-card'>
      {isEmpty ? (
        <div
          className='d-flex flex-column justify-content-center align-items-center gap-2'
          style={{ height: '100%' }}
        >
          <img src={nothingAdded} alt='nothing-added' />
          <p
            className='text-uppercase text-medium nodata-portf-text'
            style={{ padding: '10px' }}
          >
            Nothing has been added yet. click the edit button to get started.
          </p>
        </div>
      ) : (
        <>
          <div className='mentor-image-container'>
            {evidence.imageUrl && (
              <img src={evidence.imageUrl} alt='evidence' />
            )}
            <div className='link-icon-center' onClick={handleLinkClick}>
              <img
                src={linkIcon}
                alt='link-icon'
                className={`${!evidence?.linkInputValue ? 'disabled-link' : ''}`}
                title={
                  evidence?.linkInputValue ? 'Open link' : 'No link available'
                }
              />
            </div>
          </div>

          <div className='card-content'>
            <p className='card-title'>
              <div
                style={{
                  display: isExpanded ? 'block' : '-webkit-box',
                  WebkitLineClamp: isExpanded ? 'none' : 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  fontWeight: '600',
                  textAlign: 'center'
                }}
              >
                {evidence?.evidenceTitle}
              </div>

              <span
                onClick={
                  shouldShowReadMore
                    ? () => setIsExpanded(!isExpanded)
                    : undefined
                }
                style={{
                  color: shouldShowReadMore ? '#52C7D3' : 'transparent',
                  cursor: shouldShowReadMore ? 'pointer' : 'default',
                  fontWeight: '500',
                  fontSize: '12px',
                  display: 'inline-block',
                  minHeight: '16px',
                  lineHeight: '16px',
                  width: '100%',
                  textAlign: 'left',
                  marginLeft: '5px'
                }}
              >
                {shouldShowReadMore
                  ? isExpanded
                    ? ' Read less'
                    : ' Read more'
                  : ' Read more'}
              </span>
            </p>
            {children && (
              <div className='card-description'>
                <div
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    lineHeight: '1.4'
                  }}
                  dangerouslySetInnerHTML={{ __html: children }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default WhatCanIDoCard
