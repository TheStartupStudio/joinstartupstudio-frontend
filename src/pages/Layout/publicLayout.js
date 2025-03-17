import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PublicHeader from '../../components/PublicHeader'
import Footer from '../../components/Footer'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'

function PublicLayout({ children }) {
  const location = useLocation()

  return (
    <React.Fragment>
      <div
        id='content'
        style={{ width: '100%' }}
        className={`${location.pathname === '/register' ? 'blue-wrapper' : ''}`}
      >
        {/* <PublicHeader /> */}
        {children}
        <ToastContainer
          className='customToast'
          position='bottom-left'
          autoClose={5000}
        />

        <>
          <Footer />
        </>
      </div>
    </React.Fragment>
  )
}

export default PublicLayout
