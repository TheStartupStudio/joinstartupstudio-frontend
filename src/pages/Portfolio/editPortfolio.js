import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ReactPlayer from 'react-player'
import { FormattedMessage } from 'react-intl'
// import { Document, Page } from 'react-pdf'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLinkedinIn,
  faTwitterSquare,
  faInstagram,
  faFacebookSquare
} from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import PortfolioArticleModal from '../../components/Modals/portfolioArticleModal'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import profileImage from '../../assets/images/profile-image.png'
import portfolioVideo from '../../assets/images/video.png'

function EditPortfolio() {
  const [user, setUser] = useState({})
  const [userPortfolio, setUserPortfolio] = useState({})
  const [empowermentVideo, setEmpowermentVideo] = useState({})
  const [performanceVideo, setPerformanceVideo] = useState({})
  const [wellnessArticle, setWellnessArticle] = useState({})
  const [canPublishPortfolio, setCanPublishPortfolio] = useState(false)
  const [titleColor, setTitleColor] = useState('#01C5D1')
  const [numPages, setNumPages] = useState(null)
  const [articleImageName, setArticleImageName] = useState('')
  const [showPDFViewer, setShowPDFViewer] = useState(false)
  const [saving, setSaving] = useState(false)
  const userId = useSelector((state) => state.user.user.user.id)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const clientBaseURL = `${process.env.REACT_APP_CLIENT_BASE_URL}`

  const closePDFModal = () => setShowPDFViewer(false)
  const showPDFModal = () => setShowPDFViewer(true)

  useEffect(() => {
    getUserData()
    getUserPortfolio()
  }, [])

  const getUserData = async () => {
    await axiosInstance.get(`/users/${userId}`).then((response) => {
      setUser(response.data)
    })
  }

  const getUserPortfolio = async () => {
    await axiosInstance.get(`/portfolio`).then((response) => {
      setUserPortfolio(response.data)
      setEmpowermentVideo(response.data.portfolioEmpowerment)
      setPerformanceVideo(response.data.portfolioPerformance)
      setWellnessArticle(response.data.portfolioWellness)
      if (response.data.header_color) {
        setTitleColor(response.data.header_color)
      }
      checkPortfolio(response.data)
    })
  }

  const checkPortfolio = (portfolio) => {
    if (
      portfolio?.portfolioEmpowerment?.url &&
      portfolio?.portfolioEmpowerment?.url !== '' &&
      portfolio?.portfolioEmpowerment?.description &&
      portfolio?.portfolioEmpowerment?.description !== '' &&
      portfolio?.portfolioPerformance?.url &&
      portfolio?.portfolioPerformance?.url !== '' &&
      portfolio?.portfolioPerformance?.description &&
      portfolio?.portfolioPerformance?.description !== '' &&
      portfolio?.portfolioWellness.url &&
      portfolio?.portfolioWellness.url !== '' &&
      portfolio?.portfolioWellness.description &&
      portfolio?.portfolioWellness.description !== ''
    ) {
      setCanPublishPortfolio(true)
    }
  }

  const publishPortfolio = async () => {
    const params = {
      is_published: true
    }
    await axiosInstance
      .put(`/portfolio`, params)
      .then(() => {
        setUserPortfolio((prevValues) => ({
          ...prevValues,
          is_published: true
        }))
      })
      .catch((err) => err)
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'headerColorMobile') {
      setUserPortfolio((prevValues) => ({
        ...prevValues,
        header_color: value
      }))
    } else {
      setUserPortfolio((prevValues) => ({
        ...prevValues,
        [name]: value
      }))
    }
    setTitleColor(value)
  }

  const handleEmpowermentVideoChange = (event) => {
    const { name, value } = event.target

    setEmpowermentVideo((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const handlePerformanceVideoChange = (event) => {
    const { name, value } = event.target

    setPerformanceVideo((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  const handleWellnessArticleChange = (event) => {
    const { name, value } = event.target

    setWellnessArticle((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const handleArticleLinkChange = async (event) => {
    const formData = new FormData()
    formData.append('document', event)
    setArticleImageName(event.name)
    await axiosInstance
      .post('/upload/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((response) => {
        setWellnessArticle((prevValues) => ({
          ...prevValues,
          url: response.data.fileLocation
        }))
      })
      .catch((err) => err)
  }

  const changePortfolio = async (event) => {
    setSaving(true)
    event.preventDefault()

    const params = {
      header_color: userPortfolio?.header_color,
      headshotImgUrl: user?.profile_image,
      empowermentData: empowermentVideo,
      performanceData: performanceVideo,
      wellnessData: wellnessArticle
    }

    await axiosInstance.put(`/portfolio`, params).then((response) => {
      setSaving(false)
      setEmpowermentVideo(response.data.empowermentData)
      setPerformanceVideo(response.data.performanceData)
      setWellnessArticle(response.data.wellnessData)
      if (response.data.header_color) {
        setTitleColor(response.data.header_color)
      }
      checkPortfolio(response.data)
    })
  }

  return (
    <div id='main-body'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 col-md-9 px-0'>
            <div className='page-padding'>
              <div className='d-flex'>
                <h3 className='page-title'>
                  <IntlMessages id='navigation.portfolio' /> |{' '}
                  <Link to='/portfolio'>
                    <IntlMessages id='portfolio.preview' />
                  </Link>
                </h3>
                {userPortfolio?.is_published === true ? null : (
                  <h3
                    className='page-title desktop-menu'
                    style={{
                      marginLeft: 'auto',
                      textTransform: 'uppercase',
                      color:
                        canPublishPortfolio === true ? '#333D3D' : '#BBBDBF',
                      cursor: canPublishPortfolio === true ? 'pointer' : ''
                    }}
                    onClick={
                      canPublishPortfolio === true ? publishPortfolio : null
                    }
                  >
                    <IntlMessages id='portfolio.publish_portfolio' />
                  </h3>
                )}
              </div>
              <p className='page-description'>
                {`${clientBaseURL}/public-portfolio/${encodeURIComponent(user.username)}`}
              </p>
              <div className='mt-3'>
                <p
                  style={{ fontSize: '24px', lineHeight: '29px' }}
                  className='mobile-menu'
                >
                  <IntlMessages id='portfolio.set_up_my_portfolio' />
                </p>
                <p className='portfolio-instruction'>
                  <IntlMessages id='portfolio.instructions' />
                </p>
                <div className='row'>
                  <div className='col-lg-8 edit-portfolio-text'>
                    <p>
                      <IntlMessages id='portfolio.edit_portfolio_txt1' />
                      {currentLanguage === 'en' ? (
                        <>
                          <Link to='/profile' className='mx-1 link'>
                            <IntlMessages id='portfolio.visit_profile' />
                          </Link>
                          <IntlMessages id='portfolio.edit_portfolio_txt1_1' />
                        </>
                      ) : (
                        <>
                          <IntlMessages id='portfolio.edit_portfolio_txt1_1' />
                          <Link to='/profile' className='ml-1 link'>
                            <IntlMessages id='portfolio.visit_profile' />
                          </Link>
                        </>
                      )}
                    </p>
                    <p>
                      <IntlMessages id='portfolio.edit_portfolio_txt2' />
                    </p>
                    <p>
                      <IntlMessages id='portfolio.edit_portfolio_txt3' />
                    </p>
                  </div>
                  <div className='col-lg-4 desktop-menu'>
                    <p className='text-center'>
                      <IntlMessages id='portfolio.choose_your_header_color' />
                    </p>
                    <div className='d-flex ml-2'>
                      <div
                        className='rectangle portfolio-colors-rectangle'
                        style={{ background: '#01C5D1' }}
                      />
                      <div
                        className='rectangle portfolio-colors-rectangle'
                        style={{ background: '#A7CA42' }}
                      />
                      <div
                        className='rectangle'
                        style={{ background: '#F2359D' }}
                      />
                    </div>
                    <div className='portfolio-colors d-flex mt-2 ml-2'>
                      <input
                        type='radio'
                        className='portfolio-colors-input'
                        name='header_color'
                        value='#01C5D1'
                        checked={titleColor === '#01C5D1' ? true : false}
                        onChange={handleChange}
                      />
                      <input
                        type='radio'
                        className='portfolio-colors-input'
                        name='header_color'
                        value='#A7CA42'
                        checked={titleColor === '#A7CA42' ? true : false}
                        onChange={handleChange}
                      />
                      <input
                        type='radio'
                        name='header_color'
                        value='#F2359D'
                        checked={titleColor === '#F2359D' ? true : false}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-12'>
                  <h5 className='learn-to-start'>
                    <IntlMessages id='portfolio.learn_to_start' />
                  </h5>
                </div>
              </div>
              <div className='col-md-12 mobile-menu mb-3 mt-3'>
                <div className='create-portfolio'>
                  <p>
                    <IntlMessages id='portfolio.choose_your_header_color' />
                  </p>
                  <div className='d-flex ml-2'>
                    <div
                      className='rectangle portfolio-colors-rectangle'
                      style={{ background: '#01C5D1' }}
                    />
                    <div
                      className='rectangle portfolio-colors-rectangle'
                      style={{ background: '#A7CA42' }}
                    />
                    <div
                      className='rectangle'
                      style={{ background: '#F2359D' }}
                    />
                  </div>
                </div>
                <div className='portfolio-colors d-flex mt-2 ml-2'>
                  <input
                    type='radio'
                    className='portfolio-colors-input'
                    name='headerColorMobile'
                    value='#01C5D1'
                    checked={titleColor === '#01C5D1' ? true : false}
                    onChange={handleChange}
                  />
                  <input
                    type='radio'
                    className='portfolio-colors-input'
                    name='headerColorMobile'
                    value='#A7CA42'
                    checked={titleColor === '#A7CA42' ? true : false}
                    onChange={handleChange}
                  />
                  <input
                    type='radio'
                    name='headerColorMobile'
                    value='#F2359D'
                    checked={titleColor === '#F2359D' ? true : false}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className='row mb-5'>
                <div className='col-md-12 col-lg-3'>
                  <img
                    className='mobile-menu'
                    src={
                      user?.profile_image ? user.profile_image : profileImage
                    }
                    alt='#'
                    width='35%'
                  />
                  <img
                    className='desktop-menu'
                    src={
                      user?.profile_image ? user.profile_image : profileImage
                    }
                    alt='#'
                    width='100%'
                  />
                  <div className='desktop-menu d-flex mt-3'>
                    {user?.social_links?.linkedIn && (
                      <a
                        href={
                          user.social_links.linkedIn.startsWith('https')
                            ? user.social_links.linkedIn
                            : `https://${user.social_links.linkedIn}`
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
                    {user?.social_links?.twitter && (
                      <a
                        href={
                          user.social_links.twitter.startsWith('https')
                            ? user.social_links.twitter
                            : `https://${user.social_links.twitter}`
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
                    {user?.social_links?.instagram && (
                      <a
                        href={
                          user.social_links.instagram.startsWith('https')
                            ? user.social_links.instagram
                            : `https://${user.social_links.instagram}`
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
                    {user?.social_links?.facebook && (
                      <a
                        href={
                          user.social_links.facebook.startsWith('https')
                            ? user.social_links.facebook
                            : `https://${user.social_links.facebook}`
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
                    {user?.social_links?.website && (
                      <a
                        href={
                          user.social_links.website.startsWith('https')
                            ? user.social_links.website
                            : `https://${user.social_links.website}`
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
                  </div>
                </div>
                <div className='col-md-12 col-lg-9'>
                  <div className='portfolio-data '>
                    <h2>{user.name}</h2>
                    {user.profession && <h5>{user.profession}</h5>}
                    <div className='mobile-menu'>
                      <div className='d-flex mb-2 justify-content-start'>
                        {user?.social_links?.linkedIn && (
                          <a
                            href={
                              user.social_links.linkedIn.startsWith('https')
                                ? user.social_links.linkedIn
                                : `https://${user.social_links.linkedIn}`
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

                        {user?.social_links?.twitter && (
                          <a
                            href={
                              user.social_links.twitter.startsWith('https')
                                ? user.social_links.twitter
                                : `https://${user.social_links.twitter}`
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
                        {user?.social_links?.instagram && (
                          <a
                            href={
                              user.social_links.instagram.startsWith('https')
                                ? user.social_links.instagram
                                : `https://${user.social_links.instagram}`
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
                        {user?.social_links?.facebook && (
                          <a
                            href={
                              user.social_links.facebook.startsWith('https')
                                ? user.social_links.facebook
                                : `https://${user.social_links.facebook}`
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
                        {user?.social_links?.website && (
                          <a
                            href={
                              user.social_links.website.startsWith('https')
                                ? user.social_links.website
                                : `https://${user.social_links.website}`
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
                      </div>
                    </div>
                    <p>
                      {user.bio ? (
                        user.bio.split(' ').splice(0, 150).join(' ')
                      ) : (
                        <IntlMessages id='portfolio.user_bio' />
                      )}
                    </p>
                  </div>
                  <div className='link mb-1'>
                    <a
                      href={
                        userPortfolio.is_published === true
                          ? `${clientBaseURL}/profile/${user.username}`
                          : `/profile-preview`
                      }
                      target={
                        userPortfolio.is_published === true ? '_blank' : ''
                      }
                    >
                      <IntlMessages id='general.view_profile' />
                    </a>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12 col-lg-12'>
                  <div className='portfolio-section'>
                    <h3>
                      <IntlMessages id='portfolio.this_is' />
                    </h3>
                    <h4 style={{ color: titleColor }}>
                      <IntlMessages id='portfolio.empowerement' />{' '}
                    </h4>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12 col-lg-4'>
                  <div className='edit-portfolio-section'>
                    {empowermentVideo?.url && empowermentVideo?.url !== '' ? (
                      <ReactPlayer
                        className='portfolio-video-height'
                        height='210px'
                        width='100%'
                        url={empowermentVideo.url}
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
                    ) : (
                      <img src={portfolioVideo} alt='#' />
                    )}
                    <div
                      className={
                        currentLanguage === 'en'
                          ? 'create-portfolio mt-2'
                          : 'create-portfolio-es mt-2'
                      }
                    >
                      <FormattedMessage id='portfolio.i_am_video_link'>
                        {(placeholder) => (
                          <input
                            type='text'
                            name='url'
                            placeholder={placeholder}
                            onChange={handleEmpowermentVideoChange}
                            value={empowermentVideo?.url}
                          />
                        )}
                      </FormattedMessage>
                    </div>
                  </div>
                </div>
                <div className='col-md-12 col-lg-8'>
                  <div className='create-portfolio'>
                    <FormattedMessage id='portfolio.i_am_video_description'>
                      {(placeholder) => (
                        <textarea
                          type='text'
                          name='description'
                          onChange={handleEmpowermentVideoChange}
                          placeholder={placeholder}
                          value={empowermentVideo?.description}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>
              </div>
              <div className='row mt-3'>
                <div className='col-lg-12'>
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
              </div>
              <div className='row mt-3'>
                <div className='col-md-12 col-lg-8'>
                  <div className='create-portfolio'>
                    <FormattedMessage id='portfolio.promo_video_description'>
                      {(placeholder) => (
                        <textarea
                          type='text'
                          name='description'
                          onChange={handlePerformanceVideoChange}
                          placeholder={placeholder}
                          value={performanceVideo?.description}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>
                <div className='col-md-12 col-lg-4'>
                  <div className='edit-portfolio-section'>
                    {performanceVideo?.url && performanceVideo?.url !== '' ? (
                      <ReactPlayer
                        className='portfolio-video-height'
                        height='210px'
                        width='100%'
                        url={performanceVideo?.url}
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
                      <div className='edit-portfolio-section'>
                        <img
                          src={portfolioVideo}
                          alt='#'
                          width='100% !important'
                        />
                      </div>
                    )}
                    <div
                      className={
                        currentLanguage === 'en'
                          ? 'create-portfolio mt-2'
                          : 'create-portfolio-es mt-2'
                      }
                    >
                      <FormattedMessage id='portfolio.promo_video_link'>
                        {(placeholder) => (
                          <input
                            type='text'
                            name='url'
                            placeholder={placeholder}
                            onChange={handlePerformanceVideoChange}
                            value={performanceVideo?.url}
                          />
                        )}
                      </FormattedMessage>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row col-lg-12'>
                <div className='portfolio-section'>
                  <h3>
                    <IntlMessages id='portfolio.this_is' />
                  </h3>
                  <h4 style={{ color: titleColor }}>
                    <IntlMessages id='portfolio.wellness' />
                  </h4>
                </div>
              </div>
              <div className='row'>
                <div className='col-md-12 col-lg-4'>
                  <div className='edit-portfolio-section center'>
                    {wellnessArticle ? (
                      <div
                        className='article-document portfolio-video-height'
                        onClick={showPDFModal}
                      >
                        {/* <Document
                          className='pdf-document-viewer'
                          file={`${wellnessArticle.url}`}
                          onLoadSuccess={onDocumentLoadSuccess}
                        >
                          <Page pageNumber={1} />
                        </Document> */}
                      </div>
                    ) : (
                      <img src={profileImage} alt='#' />
                    )}

                    <div className='input-group custom-file-label p-0 mt-3 mx-auto w-100'>
                      <div className='p-0 w-100'>
                        <label className='wellness-label w-100 p-0 pt-2'>
                          <input
                            type='file'
                            id='inputGroupFile'
                            name='profile_image'
                            accept='application/pdf'
                            onChange={(event) => {
                              handleArticleLinkChange(event.target.files[0])
                            }}
                          />{' '}
                          <div className='wellness-button float-end py-2 text-center '>
                            <IntlMessages id='general.browse' />
                          </div>
                          {articleImageName !== '' ? (
                            articleImageName
                          ) : (
                            <IntlMessages id='portfolio.article_link' />
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='col-md-12 col-lg-8'>
                  <div className='create-portfolio'>
                    <FormattedMessage id='portfolio.article_description'>
                      {(placeholder) => (
                        <textarea
                          type='text'
                          name='description'
                          onChange={handleWellnessArticleChange}
                          placeholder={placeholder}
                          value={wellnessArticle?.description}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>
              </div>
              <div className='text-center mb-5'>
                {saving ? (
                  <button className='edit-button' type='button'>
                    <span className='spinner-border spinner-border-sm'></span>
                  </button>
                ) : (
                  <button className='edit-button' onClick={changePortfolio}>
                    <IntlMessages id='portfolio.save_changes' />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <PortfolioArticleModal
          show={showPDFViewer}
          onHide={closePDFModal}
          articleLink={wellnessArticle?.url}
        />
      </div>
    </div>
  )
}
export default EditPortfolio
