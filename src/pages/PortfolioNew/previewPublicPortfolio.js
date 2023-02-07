import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import PreviewPersonalBio from '../../components/Portfolio/preview/PreviewPersonalBio'
import PreviewSkill from '../../components/Portfolio/preview/PreviewSkill'
import IntlMessages from '../../utils/IntlMessages'
// import { Link } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { useSelector } from 'react-redux'
import './style/previewPortfolio.css'
import './style/editPortfolio.css'
import { toast } from 'react-toastify'
import Licenses_Certification_Preview from '../../components/Portfolio/Licenses_Certification/Licenses_Certification_Preview'
import { ExperienceDetails } from '../../components/Portfolio/Experience/experienceDetails'
import { EducationDetails } from '../../components/Portfolio/Education/educationDetails'
import { AccomplishmentDetails } from '../../components/Portfolio/Accomplishment/accomplishmentDetails'
import { RecommendationDetails } from '../../components/Portfolio/Recommendation/recommendationDetails'
import { ShareMyPortfolioWidget } from '../../components/Portfolio/preview/shareMyPortfolioWidget'
import { ShowMessenger } from '../../utils/helpers'
import ConnectionRequestsBox from '../../components/Connections/connectionRequestBox'
import NotFound from '../NotFound'
import { ConnectionRequestedModal } from '../../components/Modals/Connections/connectionRequestedModal'
import { ContactUserModal } from '../../components/Modals/contactUserModal'
import socket from '../../utils/notificationSocket'
import NotificationTypes from '../../utils/notificationTypes'
import {
  IsUserLevelAuthorized,
  checkLevelAuthorized
} from '../../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { IAMR } from '../../components/Portfolio/IAMR/index'
import { EducationCertifications } from './educationAndCertification/certification/EducationCertifications'

