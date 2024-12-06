import React from 'react'
import { CustomGradientButton, InfoBox } from '../ContentItems'
import { ItemProfileDetails } from '.'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import tickIcon from '../../../../assets/images/myschool-tick.svg'

const CoursesAndCredentials = () => {
  return (
    <InfoBox style={{ minHeight: '162px' }}>
      <ItemProfileDetails
        img={tickIcon}
        title={'Courses & Credentials '}
        className={'recentact-img'}
      />
      <div className='d-flex gradientbtns-cont' style={{ width: '100%' }}>
        <CustomGradientButton className={'me-2'}>
          <a href='#' className='immrs-opps immrs-opp-1'>
            View Available Courses & Credentials
          </a>
        </CustomGradientButton>
        <CustomGradientButton className={'me-2'}>
          <a href='#' className='immrs-opps immrs-opp-2'>
            Add Courses & Credentials
            <span style={{ fontSize: '20px ', marginLeft: '-5px' }}>+</span>
          </a>
          {/* <FontAwesomeIcon icon={faPlus} className='me-2' /> */}
        </CustomGradientButton>
      </div>
    </InfoBox>
  )
}

export default CoursesAndCredentials
