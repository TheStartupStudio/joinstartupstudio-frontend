import React, { useEffect, useState } from 'react'
import {  useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import PortfolioHeader from './Components/Header/PortfolioHeader'
import WhoAmI from './Sections/WhoAmISection/WhoAmI'
import PortfolioNavigator from './Components/PortfolioNavigator'
import PortfolioSkeletonLoader from './Components/PortfolioSkeletonLoader'
import WhatCanIDo from './Sections/WhatCanIDoSection/WhatCanIDo'
import HowDoIProve from './Sections/HowDoIProveSection/HowDoIProve'

function PeerPortfolio() {
  const [publicPortfolio, setPublicPortfolio] = useState({})
  const [privatePortfolioMessage, setPrivatePortfolioMessage] = useState()
  const activeSection = useSelector((state) => state.portfolio.activeSection)
  const [isLoading, setIsLoading] = useState(false)
  const { username } = useParams()
  useEffect(() => {
    setIsLoading(true)
    const getPublicPortfolioAPI = async () => {
      try {
        const response = await axiosInstance.get(
          `/hsPortfolio/portfolio/${username}`
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
  }, [username])

  if (isLoading) {
    return <PortfolioSkeletonLoader />
  }

  if (privatePortfolioMessage) {
    return (
      <div className='private-portfolio-message'>{privatePortfolioMessage}</div>
    )
  }

  return (
    <div className='portfolio-container'>
      <PortfolioHeader
        user={publicPortfolio.user}
        userStory={publicPortfolio?.whoAmI?.userStory}
      />
      {activeSection === 'who-section' && (
        <WhoAmI data={publicPortfolio?.whoAmI} user={publicPortfolio?.user} />
      )}
      {activeSection === 'what-section' && (
        <>
          <WhatCanIDo
            portfolioType={'peer'}
            data={publicPortfolio?.whatCanIDo}
          />
        </>
      )}
      {activeSection === 'how-section' && (
        <>
          <HowDoIProve data={publicPortfolio?.howDoIProve} />
        </>
      )}

      <PortfolioNavigator />
    </div>
  )
}

export default PeerPortfolio
