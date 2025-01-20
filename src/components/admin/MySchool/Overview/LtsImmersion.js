import React, { useState } from 'react'
import { CustomDropdown, CustomGradientButton, InfoBox } from '../ContentItems'
import { Col } from 'react-bootstrap'
import AddImmersionModal from '../../MyImmersion/AddImmersionModal'
import immersionLogo from '../../../../assets/images/LTS Immersion Mark.svg'

const LtsImmersion = () => {
  const [immersionStep, setImmersionStep] = useState()

  const handleCloseModal = () => {
    setImmersionStep(null) // Close the add immersion modal
  }
  return (
    <InfoBox
      cn={
        'lts-immrs-container d-flex align-items-center justify-content-between'
      }
      style={{
        flexWrap: 'wrap',
        height: '74px'
      }}
    >
      <Col
        md='4'
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <img
          src={immersionLogo}
          className='lizalizaliza'
          width={44.5}
          height={45}
        ></img>
        <h1 className='ltsimmrs-title-mysc p-0 m-0'>
          LTS IMMERSION
          <span
            style={{
              fontSize: '18px',
              position: 'relative',
              top: '-7px'
            }}
          >
            ™
          </span>
        </h1>
      </Col>
      <Col md='8' className='ltsimmrs-buttons d-flex justify-content-end'>
        <CustomGradientButton className={'me-2'}>
          <a href='/my-immersion-admin' className='immrs-opps'>
            View immersion Opportunities
          </a>
        </CustomGradientButton>
        <CustomDropdown
          btnClassName={'immrs-opps-cont'}
          spanClassName={'immrs-opps'}
          options={[
            {
              name: 'Step 1: Industry Problem',
              value: '1',
              icon: ''
            },
            // {
            //   name: 'Step 2:Immersion Experience',
            //   value: '2',
            //   icon: ''
            // }, // commented because it was asked to be removed
            {
              name: 'Step 3: Internship',
              value: '3',
              icon: ''
            },
            {
              name: 'Step 4: Entry-Level Employment',
              value: '4',
              icon: ''
            }
          ]}
          width='250px'
          // title={title}
          onClick={(newValue) => {
            setImmersionStep(newValue)
          }}
        />
      </Col>
      {immersionStep && (
        <AddImmersionModal
          onClose={handleCloseModal}
          immersionStep={immersionStep}
        />
      )}
    </InfoBox>
  )
}

export default LtsImmersion
