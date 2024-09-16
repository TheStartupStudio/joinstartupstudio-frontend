import React, { useEffect, useState } from 'react'
import LtsContainerWrapper from '../../../ui/LtsContainerWrapper'
import MyGuestSpeakers from '../../../components/admin/MyGuestSpeakers'
import axiosInstance from '../../../utils/AxiosInstance'

const MyGuestSpeakersContainer = () => {
  const [programs, setPrograms] = useState([])
  const [levels, setLevels] = useState([])

  useEffect(() => {
    const fetchPrograms = async () => {
      await axiosInstance.get('/programs').then(({ data }) => setPrograms(data))
    }
    fetchPrograms()
  }, [])

  useEffect(() => {
    const fetchLevels = async () => {
      await axiosInstance.get('/levels').then(({ data }) => setLevels(data))
    }
    fetchLevels()
  }, [])

  return (
    <LtsContainerWrapper
      title={'MANAGE ARCHIVED APPLICATIONS'}
      titleDescription={'View and take actions on received applications'}
    >
      <MyGuestSpeakers programs={programs} levels={levels} />
    </LtsContainerWrapper>
  )
}

export default MyGuestSpeakersContainer
