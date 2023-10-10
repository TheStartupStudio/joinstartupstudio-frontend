import React, { useState, useEffect, useLayoutEffect } from 'react'
import IntlMessages from '../../utils/IntlMessages'
import { IsUserLevelAuthorized } from '../../utils/helpers'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import './style/previewPortfolio.css'
import './style/editPortfolio.css'
import { toast } from 'react-toastify'
import { IAMR } from '../../components/Portfolio/IAMR/index'
import PersonalBio from '../../components/Portfolio/PersonalBio/PersonalBio'
import { Skills } from '../../components/Portfolio/Skills'
import { Experience } from '../../components/Portfolio/Experience'
import { Recommendation } from '../../components/Portfolio/Recommendation'
import { Education } from '../../components/Portfolio/Education'
import { Accomplishment } from '../../components/Portfolio/Accomplishment'
import LicencesCertification from '../../components/Portfolio/LicensesCertification/index'
import { useSelector } from 'react-redux'
import useWindowWidth from '../../utils/hooks/useWindowWidth'
import { DeleteConfirmation } from '../../components/Portfolio/Confirm_modal'
import PreviewPortfolioBody from './PreviewPortfolioBody'

const PreviewPortfolio = () => {
  const [user, setUser] = useState(null)
  const [toggle, setToggle] = useState(0)
  const [selected, setSelected] = useState('experience')
  const [experiences, setExperiences] = useState([])
  const [educations, setEducations] = useState([])
  const [accomplishments, setAccomplishments] = useState([])
  const [userCertifications, setUserCertifications] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [skills, setSkills] = useState([])
  const [userBiography, setUserBiography] = useState(null)
  const [userData, setUserData] = useState(null)
  // const [userId, setUserId] = useState(null)
  const userId = useSelector((state) => state.user.user.user.id)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [aggred, setAggred] = useState(false)
  const [loading, setLoading] = useState(false)
  const username = useParams().username
  const loggedUser = useSelector((state) => state?.user?.user?.user)
  const loggedUserLevel = IsUserLevelAuthorized()
  const [background, setBackground] = useState([])
  const [connections, setConnections] = useState([])
  const [emptyBackground, setEmptyBackground] = useState(true)
  const [isConnected, setIsConnected] = useState()
  const location = useLocation()
  const isOwnPortfolio = !!user && userId === user.id

  const getUserPortfolio = () => {
    setLoading(true)
    const url = loggedUser
      ? `/users/${username}/portfolio`
      : `/${username}/portfolio`
    console.log(url)
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
  const getUserCertification = async () => {
    await axiosInstance.get(`/userCertificates/${userId}`).then((res) => {
      setTimeout(() => {
        setUserCertifications(res.data.UserCertificates)
      }, 2000)
    })
  }

  const handleSelectExperience = () => {
    setSelected('experience')
  }

  const handleSelectEducation = () => {
    setSelected('education')
  }

  useEffect(() => {
    location?.state?.isPeerView && getUserPortfolio()
    !location?.state?.isPeerView && getUserData()
  }, [])

  useEffect(() => {
    if (!user) return
    getSubmissions()
    getUserBio()
    getUserSkills()

    user?.show_certifications && getUserCertification()
    user?.show_experience && getUserExperiences()
    user?.show_accomplishments && getUserAccomplishments()
    user?.show_education && getUserEducations()
    user?.show_recommendations && getUserRecommendations()
  }, [user])

  const authorizedLevel = IsUserLevelAuthorized()
  const getUserData = async () => {
    if (userId) {
      await axiosInstance.get(`/users/${userId}`).then((response) => {
        setUser(response.data)
      })
    }
  }

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
      .get(`/userBackground/by-type/experience/user/${user.id}`)
      .then((res) => {
        setExperiences(res.data)
      })
  }

  const getUserEducations = async () => {
    await axiosInstance
      .get(`/userBackground/by-type/education/user/${user.id}`)
      .then((res) => {
        setEducations(res.data)
      })
  }

  const getUserAccomplishments = async () => {
    await axiosInstance
      .get(`/userBackground/by-type/accomplishments/user/${user.id}`)
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

  const getUserBio = async () => {
    const newUserId = location?.state?.isPeerView ? user.id : userId

    if (newUserId) {
      await axiosInstance
        .get(`/users/${newUserId}`)
        .then((response) => {
          setUserBiography(response.data.bio)
          setUserData(response.data)
        })
        .catch((err) => {
          return err
        })
    }
  }

  const getSubmissions = () => {
    axiosInstance
      .get(`/submissions/user/${user?.id}`)
      .then((data) => setSubmissions(data.data?.submissions))
  }

  const getUserSkills = async () => {
    await axiosInstance
      .get('/users')
      .then((response) => {
        setSkills(response.data?.skills)
      })
      .catch((err) => err)
  }

  const [approvedSkills, setApprovedSkills] = useState([])
  const getIAMRSkills = async () => {
    try {
      const { data } = await axiosInstance.get(`/iamr/skills/user/${user.id}`)
      const approvedSkills = data.skills.reduce((accumulator, skill) => {
        if (
          skill.SkillStatus.status === 'approved' ||
          skill.SkillStatus.status === 'proficient'
        ) {
          accumulator.push(skill)
        }
        return accumulator
      }, [])
      setApprovedSkills(approvedSkills)
    } catch (error) {
      console.error('error', error)
    }
  }

  useEffect(() => {
    getIAMRSkills()
  }, [user])
  const history = useHistory()
  const isPreview = history.location.pathname.includes('preview')
  const windowWidth = useWindowWidth()

  const isPreviewPortfolio = isPreview || location?.state?.isPeerView
  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user?.UserPortfolio?.is_published || isOwnPortfolio) {
          console.log('display data')
        } else {
          console.log('private')
        }
      }
    } else {
      console.log('no data')
    }
  }, [])
  return (
    <div
      style={{
        padding: '30px 10px',
        width: isPreview || location?.state?.isPeerView ? '100%' : '88%'
      }}
    >
      {!location?.state?.isPeerView && (
        <div>
          <div>
            <span className="my_portfolio_title">
              <IntlMessages
                id="register.my_portfolio"
                className="title my_portfolio_title"
              />
            </span>
            <span className="mx-2 my_portfolio_bar d-sm-inline">|</span>
            <span className="text-uppercase title_preview_portfolio d-block d-sm-inline">
              {
                <>
                  {!isPreview || location?.state?.isPeerView ? (
                    <Link to={'/preview-portfolio'}>
                      <IntlMessages id="portfolio.preview" />
                    </Link>
                  ) : (
                    <Link to={'/edit-portfolio'}>Edit</Link>
                  )}
                </>
              }
            </span>
            <p className="my_portfolio_edit">
              <IntlMessages id="portfolio.my_portfolio_edit" />
            </p>
          </div>
        </div>
      )}
      {
        <div
          style={{
            background: '#F8F7F7 0% 0% no-repeat padding-box',
            opacity: 1,
            padding: 20
          }}
        >
          {!location?.state?.isPeerView && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '30%' }}>
                <span className="my_portfolio_publish pe-xxl-0 ">
                  <IntlMessages id="portfolio.Publish.My.Portfolio" />
                  <label className="px-0 ps-sm-1 ps-md-1 form-switch">
                    <input
                      type="checkbox"
                      checked={toggle}
                      onChange={() => {
                        if (toggle) {
                          updateStatus()
                        } else {
                          setShowPublishModal(true)
                        }
                      }}
                    />
                    <i></i>
                  </label>
                </span>

                <span className="ps-xl-0 d-block mt-1 mt-sm-1 publish_checkbox_info">
                  <IntlMessages id="portfolio.publish_checkbox" />
                </span>
              </div>
            </div>
          )}
          <PreviewPortfolioBody
            user={user}
            isPreviewPortfolio={isPreviewPortfolio}
            userData={userData}
            userBiography={userBiography}
            location={location}
            isOwnPortfolio={isOwnPortfolio}
            userId={userId}
            approvedSkills={approvedSkills}
            experiences={experiences}
            educations={educations}
            accomplishments={accomplishments}
            userCertifications={userCertifications}
          />
          {/*{!!user && (*/}
          {/*  <PersonalBio*/}
          {/*    user={user}*/}
          {/*    isPreview={isPreviewPortfolio}*/}
          {/*    userBiography={userBiography}*/}
          {/*    userData={userData}*/}
          {/*    userId={location?.state?.isPeerView ? user.id : userId}*/}
          {/*  />*/}
          {/*)}*/}
          {/*{!!user ? (*/}
          {/*  (!!user && user?.UserPortfolio?.is_published) || isOwnPortfolio ? (*/}
          {/*    <>*/}
          {/*      {user?.show_iamr && (*/}
          {/*        <IAMR user={user} isPreview={isPreviewPortfolio} />*/}
          {/*      )}*/}

          {/*      {approvedSkills?.length > 0 && (*/}
          {/*        <Skills*/}
          {/*          user={user}*/}
          {/*          isPreview={isPreviewPortfolio}*/}
          {/*          approvedSkills={approvedSkills}*/}
          {/*        />*/}
          {/*      )}*/}

          {/*      {isPreviewPortfolio && (*/}
          {/*        <div style={{ display: 'flex', gap: 20, width: '100%' }}>*/}
          {/*          <div*/}
          {/*            onClick={handleSelectExperience}*/}
          {/*            style={{*/}
          {/*              background: `${*/}
          {/*                selected === 'experience' ? '#51C7DF' : '#fff'*/}
          {/*              } 0% 0% no-repeat padding-box`,*/}
          {/*              border: '1px solid #BBBDBF',*/}
          {/*              borderRadius: 6,*/}
          {/*              width: '50%',*/}
          {/*              display: 'flex',*/}
          {/*              alignItems: 'center',*/}
          {/*              justifyContent: 'center'*/}
          {/*            }}*/}
          {/*          >*/}
          {/*            <div*/}
          {/*              style={{*/}
          {/*                font: `normal normal 600 ${*/}
          {/*                  windowWidth < 700 ? '15px/27px' : '22px/27px'*/}
          {/*                } Montserrat`,*/}
          {/*                letterSpacing: 0,*/}
          {/*                color: '#231F20',*/}
          {/*                textAlign: 'center',*/}
          {/*                padding: windowWidth < 600 ? '5px 15px' : '20px 30px',*/}
          {/*                textTransform: 'uppercase',*/}
          {/*                display: 'flex',*/}
          {/*                alignItems: 'center',*/}
          {/*                justifyContent: 'center'*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              Experience*/}
          {/*            </div>*/}
          {/*          </div>*/}
          {/*          <div*/}
          {/*            onClick={handleSelectEducation}*/}
          {/*            style={{*/}
          {/*              background: `${*/}
          {/*                selected === 'education' ? '#51C7DF' : '#fff'*/}
          {/*              } 0% 0% no-repeat padding-box`,*/}
          {/*              border: '1px solid #BBBDBF',*/}
          {/*              borderRadius: 6,*/}
          {/*              width: '50%',*/}
          {/*              display: 'flex',*/}
          {/*              alignItems: 'center',*/}
          {/*              justifyContent: 'center'*/}
          {/*            }}*/}
          {/*          >*/}
          {/*            <div*/}
          {/*              style={{*/}
          {/*                font: `normal normal 600 ${*/}
          {/*                  windowWidth < 700 ? '15px/27px' : '22px/27px'*/}
          {/*                } Montserrat`,*/}
          {/*                letterSpacing: 0,*/}
          {/*                color: '#231F20',*/}
          {/*                textAlign: 'center',*/}
          {/*                padding: windowWidth < 600 ? '5px 15px' : '20px 30px',*/}
          {/*                textTransform: 'uppercase',*/}
          {/*                display: 'flex',*/}
          {/*                alignItems: 'center',*/}
          {/*                justifyContent: 'center'*/}
          {/*              }}*/}
          {/*            >*/}
          {/*              Education & Certifications*/}
          {/*            </div>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      )}*/}

          {/*      {selected === 'experience' && (*/}
          {/*        <div>*/}
          {/*          {user?.show_experience && experiences?.length ? (*/}
          {/*            <Experience user={user} isPreview={isPreviewPortfolio} />*/}
          {/*          ) : (*/}
          {/*            <></>*/}
          {/*          )}*/}

          {/*          /!*<Recommendation user={user} />*!/*/}
          {/*        </div>*/}
          {/*      )}*/}
          {/*      {selected === 'education' && (*/}
          {/*        <div>*/}
          {/*          {user?.show_education && educations?.length ? (*/}
          {/*            <Education user={user} isPreview={isPreviewPortfolio} />*/}
          {/*          ) : (*/}
          {/*            <></>*/}
          {/*          )}*/}

          {/*          {user?.show_accomplishments && accomplishments?.length ? (*/}
          {/*            <Accomplishment*/}
          {/*              user={user}*/}
          {/*              isPreview={isPreviewPortfolio}*/}
          {/*            />*/}
          {/*          ) : (*/}
          {/*            <></>*/}
          {/*          )}*/}

          {/*          {user?.show_certifications && userCertifications?.length ? (*/}
          {/*            <LicencesCertification*/}
          {/*              user={user}*/}
          {/*              isPreview={isPreviewPortfolio}*/}
          {/*            />*/}
          {/*          ) : (*/}
          {/*            <></>*/}
          {/*          )}*/}
          {/*        </div>*/}
          {/*      )}*/}
          {/*    </>*/}
          {/*  ) : (*/}
          {/*    <div className="mx-auto w-100 my-auto text-center my-5">*/}
          {/*      <p className="py-5">This portfolio is private</p>*/}
          {/*    </div>*/}
          {/*  )*/}
          {/*) : (*/}
          {/*  <></>*/}
          {/*)}*/}
        </div>
      }
      <DeleteConfirmation
        showModal={showPublishModal}
        onHide={() => setShowPublishModal(false)}
        confirmModal={() => true}
        checkIfAggre={() => {
          updateStatus()
          setLoading(true)
          setAggred(true)
          setTimeout(() => {
            setLoading(false)
            setShowPublishModal(false)
          }, 5000)
        }}
        loading={loading}
        setLoading={(data) => setLoading(data)}
        type={true}
        title={<IntlMessages id="portfolio.confirmation_modal" />}
        body={<IntlMessages id="portfolio.confirmation_modal_second_part" />}
      />
    </div>
  )
}
export default PreviewPortfolio
