import React from 'react'

function LtsButton(props) {
  let buttonStyle
  switch (props.variant) {
    case 'text':
      buttonStyle = {
        font: 'normal normal 500 16px/22px Montserrat',
        letterSpacing: 0,
        color: '#707070',
        textTransform: 'uppercase',
        padding: 0,
        cursor: 'pointer'
      }
      break
    default:
      buttonStyle = {
        backgroundColor: props.backgroundColor ?? '#51c7df',
        color: props.color ?? '#fff',
        fontSize: props.fontSize ?? 14,
        width: props.width ?? '100%',
        fontWeight: 500,
        cursor: 'pointer',
        border: props.border ?? 'none',
        borderRadius: props.borderRadius ?? 'initial',
        order: props.order,
        ...props.padding,
        ...props.additionalStyle
      }
  }

  return (
    <div className={`d-flex justify-content-${props.align ?? 'center'} w-100 `}>
      <div
        aria-expanded={props.ariaExpanded}
        style={{ ...buttonStyle }}
        onClick={props.onClick ?? null}
        className={`${props.padding ? '' : 'px-4 py-2'}
        ${props.className}
        color transform text-uppercase d-flex justify-content-center text-center align-items-center`}
      >
        {props.name?.toUpperCase() ?? 'Lts Button'}
      </div>
    </div>
  )
}

export default LtsButton
