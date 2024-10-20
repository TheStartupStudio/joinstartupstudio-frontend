import PortfolioSubmission from '../../Components/PortfolioSubmission'
import React, { useState } from 'react'
import PortfolioModalWrapper from '../../Components/Modals/PortfolioModalWrapper'
import LtsButton from '../../../../components/LTSButtons/LTSButton'
import SectionActions from '../../Components/Actions/SectionActions'

const ProjectSection = ({
  title,
  subtitle,
  content,
  evidences,
  data,
  type
}) => {
  const [showSkillsModal, setShowSkillsModal] = useState(undefined)

  const actions = [
    {
      type: 'close',
      action: () => {
        setShowSkillsModal(undefined)
      },
      isDisplayed: true
    }
  ]

  return (
    <div
      className={'portf-learn-cont portfolio-info-container mb-3'}
      style={{ padding: '40px' }}
    >
      <div className={' mb-3'} style={{ textAlign: 'center' }}>
        <span
          className={'portf-maintitle portfolio-info-title me-1'}
          // style={{ fontSize: '16px' }}
        >
          {title}
        </span>
        <span
          style={{
            font: 'normal normal normal 15px/18px Montserrat',
            letterSpacing: 0.68
          }}
        >
          {/* {subtitle} */}
        </span>
      </div>
      <div className={'mb-3'}>
        <div
          className={'portfolio-info-title mb-3'}
          style={{ fontWeight: '500' }}
        >
          {content.title}
        </div>
        <div
          className={'project-content portfolio-info-content'}
          dangerouslySetInnerHTML={{ __html: content.text }}
        />
      </div>
      <div>
        <div className={'d-flex justify-content-between align-items-center'}>
          <div
            className={'portfolio-info-title'}
            style={{ marginBottom: '10px', fontWeight: '500' }}
          >
            Evidence
          </div>
          <LtsButton
            variant={'text'}
            color={'#52C7DE'}
            align={'end'}
            name={'View market-ready skills'}
            padding={{ padding: '0px' }}
            onClick={() => setShowSkillsModal(type)}
            style={{ marginBottom: '10px' }}
          ></LtsButton>
        </div>

        <div className={'row'}>
          {evidences?.map((evidence, index) => {
            return (
              <React.Fragment key={evidence?.title}>
                <div className={'project-submission col-md-4'} key={index}>
                  <PortfolioSubmission
                    title={evidence?.title}
                    videoUrl={evidence?.linkInputValue}
                    thumbnailUrl={evidence?.imageUrl}
                    className='project-submission-image'
                  />
                </div>
              </React.Fragment>
            )
          })}
        </div>
        {showSkillsModal === type && (
          <PortfolioModalWrapper
            title={`MARKET-READY ${title} SKILLS`}
            show={showSkillsModal === type}
            onHide={() => setShowSkillsModal(undefined)}
          >
            {evidences?.map((evidence, index) => {
              const skillsByCategory = {}

              evidence?.selectedSkills?.forEach((skill) => {
                const category = skill?.IamrSkill?.category

                if (!skillsByCategory[category]) {
                  skillsByCategory[category] = []
                }

                skillsByCategory[category].push(skill)
              })

              return (
                evidence?.selectedSkills?.length > 0 && (
                  <div className={'skill-group-by-section'} key={index}>
                    <div className={'skill-group-title py-2'}>
                      {evidence.title}
                    </div>

                    {Object.keys(skillsByCategory)?.length > 0 &&
                      Object.keys(skillsByCategory)?.map((category, idx) => (
                        <div className={'skill-groups'} key={idx}>
                          <div className={'skill-group-title py-2'}>
                            {category}
                          </div>
                          <div className={'display-skill-box p-3 mb-3'}>
                            {skillsByCategory[category].map(
                              (skill, skillIdx) => (
                                <div
                                  className={'skill-title py-2'}
                                  key={skillIdx}
                                >
                                  <span className={'skill-type me-1'}>
                                    {skill?.IamrSkill?.title}
                                  </span>
                                  <span className={'skill-description'}>
                                    {skill?.IamrSkill?.description}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )
              )
            })}

            <SectionActions actions={actions} />
          </PortfolioModalWrapper>
        )}
      </div>
    </div>
  )
}
export default ProjectSection
