import React, { useEffect, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { changeSidebarState } from '../../redux'
import './style/editPortfolio.css'
import IntlMessages from '../../utils/IntlMessages'
import PersonalBio from '../../components/Portfolio/PersonalBio/PersonalBio'
import axiosInstance from '../../utils/AxiosInstance'
import { Skills } from '../../components/Portfolio/Skills'
import { Experience } from '../../components/Portfolio/Experience'
import { Education } from '../../components/Portfolio/Education'
import { Accomplishment } from '../../components/Portfolio/Accomplishment'
import { Recommendation } from '../../components/Portfolio/Recommendation'
import { IAMR } from '../../components/Portfolio/IAMR'
import LicencesCertification from '../../components/Portfolio/LicensesCertification/index'
import { DeleteConfirmation } from '../../components/Portfolio/Confirm_modal'
import { toast } from 'react-toastify'
import './style/previewPortfolio.css'
import { IsUserLevelAuthorized } from '../../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import verifyNovae from '../../assets/images/verify-novae.png'
import avatar from '../../assets/images/profile-image.png'
import EditBio from '../../components/Portfolio/PersonalBio/EditBio'
import EmptyEducationSection from './EmptyEducationSection'
import EmptyAccomplishmentSection from './EmptyAccomplishmentSection'
// import EmptyCertificationSection from './EmptyCertificationSection'
import EmptyExperienceSection from './EmptyExperienceSection'
import EmptyCertificationSection from './EmptyCertificationSection'
import { ShareMyPortfolioWidget } from '../../components/Portfolio/preview/shareMyPortfolioWidget'

export const VerifyButton = (props) => {
  return (
    <div
      style={{
        border: '1px solid #F2359D',
        borderRadius: 3,
        color: '#F2359D',
        width: props.width ? props.width : '100%',
        textAlign: 'center',
        padding: '10px 4px',
        height: 35,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#F2359D' // Change background color on hover
        e.target.style.color = '#FFFFFF' // Change text color on hover
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent' // Revert background color on mouse leave
        e.target.style.color = '#F2359D' // Revert text color on mouse leave
      }}
    >
      Verify
    </div>
  )
}

function EditPortfolio() {
  const [toggle, setToggle] = useState(0)
  const [togglePeerSharing, setTogglePeerSharing] = useState(0)
  const [user, setUser] = useState()
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [experiences, setExperiences] = useState([])
  const [educations, setEducations] = useState([])
  const [accomplishments, setAccomplishments] = useState([])
  const [certifications, setCertifications] = useState([])
  const [recommendationRequestId, setRecommendationRequestId] = useState()

  const [aggred, setAggred] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const userId = useSelector((state) => state.user.user.user.id)
  const isOwnPortfolio = !!user && userId === user?.id

  const dispatch = useDispatch()

  const authorizedLevel = IsUserLevelAuthorized()
  const paramId = useParams().id

  useEffect(() => {
    window.location.href.includes('recommendation') &&
      setRecommendationRequestId(paramId)
  }, [paramId])

  useEffect(() => {
    dispatch(changeSidebarState(false))
  })
  const getUser = async () => {
    await axiosInstance
      .get(`/users`)
      .then(async (response) => {
        setUser(response.data)
        await axiosInstance.get('/portfolio').then((response) => {
          setToggle(response.data.is_published)
          setTogglePeerSharing(response.data.isPeerShared)
        })
      })
      .catch((err) => err)
  }

  useEffect(() => {
    getUser()
  }, [])

  console.log('toggle', toggle)

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

  const updatePeerSharing = async () => {
    const data = {
      isPeerShared: !togglePeerSharing
    }
    await axiosInstance
      .put(`/portfolio/peerSharing/`, data)
      .then((response) => {
        toast.success(<IntlMessages id="alerts.success_change" />)
        setTogglePeerSharing(!togglePeerSharing)
      })
      .catch((err) => {
        toast.error(<IntlMessages id="alerts.success_change" />)
        setTogglePeerSharing(!togglePeerSharing)
      })
  }

  const [approvedSkills, setApprovedSkills] = useState([])
  const getIAMRSkills = async () => {
    try {
      const { data } = await axiosInstance.get(`/iamr/skills/user/${userId}`)
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

  const getUserAccomplishments = async () => {
    setIsLoading(true)
    await axiosInstance
      .get(`/userBackground/by-type/accomplishments/user/${user.id}`)
      .then((res) => {
        setAccomplishments(res.data)
        setIsLoading(false)
      })
  }

  const getUserCertifications = async () => {
    setIsLoading(true)

    await axiosInstance.get(`/userCertificates/${user.id}`).then((res) => {
      // setTimeout(() => {
      setCertifications(res.data.UserCertificates)
      setIsLoading(false)
      // }, 2000)
    })
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
  useEffect(() => {
    if (user) {
      getIAMRSkills()
      getUserExperiences()
      getUserAccomplishments()
      getUserCertifications()
      getUserEducations()
    }
  }, [user])

  const getUserExperiences = async () => {
    setIsLoading(true)
    await axiosInstance
      .get(`/userBackground/by-type/experience/user/${user.id}`)
      .then((res) => {
        setExperiences(res.data)
        setIsLoading(false)
      })
  }

  return (
    <div className={'edit-portfolio-container'}>
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
            <Link to={'/preview-portfolio'}>
              <IntlMessages id="portfolio.preview" />
            </Link>
          </span>
          <p className="my_portfolio_edit">
            <IntlMessages id="portfolio.my_portfolio_edit" />
          </p>
        </div>
      </div>
      <div
        style={{
          background: '#F8F7F7 0% 0% no-repeat padding-box',
          opacity: 1,
          padding: 20
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '30%' }}>
            <div>
              <span className="my_portfolio_publish pe-xxl-0">
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
            <div>
              <span className="my_portfolio_publish pe-xxl-0 ">
                {/*<IntlMessages id="portfolio.Publish.My.Portfolio" />*/}
                Allow My Peers to View My Portfolio
                <label className="px-0 ps-sm-1 ps-md-1 form-switch">
                  <input
                    type="checkbox"
                    checked={togglePeerSharing}
                    onChange={() => {
                      updatePeerSharing()
                      // if (togglePeerSharing) {
                      //   updatePeerSharing()
                      // } else {
                      //   setShowPublishModal(true)
                      // }
                    }}
                  />
                  <i></i>
                </label>
              </span>
            </div>
          </div>
          {isOwnPortfolio && (
            <div className={'d-flex justify-content-end'}>
              <ShareMyPortfolioWidget user={user} toggle={toggle} />
            </div>
          )}

          {/* <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: 'column',
            }}
          >
            <img
              style={{
                objectFit: 'contain',
                width: 250,
                height: 55,
              }}
              src={verifyNovae}
            />
          </div> */}
        </div>
        {user && (
          <>
            <PersonalBio user={user} userId={userId} />
            <IAMR user={user} isPreview={false} userId={user?.id} />

            <Skills
              user={user}
              isPreview={false}
              approvedSkills={approvedSkills}
            />

            <div>
              <div
                style={{
                  font: 'normal normal 600 24px Montserrat',
                  letterSpacing: 0,
                  color: '#231F20',
                  marginLeft: 10
                }}
              >
                EXPERIENCE
              </div>
              <Experience
                user={user}
                isPreview={false}
                experiences={experiences}
              />
            </div>
            <div>
              <div
                style={{
                  font: 'normal normal 600 24px Montserrat',
                  letterSpacing: 0,
                  color: '#231F20',
                  marginLeft: 10
                }}
              >
                EDUCATION AND ACCOMPLISHMENTS
              </div>
              <Education
                user={user}
                isPreview={false}
                educations={educations}
              />
              <Accomplishment
                user={user}
                isPreview={false}
                accomplishments={accomplishments}
              />
            </div>
            <LicencesCertification
              user={user}
              isPreview={false}
              userCertifications={certifications}
            />
          </>
        )}
      </div>
      <DeleteConfirmation
        showModal={showPublishModal}
        onHide={() => setShowPublishModal(false)}
        confirmModal={() => true}
        checkIfAggre={() => {
          updateStatus()
          setIsLoading(true)
          setAggred(true)
          setTimeout(() => {
            setIsLoading(false)
            setShowPublishModal(false)
          }, 5000)
        }}
        loading={isLoading}
        setLoading={(data) => setIsLoading(data)}
        type={true}
        title={<IntlMessages id="portfolio.confirmation_modal" />}
        body={<IntlMessages id="portfolio.confirmation_modal_second_part" />}
      />
    </div>
  )
}
export default EditPortfolio
