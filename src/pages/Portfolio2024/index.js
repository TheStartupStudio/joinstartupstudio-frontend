import React, { useEffect, useRef, useState } from 'react'
import { connect, useSelector } from 'react-redux'
import PortfolioHeader from './Components/Header/PortfolioHeader'
import PortfolioActions from './Components/Actions/PortfolioActions'
import PortfolioNavigator from './Components/PortfolioNavigator'
import WhoAmI from './Sections/WhoAmISection/WhoAmI'
import PortfolioVisibilityModal from './Components/Modals/PortfolioVisibilityModal'
import SharePortfolioModal from './Components/Modals/SharePortfolioModal'
import PortfolioActionsSkeleton from './PortfolioActionsSkeleton'

import {
  changeViewMode,
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
  setPublishModal,
  setShareModal,
  setShareModalContent
} from '../../redux/portfolio/Actions'
import WhatCanIDo from './Sections/WhatCanIDoSection/WhatCanIDo'
import HowDoIProve from './Sections/HowDoIProveSection/HowDoIProve'
import Tooltip from 'react-bootstrap/Tooltip'
import { FaPencilAlt } from 'react-icons/fa'
import { IoShareOutline } from 'react-icons/io5'
import { FaX } from 'react-icons/fa6'
import shareToPeersIcon from '../../assets/images/HS-Portfolio-Icons/Share Icon PEERS v2 (BLU)x1200.png'
import shareToPublicIcon from '../../assets/images/HS-Portfolio-Icons/Share Icon (BLU)x1200.png'
import noSharePinkIcon from '../../assets/images/HS-Portfolio-Icons/NO Share Icon (PINK)x1200.png'

