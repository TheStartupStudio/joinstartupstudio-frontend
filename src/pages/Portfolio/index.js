import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { Document, Page, pdfjs } from 'react-pdf'
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

function Portfolio() {
  const [numPages, setNumPages] = useState(null)
  const clientBaseURL = `${process.env.REACT_APP_CLIENT_BASE_URL}`
  const { user } = useSelector((state) => state.user.user)
  const [userDetails, setUserDetails] = useState({})
  const [userPortfolio, setUserPortfolio] = useState({})
  const [titleColor, setTitleColor] = useState('#01C5D1')
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const closePDFModal = () => setShowPDFViewer(false)
  const showPDFModal = () => setShowPDFViewer(true)
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

  useEffect(() => {
    getUserPortfolio()
    getUserDetails()
  }, [])

  const getUserDetails = async () => {
    await axiosInstance
      .get(`/users/${user.id}`)
      .then((response) => {
        setUserDetails(response.data)
      })
      .catch((err) => err)
  }
  const getUserPortfolio = async () => {
    await axiosInstance
      .get(`/portfolio`)
      .then((response) => {
        setUserPortfolio(response.data)
        if (response.data.header_color) {
          setTitleColor(response.data.header_color)
        }
      })
      .catch((err) => err)
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
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
              <IntlMessages id={`portfolio.page_description`} />
            </p>
            <div>
              <div className='row mt-5 mx-0'>
                <div
                  className='desktop-menu col-lg-2 col-md-12'
                  style={{ padding: '0' }}
                >
                  <img
                    className='lg-w-100 md-w-25'
                    src={
                      userDetails?.profile_image
                        ? userDetails.profile_image
                        : profileImage
                    }
                    style={{ width: '90%' }}
                  />
                </div>
                <div className='mobile-menu portfolio-data col-12 pl-0'>
                  <img
                    className='mx-auto d-block w-25'
                    src={
                      userDetails?.profile_image
                        ? userDetails.profile_image
                        : profileImage
                    }
                  />
                  <h4 className='d-flex justify-content-center col-md-12'>
                    {user.name}
                  </h4>

                  <h5 className='col-md-12 d-flex justify-content-center pr-4'>
                    {userDetails?.profession
                      ? userDetails.profession
                      : 'UI Designer'}
                  </h5>
                </div>
                <div className='col-md-7 col-lg-8 portfolio-data desktop-menu'>
                  <h2>{user.name}</h2>
                  <h5>
                    {userDetails?.profession
                      ? userDetails.profession
                      : 'UI Designer'}
                  </h5>
                  <p className='portfolio-pr'>
                    {userDetails?.bio ? (
                      userDetails.bio.split(' ').splice(0, 150).join(' ')
                    ) : (
                      <IntlMessages id='portfolio.user_bio' />
                    )}
                  </p>
                  <a
                    href={
                      userDetails?.is_published == true
                        ? `${clientBaseURL}/public-profile/${user.username}`
                        : `/profile-preview`
                    }
                    target={userDetails?.is_published == true ? '_blank' : ''}
                  >
                    <IntlMessages id='general.view_profile' />
                  </a>
                </div>
              </div>
              <div className='d-flex col-lg-2 justify-content-center ml-md-0 pl-0 mt-2'>
                {userDetails?.social_links?.linkedIn && (
                  <a
                    href={
                      userDetails.social_links.linkedIn.startsWith('https')
                        ? userDetails.social_links.linkedIn
                        : `https://${userDetails.social_links.linkedIn}`
                    }
                    target='_blank'
                  >
                    <FontAwesomeIcon
                      icon={faLinkedinIn}
                      className='portfolio-social-media'
                      style={{
                        color: titleColor
                      }}
                    />
                  </a>
                )}
                {userDetails?.social_links?.twitter && (
                  <a
                    href={
                      userDetails.social_links.twitter.startsWith('https')
                        ? userDetails.social_links.twitter
                        : `https://${userDetails.social_links.twitter}`
                    }
                    target='_blank'
                  >
                    <FontAwesomeIcon
                      icon={faTwitterSquare}
                      className='portfolio-social-media'
                      style={{
                        color: titleColor
                      }}
                    />
                  </a>
                )}
                {userDetails?.social_links?.instagram && (
                  <a
                    href={
                      userDetails.social_links.instagram.startsWith('https')
                        ? userDetails.social_links.instagram
                        : `https://${userDetails.social_links.instagram}`
                    }
                    target='_blank'
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className='portfolio-social-media'
                      style={{
                        color: titleColor
                      }}
                    />
                  </a>
                )}
                {userDetails?.social_links?.website && (
                  <a
                    href={
                      userDetails.social_links.website.startsWith('https')
                        ? userDetails.social_links.website
                        : `https://${userDetails.social_links.website}`
                    }
                    target='_blank'
                  >
                    <FontAwesomeIcon
                      icon={faGlobe}
                      className='portfolio-social-media'
                      style={{
                        color: titleColor
                      }}
                    />
                  </a>
                )}
                {userDetails?.social_links?.facebook && (
                  <a
                    href={
                      userDetails.social_links.facebook.startsWith('https')
                        ? userDetails.social_links.facebook
                        : `https://${userDetails.social_links.facebook}`
                    }
                    target='_blank'
                  >
                    <FontAwesomeIcon
                      icon={faFacebookSquare}
                      className='portfolio-social-media'
                      style={{
                        color: titleColor
                      }}
                    />
                  </a>
                )}
              </div>
              <p className='portfolio-pr mobile-menu pt-3'>
                {userDetails?.bio ? (
                  userDetails.bio.split(' ').splice(0, 150).join(' ')
                ) : (
                  <IntlMessages id='portfolio.user_bio' />
                )}
              </p>
            </div>
            <Row className='mt-5 mx-0'>
              <div className='portfolio-section px-0'>
                <h3>
                  <IntlMessages id='portfolio.this_is' />
                </h3>
                <h4 style={{ color: titleColor }}>
                  <IntlMessages id='portfolio.empowerement' />{' '}
                </h4>
              </div>
            </Row>
            <Row className='mx-0'>
              <div className='col-lg-3 col-md-12 col-sm-12 ps-lg-0'>
                {userPortfolio?.portfolioEmpowerment?.url &&
                userPortfolio?.portfolioEmpowerment?.url !== '' ? (
                  <ReactPlayer
                    className='portfolio-video-height'
                    height='210px'
                    width='100%'
                    url={userPortfolio?.portfolioEmpowerment?.url}
                    controls={true}
                    light={true}
                    playing={true}
                    config={{
                      file: {
                        attributes: {
                          controlsList: 'nodownload'
                        }
                      }
                    }}
                  ></ReactPlayer>
                ) : (
                  <div className='portfolio-section text-center'>
                    <img src={Unsplash1} alt='#' />
                    <img className='icon-play' src={PlayButton} alt='#' />
                  </div>
                )}
              </div>
              <div className='col-lg-9 portfolio-data col-sm-12'>
                {userPortfolio?.portfolioEmpowerment?.description ? (
                  <p>{userPortfolio.portfolioEmpowerment.description}</p>
                ) : (
                  <p>
                    <IntlMessages id='portfolio.empowerment_p1' /> <br></br>
                    <br></br>
                    <IntlMessages id='portfolio.empowerment_p2' />
                  </p>
                )}
              </div>
            </Row>
            <Row className='mt-3'>
              <div className='col-md-11 col-lg-10'>
                <div className='portfolio-section align-right'>
                  <h3>
                    <IntlMessages id='portfolio.this_is' />
                  </h3>
                  <h4
                    style={{
                      color: titleColor
                    }}
                  >
                    <IntlMessages id='portfolio.performance' />{' '}
                  </h4>
                </div>
              </div>
            </Row>
            <Row className='mt-2 mx-0'>
              <div className='col-lg-9 col-sm-12 portfolio-data ps-lg-0'>
                {userPortfolio?.portfolioPerformance?.description ? (
                  <p>{userPortfolio.portfolioPerformance.description}</p>
                ) : (
                  <p>
                    <IntlMessages id='portfolio.performance_p' />
                  </p>
                )}
              </div>
              <div className='col-lg-3 col-md-12 col-sm-12'>
                {userPortfolio?.portfolioPerformance?.url &&
                userPortfolio?.portfolioPerformance?.url !== '' ? (
                  <ReactPlayer
                    className='portfolio-video-height'
                    height='210px'
                    width='100%'
                    url={userPortfolio?.portfolioPerformance?.url}
                    controls={true}
                    light={true}
                    playing={true}
                    config={{
                      file: {
                        attributes: {
                          controlsList: 'nodownload'
                        }
                      }
                    }}
                  ></ReactPlayer>
                ) : (
                  <div className='portfolio-section text-center'>
                    <img src={Unsplash2} alt='#' />
                    <img className='icon-play ' src={PlayButton} alt='#' />
                  </div>
                )}
              </div>
            </Row>
            <Row className='mx-0 mt-3'>
              <div className='portfolio-section ps-lg-0'>
                <h3>
                  <IntlMessages id='portfolio.this_is' />
                </h3>
                <h4 style={{ color: titleColor }}>
                  <IntlMessages id='portfolio.wellness' />{' '}
                </h4>
              </div>
            </Row>
            <Row className='mx-0'>
              <div className='col-lg-3 col-md-12 col-sm-12 ps-lg-0'>
                {userPortfolio?.portfolioWellness?.url &&
                userPortfolio?.portfolioWellness?.url !== '' ? (
                  <div
                    className='article-document portfolio-video-height'
                    onClick={showPDFModal}
                  >
                    <Document
                      className='pdf-document-viewer'
                      file={`${userPortfolio.portfolioWellness.url}`}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page pageNumber={1} />
                    </Document>
                  </div>
                ) : (
                  <div>
                    <img
                      src={Unsplash3}
                      alt='#'
                      style={{
                        width: '100%'
                      }}
                    />
                  </div>
                )}
              </div>
              <div className='col-lg-9 portfolio-data col-sm-12'>
                {userPortfolio?.portfolioWellness?.description ? (
                  <p>{userPortfolio.portfolioWellness.description}</p>
                ) : (
                  <p>
                    <IntlMessages id='portfolio.wellness_p1' />
                    <br></br>
                    <IntlMessages id='portfolio.wellness_p2' />
                    <br></br>
                    <IntlMessages id='portfolio.wellness_p3' />
                  </p>
                )}
              </div>
            </Row>
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
