/**
 * Entry application component used to compose providers and render Routes.
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

  useEffect(() => {
    // Suppress ResizeObserver loop errors
    const resizeObserverErrorHandler = (e) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        // This error is harmless and can be safely ignored
        e.stopImmediatePropagation()
      }
    }

    window.addEventListener('error', resizeObserverErrorHandler)

    return () => {
      window.removeEventListener('error', resizeObserverErrorHandler)
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
