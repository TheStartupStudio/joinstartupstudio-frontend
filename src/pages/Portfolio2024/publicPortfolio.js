import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import PortfolioHeader from './Components/Header/PortfolioHeader'
import PortfolioNavigator from './Components/PortfolioNavigator'
import PortfolioSkeletonLoader from './Components/PortfolioSkeletonLoader'
import WhoAmI from '../NewPortfolio/whoami'
import WhatCanIDo from '../NewPortfolio/whatcanido'
import HowDoIProveIt from '../NewPortfolio/howdoiproveit'
import Start from '../NewPortfolio/start'
import {
  changeActiveSection,
  changeViewMode
} from '../../redux/portfolio/Actions'
import { getDefaultDashboard } from '../../utils/routeHelpers'
import './index.css'
import '../NewPortfolio/Portfolio.css'

const UNPUBLISHED_PORTFOLIO_MESSAGE =
  'This user has not published their portfolio yet'

const PAGE_TO_SECTION = {
  'Who am I?': 'who-section',
  'What can I do?': 'what-section',
  'How Do I Prove it?': 'how-section',
  'Start - Alignment': 'start-section',
  'Start - Productivity': 'start-section',
  'Start - Competitiveness': 'start-section'
}

const START_PAGE_TO_OPTION = {
  'Start - Alignment': { value: 'alignment', label: 'Alignment' },
  'Start - Productivity': { value: 'productivity', label: 'Productivity' },
  'Start - Competitiveness': {
    value: 'competitiveness',
    label: 'Competitiveness'
  }
}

const ALL_SECTIONS = [
  'who-section',
  'what-section',
  'how-section',
  'start-section'
]

function getVisibleSections(pagesToPublish) {
  if (!Array.isArray(pagesToPublish)) {
    return ALL_SECTIONS
  }

  const sections = new Set()
  pagesToPublish.forEach((page) => {
    const section = PAGE_TO_SECTION[page]
    if (section) sections.add(section)
  })
  return ALL_SECTIONS.filter((section) => sections.has(section))
}

function getInitialSection(startingPage, visibleSections) {
  const fromStartingPage = PAGE_TO_SECTION[startingPage]
  if (fromStartingPage && visibleSections.includes(fromStartingPage)) {
    return fromStartingPage
  }
  return visibleSections[0] || 'who-section'
}

function getPublishedStartOptions(pagesToPublish) {
  if (!Array.isArray(pagesToPublish)) {
    return Object.values(START_PAGE_TO_OPTION)
  }

  return pagesToPublish
    .map((page) => START_PAGE_TO_OPTION[page])
    .filter(Boolean)
}

