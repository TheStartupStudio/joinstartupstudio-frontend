import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

const TooltipAction = (props) => {
  return (
    <OverlayTrigger placement="bottom" overlay={props.tooltipContent}>
      <div
        className={'action-box cursor-pointer'}
        onClick={() => props.onClick?.()}
      >
        {props.icon}
      </div>
    </OverlayTrigger>
  )
}
export default TooltipAction
