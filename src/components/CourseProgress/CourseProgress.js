import React, { useEffect, useRef, useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import courseLogo from '../../assets/images/academy-icons/academy-logo.png'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import progressLogo from '../../assets/images/academy-icons/progress-details-logo.png'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import CircularProgress from '../../components/ProgressBar'
import CourseNotStarted from './CourseNotStarted'
import InProggresCourse from './InProggresCourse'
import ProgressDone from './ProgressDone'
import { useSelector } from 'react-redux'
import { Collapse } from 'bootstrap'
import './CourseProgress.css'

function CourseProgressSkeleton() {
  return (
    <div
      className='d-grid academy-dashboard-card grid-row-none-mob progress-dashboard-card course-progress--skeleton'
      aria-hidden='true'
    >
      <div className='d-flex justify-content-between align-items-center align-self-baseline pt-4 gap-2'>
        <div className='d-flex gap-3 align-items-center'>
          <div className='course-progress__skeleton-logo' />
          <div className='course-progress__skeleton-line course-progress__skeleton-line--title' />
        </div>
        <div className='course-progress__skeleton-line course-progress__skeleton-line--link' />
      </div>
      <div className='course-progress__skeleton-levels'>
        {[1, 2, 3].map((level) => (
          <div key={level} className='course-progress__skeleton-level'>
            <div className='course-progress__skeleton-ring' />
            <div className='course-progress__skeleton-line course-progress__skeleton-line--level' />
          </div>
        ))}
      </div>
    </div>
  )
}

function CourseProgress() {
  const [modal, setModal] = useState(false)

  const {
    finishedContent,
    levelProgress,
    lessonsByLevel,
    progressLoading,
    progressLoaded,
    lessonsLoading,
    lessonsLoaded
  } = useSelector((state) => state.course)

  const safeLevelProgress = levelProgress || {}
  const safeFinishedContent = finishedContent || []

  const toggleModal = () => setModal((prev) => !prev)

  const accordionRefs = useRef([])

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

    const levelKeys = Object.keys(safeLevelProgress).sort((a, b) => {
      const aNum = parseInt(a.replace('level', ''))
      const bNum = parseInt(b.replace('level', ''))
      return aNum - bNum
    })

    const currentLevelIndex = levelKeys.findIndex(
      (key) => parseInt(key.replace('level', '')) === level
    )

    if (currentLevelIndex === -1) return false
    if (currentLevelIndex === 0) return true

    const prevLevelKey = levelKeys[currentLevelIndex - 1]
    const prevLevel = safeLevelProgress[prevLevelKey]

    return prevLevel && prevLevel.completed === prevLevel.total
  }

  const getCourseStatus = (lessonId, levelLessons = null) => {
    if (safeFinishedContent.includes(lessonId)) {
      return 'done'
    }

    if (levelLessons && Array.isArray(levelLessons)) {
      for (let i = 0; i < levelLessons.length; i++) {
        const lesson = levelLessons[i]
        if (!safeFinishedContent.includes(lesson.id)) {
          if (lesson.id === lessonId) {
            return 'inProgress'
          }
          return 'notStarted'
        }
      }
    }

    const nextAvailableId =
      safeFinishedContent.length > 0 ? Math.max(...safeFinishedContent) + 1 : 51

    if (lessonId === nextAvailableId) {
      return 'inProgress'
    }

    return 'notStarted'
  }

  const showSkeleton = !progressLoaded && progressLoading

  if (showSkeleton) {
    return <CourseProgressSkeleton />
  }

  if (!progressLoaded) {
    return <CourseProgressSkeleton />
  }

  return (
    <>
      <div className='d-grid academy-dashboard-card grid-row-none-mob progress-dashboard-card course-progress--loaded'>
        <div className='d-flex justify-content-between align-items-center align-self-baseline pt-4 gap-2 mb-4'>
          <div className='d-flex gap-3 align-items-center'>
            <img src={courseLogo} alt='course' className='course-logo-studio' />
            <h4 className='fs-9 my-details-header'>My Course Progress</h4>
          </div>
          <div
            className='progress-details cursor-pointer'
            onClick={toggleModal}
          >
            <span>Progress Details</span>
            <img src={rightArrow} alt='right-arr' />
          </div>
        </div>
        <div className='d-flex gap-4 justify-content-around flex-col-mob mt-2rem-mob flex-wrap mb-4'>
          {Object.keys(safeLevelProgress)
            .sort((a, b) => {
              const aNum = parseInt(a.replace('level', ''))
              const bNum = parseInt(b.replace('level', ''))
              return aNum - bNum
            })
            .map((levelKey) => {
              const levelData = safeLevelProgress[levelKey]
              const levelNumber = parseInt(levelKey.replace('level', ''))

              return (
                <div
                  key={levelKey}
                  className='d-flex flex-column gap-4 progress-circular-container align-items-center'
                  style={
                    !isLevelAccessible(levelNumber)
                      ? { opacity: 0.6, pointerEvents: 'none' }
                      : {}
                  }
                >
                  <div style={{ position: 'relative' }}>
                    <CircularProgress
                      percentage={levelData?.percentage || 0}
                      level={levelNumber}
                    />
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
            {Object.keys(safeLevelProgress)
              .sort((a, b) => {
                const aNum = parseInt(a.replace('level', ''))
                const bNum = parseInt(b.replace('level', ''))
                return aNum - bNum
              })
              .map((levelKey, index) => {
                const levelData = safeLevelProgress[levelKey]
                const levelNumber = parseInt(levelKey.replace('level', ''))
                const levelLessons = lessonsByLevel[levelNumber - 1] || []

                return (
                  <div
                    key={levelKey}
                    className='accordion-item progress-details-accordion'
                  >
                    <h2
                      className='accordion-header'
                      id={`heading${levelNumber}`}
                    >
                      <button
                        className='accordion-button collapsed text-secondary fw-medium'
                        type='button'
                        onClick={(e) => handleAccordionClick(index, e)}
                        aria-expanded='false'
                        aria-controls={`collapse${levelNumber}`}
                      >
                        LEVEL {levelNumber} |{' '}
                        {levelData?.levelTitle || `Level ${levelNumber}`}
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
                          {lessonsLoading && !lessonsLoaded ? (
                            <div className='course-progress__modal-loading'>
                              Loading lessons...
                            </div>
                          ) : levelLessons.length > 0 ? (
                            levelLessons.map((lesson, lessonIndex) => {
                              if (
                                lesson.children &&
                                Array.isArray(lesson.children)
                              ) {
                                return (
                                  <React.Fragment
                                    key={`section-${lesson.id}-${lessonIndex}`}
                                  >
                                    <p className='mb-0'>{lesson.title}</p>
                                    {lesson.children.map(
                                      (childLesson, childIndex) => {
                                        const status = getCourseStatus(
                                          childLesson.id
                                        )
                                        return status === 'done' ? (
                                          <ProgressDone
                                            key={`lesson-${levelNumber}-${childLesson.id}-${childIndex}`}
                                            title={childLesson.title}
                                          />
                                        ) : status === 'inProgress' ? (
                                          <InProggresCourse
                                            key={`lesson-${levelNumber}-${childLesson.id}-${childIndex}`}
                                            title={childLesson.title}
                                          />
                                        ) : (
                                          <CourseNotStarted
                                            key={`lesson-${levelNumber}-${childLesson.id}-${childIndex}`}
                                            title={childLesson.title}
                                          />
                                        )
                                      }
                                    )}
                                  </React.Fragment>
                                )
                              }

                              const status = getCourseStatus(
                                lesson.id,
                                levelNumber === 1 ? levelLessons : null
                              )
                              return status === 'done' ? (
                                <ProgressDone
                                  key={`lesson-${levelNumber}-${lesson.id}-${lessonIndex}`}
                                  title={lesson.title}
                                />
                              ) : status === 'inProgress' ? (
                                <InProggresCourse
                                  key={`lesson-${levelNumber}-${lesson.id}-${lessonIndex}`}
                                  title={lesson.title}
                                />
                              ) : (
                                <CourseNotStarted
                                  key={`lesson-${levelNumber}-${lesson.id}-${lessonIndex}`}
                                  title={lesson.title}
                                />
                              )
                            })
                          ) : (
                            <div className='course-progress__modal-loading'>
                              No lessons available
                            </div>
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
