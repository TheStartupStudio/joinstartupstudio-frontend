import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import PortfolioHeader from './Components/Header/PortfolioHeader'
import WhoAmI from './Sections/WhoAmISection/WhoAmI'
import PortfolioNavigator from './Components/PortfolioNavigator'
import PortfolioSkeletonLoader from './Components/PortfolioSkeletonLoader'
import WhatCanIDo from './Sections/WhatCanIDoSection/WhatCanIDo'
import HowDoIProve from './Sections/HowDoIProveSection/HowDoIProve'

function PublicPortfolio(props) {
  const [publicPortfolio, setPublicPortfolio] = useState({})
  const [privatePortfolioMessage, setPrivatePortfolioMessage] = useState()
  const activeSection = useSelector((state) => state.portfolio.activeSection)
  const [isLoading, setIsLoading] = useState(false)
  const { username } = useParams()

  const scrollableRef = useRef(null)

  const scrollToTop = () => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    setIsLoading(true)
    const getPublicPortfolioAPI = async () => {
      try {
        const response = await axiosInstance.get(
          `/portfolio/${username ? username : props.userName}`
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
    // return <div className="loading-indicator">Loading...</div>
    return <PortfolioSkeletonLoader />
  }

  if (privatePortfolioMessage) {
    return (
      <div className='portfolio-container' style={{ marginRight: 0 }}>
        <div className='private-portfolio-message'>
          {privatePortfolioMessage}
        </div>
      </div>
    )
  }
  return (
    <div
      ref={scrollableRef}
      style={{
        height: '800px',
        overflowY: 'auto'
      }}
    >
      <div
        style={{
          height: '800px'
        }}
      >
        <div className={`portfolio-container`}>
          <PortfolioHeader
            user={publicPortfolio.user}
            userStory={publicPortfolio?.whoAmI?.userBasicInfo}
          />
          {activeSection === 'who-section' && (
            <WhoAmI
              data={publicPortfolio?.whoAmI}
              user={publicPortfolio?.user}
              portfolioType={'public'}
            />
          )}
          {activeSection === 'what-section' && (
            <>
              <WhatCanIDo
                portfolioType={'public'}
                data={publicPortfolio?.whatCanIDo}
              />
            </>
          )}
          {activeSection === 'how-section' && (
            <>
              <HowDoIProve data={publicPortfolio?.howDoIProve} />
            </>
          )}

          <PortfolioNavigator scrollToTop={scrollToTop} />
        </div>
      </div>
    </div>
  )
}

export default PublicPortfolio
