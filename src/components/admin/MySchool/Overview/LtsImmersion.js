import React from 'react'
import { CustomDropdown, CustomGradientButton, InfoBox } from '../ContentItems'
import { Col } from 'react-bootstrap'

const options = [
  { name: 'Step 1: Industry Problem' },
  { name: 'Step 2: Immersion Experience' },
  { name: 'Step 3: Internship' },
  { name: 'Step 4: Entry-Level Employment' }
]

const LtsImmersion = () => {
  return (
    <InfoBox cn={'d-flex align-items-center justify-content-between'}>
      <Col md='4'>
        <h1 className='p-0 m-0'>LTS IMMERSION</h1>
      </Col>
      <Col md='8' className='d-flex justify-content-end'>
        <CustomGradientButton className={'me-2'}>
          <a href='#'>View immersion Opportunities</a>
        </CustomGradientButton>
        <CustomDropdown options={options} width='250px' />
      </Col>
    </InfoBox>
  )
}

export default LtsImmersion
