import React, { useEffect, useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import UserBasicInfo from './UserBasicInfo'
import MyRelationships from './MyRelationships'
import MyFailures from './MyFailures'
import MyMentors from './MyMentors'
import PortfolioSectionDataLoader from '../../Components/PortfolioSectionDataLoader'
import UserStory from './UserStory'

function WhoAmI({ loadings: propsLoadings, data, user, portfolioType }) {
  const [loadings, setLoadings] = useState(null)

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
  console.log('data', data)
  return (
    <div className={'d-flex flex-column gap-4'} style={{ marginTop: '30px' }}>
      {renderSection(
        loadings?.userBasicInfo,
        'user-basic-info',
        null,
        UserBasicInfo,
        data?.userBasicInfo?.data
      )}
      {data?.userStory &&
        renderSection(
          loadings?.userStory,
          'user-story',
          'My Story',
          UserStory,
          data?.userStory?.data
        )}

      {data?.myRelationships &&
        renderSection(
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
