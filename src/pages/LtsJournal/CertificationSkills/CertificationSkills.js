import React, { useEffect, useState } from 'react'
import CertificationSkillBox from './CertificationSkillBox'
import axiosInstance from '../../../utils/AxiosInstance'
import { useParams } from 'react-router-dom'
import certificationAccordionItem from '../../../components/StudentIAMR/skillsAccordion/certificationAccordionItem'
import DeleteArchiveModal from '../../../components/Modals/DeleteArchiveModal'
import SkillExplanationModal from '../../../components/Modals/SkillExplanationModal'
import './CertificationSkills.css'
const CertificationSkills = ({ journal }) => {
  const [certificationSkills, setCertificationSkills] = useState([])

  const [selectedContent, setSelectedContent] = useState([])

  const [userCertificationSkills, setUserCertificationSkills] = useState([])

  const [userContentUploadsId, setUserContentUploadsId] = useState(0)

  const [showExplanationModal, setShowExplanationModal] = useState(false)

  const [selectedSkill, setSelectedSkill] = useState({})
  const handleOpenExplanationModal = () => {
    setShowExplanationModal(true)
  }
  const handleCloseExplanationModal = () => {
    setShowExplanationModal(false)
  }
  function isObject(obj) {
    return !!obj
  }

  useEffect(() => {
    if (
      journal.certificationSkills &&
      journal.userCertificationSkills.length === 0
    ) {
      setCertificationSkills(
        journal.certificationSkills.slice().sort((a, b) => a.order - b.order)
      )
    }
  }, [journal.certificationSkills])
  useEffect(() => {
    if (journal.userCertificationSkills.length !== 0) {
      let newCertificationSkills = []

      setCertificationSkills(
        journal.certificationSkills.slice().sort((a, b) => a.order - b.order)
      )
      setUserCertificationSkills(
        journal.userCertificationSkills
          .slice()
          .sort((a, b) => a.order - b.order)
      )
    }
  }, [journal.userCertificationSkills])

  const params = useParams()
  const handleToggleSkill = (skillId, status) => {
    let newCertificationSkills
    if (userCertificationSkills.length !== 0) {
      newCertificationSkills = userCertificationSkills?.map((skill) => {
        if (skill.id === skillId) {
          return {
            ...skill,
            status: status
          }
        }
        return skill
      })
    } else {
      const skills = certificationSkills?.map((skill) => {
        let newSkill
        if (skill.id === skillId) {
          newSkill = {
            journalId: skill.journalId,
            order: skill.order,
            status: status,
            title: skill.title,
            content: skill.content,
            certificationSkillId: skill.id
          }
        } else {
          newSkill = {
            journalId: skill.journalId,
            order: skill.order,
            status: skill.status,
            title: skill.title,
            content: skill.content,
            certificationSkillId: skill.id
          }
        }

        return newSkill
      })
      newCertificationSkills = skills
    }

    axiosInstance
      .put(`/certificationSkills/updateUserCertificationSkills/`, {
        certificationSkills: newCertificationSkills
      })
      .then(({ data }) => {
        if (data) {
          const newData = [...data]?.slice()?.sort((a, b) => a.order - b.order)
          setUserCertificationSkills(newData)
        }
      })
  }

  const updateContentSelection = (skill) => {
    if (skill.status === 'undeclared') {
      handleToggleSkill(skill.id, 'proficient')
    } else if (skill.status === 'proficient') {
      handleToggleSkill(skill.id, 'needs_improvement')
    } else if (skill.status === 'needs_improvement') {
      handleToggleSkill(skill.id, 'undeclared')
    }
  }

  const ids = userCertificationSkills.map((item1) => item1.certificationSkillId)

  const differentElements = certificationSkills.filter(
    (item1) => !ids.includes(item1.id)
  )
  // console.log(differentElements)
  return (
    <div>
      {journal?.certificationSkills?.length ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}
        >
          {userCertificationSkills?.length === 0 &&
            certificationSkills.map((skill) => {
              return (
                <div
                  className={
                    'd-flex flex-column justify-content-center align-items-center'
                  }
                >
                  <CertificationSkillBox
                    title={skill.title}
                    onSelectContent={() => updateContentSelection(skill)}
                    proficient={skill?.status === 'proficient'}
                    needsImprovement={skill?.status === 'needs_improvement'}
                  />
                  <button
                    className={'explanation-button'}
                    onClick={() => {
                      handleOpenExplanationModal()
                      setSelectedSkill(skill)
                    }}
                  >
                    Explanation
                  </button>
                </div>
              )
            })}

          {userCertificationSkills &&
            userCertificationSkills.length !== 0 &&
            userCertificationSkills.map((skill) => (
              <div
                className={
                  'd-flex flex-column justify-content-center align-items-center w-100'
                }
              >
                <CertificationSkillBox
                  key={skill.title}
                  title={skill.title}
                  onSelectContent={() => updateContentSelection(skill)}
                  proficient={skill.status === 'proficient'}
                  needsImprovement={skill.status === 'needs_improvement'}
                />
                <button
                  className={'explanation-button'}
                  onClick={() => {
                    handleOpenExplanationModal()
                    setSelectedSkill(skill)
                  }}
                >
                  Explanation
                </button>
              </div>
            ))}
          <SkillExplanationModal
            show={showExplanationModal}
            onHide={handleCloseExplanationModal}
            title={selectedSkill.title}
            content={selectedSkill.content}
          />
        </div>
      ) : null}
    </div>
  )
}

export default CertificationSkills
