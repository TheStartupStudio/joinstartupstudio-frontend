import React, { useState } from 'react'
import PersonalBio from '../../components/Portfolio/PersonalBio/PersonalBio'
import { IAMR } from '../../components/Portfolio/IAMR'
import { Skills } from '../../components/Portfolio/Skills'
import { Experience } from '../../components/Portfolio/Experience'
import { Education } from '../../components/Portfolio/Education'
import { Accomplishment } from '../../components/Portfolio/Accomplishment'
import LicencesCertification from '../../components/Portfolio/LicensesCertification/index'
import useWindowWidth from '../../utils/hooks/useWindowWidth'

function PreviewPortfolioBody(props) {
  const [selected, setSelected] = useState('experience')
  const handleSelectExperience = () => {
    setSelected('experience')
  }

  const handleSelectEducation = () => {
    setSelected('education')
  }
  const windowWidth = useWindowWidth()
  const {
    user,
    isPreviewPortfolio,
    userData,
    userBiography,
    location,
    isOwnPortfolio,
    userId,
    approvedSkills,
    experiences,
    educations,
    accomplishments,
    userCertifications
  } = props
  return (
    <>
      {!!user && (
        <PersonalBio
          user={user}
          isPreview={isPreviewPortfolio}
          userBiography={userBiography}
          userData={userData}
          userId={location?.state?.isPeerView ? user.id : userId}
        />
      )}
      {!!user ? (
        (!!user && user?.UserPortfolio?.is_published) || isOwnPortfolio ? (
          <>
            {user?.show_iamr && (
              <IAMR user={user} isPreview={isPreviewPortfolio} />
            )}

            {approvedSkills?.length > 0 && (
              <Skills
                user={user}
                isPreview={isPreviewPortfolio}
                approvedSkills={approvedSkills}
              />
            )}

            {isPreviewPortfolio && (
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
                    justifyContent: 'center'
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
                      justifyContent: 'center'
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
                    justifyContent: 'center'
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
                      justifyContent: 'center'
                    }}
                  >
                    Education & Certifications
                  </div>
                </div>
              </div>
            )}

            {selected === 'experience' && (
              <div>
                {user?.show_experience && experiences?.length ? (
                  <Experience user={user} isPreview={isPreviewPortfolio} />
                ) : (
                  <></>
                )}

                {/*<Recommendation user={user} />*/}
              </div>
            )}
            {selected === 'education' && (
              <div>
                {user?.show_education && educations?.length ? (
                  <Education user={user} isPreview={isPreviewPortfolio} />
                ) : (
                  <></>
                )}

                {user?.show_accomplishments && accomplishments?.length ? (
                  <Accomplishment user={user} isPreview={isPreviewPortfolio} />
                ) : (
                  <></>
                )}

                {user?.show_certifications && userCertifications?.length ? (
                  <LicencesCertification
                    user={user}
                    isPreview={isPreviewPortfolio}
                  />
                ) : (
                  <></>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="mx-auto w-100 my-auto text-center my-5">
            <p className="py-5">This portfolio is private</p>
          </div>
        )
      ) : (
        <></>
      )}
    </>
  )
}

export default PreviewPortfolioBody
