import React, { useEffect, useState } from 'react'
import axiosInstance from '../../utils/AxiosInstance'
import Header from './Header'
import './index.css'
import JournalsBody from './JournalsBody'
const StudentJournals = (props) => {
  const [fetchingUserData, setFetchingUserData] = useState(true)
  const [data, setData] = useState()

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
