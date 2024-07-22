import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import Header from './Header'
import './index.css'
import JournalsBody from './JournalsBody'
import { useDispatch } from 'react-redux'
import { setBackButton } from '../../redux/backButtonReducer'

const StudentJournals = (props) => {
  const dispatch = useDispatch()
  const [fetchingUserData, setFetchingUserData] = useState(true)
  const [data, setData] = useState()

  useEffect(() => {
    dispatch(setBackButton(true, 'my-students'))

    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch])

  return (
    <JournalsBody
      data={data?.data?.journals}
      user={data}
      {...props}
      setFetchingUserData={setFetchingUserData}
    />
  )
}

export default StudentJournals
