import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import { EducationModal } from '../../components/Portfolio/Education/educationModal'
import axiosInstance from '../../utils/AxiosInstance'
const EmptyPortfolioSection = () => {
  const [showEducationModal, setShowEducationModal] = useState(false)
  const [educations, setEducations] = useState([])
  const [currentEducation, setCurrentEducation] = useState([])

  useEffect(() => {
    getUserEducations()
  }, [])
  const getUserEducations = async () => {
    await axiosInstance.get(`/userBackground/by-type/education`).then((res) => {
      setEducations(res.data)
    })
  }

  const updateEducation = async (education) => {
    setEducations(
      educations.map((edu) => {
        if (edu.id === education.id) return (edu = education)
        return edu
      })
    )
  }

  const deleteBackground = (id) => {
    setEducations(educations.filter((edu) => edu.id !== id))
  }

  const addEducation = async (education) => {
    setEducations([...educations, education])
  }

  return (
    !educations.length && (
      <>
        <p className="no-experience-added">
          You haven’t added any educational degrees… yet! Click the box below to
          add one.
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
            onClick={() => setShowEducationModal(true)}
          />
        </div>
        <EducationModal
          show={showEducationModal}
          onHide={() => {
            setCurrentEducation([])
            setShowEducationModal(false)
          }}
          updateEducation={(edu) => updateEducation(edu)}
          addEducation={(edu) => addEducation(edu)}
          deleteBackground={(id) => deleteBackground(id)}
          currentEducation={currentEducation}
        />
      </>
    )
  )
}

export default EmptyPortfolioSection
