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
import MyProductivity from './MyProductivity'
import MyCompetitiveness from './MyCompetitiveness'

function HowDoIProveIt({ loadings: propsLoadings, data, user }) {
  const [loadings, setLoadings] = useState(null)
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
      {/*  loadings?.userStory,*/}
      {/*  'my-productivity',*/}
      {/*  'My Productivity',*/}
      {/*  'My skills and expertise inside of my field of interest.',*/}
      {/*  MyProductivity,*/}
      {/*  data?.myProductivity*/}
      {/*)}*/}
      {/*{renderSection(*/}
      {/*  loadings?.userStory,*/}
      {/*  'my-competitiveness',*/}
      {/*  'My Competitiveness',*/}
      {/*  'The value of the outcomes you produce inside of your field of interest',*/}
      {/*  MyCompetitiveness,*/}
      {/*  data?.myCompetitiveness?.data*/}
      {/*)}*/}
    </div>
  )
}

export default HowDoIProveIt
