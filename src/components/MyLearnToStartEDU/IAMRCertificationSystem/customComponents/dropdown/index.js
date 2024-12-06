import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import useOnClickOutside from 'use-onclickoutside'

function Dropdown({ title, children, expanded, toggle, className }) {
  const dropdownRef = useRef(null)

  useOnClickOutside(dropdownRef, () => {
    toggle(false)
  })

  return (
    <div
      className={`custom-dropdown-wrapper ${className ?? ''}`}
      ref={dropdownRef}
    >
      <div className='header' onClick={() => toggle((prev) => !prev)}>
        <p className='title'>{title}</p>
      </div>
      <div className={`dropdown-options ${expanded ? 'show' : ''}`}>
        {children}
      </div>
    </div>
  )
}

export default Dropdown
