import React from 'react'
import LtsContainerWrapper from '../../../ui/LtsContainerWrapper'
import MyGuestSpeakers from '../../../components/admin/MyGuestSpeakers'

const MyGuestSpeakersContainer = () => {
  return (
    <LtsContainerWrapper
      title={'MANAGE ARCHIVED APPLICATIONS'}
      titleDescription={'View and take actions on received applications'}
    >
      <MyGuestSpeakers />
    </LtsContainerWrapper>
  )
}

export default MyGuestSpeakersContainer
