import { useState, useEffect, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { useIamrContext } from '../iamrContext/context'
import AccordionItem from './accordionItem'
import CertificationAccordionItem from './certificationAccordionItem'
import './index.css'
import axiosInstance from '../../../../utils/AxiosInstance'
import { useDispatch, useSelector } from 'react-redux'
import { setBackButton } from '../../../../redux/backButtonReducer'

const GroupingString = ({ text }) => (
  <div className='grouping-string pt-3'>{text}</div>
)

const AccordionItems = ({
  skills,
  activeKey,
  hideExpanded,
  groupingStrings,
  certificationType
}) => (
  <>
    {skills.map((skill, index) => {
      const isFirstSkill = index === 0
      const isLastSkill = index === skills.length - 1
      const groupIndex = (index + 1) / 4
      const groupIndexProp = Math.floor(index / 4)

      return (
        <Fragment key={skill.id}>
          {isFirstSkill && (
            <GroupingString text={groupingStrings[skill.type][0]} />
          )}
          <AccordionItem
            parent={1}
            skill={skill}
            key={skill.id}
            active={activeKey}
            hideExpanded={hideExpanded}
            certificationType={certificationType}
            groupingString={groupingStrings[skill.type][groupIndexProp]}
          />
          {(groupIndex % 1 === 0 || isLastSkill) && !isFirstSkill && (
            <GroupingString text={groupingStrings[skill.type][groupIndex]} />
          )}
        </Fragment>
      )
    })}
  </>
)

const SkillsAccordion = ({ hideExpanded, certificationType }) => {
  const dispatch = useDispatch()
  const { skills, loading, setSkills, setJournalEntries, setLoading } =
    useIamrContext()
  const activeKey = useState({ certificationType: null, id: null, type: null })
  const [, setActiveKey] = activeKey
  const [certificationStatus, setCertificationStatus] = useState()
  const loggedUser = useSelector((state) => state.user.user.user)
  const { id, type } = useParams()

  useEffect(() => {
    dispatch(setBackButton(true, 'iamr-certification-system'))

    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch])

  useEffect(() => {
    setActiveKey({ certificationType, id: parseInt(id), type: type })
  }, [certificationType, id, type])

  useEffect(() => {
    setLoading(true)
    axiosInstance
      .get(`/iamr/skills/user/${loggedUser.id}`)
      .then(({ data }) => {
        const { skills, certificationStatus } = data
        setSkills(skills)
        setCertificationStatus(certificationStatus)
      })
      .catch((error) => {
        console.error('Error fetching skills:', error)
      })

    axiosInstance
      .get('/ltsJournals/allUserEntries')
      .then(({ data }) => {
        setJournalEntries(data)
      })
      .catch((error) => {
        console.error('Error fetching journal entries:', error)
      })
  }, [])

  const groupingStrings = {
    'student-certification-1': [
      'CRITICAL THINKING SKILLS',
      'COLLABORATION SKILLS',
      'CREATIVITY SKILLS'
    ],
    'student-certification-2': ['LEADERSHIP SKILLS', 'ENTERPRISE SKILLS']
  }

  return (
    <>
      {!loading && (
        <div className='accordion-data pb-2 pt-3' id='accordionExample0'>
          <AccordionItems
            skills={skills.filter((skill) => skill.type === certificationType)}
            activeKey={activeKey}
            hideExpanded={hideExpanded}
            groupingStrings={groupingStrings}
            certificationType={certificationType}
          />
          <CertificationAccordionItem
            status={certificationStatus}
            id={
              certificationType === 'student-certification-1'
                ? 1
                : certificationType === 'student-certification-2'
                ? 2
                : null
            }
            active={activeKey}
            hideExpanded={hideExpanded}
            finishedContent={true}
            certificationType={certificationType}
          />
        </div>
      )}
    </>
  )
}

export default SkillsAccordion
