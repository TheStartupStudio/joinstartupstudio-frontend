import React from 'react'

const NumberImage = (props) => {
  return (
    <img
      src={props.image}
      style={{
        width: props.width ?? 115,
        height: props.height ?? 115
      }}
      alt={'number'}
    />
  )
}

export default NumberImage
