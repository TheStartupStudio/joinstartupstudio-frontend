/**
 * DEV AIE.
 * */

import React, { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import jQuery from 'jquery'
import Routers from './Router'
import useUserActivity from './hooks/useUserActivity'
import {
  startTokenRefreshCheck,
  stopTokenRefreshCheck
} from './utils/tokenUtils'

window.jQuery = jQuery

function App({ basename }) {
  const { activeMinutes } = useUserActivity()

  useEffect(() => {
    startTokenRefreshCheck()

    return () => {
      stopTokenRefreshCheck()
    }
  }, [])

  return (
    <React.Suspense fallback={''}>
      <Router basename={basename}>
        <Routers />
      </Router>
    </React.Suspense>
  )
}

export default App
