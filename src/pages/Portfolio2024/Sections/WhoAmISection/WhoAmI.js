import React, { useEffect, useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import UserBasicInfo from './UserBasicInfo'
import MyRelationships from './MyRelationships'
import MyFailures from './MyFailures'
import MyMentors from './MyMentors'
import PortfolioSectionDataLoader from '../../Components/PortfolioSectionDataLoader'
import UserStory from './UserStory'
import { useSelector } from 'react-redux'

function WhoAmI({ loadings: propsLoadings, data, user, portfolioType }) {
  const [loadings, setLoadings] = useState(null)
  const mode = useSelector((state) => state.portfolio.mode)

  const filteredUnshownData = (data) => {
    return data?.filter((data) => data.showSection)
  }
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
    <div className={'d-flex flex-column gap-4'} style={{ marginTop: '30px' }}>
      {renderSection(
        loadings?.userBasicInfo,
        'user-basic-info',
        null,
        UserBasicInfo,
        data?.userBasicInfo?.data
      )}
      {data?.userStory && data?.userStory?.data ? (
        <>
          {data?.userStory?.data?.showUserStory !== 0 &&
            mode === 'preview' &&
            renderSection(
              loadings?.userStory,
              'user-story',
              'My Story',
              UserStory,
              data?.userStory?.data
            )}

          {mode === 'edit' &&
            renderSection(
              loadings?.userStory,
              'user-story',
              'My Story',
              UserStory,
              data?.userStory?.data
            )}
        </>
      ) : (
        <>
          {renderSection(
            loadings?.userStory,
            'user-story',
            'My Story',
            UserStory,
            data?.userStory?.data
          )}
        </>
      )}

      {data?.myRelationships && data?.myRelationships?.data ? (
        <>
          {data?.myRelationships?.data?.showRelationships !== 0 &&
            mode === 'preview' &&
            renderSection(
              loadings?.myRelationships,
              'my-relationship',
              'My Relationships',
              MyRelationships,
              data?.myRelationships?.data
            )}

          {mode === 'edit' &&
            renderSection(
              loadings?.myRelationships,
              'my-relationship',
              'My Relationships',
              MyRelationships,
              data?.myRelationships?.data
            )}
        </>
      ) : (
        <>
          {renderSection(
            loadings?.myRelationships,
            'my-relationship',
            'My Relationships',
            MyRelationships,
            data?.myRelationships?.data
          )}
        </>
      )}

      {renderSection(
        loadings?.myFailures,
        'my-failures',
        'My Failures',
        MyFailures,
        mode === 'edit'
          ? data?.myFailures?.data
          : filteredUnshownData(data?.myFailures?.data),
        450
      )}

      {renderSection(
        loadings?.myMentors,
        'my-mentors',
        'My Mentors',
        MyMentors,
        mode === 'edit'
          ? data?.myMentors?.data
          : filteredUnshownData(data?.myMentors?.data),
        450
      )}
    </div>
  )
}

export default WhoAmI
