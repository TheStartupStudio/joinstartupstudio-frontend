import React, {useEffect} from 'react'
import LtsContainerWrapper from '../../../ui/LtsContainerWrapper'
import MyImmersion from '../../../components/admin/MyImmersion'
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
