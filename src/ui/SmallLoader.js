import React from 'react'

const SmallLoader = ({ height }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: height }}
    >
      <span className=" spinner-border-primary spinner-border-sm " />
    </div>
  )
}

export default SmallLoader