const Index = ({
  loggedUser,
  activeSection,
  publishPortfolioModal,
  sharingSettings,
  areLoadingSharingSettings,
  showSharePortfolioModal,
  sharePortfolioModalContent,
  userStory,
  userBasicInfo,
  myRelationships,
  myFailures,
  myMentors,
  isLoadingUserBasicInfo,
  isLoadingUserStory,
  isLoadingMyRelationships,
  isLoadingMyFailures,
  isLoadingMyMentors,
  fetchUserBasicInfo,
  fetchUserStory,
  fetchMyRelationships,
  fetchMyFailures,
  fetchMyMentors,
  fetchSharingSettings,
  setShareContent,
  setPublishModalVisibility,
  setShareModalVisibility,
  changeMode,
  // HOW DO I PROVE IT ? //,
  fetchMyEducations,
  fetchMyCredentials,
  fetchMyImmersions,
  fetchMyWorkExperiences,
  fetchMyCompetitiveness,
  educations,
  credentials,
  immersions,
  workExperiences,
  myCompetitiveness,
  isLoadingEducations,
  isLoadingImmersions,
  isLoadingCredentials,
  isLoadingWorkExperiences,
  isLoadingCompetitiveness
}) => {
  const mode = useSelector((state) => state.portfolio.mode)
  const publishToPeers = useSelector((state) => state.portfolio.publishToPeers)
  const publishToPublic = useSelector(
    (state) => state.portfolio.publishToPublic
  )
  useEffect(() => {
    const fetchDataSequentially = async () => {
      await fetchUserBasicInfo()
      await fetchUserStory()
      await fetchMyFailures()
      await fetchMyMentors()
      await fetchMyRelationships()
      await fetchSharingSettings()
      await fetchMyEducations()
      await fetchMyCredentials()
      await fetchMyImmersions()
      await fetchMyWorkExperiences()
      await fetchMyCompetitiveness()
    }

    fetchDataSequentially()
  }, [])

  useEffect(() => {
    if (sharingSettings?.isPeerShared && !sharingSettings?.isPublicShared) {
      setShareContent({
        ...sharePortfolioModalContent,
        description: 'Share the link below with peers.'
      })
    } else if (sharingSettings?.isPublicShared) {
      setShareContent({
        ...sharePortfolioModalContent,
        description: 'Share the link below with anyone.'
      })
    }
  }, [sharingSettings])

  const shareIcon = () => {
    const iconStyle = { width: 30, height: 30, objectFit: 'contain' }
    if (sharingSettings?.isPeerShared && !sharingSettings?.isPublicShared) {
      return (
        <img
          src={shareToPeersIcon}
          style={iconStyle}
          alt={'publish-to-peers'}
        />
      )
    } else if (sharingSettings?.isPublicShared) {
      return (
        <img
          src={shareToPublicIcon}
          style={iconStyle}
          alt={'publish-to-public'}
        />
      )
    } else if (
      !sharingSettings?.isPublicShared &&
      !sharingSettings?.isPeerShared
    ) {
      return (
        <img
          src={noSharePinkIcon}
          style={iconStyle}
          alt={'publish-to-public'}
        />
      )
    }
  }

  const scrollableRef = useRef(null)

  const scrollToTop = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = 0
    }
  }

  return (
    <>
      <div ref={scrollableRef} style={{ height: '800px', overflowY: 'scroll' }}>
        <div
          style={{
            height: '800px'
          }}
        >
          <div
            className={`portfolio-container ${
              mode === 'edit' ? 'portfolio_edit-mode' : 'portfolio_preview-mode'
            }`}
            // style={{ height: '800px', }}
            // ref={scrollableRef}
          >
            {!areLoadingSharingSettings ? (
              <PortfolioActions
                actions={[
                  {
                    type: 'edit',
                    action: () => changeMode('edit'),
                    tooltipContent: (
                      <Tooltip id='tooltip' className={'tooltip-content'}>
                        Click here to return to edit mode
                      </Tooltip>
                    ),
                    icon: <FaPencilAlt className={'action-icon pencil-icon'} />
                  },
                  {
                    type: 'preview',
                    action: () => changeMode('preview'),
                    tooltipContent: (
                      <Tooltip id='tooltip' className={'tooltip-content'}>
                        Click here to preview
                      </Tooltip>
                    ),
                    icon: <FaX className={'action-icon eye-icon'} />
                  },
                  {
                    type: 'publish',
                    action: () => setPublishModalVisibility(true),
                    isDisplayed: true,
                    tooltipContent: (
                      <Tooltip id='tooltip' className={'tooltip-content '}>
                        <div className={'text-center bold-text'}>{`${
                          sharingSettings?.isPublicShared ||
                          sharingSettings?.isPeerShared
                            ? 'PUBLISHED'
                            : 'UNPUBLISHED'
                        }`}</div>

                        <div className={'text-center'}>
                          {`Click to ${
                            !sharingSettings?.isPublicShared &&
                            !sharingSettings?.isPeerShared
                              ? 'PUBLISH'
                              : 'UNPUBLISH'
                          } portfolio.`}
                        </div>
                      </Tooltip>
                    ),
                    icon: shareIcon()
                  },
                  {
                    type: 'share',
                    action: () => setShareModalVisibility(true),
                    isDisplayed:
                      sharingSettings?.isPublicShared ||
                      sharingSettings?.isPeerShared,
                    tooltipContent: (
                      <Tooltip
                        id='tooltip'
                        className={'tooltip-content text-center'}
                      >
                        <div className={'text-center'}>
                          Click here share your portfolio
                        </div>
                      </Tooltip>
                    ),
                    icon: (
                      <IoShareOutline className={'action-icon share-icon'} />
                    )
                  }
                ]}
              />
            ) : (
              <PortfolioActionsSkeleton />
            )}
            <PortfolioHeader userStory={userBasicInfo} user={loggedUser} />
            <div>
              {activeSection === 'who-section' && (
                <WhoAmI
                  data={{
                    userStory,
                    myRelationships,
                    myMentors,
                    myFailures,
                    userBasicInfo
                  }}
                  loadings={{
                    userBasicInfo: isLoadingUserBasicInfo,
                    userStory: isLoadingUserStory,
                    myRelationships: isLoadingMyRelationships,
                    myMentors: isLoadingMyMentors,
                    myFailures: isLoadingMyFailures
                  }}
                  user={loggedUser}
                />
              )}
              {activeSection === 'what-section' && (
                <>
                  <WhatCanIDo />
                </>
              )}
              {activeSection === 'how-section' && (
                <>
                  <HowDoIProve
                    data={{
                      myAlignments: {
                        educations,
                        credentials
                      },
                      myProductivity: {
                        immersions,
                        workExperiences
                      },
                      myCompetitiveness
                    }}
                    loadings={{
                      myAlignments: {
                        educations: isLoadingEducations,
                        credentials: isLoadingCredentials
                      },
                      myProductivity: {
                        immersions: isLoadingImmersions,
                        workExperiences: isLoadingWorkExperiences
                      },
                      myCompetitiveness: isLoadingCompetitiveness
                    }}
                  />
                </>
              )}
            </div>

            <PortfolioNavigator scrollToTop={scrollToTop} />
            <PortfolioVisibilityModal
              show={publishPortfolioModal}
              onHide={() => setPublishModalVisibility(false)}
              title='Share your portfolio'
              sharingSettings={sharingSettings}
            />
            <SharePortfolioModal
              show={showSharePortfolioModal}
              onHide={() => setShareModalVisibility(false)}
              modalContent={sharePortfolioModalContent}
              sharingSettings={sharingSettings}
            />
          </div>
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state) => {
  const {
    user: { user: loggedUser }
  } = state.user

  const {
    activeSection,
    publishPortfolioModal,
    sharingSettings,
    areLoadingSharingSettings,
    showSharePortfolioModal,
    showSharePortfolioModalContent: sharePortfolioModalContent,
    whoSection: {
      userBasicInfo,
      userStory,
      myRelationships,
      myFailures,
      myMentors,
      userBasicInfo: { isLoading: isLoadingUserBasicInfo },
      userStory: { isLoading: isLoadingUserStory },
      myRelationships: { isLoading: isLoadingMyRelationships },
      myFailures: { isLoading: isLoadingMyFailures },
      myMentors: { isLoading: isLoadingMyMentors }
    },
    howSection: {
      myAlignments: {
        educations,
        credentials,
        educations: { isLoading: isLoadingEducations },
        credentials: { isLoading: isLoadingCredentials }
      },
      myProductivity: {
        immersions,
        workExperiences,
        immersions: { isLoading: isLoadingImmersions },
        workExperiences: { isLoading: isLoadingWorkExperiences }
      },
      myCompetitiveness,
      myCompetitiveness: { isLoading: isLoadingCompetitiveness }
    }
  } = state.portfolio
  return {
    loggedUser,
    activeSection,
    publishPortfolioModal,
    sharingSettings,
    areLoadingSharingSettings,
    showSharePortfolioModal,
    sharePortfolioModalContent,
    userBasicInfo,
    userStory,
    myRelationships,
    myFailures,
    myMentors,
    isLoadingUserBasicInfo,
    isLoadingUserStory,
    isLoadingMyRelationships,
    isLoadingMyFailures,
    isLoadingMyMentors,
    // HOW DO I PROVE IT //
    educations,
    credentials,
    immersions,
    workExperiences,
    myCompetitiveness,
    isLoadingEducations,
    isLoadingImmersions,
    isLoadingCredentials,
    isLoadingWorkExperiences,
    isLoadingCompetitiveness
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchUserBasicInfo: () => dispatch(getUserBasicInfo()),
  fetchUserStory: () => dispatch(getUserStory()),
  fetchMyRelationships: () => dispatch(getMyRelationships()),

  fetchMyFailures: () => dispatch(getMyFailures()),
  fetchMyMentors: () => dispatch(getMyMentors()),
  fetchSharingSettings: () => dispatch(getSharingSettings()),
  setShareContent: (content) => dispatch(setShareModalContent(content)),
  setPublishModalVisibility: (visible) => dispatch(setPublishModal(visible)),
  setShareModalVisibility: (visible) => dispatch(setShareModal(visible)),
  changeMode: (mode) => dispatch(changeViewMode(mode)),
  // HOW DO I PROVE IT //
  fetchMyEducations: () => dispatch(getMyEducations()),
  fetchMyCredentials: () => dispatch(getMyCredentials()),
  fetchMyImmersions: () => dispatch(getMyImmersions()),
  fetchMyWorkExperiences: () => dispatch(getMyWorkExperiences()),
  fetchMyCompetitiveness: () => dispatch(getMyCompetitiveness())
})

export default connect(mapStateToProps, mapDispatchToProps)(Index)
