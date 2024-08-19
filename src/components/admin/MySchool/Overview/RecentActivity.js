import React from 'react'
import { InfoBox } from '../ContentItems'
import { ItemProfileDetails } from '.'

const RecentActivity = () => {
  return (
    <InfoBox style={{ minHeight: '162px' }}>
      <ItemProfileDetails img={''} title={'Recent Activity'} />
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
