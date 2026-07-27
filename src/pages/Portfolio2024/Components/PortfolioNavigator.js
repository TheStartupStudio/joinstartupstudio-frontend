import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { changeActiveSection } from '../../../redux/portfolio/Actions'
import { useDispatch, useSelector } from 'react-redux'

const ALL_SECTIONS = [
  { type: 'who-section', name: 'Who Am I?' },
  { type: 'what-section', name: 'What Can I Do?' },
  { type: 'how-section', name: 'How Do I Prove It?' },
  { type: 'start-section', name: 'Start' }
]

function PortfolioNavigator(props) {
  const dispatch = useDispatch()
  const activeSection = useSelector((state) => state.portfolio.activeSection)

  const sections = Array.isArray(props.visibleSections)
    ? ALL_SECTIONS.filter((section) =>
        props.visibleSections.includes(section.type)
      )
    : ALL_SECTIONS

  const activeSectionIndex = sections.findIndex(
    (section) => section.type === activeSection
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
    props.scrollToTop?.()
  }

  const handlePreviousSection = () => {
    let changeSectionIndex = activeSectionIndex - 1
    while (changeSectionIndex >= 0 && sections[changeSectionIndex].disabled) {
      changeSectionIndex -= 1
    }

    if (changeSectionIndex >= 0) {
      dispatch(changeActiveSection(sections[changeSectionIndex].type))
    }
    props.scrollToTop?.()
  }

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
