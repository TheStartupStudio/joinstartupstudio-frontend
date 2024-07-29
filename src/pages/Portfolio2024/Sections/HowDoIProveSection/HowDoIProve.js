import React, { useEffect, useState } from 'react'
import PortfolioDataContainer from '../../Components/DisplayData/PortfolioDataContainer'
import PortfolioSectionDataLoader from '../../Components/PortfolioSectionDataLoader'
import MyAlignments from './MyAlignments'
import MyProductivity from './MyProductivity'
import MyCompetitiveness from './MyCompetitiveness'

function HowDoIProveIt({ loadings: propsLoadings, data, user }) {
  console.log('data', data)
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
    description,
    Component,
    componentData
  ) => {
    if (typeof loading == 'boolean') {
      return !loading ? (
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
    } else {
      return (
        <PortfolioDataContainer
          title={title}
          description={description}
          type={type}
        >
          <Component loadings={loading} data={componentData} user={user} />
        </PortfolioDataContainer>
      )
    }
  }

  return (
    <div className={'d-flex flex-column gap-4'}>
      {renderSection(
        loadings?.myAlignments,
        'my-alignment',
        'My Alignment',
        'My connection and commitment inside of my field of interest',
        MyAlignments,
        data?.myAlignments
      )}
      {renderSection(
        loadings?.myProductivity,
        'my-productivity',
        'My Productivity',
        'My skills and expertise inside of my field of interest.',
        MyProductivity,
        data?.myProductivity
      )}
      {renderSection(
        loadings?.myCompetitiveness,
        'my-competitiveness',
        'My Competitiveness',
        'The value of the outcomes you produce inside of your field of interest',
        MyCompetitiveness,
        data?.myCompetitiveness?.data
      )}
    </div>
  )
}

export default HowDoIProveIt
