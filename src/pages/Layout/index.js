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
  const user = useSelector((state) => state.user?.user)
  const isAdmin = user?.role === 'admin' || user?.role_id === 3
  const dispatch = useDispatch()
  const location = useLocation()

  const hideSidebarRoutes = ['/terms']
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname)

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
      <div
        className='wrapper d-flex flex-column'
        style={{
          ...(originalToken && { marginTop: '32px' }),
          ...(isAdmin && { minHeight: '110dvh' })
        }}
      >
        {/* Conditionally render sidebar */}
        {!shouldHideSidebar && (
          <Sidebar
            handleSideBar={setSideBarVisible}
            sideBarVisible={sideBarVisible}
            hideHeaderIcons={hideHeaderIcons}
          />
        )}
        <div
          id='content'
          className={`${
            shouldHideSidebar
              ? 'full-width-content'
              : location.pathname === '/subscribe' ||
                location.pathname === '/payment'
              ? ''
              : 'auth-content'
          } flex-grow-1 d-flex flex-column`}
          style={shouldHideSidebar ? { width: '100%', marginLeft: 0 } : {}}
        >
          {sideBarState && !shouldHideSidebar ? (
            <div className='backdrop' onClick={toggleBackdrop}></div>
          ) : null}
          <Header handleSideBar={setSideBarVisible} />
          <main className='flex-grow-1'>{children}</main>
          <div className='d-block d-md-none'>
            <Footer />
          </div>
        </div>
      </div>
      <ToastContainer
        className='customToast'
        position='bottom-left'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className='d-none d-md-block'>
        <Footer />
      </div>
    </React.Fragment>
  )
}

export default Layout
