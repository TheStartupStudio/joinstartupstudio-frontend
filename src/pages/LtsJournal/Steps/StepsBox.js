import React from 'react'
import Steps from './Steps'
import StepContent from './StepContent'

const StepsTitle = (props) => {
  return (
    <div
      style={{
        textAlign: 'center',
        fontSize: 11,
        textTransform: 'uppercase',
        fontWeight: 600
      }}
    >
      {/* <span>{props?.task?.days}</span> */}
      <span>{props?.task?.title}</span>
    </div>
  )
}
const StepsBox = (props) => {
  return (
    <>
      {props.containsTitle ?? <StepsTitle task={props.task} />}

      <Steps
        selectedStepIndex={props.selectedStepIndex}
        steps={props?.steps}
        selectStep={(step, index) => props.selectStep(step, index)}
      />

      <StepContent
        handleOpenPopup={() => props.handleOpenPopup()}
        selectedStep={props.selectedStep}
      />
    </>
  )
}

export default StepsBox
