import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar/index'
import Footer from '../../components/Footer/index'
import { changeSidebarState } from '../../redux'
import { ToastContainer } from 'react-toastify'

function Layout({ children }) {
  const [sideBarVisible, setSideBarVisible] = useState(false)
  const sideBarState = useSelector((state) => state.general.sidebarState)
  const [showHeaderSelected, setShowHeaderSelected] = useState(false)
  const dispatch = useDispatch()

  const toggleBackdrop = () => {
    dispatch(changeSidebarState(false))
  }

  const hideHeaderIcons = () => {
    setShowHeaderSelected(!showHeaderSelected)
  }

  return (
    <React.Fragment>
      <div className='wrapper'>
        <Sidebar
          handleSideBar={setSideBarVisible}
          sideBarVisible={sideBarVisible}
          hideHeaderIcons={hideHeaderIcons}
        />
        <div id='content' className='w-100'>
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
