import StepOne from '../../../assets/images/step-1.PNG'
import StepTwo from '../../../assets/images/step-2.PNG'
import StepThree from '../../../assets/images/step-3.PNG'
import StepFour from '../../../assets/images/step-4.PNG'
import React from 'react'

const Step = (props) => {
  let imageSource = ''

  switch (props.index) {
    case 0:
      imageSource = StepOne
      break
    case 1:
      imageSource = StepTwo
      break
    case 2:
      imageSource = StepThree
      break
    case 3:
      imageSource = StepFour
      break
    default:
      imageSource = ''
      break
  }

  const filterImage = () => {
    if (
      props.selectedStepIndex === null ||
      typeof props.selectedStepIndex === 'undefined'
    ) {
      return 'grayscale(0%)'
    } else {
      if (props.selectedStepIndex === props.index) {
        return 'grayscale(0%)'
      } else {
        return 'grayscale(100%)'
      }
    }
  }

  return (
    <>
      <img
        src={imageSource}
        style={{
          width: 70,
          height: 70,
          objectFit: 'contain',
          filter: filterImage(),
          cursor: 'pointer'
        }}
        onClick={() => props.selectedStep(props.step)}
        alt={`${imageSource}`}
      />
    </>
  )
}

export default Step
