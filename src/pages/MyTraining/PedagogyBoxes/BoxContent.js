import React from 'react'

const BoxContent = (props) => {
  return (
    <>
      {props.selectedStep != null && (
        <div
          style={{
            fontFamily: 'Montserrat',
            backgroundColor: '#fff'
          }}
          dangerouslySetInnerHTML={{
            __html: props.selectedStep?.boxContent
          }}
        />
      )}
    </>
  )
}

export default BoxContent
