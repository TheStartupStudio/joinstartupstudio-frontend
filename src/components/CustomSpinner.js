import React from 'react'

function CustomSpinner({ color = 'info' }) {
  return (
    <div
      className='d-flex justify-content-center align-items-center'
      style={{ height: '30px' }}
    >
      <div
        className={`${
          color
            ? `spinner-border-${color} spinner-border-sm-${color}`
            : 'spinner-border spinner-border-sm'
        }`}
        role='status'
      >
        <span class='sr-only'>Loading...</span>
      </div>
    </div>
  )
}

export default CustomSpinner
