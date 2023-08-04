import React, { useEffect, useRef, useState } from 'react'
import './BreakdownTextAccordion.css'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axiosInstance from '../../utils/AxiosInstance'
import BreakdownCustomContent from './BreakdownCustomContent'
const BreakdownTextAccordion = (props) => {
  return (
    <>
      <div className={`accordion ${props.isOpen ? 'expanded' : ''}`}>
        <div className="accordion-header" onClick={props.toggleAccordion}>
          <div className="accordion-header-title">{props?.title}</div>
          <span className={`accordion-icon ${props.isOpen ? 'expanded' : ''}`}>
            {props.isOpen ? (
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
        {props.isOpen && props.breakdown.type === 'type-1' && (
          <div
            className="accordion-content"
            style={{ padding: '30px 55px !important' }}
            dangerouslySetInnerHTML={{ __html: props.content }}
          />
        )}
        {props.isOpen && props.breakdown.type === 'type-3' && (
          <BreakdownCustomContent
            customContent={props.breakdown?.customContent}
          />
        )}
      </div>
    </>
  )
}

export default BreakdownTextAccordion
