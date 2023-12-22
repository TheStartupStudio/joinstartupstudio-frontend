import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { userLogout } from '../../../redux'
import axiosInstance from '../../../utils/AxiosInstance'
import { updateUserActivity } from '../../../redux/user/Actions'

export default function Logout() {
  // debugger
  const dispatch = useDispatch()

  useEffect(function () {
    dispatch(userLogout())
    // debugger
    // axiosInstance
    //   .put(`/myPerformanceData/updateActivity`, {
    //     loginTime: new Date(),
    //     logoutTime: new Date(),
    //     activeMinutes: null
    //   })
    //   .then(({ data }) => {
    //     // debugger
    //     console.log(data)
    //     if (data) {
    //       debugger
    //       dispatch(updateUserActivity(data))
    //       // dispatch(userLogout())
    //     }
    //   })
    // axiosInstance.patch(`/myPerformanceData/end`).then((res) => {
    //   if (res.data) {
    //     dispatch(userLogout())
    //   }
    // })
  })

  return <Redirect to="/" />
}
