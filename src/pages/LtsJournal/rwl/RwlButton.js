import React from 'react'

const RwlButton = (props) => {
  return (
    <div className="MY_MARKET_READY_GUIDE">
      <div
        className={` rwl-buttons ${props.isOpened ? 'expanded active' : ''}`}
      >
        <div className="" onClick={() => props.handleAccordionClick()}>
          <div className={'accordion-header-title'}>{props.title}</div>
        </div>
        {props.children}
      </div>
    </div>
  )
}

export default RwlButton
