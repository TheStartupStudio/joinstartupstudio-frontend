import { Auth } from 'aws-amplify'

export const CheckTokenValidity = async () => {
  try {
    const session = await Auth.currentSession()
    const accessToken = session.getAccessToken()
    const expiration = accessToken.getExpiration() 
    const currentTime = Math.floor(Date.now() / 1000) 

    const bufferTime = 5 * 60 

    if (currentTime >= expiration - bufferTime) {

      const newSession = await Auth.currentSession()
      const newAccessToken = newSession.getAccessToken().getJwtToken()
      const newRefreshToken = newSession.getRefreshToken().getToken()

      localStorage.setItem('access_token', newAccessToken)

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    }

    return {
      accessToken: accessToken.getJwtToken(),
      refreshToken: session.getRefreshToken().getToken()
    }
  } catch (error) {
    return null
  }
}
