import React, { useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const VerifiedEmail = (props) => {
  const email = new URLSearchParams(props.location.search).get('email')
  const token = new URLSearchParams(props.location.search).get('token')
  const user = useSelector((state) => state.user.user)

  useEffect(() => {
    verifyUserEmail()
  }, [])
  const verifyUserEmail = async () => {
    const params = {
      email: email
    }
    await axios
      // .post(`${process.env.REACT_APP_LTS_API_URL}/users/verify`, params, {
      .post(`${process.env.REACT_APP_SERVER_BASE_URL}users/verify`, params, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) =>
        user
          ? (window.location.href = '/dashboard')
          : (window.location.href = '/logout')
      )
      .catch((err) => (window.location.href = '/logout'))
  }
  return <div></div>
}
export default VerifiedEmail
