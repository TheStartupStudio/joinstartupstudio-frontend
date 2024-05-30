import React from 'react'
import { useHistory } from 'react-router-dom'
import IntlMessages from '../../../../utils/IntlMessages'
import SUSLogo from '../../../../assets/images/LTS-logo-horizontal.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import instructorNormal from '../../../../assets/images/Login/LTS Instructor.png'
import learnerNormal from '../../../../assets/images/Login/LTS Learner.png'
import '../index.css'
import {
  faVimeo,
  faLinkedin,
  faSpotify
} from '@fortawesome/free-brands-svg-icons'
import FormWrapper from '../ui/FormWrapper'

const socialIcons = {
  linkedin: faLinkedin,
  vimeo: faVimeo,
  spotify: faSpotify
}

const SociaMediaItem = ({ href, icon }) => {
  return (
    <a
      className="social-media-item"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      <FontAwesomeIcon icon={socialIcons[icon]} />
    </a>
  )
}

const LoginRole = (props) => {
  return (
    <div
      onClick={() => {
        props.handleLoginRole(props.role)
      }}
      className={`login-role cursor-pointer ${props.className}`}
    >
      <img
        src={props.icon}
        style={{ width: '100%', objectFit: 'contain' }}
        alt=""
      />
    </div>
  )
}

const ChooseLogin = () => {
  const history = useHistory()

  const handleLoginRole = (role) => {
    if (role === 'ims') {
      return history.push('/ims-login')
    } else if (role === 'main') {
      return window.location.replace('https://main.learntostart.com/main-login')
    }
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
                  <SociaMediaItem
                    href={`https://www.linkedin.com/company/learntostart/`}
                    icon={'linkedin'}
                  />
                  <SociaMediaItem
                    href={`https://vimeo.com/showcase/9368302`}
                    icon={'vimeo'}
                  />
                  <SociaMediaItem
                    href={`https://open.spotify.com/show/0LZ1HxvXnMf6IAdyY8M9q3`}
                    icon={'spotify'}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <FormWrapper className="col-lg-9 mx-auto px-4 pb-3 pt-4 ">
            <h2 className="text-center">
              <IntlMessages id="general.ready" /> ?
            </h2>
            <h6 className="mb-4 ">Choose your Role to log in</h6>
            <div className="button-type_container">
              <LoginRole
                role={'ims'}
                icon={instructorNormal}
                handleLoginRole={(role) => {
                  handleLoginRole(role)
                }}
                className={'ims-login-role'}
              />

              <LoginRole
                role={'main'}
                icon={learnerNormal}
                handleLoginRole={(role) => {
                  handleLoginRole(role)
                }}
                className={'main-login-role'}
              />
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
