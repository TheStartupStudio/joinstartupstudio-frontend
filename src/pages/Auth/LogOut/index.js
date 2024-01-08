import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { userLogout } from '../../../redux'

export default function Logout() {
  const dispatch = useDispatch()

  useEffect(function () {
    dispatch(userLogout())
  })

  return <Redirect to="/" />
}
