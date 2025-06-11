import { useEffect } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useDispatch } from 'react-redux'
import { userLogin } from '../../../redux'
import logo from '../../../../public/academy-logo.png'

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

      dispatch(userLogin())
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '20px',
      background: 'linear-gradient(180deg, #ffffff 0%, rgb(255 228 248) 0%, rgb(255 255 255) 100%) !important'
    }}>
      <img
        src={logo}
        alt="Success"
        style={{ width:'200px', objectFit: 'contain' }}
      />

      <h2>Logging in...</h2>
    </div>
  )
}

export default AuthSuccess
