import React from 'react'
import Step from './Box'

const Boxes = (props) => {
  return (
    <div
      style={{
        font: 'normal normal 500 10.2px/17px Montserrat',
        letterSpacing: 0.18,
        color: '#333D3D',
        gridTemplateColumns: 'repeat(4,1fr)',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px 0',
        marginBottom: '20px'
      }}
    >
      <>
        {props.boxes?.map((box, index) => (
          <Step
            key={index}
            index={index}
            selectedStepIndex={props.selectedStepIndex}
            box={box}
            selectedBox={(box) => props.selectBox(box, index)}
          />
        ))}
      </>
    </div>
  )
}

export default Boxes
