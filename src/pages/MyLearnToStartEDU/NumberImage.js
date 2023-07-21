import React from 'react'

const NumberImage = (props) => {
  return (
    <img
      src={props.image}
      style={{
        width: 115,
        height: 115
      }}
      alt={'number'}
    />
  )
}

export default NumberImage
