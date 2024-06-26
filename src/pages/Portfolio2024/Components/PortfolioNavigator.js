import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { changeActiveSection } from '../../../redux/portfolio/Actions'
import { useDispatch, useSelector } from 'react-redux'

function PortfolioNavigator(props) {
  const dispatch = useDispatch()
  const activeSection = useSelector((state) => state.portfolio.activeSection)

  const sections = [
    { type: 'who-section', name: 'Who Am I?' },
    { type: 'what-section', name: 'What Can I Do?', disabled: true },
    { type: 'how-section', name: 'How Do I Prove It?', disabled: true },
    { type: 'start-section', name: 'Start', disabled: true }
  ]
  const activeSectionIndex = sections.findIndex(
    (section, index) => section.type === activeSection
  )

  const handleNextSection = () => {
    let changeSectionIndex = activeSectionIndex + 1
    while (
      changeSectionIndex < sections.length &&
      sections[changeSectionIndex].disabled
    ) {
      changeSectionIndex += 1
    }

    if (changeSectionIndex < sections.length) {
      dispatch(changeActiveSection(sections[changeSectionIndex].type))
    }
  }

  const handlePreviousSection = () => {
    let changeSectionIndex = activeSectionIndex - 1
    while (changeSectionIndex >= 0 && sections[changeSectionIndex].disabled) {
      changeSectionIndex -= 1
    }

    if (changeSectionIndex >= 0) {
      dispatch(changeActiveSection(sections[changeSectionIndex].type))
    }
  }

  // DO NOT DELETE THESE TWO FUNCTIONS !!!

  // const handleNextSection = () => {
  //   let changeSectionIndex = activeSectionIndex + 1
  //
  //   if (changeSectionIndex === sections.length) {
  //     changeSectionIndex = null
  //   }
  //
  //   if (changeSectionIndex !== null) {
  //     dispatch(changeActiveSection(sections[changeSectionIndex].type))
  //   }
  // }
  //
  // const handlePreviousSection = () => {
  //   let changeSectionIndex = activeSectionIndex - 1
  //   if (changeSectionIndex < 0) {
  //     changeSectionIndex = null
  //   }
  //   if (changeSectionIndex !== null) {
  //     dispatch(changeActiveSection(sections[changeSectionIndex].type))
  //   }
  // }

  const getPreviousSectionName = () => {
    if (activeSectionIndex < 0) {
      return ''
    }
    return sections[activeSectionIndex - 1]?.name
  }

  const getNextSectionName = () => {
    if (activeSectionIndex >= sections.length - 1) {
      return ''
    }
    return sections[activeSectionIndex + 1]?.name
  }
  return (
    <div className={'d-flex justify-content-between portfolio-navigator mt-5'}>
      <div
        className={'portfolio-navigator-button text-start cursor-pointer'}
        onClick={handlePreviousSection}
      >
        {getPreviousSectionName() && (
          <>
            <span>
              <FaChevronLeft />
            </span>
            <span>{getPreviousSectionName()}</span>
          </>
        )}
      </div>
      <div
        className={'portfolio-navigator-button  text-end cursor-pointer'}
        onClick={handleNextSection}
      >
        {getNextSectionName() && (
          <>
            <span>{getNextSectionName()}</span>
            <span>
              <FaChevronRight />
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default PortfolioNavigator
