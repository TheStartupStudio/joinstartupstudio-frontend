import React, { useEffect, useState } from 'react'
// import imagePlaceholder from '../../../assets/images/image-placeholder.jpeg'
import imagePlaceholder from '../../../assets/images/videoimage.png'
import { useHistory } from 'react-router-dom'

function PortfolioSubmission(props) {
  const navigate = useHistory()

  const navigateTo = () => {
    if (props.videoUrl?.length > 0) {
      return props.videoUrl?.startsWith('http')
        ? props.videoUrl
        : `https://${props.videoUrl}`
    }
  }
  return (
    <div
      className={`${props.className} portfolio-submission-container ${
        props.videoUrl?.length > 0 ? 'cursor-pointer' : ''
      }`}
    >
      <a
        href={navigateTo()}
        style={{
          textDecoration: 'inherit',
          color: 'inherit',
          cursor: props.videoUrl?.length > 0 ? 'pointer' : 'unset'
        }}
        target='_blank'
        rel='noreferrer'
      >
        <img
          className={'portfolio-submission-image'}
          alt={'submission-image'}
          src={props.thumbnailUrl || imagePlaceholder}
        />

        <div className={'portfolio-submission-title'}>{props.title}</div>
      </a>
    </div>
  )
}

export default PortfolioSubmission
