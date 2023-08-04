import React from 'react'

const BoxContent = (props) => {
  return (
    <>
      {props.selectedPedagogy != null && (
        <div
          style={{
            fontFamily: 'Montserrat',
            backgroundColor: '#fff'
          }}
          dangerouslySetInnerHTML={{
            __html: props.selectedPedagogy?.content
          }}
        />
      )}
    </>
  )
}

export default BoxContent
