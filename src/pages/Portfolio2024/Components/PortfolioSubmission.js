import React, { useEffect, useState } from 'react'
import imagePlaceholder from '../../../assets/images/image-placeholder.jpeg'
import { useHistory } from 'react-router-dom'

function PortfolioSubmission(props) {
  const navigate = useHistory()

  return (
    <div
      className={`portfolio-submission-container ${
        props.videoUrl?.length ? 'cursor-pointer' : ''
      }`}
      onClick={() => {
        if (props.videoUrl?.length) {
          navigate.push(props.videoUrl)
        } else {
          return null
        }
      }}
    >
      <img
        className={'portfolio-submission-image'}
        alt={'submission-image'}
        src={props.thumbnailUrl ?? imagePlaceholder}
      />

      <div className={'portfolio-submission-title'}>{props.title}</div>
    </div>
  )
}

export default PortfolioSubmission
