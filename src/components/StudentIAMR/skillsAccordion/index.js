import { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { useIamrContext } from '../iamrContext/context'
import AccordionItem from './accordionItem'
import CertificationAccordionItem from './certificationAccordionItem'
import './index.css'

const GroupingString = ({ text }) => (
  <div className='grouping-string pt-3 ps-3'>{text}</div>
)

const AccordionItems = ({
  skills,
  activeKey,
  hideExpanded,
  groupingStrings
}) => (
  <>
    {skills.map((skill, index) => {
      const isFirstSkill = index === 0
      const isLastSkill = index === skills.length - 1
      const groupIndex = (index + 1) / 4

      return (
        <Fragment key={skill.id}>
          {isFirstSkill && (
            <GroupingString text={groupingStrings[skill.type][0]} />
          )}
          <AccordionItem
            skill={skill}
            key={skill.id}
            active={activeKey}
            hideExpanded={hideExpanded}
          />
          {(groupIndex % 1 === 0 || isLastSkill) && !isFirstSkill && (
            <GroupingString text={groupingStrings[skill.type][groupIndex]} />
          )}
        </Fragment>
      )
    })}
  </>
)

const RenderCertificationSkills = (
  skills,
  certificationStatus,
  certificationNumber,
  activeKey,
  hideExpanded,
  groupingStrings
) => {
  return (
    <>
      <h3 className='mt-4 mb-0 certification-title'>
        MARKET - READY CERTIFICATION {certificationNumber} SKILLS
      </h3>
      <AccordionItems
        skills={skills.filter(
          (skill) =>
            skill.type === `student-certification-${certificationNumber}`
        )}
        activeKey={activeKey}
        hideExpanded={hideExpanded}
        groupingStrings={groupingStrings}
      />
      <CertificationAccordionItem
        status={certificationStatus}
        id={certificationNumber}
        active={activeKey}
        hideExpanded={hideExpanded}
        groupingStrings={groupingStrings}
      />
    </>
  )
}

const SkillsAccordion = ({ hideExpanded, groupingStrings }) => {
  const { skills, certificationOneStatus, certificationTwoStatus } =
    useIamrContext()
  const activeKey = useState({ id: null, type: null })
  const [, setActiveKey] = activeKey
  const { id, type } = useParams()

  useEffect(() => {
    setActiveKey({ id: parseInt(id), type: type })
  }, [id, type])

  return (
    <>
      <div className='accordion-data' id='accordionExample0'>
        {RenderCertificationSkills(
          skills,
          certificationOneStatus,
          1,
          activeKey,
          hideExpanded,
          groupingStrings
        )}
        {RenderCertificationSkills(
          skills,
          certificationTwoStatus,
          2,
          activeKey,
          hideExpanded,
          groupingStrings
        )}
      </div>
    </>
  )
}

export default SkillsAccordion
