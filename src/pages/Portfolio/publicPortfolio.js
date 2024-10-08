import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container, Row } from 'react-bootstrap'
import ReactPlayer from 'react-player'
// import { Document, Page } from 'react-pdf'
import axiosInstance from '../../utils/AxiosInstance'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLinkedinIn,
  faTwitterSquare,
  faInstagram,
  faFacebookSquare
} from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import profileImage from '../../assets/images/profile-image.png'
import Unsplash3 from '../../assets/images/unsplash-3.png'
import DocumentViewer from '../../components/Modals/Portfolio/documentViewer'

export default function PublicProfile() {
  const clientBaseURL = `${process.env.REACT_APP_CLIENT_BASE_URL}`
  const username = useParams().username
  const [userData, setUserData] = useState({})
  const closePDFModal = () => setShowPDFViewer(false)
  const showPDFModal = () => setShowPDFViewer(true)
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [numPages, setNumPages] = useState(null)

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = async () => {
    await axiosInstance
      .get(`/${username}/portfolio`)
      .then((response) => {
        setUserData(response.data)
      })
      .catch((err) => err)
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  return (
    <div className='row public-page mx-auto px-5 container'>
      {Object.keys(userData).length === 0 ? (
        <p className='m-3'>User is private</p>
      ) : (
        <div className='mx-5'>
          <h3 className='page-title'>MY LEARN TO START PORTFOLIO</h3>
          <div>
            <div className='row mt-5 mx-0'>
              <div
                className='desktop-menu col-lg-2 col-md-12'
                style={{ padding: '0' }}
              >
                {userData?.profile_image && (
                  <img
                    className='lg-w-100 md-w-25'
                    src={userData.profile_image}
                    style={{ width: '90%' }}
                  />
                )}
              </div>
              <div className='mobile-menu portfolio-data col-12 pl-0'>
                {userData?.profile_image && (
                  <img
                    className='mx-auto d-block w-25'
                    src={
                      userData?.profile_image
                        ? userData.profile_image
                        : profileImage
                    }
                  />
                )}

                <h4 className='d-flex justify-content-center col-md-12'>
                  {userData.name}
                </h4>

                <h5 className='col-md-12 d-flex justify-content-center pr-4'>
                  {userData?.profession ? userData.profession : ''}
                </h5>
              </div>
              <div className='col-md-7 col-lg-8 portfolio-data desktop-menu'>
                <h2>{userData.name}</h2>
                <h5>{userData?.profession ? userData.profession : ''}</h5>
                <p className='portfolio-pr'>
                  {userData?.bio
                    ? userData.bio.split(' ').splice(0, 150).join(' ')
                    : ''}
                </p>
                <a
                  href={`${clientBaseURL}/public-profile/${userData.username}`}
                >
                  View profile
                </a>
              </div>
            </div>
            <div className='d-flex col-lg-2 justify-content-center ml-md-0 pl-0 mt-2'>
              {userData?.social_links?.linkedIn && (
                <a
                  href={
                    userData.social_links.linkedIn.startsWith('https')
                      ? userData.social_links.linkedIn
                      : `https://${userData.social_links.linkedIn}`
                  }
                  target='_blank'
                >
                  <FontAwesomeIcon
                    icon={faLinkedinIn}
                    className='portfolio-social-media'
                    style={{
                      color: userData?.UserPortfolio?.header_color
                    }}
                  />
                </a>
              )}
              {userData?.social_links?.twitter && (
                <a
                  href={
                    userData.social_links.twitter.startsWith('https')
                      ? userData.social_links.twitter
                      : `https://${userData.social_links.twitter}`
                  }
                  target='_blank'
                >
                  <FontAwesomeIcon
                    icon={faTwitterSquare}
                    className='portfolio-social-media'
                    style={{
                      color: userData?.UserPortfolio?.header_color
                    }}
                  />
                </a>
              )}
              {userData?.social_links?.instagram && (
                <a
                  href={
                    userData.social_links.instagram.startsWith('https')
                      ? userData.social_links.instagram
                      : `https://${userData.social_links.instagram}`
                  }
                  target='_blank'
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className='portfolio-social-media'
                    style={{
                      color: userData?.UserPortfolio?.header_color
                    }}
                  />
                </a>
              )}
              {userData?.social_links?.website && (
                <a
                  href={
                    userData.social_links.website.startsWith('https')
                      ? userData.social_links.website
                      : `https://${userData.social_links.website}`
                  }
                  target='_blank'
                >
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className='portfolio-social-media'
                    style={{
                      color: userData?.UserPortfolio?.header_color
                    }}
                  />
                </a>
              )}
              {userData?.social_links?.facebook && (
                <a
                  href={
                    userData.social_links.facebook.startsWith('https')
                      ? userData.social_links.facebook
                      : `https://${userData.social_links.facebook}`
                  }
                  target='_blank'
                >
                  <FontAwesomeIcon
                    icon={faFacebookSquare}
                    className='portfolio-social-media'
                    style={{
                      color: userData?.UserPortfolio?.header_color
                    }}
                  />
                </a>
              )}
            </div>
            <p className='portfolio-pr mobile-menu pt-3'>
              {userData?.bio
                ? userData.bio.split(' ').splice(0, 150).join(' ')
                : ''}
            </p>
          </div>
          <Row className='mt-5 mx-0'>
            <div className='portfolio-section px-0'>
              <h3>This is</h3>
              <h4 style={{ color: userData?.UserPortfolio?.header_color }}>
                Empowerment
              </h4>
            </div>
          </Row>
          <Row className='mx-0'>
            <div className='col-lg-3 col-md-12 col-sm-12 px-0'>
              {userData?.UserPortfolio?.portfolioEmpowerment?.url &&
              userData?.UserPortfolio?.portfolioEmpowerment?.url !== '' ? (
                <ReactPlayer
                  className='portfolio-video-height'
                  height='210px'
                  width='100%'
                  url={userData?.UserPortfolio?.portfolioEmpowerment?.url}
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
              ) : null}
            </div>
            <div className='col-lg-8 portfolio-data col-sm-12 my-auto'>
              {userData?.UserPortfolio?.portfolioEmpowerment?.description ? (
                <p>
                  {userData?.UserPortfolio?.portfolioEmpowerment.description}
                </p>
              ) : (
                ''
              )}
            </div>
          </Row>
          <Row className='mt-5 px-0'>
            <div className='col-md-11 col-lg-11'>
              <div className='portfolio-section align-right'>
                <h3>This is</h3>
                <h4
                  style={{
                    color: userData?.UserPortfolio?.header_color
                  }}
                >
                  Performance
                </h4>
              </div>
            </div>
          </Row>
          <Row className='mt-2 mx-0'>
            <div className='col-lg-8 col-sm-12 portfolio-data px-0 my-auto'>
              {userData?.UserPortfolio?.portfolioPerformance?.description ? (
                <p>
                  {userData?.UserPortfolio?.portfolioPerformance.description}
                </p>
              ) : (
                ''
              )}
            </div>
            <div className='col-lg-3 col-md-12 col-sm-12 px-0'>
              {userData?.UserPortfolio?.portfolioPerformance?.url &&
              userData?.UserPortfolio?.portfolioPerformance?.url !== '' ? (
                <ReactPlayer
                  className='portfolio-video-height'
                  height='210px'
                  width='100%'
                  url={userData?.UserPortfolio?.portfolioPerformance?.url}
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
                />
              ) : null}
            </div>
          </Row>
          <Row className='mx-0 mt-5'>
            <div className='portfolio-section'>
              <h3>This is</h3>
              <h4 style={{ color: userData?.UserPortfolio?.header_color }}>
                Wellness
              </h4>
            </div>
          </Row>
          <Row className='mx-0'>
            <div className='col-lg-3 col-md-12 col-sm-12 ps-lg-0'>
              {userData?.UserPortfolio?.portfolioWellness?.url &&
              userData?.UserPortfolio?.portfolioWellness?.url !== '' ? (
                <div
                  className='article-document portfolio-video-height'
                  onClick={showPDFModal}
                >
                  {/* <Document
                    className='pdf-document-viewer'
                    file={`${userData?.UserPortfolio?.portfolioWellness.url}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={1} />
                  </Document> */}
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
            <div className='col-lg-8 portfolio-data col-sm-12'>
              {userData?.UserPortfolio?.portfolioWellness?.description ? (
                <p>{userData?.UserPortfolio?.portfolioWellness.description}</p>
              ) : (
                ''
              )}
            </div>
          </Row>
        </div>
      )}
      <DocumentViewer
        show={showPDFViewer}
        onHide={closePDFModal}
        articleLink={userData?.UserPortfolio?.portfolioWellness.url}
      />
    </div>
  )
}
