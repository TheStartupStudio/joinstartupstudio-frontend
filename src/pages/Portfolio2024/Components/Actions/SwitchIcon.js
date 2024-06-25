import React from 'react'
import '../../index.css'

const SwitchIcon = ({ id, isChecked, onToggle }) => (
  <div className="custom-switch-container">
    <input
      type="checkbox"
      id={id}
      className="custom-switch-checkbox"
      checked={isChecked}
      onChange={onToggle}
    />
    <label htmlFor={id} className="custom-switch-label">
      <span className="custom-switch-icon"></span>
    </label>
  </div>
)

export default SwitchIcon
