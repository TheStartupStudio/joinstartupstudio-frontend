import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setGeneralLoading } from '../../redux/general/Actions'
import { userLogin } from '../../redux'
import { useHistory } from 'react-router-dom'

const ImpersonationNavbar = ({ originalToken }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const handleEndProxyLogin = useCallback(() => {
    dispatch(setGeneralLoading(true))
    if (originalToken) {
      localStorage.setItem('access_token', originalToken)
      localStorage.removeItem('original_access_token')
      localStorage.removeItem('impersonateId')

      dispatch(userLogin(null, false))
      history.push('/dashboard')
      setTimeout(() => {
        dispatch(setGeneralLoading(false))
        window.location.reload()
      }, 2000)
    } else {
      console.log('No original token found to revert')
    }
  }, [dispatch, originalToken, history])

  return (
    <div className='position-absolute d-flex justify-content-center align-items-center impersonation-nav'>
      <span className='d-flex justify-content-center text-center'>
        You are currently in impersonation mode.
      </span>
      <span
        className='ms-auto d-flex align-items-center cursor-pointer'
        onClick={handleEndProxyLogin}
      >
        <FontAwesomeIcon
          icon={faArrowLeft}
          style={{
            fontSize: '20px'
          }}
          className='pe-1'
        />
        Go back to my account
      </span>
    </div>
  )
}

export default ImpersonationNavbar
