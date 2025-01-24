import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { userLogout } from '../../../redux'
import axiosInstance from '../../../utils/AxiosInstance'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

export default function Logout() {
  const history = useHistory()

  const dispatch = useDispatch()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axiosInstance.put('/myPerformanceData/updateActivity/endTime', {
          isActive: false
        })
      } catch (error) {
        console.error('Error updating activity:', error)
      } finally {
        dispatch(userLogout())
        history.push('/')
      }
    }

    performLogout()
  }, [dispatch, history])
  return <Redirect to='/' />
}
