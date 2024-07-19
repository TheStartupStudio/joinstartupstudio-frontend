import React from 'react'
import '../../index.css'

const SwitchIcon = (props) => {
  // const icon = `${isChecked ? offIcon : onIcon}`
  // console.log('icon', icon ?? 'custom-switch-label')
  return (
    <div className="custom-switch-container">
      {/*<div>{props.type}</div>*/}
      <input
        type="checkbox"
        id={props.id}
        className="custom-switch-checkbox"
        checked={props.isChecked}
        onChange={props.onToggle}
      />

      <label htmlFor={props.id} className={props.icon}>
        <span className="custom-switch-icon"></span>
      </label>
    </div>
  )
}

export default SwitchIcon
