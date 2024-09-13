import React, { useEffect } from 'react'
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
  return (
    <div
      className={`portfolio-container ${
        mode === 'edit' ? 'portfolio_edit-mode' : 'portfolio_preview-mode'
      }`}
    >
      {!areLoadingSharingSettings ? (
        <PortfolioActions
          actions={[
            { type: 'edit', action: () => changeMode('edit') },
            { type: 'preview', action: () => changeMode('preview') },
            {
              type: 'publish',
              action: () => setPublishModalVisibility(true),
              isDisplayed: true
            },
            {
              type: 'share',
              action: () => setShareModalVisibility(true),
              isDisplayed:
                sharingSettings?.isPublicShared || sharingSettings?.isPeerShared
            }
          ]}
        />
      ) : (
        <PortfolioActionsSkeleton />
      )}
      <PortfolioHeader userStory={userStory} user={loggedUser} />
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
      <PortfolioNavigator />
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
