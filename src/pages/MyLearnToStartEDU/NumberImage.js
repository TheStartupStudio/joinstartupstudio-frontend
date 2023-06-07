import React from 'react'

const NumberImage = (props) => {
  return (
    <img
      src={props.image}
      style={{
        width: 80,
        height: 80,
      }}
      alt={'number'}
    />
  )
}

export default NumberImage
