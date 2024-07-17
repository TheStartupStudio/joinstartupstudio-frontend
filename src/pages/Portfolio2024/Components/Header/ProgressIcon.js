import React, { useState } from 'react'

const ProgressIcon = (props) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className={'d-flex align-items-center flex-column position-relative'}>
      <div
        className={'nav-icon-box'}
        onClick={() => {
          if (!props.disabled) {
            props.activateSection()
          } else {
            return null
          }
        }}
      >
        <img
          src={
            isHovered || props.activeSection
              ? props.icons.coloredIcon
              : props.icons.grayIcon
          }
          className={'nav-icon'}
          alt={'nav-icon'}
          onMouseEnter={() => {
            setIsHovered(true)
          }}
          onMouseLeave={() => {
            setIsHovered(false)
          }}
        />
      </div>
      <div className={'nav-icon-title'}>{props.title}</div>
    </div>
  )
}
export default ProgressIcon
