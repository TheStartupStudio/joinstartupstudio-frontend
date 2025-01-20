import React, {useEffect} from 'react'
import LtsContainerWrapper from '../../../ui/LtsContainerWrapper'
import MySchool from '../../../components/admin/MySchool'
import './style.css'
import { useDispatch } from 'react-redux'
import { changeSidebarState } from '../../../redux'

const MySchoolContainer = () => {
  const dispatch = useDispatch()
    
    useEffect(() => {
          dispatch(changeSidebarState(false))
    })
  return (
    <LtsContainerWrapper
      className={'school-lts-container'}
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
