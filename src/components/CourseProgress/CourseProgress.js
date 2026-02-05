import React, { useEffect, useRef, useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import progressLogo from '../../assets/images/academy-icons/progress-details-logo.png'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import lockSign from '../../assets/images/academy-icons/lock.png'
import CircularProgress from '../../components/ProgressBar'
import CourseNotStarted from './CourseNotStarted'
import InProggresCourse from './InProggresCourse'
import ProgressDone from './ProgressDone'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse } from 'bootstrap'
import axiosInstance from '../../utils/AxiosInstance'

function CourseProgress() {
  const [modal, setModal] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { loading } = useSelector((state) => state.course)

  const [finishedContent, setFinishedContent] = useState([])
  const [levelProgress, setLevelProgress] = useState({})
  const [progressLoading, setProgressLoading] = useState(false)
  const [lessonsByLevel, setLessonsByLevel] = useState({})
  const [lessonsLoading, setLessonsLoading] = useState(true)

  const toggleModal = () => setModal((prev) => !prev)

  const fetchUserProgress = async () => {
    try {
      setProgressLoading(true)

      const response = await axiosInstance.get('/ltsJournals/LtsCoursefinishedContent')

      if (response.data) {
        const finishedContentData = response.data.finishedContent || []
        const levelProgressData = response.data.levelProgress || {}


        setFinishedContent(finishedContentData)
        setLevelProgress(levelProgressData)
      } else {
        console.log('No data in response')
      }

    } catch (error) {
      console.error('Error fetching user progress:', error)
      console.log('API call failed, this might be due to authentication or API issues')
    } finally {
      setProgressLoading(false)
    }
  }

  const fetchLessons = async () => {
    try {
      setLessonsLoading(true)
      const response = await axiosInstance.get('/LtsJournals/entrepreneurship/lessons')
      if (response.data) {
        const transformedLessons = {}
        Object.keys(response.data).forEach(key => {
          const numericKey = parseInt(key)
          if (!isNaN(numericKey)) {
            if (numericKey === 2) {
              const level2Lessons = response.data[key] || []
              const nestedLessons = []
              let currentSection = null

              level2Lessons.forEach(lesson => {
                if (lesson.separate) {
                  if (currentSection) {
                    nestedLessons.push(currentSection)
                  }
                  currentSection = {
                    id: lesson.id || lesson.redirectId || 0,
                    title: lesson.title || '',
                    isParent: true,
                    children: []
                  }
                } else {
                  if (currentSection) {
                    currentSection.children.push({
                      id: lesson.id || lesson.redirectId || 0,
                      title: lesson.title || '',
                      status: lesson.status || 'notStarted',
                      redirectId: lesson.redirectId || parseInt(lesson.id) || 0
                    })
                  } else {
                    nestedLessons.push({
                      id: lesson.id || lesson.redirectId || 0,
                      title: lesson.title || '',
                      status: lesson.status || 'notStarted',
                      redirectId: lesson.redirectId || parseInt(lesson.id) || 0
                    })
                  }
                }
              })

              if (currentSection) {
                nestedLessons.push(currentSection)
              }

              transformedLessons[numericKey] = nestedLessons
            } else {
              transformedLessons[numericKey] = (response.data[key] || []).map(lesson => ({
                id: lesson.id || lesson.redirectId || 0,
                title: lesson.title || '',
                status: lesson.status || 'notStarted',
                redirectId: lesson.redirectId || parseInt(lesson.id) || 0
              }))
            }
          }
        })
        setLessonsByLevel(transformedLessons)
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
      setLessonsByLevel({})
    } finally {
      setLessonsLoading(false)
    }
  }

  const accordionRefs = useRef([])

  useEffect(() => {
    fetchLessons()
    fetchUserProgress()
  }, [user?.id])

  useEffect(() => {
    accordionRefs.current.forEach((ref) => {
      if (ref) {
        new Collapse(ref, { toggle: false })
      }
    })
  }, [])

  const handleAccordionClick = (index, event) => {
    event.preventDefault()
    const target = accordionRefs.current[index]
    if (target) {
      const bsCollapse = Collapse.getInstance(target) || new Collapse(target)
      bsCollapse.toggle()
    }
  }


  const isLevelAccessible = (level) => {
    if (level === 0) return true

    // Get all level keys and sort them to determine sequential access
    const levelKeys = Object.keys(levelProgress).sort((a, b) => {
      const aNum = parseInt(a.replace('level', ''))
      const bNum = parseInt(b.replace('level', ''))
      return aNum - bNum
    })

    // Find the current level index
    const currentLevelIndex = levelKeys.findIndex(key => parseInt(key.replace('level', '')) === level)

    if (currentLevelIndex === -1) return false

    // First level is always accessible if it exists
    if (currentLevelIndex === 0) return true

    // Previous level must be completed for current level to be accessible
    const prevLevelKey = levelKeys[currentLevelIndex - 1]
    const prevLevel = levelProgress[prevLevelKey]

    return prevLevel && prevLevel.completed === prevLevel.total
  }

  const getCourseStatus = (lessonId, levelLessons = null) => {
    if (finishedContent.includes(lessonId)) {
      return 'done'
    }

    if (levelLessons && Array.isArray(levelLessons)) {
      for (let i = 0; i < levelLessons.length; i++) {
        const lesson = levelLessons[i]
        if (!finishedContent.includes(lesson.id)) {
          if (lesson.id === lessonId) {
            return 'inProgress'
          }
          return 'notStarted'
        }
      }
    }

    const nextAvailableId =
      finishedContent.length > 0
        ? Math.max(...finishedContent) + 1
        : 51

    if (lessonId === nextAvailableId) {
      return 'inProgress'
    }

    return 'notStarted'
  }


  return (
    <>
      <div className='d-grid academy-dashboard-card grid-row-none-mob progress-dashboard-card '>
        <div className='d-flex justify-content-between align-items-center align-self-baseline pt-4 gap-2'>
          <div className='d-flex gap-3 align-items-center'>
            <img src={courseLogo} alt='course' />
            <h4 className='fs-9 my-details-header'>My Studio Progress</h4>
          </div>
          <div
            className='progress-details cursor-pointer'
            onClick={toggleModal}
          >
            <span>Progress Details</span>
            <img src={rightArrow} alt='right-arr' />
          </div>
        </div>
        <div className='d-flex gap-4 justify-content-around flex-col-mob mt-2rem-mob flex-wrap'>
          {Object.keys(levelProgress).sort((a, b) => {
            const aNum = parseInt(a.replace('level', ''))
            const bNum = parseInt(b.replace('level', ''))
            return aNum - bNum
          }).map((levelKey) => {
            const levelData = levelProgress[levelKey]
            const levelNumber = parseInt(levelKey.replace('level', ''))

            return (
              <div
                key={levelKey}
                className='d-flex flex-column gap-4 progress-circular-container'
                style={!isLevelAccessible(levelNumber) ? { opacity: 0.6, pointerEvents: 'none' } : {}}
              >
                <div style={{ position: 'relative' }}>
                  <CircularProgress
                    percentage={levelData?.percentage || 0}
                    level={levelNumber}
                  />
                  {/* {!isLevelAccessible(levelNumber) && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10,
                      pointerEvents: 'none'
                    }}>
                      <img
                        src={lockSign}
                        alt='locked'
                        style={{
                          width: '24px',
                          height: '24px',
                          filter: 'brightness(0) invert(1)'
                        }}
                      />
                    </div>
                  )} */}
                </div>
                <p className='text-center'>
                  {levelData?.levelTitle || `Level ${levelNumber}`}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggleModal} className='certificate-modal'>
        <span
          className='cursor-pointer'
          onClick={toggleModal}
          style={{ zIndex: '1' }}
        >
          <img className='left-arrow-modal' src={leftArrow} alt='left' />
        </span>
        <ModalBody>
          <img src={progressLogo} alt='user' className='mb-3' />
          <div className='d-flex justify-content-between align-items-center'>
            <h3 className='fs-14' style={{ marginBottom: '0' }}>
              View Progress Details
            </h3>
          </div>

          <div className='accordion mt-5' id='progressAccordion'>
            {Object.keys(levelProgress).sort((a, b) => {
              const aNum = parseInt(a.replace('level', ''))
              const bNum = parseInt(b.replace('level', ''))
              return aNum - bNum
            }).map((levelKey, index) => {
              const levelData = levelProgress[levelKey]
              const levelNumber = parseInt(levelKey.replace('level', ''))
              const levelLessons = lessonsByLevel[levelNumber - 1] || []

              return (
                <div key={levelKey} className='accordion-item progress-details-accordion'>
                  <h2 className='accordion-header' id={`heading${levelNumber}`}>
                    <button
                      className='accordion-button collapsed text-secondary fw-medium'
                      type='button'
                      onClick={(e) => handleAccordionClick(index, e)}
                      aria-expanded='false'
                      aria-controls={`collapse${levelNumber}`}
                    >
                      LEVEL {levelNumber} | {levelData?.levelTitle || `Level ${levelNumber}`}
                    </button>
                  </h2>
                  <div
                    id={`collapse${levelNumber}`}
                    ref={(el) => (accordionRefs.current[index] = el)}
                    className='accordion-collapse collapse'
                    aria-labelledby={`heading${levelNumber}`}
                    data-bs-parent='#progressAccordion'
                  >
                    <div className='accordion-body d-flex gap-4 flex-col-mob course-progress'>
                      <div className='d-flex flex-column gap-4'>
                        <CircularProgress
                          percentage={levelData?.percentage || 0}
                          level={levelNumber}
                        />
                      </div>
                      <div className='d-flex flex-column gap-3 text-black'>
                        {lessonsLoading ? (
                          <div className='text-center text-secondary'>Loading lessons...</div>
                        ) : levelLessons.length > 0 ? (
                          levelLessons.map((lesson, lessonIndex) => {
                            // Handle different lesson structures
                            if (lesson.children && Array.isArray(lesson.children)) {
                              // Level 3 style with sections
                              return (
                                <React.Fragment key={`section-${lesson.id}-${lessonIndex}`}>
                                  <p className='mb-0'>{lesson.title}</p>
                                  {lesson.children.map((childLesson, childIndex) => {
                                    const status = getCourseStatus(childLesson.id)
                                    return status === 'done' ? (
                                      <ProgressDone key={`lesson-${levelNumber}-${childLesson.id}-${childIndex}`} title={childLesson.title} />
                                    ) : status === 'inProgress' ? (
                                      <InProggresCourse key={`lesson-${levelNumber}-${childLesson.id}-${childIndex}`} title={childLesson.title} />
                                    ) : (
                                      <CourseNotStarted key={`lesson-${levelNumber}-${childLesson.id}-${childIndex}`} title={childLesson.title} />
                                    )
                                  })}
                                </React.Fragment>
                              )
                            } else {
                              // Regular lesson style
                              const status = getCourseStatus(lesson.id, levelNumber === 1 ? levelLessons : null)
                              return status === 'done' ? (
                                <ProgressDone key={`lesson-${levelNumber}-${lesson.id}-${lessonIndex}`} title={lesson.title} />
                              ) : status === 'inProgress' ? (
                                <InProggresCourse key={`lesson-${levelNumber}-${lesson.id}-${lessonIndex}`} title={lesson.title} />
                              ) : (
                                <CourseNotStarted key={`lesson-${levelNumber}-${lesson.id}-${lessonIndex}`} title={lesson.title} />
                              )
                            }
                          })
                        ) : (
                          <div className='text-center text-secondary'>No lessons available</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default CourseProgress
