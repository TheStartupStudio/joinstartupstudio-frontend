/**
 * Entry application component used to compose providers and render Routes.
 * */

import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from './Router'
import jQuery from 'jquery'
import axiosInstance from './utils/AxiosInstance'

window.jQuery = jQuery

function App({ basename }) {
  // useEffect(() => {
  //   const sendRequestOnUnload = async () => {
  //     try {
  //       await axiosInstance.patch('/myPerformanceData/end')
  //     } catch (error) {
  //       console.error('Error sending PATCH request:', error)
  //     }
  //   }
  //
  //   // Attach the event listener for beforeunload or unload event
  //   window.addEventListener('beforeunload', sendRequestOnUnload)
  //
  //   // Cleanup the event listener when the component is unmounted
  //   return () => {
  //     window.removeEventListener('beforeunload', sendRequestOnUnload)
  //   }
  // }, []) // Empty dependency array means this effect runs once on mount
  return (
    <React.Suspense fallback={''}>
      <BrowserRouter basename={basename}>
        <Router />
      </BrowserRouter>
    </React.Suspense>
  )
}

export default App