const PreviewPublicPortfolio = () => {
  const [user, setUser] = useState()
  const username = useParams().username
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState('EXPERIENCE')
  const [background, setBackground] = useState([])
  const [connections, setConnections] = useState([])
  const [emptyBackground, setEmptyBackground] = useState(true)
  const [isConnected, setIsConnected] = useState()
  const [showRequestedModal, setShowRequestedModal] = useState(false)
  const [showContactUserModal, setShowContactUserModal] = useState(false)
  const loggedUser = useSelector((state) => state?.user?.user?.user)
  const loggedUserLevel = IsUserLevelAuthorized()

  useEffect(() => {
    getUser()
    if (user) {
      getConnections()
    }
  }, [])

  useEffect(() => {
    if (
      (background?.length === 0 && user?.recommendationsTo.length === 0) ||
      (background?.accomplishments?.length === 0 &&
        background?.education?.length === 0 &&
        background?.experience?.length === 0 &&
        background?.certificates?.length === 0 &&
        user?.recommendationsTo?.length === 0)
    ) {
      setEmptyBackground(true)
    } else {
      setEmptyBackground(false)
    }
  }, [background])

  const newConnectionRequest = async () => {
    await axiosInstance
      .post('/connect', {
        toUserId: user.id
      })
      .then((res) => {
        setIsConnected('request')
        setShowRequestedModal(true)
        if (loggedUser.id !== user.id) {
          socket?.emit('sendNotification', {
            sender: { id: loggedUser.id, name: loggedUser.name },
            receiver: { id: user.id },
            type: NotificationTypes.FRIEND_REQUEST.key,
            url: `/my-connections/request/${res.data.id}`
          })
        }
      })
      .catch((e) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      })
  }

  const getConnections = async () => {
    await axiosInstance.get('/connect').then((res) => {
      setConnections(res.data.count)
    })
  }

  const getUser = () => {
    const url = loggedUser
      ? `/users/${username}/portfolio`
      : `/${username}/portfolio`
    axiosInstance
      .get(url)
      .then((response) => {
        setUser(response.data.user)
        setIsConnected(response.data.isConnected)
        if (response.data?.userBackground)
          setBackground(response.data.userBackground)
        else setBackground(null)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
      })
  }

  return (
    <>
      {!user && loading && (
        <div className='min-vh-100 min-w-100 mx-auto my-auto text-center d-flex'>
          <div className='d-flex justify-content-center align-items-center flex-column mx-auto'>
            <div className='lds-facebook'>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p style={{ color: '#01c5d1' }}>Loading data, please wait!</p>
          </div>
        </div>
      )}

      {user && !loading ? (
        <>
          <div id='main-body'>
            <div className='container-fluid'>
              <div className='row preview-portfolio-container'>
                <div
                  className={`col-12 gx-0 gx-sm-auto account-page-padding page-border ${
                    loggedUser ? 'col-xl-9' : 'col-xl-12'
                  }`}
                >
                  <div className='mx-2'>
                    <div className='row'>
                      <h3 className='py-0 my-0 gy-0'>
                        <span className='my_portfolio_bar d-sm-inline py-0 my-0 gy-0'>
                          WELCOME TO MY LEARN TO START PORTFOLIO
                        </span>
                      </h3>
                      {user && (
                        <PreviewPersonalBio
                          user={user}
                          isConnected={isConnected}
                          contactUser={() => setShowContactUserModal(true)}
                          newConnectionRequest={() => newConnectionRequest()}
                        />
                      )}
                      {user.UserPortfolio.is_published || background ? (
                        <>
                          {user && (
                            /*user.show_iamr &&*/ <IAMR
                              user={user}
                              preview='1'
                              className='px-0'
                            />
                          )}
                          <div>
                            <PreviewSkill
                              skills={user?.Skills && user?.Skills}
                            />
                          </div>
                          {!emptyBackground && (
                            <>
                              <div className='mt-5 row text-center w-100 pe-0 me-0'>
                                <div
                                  className={`col-6 text-center px-0 py-2 gx-0 mx-0 ${
                                    selected != 'EXPERIENCE'
                                      ? 'video_podcast_0'
                                      : 'video_podcast_1'
                                  }`}
                                  onClick={() => setSelected('EXPERIENCE')}
                                >
                                  <span role='button'>EXPERIENCE</span>
                                </div>
                                <div
                                  className={`col-6 text-center px-0 py-2 gx-0 mx-0 ${
                                    selected != 'EDUCATION & CERTIFICATIONS'
                                      ? 'video_podcast_0'
                                      : 'video_podcast_1'
                                  }`}
                                  onClick={() =>
                                    setSelected('EDUCATION & CERTIFICATIONS')
                                  }
                                >
                                  <span
                                    role='button'
                                    className='d-none d-md-block'
                                  >
                                    EDUCATION & CERTIFICATIONS
                                  </span>
                                  <span role='button' className='d-md-none'>
                                    EDUCATION
                                  </span>
                                </div>

                                {selected === 'EXPERIENCE' ? (
                                  <>
                                    {background?.experience?.length > 0 && (
                                      <div className='w-100 mx-auto px-1 px-md-0 mx-md-0 row text-start mt-5 preview-container'>
                                        <h4>EXPERIENCE</h4>

                                        {background?.experience?.map(
                                          (experience, index, { length }) => {
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
                                          }
                                        )}
                                      </div>
                                    )}

                                    {user?.recommendationsTo.length > 0 && (
                                      <div className='w-100 mx-auto px-1 px-md-0 mx-md-0 text-start mt-3 preview-container'>
                                        <h4>RECOMMENDATIONS</h4>

                                        {user.recommendationsTo.map(
                                          (
                                            recommendation,
                                            index,
                                            { length }
                                          ) => {
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
                                    {(background?.education?.length > 0 ||
                                      background?.accomplishments?.length > 0 ||
                                      background?.certificates?.length > 0) && (
                                      <div className='w-100 mx-auto px-1 px-md-0 mx-md-0 row text-start mt-5 preview-container'>
                                        {background?.education?.length > 0 && (
                                          <>
                                            <h4>EDUCATION</h4>
                                            {background?.education?.map(
                                              (
                                                education,
                                                index,
                                                { length }
                                              ) => {
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
                                              }
                                            )}
                                          </>
                                        )}

                                        {background?.accomplishments?.length >
                                          0 && (
                                          <>
                                            <h4>ACCOMPLISHMENTS</h4>
                                            <div className='experience-details'>
                                              {background?.accomplishments?.map(
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
                                    )}

                                    {background?.certificates?.length > 0 && (
                                      <>
                                        <div className='col-12'>
                                          <EducationCertifications
                                            certificates={
                                              background?.certificates
                                            }
                                          />
                                        </div>
                                      </>
                                    )}
                                  </>
                                )}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className='mx-auto w-100 my-auto text-center my-5'>
                          <p className='py-5'>This portfolio is private</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {loggedUser && (
                  <div className='col-12 col-xl-3 account-page-padding mx-2 mx-xl-0'>
                    <div className='d-flex justify-content-start'>
                      <ShareMyPortfolioWidget user={loggedUser} />
                    </div>
                    {(!checkLevelAuthorized(user.level) ||
                      !loggedUserLevel) && (
                      <div className='d-flex mt-2 pt-2 not-contactable'>
                        <FontAwesomeIcon
                          icon={faEnvelope}
                          className='my-auto'
                          style={{ width: '30px', height: '30px' }}
                        />
                        <p className='my-auto ps-2'>
                          To contact this user, please use their social media
                          links.
                        </p>
                      </div>
                    )}
                    <ConnectionRequestsBox count={connections.count} />
                    <ShowMessenger />
                  </div>
                )}
              </div>
            </div>
          </div>

          <ConnectionRequestedModal
            show={showRequestedModal}
            onHide={() => setShowRequestedModal(false)}
          />
          <ContactUserModal
            show={showContactUserModal}
            onHide={() => setShowContactUserModal(false)}
            email={user.email}
          />
        </>
      ) : (
        !loading && <NotFound />
      )}
    </>
  )
}
export default PreviewPublicPortfolio
