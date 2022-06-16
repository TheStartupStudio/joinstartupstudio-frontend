import React, { useEffect, useState } from 'react'
import IntlMessages from '../../../utils/IntlMessages'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../../utils/AxiosInstance'
import { EducationModal } from './educationModal'
import { EducationDetails } from './educationDetails'
import '../Experience/style.css'
import { toast } from 'react-toastify'

export const Education = (props) => {
  const [showEducationModal, setShowEducationModal] = useState(false)
  const [educations, setEducations] = useState([])
  const [currentEducation, setCurrentEducation] = useState([])
  const [isPublished, setIsPublished] = useState(false)

  useEffect(() => {
    getUserEducations()
  }, [])

  useEffect(() => {
    props.user !== undefined && setIsPublished(props.user?.show_education)
  }, [props.user])

  useEffect(() => {
    if (currentEducation.length !== 0) setShowEducationModal(true)
  }, [currentEducation])

  const updateShowPreference = async () => {
    const oldPublishValue = isPublished
    setIsPublished(!isPublished)

    await axiosInstance
      .put(`/users`, {
        show_education: !oldPublishValue
      })
      .then()
      .catch((e) => {
        setIsPublished(!oldPublishValue)
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      })
  }

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
    <>
      <div className='experiences-container mx-0 mt-4'>
        <div className='d-flex m-3 experience-header'>
          <h4 className='title p-0 my-auto float-start'>EDUCATION</h4>
          <span className='float-end my-auto pe-1 pe-md-0'>
            <FontAwesomeIcon
              icon={faPlus}
              className=''
              style={{ height: '25px', width: '25px', cursor: 'pointer' }}
              onClick={() => setShowEducationModal(true)}
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
        {educations.length !== 0 ? (
          <div className='w-100 mx-auto px-1 px-md-0 mx-md-0 row'>
            {educations.map((education, index, { length }) => {
              return (
                <EducationDetails
                  education={education}
                  key={education.id}
                  index={index}
                  length={length}
                  setCurrentEducation={(education) =>
                    setCurrentEducation(education)
                  }
                  editing={true}
                />
              )
            })}
          </div>
        ) : (
          <>
            <p className='no-experience-added'>
              You haven’t added any educational degrees… yet! Click the box
              below to add one.
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
                onClick={() => setShowEducationModal(true)}
              />
            </div>
          </>
        )}
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
      <link
        href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
        rel='stylesheet'
      />
    </>
  )
}
