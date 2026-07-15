import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import PortfolioHeader from './Components/Header/PortfolioHeader'
import PortfolioNavigator from './Components/PortfolioNavigator'
import PortfolioSkeletonLoader from './Components/PortfolioSkeletonLoader'
import WhoAmI from '../NewPortfolio/whoami'
import WhatCanIDo from '../NewPortfolio/whatcanido'
import HowDoIProveIt from '../NewPortfolio/howdoiproveit'
import Start from '../NewPortfolio/start'
import { changeViewMode } from '../../redux/portfolio/Actions'
import './index.css'
import '../NewPortfolio/Portfolio.css'

function PublicPortfolio(props) {
  const [publicPortfolio, setPublicPortfolio] = useState({})
  const [privatePortfolioMessage, setPrivatePortfolioMessage] = useState()
  const activeSection = useSelector((state) => state.portfolio.activeSection)
  const [isLoading, setIsLoading] = useState(false)
  const { username } = useParams()
  const dispatch = useDispatch()
  const scrollableRef = useRef(null)

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
    const getPublicPortfolioAPI = async () => {
      try {
        const rawUsername = username ? username : props.userName
        const decodedUsername = decodeURIComponent(rawUsername || '')
        const response = await axiosInstance.get(
          `/portfolio/${encodeURIComponent(decodedUsername)}`
        )
        if (response.data.privateMessage) {
          setPrivatePortfolioMessage(response.data.privateMessage)
        } else {
          setPublicPortfolio(response.data)
        }
        setIsLoading(false)
      } catch (e) {
        console.error('Error occurred during fetching user portfolio', e)
        setIsLoading(false)
      }
    }

    getPublicPortfolioAPI()
  }, [username, props.userName])

  if (isLoading) {
    return <PortfolioSkeletonLoader />
  }

  if (privatePortfolioMessage) {
    return (
      <div
        className='portfolio-container'
        style={{ marginRight: 0, background: '#e4e9f4' }}
      >
        <div className='private-portfolio-message'>
          {privatePortfolioMessage}
        </div>
      </div>
    )
  }

  const userBasicInfo = {
    ...(publicPortfolio?.whoAmI?.userBasicInfo?.data || {}),
    story:
      publicPortfolio?.whoAmI?.userStory?.data?.story ||
      publicPortfolio?.whoAmI?.userBasicInfo?.data?.story ||
      ''
  }
  const myRelationships = publicPortfolio?.whoAmI?.myRelationships?.data
  const myFailures = publicPortfolio?.whoAmI?.myFailures?.data
  const myMentors = publicPortfolio?.whoAmI?.myMentors?.data
  const myProjects = publicPortfolio?.whatCanIDo?.myProjects
  const how = publicPortfolio?.howDoIProve || {}
  const start = publicPortfolio?.start || {}

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
        />

        {activeSection === 'who-section' && (
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

        {activeSection === 'what-section' && (
          <WhatCanIDo
            myProjects={myProjects}
            userBasicInfo={userBasicInfo}
            isPublicView
            portfolioType='public'
            isPreviewMode
            hideSectionHeader
          />
        )}

        {activeSection === 'how-section' && (
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

        {activeSection === 'start-section' && (
          <Start
            userBasicInfo={userBasicInfo}
            alignmentData={start.alignment || {}}
            productivityData={start.productivity || {}}
            competitivenessData={start.competitiveness || {}}
            isPublicView
            portfolioType='public'
            isPreviewMode
            hideSectionHeader
          />
        )}

        <PortfolioNavigator scrollToTop={scrollToTop} />
      </div>
    </div>
  )
}

export default PublicPortfolio
