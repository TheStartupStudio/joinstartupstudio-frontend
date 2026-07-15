import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import './Portfolio.css'
import whoami from '../../assets/images/whoami.png'
import MyPortfolio from '../../assets/images/my-portfolio-new.png'
import PublishPortfolioIcon from '../../assets/images/publish-portfolio-icon.svg'
import UnPublishIcon from '../../assets/images/unpublisht-portfolio.svg'
import ViewPortfolioIcon from '../../assets/images/view-portfolio-icon.svg'
import SharePortfolioIcon from '../../assets/images/share-portfolio-icon.svg'
import LeftArrow from '../../assets/images/arrow-left.svg'
import RightArrow from '../../assets/images/arrow-right.svg'
import CopyUrl from '../../assets/images/cop-url.svg'
import WhoAmI from './whoami'
import WhatCanIDo from './whatcanido'
import HowDoIProveIt from './howdoiproveit'
import Start from './start'
import StartProd from './startProd'
import StartCompetitiveness from './startcompetitiveness'
import Select from 'react-select'
import axiosInstance from '../../utils/AxiosInstance'
import LtsContainerWrapper from '../../ui/LtsContainerWrapper'

import {
  getMyCompetitiveness,
  getMyCredentials,
  getMyEducations,
  getMyFailures,
  getMyImmersions,
  getMyMentors,
  getMyRelationships,
  getMyWorkExperiences,
  getSharingSettings,
  getUserBasicInfo,
  getUserStory,
  getMyProjectsAPI,
  getProjects
} from '../../redux/newPortfolio/Actions'

