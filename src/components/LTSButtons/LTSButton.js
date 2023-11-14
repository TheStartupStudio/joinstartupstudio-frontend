import React from 'react'

function LtsButton(props) {
  return (
    <div className={`d-flex justify-content-${props.align ?? 'center'} w-100 `}>
      <div
        style={{
          backgroundColor: props.backgroundColor ?? '#51c7df',
          color: props.color ?? '#fff',
          fontSize: props.fontSize ?? 14,
          width: props.width ?? '100%',
          fontWeight: 500,
          cursor: 'pointer'
        }}
        onClick={props.onClick ?? null}
        className={`px-4 py-2 border-0 color transform text-uppercase d-flex justify-content-center text-center align-items-center`}
      >
        {props.name?.toUpperCase() ?? 'Lts Button'}
      </div>
    </div>
  )
}

export default LtsButton
