import React, { useState, useEffect, useLayoutEffect } from 'react'
import PreviewPersonalBio from '../../components/Portfolio/preview/PreviewPersonalBio'
import PreviewSkill from '../../components/Portfolio/preview/PreviewSkill'
import IntlMessages from '../../utils/IntlMessages'
import { IsUserLevelAuthorized } from '../../utils/helpers'
import { Link } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import './style/previewPortfolio.css'
import './style/editPortfolio.css'
import { toast } from 'react-toastify'
import Licenses_Certification_Preview from '../../components/Portfolio/Licenses_Certification/Licenses_Certification_Preview'
import { ExperienceDetails } from '../../components/Portfolio/Experience/experienceDetails'
import { RecommendationDetails } from '../../components/Portfolio/Recommendation/recommendationDetails'
import { EducationDetails } from '../../components/Portfolio/Education/educationDetails'
import { AccomplishmentDetails } from '../../components/Portfolio/Accomplishment/accomplishmentDetails'
import { ShareMyPortfolioWidget } from '../../components/Portfolio/preview/shareMyPortfolioWidget'
import { ShowMessenger } from '../../utils/helpers'
import ConnectionRequestsBox from '../../components/Connections/connectionRequestBox'
import { IAMR } from '../../components/Portfolio/IAMR/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