const Portfolio = (props) => {
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user)

  const isRole4 = user?.user?.role_id === 5
  const sections = [
    { key: 'who-am-i', label: 'Who Am I?' },
    { key: 'what-can-i-do', label: 'What Can I Do?' },
    { key: 'how-do-i-prove-it', label: 'How Do I Prove it?' },
    ...(isRole4 ? [] : [{ key: 'start', label: 'Start' }]) // Only include Start if not role 4
  ]
  const [activeSection, setActiveSection] = useState(sections[0].key)
  const [refreshData, setRefreshData] = useState(false)

  // Modal & form state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [isUnpublishModalOpen, setIsUnpublishModalOpen] = useState(false)
  const [selectedPages, setSelectedPages] = useState([])
  const [startingPage, setStartingPage] = useState('')
  const [sharingSettings, setSharingSettings] = useState(null)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isFullscreenView, setIsFullscreenView] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Add isPreviewMode state
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [activeSection])

  const handlePrevious = () => {
    const currentIndex = sections.findIndex(
      (section) => section.key === activeSection
    )
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].key)
    }
  }

  const handleNext = () => {
    const currentIndex = sections.findIndex(
      (section) => section.key === activeSection
    )
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].key)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Fetch sharing settings from backend
  const fetchSharingSettings = async () => {
    try {
      const { data } = await axiosInstance.get('/hsPortfolio/sharingSettings')
      setSharingSettings(data)
    } catch (error) {
      console.error('Error fetching sharing settings:', error)
    }
  }

  useEffect(() => {
    dispatch(getUserBasicInfo())
    dispatch(getUserStory())
    dispatch(getMyWorkExperiences())
    dispatch(getMyEducations())
    dispatch(getMyCredentials())
    dispatch(getMyCompetitiveness())
    dispatch(getMyImmersions())
    dispatch(getMyRelationships())
    dispatch(getMyMentors())
    dispatch(getMyFailures())
    dispatch(getProjects())
    fetchSharingSettings()
  }, [dispatch, refreshData])

  // Initialize form with existing data when modal opens
  useEffect(() => {
    if (isPublishModalOpen && sharingSettings) {
      setSelectedPages(sharingSettings.pagesToPublish || [])
      setStartingPage(sharingSettings.startingPage || '')
    }
  }, [isPublishModalOpen, sharingSettings])

  const {
    userBasicInfo,
    myRelationships,
    myFailures,
    myMentors,
    myProjects,
    myAlignments,
    myProductivity
  } = useSelector((state) => ({
    userBasicInfo: state.newPortfolio.whoSection.userBasicInfo,
    myRelationships: state.newPortfolio.whoSection.myRelationships,
    myFailures: state.newPortfolio.whoSection.myFailures,
    myMentors: state.newPortfolio.whoSection.myMentors,
    myProjects: state.newPortfolio.whatSection.myProjects,
    myAlignments: state.newPortfolio.howSection.myAlignments,
    myProductivity: state.newPortfolio.howSection.myProductivity
  }))

  const educations = myAlignments?.educations
  const workExperiences = myProductivity?.workExperiences

  const getPortfolioUrl = () => {
    const username = user?.user?.username || 'user'
    const currentOrigin = window.location.origin
    return `${currentOrigin}/public-portfolio/${encodeURIComponent(username)}`
  }

  const pages = [
    'Who am I?',
    'What can I do?',
    'How Do I Prove it?',
    'Start - Alignment',
    'Start - Productivity',
    'Start - Competitiveness'
  ]

  const startingOptions = [
    { value: 'Who am I?', label: 'Who am I?' },
    { value: 'Start - Alignment', label: 'Start - Alignment' }
  ]

  const togglePageSelection = (page) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page]
    )
  }

  const canPublish =
    (selectedPages.includes('Who am I?') ||
      selectedPages.some((page) => page.startsWith('Start'))) &&
    startingPage

  const handlePublish = async () => {
    setIsLoading(true)
    try {
      const payload = {
        pagesToPublish: selectedPages,
        startingPage,
        isPublicShared: true
      }

      const endpoint = '/hsPortfolio/sharingSettings'
      const response = await axiosInstance.post(endpoint, payload)

      setSharingSettings(response.data)
      setIsPublishModalOpen(false)
    } catch (error) {
      console.error('Publish error:', error)
      alert('Failed to save sharing settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnpublish = async () => {
    setIsLoading(true)
    try {
      const payload = {
        pagesToPublish: [],
        startingPage: '',
        isPublicShared: false
      }

      const response = await axiosInstance.post(
        '/hsPortfolio/sharingSettings',
        payload
      )
      setSharingSettings(response.data)
      setIsUnpublishModalOpen(false)
    } catch (error) {
      console.error('Unpublish error:', error)
      alert('Failed to unpublish portfolio. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getPortfolioUrl())
      alert('URL copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy URL:', error)
      alert('Failed to copy URL to clipboard')
    }
  }

  // Update the fullscreen view logic to set preview mode
  const handleToggleFullscreen = () => {
    setIsFullscreenView(!isFullscreenView)
    setIsPreviewMode(!isFullscreenView) // Set preview mode when entering fullscreen
  }

  useEffect(() => {
    if (!isFullscreenView) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.classList.add('portfolio-preview-open')
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.classList.remove('portfolio-preview-open')
      document.body.style.overflow = previousOverflow
    }
  }, [isFullscreenView])

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'who-am-i':
        return (
          <WhoAmI
            sectionTitle='WHO AM I?'
            sectionDescription='LTS participants communicate the value they have produced in themselves through Story, Relationship, Mentorship and Failure'
            userBasicInfo={userBasicInfo?.data}
            myRelationships={myRelationships?.data}
            myFailures={myFailures?.data}
            myMentors={myMentors?.data}
            isPreviewMode={isPreviewMode} // Add this prop
          />
        )
      case 'what-can-i-do':
        return (
          <WhatCanIDo
            sectionTitle='WHAT CAN I DO?'
            sectionDescription='LTS participants communicate the value they have produced in themselves through the outcomes of Learn, Develop and Brand'
            myProjects={myProjects}
            setRefreshData={setRefreshData}
            userBasicInfo={userBasicInfo?.data}
            isPreviewMode={isPreviewMode} // Add this prop
          />
        )
      case 'how-do-i-prove-it':
        return (
          <HowDoIProveIt
            sectionTitle='HOW DO I PROVE IT?'
            sectionDescription='LTS participants communicate the value they have produced in themselves through the outcomes of Alignment, Productivity, and Competitiveness.'
            educations={educations?.data}
            workExprience={workExperiences?.data}
            userBasicInfo={userBasicInfo?.data}
            isPreviewMode={isPreviewMode} // Add this prop
          />
        )
      case 'start':
        return (
          <Start
            sectionTitle='START: ALIGNMENT'
            sectionDescription='My ability to prove the quality of my outcomes through the test metrics of alignment, productivity, and competitiveness.'
            userBasicInfo={userBasicInfo?.data}
            isPreviewMode={isPreviewMode} // Add this prop
          />
        )
      default:
        return null
    }
  }

  const renderNavigationButtons = () => {
    const currentIndex = sections.findIndex(
      (section) => section.key === activeSection
    )
    const isFirst = currentIndex === 0
    const isLast = currentIndex === sections.length - 1

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
          padding: '20px'
        }}
      >
        <div
          onClick={handlePrevious}
          disabled={isFirst}
          style={{
            color: isFirst ? '#999' : 'black',
            border: 'none',
            cursor: isFirst ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <img
            src={LeftArrow}
            width={16}
            style={{
              opacity: isFirst ? 0.5 : 1
            }}
          />
          Previous
        </div>

        <div
          onClick={handleNext}
          disabled={isLast}
          style={{
            color: isLast ? '#999' : 'black',

            cursor: isLast ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Next
          <img
            src={RightArrow}
            width={16}
            style={{
              opacity: isLast ? 0.5 : 1
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <LtsContainerWrapper
      title={props.archived ? 'Archived Portfolio' : 'My Portfolio'}
      titleDescription='Complete your assigned tasks, work toward building your Market-Ready Portfolio and develop your Market-Ready skills.'
      className={`portfolio-lts-container${
        isFullscreenView ? ' portfolio-lts-container--previewing' : ''
      }`}
      showBreadcrumbs={false}
    >
      <div>
        {!isFullscreenView ? (
          // Normal View
          <>
            {/* <div className={` ${props.containerClassname} ${sharingSettings && sharingSettings.isPublicShared
                            ? 'view-portfolio-con'
                            : 'preview-portfolio-container'}
                            
                            
                            
                            
                            portfolio-container`}> */}
            <div className={`${props.containerClassname}  portfolio-container`}>
              <div
                className='section-description-container '
                style={{ marginBottom: '15px' }}
              >
                <div
                  className='portf-section-maintitle'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    margin: '10px 0'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '5px'
                    }}
                  >
                    <img src={MyPortfolio} width={30} alt='Portfolio Icon' />
                    <div
                      style={{
                        fontFamily: 'Montserrat',
                        fontSize: '21px',
                        fontStyle: 'normal',
                        fontWeight: '500',
                        lineHeight: 'normal',
                        textTransform: 'uppercase',
                        marginLeft: '9px'
                      }}
                    >
                      {props.archived ? 'ARCHIVED PORTFOLIO' : 'MY PORTFOLIO'}
                    </div>
                  </div>
                  <div
                    style={{ display: 'flex' }}
                    className='portf-main-title-btn-container'
                  >
                    {sharingSettings && sharingSettings.isPublicShared && (
                      <div className='gradient-wrapper'>
                        <div
                          className='publish-buttons'
                          onClick={() =>
                            !isRole4 && setIsUnpublishModalOpen(true)
                          }
                          style={{ background: isRole4 ? '#e0e0e0' : 'white' }}
                        >
                          <div>
                            <img src={UnPublishIcon} alt='UnPublishIcon' />
                          </div>
                          <div
                            style={{
                              padding: '7px',
                              cursor: isRole4 ? 'not-allowed' : 'pointer',
                              color: '#000',
                              fontFamily: 'Montserrat',
                              fontSize: '17px',
                              fontStyle: 'normal',
                              fontWeight: '600',
                              lineHeight: '1',
                              fontVariant: 'all-small-caps'
                            }}
                          >
                            UNPUBLISH PORTFOLIO
                          </div>
                        </div>
                      </div>
                    )}

                    <div className='gradient-wrapper'>
                      <div
                        className='publish-buttons'
                        onClick={() => !isRole4 && setIsPublishModalOpen(true)}
                        style={{
                          background: 'white',
                          padding: '7px',
                          cursor: 'pointer',
                          cursor: isRole4 ? 'not-allowed' : 'pointer',
                          fontFamily: 'Montserrat',
                          fontSize: '17px',
                          fontStyle: 'normal',
                          fontWeight: '600',
                          lineHeight: '1',
                          fontVariant: 'all-small-caps'
                        }}
                      >
                        <img src={PublishPortfolioIcon} alt='Publish icon' />
                        {sharingSettings?.isPublicShared
                          ? 'Republish Portfolio'
                          : 'Publish Portfolio'}
                      </div>
                    </div>

                    {sharingSettings && sharingSettings.isPublicShared && (
                      <div className='gradient-wrapper'>
                        <div
                          className='publish-buttons'
                          onClick={() => setIsShareModalOpen(true)}
                        >
                          <div>
                            <img
                              src={SharePortfolioIcon}
                              alt='SharePortfolioIcon'
                            />
                          </div>
                          <div
                            style={{
                              // background: 'white',
                              padding: '7px',
                              cursor: 'pointer',
                              // background: 'white',
                              padding: '7px',
                              cursor: 'pointer',
                              color: '#000',
                              fontFamily: 'Montserrat',
                              fontSize: '17px',
                              fontStyle: 'normal',
                              fontWeight: '600',
                              lineHeight: 'normal',
                              fontVariant: 'all-small-caps'
                            }}
                          >
                            SHARE
                          </div>
                        </div>
                      </div>
                    )}

                    <div className='gradient-wrapper'>
                      <div
                        className='publish-buttons'
                        onClick={isRole4 ? null : handleToggleFullscreen}
                        style={{ cursor: isRole4 ? 'not-allowed' : 'pointer' }}
                      >
                        <div>
                          <img
                            src={ViewPortfolioIcon}
                            alt='ViewPortfolioIcon'
                          />
                        </div>
                        <div
                          style={{
                            // background: 'white',
                            padding: '7px',
                            cursor: isRole4 ? 'not-allowed' : 'pointer',

                            padding: '7px',
                            cursor: 'pointer',
                            color: '#000',
                            fontFamily: 'Montserrat',
                            fontSize: '17px',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: 'normal',
                            fontVariant: 'all-small-caps'
                          }}
                        >
                          {sharingSettings && sharingSettings.isPublicShared
                            ? 'View'
                            : 'Preview'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='portfolio-navbar'>
                {sections.map(({ key, label }) => (
                  <div
                    key={key}
                    className={`portfolio-navbar-item ${activeSection === key ? 'active' : ''
                      }`}
                    onClick={() => setActiveSection(key)}
                  >
                    {label}
                  </div>
                ))}
              </div>

              {renderActiveSection()}
              {renderNavigationButtons()}
            </div>
          </>
        ) : null}

        {isFullscreenView &&
          createPortal(
            <div className='portfolio-preview-overlay' role='dialog' aria-modal='true'>
              <button
                type='button'
                className='portfolio-preview-close'
                onClick={handleToggleFullscreen}
              >
                <img src={LeftArrow} width={20} alt='' />
                <span>Close Preview</span>
              </button>

              <div className='portfolio-preview-inner portfolio-container preview-portfolio-container'>
                <div
                  className='section-description-container'
                  style={{ marginBottom: '15px' }}
                >
                  <div
                    className='portf-section-maintitle'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      margin: '10px 0'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '5px'
                      }}
                    >
                      <img
                        src={MyPortfolio}
                        width={30}
                        alt='Portfolio Icon'
                      />
                      <div
                        style={{
                          fontFamily: 'Montserrat',
                          fontSize: '21px',
                          fontStyle: 'normal',
                          fontWeight: '500',
                          lineHeight: 'normal',
                          textTransform: 'uppercase',
                          marginLeft: '9px'
                        }}
                      >
                        {props.archived
                          ? 'ARCHIVED PORTFOLIO'
                          : 'MY PORTFOLIO'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='portfolio-navbar'>
                  {sections.map(({ key, label }) => (
                    <div
                      key={key}
                      className={`portfolio-navbar-item ${
                        activeSection === key ? 'active' : ''
                      }`}
                      onClick={() => setActiveSection(key)}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {renderActiveSection()}
                {renderNavigationButtons()}
              </div>
            </div>,
            document.body
          )}

        {isUnpublishModalOpen && (
          <div style={{ display: 'block' }} className='modal'>
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div
                  style={{
                    marginBottom: '30px'
                  }}
                >
                  <div
                    style={{
                      background: '#d1d1d1',
                      borderRadius: '50%',
                      height: '30px',
                      width: '30px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '20px'
                    }}
                  >
                    <img src={UnPublishIcon} alt='Unpublish Icon' width={20} />
                  </div>
                  <div style={{ marginTop: '10px' }}>Unpublish Portfolio?</div>
                </div>

                <p style={{ marginBottom: '30px', textAlign: 'center' }}>
                  Are you sure you want to unpublish your portfolio? If you
                  unpublish your portfolio, it will no longer be shared and
                  anyone with the link will lose access.
                </p>

                <div
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                >
                  <button
                    style={{
                      width: '200px',
                      padding: '10px',
                      borderRadius: '12px',
                      background: '#52C7D3',
                      boxShadow: '0px 4px 10px 0px #00000040',
                      color: 'white',
                      border: 'none'
                    }}
                    onClick={() => setIsUnpublishModalOpen(false)}
                    disabled={isLoading}
                  >
                    NO, TAKE ME BACK
                  </button>
                  <button
                    style={{
                      width: '200px',
                      padding: '10px',
                      borderRadius: '12px',
                      background: 'white',
                      color: '#EE3C96',
                      boxShadow: '0px 4px 10px 0px #00000040',
                      border: 'none'
                    }}
                    onClick={handleUnpublish}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'YES, UNPUBLISH'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isShareModalOpen && (
          <div style={{ display: 'block' }} className='modal'>
            <div className='modal-dialog'>
              <div className='modal-content'>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '30px'
                  }}
                >
                  <div
                    style={{
                      background: '#d1d1d1',
                      borderRadius: '50%',
                      height: '30px',
                      width: '30px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '20px'
                    }}
                  >
                    <img src={SharePortfolioIcon} alt='Share Icon' width={20} />
                  </div>
                  <div>Share Your Portfolio</div>
                </div>

                <p style={{ marginBottom: '10px', fontWeight: '500' }}>
                  Share this link with others
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '30px',
                    background: '#f5f5f5',
                    padding: '10px',
                    borderRadius: '8px'
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {getPortfolioUrl()}
                  </div>
                  <button
                    onClick={handleCopyUrl}
                    style={{
                      marginLeft: '10px',
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    <img src={CopyUrl} />
                  </button>
                </div>

                <div
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <button
                    style={{
                      width: '200px',
                      padding: '10px',
                      borderRadius: '12px',
                      background: '#52C7D3',
                      color: 'white',
                      boxShadow: '0px 4px 10px 0px #00000040',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setIsShareModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isPublishModalOpen && (
          <div style={{ display: 'block' }} className='modal'>
            <div className='modal-dialog' style={{ maxWidth: '750px' }}>
              <div className='modal-content'>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '50px'
                  }}
                >
                  <div
                    style={{
                      background: '#d1d1d1',
                      borderRadius: '50%',
                      height: '30px',
                      width: '30px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '20px'
                    }}
                  >
                    <img
                      src={PublishPortfolioIcon}
                      alt='Portfolio Icon'
                      width={20}
                    />
                  </div>
                  <div style={{ fontWeight: '500' }}>
                    {sharingSettings && sharingSettings.isPublicShared
                      ? 'Update Portfolio'
                      : 'Publish Portfolio'}
                  </div>
                </div>

                <p style={{ fontWeight: '500', color: '#000' }}>
                  Select Page(s) to Publish:
                </p>
                <p
                  style={{ fontSize: '13px' }}
                >{`(You must have either the Who Am I page or Start page selected in order to publish)`}</p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '20px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    {pages.slice(0, 3).map((page) => (
                      <div key={page}>
                        <label
                          htmlFor={page}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <input
                            type='checkbox'
                            id={page}
                            checked={selectedPages.includes(page)}
                            onChange={() => togglePageSelection(page)}
                            style={{
                              width: '16px',
                              height: '16px',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              backgroundColor: selectedPages.includes(page)
                                ? '#52C7D3'
                                : '#fff',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)'
                            }}
                          />
                          {page}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div style={{ flex: 1 }}>
                    {pages.slice(3).map((page) => (
                      <div key={page}>
                        <label
                          htmlFor={page}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <input
                            type='checkbox'
                            id={page}
                            checked={selectedPages.includes(page)}
                            onChange={() => togglePageSelection(page)}
                            style={{
                              width: '16px',
                              height: '16px',
                              appearance: 'none',
                              WebkitAppearance: 'none',
                              MozAppearance: 'none',
                              backgroundColor: selectedPages.includes(page)
                                ? '#52C7D3'
                                : '#fff',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                              cursor: 'pointer'
                            }}
                          />
                          {page}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <p
                  style={{
                    marginTop: '15px',
                    fontSize: '15px',
                    fontWeight: '500',
                    marginBottom: '30px'
                  }}
                >
                  Select Your Starting Page:
                </p>
                <Select
                  options={startingOptions}
                  value={startingOptions.find(
                    (opt) => opt.value === startingPage
                  )}
                  onChange={(selectedOption) =>
                    setStartingPage(selectedOption ? selectedOption.value : '')
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                      border: 'none',
                      padding: '2px'
                    })
                  }}
                />

                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '15px',
                    fontWeight: '600',
                    margin: '30px 0'
                  }}
                >
                  Remember, once you publish your portfolio, you can share it
                  with others and they will be able to see your work.
                </div>
                <div
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <button
                    style={{
                      width: '200px',
                      padding: '10px',
                      borderRadius: '12px',
                      background: '#DEE1E6',
                      boxShadow: '0px 4px 10px 0px #00000040',
                      outline: 'none',
                      border: 'none'
                    }}
                    onClick={() => setIsPublishModalOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      width: '200px',
                      padding: '10px',
                      borderRadius: '12px',
                      background: '#52C7D3',
                      color: 'white',
                      marginLeft: '5px',
                      boxShadow: '0px 4px 10px 0px #00000040',
                      border: 'none'
                    }}
                    onClick={handlePublish}
                    disabled={!canPublish || isLoading}
                  >
                    {isLoading
                      ? 'Saving...'
                      : sharingSettings
                        ? 'Update'
                        : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LtsContainerWrapper>
  )
}

export default Portfolio
