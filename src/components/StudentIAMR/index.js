import { useState, useRef } from 'react'
import SkillsAccordion from './skillsAccordion'
import SkillsRouter from './skillsRouter'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import './index.css'
import useOnClickOutside from 'use-onclickoutside'

const IAMR = () => {
  const [expanded, setExpanded] = useState(true)
  const accordionRef = useRef(null)

  useOnClickOutside(accordionRef, () => {
    expanded && setExpanded(false)
  })

  const groupingStrings = {
    'student-certification-1': [
      'CRITICAL THINKING SKILLS',
      'COLLABORATION SKILLS',
      'CREATIVITY SKILLS'
    ],
    'student-certification-2': ['LEADERSHIP SKILLS', 'ENTERPRISE SKILLS']
  }

  return (
    <div className="iamr-container">
      <div
        className={`page-border accordion pb-4 ${expanded ? 'expanded' : ''}`}
        ref={accordionRef}
      >
        <FontAwesomeIcon
          icon={expanded ? faChevronLeft : faChevronRight}
          color="#01c5d1"
          className="mx-2 back"
          title={!expanded ? 'Show skills' : 'Hide'}
          cursor={'pointer'}
          onClick={() => setExpanded((prev) => !prev)}
        />
        <h4 className="mt-2">SKILLS</h4>
        <SkillsAccordion
          hideExpanded={() => expanded && setExpanded(false)}
          groupingStrings={groupingStrings}
        />
      </div>
      <div className={`skill-content ${expanded ? 'expanded' : ''}`}>
        <SkillsRouter groupingStrings={groupingStrings} />
      </div>
    </div>
  )
}

export default IAMR
