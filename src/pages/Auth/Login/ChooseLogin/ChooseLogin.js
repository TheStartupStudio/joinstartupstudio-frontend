import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import IntlMessages from '../../../../utils/IntlMessages'
import SUSLogo from '../../../../assets/images/LTS-logo-horizontal.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import instructorNormal from '../../../../assets/images/LTS INSTRUCTOR.png'
import learnerNormal from '../../../../assets/images/LTS LEARNER.png'
import instructorHover from '../../../../assets/images/LTS INSTRUCTOR FILLED.png'
import learnerHover from '../../../../assets/images/LTS LEARNER FILLED.png'
// import instructorNormal from '../../../assets/images/instructor-normal.png'
// import learnerNormal from '../../../assets/images/learner-normal.png'
// import instructorHover from '../../../assets/images/instructor-hover.png'
// import learnerHover from '../../../assets/images/learner-hover.png'
import '../index.css'
import {
  faVimeo,
  faLinkedin,
  faSpotify
} from '@fortawesome/free-brands-svg-icons'

const ChooseLogin = () => {
  const [loginRole, setLoginRole] = useState(null)
  const history = useHistory()

  const handleLoginRole = (role) => {
    setLoginRole(role)
  }

  const LoginRole = (props) => {
    const [hover, setHover] = useState(false)

    const handleMouseEnter = () => {
      setHover(true)
    }

    const handleMouseLeave = () => {
      setHover(false)
    }

    const icon = () => {
      if (hover) {
        return props.hoverIcon
      } else if (!hover) {
        return props.normalIcon
      }
    }

    return (
      <div
        onClick={() => {
          props.handleLoginRole(props.role)
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '50%',
          width: 150,
          height: 150,
          overflow: 'hidden'
        }}
      >
        <img src={icon()} style={{ width: '100%', objectFit: 'contain' }} />
      </div>
    )
  }
  const navigateToLogin = () => {
    if (loginRole) {
      if (loginRole === 'ims') {
        return history.push('/ims-login')
      } else if (loginRole === 'main') {
        return window.location.replace(
          'https://main.learntostart.com/main-login'
        )
      }
    }
  }

  return (
    <div
      className='container-fluid md-px-5 ps-md-5'
      style={{
        backgroundColor: '#e4e9f4',
        minHeight: ' calc(100vh - 90px)'
      }}
    >
      <div className='row center-content'>
        <div className='col-md-6'>
          <div className='row'>
            <div className='col-md-9 mx-auto'>
              <div className='login-left-content'>
                <img className='login-logo' src={SUSLogo} alt='logo' />
                <h1 className='login-title'>Welcome...</h1>
                <p>
                  ...to your Learn to Start Platform. Please choose your role
                  and log in to access.
                </p>

                <div className='social-media-items'>
                  {/* <a className='social-media-item' href='' target='_blank'>
										<FontAwesomeIcon icon={faFacebook} />
									</a> */}
                  <a
                    className='social-media-item'
                    href='https://www.linkedin.com/company/learntostart/'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                  <a
                    className='social-media-item'
                    href='https://vimeo.com/showcase/9368302'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <FontAwesomeIcon icon={faVimeo} />
                  </a>
                  <a
                    className='social-media-item'
                    href='https://open.spotify.com/show/0LZ1HxvXnMf6IAdyY8M9q3'
                    target='_blank'
                    rel='noreferrer'
                  >
                    <FontAwesomeIcon icon={faSpotify} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-5'>
          <div
            className='col-lg-9 mx-auto public-page-form px-4 pb-3 pt-4 '
            style={{
              backgroundColor: '#F2F5FC'
            }}
          >
            <h3
              className='text-center'
              style={{
                textTransform: 'uppercase',
                color: '#51C7DF',
                fontSize: 20
              }}
            >
              <IntlMessages id='general.login' />
            </h3>
            <h4 style={{ color: '#707070', textAlign: 'center', fontSize: 12 }}>
              Choose your Role
            </h4>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <div style={{ marginRight: '-5px' }}>
                  <LoginRole
                    role={'ims'}
                    normalIcon={
                      loginRole == 'ims' ? instructorHover : instructorNormal
                    }
                    hoverIcon={instructorHover}
                    handleLoginRole={(role) => {
                      handleLoginRole(role)
                    }}
                  />
                </div>
                <div>
                  <LoginRole
                    role={'main'}
                    normalIcon={
                      loginRole == 'main' ? learnerHover : learnerNormal
                    }
                    hoverIcon={learnerHover}
                    handleLoginRole={(role) => {
                      handleLoginRole(role)
                    }}
                  />
                </div>
              </div>
            </div>

            <button type='submit' className='mt-2' onClick={navigateToLogin}>
              <IntlMessages id='general.next' />
            </button>
            <p className='my-4'>
              <IntlMessages id='login.security' />
              <a href='/lts-secure' className='ml-2 link'>
                <IntlMessages id='login.protect_data' />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChooseLogin
