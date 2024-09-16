import React from 'react'

function SocialMediaInput(props) {
  return (
    <div
      className={
        'd-flex align-items-center gap-2 w-100 mb-1 social-media-input-container'
      }
    >
      {props.icon}
      <input
        value={props.value}
        onChange={(e) => props.onChange?.(e.target.value)}
        style={{ width: '100%' }}
        className={'social-media-input'}
      />
    </div>
  )
}

export default SocialMediaInput
