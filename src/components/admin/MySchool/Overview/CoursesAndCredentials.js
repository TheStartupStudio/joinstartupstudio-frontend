import React from 'react'
import { CustomGradientButton, InfoBox } from '../ContentItems'
import { ItemProfileDetails } from '.'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const CoursesAndCredentials = () => {
  return (
    <InfoBox style={{ minHeight: '162px' }}>
      <ItemProfileDetails img={''} title={'Courses & Credentials'} />
      <div className='d-flex'>
        <CustomGradientButton className={'me-2'}>
          <a href='#'>View Available Courses & Credentials</a>
        </CustomGradientButton>
        <CustomGradientButton className={'me-2'}>
          <a href='#'>Add Courses & Credentials</a>
          <FontAwesomeIcon icon={faPlus} className='me-2' />
        </CustomGradientButton>
      </div>
    </InfoBox>
  )
}

export default CoursesAndCredentials
