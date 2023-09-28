import React, { useState } from 'react'
import ModalWrapper from './ModalWrapper'

const SpotlightSimpleModal = (props) => {
  return (
    <ModalWrapper
      title={props.title}
      show={props.show}
      onHide={props.onHide}
      class={'spotlight-simple-modal'}
    >
      <div
        style={{
          font: 'normal normal 300 17px/20px Montserrat',
          letterSpacing: 0.68,
          color: '#707070'
        }}
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
    </ModalWrapper>
  )
}

export default SpotlightSimpleModal
