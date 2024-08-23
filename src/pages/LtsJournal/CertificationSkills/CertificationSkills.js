import React, { useEffect, useState } from 'react'
import CertificationSkillBox from './CertificationSkillBox'
import axiosInstance from '../../../utils/AxiosInstance'
import SkillExplanationModal from '../../../components/Modals/SkillExplanationModal'
import './CertificationSkills.css'
const CertificationSkills = ({ journal, isEditable }) => {
  const [skills, setSkills] = useState([])

  const [showExplanationModal, setShowExplanationModal] = useState(false)

  const [selectedSkill, setSelectedSkill] = useState({})

  const [loadingSkill, setLoadingSkill] = useState(false)
  const handleOpenExplanationModal = () => {
    setShowExplanationModal(true)
  }
  const handleCloseExplanationModal = () => {
    setShowExplanationModal(false)
  }

  useEffect(() => {
    const ids = journal.userCertificationSkills.map(
      (item1) => item1.certificationSkillId
    )

    const differentCertificationSkills = journal.certificationSkills.filter(
      (item1) => !ids.includes(item1.id)
    )
    setSkills(
      [...differentCertificationSkills, ...journal.userCertificationSkills]
        .slice()
        .sort((a, b) => a.order - b.order)
    )
  }, [journal.userCertificationSkills, journal.certificationSkills])

  const handleToggleSkill = (skill, status) => {
    setLoadingSkill(true)
    if (skill?.hasOwnProperty('certificationSkillId')) {
      axiosInstance
        .put(`/certificationSkills/updateUserCertificationSkill/`, {
          skill: { ...skill, status: status }
        })
        .then(({ data }) => {
          const foundedSkillIndex = skills?.findIndex((s) => {
            if (s?.hasOwnProperty('certificationSkillId')) {
              return s.id === skill?.id
            }
          })
          const newSkills = [...skills]
          newSkills.splice(foundedSkillIndex, 1, data)
          setSkills(newSkills)
          setLoadingSkill(false)
        })
    } else {
      const newSkill = {
        journalId: skill?.journalId,
        order: skill?.order,
        status: status,
        title: skill?.title,
        content: skill?.content,
        certificationSkillId: skill?.id
      }

      axiosInstance
        .post(`/certificationSkills/createUserCertificationSkill/`, {
          skill: newSkill
        })
        .then(({ data }) => {
          const foundedSkillIndex = skills?.findIndex((s) => {
            if (!s?.hasOwnProperty('certificationSkillId')) {
              return s.id === skill?.id
            }
          })
          const newSkills = [...skills]
          newSkills.splice(foundedSkillIndex, 1, data)
          setSkills(newSkills)
          setLoadingSkill(false)
        })
    }
  }

  const updateContentSelection = (skill) => {
    if (skill?.status === 'undeclared') {
      handleToggleSkill(skill, 'proficient')
    } else if (skill?.status === 'proficient') {
      handleToggleSkill(skill, 'needs_improvement')
    } else if (skill?.status === 'needs_improvement') {
      handleToggleSkill(skill, 'undeclared')
    }
  }

  return (
    <div>
      {journal?.certificationSkills?.length ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}
          className='certskills-grid'
        >
          {skills.map((skill) => {
            return (
              <div
                className={
                  'd-flex flex-column justify-content-center align-items-center'
                }
              >
                <CertificationSkillBox
                  title={skill?.title}
                  onSelectContent={() => updateContentSelection(skill)}
                  proficient={skill?.status === 'proficient'}
                  needsImprovement={skill?.status === 'needs_improvement'}
                  isEditable={isEditable}
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
