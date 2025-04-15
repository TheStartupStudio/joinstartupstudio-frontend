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
import CircleIcon from '../../assets/images/circle-startup-icon.png'
import Select from 'react-select'

function MyCourseEntrepreneurship() {
  const history = useHistory()
  let [showModal, setShowModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(null)
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
  const options = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' }
  ]

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption)
    console.log('Selected Language:', selectedOption.value)
  }

  return (
    <Container fluid>
      <Row>
          <div style={{ minHeight: '100vh' }}>
            <div className='d-flex space-between align-items-center' style={{margin:'40px 40px 40px 30px'}}>
              <div >
                <h3 className='page-title' style={{ marginLeft: '20px' }}>
                  {/* <IntlMessages id='navigation.startup_live' /> */}
                  Intro to the Course
                </h3>
                <p  style={{ marginLeft: '20px' }}>
                  {/* <IntlMessages id='startup_live.page_description' /> */}
                  Embarking on the Entrepreneurial Journey
                </p>
              </div>
              <div className='select-btn'
                style={{
                  display: 'inline-block',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                  padding: '1px', // Adjust this value to control border thickness
                  height: '58px',
                  boxShadow: '0px 4px 10px 0px #00000040'
                }}
              >
                <Select
                  options={options}
                  value={selectedLanguage}
                  onChange={handleChange}
                  placeholder='Select Language'
                  menuPortalTarget={document.body}
                  isSearchable={false}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({
                      ...base,
                      width: '250px', // Fixed width
                      minHeight: '40px', // Fixed height
                      overflow: 'hidden',
                      border: 'none', // Remove the default border
                      borderRadius: '6px' // Slightly smaller than the outer container radius
                    }),
                    singleValue: (base) => ({
                      ...base,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    })
                  }}
                  components={{
                    IndicatorSeparator: () => null // Remove separator
                  }}
                />
              </div>
            </div>
<div  className='gradient-background-course' >
            <div style={{margin:'0 -15px'}}>
              <div className='welcome-journey-text'>
                <div className='title-container'>
                  <img
                    src={CircleIcon}
                    alt='logo'
                    style={{ width: '36px', height: '36px' }}
                    className='welcome-journey-text__icon'
                  />
                  <p className='welcome-journey-text__title'>
                    Welcome to the Journey
                  </p>
                </div>
                <p className='welcome-journey-text__description'>
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
                {/* <p>
                  <a
                    href="/my-course-in-entrepreneurship/journal"
                    className="button button--big"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowModal(true)
                    }}
                  >
                    START
                  </a>
                </p> */}
              </div>
            </div>

            <div className='col-md-12 general-video-container'>
              <div className='video-container'>
                <div style={{ width: '100%' }}>
                  <div className='responsive-video-first responsive-accordion'>
                    <ReactPlayer
                      className=''
                      width={'305px'}
                      height={'192px'}
                      style={{ margin: '10px', padding: '5px' }}
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
              <div className='accordion accordion-flex' id='accordionExample'>
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
                  <div style={{ marginRight: '-10px' }} key={index}>
                    {/* <div className="accordion-item  accordion-item-border"> */}
                    <h2
                      className='accordion-header accordion-content-section-header'
                      id={`heading-${index}`}
                    >
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
                      className={`accordion-collapse accordion-content-section  collapse `}
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
                          <div className='key_points row responsive-accordion'>
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
                              <p className='levels-of-journey__title'>
                                <span>LEVEL 1 |</span> Entrepreneurship and You
                              </p>
                              <div className='levels-of-journey__description'>
                                Entrepreneurship is a mindset,and in the first
                                level of this program,you will engage in
                                developing this mindset as your preparation for
                                starting your journey on the pathway to
                                entrepreneurship.You need proof of yourself as
                                an entrepreneur and through this program you
                                will create content that can publicly speak to
                                your values,your purpose,your mindset, and your
                                skillset.The first step in creating this proof
                                is developing content that solidifies your
                                statement of "I Am.".Who are you and how do you
                                want the world to see you? It's time for you to
                                communicate you professional identity.
                              </div>
                            </div>
                            <div className='levels-of-journey__level'>
                              <p className='levels-of-journey__title'>
                                <span>LEVEL 2 |</span> Understanding Learn to
                                Start
                              </p>
                              <div className='levels-of-journey__description'>
                                In the second level, you will immerse yourself
                                in the LTS model. People want to work with
                                people they like, respect, and trust. So, you
                                will begin the LTS process by building yourself
                                first. With your digital “I Am” video ready to
                                introduce you to your cohort and the world, it
                                is time to assess your experiences and mindset
                                so far by evaluating yourself according to the
                                LTS model and vet potential partners, thus
                                creating a foundation for a successful startup.
                              </div>
                            </div>
                            <div className='levels-of-journey__level'>
                              <p className='levels-of-journey__title'>
                                <span>LEVEL 3 |</span> The LEARN Stage
                              </p>
                              <div className='levels-of-journey__description'>
                                Now that you have a better sense of self and
                                your professional opportunities for
                                collaboration, you can move on to creating the
                                startup, itself. You’re going to be using your
                                own personal experiences and passions to find a
                                problem worth solving and begin to construct the
                                framework of your startup. You’ll engage in
                                industry and market analysis, develop a brand,
                                build a business plan, create a financial
                                framework, and evaluate the sustainability,
                                profitability, and scalability of your solution.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* </div> */}
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
       
        {/* <div className="col-12 col-xl-3 px-2 mt-3">
          <ShowMessenger />
          <NotesButton />

          <Chat room={'5f96a12568d0c2c580fca9fe'} />

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
        </div> */}
      </Row>
    </Container>
  )
}

export default MyCourseEntrepreneurship