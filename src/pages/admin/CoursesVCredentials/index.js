import React from 'react'
import LtsContainerWrapper from '../../../ui/LtsContainerWrapper'
import './style.css'
import CoursesVCredentials from '../../../components/admin/CoursesVCredentials'

const CourseVCredentialsContainer = () => {
  return (
    <LtsContainerWrapper
      title={'MANAGE COURSES & CREDENTIALS'}
      titleDescription={
        'View school details, instructors, students and reports'
      }
    >
      <CoursesVCredentials />
    </LtsContainerWrapper>
  )
}

export default CourseVCredentialsContainer
