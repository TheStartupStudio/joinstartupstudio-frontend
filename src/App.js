/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router'
import jQuery from 'jquery'
import useUserActivity from './utils/hooks/useUserActivity'
import NewRouter from './newRouter'

window.jQuery = jQuery

function App({ basename }) {
  const { activeMinutes } = useUserActivity()

  // console.log('activeMinutes', activeMinutes)

  return (
    <React.Suspense fallback={''}>
      <BrowserRouter basename={basename}>
        <NewRouter />
      </BrowserRouter>
    </React.Suspense>
  )
}

export default App
