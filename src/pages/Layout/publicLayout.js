import React, { useEffect, useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PublicHeader from '../../components/PublicHeader'
import Footer from '../../components/Footer'
import PlatformFooter from '../../components/PlatformFooter'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'

const PLATFORM_FOOTER_PATHS = ['/', '/register']

function PublicLayout({ children }) {
  const location = useLocation()
  const TopScroll = useRef()
  const usePlatformFooter = PLATFORM_FOOTER_PATHS.includes(location.pathname)
  const hideFooter =
    location.pathname === '/payment' ||
    location.pathname === '/confirm-email' ||
    location.pathname === '/check-email'

  useEffect(() => {
    if (TopScroll.current) {
      TopScroll.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [location.pathname])

  return (
    <React.Fragment>
      <div
        ref={TopScroll}
        id='content'
        style={{ width: '100%' }}
        className={`${
          location.pathname === '/register' ||
          location.pathname === '/payment' ||
          location.pathname === '/contact' ||
          location.pathname === '/check-email'
            ? 'blue-wrapper'
            : ''
        }`}
      >
        {/* <PublicHeader /> */}
        {children}
        <ToastContainer
          className='customToast'
          position='bottom-left'
          autoClose={5000}
        />

        {!hideFooter &&
          (usePlatformFooter ? <PlatformFooter /> : <Footer />)}
      </div>
    </React.Fragment>
  )
}

export default PublicLayout
