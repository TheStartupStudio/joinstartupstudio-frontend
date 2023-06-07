import React, { useState } from 'react'
import './BreakdownTextAccordion.css'
import {
  faAngleDown,
  faAngleUp,
  faArrowDown,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BreakdownTextAccordion = (props) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={toggleAccordion}>
        <div className={'accordion-header-title'}>{props?.title}</div>
        <span className={`accordion-icon ${isExpanded ? 'expanded' : ''}`}>
          {isExpanded ? (
            <FontAwesomeIcon
              icon={faAngleDown}
              className="me-2 me-md-0 arrow"
            />
          ) : (
            <FontAwesomeIcon
              icon={faAngleDown}
              className="me-2 me-md-0 arrow"
            />
          )}
        </span>
      </div>
      {isExpanded && (
        <div
          className="accordion-content"
          dangerouslySetInnerHTML={{ __html: props.content }}
        />
      )}
    </div>
  )
}

export default BreakdownTextAccordion
