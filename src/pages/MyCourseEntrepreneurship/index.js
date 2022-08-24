import React, { useState, useEffect } from 'react'
import { Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDivide, faUsers } from '@fortawesome/free-solid-svg-icons'
import { ShowMessenger } from '../../utils/helpers'
import { NotesButton } from '../../components/Notes'
import ReactPlayer from 'react-player'
import { Modal } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import LtsCourseIntro from '../../assets/json/lts_course_intro.json'
import { changeSidebarState } from '../../redux'
import { useDispatch } from 'react-redux'
import './index.css'
import { EditRecommendationModal } from '../../components/Portfolio/Recommendation/editRecommendationModal'

function MyCourseEntrepreneurship() {
  const history = useHistory()
  let [showModal, setShowModal] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(changeSidebarState(false))
  }, [])

  function goToJournal(direct) {
    return () => {
      if (direct) {
        localStorage.setItem('direct-course-entrepreneurship', true)
      }
      history.push('/my-course-in-entrepreneurship/journal')
    }
  }

  return (
    <Container fluid>
      <Row>
        <div className='col-12 col-xl-9'>
          <div
            className='account-page-padding page-border'
            style={{ minHeight: '100vh' }}
          >
            <h3 className='page-title'>
              {/* <IntlMessages id='navigation.startup_live' /> */}
              MY COURSE IN ENTREPRENEURSHIP
            </h3>
            <p className='page-description'>
              {/* <IntlMessages id='startup_live.page_description' /> */}
              Embarking on the Entrepreneurial Journey
            </p>

            <div className='row'>
              <div className='col-12 col-md-5 mb-4'>
                <div style={{ width: '100%' }}>
                  <div className='responsive-video'>
                    <ReactPlayer
                      className=''
                      width={'100%'}
                      height={'100%'}
                      url={
                        'https://d5tx03iw7t69i.cloudfront.net/Month_1/M1-Vid-1-Welcome-to-Level-1-V3.mp4'
                      }
                      controls
                      playing={true}
                      preload='metadata'
                      light={
                        'https://d5tx03iw7t69i.cloudfront.net/Month_1/M1-Vid-1-Thumbnail.jpg'
                      }
                      config={{
                        file: {
                          attributes: {
                            controlsList: 'nodownload'
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='col-12 col-md-7'>
                <p className='mt-0'>
                  Entrepreneurship is about building{' '}
                  <span className='you-href'>YOU</span>. As such, in this course
                  you will set the pace of your development.
                </p>
                <p>
                  Throughout each module, you will engage in the levels of the
                  LTS model to identify a problem worth solving and turn concept
                  into execution as you build a product or service ready for
                  market entry.
                </p>
                <p>
                  <a
                    href='/my-course-in-entrepreneurship/journal'
                    className='button button--big'
                    onClick={(e) => {
                      e.preventDefault()
                      setShowModal(true)
                    }}
                  >
                    START
                  </a>
                </p>
              </div>
            </div>

            <div className='col-md-12'>
              <div className='accordion accordion--dark' id='accordionExample'>
                {[
                  {
                    title: 'Introducing the Entrepreneurs',
                    type: 'entrepreneurs'
                  },
                  { title: 'Key Points That You’ll Learn', type: 'key_points' },
                  {
                    title: 'Three Levels of Your Journey',
                    type: 'levels_of_journey'
                  }
                ].map((data, index) => (
                  <div className='mt-2' key={index}>
                    <div className='accordion-item'>
                      <h2 className='accordion-header' id={`heading-${index}`}>
                        <button
                          className='accordion-button collapsed accordion-outter button-accordion'
                          type='button'
                          eventKey={`${index}`}
                          data-bs-toggle='collapse'
                          data-bs-target={`#collapse_outer${index}`}
                          aria-expanded='false'
                          aria-controls={`collapse_outer${index}`}
                        >
                          {data.title}
                        </button>
                      </h2>
                      <div
                        id={`collapse_outer${index}`}
                        eventKey={`${index}`}
                        className={`accordion-collapse collapse `}
                        aria-labelledby={`heading-${index}`}
                        data-bs-parent={`#accordionExample`}
                      >
                        <div
                          className='accordion-body py-4'
                          eventKey={`${index}`}
                        >
                          {data.type == 'entrepreneurs' && (
                            <div className='entrepreneurs row'>
                              {LtsCourseIntro['entrepeneurs'].map(
                                (entData, entIndex) => (
                                  <div className='entrepreneurs__item col-12 col-md-6'>
                                    <div className='entrepreneurs__item-inner'>
                                      <h3 className='entrepreneurs__item-title'>
                                        {entData.name}
                                      </h3>
                                      <div className='entrepreneurs__item-position'>
                                        {entData.position}
                                      </div>
                                      <div className='entrepreneurs__item-video'>
                                        <div className='responsive-video'>
                                          <ReactPlayer
                                            className=''
                                            width={'100%'}
                                            height={'100%'}
                                            url={entData.video_url}
                                            controls
                                            playing={true}
                                            preload='metadata'
                                            light={entData.thumbnail}
                                            config={{
                                              file: {
                                                attributes: {
                                                  controlsList: 'nodownload'
                                                }
                                              }
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {data.type == 'key_points' && (
                            <div className='key_points row'>
                              {LtsCourseIntro['key_points_videos'].map(
                                (entData, entIndex) => (
                                  <div className='key_points__item col-12 col-md-3'>
                                    <div className='key_points__item-inner'>
                                      <div className='key_points__item-video'>
                                        <div className='responsive-video'>
                                          <ReactPlayer
                                            className=''
                                            width={'100%'}
                                            height={'100%'}
                                            url={entData.url}
                                            controls
                                            playing={true}
                                            preload='metadata'
                                            config={{
                                              file: {
                                                attributes: {
                                                  controlsList: 'nodownload'
                                                }
                                              }
                                            }}
                                            light={entData.thumbnail}
                                          />
                                        </div>
                                      </div>
                                      <h3 className='key_points__item-title'>
                                        {entData.title}
                                      </h3>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {data.type == 'levels_of_journey' && (
                            <div className='levels-of-journey'>
                              <div className='levels-of-journey__level'>
                                <h3 className='levels-of-journey__title'>
                                  <span>LEVEL 1 |</span> Entrepreneurship and
                                  You
                                </h3>
                                <div className='levels-of-journey__description'>
                                  In the first level of this program, you will
                                  engage in developing this mindset as your
                                  preparation for starting your journey on the
                                  pathway to entrepreneurship. You need proof of
                                  yourself as an entrepreneur and to create this
                                  proof, you will develop content that
                                  solidifies your statement of “I Am.” Who are
                                  you and how do you want the world to see you?
                                  It’s time for you to communicate your
                                  professional identity.
                                </div>
                              </div>
                              <div className='levels-of-journey__level'>
                                <h3 className='levels-of-journey__title'>
                                  <span>LEVEL 2 |</span> Understanding Learn to
                                  Start
                                </h3>
                                <div className='levels-of-journey__description'>
                                  In the second level, you will immerse yourself
                                  in the LTS model. People want to work with
                                  people they like, respect, and trust. So, you
                                  will begin the LTS process by building
                                  yourself first. With your digital “I Am” video
                                  ready to introduce you to your cohort and the
                                  world, it is time to assess your experiences
                                  and mindset so far by evaluating yourself
                                  according to the LTS model and vet potential
                                  partners, thus creating a foundation for a
                                  successful startup.
                                </div>
                              </div>
                              <div className='levels-of-journey__level'>
                                <h3 className='levels-of-journey__title'>
                                  <span>LEVEL 3 |</span> The LEARN, DEVELOP,
                                  BRAND, & START Stages
                                </h3>
                                <div className='levels-of-journey__description'>
                                  Now that you have a better sense of self and
                                  your professional opportunities for
                                  collaboration, you can move on to creating the
                                  startup, itself. You’re going to be using your
                                  own personal experiences and passions to find
                                  a problem worth solving and begin to construct
                                  the framework of your startup. You’ll engage
                                  in industry and market analysis, develop a
                                  brand, build a business plan, create a
                                  financial framework, and evaluate the
                                  sustainability, profitability, and scalability
                                  of your solution.
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Modal
              show={showModal}
              backdrop='static'
              keyboard={false}
              className='alert-modal'
              centered={true}
              size='sm'
            >
              <Modal.Body>
                <div className='alert-modal__text'>
                  Would you like to skip this page in the future and go directly
                  to the course?
                </div>
                <div className='alert-modal__buttons'>
                  <a href='#' onClick={goToJournal(true)} className='button'>
                    YES, PLEASE!
                  </a>
                  <a href='#' onClick={goToJournal()} className='button-naked'>
                    NOT RIGHT NOW
                  </a>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
        <div className='col-12 col-xl-3 px-2 mt-3'>
          <ShowMessenger />
          <NotesButton />

          {/* <Chat room={'5f96a12568d0c2c580fca9fe'} /> */}

          <div className={'community-connect my-2'}>
            <Link to='/my-connections'>
              <FontAwesomeIcon
                icon={faUsers}
                style={{
                  color: '#01C5D1',
                  background: 'white',
                  borderRadius: '50%',
                  height: '25px',
                  width: '36px',
                  opacity: '1'
                }}
              />
            </Link>
            <Link to='/my-connections'>
              <p className='my-auto ms-2'>Connect with my community</p>
            </Link>
          </div>
        </div>
      </Row>
    </Container>
  )
}

export default MyCourseEntrepreneurship
