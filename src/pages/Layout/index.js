import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar/index'
import Footer from '../../components/Footer/index'
import { changeSidebarState } from '../../redux'
import { ToastContainer } from 'react-toastify'
import LoadingAnimation from '../../ui/loadingAnimation'
import BloorBackgroundWrapper from '../../ui/BlurBackgroundWrapper'
import ImpersonationNavbar from '../../components/Navbar/ImpersonationNavbar'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'

function Layout({ children }) {
  const originalToken = localStorage.getItem('original_access_token')
  const [sideBarVisible, setSideBarVisible] = useState(false)
  const sideBarState = useSelector((state) => state.general.sidebarState)
  const [showHeaderSelected, setShowHeaderSelected] = useState(false)
  const { generalLoading } = useSelector((state) => state.general)
  const isCollapsed = useSelector((state) => state.sidebar.isCollapsed)
  const dispatch = useDispatch()
  const location = useLocation()

  const toggleBackdrop = () => {
    dispatch(changeSidebarState(false))
  }

  const hideHeaderIcons = () => {
    setShowHeaderSelected(!showHeaderSelected)
  }

  return (
    <React.Fragment>
      {generalLoading && (
        <BloorBackgroundWrapper>
          <LoadingAnimation show={true} />
        </BloorBackgroundWrapper>
      )}
      {originalToken && <ImpersonationNavbar originalToken={originalToken} />}
      <div className='wrapper' style={originalToken && { marginTop: '32px' }}>
        {!(
          location.pathname === '/subscribe' || location.pathname === '/payment'
        ) && (
          <Sidebar
            handleSideBar={setSideBarVisible}
            sideBarVisible={sideBarVisible}
            hideHeaderIcons={hideHeaderIcons}
          />
        )}
        <div
          id='content'
          className={
            location.pathname === '/subscribe' ||
            location.pathanme === '/payment'
              ? ''
              : 'auth-content'
          }
          // className='w-100'
        >
          {sideBarState ? (
            <div className='backdrop' onClick={toggleBackdrop}></div>
          ) : null}
          <Header handleSideBar={setSideBarVisible} />
          {children}
          <div className='mobile-footer'>
            <Footer />
          </div>
        </div>
      </div>
      <ToastContainer
        className='customToast'
        position='bottom-left'
        autoClose={5000}
      />
      <div className='desktop-footer'>
        <Footer />
      </div>
    </React.Fragment>
  )
}

export default Layout
