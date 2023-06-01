import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import { EducationModal } from '../../components/Portfolio/Education/educationModal'
import axiosInstance from '../../utils/AxiosInstance'
import PortfolioSection from './PortfolioSection'
import { AccomplishmentModal } from '../../components/Portfolio/Accomplishment/accomplishmentModal'
import { toast } from 'react-toastify'
import IntlMessages from '../../utils/IntlMessages'
import { ExperienceModal } from '../../components/Portfolio/Experience/experienceModal'
const EmptyEducationSection = () => {
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [experiences, setExperiences] = useState([])
  const [currentExperience, setCurrentExperience] = useState([])

  useEffect(() => {
    getUserExperiences()
  }, [])

  useEffect(() => {
    if (currentExperience.length !== 0) setShowExperienceModal(true)
  }, [currentExperience])

  const getUserExperiences = async () => {
    await axiosInstance
      .get(`/userBackground/by-type/experience`)
      .then((res) => {
        setExperiences(res.data)
      })
  }

  const updateExperience = async (experience) => {
    setExperiences(
      experiences.map((exp) => {
        if (exp.id === experience.id) return (exp = experience)
        return exp
      })
    )
  }

  const deleteBackground = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
  }

  const addExperience = async (experience) => {
    setExperiences([...experiences, experience])
  }

  return (
    <PortfolioSection title={'Experience'}>
      {!experiences.length && (
        <>
          <>
            <p className="no-experience-added">
              You haven’t added any of your experience… yet! Click the box below
              to add one.
            </p>
            <div className="m-3 experiences-container d-flex justify-content-center">
              <FontAwesomeIcon
                icon={faPlus}
                className="my-5"
                style={{
                  height: '56px',
                  width: '56px',
                  cursor: 'pointer',
                  color: '#BBBDBF',
                }}
                onClick={() => setShowExperienceModal(true)}
              />
            </div>
          </>
          <ExperienceModal
            show={showExperienceModal}
            onHide={() => {
              setCurrentExperience([])
              setShowExperienceModal(false)
            }}
            updateExperience={(exp) => updateExperience(exp)}
            addExperience={(exp) => addExperience(exp)}
            deleteBackground={(id) => deleteBackground(id)}
            currentExperience={currentExperience}
          />
        </>
      )}
    </PortfolioSection>
  )
}

export default EmptyEducationSection
