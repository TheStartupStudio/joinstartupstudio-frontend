import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import checkmark from '../../assets/images/checkmark.svg'
import SpotlightSimpleModal from '../../components/Modals/Spotlight/SpotlightSimpleModal'

const SpotlightGridItem = ({ buttonTitle, content, onOpen }) => {
  return (
    <div className='spotlight-main-btns '>
      <div
        className='spotlight-btn-cont p-3 px-5 border d-flex flex-column align-items-center justify-content-center'
        style={{ backgroundColor: '#fff', minHeight: 210 }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <div className='spotlight-btn-title text-center'>{buttonTitle}</div>
        </div>
        <div style={{ position: 'relative', width: '100%' }}>
          <div
            className='spotlight-btn-desc'
            style={{
              font: 'normal normal normal 15px/17px Montserrat',
              letterSpacing: 0.52,
              color: '#333D3D',
              textAlign: 'left',
              width: '80%',
              position: 'absolute',
              left: '30px',
              top: '-30px',
              fontWeight: '200'
            }}
          >
            {content}
          </div>
        </div>
        <div
          style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
        >
          <button
            className='spotlight-learn-more-btn'
            onClick={() => {
              onOpen()
            }}
          >
            LEARN MORE
          </button>
        </div>
      </div>
    </div>
  )
}

const SpotlightInfoSection = () => {
  const [spotlightSimpleModal, setSpotlightSimpleModal] = useState({
    type: '',
    show: null
  })

  const openSimpleSpotlightModal = (type) => {
    let newSpotlightSimpleModal = { ...spotlightSimpleModal }
    newSpotlightSimpleModal.type = type
    newSpotlightSimpleModal.show = true
    setSpotlightSimpleModal(newSpotlightSimpleModal)
  }
  const closeSimpleSpotlightModal = (type) => {
    let newSpotlightSimpleModal = { ...spotlightSimpleModal }
    newSpotlightSimpleModal.type = type
    newSpotlightSimpleModal.show = false
    setSpotlightSimpleModal(newSpotlightSimpleModal)
  }

  return (
    <>
      <Container fluid className={' m-0 g-0 '}>
        <div className='spotlight-btns-row row g-2'>
          <SpotlightGridItem
            content={
              'Learn about the Spotlight competition and determine if you would like to enter.'
            }
            buttonTitle={'What is Spotlight '}
            type={'whatIsSpotlight'}
            onOpen={() => openSimpleSpotlightModal('whatIsSpotlight')}
          />
          <SpotlightGridItem
            content={
              'Learn how to qualify to apply for the Spotlight competition.'
            }
            buttonTitle={'Rules of Spotlight'}
            type={'rulesOfSpotlight'}
            onOpen={() => openSimpleSpotlightModal('rulesOfSpotlight')}
          />
          <SpotlightGridItem
            content={'Learn how to apply for the Spotlight competition.'}
            buttonTitle={'Application Process'}
            type={'applicationProcess'}
            onOpen={() => openSimpleSpotlightModal('applicationProcess')}
          />
          <SpotlightGridItem
            content={'Learn about the Spotlight pitches are evaluated.'}
            buttonTitle={'Pitch Evaluation '}
            type={'pitchEvaluation'}
            onOpen={() => openSimpleSpotlightModal('pitchEvaluation')}
          />
        </div>
      </Container>
      {spotlightSimpleModal.type === 'whatIsSpotlight' && (
        <SpotlightSimpleModal
          show={
            spotlightSimpleModal.type === 'whatIsSpotlight' &&
            spotlightSimpleModal.show
          }
          onHide={() => closeSimpleSpotlightModal('whatIsSpotlight')}
          content={`                   
                  <p>Spotlight is a virtual pitch competition open to all Learn to Start students through their platform. It introduces the individuals and teams to our community of global leaders and industry experts and provides key resources to help launch their ideas and ventures. It also gives our participants the unique opportunity to use the art of effective communication and pitch themselves and their ideas in the world. Winners of the Spotlight competition earn dedicated monthly mentorship from our group of global leaders and industry experts and enter into a virtual incubator process to take their initiatives to market.</p>
                  <p>Spotlight accepts all types of venture proposals whether they be community-based organizations or startups, not-for-profit or for-profit.</p>
                  <p>Spotlight has been created to give all of our Learn to Start participants the opportunity to experience a powerful platform where feedback from our experts drives valuable learning outcomes. For those individuals and teams who display well-crafted models with real potential in the markets. Spotlight is an opportunity to access our powerful virtual incubator.</p>
                  <p>This incubator is unlike the traditional accelerator models currently offered in the market today. We focus on all aspects of the Learn to Start model based on the real meaning of entrepreneurship so as to ensure these startups can reach the critical next level in their journey. This is where selected participants or teams can gain monthly access to our entire community of industry partners to provide critical expertise and mentorship as they push to market.</p>
                  `}
          title={'What is spotlight'}
        />
      )}{' '}
      {spotlightSimpleModal.type === 'rulesOfSpotlight' && (
        <SpotlightSimpleModal
          show={
            spotlightSimpleModal.type === 'rulesOfSpotlight' &&
            spotlightSimpleModal.show
          }
          onHide={() => closeSimpleSpotlightModal('rulesOfSpotlight')}
          content={`<ul style=' display: flex;
                                flex-direction: column;
                                gap: 10px;'>
              <li>
                To pitch in a Spotlight event, you must be at least 16 years old
                and a registered user inside of the Learn to Start platform with
                at least one year of experience on the platform.
              </li>
       
              <li>
                Participants will have 12 minutes to present their pitch deck,
                with additional minutes allocated to Q&A from the expert panel.
              </li>
              <li>
                Ventures submitted for Spotlight are not kept confidential, so
                teams should not include detailed descriptions of intellectual
                property in their submission. Participants retain ownership over
                their ventures, concepts, and work.
              </li>
              <li>
                All participants are expected to compete with integrity and
                shall not knowingly deceive panels or members of the advisory
                committee. All presented materials shall be offered as an
                accurate representation of knowledge and expectations and shall
                not contain false or misleading statements. Participants who
                violate this expectation of integrity are subject to
                disqualification and revocation of their Learn to Start platform
                membership.
              </li>
              <li>
                Spotlight participants authorize Learn to Start and its
                affiliates to use a summary of the content of their submission
                and any video and image submissions for publicity purposes
                related to Spotlight.
              </li>
              <li>
                The organizers of Spotlight reserve the right to disqualify any
                entry that, in their judgment, violates the spirit of the event
                guidelines.
              </li>
            </ul>`}
          title={'Rules of Spotlight'}
        />
      )}{' '}
      {spotlightSimpleModal.type === 'applicationProcess' && (
        <SpotlightSimpleModal
          show={
            spotlightSimpleModal.type === 'applicationProcess' &&
            spotlightSimpleModal.show
          }
          onHide={() => closeSimpleSpotlightModal('applicationProcess')}
          content={`<ul style=' display: flex;
                                flex-direction: column;
                                gap: 10px;'>
                      <li>All participants planning to pitch should work directly with their instructors, mentors, and network so as to help them review their business models, financial models, presentation strategies, and pitch decks.</li>
                      <li>Once students are ready, they send their submission inside their Learn to Start platform on the Spotlight page. Once their submission qualifies, they will get scheduled for a virtual pitch in one of our upcoming Spotlight events.</li>
                      <li>If their application does not qualify, they can submit in the next year’s application process.</li>
                      <li>The application includes the following:
                       <ul style=' display: flex;
                                   flex-direction: column;
                                   gap: 10px;
                                   margin-top: 10px'>
                          <li>Identify who is pitching</li>
                          <li>Identify the name of the product or service</li>
                          <li>Describe the product or service</li>
                          <li>Identify the type of mentorship you are applying for</li>
                          <li>Upload your pitch deck</li>
                          <li>Upload your business plan</li>
                        </ul>
                      </li>
                    </ul>
                  `}
          title={'Application Process'}
        />
      )}
      {spotlightSimpleModal.type === 'pitchEvaluation' && (
        <SpotlightSimpleModal
          classes={'pitch-evaluation-wrapper'}
          show={
            spotlightSimpleModal.type === 'pitchEvaluation' &&
            spotlightSimpleModal.show
          }
          onHide={() => closeSimpleSpotlightModal('pitchEvaluation')}
          content={`        <div class='pitch-container'>
                <div class='pitch-product-chart pitch-chart'>
                  <div class='pitch-product-title pitch-chart-title'>
                    Proposed Product / Service & Market Opportunity
                  </div>
                  <div class='pitch-lower-cont'>
                    <div class='pitch-chart-percentage'>25%</div>
                    <div class='pitch-chart-question-cont'>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Is the value proposition sound?
                        </p>
                      </div>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Is the product/service original, innovative, and
                          thoughtful?
                        </p>
                      </div>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Is the value proposition artiulated clearly?
                        </p>
                      </div>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Do they clearly identify their target market(s)?
                        </p>
                      </div>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Are their target markets large enough to support the
                          growth of this venture?
                        </p>
                      </div>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Do they have a competitive advantage over existing
                          solutions?
                        </p>
                      </div>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Do they have intellectual property?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class='pitch-finance-chart pitch-chart'>
                  <div class='pitch-finance-title pitch-chart-title'>
                    Financial/Revenue Model & Financial Projects
                  </div>
                  <div class='pitch-lower-cont'>
                    <div class='pitch-chart-percentage'>25%</div>
                    <div class='pitch-chart-question-cont'>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Is the revenue model logical and comprehensive?
                        </p>
                      </div>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Are the financial projects comprehensive and
                          realistic?
                        </p>
                      </div>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Do the financial projections reflect and understanding
                          of the economics and potential growth opportunities
                          and/or downside risks for the business?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class='pitch-impact-chart pitch-chart'>
                  <div class='pitch-impact-title pitch-chart-title'>
                    Impact
                  </div>
                  <div class='pitch-lower-cont'>
                    <div class='pitch-chart-percentage'>25%</div>
                    <div class='pitch-chart-question-cont'>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Does this venture have the ability to make a large
                          impact on society?
                        </p>
                      </div>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Will this venture help create jobs and promote
                          regional economic development?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class='pitch-plan-chart pitch-chart'>
                  <div class='pitch-plan-title pitch-chart-title'>
                    Team & Execution Plan
                  </div>
                  <div class='pitch-lower-cont'>
                    <div class='pitch-chart-percentage'>25%</div>
                    <div class='pitch-chart-question-cont'>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Is the business operationally feasible?
                        </p>
                      </div>
                       <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                         Do they outline measurable and achievable milestones?
                        </p>
                     
                      </div>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Do the founding team members have the expertise to
                          launch and/or grow the business? Do they have plans to
                          address gaps in their expertise/experience?
                        </p>
                      </div>
                      <div class='pitch-chart-question'>
                        <img
                          class='pitch-chart-check'
                          src=${checkmark}
                        ></img>
                        <p class='pitch-chart-quest-text'>
                          Do they properly address risks and provide contingency
                          plans?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                  `}
          title={'Pitch Evaluation'}
        />
      )}{' '}
    </>
  )
}

export default SpotlightInfoSection
