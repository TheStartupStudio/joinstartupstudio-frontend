import React from 'react'
import Boxes from './Boxes'
import BoxContent from './BoxContent'

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
      <span>{props?.task?.days}</span> <span>{props?.task?.title}</span>
    </div>
  )
}
const PedagogyBoxes = (props) => {
  return (
    <>
      {/*{props.containsTitle ?? <StepsTitle task={props.task} />}*/}

      <Boxes
        selectedStepIndex={props.selectedStepIndex}
        steps={props?.boxes}
        selectStep={(step, index) => props.selectStep(step, index)}
      />

      <BoxContent
        handleOpenPopup={() => props.handleOpenPopup()}
        selectedStep={props.selectedStep}
      />
    </>
  )
}

export default PedagogyBoxes
