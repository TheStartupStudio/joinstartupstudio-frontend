import React from 'react'

function LtsButton(props) {
  return (
    <div className={`d-flex justify-content-${props.align ?? 'center'} w-100`}>
      <div
        style={{
          backgroundColor: props.backgroundColor ?? '#51c7df',
          color: props.color ?? '#fff',
          fontSize: props.fontSize ?? 14,
          width: props.width ?? '100%',
          fontWeight: 500
        }}
        onClick={null}
        className="px-4 py-2 border-0 color transform text-uppercase  text-center"
      >
        {props.name.toUpperCase() ?? 'Lts Button'}
      </div>
    </div>
  )
}

export default LtsButton
