import React, { useEffect, useState } from 'react'
import PortfolioProgressIndicator from './PortfolioProgressIndicator'
import SectionDescription from './SectionDescription'
import whoTriangle from '../../../../assets/images/HS-Portfolio-Icons/LTS Model - Who are youx800.png'
import whatTriangle from '../../../../assets/images/HS-Portfolio-Icons/LTS Model - What can you dox800.png'
import howTriangle from '../../../../assets/images/HS-Portfolio-Icons/LTS Model - How do you prove itx800.png'
import startTriangle from '../../../../assets/images/HS-Portfolio-Icons/LTS Model - Startx800.png'
import myPortfolioLogo from '../../../../assets/images/LTS Portfolio Logo (Pwd By SUS)x1200.png'
import { useSelector } from 'react-redux'
function PortfolioHeader(props) {
  const activeSection = useSelector((state) => state.portfolio.activeSection)

  return (
    <div className='portfolio-main-wrapper'>
      <PortfolioProgressIndicator />
      <div className={'my-portfolio-logo-container'}>
        <img
          src={myPortfolioLogo}
          alt={'my-portfolio-logo'}
          className={'my-portfolio-logo'}
        />
      </div>
      {activeSection === 'who-section' && (
        <SectionDescription
          sectionTitle={'Who am i?'}
          sectionDescription={`LTS Participants communicate the value they have produced in themselves through <strong>Story</strong>, <strong>Relationship</strong>, <strong>Mentorship</strong>, and <strong>Failure</strong>.`}
          triangleIcon={whoTriangle}
          user={props.userStory}
        />
      )}
      {activeSection === 'what-section' && (
        <SectionDescription
          sectionTitle={'What can I do?'}
          sectionDescription={`LTS Participants communicate the value they have produced in themselves through the outcomes of <strong>Learn</strong>, <strong>Develop</strong>, and <strong>Brand</strong>.`}
          triangleIcon={whatTriangle}
          user={props.userStory}
        />
      )}
      {activeSection === 'how-section' && (
        <SectionDescription
          sectionTitle={'How Do I Prove it?'}
          sectionDescription={`LTS Participants communicate the value they have produced in themselves through the outcomes of <strong>Alignment</strong>, <strong>Productivity</strong>, and <strong>Competitiveness</strong>.`}
          triangleIcon={howTriangle}
          user={props.userStory}
        />
      )}
      {activeSection === 'start-section' && (
        <SectionDescription
          sectionTitle={'Start'}
          sectionDescription={`My ability to prove the quality of my outcomes through the test metrics of <strong>sustainability</strong>, <strong>profitability</strong>, and <strong>efficiency</strong>.`}
          triangleIcon={startTriangle}
          user={props.userStory}
        />
      )}
    </div>
  )
}

export default PortfolioHeader
