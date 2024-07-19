import React, { useEffect, useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
// import UserStory from './UserStory'
// import MyRelationships from './MyRelationships'
// import MyFailures from './MyFailures'
// import MyMentors from './MyMentors'
import PortfolioSectionDataLoader from '../../Components/PortfolioSectionDataLoader'
import MyAlignments from './MyAlignments'
import { getProjects } from '../../../../redux/portfolio/Actions'
import { connect } from 'react-redux'

function HowDoIProveIt({ loadings: propsLoadings, data, user }) {
  const [loadings, setLoadings] = useState(null)
  console.log('data', data)
  // useEffect(() => {
  //   if (propsLoadings) {
  //     setLoadings(propsLoadings)
  //   }
  // }, [propsLoadings])

  const renderSection = (
    loading,
    type,
    title,
    description,
    Component,
    componentData
  ) => {
    return 1 ? (
      <PortfolioDataContainer
        title={title}
        description={description}
        type={type}
      >
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
        'my-alignment',
        'My Alignment',
        'My connection and commitment inside of my field of interest',
        MyAlignments,
        data?.myAlignments
      )}
      {/*{renderSection(*/}
      {/*  loadings?.myRelationships,*/}
      {/*  'my-relationship',*/}
      {/*  'My Relationships',*/}
      {/*  MyRelationships,*/}
      {/*  data?.myRelationships?.data*/}
      {/*)}*/}
      {/*{renderSection(*/}
      {/*  loadings?.myFailures,*/}
      {/*  'my-failures',*/}
      {/*  'My Failures',*/}
      {/*  MyFailures,*/}
      {/*  data?.myFailures?.data*/}
      {/*)}*/}
      {/*{renderSection(*/}
      {/*  loadings?.myMentors,*/}
      {/*  'my-mentors',*/}
      {/*  'My Mentors',*/}
      {/*  MyMentors,*/}
      {/*  data?.myMentors?.data*/}
      {/*)}*/}
    </div>
  )
}

export default HowDoIProveIt
