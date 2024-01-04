import React, { useState, useEffect, useLayoutEffect } from 'react'
import IntlMessages from '../../utils/IntlMessages'
import { IsUserLevelAuthorized } from '../../utils/helpers'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import './style/previewPortfolio.css'
import './style/editPortfolio.css'
import { toast } from 'react-toastify'

import { useSelector } from 'react-redux'
import useWindowWidth from '../../utils/hooks/useWindowWidth'
import { DeleteConfirmation } from '../../components/Portfolio/Confirm_modal'
import PreviewPortfolioBody from './PreviewPortfolioBody'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

const PreviewPortfolio = (props) => {
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
  const userId = useSelector((state) => state?.user?.user?.user?.id)
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
  const [approvedSkills, setApprovedSkills] = useState([])
  const [certifications, setCertifications] = useState([])
  const isOwnPortfolio = !!user && userId === user?.id
  const isPublicView = props.isPublicView
  const isPeerView = location?.state?.isPeerView
  const previousPathname = location?.state?.previousPathname
  const history = useHistory()
  const isPreview = history.location.pathname.includes('preview')
  const windowWidth = useWindowWidth()
  const isPeerShared = user?.UserPortfolio?.isPeerShared
  const isPublished = user?.UserPortfolio?.is_published

  const isPreviewPortfolio = isPreview || isPeerView || isPublicView
  const [renderPortfolio, setShouldRenderPortfolio] = useState(true)

  const updateStatus = async () => {
    await axiosInstance
      .put(`/portfolio`, {
        is_published: !toggle
      })
      .then((response) => {
        toast.success(<IntlMessages id="alerts.success_change" />)
        setToggle(!toggle)
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.success_change" />)
        setToggle(!toggle)
      })
  }

  useEffect(() => {
    if (background) {
      setExperiences(background.experience)
      setEducations(background.education)
      setAccomplishments(background.accomplishments)
      setUserCertifications(background.certificates)
    }
  }, [background])

  const isHiddenFeature = () => {
    if (isPeerView && !isPublicView) return true
    if (!isPeerView && isPublicView) return true
    if (location.pathname !== '/preview-portfolio') return true
    // if (!isPublished) return true
  }
  const getUserPortfolio = () => {
    if (username) {
      setLoading(true)
      const url = loggedUser
        ? `/users/${username}/portfolio`
        : `/${username}/portfolio`

      axiosInstance
        .get(url)
        .then((response) => {
          setUser(response.data.user)
          setToggle(response.data.is_published)
          if (response.data.user.id === userId) {
            history.push('/preview-portfolio')
          }
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
  }
  const getUserCertification = async () => {
    await axiosInstance.get(`/userCertificates/${user.id}`).then((res) => {
      setTimeout(() => {
        setUserCertifications(res.data.UserCertificates)
      }, 2000)
    })
  }
  const handlePublishedPortfolio = () => {
    setShouldRenderPortfolio(isPublished)
    getUserPortfolio()
  }

  const handlePreviewPortfolio = () => {
    if (location.pathname === '/preview-portfolio') {
      getUserData()
      setShouldRenderPortfolio(true)
    }
  }

  const handlePeerSharedPortfolio = () => {
    if (isPeerShared) {
      getUserPortfolio()
    }
  }

  const handleUserPortfolio = () => {
    getUserPortfolio()
  }
  const getPortfolio = async () => {
    setLoading(true)
    if (username) {
      await axiosInstance
        .get(`/publicPortfolio/${username}`)
        .then((response) => {
          setUser(response.data)
          if (
            response.data.is_published ||
            (response.data.isPeerShared && loggedUser)
          ) {
            getUserPortfolio()
          } else setShouldRenderPortfolio(false)
          if (response.data.user.id === userId) {
            history.push('/preview-portfolio')
          }
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    if (isPublicView) {
      getPortfolio()
    } else {
      if (isPeerView === true && !isPeerShared) {
        handleUserPortfolio()
      } else {
        getPortfolio()
        handlePeerSharedPortfolio()
        handlePreviewPortfolio()
      }
    }
  }, [isPeerView, isPublicView])

  useEffect(() => {
    if (user) {
      if (background?.length === 0 && loggedUser) {
        getSubmissions()
        getUserBio()
        // getUserSkills()
        getIAMRSkills()
        user?.show_certifications && getUserCertification()
        user?.show_experience && getUserExperiences()
        user?.show_accomplishments && getUserAccomplishments()
        user?.show_education && getUserEducations()
        user?.show_recommendations && getUserRecommendations()
      }
    }
  }, [user])

  const authorizedLevel = IsUserLevelAuthorized()
  const getUserData = async () => {
    if (userId) {
      await axiosInstance.get(`/users/${userId}`).then((response) => {
        setUser(response.data)
        axiosInstance.get('/portfolio').then((response) => {
          setToggle(response.data.is_published)
        })
        // setToggle(response.data.is_published)
      })
    }
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
    if (user) {
      await axiosInstance
        .get(`/userBackground/by-type/experience/user/${user.id}`)
        .then((res) => {
          setExperiences(res.data)
        })
    }
  }

  const getUserEducations = async () => {
    if (user) {
      await axiosInstance
        .get(`/userBackground/by-type/education/user/${user.id}`)
        .then((res) => {
          setEducations(res.data)
        })
    }
  }

  const getUserAccomplishments = async () => {
    if (user) {
      await axiosInstance
        .get(`/userBackground/by-type/accomplishments/user/${user.id}`)
        .then((res) => {
          setAccomplishments(res.data)
        })
    }
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
    if (user?.id) {
      await axiosInstance
        .get(`/users/${user?.id}`)
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
    axiosInstance.get(`/submissions/user/${user?.id}`).then((data) => {
      setSubmissions(data.data?.submissions)
    })
  }

  const getUserSkills = async () => {
    await axiosInstance
      .get('/users')
      .then((response) => {
        setSkills(response.data?.skills)
      })
      .catch((err) => err)
  }

  const getIAMRSkills = async () => {
    if (!!user && user.id) {
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
  }

  return (
    <div
      style={{
        padding: '30px 10px',
        width: isPreviewPortfolio || !isPublished ? '100%' : '88%'
      }}
    >
      {!isHiddenFeature() && (
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
                  {!isPreviewPortfolio || isPeerView ? (
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
            padding: 20,
            minHeight: '500px'
          }}
          className={
            'd-flex align-items-center justify-content-center flex-column '
          }
        >
          {!isHiddenFeature() && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
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
          {!!user ? (
            <>
              {renderPortfolio ? (
                <PreviewPortfolioBody
                  loggedUser={loggedUser}
                  user={user}
                  isPreviewPortfolio={
                    isPreview || isPublicView || isPublished || !isPublicView
                  }
                  userData={userData}
                  userBiography={userBiography}
                  location={location}
                  isOwnPortfolio={isOwnPortfolio}
                  userId={isPeerView || isPublicView ? user.id : userId}
                  approvedSkills={approvedSkills}
                  experiences={experiences}
                  educations={educations}
                  accomplishments={accomplishments}
                  userCertifications={userCertifications}
                  isPeerOrPublicView={isPeerView || isPublicView}
                />
              ) : (
                <>{'This portfolio is private'}</>
              )}
            </>
          ) : (
            <div className="text-center" style={{ color: '#01c5d1' }}>
              <FontAwesomeIcon icon={faSpinner} className="" spin />
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
