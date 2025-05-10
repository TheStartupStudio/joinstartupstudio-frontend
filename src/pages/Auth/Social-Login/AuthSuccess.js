import { useEffect } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useDispatch } from 'react-redux'
import { userLogin } from '../../../redux' // adjust path as needed

function AuthSuccess() {
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const accessToken = urlParams.get('access_token')
    const refreshToken = urlParams.get('refresh_token')

    if (accessToken && refreshToken) {
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)

      // Dispatch login action to populate Redux state
      dispatch(userLogin()) // You might need to pass token or email if required
        .then((res) => {
          if (res === 'passwordResetRequired') {
            history.push('/password-change-required')
          } else if (!res) {
            console.error('Google login failed internally')
            history.push('/login')
          } else {
            history.push('/dashboard')
          }
        })
        .catch((err) => {
          console.error('Google login dispatch error:', err)
          history.push('/login')
        })
    } else {
      console.error('Authentication failed: Tokens are missing')
      history.push('/')
    }
  }, [history, dispatch])

  return (
    <div>
      <h2>Logging in...</h2>
    </div>
  )
}

export default AuthSuccess
