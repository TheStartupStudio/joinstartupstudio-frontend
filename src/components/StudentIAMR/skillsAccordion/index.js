import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../../utils/AxiosInstance'
import { useIamrContext } from '../iamrContext/context'
import AccordionItem from './accordionItem'
import CertificationAccordionItem from './certificationAccordionItem'
import './index.css'

const SkillsAccordion = ({ hideExpanded }) => {
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
        <h3 className='mt-4 mb-0 certification-title'>
          MARKET - READY CERTIFICATION 1 SKILLS
        </h3>
        {skills
          .filter((skill) => skill.type === 'student-certification-1')
          .map((skill) => (
            <AccordionItem
              skill={skill}
              key={skill.id}
              active={activeKey}
              hideExpanded={hideExpanded}
            />
          ))}
        <CertificationAccordionItem
          status={certificationOneStatus}
          id={1}
          active={activeKey}
          hideExpanded={hideExpanded}
        />
        <h3 className='mt-4 mb-0 certification-title'>
          MARKET - READY CERTIFICATION 2 SKILLS
        </h3>
        {skills
          .filter((skill) => skill.type === 'student-certification-2')
          .map((skill) => (
            <AccordionItem
              skill={skill}
              key={skill.id}
              active={activeKey}
              hideExpanded={hideExpanded}
            />
          ))}
        <CertificationAccordionItem
          status={certificationTwoStatus}
          id={2}
          active={activeKey}
          hideExpanded={hideExpanded}
        />
      </div>
    </>
  )
}

export default SkillsAccordion
