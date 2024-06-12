import React, { useState } from 'react'
import PersonalBio from '../../components/Portfolio/PersonalBio/PersonalBio'
import { IAMR } from '../../components/Portfolio/IAMR'
import { Skills } from '../../components/Portfolio/Skills'
import { Experience } from '../../components/Portfolio/Experience'
import { Education } from '../../components/Portfolio/Education'
import { Accomplishment } from '../../components/Portfolio/Accomplishment'
import LicencesCertification from '../../components/Portfolio/LicensesCertification/index'
import useWindowWidth from '../../hooks/useWindowWidth'
const PreviewTypeButton = ({ onClick, selected, label, windowWidth }) => {
  const buttonStyle = {
    background: selected ? '#51C7DF' : '#fff',
    border: '1px solid #BBBDBF',
    borderRadius: 6,
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    font: `normal normal 600 ${
      windowWidth < 700 ? '15px/27px' : '22px/27px'
    } Montserrat`,
    letterSpacing: 0,
    color: '#231F20',
    textAlign: 'center',
    padding: windowWidth < 600 ? '5px 15px' : '20px 30px',
    textTransform: 'uppercase',
    cursor: 'pointer'
  }

  return (
    <div onClick={onClick} style={buttonStyle}>
      {label}
    </div>
  )
}
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
          userId={props.userId}
          isPeerOrPublicView={props.isPeerOrPublicView}
        />
      )}
      {!!user && (
        <>
          {user?.show_iamr && (
            <>
              <IAMR
                user={user}
                isPreview={isPreviewPortfolio}
                userId={user.id}
                isPeerOrPublicView={props.isPeerOrPublicView}
              />
            </>
          )}

          {approvedSkills?.length > 0 && (
            <Skills
              user={user}
              isPreview={isPreviewPortfolio}
              approvedSkills={approvedSkills}
              isPeerOrPublicView={props.isPeerOrPublicView}
            />
          )}

          {isPreviewPortfolio && (
            <div style={{ display: 'flex', gap: 20, width: '100%' }}>
              <PreviewTypeButton
                onClick={handleSelectExperience}
                selected={selected === 'experience'}
                label="Experience"
                windowWidth={windowWidth}
              />
              <PreviewTypeButton
                onClick={handleSelectEducation}
                selected={selected === 'education'}
                label="Education & Certifications"
                windowWidth={windowWidth}
              />
            </div>
          )}

          {selected === 'experience' && (
            <>
              {user?.show_experience && experiences?.length ? (
                <Experience
                  user={user}
                  isPreview={isPreviewPortfolio}
                  experiences={experiences}
                  isPeerOrPublicView={props.isPeerOrPublicView}
                />
              ) : (
                <></>
              )}

              {/*<Recommendation user={user} />*/}
            </>
          )}
          {selected === 'education' && (
            <>
              {user?.show_education && educations?.length ? (
                <Education
                  user={user}
                  isPreview={isPreviewPortfolio}
                  educations={educations}
                  isPeerOrPublicView={props.isPeerOrPublicView}
                />
              ) : (
                <></>
              )}

              {user?.show_accomplishments && accomplishments?.length ? (
                <Accomplishment
                  user={user}
                  isPreview={isPreviewPortfolio}
                  accomplishments={accomplishments}
                  isPeerOrPublicView={props.isPeerOrPublicView}
                />
              ) : (
                <></>
              )}

              {user?.show_certifications && userCertifications?.length ? (
                <LicencesCertification
                  user={user}
                  isPreview={isPreviewPortfolio}
                  userCertifications={userCertifications}
                  isPeerOrPublicView={props.isPeerOrPublicView}
                />
              ) : (
                <></>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

export default PreviewPortfolioBody
