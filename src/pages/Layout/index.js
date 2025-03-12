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
import userIcon from '../../assets/images/academy-icons/profile-icon.png'
import penIcon from '../../assets/images/academy-icons/pen-icon.png'
import profilePic from '../../assets/images/academy-icons/profile.jpeg'
import linkedinLogo from '../../assets/images/academy-icons/linkedin.png'
import facebookLogo from '../../assets/images/academy-icons/facebook.png'
import twitterLogo from '../../assets/images/academy-icons/twitter.png'
import tickLogo from '../../assets/images/academy-icons/blue-tick.png'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import AcademyLogo from '../../assets/images/academy-icons/academy-logo.png'
import CircularProgress from '../../components/ProgressBar'
import UserDetails from '../../components/UserDetails/UserDetails'

function Layout({ children }) {
  const originalToken = localStorage.getItem('original_access_token')
  const [sideBarVisible, setSideBarVisible] = useState(false)
  const sideBarState = useSelector((state) => state.general.sidebarState)
  const [showHeaderSelected, setShowHeaderSelected] = useState(false)
  const { generalLoading } = useSelector((state) => state.general)
  const dispatch = useDispatch()

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
        <Sidebar
          handleSideBar={setSideBarVisible}
          sideBarVisible={sideBarVisible}
          hideHeaderIcons={hideHeaderIcons}
        />
        <div
          id='content'
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

          <div className='d-grid academy-dashboard-layout'>
            <UserDetails
              profilePic={profilePic}
              userName={'Kenia Anders'}
              userProffesion={'Graphic Designer'}
            />

            <div
              className='d-grid academy-dashboard-card'
              style={{ gridTemplateRows: '1fr 2fr' }}
            >
              <div className='d-flex justify-content-between align-items-center align-self-baseline pt-4'>
                <div className='d-flex gap-3 align-items-center'>
                  <img src={courseLogo} alt='course' />
                  <h4 className='fs-9 my-details-header'>Course Progress</h4>
                </div>
                <div className='progress-details'>
                  <span>Progress Details</span>
                  <img src={rightArrow} alt='right-arr' />
                </div>
              </div>
              <div className='d-flex gap-4 align-items-center justify-content-between'>
                <div className='d-flex flex-column gap-4'>
                  <CircularProgress percentage={20} level={1} />
                  <p className='text-center'>
                    Entrepreneurship <br /> & You
                  </p>
                </div>
                <div className='d-flex flex-column gap-4'>
                  <CircularProgress percentage={0} level={2} />
                  <p className='text-center'>
                    Understanding <br /> Learn to Start
                  </p>
                </div>
                <div className='d-flex flex-column gap-4'>
                  <CircularProgress percentage={0} level={3} />
                  <p className='text-center'>
                    The Journey of <br />
                    Entrepreneurship
                  </p>
                </div>
              </div>
            </div>

            <div className='academy-dashboard-card academy-dashboard-bottom d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center gap-3'>
                <div className='d-flex gap-1'>
                  <img src={AcademyLogo} alt='logo' style={{ width: '3rem' }} />
                  <div>
                    <h4 className='academy-header'>
                      <span className='header-title'>THE</span>
                      <br />
                      STARTUP
                      <br />
                      STUDIO
                    </h4>
                    <p className='powered' style={{ marginBottom: 0 }}>
                      Powered by Learn to Start
                    </p>
                  </div>
                </div>
                <h3 className='page-title bold-page-title'>
                  Course in Entrepreneurship
                </h3>
              </div>
              <div
                className='d-flex'
                style={{
                  display: 'inline-block',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                  padding: '2px',
                  height: '58px',
                  boxShadow: '0px 4px 10px 0px #00000040'
                }}
              >
                <button className='continue-course-btn'>Continue Course</button>
              </div>
            </div>
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
