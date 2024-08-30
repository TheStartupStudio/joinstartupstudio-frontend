import React, { useState } from 'react'
import './style.css'
import Stepper from './Stepper'
import PersonalInfoForm from './PersonalInfoForm'
import PaymentForm from './PaymentForm'
import SuccessMessage from './SuccessMessage'
import { Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

const SignupAcademy = () => {
  const history = useHistory()
  const [currentStep, setCurrentStep] = useState(1)
  const [signupData, setSignupData] = useState(null)

  const nextStep = (data) => {
    if (currentStep === 1 && !isPersonalInfoValid()) return
    if (data) {
      setSignupData(data)
    }
    setCurrentStep((prevStep) => Math.min(prevStep + 1, 3))
  }

  const prevStep = () => setCurrentStep((prevStep) => Math.max(prevStep - 1, 1))

  const isPersonalInfoValid = () => {
    return true
  }

  const cancelHandler = () => {
    history.push('/')
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 1:
        return (
          <PersonalInfoForm
            onContinue={nextStep}
            cancelHandler={cancelHandler}
          />
        )
      case 2:
        return (
          <PaymentForm
            onContinue={nextStep}
            onBack={prevStep}
            cancelHandler={cancelHandler}
            signupData={signupData}
          />
        )
      case 3:
        return <SuccessMessage />
      default:
        return null
    }
  }

  return (
    <div
      className='container-fluid md-px-5 ps-md-5 p-5'
      style={{
        backgroundColor: '#e4e9f4',
        minHeight: 'calc(100vh - 37px)'
      }}
    >
      <div className='signup-academy__container'>
        <Row className='justify-content-center'>
          <div style={{ width: '25%', justifyContent: 'center' }}>
            <Stepper currentStep={currentStep} />
          </div>
        </Row>

        <div className='form-step form-step-active'>
          {renderStepContent(currentStep)}
        </div>
      </div>
    </div>
  )
}

export default SignupAcademy
