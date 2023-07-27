import React from 'react'

const Box = (props) => {
  return (
    <>
      <div
        style={{
          width: 120,
          height: 70,
          objectFit: 'contain',
          // filter: filterImage(),
          cursor: 'pointer',
          border: '1px solid #e3e3e3'
        }}
        onClick={() => props.selectedBox(props.box)}
      >
        Title
      </div>
    </>
  )
}

export default Box
