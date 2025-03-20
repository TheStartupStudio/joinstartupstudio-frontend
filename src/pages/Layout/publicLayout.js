import React, { useEffect, useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PublicHeader from '../../components/PublicHeader'
import Footer from '../../components/Footer'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'

function PublicLayout({ children }) {
  const location = useLocation()
  const TopScroll = useRef()

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
          location.pathname === '/contact'
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

        <>
          {location.pathname !== '/payment' &&
            location.pathname !== '/confirm-email' && <Footer />}
        </>
      </div>
    </React.Fragment>
  )
}

export default PublicLayout
