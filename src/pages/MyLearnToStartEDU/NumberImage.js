import React from 'react'

const NumberImage = (props) => {
  return (
    <>
      {props.image ? (
        <img
          src={props.image}
          style={{
            width: props.width ?? 90,
            height: props.height ?? 90
          }}
          alt={'number'}
        />
      ) : null}
    </>
  )
}

export default NumberImage
