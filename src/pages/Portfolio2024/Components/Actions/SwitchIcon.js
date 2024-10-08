import React from 'react'
import '../../index.css'

const SwitchIcon = (props) => {
  // console.log('value', props.id, props.isChecked)

  return (
    <div className='custom-switch-container'>
      <input
        type='checkbox'
        id={props.id}
        className='custom-switch-checkbox'
        checked={props.isChecked}
        onChange={props.onToggle}
        // disabled={props.isToggling}
      />

      <label htmlFor={props.id} className={props.icon}>
        <span className='custom-switch-icon'></span>
      </label>
    </div>
  )
}

export default SwitchIcon