function PublicPortfolio(props) {
  const [publicPortfolio, setPublicPortfolio] = useState(null)
  const activeSection = useSelector((state) => state.portfolio.activeSection)
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const loggedInUser = useSelector((state) => state.user?.user?.user)
  const [isLoading, setIsLoading] = useState(true)
  const { username } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()
  const scrollableRef = useRef(null)
  const hasRedirectedRef = useRef(false)

  const redirectForUnpublishedPortfolio = () => {
    if (hasRedirectedRef.current) return
    hasRedirectedRef.current = true

    toast.error(UNPUBLISHED_PORTFOLIO_MESSAGE)

    if (isAuthenticated) {
      const roleId = loggedInUser?.role_id
      const dashboardPath =
        roleId === 2 || roleId === 3
          ? '/admin-dashboard'
          : getDefaultDashboard(roleId)
      history.replace(dashboardPath)
    } else {
      history.replace('/')
    }
  }

  const scrollToTop = () => {
    if (scrollableRef.current) {
      if (window.innerWidth <= 768) {
        setTimeout(() => {
          scrollableRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }, 0)
      } else {
        scrollableRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
        scrollableRef.current.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }
  }

  useEffect(() => {
    dispatch(changeViewMode('preview'))
  }, [dispatch])

  useEffect(() => {
    setIsLoading(true)
    setPublicPortfolio(null)
    hasRedirectedRef.current = false

    const getPublicPortfolioAPI = async () => {
      try {
        const rawUsername = username ? username : props.userName
        const decodedUsername = decodeURIComponent(rawUsername || '')
        const response = await axiosInstance.get(
          `/portfolio/${encodeURIComponent(decodedUsername)}`
        )
        if (response.data?.privateMessage) {
          redirectForUnpublishedPortfolio()
          return
        }
        if (response.data?.user || response.data?.whoAmI || response.data?.start) {
          const visibleSections = getVisibleSections(response.data.pagesToPublish)
          const initialSection = getInitialSection(
            response.data.startingPage,
            visibleSections
          )
          dispatch(changeActiveSection(initialSection))
          setPublicPortfolio(response.data)
        } else {
          redirectForUnpublishedPortfolio()
          return
        }
      } catch (e) {
        console.error('Error occurred during fetching user portfolio', e)
        redirectForUnpublishedPortfolio()
        return
      } finally {
        setIsLoading(false)
      }
    }

    getPublicPortfolioAPI()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, props.userName, isAuthenticated])

  if (isLoading || !publicPortfolio) {
    return <PortfolioSkeletonLoader />
  }

  const pagesToPublish = publicPortfolio?.pagesToPublish
  const visibleSections = getVisibleSections(pagesToPublish)
  const publishedStartOptions = getPublishedStartOptions(pagesToPublish)

  const userBasicInfo = {
    ...(publicPortfolio?.userBasicInfo?.data ||
      publicPortfolio?.whoAmI?.userBasicInfo?.data ||
      {}),
    story:
      publicPortfolio?.whoAmI?.userStory?.data?.story ||
      publicPortfolio?.userBasicInfo?.data?.story ||
      publicPortfolio?.whoAmI?.userBasicInfo?.data?.story ||
      ''
  }
  const myRelationships = publicPortfolio?.whoAmI?.myRelationships?.data
  const myFailures = publicPortfolio?.whoAmI?.myFailures?.data
  const myMentors = publicPortfolio?.whoAmI?.myMentors?.data
  const myProjects = publicPortfolio?.whatCanIDo?.myProjects
  const how = publicPortfolio?.howDoIProve || {}
  const start = publicPortfolio?.start || {}

  const safeActiveSection = visibleSections.includes(activeSection)
    ? activeSection
    : visibleSections[0]

  return (
    <div ref={scrollableRef}>
      <div
        className='portfolio-container portfolio-tss-public'
        style={{
          marginRight: 0,
          background: 'linear-gradient(#c3e0e5, #ffffff)'
        }}
      >
        <PortfolioHeader
          user={publicPortfolio.user}
          userStory={publicPortfolio?.whoAmI?.userBasicInfo}
          visibleSections={visibleSections}
        />

        {safeActiveSection === 'who-section' &&
          visibleSections.includes('who-section') && (
            <WhoAmI
              userBasicInfo={userBasicInfo}
              myRelationships={myRelationships}
              myFailures={myFailures}
              myMentors={myMentors}
              isPublicView
              portfolioType='public'
              isPreviewMode
              hideSectionHeader
            />
          )}

        {safeActiveSection === 'what-section' &&
          visibleSections.includes('what-section') && (
            <WhatCanIDo
              myProjects={myProjects}
              userBasicInfo={userBasicInfo}
              isPublicView
              portfolioType='public'
              isPreviewMode
              hideSectionHeader
            />
          )}

        {safeActiveSection === 'how-section' &&
          visibleSections.includes('how-section') && (
            <HowDoIProveIt
              educations={how.educations || []}
              workExperiences={how.workExperiences || []}
              communityInvolvements={how.communityInvolvements || []}
              userBasicInfo={userBasicInfo}
              isPublicView
              portfolioType='public'
              isPreviewMode
              hideSectionHeader
            />
          )}

        {safeActiveSection === 'start-section' &&
          visibleSections.includes('start-section') && (
            <Start
              userBasicInfo={userBasicInfo}
              alignmentData={start.alignment || {}}
              productivityData={start.productivity || {}}
              competitivenessData={start.competitiveness || {}}
              publishedStartOptions={publishedStartOptions}
              startingPage={publicPortfolio?.startingPage}
              isPublicView
              portfolioType='public'
              isPreviewMode
              hideSectionHeader
            />
          )}

        <PortfolioNavigator
          scrollToTop={scrollToTop}
          visibleSections={visibleSections}
        />
      </div>
    </div>
  )
}

export default PublicPortfolio
