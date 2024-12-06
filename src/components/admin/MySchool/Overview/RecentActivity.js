import React from 'react'
import { InfoBox } from '../ContentItems'
import { ItemProfileDetails } from '.'
import clockIcon from '../../../../assets/images/myschool-clock.svg'

const RecentActivity = () => {
  return (
    <InfoBox style={{ minHeight: '162px' }}>
      <ItemProfileDetails
        className={'recentact-img'}
        img={clockIcon}
        title={'Recent Activity'}
      />

      <div>
        <label className=' m-0'>06/21/24 New instructor added</label>
      </div>
      <div>
        <label className=' m-0'>05/03/24 New course/credential added</label>
      </div>
    </InfoBox>
  )
}

export default RecentActivity
