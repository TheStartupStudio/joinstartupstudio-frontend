import React from 'react'
import PortfolioProgressIndicator from './PortfolioProgressIndicator'
import SectionDescription from './SectionDescription'
import whoTriangle from '../../../../assets/images/HS-Portfolio-Icons/LTS Model - Who are youx800.png'
import whatTriangle from '../../../../assets/images/HS-Portfolio-Icons/LTS Model - What can you dox800.png'
import howTriangle from '../../../../assets/images/HS-Portfolio-Icons/LTS Model - How do you prove itx800.png'
import startTriangle from '../../../../assets/images/HS-Portfolio-Icons/LTS Model - Startx800.png'
import whoIconColor from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-WHO (CL)x1200.png'
import whatIconColor from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-WHAT (CL)x1200.png'
import howIconColor from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-HOW (CL)x1200.png'
import startIconColor from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-START (CL)x1200.png'
import StudioOs from '../../../../assets/images/academy-icons/StudioOs.png'
import AcademyLogo from '../../../../assets/images/academy-icons/academy-logo.png'
import { useSelector } from 'react-redux'

function PortfolioHeader(props) {
  const activeSection = useSelector((state) => state.portfolio.activeSection)

  return (
    <div className='portfolio-main-wrapper portfolio-tss-branded-header'>
      <a className='my-portfolio-logo-container tss-portfolio-logo-container' href='/'>
        <img
          src={StudioOs}
          alt='Startup Studio'
          className='my-portfolio-logo tss-portfolio-logo'
        />
        <img
          src={AcademyLogo}
          alt='Academy'
          className='tss-portfolio-academy-logo'
        />
      </a>
      <PortfolioProgressIndicator />
      {activeSection === 'who-section' && (
        <SectionDescription
          sectionTitle={'Who am i?'}
          sectionDescription={`LTS Participants communicate the value they have produced in themselves through <strong>Story</strong>, <strong>Relationship</strong>, <strong>Mentorship</strong>, and <strong>Failure</strong>.`}
          triangleIcon={whoTriangle}
          sectionIcon={whoIconColor}
        />
      )}
      {activeSection === 'what-section' && (
        <SectionDescription
          sectionTitle={'What can I do?'}
          sectionDescription={`LTS Participants communicate the value they have produced in themselves through the outcomes of <strong>Learn</strong>, <strong>Develop</strong>, and <strong>Brand</strong>.`}
          triangleIcon={whatTriangle}
          sectionIcon={whatIconColor}
        />
      )}
      {activeSection === 'how-section' && (
        <SectionDescription
          sectionTitle={'How Do I Prove it?'}
          sectionDescription={`LTS Participants communicate the value they have produced in themselves through the outcomes of <strong>Alignment</strong>, <strong>Productivity</strong>, and <strong>Competitiveness</strong>.`}
          triangleIcon={howTriangle}
          sectionIcon={howIconColor}
        />
      )}
      {activeSection === 'start-section' && (
        <SectionDescription
          sectionTitle={'Start'}
          sectionDescription={`My ability to prove the quality of my outcomes through the test metrics of <strong>sustainability</strong>, <strong>profitability</strong>, and <strong>efficiency</strong>.`}
          triangleIcon={startTriangle}
          sectionIcon={startIconColor}
        />
      )}
    </div>
  )
}

export default PortfolioHeader