const PreviewPortfolio = () => {
  const [user, setUser] = useState()
  const [toggle, setToggle] = useState(0)
  const [selected, setSelected] = useState('EXPERIENCE')
  const [experiences, setExperiences] = useState([])
  const [educations, setEducations] = useState([])
  const [accomplishments, setAccomplishments] = useState([])
  const [recommendations, setRecommendations] = useState([])

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (!user) return

    user.show_experience && getUserExperiences()
    user.show_accomplishments && getUserAccomplishments()
    user.show_education && getUserEducations()
    user.show_recommendations && getUserRecommendations()
  }, [user])

  const authorizedLevel = IsUserLevelAuthorized()

  const updateStatus = async () => {
    await axiosInstance
      .put(`/users`, {
        is_published: !toggle
      })
      .then(() => {
        toast.success(<IntlMessages id="alerts.success_change" />)
        setToggle(!toggle)
      })
      .catch((err) => err)
  }

  const getUserRecommendations = async () => {
    authorizedLevel &&
      (await axiosInstance
        .get(`/recommendations?status=approved`)
        .then((res) => {
          setRecommendations(res.data)
        }))
  }

  const getUserExperiences = async () => {
    await axiosInstance
      .get(`/userBackground/by-type/experience`)
      .then((res) => {
        setExperiences(res.data)
      })
  }

  const getUserEducations = async () => {
    await axiosInstance.get(`/userBackground/by-type/education`).then((res) => {
      setEducations(res.data)
    })
  }

  const getUserAccomplishments = async () => {
    await axiosInstance
      .get(`/userBackground/by-type/accomplishments`)
      .then((res) => {
        setAccomplishments(res.data)
      })
  }

  const getUser = async () => {
    await axiosInstance
      .get(`/users`)
      .then(async (response) => {
        setUser(response.data)
        await axiosInstance.get('/portfolio').then((response) => {
          setToggle(response.data.is_published)
        })
      })
      .catch((err) => err)
  }

  return (
    <div id="main-body">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-xl-9 gx-0 gx-sm-auto page-border">
            <div className="page-padding">
              <div className="row">
                <h3 className="py-0 my-0 gy-0 ps-0 ms-0">
                  <span className="my_portfolio_bar d-sm-inline py-0 my-0 gy-0">
                    MY PORTFOLIO |
                  </span>
                  <span className="text-uppercase title_preview_portfolio d-sm-inline">
                    <Link to={'/edit-portfolio'}> Edit</Link>
                  </span>
                  <span className="py-0 my-0 my_portfolio_edit d-block">
                    Share your empowerment, wellness, and performance with the
                    global community
                  </span>
                </h3>
                <PreviewPersonalBio />
                {user && (
                  /*user.show_iamr &&*/ <IAMR
                    user={user}
                    preview="1"
                    className="px-0"
                  />
                )}
                <PreviewSkill skills={user?.Skills && user?.Skills} />

                <div className="mt-5 row text-center w-100 pe-0 me-0 gx-0">
                  <div
                    className={`col-6 text-center px-0 py-2 gx-0 mx-0 ${
                      selected != 'EXPERIENCE'
                        ? 'video_podcast_0'
                        : 'video_podcast_1'
                    }`}
                    onClick={() => setSelected('EXPERIENCE')}
                  >
                    <span role="button">EXPERIENCE</span>
                  </div>
                  <div
                    className={`col-6 text-center px-0 py-2 gx-0 mx-0 ${
                      selected != 'EDUCATION & CERTIFICATIONS'
                        ? 'video_podcast_0'
                        : 'video_podcast_1'
                    }`}
                    onClick={() => setSelected('EDUCATION & CERTIFICATIONS')}
                  >
                    <span role="button" className="d-none d-md-block">
                      EDUCATION & CERTIFICATIONS
                    </span>
                    <span role="button" className="d-md-none">
                      EDUCATION
                    </span>
                  </div>
                  {selected === 'EXPERIENCE' ? (
                    <>
                      {experiences.length !== 0 && (
                        <div className="w-100 mx-auto px-1 px-md-0 mx-md-0 text-start mt-3 preview-container">
                          <h4>EXPERIENCE</h4>
                          {experiences.map((experience, index, { length }) => {
                            return (
                              <ExperienceDetails
                                experience={experience}
                                key={experience.id}
                                index={index}
                                length={length}
                                // setCurrentExperience={(experience) =>
                                //   setCurrentExperience(experience)
                                // }
                                editing={false}
                              />
                            )
                          })}
                        </div>
                      )}
                      {authorizedLevel && recommendations.length !== 0 && (
                        <div className="w-100 mx-auto px-1 px-md-0 mx-md-0 text-start mt-3 preview-container">
                          <h4>RECOMMENDATIONS</h4>

                          {recommendations.map(
                            (recommendation, index, { length }) => {
                              return (
                                <RecommendationDetails
                                  recommendation={recommendation}
                                  key={recommendation.id}
                                  index={index}
                                  length={length}
                                />
                              )
                            }
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="w-100 mx-auto px-1 px-md-0 mx-md-0 mt-3 text-start preview-container">
                        {educations.length !== 0 && (
                          <>
                            <h4>EDUCATION</h4>

                            {educations.map((education, index, { length }) => {
                              return (
                                <EducationDetails
                                  education={education}
                                  key={education.id}
                                  index={index}
                                  length={length}
                                  // setCurrentExperience={(experience) =>
                                  //   setCurrentExperience(experience)
                                  // }
                                  editing={false}
                                />
                              )
                            })}
                          </>
                        )}
                        {accomplishments.length !== 0 && (
                          <>
                            <h4 className="mt-3">ACCOMPLISHMENTS</h4>
                            <div className="experience-details">
                              {accomplishments.map(
                                (accomp, index, { length }) => {
                                  return (
                                    <AccomplishmentDetails
                                      accomp={accomp}
                                      key={accomp.id}
                                      index={index}
                                      length={length}
                                      // setCurrentExperience={(experience) =>
                                      //   setCurrentExperience(experience)
                                      // }
                                      editing={false}
                                    />
                                  )
                                }
                              )}
                            </div>
                          </>
                        )}
                      </div>
                      {user?.show_certifications ? (
                        <Licenses_Certification_Preview from_page={'preview'} />
                      ) : (
                        <span>
                          Please turn on Licenses & Certifications to preview
                          them.
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-12 pb-5 py-lg-0 col-xl-3"
            style={{
              marginTop: '40px'
            }}
          >
            <div className="col-12 px-3 px-xl-0 d-flex flex-wrap d-flex justify-content-start">
              <h3 className="publishMyPortfolio d-flex ">
                Publish my portfolio
                <label className="px-0 ps-sm-1 ms-3 ps-md-1 form-switch  ">
                  <input
                    type="checkbox"
                    checked={toggle}
                    onChange={() => {
                      updateStatus()
                    }}
                  />
                  <i></i>
                </label>
              </h3>
              <div
                style={{
                  flexBasis: '100%',
                  height: 0
                }}
              ></div>
              <p className=" pe-xxl-5 break d-flex previewSpanPublish">
                Publish your portfolio to share your story with the global
                community.
              </p>
            </div>
            <div className="d-flex px-3 px-xl-0 justify-content-start">
              <ShareMyPortfolioWidget user={user && user} />
            </div>

            <div className="px-3 px-xl-0">
              <ConnectionRequestsBox />
              <ShowMessenger />
              {/* <div
                className={`community-connect px-3 ${
                  !IsUserLevelAuthorized() && 'notAllowed'
                } my-2`}
              >
                <Link to='/my-connections'>
                  <FontAwesomeIcon
                    icon={faUsers}
                    style={{
                      color: '#01C5D1',
                      background: 'white',
                      borderRadius: '50%',
                      height: '25px',
                      width: '36px',
                      opacity: '1'
                    }}
                  />
                </Link>
                <Link to='/my-connections'>
                  <p className='my-auto ms-2'>Connect with my community</p>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PreviewPortfolio
