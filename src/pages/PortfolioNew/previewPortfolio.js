import React, { useState, useEffect, useLayoutEffect } from 'react'
import PreviewPersonalBio from '../../components/Portfolio/preview/PreviewPersonalBio'
import PreviewSkill from '../../components/Portfolio/preview/PreviewSkill'
import IntlMessages from '../../utils/IntlMessages'
import { IsUserLevelAuthorized } from '../../utils/helpers'
import { Link, useHistory } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import './style/previewPortfolio.css'
import './style/editPortfolio.css'
import { toast } from 'react-toastify'
import Licenses_Certification_Preview from '../../components/Portfolio/LicensesCertification/Licenses_Certification_Preview'
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
import PersonalBio from '../../components/Portfolio/PersonalBio/PersonalBio'
import verifyNovae from '../../assets/images/verify-novae.png'
import { Skills } from '../../components/Portfolio/Skills'
import { Experience } from '../../components/Portfolio/Experience'
import { Recommendation } from '../../components/Portfolio/Recommendation'
import { Education } from '../../components/Portfolio/Education'
import { Accomplishment } from '../../components/Portfolio/Accomplishment'
import LicencesCertification from '../../components/Portfolio/LicensesCertification'
import PortfolioSection from './PortfolioSection'
import EmptyEducationSection from './EmptyEducationSection'
import EmptyAccomplishmentSection from './EmptyAccomplishmentSection'
import { useSelector } from 'react-redux'
import EmptyCertificationSection from './EmptyCertificationSection'
import useWindowWidth from '../../utils/hooks/useWindowWidth'

