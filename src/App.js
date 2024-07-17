/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import jQuery from 'jquery'
import NewRouter from './newRouter'
import useUserActivity from './hooks/useUserActivity'

window.jQuery = jQuery

function App({ basename }) {
  const { activeMinutes } = useUserActivity()

  return (
    <React.Suspense fallback={''}>
      <BrowserRouter basename={basename}>
        <NewRouter />
      </BrowserRouter>
    </React.Suspense>
  )
}

export default App
