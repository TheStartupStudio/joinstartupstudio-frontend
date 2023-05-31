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
import LicencesCertification from '../../components/Portfolio/LicensesCertification'
import { DeleteConfirmation } from '../../components/Portfolio/Confirm_modal'
import { toast } from 'react-toastify'
import './style/previewPortfolio.css'
import { IsUserLevelAuthorized } from '../../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons'
import novaeLogo from '../../assets/images/novae-logo-horz.png'
import verifyNovae from '../../assets/images/verify-novae.png'
import avatar from '../../assets/images/profile-image.png'
import EditBio from '../../components/Portfolio/PersonalBio/EditBio'
import EmptyEducationSection from './EmptyEducationSection'
import EmptyAccomplishmentSection from './EmptyAccomplishmentSection'
import EmptyCertificationSection from './EmptyCertificationSection'
import EmptyExperienceSection from './EmptyExperienceSection'

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
        justifyContent: 'center',
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
  const [user, setUser] = useState()
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [recommendationRequestId, setRecommendationRequestId] = useState()
  const [educations, setEducations] = useState([])
  const [accomplishments, setAccomplishments] = useState([])
  const [userCertifications, setUserCertifications] = useState([])
  const [experiences, setExperiences] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [skills, setSkills] = useState([])
  const [userBiography, setUserBiography] = useState(null)
  const [userData, setUserData] = useState(null)
  const [aggred, setAggred] = useState(false)
  const [loading, setLoading] = useState(false)
  const userId = useSelector((state) => state.user.user.user.id)

  const dispatch = useDispatch()

  const authorizedLevel = IsUserLevelAuthorized()
  const paramId = useParams().id

  useEffect(() => {
    window.location.href.includes('recommendation') &&
      setRecommendationRequestId(paramId)
  }, [paramId])

  useEffect(() => {
    getUser()
  }, [])

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
        })
      })
      .catch((err) => err)
  }

  const updateStatus = async () => {
    await axiosInstance
      .put(`/portfolio`, {
        is_published: !toggle,
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
  const getUserCertification = async () => {
    await axiosInstance.get(`/userCertificates/${userId}`).then((res) => {
      setTimeout(() => {
        setUserCertifications(res.data.UserCertificates)
      }, 2000)
    })
  }

  const getUserExperiences = async () => {
    await axiosInstance
      .get(`/userBackground/by-type/experience`)
      .then((res) => {
        setExperiences(res.data)
      })
  }

  const getUserBio = async () => {
    await axiosInstance
      .get(`/users/${userId}`)
      .then((response) => {
        setUserBiography(response.data.bio)
        setUserData(response.data)
      })
      .catch((err) => err)
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
        setSkills(response.data?.Skills)
      })
      .catch((err) => err)
  }

  useEffect(() => {
    getUserCertification()
    getUserAccomplishments()
    getUserEducations()
    getUserExperiences()
    getUserSkills()
    getSubmissions()
    getUserBio()
  }, [user])

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
          padding: 20,
        }}
      >
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
          <div
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
          </div>
        </div>
        <PersonalBio user={user} isPreview={false} />
        {user && (
          <>
            <IAMR user={user} isPreview={false} submissions={submissions} />
          </>
        )}

        <Skills user={user} skills={skills} />

        <div>
          <div
            style={{
              font: 'normal normal 600 24px Montserrat',
              letterSpacing: 0,
              color: '#231F20',
              marginLeft: 10,
            }}
          >
            EXPERIENCE
          </div>

          {experiences.length ? (
            <Experience user={user} experiences={experiences} />
          ) : (
            <EmptyExperienceSection />
          )}
        </div>
        <div>
          <div
            style={{
              font: 'normal normal 600 24px Montserrat',
              letterSpacing: 0,
              color: '#231F20',
              marginLeft: 10,
            }}
          >
            EDUCATION AND ACCOMPLISHMENTS
          </div>

          {educations.length ? (
            <Education user={user} educations={educations} />
          ) : (
            <EmptyEducationSection />
          )}

          {accomplishments.length ? (
            <Accomplishment user={user} accomplishments={accomplishments} />
          ) : (
            <EmptyAccomplishmentSection />
          )}
        </div>
        {userCertifications.length ? (
          <LicencesCertification
            user={user}
            certifications={userCertifications}
          />
        ) : (
          <EmptyCertificationSection />
        )}
      </div>
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
export default EditPortfolio
