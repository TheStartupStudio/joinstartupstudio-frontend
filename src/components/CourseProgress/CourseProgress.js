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
  const [levelProgress, setLevelProgress] = useState({
    level1: { percentage: 0, completed: 0, total: 8 },
    level2: { percentage: 0, completed: 0, total: 8 },
    level3: { percentage: 0, completed: 0, total: 52 }
  })
  const [progressLoading, setProgressLoading] = useState(false)
  const [lessonsByLevel, setLessonsByLevel] = useState({})
  const [lessonsLoading, setLessonsLoading] = useState(true)

  const toggleModal = () => setModal((prev) => !prev)

  // Fetch user progress from API
  const fetchUserProgress = async () => {
    if (!user?.id) return

    try {
      setProgressLoading(true)
      const response = await axiosInstance.get(`/super-admin/user-level-progress/${user.id}`)
      if (response.data) {
        setFinishedContent(response.data.finishedContent || [])
        setLevelProgress({
          level1: response.data.levelProgress?.level1 || { percentage: 0, completed: 0, total: 8 },
          level2: response.data.levelProgress?.level2 || { percentage: 0, completed: 0, total: 8 },
          level3: response.data.levelProgress?.level3 || { percentage: 0, completed: 0, total: 52 }
        })
      }
    } catch (error) {
      console.error('Error fetching user progress:', error)
      // Keep default values on error
    } finally {
      setProgressLoading(false)
    }
  }

  // Fetch lessons from API
  const fetchLessons = async () => {
    try {
      setLessonsLoading(true)
      const response = await axiosInstance.get('/LtsJournals/entrepreneurship/lessons')
      if (response.data) {
        // Convert string keys to numeric keys and ensure proper structure
        const transformedLessons = {}
        Object.keys(response.data).forEach(key => {
          const numericKey = parseInt(key)
          if (!isNaN(numericKey)) {
            if (numericKey === 2) {
              // Special handling for level 2 - transform flat array into nested structure
              const level2Lessons = response.data[key] || []
              const nestedLessons = []
              let currentSection = null

              level2Lessons.forEach(lesson => {
                if (lesson.separate) {
                  // This is a section header
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
                  // This is a regular lesson
                  if (currentSection) {
                    currentSection.children.push({
                      id: lesson.id || lesson.redirectId || 0,
                      title: lesson.title || '',
                      status: lesson.status || 'notStarted',
                      redirectId: lesson.redirectId || parseInt(lesson.id) || 0
                    })
                  } else {
                    // If no section yet, add as regular lesson
                    nestedLessons.push({
                      id: lesson.id || lesson.redirectId || 0,
                      title: lesson.title || '',
                      status: lesson.status || 'notStarted',
                      redirectId: lesson.redirectId || parseInt(lesson.id) || 0
                    })
                  }
                }
              })

              // Add the last section if it exists
              if (currentSection) {
                nestedLessons.push(currentSection)
              }

              transformedLessons[numericKey] = nestedLessons
            } else {
              // For levels 0 and 1, keep the flat structure
              transformedLessons[numericKey] = (response.data[key] || []).map(lesson => ({
                id: lesson.id || lesson.redirectId || 0, // Keep id for backward compatibility
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
      // Set empty object on error
      setLessonsByLevel({})
    } finally {
      setLessonsLoading(false)
    }
  }

  const accordionRefs = useRef([])

  useEffect(() => {
    // Fetch lessons and user progress from API
    fetchLessons()
    if (user?.id) {
      fetchUserProgress()
    }
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
    if (level === 0) return true // Level 1 is always accessible

    if (level === 1) {
      // Level 2 requires completing lesson 58 (last lesson of level 1)
      return finishedContent.includes(58)
    }

    if (level === 2) {
      // Level 3 requires completing lesson 68 (last lesson of level 2)
      return finishedContent.includes(68)
    }

    return false
  }

  const getCourseStatus = (lessonId, levelLessons = null) => {
    if (finishedContent.includes(lessonId)) {
      return 'done'
    }

    // If we have the level lessons array, find the first incomplete lesson in order
    if (levelLessons && Array.isArray(levelLessons)) {
      // Find the first lesson that is NOT completed
      for (let i = 0; i < levelLessons.length; i++) {
        const lesson = levelLessons[i]
        if (!finishedContent.includes(lesson.id)) {
          // This is the first incomplete lesson
          if (lesson.id === lessonId) {
            return 'inProgress'
          }
          // If we haven't reached the current lesson yet, it's not started
          return 'notStarted'
        }
      }
    }

    // Fallback to the old logic if no level lessons provided
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
        <div className='d-flex gap-4 justify-content-around flex-col-mob mt-2rem-mob'>
          <div className='d-flex flex-column gap-4 progress-circular-container'>
            <CircularProgress
              percentage={levelProgress?.level1?.percentage || 0}
              level={1}
            />
            <p className='text-center'>
              Entrepreneurship & You
            </p>
          </div>
          <div
            className='d-flex flex-column gap-4 progress-circular-container'
            style={!isLevelAccessible(1) ? { opacity: 0.6, pointerEvents: 'none' } : {}}
          >
            <div style={{ position: 'relative' }}>
              <CircularProgress
                percentage={levelProgress?.level2?.percentage || 0}
                level={2}
              />
              {!isLevelAccessible(1) && (
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
              )}
            </div>
            <p className='text-center'>
              Understanding Learn to Start
            </p>
          </div>
          <div
            className='d-flex flex-column gap-4 progress-circular-container'
            style={!isLevelAccessible(2) ? { opacity: 0.6, pointerEvents: 'none' } : {}}
          >
            <div style={{ position: 'relative' }}>
              <CircularProgress
                percentage={levelProgress?.level3?.percentage || 0}
                level={3}
              />
              {!isLevelAccessible(2) && (
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
              )}
            </div>
            <p className='text-center'>
              The Journey of Entrepreneurship
            </p>
          </div>
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
            {/* Level 1 */}
            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header' id='headingOne'>
                <button
                  className='accordion-button collapsed text-secondary fw-medium'
                  type='button'
                  onClick={(e) => handleAccordionClick(0, e)}
                  aria-expanded='false'
                  aria-controls='collapseOne'
                >
                  LEVEL 1 | The Myths of Entrepreneurship
                </button>
              </h2>
              <div
                id='collapseOne'
                ref={(el) => (accordionRefs.current[0] = el)}
                className='accordion-collapse collapse'
                aria-labelledby='headingOne'
                data-bs-parent='#progressAccordion'
              >
                <div className='accordion-body d-flex gap-4 flex-col-mob course-progress'>
                  <div className='d-flex flex-column gap-4'>
                    <CircularProgress
                      percentage={levelProgress?.level1?.percentage || 0}
                      level={1}
                    />
                  </div>
                  <div className='d-flex flex-column gap-3'>
                    {lessonsLoading ? (
                      <div className='text-center text-secondary'>Loading lessons...</div>
                    ) : lessonsByLevel[0] && lessonsByLevel[0].length > 0 ? (
                      lessonsByLevel[0].map((lesson, index) => {
                        const status = getCourseStatus(lesson.id, lessonsByLevel[0])
                        return status === 'done' ? (
                          <ProgressDone key={`lesson-0-${lesson.id}-${index}`} title={lesson.title} />
                        ) : status === 'inProgress' ? (
                          <InProggresCourse key={`lesson-0-${lesson.id}-${index}`} title={lesson.title} />
                        ) : (
                          <CourseNotStarted key={`lesson-0-${lesson.id}-${index}`} title={lesson.title} />
                        )
                      })
                    ) : (
                      <div className='text-center text-secondary'>No lessons available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Level 2 */}
            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header' id='headingTwo'>
                <button
                  className='accordion-button collapsed text-secondary fw-medium'
                  type='button'
                  onClick={(e) => handleAccordionClick(1, e)}
                  aria-expanded='false'
                  aria-controls='collapseTwo'
                >
                  LEVEL 2 | Understanding Learn to Start
                </button>
              </h2>
              <div
                id='collapseTwo'
                ref={(el) => (accordionRefs.current[1] = el)}
                className='accordion-collapse collapse'
                aria-labelledby='headingTwo'
                data-bs-parent='#progressAccordion'
              >
                <div className='accordion-body d-flex gap-4 flex-col-mob course-progress'>
                  <div className='d-flex flex-column gap-4'>
                    <CircularProgress
                      percentage={levelProgress?.level2?.percentage || 0}
                      level={2}
                    />
                  </div>
                  <div className='d-flex flex-column gap-3'>
                    {lessonsLoading ? (
                      <div className='text-center text-secondary'>Loading lessons...</div>
                    ) : lessonsByLevel[1] && lessonsByLevel[1].length > 0 ? (
                      lessonsByLevel[1].map((lesson, index) => {
                        const status = getCourseStatus(lesson.id)
                        return status === 'done' ? (
                          <ProgressDone key={`lesson-1-${lesson.id}-${index}`} title={lesson.title} />
                        ) : status === 'inProgress' ? (
                          <InProggresCourse key={`lesson-1-${lesson.id}-${index}`} title={lesson.title} />
                        ) : (
                          <CourseNotStarted key={`lesson-1-${lesson.id}-${index}`} title={lesson.title} />
                        )
                      })
                    ) : (
                      <div className='text-center text-secondary'>No lessons available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Level 3 */}
            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header' id='headingThree'>
                <button
                  className='accordion-button collapsed text-secondary fw-medium'
                  type='button'
                  onClick={(e) => handleAccordionClick(2, e)}
                  aria-expanded='false'
                  aria-controls='collapseThree'
                >
                  LEVEL 3 | The LEARN Stage
                </button>
              </h2>
              <div
                id='collapseThree'
                ref={(el) => (accordionRefs.current[2] = el)}
                className='accordion-collapse collapse'
                aria-labelledby='headingThree'
                data-bs-parent='#progressAccordion'
              >
                <div className='accordion-body d-flex gap-4 flex-col-mob course-progress'>
                  <div className='d-flex flex-column gap-4'>
                    <CircularProgress
                      percentage={levelProgress?.level3?.percentage || 0}
                      level={3}
                    />
                  </div>
                  <div className='d-flex flex-column gap-3 text-black'>
                    {lessonsLoading ? (
                      <div className='text-center text-secondary'>Loading lessons...</div>
                    ) : lessonsByLevel[2] && lessonsByLevel[2].length > 0 ? (
                      lessonsByLevel[2].map((section, sectionIndex) => (
                        <React.Fragment key={`section-${section.id}-${sectionIndex}`}>
                          <p className='mb-0'>{section.title}</p>
                          {section.children && section.children.map((lesson, lessonIndex) => {
                            const status = getCourseStatus(lesson.id)
                            return status === 'done' ? (
                              <ProgressDone key={`lesson-2-${lesson.id}-${lessonIndex}`} title={lesson.title} />
                            ) : status === 'inProgress' ? (
                              <InProggresCourse key={`lesson-2-${lesson.id}-${lessonIndex}`} title={lesson.title} />
                            ) : (
                              <CourseNotStarted key={`lesson-2-${lesson.id}-${lessonIndex}`} title={lesson.title} />
                            )
                          })}
                        </React.Fragment>
                      ))
                    ) : (
                      <div className='text-center text-secondary'>No lessons available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default CourseProgress
