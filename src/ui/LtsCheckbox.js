import React from 'react'

const LtsCheckbox = ({ checked, toggle, className, name }) => {
  return (
    <label className={`form-switch ${className}`}>
      <input type='checkbox' checked={checked} name={name} onChange={toggle} />
      <i className='ms-auto'></i>
    </label>
  )
}

export default LtsCheckbox
