import React from 'react'
import SwitchIcon from './SwitchIcon'

function LabeledSwitchInput(props) {
  return (
    <>
      <label className={'show-section'} htmlFor={props.id}>
        {props.label}
      </label>

      <SwitchIcon
        id={props.id}
        isChecked={props.value}
        onToggle={(e) => {
          props.onChange(!e.target.checked)
        }}
        icon={'eye-icon-show'}
        name={props.name}
      />
    </>
  )
}

export default LabeledSwitchInput
