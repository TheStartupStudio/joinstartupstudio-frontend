import React, { useEffect } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import {
  getMyFailures,
  getMyMentors,
  getMyRelationships,
  getUserStory
} from '../../../../redux/portfolio/Actions'
import { useDispatch, useSelector } from 'react-redux'
import UserStory from './UserStory'
import MyRelationships from './MyRelationships'
import MyFailures from './MyFailures'
import MyMentors from './MyMentors'

function WhoAmI(props) {
  const dispatch = useDispatch()
  const userStory = useSelector((state) => state.portfolio.whoSection.userStory)
  const myFailures = useSelector(
    (state) => state.portfolio.whoSection.myFailures
  )
  const myMentors = useSelector((state) => state.portfolio.whoSection.myMentors)
  const myRelationships = useSelector(
    (state) => state.portfolio.whoSection.myRelationships
  )

  useEffect(() => {
    dispatch(getUserStory())
  }, [dispatch])
  useEffect(() => {
    dispatch(getMyFailures())
  }, [dispatch])
  useEffect(() => {
    dispatch(getMyMentors())
  }, [dispatch])
  useEffect(() => {
    dispatch(getMyRelationships())
  }, [dispatch])

  return (
    <div className={'d-flex flex-column gap-4'}>
      <PortfolioDataContainer type={'user-story'}>
        <UserStory data={userStory?.data} />
      </PortfolioDataContainer>

      <PortfolioDataContainer
        title={'My Relationships'}
        type={'my-relationship'}
      >
        <MyRelationships data={myRelationships?.data} />
      </PortfolioDataContainer>
      <PortfolioDataContainer title={'My Failures'} type={'my-failures'}>
        <MyFailures myFailures={myFailures} />
      </PortfolioDataContainer>
      <PortfolioDataContainer title={'My Mentors'} type={'my-mentors'}>
        <MyMentors myMentors={myMentors} />
      </PortfolioDataContainer>
    </div>
  )
}

export default WhoAmI
