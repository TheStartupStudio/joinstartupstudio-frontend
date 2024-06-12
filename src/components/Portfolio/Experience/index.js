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
import PortfolioSection from '../../../pages/PortfolioNew/PortfolioSection'
import { useHistory } from 'react-router-dom'
import EmptyExperienceSection from '../../../pages/PortfolioNew/EmptyExperienceSection'

export const Experience = (props) => {
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [experiences, setExperiences] = useState([])
  const [currentExperience, setCurrentExperience] = useState([])
  const [isPublished, setIsPublished] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setExperiences(props.experiences)
  }, [props.experiences])

  const [isPreview, setIsPreview] = useState(null)

  useEffect(() => {
    setIsPreview(props.isPreview)
  }, [props.isPreview])
  // useEffect(() => {
  //   getUserExperiences()
  // }, [])

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
        toast.error(<IntlMessages id="alerts.something_went_wrong" />)
      })
  }

  const getUserExperiences = async () => {
    setIsLoading(true)
    await axiosInstance
      .get(`/userBackground/by-type/experience/user/${props.user.id}`)
      .then((res) => {
        setExperiences(res.data)
        setIsLoading(false)
      })
  }

  const updateExperience = async (experience) => {
    // props.updateExperience(experience)
    setExperiences(
      experiences.map((exp) => {
        if (exp.id === experience.id) return (exp = experience)
        return exp
      })
    )
  }

  const deleteExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
  }

  const addExperience = async (experience) => {
    setExperiences([...experiences, experience])
  }

  return (
    <>
      {!isLoading ? (
        experiences?.length ? (
          <PortfolioSection
            title={'Experience'}
            isAdd={true}
            showInMyPortfolio={true}
            onAdd={() => setShowExperienceModal(true)}
            isShownInPortfolio={isPublished}
            handleShowInPortfolio={() => updateShowPreference()}
            isPreview={isPreview}
          >
            <div
              className="
        experiences-container
        mx-0 mt-4
        "
            >
              <div className="w-100 mx-auto  px-md-0 mx-md-0 row gap-4">
                {experiences?.map((experience, index, { length }) => {
                  return (
                    <div
                      key={index}
                      style={{
                        border: '1px solid #E5E5E5',
                        borderRadius: 6,
                        background: '#F8F8F8 0% 0% no-repeat padding-box',
                        minHeight: 230
                      }}
                    >
                      <ExperienceDetails
                        experience={experience}
                        key={experience.id}
                        index={index}
                        length={length}
                        setCurrentExperience={(experience) =>
                          setCurrentExperience(experience)
                        }
                        editing={true}
                        isPreview={isPreview}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
            <ExperienceModal
              show={showExperienceModal}
              onHide={() => {
                setCurrentExperience([])
                setShowExperienceModal(false)
              }}
              updateExperience={(exp) => updateExperience(exp)}
              addExperience={(exp) => addExperience(exp)}
              deleteBackground={(id) => deleteExperience(id)}
              currentExperience={currentExperience}
            />
            <link
              href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
              rel="stylesheet"
            />
          </PortfolioSection>
        ) : (
          <>
            {!props.isPeerOrPublicView ? (
              <EmptyExperienceSection
                user={props.user}
                addExperience={addExperience}
              />
            ) : (
              <></>
            )}
          </>
        )
      ) : (
        <></>
      )}
    </>
  )
}
