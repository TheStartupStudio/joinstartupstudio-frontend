/**
 * Entry application component used to compose providers and render Routes.
 * */

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BrowserRouter, useHistory, useLocation } from 'react-router-dom'
import Router from './Router'
import jQuery from 'jquery'

window.jQuery = jQuery

function App({ basename }) {
  return (
    <React.Suspense fallback={''}>
      <BrowserRouter basename={basename}>
        <Router />
      </BrowserRouter>
    </React.Suspense>
  )
}

export default App
