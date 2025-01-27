import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookSquare,
  faLinkedinIn,
  faTwitterSquare,
  faInstagram
} from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import DocumentViewer from '../../components/Modals/Portfolio/documentViewer'
import profileImage from '../../assets/images/profile-image.png'
import PlayButton from '../../assets/images/play-button.png'
import Unsplash1 from '../../assets/images/unsplash-1.png'
import Unsplash2 from '../../assets/images/unsplash-2.png'
import Unsplash3 from '../../assets/images/unsplash-3.png'

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState({
    userDetails: {},
    userPortfolio: {},
    numPages: null,
    titleColor: '#01C5D1'
  })
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const clientBaseURL = process.env.REACT_APP_CLIENT_BASE_URL
  const { user } = useSelector((state) => state.user.user)

  useEffect(() => {
    fetchUserDetails()
    fetchUserPortfolio()
  }, [])

  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.get(`/users/${user.id}`)
      setPortfolioData((prev) => ({ ...prev, userDetails: response.data }))
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }

  const fetchUserPortfolio = async () => {
    try {
      const response = await axiosInstance.get('/portfolio')
      setPortfolioData((prev) => ({
        ...prev,
        userPortfolio: response.data,
        titleColor: response.data.header_color || prev.titleColor
      }))
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    }
  }

  const openPDFModal = () => setShowPDFViewer(true)
  const closePDFModal = () => setShowPDFViewer(false)

  const { userDetails, userPortfolio, titleColor } = portfolioData

  const renderSocialIcon = (platform, link, icon) => {
    if (!link) return null
    const formattedLink = link.startsWith('https') ? link : `https://${link}`
    return (
      <a href={formattedLink} target='_blank' rel='noopener noreferrer'>
        <FontAwesomeIcon
          icon={icon}
          className='portfolio-social-media'
          style={{ color: titleColor }}
        />
      </a>
    )
  }

  const renderReactPlayer = (url, placeholderImage) => {
    if (!url) {
      return (
        <div className='portfolio-section text-center'>
          <img src={placeholderImage} alt='Placeholder' />
          <img className='icon-play' src={PlayButton} alt='Play' />
        </div>
      )
    }
    return (
      <ReactPlayer
        className='portfolio-video-height'
        height='210px'
        width='100%'
        url={url}
        controls
        light
        playing
        config={{
          file: { attributes: { controlsList: 'nodownload' } }
        }}
      />
    )
  }

  return (
    <Container>
      <Row>
        <div className='col-md-9 col-lg-12'>
          <div className='page-padding'>
            <h3 className='page-title'>
              <IntlMessages id='navigation.portfolio' /> |{' '}
              <Link to='/edit-portfolio'>
                <IntlMessages id='general.edit' />
              </Link>
            </h3>
            <p className='page-description mb-5'>
              <IntlMessages id='portfolio.page_description' />
            </p>

            {/* User Info Section */}
            <div className='row mt-5 mx-0'>
              <div className='desktop-menu col-lg-2 col-md-12'>
                <img
                  className='lg-w-100 md-w-25'
                  src={userDetails.profile_image || profileImage}
                  alt='Profile'
                  style={{ width: '90%' }}
                />
              </div>
              <div className='mobile-menu portfolio-data col-12 text-center'>
                <img
                  className='mx-auto d-block w-25'
                  src={userDetails.profile_image || profileImage}
                  alt='Profile'
                />
                <h4>{user.name}</h4>
                <h5>{userDetails.profession || 'UI Designer'}</h5>
              </div>
              <div className='col-md-7 col-lg-8 portfolio-data desktop-menu'>
                <h2>{user.name}</h2>
                <h5>{userDetails.profession || 'UI Designer'}</h5>
                <p className='portfolio-pr'>
                  {userDetails.bio ? (
                    userDetails.bio.split(' ').slice(0, 150).join(' ')
                  ) : (
                    <IntlMessages id='portfolio.user_bio' />
                  )}
                </p>
                <a
                  href={
                    userDetails.is_published
                      ? `${clientBaseURL}/public-profile/${user.username}`
                      : '/profile-preview'
                  }
                  target={userDetails.is_published ? '_blank' : ''}
                  rel='noopener noreferrer'
                >
                  <IntlMessages id='general.view_profile' />
                </a>
              </div>
              <div className='d-flex col-lg-2 justify-content-center mt-2'>
                {renderSocialIcon(
                  'LinkedIn',
                  userDetails?.social_links?.linkedIn,
                  faLinkedinIn
                )}
                {renderSocialIcon(
                  'Twitter',
                  userDetails?.social_links?.twitter,
                  faTwitterSquare
                )}
                {renderSocialIcon(
                  'Instagram',
                  userDetails?.social_links?.instagram,
                  faInstagram
                )}
                {renderSocialIcon(
                  'Website',
                  userDetails?.social_links?.website,
                  faGlobe
                )}
                {renderSocialIcon(
                  'Facebook',
                  userDetails?.social_links?.facebook,
                  faFacebookSquare
                )}
              </div>
            </div>

            {/* Portfolio Empowerment Section */}
            <Row className='mt-5 mx-0'>
              <div className='portfolio-section'>
                <h3>
                  <IntlMessages id='portfolio.this_is' />
                </h3>
                <h4 style={{ color: titleColor }}>
                  <IntlMessages id='portfolio.empowerement' />
                </h4>
              </div>
            </Row>
            <Row className='mx-0'>
              <div className='col-lg-3'>
                {renderReactPlayer(
                  userPortfolio?.portfolioEmpowerment?.url,
                  Unsplash1
                )}
              </div>
              <div className='col-lg-9 portfolio-data'>
                <p>
                  {userPortfolio?.portfolioEmpowerment?.description || (
                    <>
                      <IntlMessages id='portfolio.empowerment_p1' />
                      <br />
                      <IntlMessages id='portfolio.empowerment_p2' />
                    </>
                  )}
                </p>
              </div>
            </Row>

            {/* Other Portfolio Sections */}
            {/* ...similar structure for "Performance" and "Wellness" */}
          </div>
        </div>
      </Row>
      <DocumentViewer
        show={showPDFViewer}
        onHide={closePDFModal}
        articleLink={userPortfolio?.portfolioWellness?.url}
      />
    </Container>
  )
}

export default Portfolio
