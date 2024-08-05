import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

const AccordionItemWrapper = (props) => {
  return (
    <div
      className={`accordion accordion-border ${
        props.isOpened ? 'expanded' : ''
      }`}
    >
      <div
        className='accordion-header-box'
        onClick={() => props.handleAccordionClick()}
      >
        <div className={'accordion-header-title'}>{props.title}</div>
        <span className={`accordion-icon ${props.isOpened ? 'expanded' : ''}`}>
          {props.isExpanded ? (
            <FontAwesomeIcon
              icon={faAngleDown}
              color={'#838EAB'}
              className='me-2 me-md-0 arrow'
            />
          ) : (
            <FontAwesomeIcon
              icon={faAngleDown}
              color={'#838EAB'}
              className='me-2 me-md-0 arrow'
            />
          )}
        </span>
      </div>
      {props.children}
    </div>
  )
}

export default AccordionItemWrapper
