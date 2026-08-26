import React from 'react'
import CircleIcon from '../../assets/images/academy-icons/academy-logo.png'

function WalkthroughPoster({ step }) {
  if (!step) return null

  return (
    <div className='its-poster' aria-hidden='true'>
      <div className='its-poster__hex-wrap'>
        <svg
          className='its-poster__hex'
          viewBox='0 0 200 174'
          fill='none'
          aria-hidden='true'
        >
          <path
            d='M50 1 L150 1 L199 87 L150 173 L50 173 L1 87 Z'
            stroke='#52C7D3'
            strokeWidth='2'
          />
        </svg>
        <span className='its-poster__num'>{step.id}</span>
      </div>
      <div className='its-poster__copy'>
        <div
          className={`its-poster__title${
            step.posterTitleSize === 'compact' ? ' its-poster__title--compact' : ''
          }`}
        >
          {step.title}
        </div>
        <div className='its-poster__duration'>{step.duration}</div>
      </div>
      <img
        className='its-poster__logo'
        src={CircleIcon}
        alt=''
      />
    </div>
  )
}

export default WalkthroughPoster
