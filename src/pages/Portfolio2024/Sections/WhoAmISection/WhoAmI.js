import React, { useEffect, useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import UserStory from './UserStory'
import MyRelationships from './MyRelationships'
import MyFailures from './MyFailures'
import MyMentors from './MyMentors'
import PortfolioSectionDataLoader from '../../Components/PortfolioSectionDataLoader'

function WhoAmI({ loadings: propsLoadings, data, user }) {
  const [loadings, setLoadings] = useState(null)
  console.log('user', user)

  useEffect(() => {
    if (propsLoadings) {
      setLoadings(propsLoadings)
    }
  }, [propsLoadings])

  const renderSection = (
    loading,
    type,
    title,
    Component,
    componentData,
    height
  ) => {
    return !loading ? (
      <PortfolioDataContainer title={title} type={type} height={height}>
        <Component data={componentData} user={user} />
      </PortfolioDataContainer>
    ) : (
      <PortfolioSectionDataLoader />
    )
  }

  return (
    <div className={'d-flex flex-column gap-4'}>
      {renderSection(
        loadings?.userStory,
        'user-story',
        null,
        UserStory,
        data?.userStory?.data
      )}
      {renderSection(
        loadings?.myRelationships,
        'my-relationship',
        'My Relationships',
        MyRelationships,
        data?.myRelationships?.data
      )}
      {renderSection(
        loadings?.myFailures,
        'my-failures',
        'My Failures',
        MyFailures,
        data?.myFailures?.data,
        450
      )}
      {renderSection(
        loadings?.myMentors,
        'my-mentors',
        'My Mentors',
        MyMentors,
        data?.myMentors?.data,
        450
      )}
    </div>
  )
}

export default WhoAmI
