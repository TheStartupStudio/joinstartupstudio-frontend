import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import PortfolioActions from './Components/Actions/PortfolioActions'
import PortfolioHeader from './Components/Header/PortfolioHeader'
import WhoAmI from './Sections/WhoAmISection/WhoAmI'
import PortfolioNavigator from './Components/PortfolioNavigator'
import SkeletonLoader from '../MyImmersion/SkeletonLoader/SkeletonLoader'
import PortfolioSkeletonLoader from './Components/PortfolioSkeletonLoader'

function PeerPortfolio() {
  const [publicPortfolio, setPublicPortfolio] = useState({})
  const [privatePortfolioMessage, setPrivatePortfolioMessage] = useState()
  const activeSection = useSelector((state) => state.portfolio.activeSection)
  const [isLoading, setIsLoading] = useState(false)
  const { username } = useParams()

  useLayoutEffect(() => {
    setIsLoading(true)
    const getPublicPortfolioAPI = async () => {
      try {
        const response = await axiosInstance.get(`/portfolio/${username}`)
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
      <div className="portfolio-container">
        <div className="private-portfolio-message">
          {privatePortfolioMessage}
        </div>
      </div>
    )
  }

  return (
    <div className="portfolio-container">
      <PortfolioHeader user={publicPortfolio.user} />
      {activeSection === 'who-section' && (
        <WhoAmI data={publicPortfolio.whoAmI} user={publicPortfolio.user} />
      )}
      {activeSection === 'what-section' && 'What section'}
      <PortfolioNavigator />
    </div>
  )
}

export default PeerPortfolio
