import React, { useEffect, useState } from 'react'
import imagePlaceholder from '../../../assets/images/image-placeholder.jpeg'
import { useHistory } from 'react-router-dom'

function PortfolioSubmission(props) {
  const navigate = useHistory()

  // console.log(props.thumbnailUrl)

  return (
    <div
      className={`portfolio-submission-container ${
        props.videoUrl?.length ? 'cursor-pointer' : ''
      }`}
    >
      <a
        href={
          props.videoUrl?.startsWith('http')
            ? props.videoUrl
            : `https://${props.videoUrl}`
        }
        style={{
          textDecoration: 'inherit',
          color: 'inherit',
          cursor: 'pointer'
        }}
        target="_blank"
      >
        <img
          className={'portfolio-submission-image'}
          alt={'submission-image'}
          src={props.thumbnailUrl ?? imagePlaceholder}
        />

        <div className={'portfolio-submission-title'}>{props.title}</div>
      </a>
    </div>
  )
}

export default PortfolioSubmission
