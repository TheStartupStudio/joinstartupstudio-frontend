import React from 'react'
import LtsContainerWrapper from '../../../ui/LtsContainerWrapper'
import MyImmersion from '../../../components/admin/MyImmersion'
import './style.css'

const MySchoolContainer = () => {
  return (
    <LtsContainerWrapper
      title={'MANAGE IMMERSION EXPERIENCES'}
      titleDescription={
        'View immersion experience details and add new experiences'
      }
    >
      <MyImmersion />
    </LtsContainerWrapper>
  )
}

export default MySchoolContainer
