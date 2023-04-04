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

  return (
    <div className='iamr-container'>
      <div
        className={`page-border accordion ${expanded ? 'expanded' : ''}`}
        ref={accordionRef}
      >
        <FontAwesomeIcon
          icon={expanded ? faChevronLeft : faChevronRight}
          color='#01c5d1'
          className='mx-2 back'
          title={!expanded ? 'Show skills' : 'Hide'}
          cursor={'pointer'}
          onClick={() => setExpanded((prev) => !prev)}
        />
        <h4 className='mt-2'>SKILLS</h4>
        <SkillsAccordion hideExpanded={() => expanded && setExpanded(false)} />
      </div>
      <div className={`skill-content ${expanded ? 'expanded' : ''}`}>
        <SkillsRouter />
      </div>
    </div>
  )
}

export default IAMR
