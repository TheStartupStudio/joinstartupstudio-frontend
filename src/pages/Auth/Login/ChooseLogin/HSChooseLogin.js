import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import IntlMessages from '../../../../utils/IntlMessages'
import SUSLogo from '../../../../assets/images/LTS-logo-horizontal.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import instructorNormal from '../../../../assets/images/LTS INSTRUCTOR.png'
import learnerNormal from '../../../../assets/images/LTS LEARNER.png'
import instructorHover from '../../../../assets/images/LTS INSTRUCTOR FILLED.png'
import learnerHover from '../../../../assets/images/LTS LEARNER FILLED.png'
import '../index.css'
import {
  faVimeo,
  faLinkedin,
  faSpotify
} from '@fortawesome/free-brands-svg-icons'
import FormWrapper from '../ui/FormWrapper'

const ChooseLogin = () => {
  const history = useHistory()

  const handleLoginRole = (role) => {
    if (role === 'ims') {
      return history.push('/ims-login')
    } else if (role === 'main') {
      return window.location.replace(
        'https://main.learntostart.com/main-login'
      )
    }
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
        <img
          src={icon()}
          style={{ width: '100%', objectFit: 'contain' }}
          alt=""
        />
      </div>
    )
  }

  return (
    <div
      className="container-fluid md-px-5 ps-md-5 choose-login_container"
      style={{
        backgroundColor: '#F8F7F7',
        minHeight: ' calc(100vh - 42px)'
      }}
    >
      <div className="row center-content justify-evenly">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-9 mx-auto">
              <div className="login-left-content">
                <img className="login-logo" src={SUSLogo} alt="logo" />
                <h1 className="login-title" style={{ color: '#000' }}>
                  Welcome...
                </h1>
                <p className="w-50" style={{ color: '#000' }}>
                  ...to your Learn to Start Platform. Please choose your role
                  and log in to access.
                </p>

                <div className="social-media-items">
                  <a
                    className="social-media-item"
                    href="https://www.linkedin.com/company/learntostart/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                  <a
                    className="social-media-item"
                    href="https://vimeo.com/showcase/9368302"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faVimeo} />
                  </a>
                  <a
                    className="social-media-item"
                    href="https://open.spotify.com/show/0LZ1HxvXnMf6IAdyY8M9q3"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faSpotify} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <FormWrapper className="col-lg-9 mx-auto px-4 pb-3 pt-4 ">
            <h2
              className="text-center fw-bold"
              style={{
                textTransform: 'uppercase'
              }}
            >
              <IntlMessages id="general.ready" /> ?
            </h2>
            <h6
              className="mb-4 fw-bold"
              style={{ color: '#707070', textAlign: 'center' }}
            >
              Choose your Role to log in
            </h6>
            <div className="button-type_container">
              <div className="cursor-pointer">
                <LoginRole
                  role={'ims'}
                  normalIcon={instructorNormal}
                  hoverIcon={instructorHover}
                  handleLoginRole={(role) => {
                    handleLoginRole(role)
                  }}
                />
              </div>
              <div className="cursor-pointer">
                <LoginRole
                  role={'main'}
                  normalIcon={learnerNormal}
                  hoverIcon={learnerHover}
                  handleLoginRole={(role) => {
                    handleLoginRole(role)
                  }}
                />
              </div>
            </div>
            <p className="my-4 text-center public-page-text">
              <IntlMessages id="login.security" />
              <br />
              <a href="/lts-secure" className="ml-2 link">
                <IntlMessages id="login.protect_data" />
              </a>
            </p>
          </FormWrapper>
        </div>
      </div>
    </div>
  )
}

export default ChooseLogin
