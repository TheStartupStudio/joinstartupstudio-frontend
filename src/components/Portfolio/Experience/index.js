import React, { useEffect, useState } from 'react'
import IntlMessages from '../../../utils/IntlMessages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../../utils/AxiosInstance'
import { ExperienceModal } from './experienceModal'
import { ExperienceDetails } from './experienceDetails'
import './style.css'
import { faGlobe, faFile } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import { toast } from 'react-toastify'

export const Experience = (props) => {
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [experiences, setExperiences] = useState([])
  const [currentExperience, setCurrentExperience] = useState([])
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    getUserExperiences()
  }, [])

  useEffect(() => {
    props.user !== undefined && setIsPublished(props.user?.show_experience)
  }, [props.user])

  useEffect(() => {
    if (currentExperience.length !== 0) setShowExperienceModal(true)
  }, [currentExperience])

  const updateShowPreference = async () => {
    const oldPublishValue = isPublished
    setIsPublished(!isPublished)
    await axiosInstance
      .put(`/users`, {
        show_experience: !oldPublishValue
      })
      .then()
      .catch((e) => {
        setIsPublished(!oldPublishValue)
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      })
  }

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
    <>
      <div className='experiences-container mx-0 mt-4'>
        <div className='d-flex m-3 experience-header'>
          <h4 className='title p-0 my-auto float-start'>EXPERIENCE</h4>
          <span className='float-end my-auto pe-1 pe-md-0'>
            <FontAwesomeIcon
              icon={faPlus}
              className=''
              style={{ height: '25px', width: '25px', cursor: 'pointer' }}
              onClick={() => setShowExperienceModal(true)}
            />
          </span>
          <div className='break-experience'></div>
          <div className='d-flex show_in_portfolio'>
            <p className='py-3 py-md-0 my-auto px-md-3 p-0 pe-2'>
              Show in My Portfolio
            </p>

            <label className='px-0 ps-sm-1 ps-md-1 float-end my-auto form-switch d-flex'>
              <input
                type='checkbox'
                checked={isPublished}
                onChange={() => updateShowPreference()}
              />
              <i className='my-auto'></i>
            </label>
          </div>
        </div>
        {experiences.length !== 0 ? (
          <div className='w-100 mx-auto px-1 px-md-0 mx-md-0 row'>
            {experiences.map((experience, index, { length }) => {
              return (
                <ExperienceDetails
                  experience={experience}
                  key={experience.id}
                  index={index}
                  length={length}
                  setCurrentExperience={(experience) =>
                    setCurrentExperience(experience)
                  }
                  editing={true}
                />
              )
            })}
          </div>
        ) : (
          <>
            <p className='no-experience-added'>
              You haven’t added any of your experience… yet! Click the box below
              to add one.
            </p>
            <div className='m-3 experiences-container d-flex justify-content-center'>
              <FontAwesomeIcon
                icon={faPlus}
                className='my-5'
                style={{
                  height: '56px',
                  width: '56px',
                  cursor: 'pointer',
                  color: '#BBBDBF'
                }}
                onClick={() => setShowExperienceModal(true)}
              />
            </div>
          </>
        )}
      </div>
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
      <link
        href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
        rel='stylesheet'
      />
    </>
  )
}
