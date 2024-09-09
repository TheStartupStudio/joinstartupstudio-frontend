import React, { useEffect, useState } from 'react'
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

function PortfolioProgressIndicator(props) {
  const dispatch = useDispatch()
  const activeSection = useSelector((state) => state.portfolio.activeSection)

  return (
    <>
      <div className={'nav-icons d-flex  align-items-center position-relative'}>
        <ProgressIcon
          icons={{ coloredIcon: whoIconColor, grayIcon: whoIconGray }}
          title={'Who Am I?'}
          activateSection={() => {
            dispatch(changeActiveSection('who-section'))
          }}
          activeSection={activeSection === 'who-section'}
        />
        <HorizontalSeparator />
        <ProgressIcon
          icons={{ coloredIcon: whatIconColor, grayIcon: whatIconGray }}
          title={'What Can I Do?'}
          activateSection={() => {
            dispatch(changeActiveSection('what-section'))
          }}
          activeSection={activeSection === 'what-section'}
        />
        <HorizontalSeparator />
        <ProgressIcon
          icons={{ coloredIcon: howIconColor, grayIcon: howIconGray }}
          title={'How Do I Prove It?'}
          activateSection={() => {
            dispatch(changeActiveSection('how-section'))
          }}
          activeSection={activeSection === 'how-section'}
        />
        <HorizontalSeparator />
        <ProgressIcon
          icons={{ coloredIcon: startIconColor, grayIcon: startIconGray }}
          title={'Start'}
          activateSection={() => {
            dispatch(changeActiveSection('start-section'))
          }}
          activeSection={activeSection === 'start-section'}
          disabled={true}
        />
      </div>
    </>
  )
}

export default PortfolioProgressIndicator
