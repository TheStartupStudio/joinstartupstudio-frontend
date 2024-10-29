import React, { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import axiosInstance from '../../utils/AxiosInstance'
import { changeSidebarState } from '../../redux'
import SpotlightImg from '../../assets/images/spotlight-thumbnail.png'
import ApplyForPitch from '../StartupProfile/components/Modals/ApplyForPitch'
import Countdown from 'react-countdown'
import StartupMailer from '../../components/StartupLiveMailer'
import SpotlightSimpleModal from '../../components/Modals/Spotlight/SpotlightSimpleModal'
import SpotlightApplyModal from '../../components/Modals/Spotlight/SpotlightApplyModal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import Video from '../../components/Video'
import '../../assets/css/media.css'
import './index.css'
import spotlightBulb from '../../assets/images/Immersion/SpotlightBulbImg2.png'
import checkmark from '../../assets/images/checkmark.svg'
import { setBackButton } from '../../redux/backButtonReducer'
import SpotlightModal from '../MyImmersion/Modals/SpotlightModal'

function StartupLive() {
  const firstEventTime = new Date('2023-01-30T16:30:00').getTime()
  const [startupLiveVideos, setStartupLiveVideos] = useState([])
  const userLevel = useSelector((state) => state.user.user.user.level)
  const dispatch = useDispatch()
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [PitchApplyModal, setPitchApplyModal] = useState(false)
  const [width, setWidth] = useState(window.innerWidth)
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(4)
  const actualpage = window.location.href.includes('encouragement')
    ? 'encouragement'
    : window.location.href.includes('master-classes')
    ? 'master-classes'
    : 'startup-live'
  const [connections, setConnections] = useState([])
  const resize = () => {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    dispatch(setBackButton(true, 'my-immersion'))

    return () => {
      dispatch(setBackButton(false, ''))
    }
  }, [dispatch])

  useEffect(() => {
    setWidth(window.innerWidth)

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    // getStartupLiveVideos()
    setTimeout(() => {
      setShowSpotlight(true)
    }, 3000)
  }, [])

  useEffect(() => {
    dispatch(changeSidebarState(false))
  })

  const [spotlightSimpleModal, setSpotlightSimpleModal] = useState({
    type: '',
    show: null
  })
  const [spotlightApplyModal, setSpotlightApplyModal] = useState(false)

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

  const openSpotlightApplyModal = () => {
    setSpotlightApplyModal(true)
  }
  const closeSpotlightApplyModal = () => {
    setSpotlightApplyModal(false)
  }

  const SpotlightApplyBtn = (props) => {
    return (
      <div className='apply-btn-wrapper'>
        <button
          className='apply-btn'
          onClick={() => {
            props.onOpen()
          }}
          // type={'applyNow'}
          // onOpen={() => openSpotlightApplyModal()}
        >
          Apply for the Spotlight Competition
        </button>
      </div>
    )
  }

  const SpotlightGridItem = (props) => {
    return (
      // <div className='col-lg-6 col-md-12 '>
      <div className='spotlight-main-btns '>
        <div
          className='spotlight-btn-cont p-3 px-5 border d-flex flex-column align-items-center justify-content-center'
          style={{ backgroundColor: '#fff', minHeight: 210 }}
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              className='spotlight-btn-title text-center'
              //  style={{ marginTop: '-40px' }}
            >
              {/* <button
              style={{
                // backgroundColor: '#51c7df',
                background: 'transparent',
                color: '#000',
                fontWeight: '500',
                fontSize: 14,
                // border: '1px solid #51C7DF',
                // marginLeft: 'auto',
                // marginRight: 'auto',
                // marginBottom: '30px',
                cursor: 'pointer',
                width: '100%',
                letterSpacing: '.3px'
              }}
              // onClick={() => {
              //   props.onOpen()
              // }}
              className='px-5 py-2 border-0 color transform  my-1'
            > */}
              {props.buttonTitle}
              {/* </button> */}
            </div>
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
                // display: 'flex',
                // flexDirection: 'column',
                // justifyContent: 'center'
                // alignItems: 'center'
                // marginTop: 20
              }}
            >
              {props.content}
            </div>
          </div>
          <div
            style={{ display: 'flex', width: '100%', justifyContent: 'center' }}
          >
            <button
              className='spotlight-learn-more-btn'
              onClick={() => {
                props.onOpen()
              }}
            >
              LEARN MORE
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Container fluid>
      <Row>
        <div className='spotlight-column col-12  pe-0'>
          <div
            className='spotlight-container spotlight-page-wrapper account-page-padding page-border '
            style={{ minHeight: '100vh' }}
          >
            <div className='spotlight-header'>
              <h3 className='page-title'>SPOTLIGHT®</h3>
              <p className='page-description'>
                Pitch your industry solution to the Industry Partners of Learn
                to Start.
              </p>
            </div>
            <div className='spotlight-wrapper'>
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
                    content={
                      'Learn how to apply for the Spotlight competition.'
                    }
                    buttonTitle={'Application Process'}
                    type={'applicationProcess'}
                    onOpen={() =>
                      openSimpleSpotlightModal('applicationProcess')
                    }
                  />
                  <SpotlightGridItem
                    content={'Learn about the Spotlight pitches are evaluated.'}
                    buttonTitle={'Pitch Evaluation '}
                    type={'pitchEvaluation'}
                    onOpen={() => openSimpleSpotlightModal('pitchEvaluation')}
                  />
                </div>
              </Container>
              {/* <div className='pitch-container'>
                <div className='pitch-product-chart pitch-chart'>
                  <div className='pitch-product-title pitch-chart-title'>
                    Proposed Product / Service & Market Opportunity
                  </div>
                  <div className='pitch-lower-cont'>
                    <div className='pitch-chart-percentage'>25%</div>
                    <div className='pitch-chart-question-cont'>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Is the value proposition sound?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Is the product/service original, innovative, and
                          thoughtful?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Is the value proposition artiulated clearly?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Do they clearly identify their target market(s)?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Are their target markets large enough to support the
                          growth of this venture?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Do they have a competitive advantage over existing
                          solutions?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Do they have intellectual property?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='pitch-finance-chart pitch-chart'>
                  <div className='pitch-finance-title pitch-chart-title'>
                    Financial/Revenue Model & Financial Projects
                  </div>{' '}
                  <div className='pitch-lower-cont'>
                    <div className='pitch-chart-percentage'>25%</div>
                    <div className='pitch-chart-question-cont'>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Is the revenue model logical and comprehensive?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Are the financial projects comprehensive and
                          realistic?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Do the financial projections reflect and understanding
                          of the economics and potential growth opportunities
                          and/or downside risks for the business?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='pitch-impact-chart pitch-chart'>
                  <div className='pitch-impact-title pitch-chart-title'>
                    Impact
                  </div>{' '}
                  <div className='pitch-lower-cont'>
                    <div className='pitch-chart-percentage'>25%</div>
                    <div className='pitch-chart-question-cont'>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Does this venture have the ability to make a large
                          impact on society?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Will this venture help create jobs and promote
                          regional economic development?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='pitch-plan-chart pitch-chart'>
                  <div className='pitch-plan-title pitch-chart-title'>
                    Team & Execution Plan
                  </div>{' '}
                  <div className='pitch-lower-cont'>
                    <div className='pitch-chart-percentage'>25%</div>
                    <div className='pitch-chart-question-cont'>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Is the business operationally feasible?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Do they outline measurable and achievable milestones?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Do the founding team members have the expertise to
                          launch and/or grow the business? Do they have plans to
                          address gaps in their expertise/experience?
                        </p>
                      </div>
                      <div className='pitch-chart-question'>
                        <img
                          className='pitch-chart-check'
                          src={checkmark}
                        ></img>
                        <p className='pitch-chart-quest-text'>
                          Do they properly address risks and provide contingency
                          plans?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <Row>
                <div className='comp-apply-container'>
                  <div className='apply-title'>
                    <img
                      src={spotlightBulb}
                      width={'100%'}
                      height={'55px'}
                    ></img>
                    {/* <p
                      style={{
                        fontSize: '30px',
                        marginTop: '15px',
                        marginLeft: '8px'
                      }}
                    >
                      SPOTLIGHT®
                    </p> */}
                  </div>
                  <SpotlightApplyBtn
                    type={'applyNow'}
                    onOpen={() => openSpotlightApplyModal()}
                  ></SpotlightApplyBtn>
                  {/* <div className='apply-btn-wrapper'>
                    <button className='apply-btn'>
                      Apply for the Spotlight Competition
                    </button>
                  </div> */}
                </div>
              </Row>
              <Row className='spot-archive-wrapper'>
                <Row>
                  <div>
                    <div className='d-flex justify-content-between guidance-videos-top  guidance-encouragement-page-titles '>
                      <h3 className='spot-archive-title'>Spotlight Archive</h3>
                      <button
                        className={
                          'spotlight-archive-view-btn d-flex align-items-end  '
                        }
                        style={{ color: '#766C6EFD' }}
                      >
                        View all
                      </button>
                    </div>
                  </div>
                </Row>
                <div className='beyond-videos-desktop mt-2 d-flex align-items-center justify-content-center '>
                  {/* <div className='arrow-icon-1' style={{ height: '100%' }}>
                    <button
                      className='videos-track'
                      onClick={() => {
                        // handlePreviousVideo(1, startIndex, endIndex)
                      }}
                      style={{ width: '4%' }}
                    >
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className='videos-track-icon'
                        style={{ marginRight: '20px' }}
                      />
                    </button>
                  </div> */}
                  <p className='archive-placeholder-title'>
                    Stay tuned for the 2025 Spotlight Pitches
                  </p>
                  {/* <div
                    className='card-group desktop-menu card-group-beyond-your-course'
                    // style={{ marginTop: '15px' }}
                    style={{ width: '94%', marginLeft: '15px' }}
                  >
                    <div
                      className='card-group desktop-menu startuplive-archive-videos card-group-beyond-your-course w-100 justify-content-start  flex-sm-row'
                      style={{ flexWrap: 'wrap' }}
                    >
                      {[0, 0].map((item, index) => (
                        <div
                          className='card-group all-videos-beyond-your-course-videos col-12 col-sm-5 col-md-4 me-4'
                          key={index}
                          style={{ width: '170px' }}
                        >
                          <div
                            className='card mobile-card'
                            // style={{ paddingRight: '20px' }}
                          >
                            <Link to={'#'}>
                              <div className='beyond-your-course-video-thumb beyound-all-videos-thumb spotlight'>
                                <div
                                  style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '10px'
                                  }}
                                ></div>
                                <div>
                                  <img
                                    src={SpotlightImg}
                                    width='100%'
                                    alt='spotlight'
                                    style={{
                                      height: '115px',
                                      objectFit: 'contain'
                                    }}
                                  />
                                  <div className='beyond-your-course-video-thumb-icon'></div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div> */}
                  {/* <div
                    className='arrow-icon-1 justify-content-start'
                    style={{ height: '100%' }}
                  >
                    <button
                      className='videos-track'
                      style={{ width: '4%' }}
                      // onClick={() => handleNextVideo(1, startIndex, endIndex)}
                    >
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className='videos-track-icon'
                      />
                    </button>
                  </div> */}
                </div>
              </Row>
            </div>
          </div>
        </div>
        {/*<div className="col-12 col-xl-3 px-3">*/}
        {/*  <div className="msg-widget-startup-live">*/}
        {/*    <StartupMailer userLevel={{ name: userLevel }} />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </Row>
      {/*<ApplyForPitch*/}
      {/*  show={PitchApplyModal}*/}
      {/*  onHide={() => setPitchApplyModal(false)}*/}
      {/*/>*/}
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
      {/* {spotlightApplyModal && (
        <SpotlightApplyModal
          show={spotlightApplyModal}
          onHide={() => closeSpotlightApplyModal()}
          title={'Apply to Pitch'}
        />
      )} */}
      <SpotlightModal
        show={spotlightApplyModal}
        onHide={() => closeSpotlightApplyModal()}
        // User={ticket.User}
        mode='add'
        // updateUserSolutionStatus={updateUserSolutionStatus}
      />
    </Container>
  )
}

export default StartupLive
