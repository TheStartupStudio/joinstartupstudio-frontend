import React from 'react'

const LtsCheckbox = ({ checked, toggle }) => {
  return (
    <label className='form-switch '>
      <input
        type='checkbox'
        checked={checked}
        // checked
        onChange={toggle}
      />
      <i className='ms-auto'></i>
    </label>
  )
}

export default LtsCheckbox
