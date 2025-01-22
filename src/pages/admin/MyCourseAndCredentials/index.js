import React from 'react'
import LtsContainerWrapper from '../../../ui/LtsContainerWrapper'
import MyCourseAndCredentials from '../../../components/admin/MyCourseAndCredentials'
import './style.css'

const MyCourseAndCredentialsContainer = () => {
  return (
    <LtsContainerWrapper
      title={'MANAGE COURSES AND CREDENTIALS'}
      titleDescription={
        'View Courses & Credentials details and add new courses/credentials.'
      }
    >
      <MyCourseAndCredentials />
    </LtsContainerWrapper>
  )
}

export default MyCourseAndCredentialsContainer
