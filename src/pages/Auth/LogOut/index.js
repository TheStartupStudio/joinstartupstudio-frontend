import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { userLogout } from '../../../redux'
// import { updateEndTime } from '../../../redux/user/Actions'
import axiosInstance from '../../../utils/AxiosInstance'

export default function Logout() {
  const dispatch = useDispatch()
  useEffect(function () {
    axiosInstance.patch(`/myPerformanceData/end`).then((res) => {
      if (res.data) {
        debugger
        dispatch(userLogout())
      }
    })
  })

  return <Redirect to="/" />
}
