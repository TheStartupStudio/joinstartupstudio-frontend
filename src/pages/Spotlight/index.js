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

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return ' SOON'
    } else {
      return (
        <span>
          {' IN ' + days + ' DAYS ' + hours + ' HOURS ' + minutes + ' MINUTES '}
          {minutes === 0 ? seconds + ' SECONDS' : ''}
        </span>
      )
    }
  }

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

  const SpotlightGridItem = (props) => {
    return (
      <div class="col-lg-6 col-md-12 ">
        <div
          class="p-3 px-5 border d-flex flex-column align-items-center justify-content-center"
          style={{ backgroundColor: '#F8F7F7', minHeight: 210 }}
        >
          <div className="text-center">
            <button
              style={{
                backgroundColor: '#51c7df',
                color: '#fff',
                fontSize: 14,
                border: '1px solid #51C7DF',
                marginLeft: 'auto',
                marginRight: 'auto',
                cursor: 'pointer'
              }}
              onClick={() => {
                props.onOpen()
              }}
              className="px-5 py-2 border-0 color transform text-uppercase my-1"
            >
              {props.buttonTitle}
            </button>
          </div>
          <div
            style={{
              font: 'normal normal normal 15px/17px Montserrat',
              letterSpacing: 0.52,
              color: '#333D3D',
              textAlign: 'left',
              marginTop: 20
            }}
          >
            {props.content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Container fluid>
      <Row>
        <div className="col-12  pe-0">
          <div
            className="account-page-padding page-border spotlight-container"
            style={{ minHeight: '100vh' }}
          >
            <h3 className="page-title">SPOTLIGHT®</h3>
            <p className="page-description">
              Pitch your startup to the Learn to Start community.
            </p>

            <Container fluid className={'m-0 g-0 '}>
              <div className="row g-2">
                <SpotlightGridItem
                  content={
                    'Learn about the Spotlight competition and determine if you would like to enter.'
                  }
                  buttonTitle={'WHAT IS SPOTLIGHT'}
                  type={'whatIsSpotlight'}
                  onOpen={() => openSimpleSpotlightModal('whatIsSpotlight')}
                />
                <SpotlightGridItem
                  content={
                    'Learn how to qualify to apply for the Spotlight competition.'
                  }
                  buttonTitle={'RULES OF SPOTLIGHT'}
                  type={'rulesOfSpotlight'}
                  onOpen={() => openSimpleSpotlightModal('rulesOfSpotlight')}
                />
                <SpotlightGridItem
                  content={'Learn how to apply for the Spotlight competition.'}
                  buttonTitle={'APPLICATION PROCESS'}
                  type={'applicationProcess'}
                  onOpen={() => openSimpleSpotlightModal('applicationProcess')}
                />
                <SpotlightGridItem
                  content={'Apply for the Spotlight competition.'}
                  buttonTitle={'APPLY NOW'}
                  type={'applyNow'}
                  onOpen={() => openSpotlightApplyModal()}
                />
              </div>
            </Container>
            <Row>
              <div>
                <div className="d-flex justify-content-between guidance-videos-top mt-5 guidance-encouragement-page-titles ">
                  <h3>SPOTLIGHT® Archive</h3>
                  <div class={'d-flex align-items-end  blue-text'}>
                    View all
                  </div>
                </div>
              </div>
            </Row>
            <div className="beyond-videos-desktop mt-2 d-flex align-items-center">
              <div className="arrow-icon-1" style={{ height: '100%' }}>
                <button
                  className="videos-track"
                  onClick={() => {
                    // handlePreviousVideo(1, startIndex, endIndex)
                  }}
                  style={{ width: '4%' }}
                >
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="videos-track-icon"
                    style={{ marginRight: '20px' }}
                  />
                </button>
              </div>
              <div
                className="card-group desktop-menu card-group-beyond-your-course"
                // style={{ marginTop: '15px' }}
                style={{ width: '94%' }}
              >
                <div className="card-group desktop-menu startuplive-archive-videos card-group-beyond-your-course w-100 justify-content-start  flex-sm-row">
                  {[0, 0].map((item, index) => (
                    <div
                      className="card-group all-videos-beyond-your-course-videos col-12 col-sm-5 col-md-4 me-4"
                      key={index}
                      style={{ width: '20%' }}
                    >
                      <div
                        className="card mobile-card"
                        // style={{ paddingRight: '20px' }}
                      >
                        <Link to={'#'}>
                          <div className="beyond-your-course-video-thumb beyound-all-videos-thumb spotlight">
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
                                width="100%"
                                alt="spotlight"
                                style={{
                                  height: '115px',
                                  objectFit: 'contain'
                                }}
                              />
                              <div className="beyond-your-course-video-thumb-icon"></div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="arrow-icon-1 justify-content-start"
                style={{ height: '100%' }}
              >
                <button
                  className="videos-track"
                  style={{ width: '4%' }}
                  // onClick={() => handleNextVideo(1, startIndex, endIndex)}
                >
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="videos-track-icon"
                  />
                </button>
              </div>
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
      {spotlightApplyModal && (
        <SpotlightApplyModal
          show={spotlightApplyModal}
          onHide={() => closeSpotlightApplyModal()}
          title={'Apply to Pitch'}
        />
      )}
    </Container>
  )
}

export default StartupLive
