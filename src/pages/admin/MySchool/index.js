import React from 'react'
import LtsContainerWrapper from '../../../ui/LtsContainerWrapper'
import MySchool from '../../../components/admin/MySchool'
import './style.css'

const MySchoolContainer = () => {
  return (
    <LtsContainerWrapper
      title={'MANAGE MY SCHOOL'}
      titleDescription={
        'View school details, instructors, students and reports'
      }
    >
      <MySchool />
    </LtsContainerWrapper>
  )
}

export default MySchoolContainer
