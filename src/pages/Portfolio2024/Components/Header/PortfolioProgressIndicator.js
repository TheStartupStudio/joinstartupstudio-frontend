import React from 'react'
import { HorizontalSeparator } from './HorizontalSeparator'
import whoIconColor from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-WHO (CL)x1200.png'
import whoIconGray from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-WHO (GR)x1200.png'
import whatIconColor from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-WHAT (CL)x1200.png'
import whatIconGray from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-WHAT (GR)x1200.png'
import howIconColor from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-HOW (CL)x1200.png'
import howIconGray from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-HOW (GR)x1200.png'
import startIconColor from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-START (CL)x1200.png'
import startIconGray from '../../../../assets/images/HS-Portfolio-Icons/NavIcon-START (GR)x1200.png'
import ProgressIcon from './ProgressIcon'
import { useDispatch, useSelector } from 'react-redux'
import { changeActiveSection } from '../../../../redux/portfolio/Actions'

const ALL_SECTIONS = [
  {
    type: 'who-section',
    title: 'Who Am I?',
    icons: { coloredIcon: whoIconColor, grayIcon: whoIconGray }
  },
  {
    type: 'what-section',
    title: 'What Can I Do?',
    className: 'wcid-text',
    icons: { coloredIcon: whatIconColor, grayIcon: whatIconGray }
  },
  {
    type: 'how-section',
    title: 'How Do I Prove It?',
    className: 'hcipi-text',
    icons: { coloredIcon: howIconColor, grayIcon: howIconGray }
  },
  {
    type: 'start-section',
    title: 'Start',
    icons: { coloredIcon: startIconColor, grayIcon: startIconGray }
  }
]

function PortfolioProgressIndicator(props) {
  const dispatch = useDispatch()
  const activeSection = useSelector((state) => state.portfolio.activeSection)
  const visibleSections = props.visibleSections

  const sections = Array.isArray(visibleSections)
    ? ALL_SECTIONS.filter((section) => visibleSections.includes(section.type))
    : ALL_SECTIONS

  return (
    <>
      <div
        className={
          'portfolio-nav-icons nav-icons d-flex  align-items-center position-relative '
        }
      >
        {sections.map((section, index) => (
          <React.Fragment key={section.type}>
            {index > 0 && <HorizontalSeparator />}
            <ProgressIcon
              className={section.className}
              icons={section.icons}
              title={section.title}
              activateSection={() => {
                dispatch(changeActiveSection(section.type))
              }}
              activeSection={activeSection === section.type}
            />
          </React.Fragment>
        ))}
      </div>
    </>
  )
}

export default PortfolioProgressIndicator
