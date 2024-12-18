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
import { Col, Row } from 'react-bootstrap'
import {
  constructLoginUrl,
  getClientFromHostname
} from '../../../../utils/helpers'

const socialIcons = {
  linkedin: faLinkedin,
  vimeo: faVimeo,
  spotify: faSpotify
}

const SociaMediaItem = ({ href, icon }) => {
  return (
    <a
      className='social-media-item'
      href={href}
      target='_blank'
      rel='noreferrer'
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
        alt=''
      />
    </div>
  )
}

const ChooseLogin = () => {
  const history = useHistory()

  const handleLoginRole = (role) => {
    const client = getClientFromHostname()
    const loginUrl = constructLoginUrl(client, role)

    if (loginUrl.startsWith('/')) {
      history.push(loginUrl)
    } else {
      window.location.replace(loginUrl)
    }
  }

  return (
    <div
      className='container-fluid md-px-5 ps-md-5 choose-login_container'
      style={{
        backgroundColor: '#e4e9f4'
      }}
    >
      <Row className='m-0 p-0 align-items-center center-content justify-evenly'>
        <Col md='6' sm='12'>
          <div className='row'>
            <div className='col-sm-12 col-md-9  mx-auto'>
              <div className='login-left-content'>
                <div className='login-logo'>
                  <img src={SUSLogo} alt='logo' />
                </div>
                <h1 className='login-title' style={{ color: '#000' }}>
                  Welcome...
                </h1>
                <p style={{ color: '#000' }}>
                  ...to Learn to Start Powered by The Startup Studio. Please
                  choose from the options to the right to begin your login.
                </p>

                <div className='social-media-items'>
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
        </Col>
        <Col md='5' sm='12' className='right-login-content'>
          <FormWrapper className='col-lg-9 col-md-12 col-sm-12 mx-auto px-4 pb-3 pt-4 right-login-form'>
            <h2 className='text-center right-login-text'>
              <IntlMessages id='general.ready' />?
            </h2>
            <h6 className='mb-4 right-login-text'>
              Choose your role to log in
            </h6>
            <div className='button-type_container'>
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

            <p className='my-4 text-center public-page-text'>
              <IntlMessages id='login.security' />
              <br />
              <a href='/lts-secure' className='ml-2 link'>
                <IntlMessages id='login.protect_data' />
              </a>
            </p>
          </FormWrapper>
        </Col>
      </Row>
    </div>
  )
}

export default ChooseLogin
