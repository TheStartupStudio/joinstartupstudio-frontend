import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { userLogout } from '../../../redux'
import axiosInstance from '../../../utils/AxiosInstance'

export default function Logout() {
  const dispatch = useDispatch()

  useEffect(function () {
    axiosInstance
      .put('/myPerformanceData/updateActivity/endTime', {
        isActive: false
      })
      .then((response) => {})
      .catch((error) => {
        console.error('Error updating activity:', error)
      })
      .finally(() => {})
    dispatch(userLogout())
  })

  console.log('heree')

  return <Redirect to='/' />
}
