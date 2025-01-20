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
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { setBackButton} from '../../redux/backButtonReducer' 

function StudentPortfolio() {
  const [publicPortfolio, setPublicPortfolio] = useState({})
  const [privatePortfolioMessage, setPrivatePortfolioMessage] = useState()
  const activeSection = useSelector((state) => state.portfolio.activeSection)
  const [isLoading, setIsLoading] = useState(false)
  const { username } = useParams()

  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    setIsLoading(true)
    const getPublicPortfolioAPI = async () => {
      try {
        const response = await axiosInstance.get(
          `/hsPortfolio/studentPortfolio/${username}`
        )
        if (response.data.privateMessage) {
          setPrivatePortfolioMessage(response.data.privateMessage)
        } else {
          setPublicPortfolio(response.data)
        }
        setIsLoading(false)
      } catch (error) {
        toast.error(error?.response?.data?.error)
        setIsLoading(false)
      }
    }

    getPublicPortfolioAPI()
  }, [username])

  useEffect(() => {
  
      dispatch(setBackButton(true, 'my-students'))
  
    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch, location.state?.from])

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
        userStory={publicPortfolio?.whoAmI?.userBasicInfo}
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
