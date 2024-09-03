import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import PortfolioActions from './Components/Actions/PortfolioActions'
import PortfolioHeader from './Components/Header/PortfolioHeader'
import WhoAmI from './Sections/WhoAmISection/WhoAmI'
import PortfolioNavigator from './Components/PortfolioNavigator'
import PortfolioSkeletonLoader from './Components/PortfolioSkeletonLoader'
import WhatCanIDo from './Sections/WhatCanIDoSection/WhatCanIDo'
import HowDoIProve from './Sections/HowDoIProveSection/HowDoIProve'

function StudentPortfolio() {
  const [publicPortfolio, setPublicPortfolio] = useState({})
  const [privatePortfolioMessage, setPrivatePortfolioMessage] = useState()
  const activeSection = useSelector((state) => state.portfolio.activeSection)
  const [isLoading, setIsLoading] = useState(false)
  const { username } = useParams()

  console.log('publicPortfolio', publicPortfolio)
  useLayoutEffect(() => {
    setIsLoading(true)
    const getPublicPortfolioAPI = async () => {
      try {
        const response = await axiosInstance.get(
          `/hsPortfolio/userPortfolio/${username}`
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

export default StudentPortfolio
