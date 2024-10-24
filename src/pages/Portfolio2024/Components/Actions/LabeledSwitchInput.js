import React from 'react'
import SwitchIcon from './SwitchIcon'

function LabeledSwitchInput(props) {
  const {
    label,
    id,
    value,
    onChange,
    name,
    labelDirection,
    isToggling,
    styles
  } = props

  const labelPositionClass = `label-${labelDirection}`
  return (
    <div
      className={`labeled-switch-container ${labelPositionClass}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <label className={'show-section switch-label'} htmlFor={id}>
        {label}
      </label>

      <SwitchIcon
        id={id}
        isChecked={value}
        onToggle={(e) => {
          onChange(!e.target.checked)
        }}
        icon={'eye-icon-show'}
        name={name}
        isToggling={isToggling}
      />
    </div>
  )
}

export default LabeledSwitchInput

//
//
//
// import React from 'react'
// import SwitchIcon from './SwitchIcon'
//
// function LabeledSwitchInput(props) {
//   // props.labelDirection
//   return (
//     <>
//       <label className={'show-section'} htmlFor={props.id}>
//         {props.label}
//       </label>
//
//       <SwitchIcon
//         id={props.id}
//         isChecked={props.value}
//         onToggle={(e) => {
//           props.onChange(!e.target.checked)
//         }}
//         icon={'eye-icon-show'}
//         name={props.name}
//       />
//     </>
//   )
// }
//
// export default LabeledSwitchInput
