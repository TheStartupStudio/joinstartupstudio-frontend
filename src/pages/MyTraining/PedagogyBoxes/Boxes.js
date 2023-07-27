import React from 'react'
import Box from './Box'

const Boxes = (props) => {
  return (
    <div
      style={{
        font: 'normal normal 500 10.2px/17px Montserrat',
        letterSpacing: 0.18,
        color: '#333D3D',
        // gridTemplateColumns: 'repeat(4,1fr)',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px 0',
        marginBottom: '20px'
      }}
    >
      <>
        {props.boxes?.map((box, index) => (
          <Box
            key={index}
            index={index}
            selectedPedagogyIndex={props.selectedPedagogyIndex}
            box={box}
            selectedBox={(box) => props.selectPedagogy(box, index)}
          />
        ))}
      </>
    </div>
  )
}

export default Boxes
