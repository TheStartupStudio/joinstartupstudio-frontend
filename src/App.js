/**
 * Entry application component used to compose providers and render Routes.
 * */

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import jQuery from 'jquery'
import NewRouter from './newRouter'
import useUserActivity from './hooks/useUserActivity'
import axiosInstance from './utils/AxiosInstance'
import { useSelector } from 'react-redux'

window.jQuery = jQuery

function App({ basename }) {
  const { activeMinutes } = useUserActivity()

  return (
    <React.Suspense fallback={''}>
      <Router basename={basename}>
        <NewRouter />
      </Router>
    </React.Suspense>
  )
}

export default App
