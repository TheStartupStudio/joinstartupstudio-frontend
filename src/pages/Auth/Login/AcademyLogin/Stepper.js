import React from 'react'
import './style.css'

const Stepper = ({ currentStep }) => {
  console.log('currentStep', currentStep)
  const steps = ['Info', 'Payment', 'Final']

  const calculateProgressWidth = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100 + '%'
  }

  return (
    <div className='progressbar'>
      <div
        className='progress '
        style={{ width: calculateProgressWidth() }}
        id='progress'
      ></div>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`progress-step ${
            currentStep > index ? 'progress-step-active' : ''
          }`}
          data-title={step}
        >
          {console.log('index', index)}
        </div>
      ))}
    </div>
  )
}

export default Stepper
