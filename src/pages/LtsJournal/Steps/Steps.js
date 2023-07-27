import React from 'react'
import Step from './Step'

const Steps = (props) => {
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
      {/*{!loading && journal?.hasInstructorDebrief && (*/}
      <>
        {props.steps?.map((step, index) => (
          <div>
            <Step
              key={index}
              index={index}
              selectedStepIndex={props.selectedStepIndex}
              step={step}
              selectedStep={(step) => props.selectStep(step, index)}
            />
            {step?.title && (
              <div style={{ textAlign: 'center' }}>{step?.title}</div>
            )}
          </div>
        ))}
      </>
      {/*)}*/}
    </div>
  )
}

export default Steps