const PreviewPortfolio = () => {
  const [user, setUser] = useState()
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
  const userId = useSelector((state) => state.user.user.user.id)

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
    getUser()
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

  const updateStatus = async () => {
    await axiosInstance
      .put(`/users`, {
        is_published: !toggle,
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
    axiosInstance
      .get(`/submissions/user/${user?.id}`)
      .then((data) => setSubmissions(data.data?.submissions))
  }

  const getUserSkills = async () => {
    await axiosInstance
      .get('/users')
      .then((response) => {
        setSkills(response.data?.Skills)
      })
      .catch((err) => err)
  }
  const history = useHistory()
  const isPreview = history.location.pathname.includes('preview')
  const windowWidth = useWindowWidth()
  return (
    <div style={{ padding: '30px 10px', width: isPreview ? '100%' : '88%' }}>
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
                {!isPreview ? (
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
                      // setShowPublishModal(true)
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
        <PersonalBio
          user={user}
          isPreview={isPreview}
          userBiography={userBiography}
          userData={userData}
        />
        {user && (
          <>
            {user?.show_iamr && (
              <IAMR
                user={user}
                isPreview={isPreview}
                submissions={submissions}
              />
            )}
          </>
        )}

        <Skills user={user} skills={skills} />

        {isPreview && (
          <div style={{ display: 'flex', gap: 20, width: '100%' }}>
            <div
              onClick={handleSelectExperience}
              style={{
                background: `${
                  selected === 'experience' ? '#51C7DF' : '#fff'
                } 0% 0% no-repeat padding-box`,
                border: '1px solid #BBBDBF',
                borderRadius: 6,
                width: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  font: `normal normal 600 ${
                    windowWidth < 700 ? '15px/27px' : '22px/27px'
                  } Montserrat`,
                  letterSpacing: 0,
                  color: '#231F20',
                  textAlign: 'center',
                  padding: windowWidth < 600 ? '5px 15px' : '20px 30px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Experience
              </div>
            </div>
            <div
              onClick={handleSelectEducation}
              style={{
                background: `${
                  selected === 'education' ? '#51C7DF' : '#fff'
                } 0% 0% no-repeat padding-box`,
                border: '1px solid #BBBDBF',
                borderRadius: 6,
                width: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  font: `normal normal 600 ${
                    windowWidth < 700 ? '15px/27px' : '22px/27px'
                  } Montserrat`,
                  letterSpacing: 0,
                  color: '#231F20',
                  textAlign: 'center',
                  padding: windowWidth < 600 ? '5px 15px' : '20px 30px',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Education & Certifications
              </div>
            </div>
          </div>
        )}

        {selected === 'experience' && (
          <div>
            {user?.show_experience && (
              <>
                {experiences.length ? (
                  <Experience user={user} experiences={experiences} />
                ) : (
                  <EmptyCertificationSection />
                )}
              </>
            )}

            {/*<Recommendation user={user} />*/}
          </div>
        )}
        {selected === 'education' && (
          <div>
            {user?.show_education && (
              <>
                {educations.length ? (
                  <Education user={user} educations={educations} />
                ) : (
                  <EmptyEducationSection />
                )}
              </>
            )}

            {user?.show_accomplishments && (
              <>
                {accomplishments.length ? (
                  <Accomplishment
                    user={user}
                    accomplishments={accomplishments}
                  />
                ) : (
                  <EmptyAccomplishmentSection />
                )}
              </>
            )}

            {user?.show_certifications && (
              <>
                {userCertifications.length ? (
                  <LicencesCertification
                    user={user}
                    certifications={userCertifications}
                  />
                ) : (
                  <EmptyCertificationSection />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
    // <div id="main-body">
    //   <div className="container-fluid">
    //     <div className="row">
    //       <div className="col-12 col-xl-9 gx-0 gx-sm-auto page-border">
    //         <div className="page-padding">
    //           <div className="row">
    //             <h3 className="py-0 my-0 gy-0 ps-0 ms-0">
    //               <span className="my_portfolio_bar d-sm-inline py-0 my-0 gy-0">
    //                 MY PORTFOLIO |
    //               </span>
    //               <span className="text-uppercase title_preview_portfolio d-sm-inline">
    //                 <Link to={'/edit-portfolio'}> Edit</Link>
    //               </span>
    //               <span className="py-0 my-0 my_portfolio_edit d-block">
    //                 Share your empowerment, wellness, and performance with the
    //                 global community
    //               </span>
    //             </h3>
    //             <PersonalBio isPreview={true} />
    //             {/*<PreviewPersonalBio />*/}
    //             {user && (
    //               /*user.show_iamr &&*/ <IAMR
    //                 user={user}
    //                 preview="1"
    //                 className="px-0"
    //               />
    //             )}
    //             <PreviewSkill skills={user?.Skills && user?.Skills} />
    //
    //             <div className="mt-5 row text-center w-100 pe-0 me-0 gx-0">
    //               <div
    //                 className={`col-6 text-center px-0 py-2 gx-0 mx-0 ${
    //                   selected != 'EXPERIENCE'
    //                     ? 'video_podcast_0'
    //                     : 'video_podcast_1'
    //                 }`}
    //                 onClick={() => setSelected('EXPERIENCE')}
    //               >
    //                 <span role="button">EXPERIENCE</span>
    //               </div>
    //               <div
    //                 className={`col-6 text-center px-0 py-2 gx-0 mx-0 ${
    //                   selected != 'EDUCATION & CERTIFICATIONS'
    //                     ? 'video_podcast_0'
    //                     : 'video_podcast_1'
    //                 }`}
    //                 onClick={() => setSelected('EDUCATION & CERTIFICATIONS')}
    //               >
    //                 <span role="button" className="d-none d-md-block">
    //                   EDUCATION & CERTIFICATIONS
    //                 </span>
    //                 <span role="button" className="d-md-none">
    //                   EDUCATION
    //                 </span>
    //               </div>
    //               {selected === 'EXPERIENCE' ? (
    //                 <>
    //                   {experiences.length !== 0 && (
    //                     <div className="w-100 mx-auto px-1 px-md-0 mx-md-0 text-start mt-3 preview-container">
    //                       <h4>EXPERIENCE</h4>
    //                       {experiences.map((experience, index, { length }) => {
    //                         return (
    //                           <ExperienceDetails
    //                             experience={experience}
    //                             key={experience.id}
    //                             index={index}
    //                             length={length}
    //                             // setCurrentExperience={(experience) =>
    //                             //   setCurrentExperience(experience)
    //                             // }
    //                             editing={false}
    //                           />
    //                         )
    //                       })}
    //                     </div>
    //                   )}
    //                   {authorizedLevel && recommendations.length !== 0 && (
    //                     <div className="w-100 mx-auto px-1 px-md-0 mx-md-0 text-start mt-3 preview-container">
    //                       <h4>RECOMMENDATIONS</h4>
    //
    //                       {recommendations.map(
    //                         (recommendation, index, { length }) => {
    //                           return (
    //                             <RecommendationDetails
    //                               recommendation={recommendation}
    //                               key={recommendation.id}
    //                               index={index}
    //                               length={length}
    //                             />
    //                           )
    //                         }
    //                       )}
    //                     </div>
    //                   )}
    //                 </>
    //               ) : (
    //                 <>
    //                   <div className="w-100 mx-auto px-1 px-md-0 mx-md-0 mt-3 text-start preview-container">
    //                     {educations.length !== 0 && (
    //                       <>
    //                         <h4>EDUCATION</h4>
    //
    //                         {educations.map((education, index, { length }) => {
    //                           return (
    //                             <EducationDetails
    //                               education={education}
    //                               key={education.id}
    //                               index={index}
    //                               length={length}
    //                               // setCurrentExperience={(experience) =>
    //                               //   setCurrentExperience(experience)
    //                               // }
    //                               editing={false}
    //                             />
    //                           )
    //                         })}
    //                       </>
    //                     )}
    //                     {accomplishments.length !== 0 && (
    //                       <>
    //                         <h4 className="mt-3">ACCOMPLISHMENTS</h4>
    //                         <div className="experience-details">
    //                           {accomplishments.map(
    //                             (accomp, index, { length }) => {
    //                               return (
    //                                 <AccomplishmentDetails
    //                                   accomp={accomp}
    //                                   key={accomp.id}
    //                                   index={index}
    //                                   length={length}
    //                                   // setCurrentExperience={(experience) =>
    //                                   //   setCurrentExperience(experience)
    //                                   // }
    //                                   editing={false}
    //                                 />
    //                               )
    //                             }
    //                           )}
    //                         </div>
    //                       </>
    //                     )}
    //                   </div>
    //                   {user?.show_certifications ? (
    //                     <Licenses_Certification_Preview from_page={'preview'} />
    //                   ) : (
    //                     <span>
    //                       Please turn on Licenses & Certifications to preview
    //                       them.
    //                     </span>
    //                   )}
    //                 </>
    //               )}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //       <div
    //         className="col-12 pb-5 py-lg-0 col-xl-3"
    //         style={{
    //           marginTop: '40px',
    //         }}
    //       >
    //         <div className="col-12 px-3 px-xl-0 d-flex flex-wrap d-flex justify-content-start">
    //           <h3 className="publishMyPortfolio d-flex ">
    //             Publish my portfolio
    //             <label className="px-0 ps-sm-1 ms-3 ps-md-1 form-switch  ">
    //               <input
    //                 type="checkbox"
    //                 checked={toggle}
    //                 onChange={() => {
    //                   updateStatus()
    //                 }}
    //               />
    //               <i></i>
    //             </label>
    //           </h3>
    //           <div
    //             style={{
    //               flexBasis: '100%',
    //               height: 0,
    //             }}
    //           ></div>
    //           <p className=" pe-xxl-5 break d-flex previewSpanPublish">
    //             Publish your portfolio to share your story with the global
    //             community.
    //           </p>
    //         </div>
    //         <div className="d-flex px-3 px-xl-0 justify-content-start">
    //           <ShareMyPortfolioWidget user={user && user} />
    //         </div>
    //
    //         <div className="px-3 px-xl-0">
    //           <ConnectionRequestsBox />
    //           <ShowMessenger />
    //           <div
    //             className={`community-connect px-3 ${
    //               !IsUserLevelAuthorized() && 'notAllowed'
    //             } my-2`}
    //           >
    //             <Link to="/my-connections">
    //               <FontAwesomeIcon
    //                 icon={faUsers}
    //                 style={{
    //                   color: '#01C5D1',
    //                   background: 'white',
    //                   borderRadius: '50%',
    //                   height: '25px',
    //                   width: '36px',
    //                   opacity: '1',
    //                 }}
    //               />
    //             </Link>
    //             <Link to="/my-connections">
    //               <p className="my-auto ms-2">Connect with my community</p>
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
export default PreviewPortfolio
