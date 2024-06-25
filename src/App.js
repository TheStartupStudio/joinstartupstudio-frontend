/**
 * Entry application component used to compose providers and render Routes.
 * */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter, useHistory, useLocation } from 'react-router-dom'
import Router from './Router'
import jQuery from 'jquery'
import { useSelector } from 'react-redux'
import axiosInstance from './utils/AxiosInstance'
import useUserActivity from './utils/hooks/useUserActivity'

window.jQuery = jQuery

function App({ basename }) {
  const { activeMinutes } = useUserActivity()

  return (
    <React.Suspense fallback={''}>
      <BrowserRouter basename={basename}>
        <Router />
      </BrowserRouter>
    </React.Suspense>
  )
}

export default App
