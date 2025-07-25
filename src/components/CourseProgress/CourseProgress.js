import React, { useEffect, useRef, useState } from 'react'
import { Modal, ModalBody } from 'reactstrap'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import progressLogo from '../../assets/images/academy-icons/progress-details-logo.png'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import CircularProgress from '../../components/ProgressBar'
import CourseNotStarted from './CourseNotStarted'
import InProggresCourse from './InProggresCourse'
import ProgressDone from './ProgressDone'
import { useDispatch, useSelector } from 'react-redux'
import { Collapse } from 'bootstrap'

function CourseProgress() {
  const [modal, setModal] = useState(false)
  const dispatch = useDispatch()
  const { finishedContent, levelProgress, loading } = useSelector(
    (state) => state.course
  )

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

  const lessonsByLevel = {
    0: [
      {
        id: 'myths',
        title: 'Myths of Entrepreneurship',
        status: 'done',
        redirectId: 51
      },
      {
        id: 'definition',
        title: 'Definition of Entrepreneurship',
        status: 'done',
        redirectId: 52
      },
      {
        id: 'reasons',
        title: 'Reasons Why Startups Fail',
        status: 'inProgress',
        redirectId: 53
      },
      {
        id: 'skills',
        title: 'Skills and Traits of Effective Entrepreneurs',
        status: 'notStarted',
        redirectId: 54
      },
      {
        id: 'people',
        title: 'People Buy Into People',
        status: 'notStarted',
        redirectId: 55
      },
      {
        id: 'selfBrand',
        title: 'Creating Your Self Brand First',
        status: 'notStarted',
        redirectId: 56
      },
      {
        id: 'task1',
        title: 'Task #1: Create your Individual Value Proposition',
        status: 'notStarted',
        redirectId: 57
      },
      {
        id: 'task2',
        title: 'Task #2: Create your I Am Video',
        status: 'notStarted',
        redirectId: 58
      }
    ],
    1: [
      {
        id: 'journey',
        title: 'The Journey of Entrepreneurship',
        status: 'notStarted',
        redirectId: 60
      },
      {
        id: 'intro',
        title: 'An Introduction to the LTS Model and Four Environments',
        status: 'notStarted',
        redirectId: 61
      },
      {
        id: 'coreSkills',
        title: 'The Core Skills and LEARN Stage of the LTS Model',
        status: 'notStarted',
        redirectId: 62
      },
      {
        id: 'develop',
        title: 'The DEVELOP Stage of the LTS Model',
        status: 'notStarted',
        redirectId: 63
      },
      {
        id: 'start',
        title: 'Understanding START & the Test Metrics of LTS',
        status: 'notStarted',
        redirectId: 65
      },
      {
        id: 'task3',
        title: 'Task #1: Evaluate Your Mindset and Skill Set',
        status: 'notStarted',
        redirectId: 66
      },
      {
        id: 'process',
        title: 'The Process of Entrepreneurship',
        status: 'notStarted',
        redirectId: 67
      },
      {
        id: 'task4',
        title: 'Task #2: Build Your Team and Find Your Mentor',
        status: 'notStarted',
        redirectId: 68
      }
    ],
    2: [
      {
        id: '3.1',
        title: 'Level 3.1: The Journey of Entrepreneurship',
        isParent: true,
        children: [
          {
            id: 'journey31',
            title: 'The Journey of Entrepreneurship',
            status: 'notStarted',
            redirectId: 70
          },
          {
            id: 'process31',
            title: 'The Process and Skill of Storytelling',
            redirectId: 71
          },
          { id: 'relevancy', title: 'Relevancy in World 4.0', redirectId: 72 },
          { id: 'learn', title: 'The LEARN Stage', redirectId: 73 },
          { id: 'problems', title: 'Problems Worth Solving', redirectId: 74 },
          {
            id: 'task5',
            title:
              'Task #5: Identify a Problem Worth Solving, Assumptions, and Market Trends',
            redirectId: 75
          },
          {
            id: 'task6',
            title: 'Task #6: Conduct an Industry Analysis',
            redirectId: 76
          }
        ]
      },
      {
        id: '3.2',
        title: 'Level 3.2: The Develop Stage',
        isParent: true,
        children: [
          { id: 'solution', title: 'Finding the Solution', redirectId: 78 },
          {
            id: 'value',
            title: "Creating Your Startup's Value Proposition",
            redirectId: 79
          },
          {
            id: 'task7',
            title: "Task #7: Create Your Startup's Value Proposition",
            redirectId: 80
          },
          {
            id: 'testing',
            title: "Testing Your Startup's Value Proposition",
            redirectId: 81
          },
          {
            id: 'task8',
            title:
              "Task #8: Conduct Market Validation for Your Startup's Value Proposition",
            redirectId: 82
          },
          {
            id: 'inovation',
            title: 'Understanding Innovation and Its Enemies',
            redirectId: 85
          },
          {
            id: 'skills',
            title: 'The Five Skills of Innovation',
            redirectId: 86
          },
          { id: 'develop', title: 'The DEVELOP Stage', redirectId: 87 },
          {
            id: 'task9',
            title: "Task #9: Develop Your Startup's Business Model",
            redirectId: 88
          },
          {
            id: 'task10',
            title: "Task #10: Write Your Startup's Concept Plan",
            redirectId: 89
          }
        ]
      },
      {
        id: '3.3',
        title: 'Level 3.3: The Develop Stage',
        isParent: true,
        children: [
          { id: 'brand', title: 'Definition of Brand', redirectId: 91 },
          { id: 'branding', title: 'Branding Strategies', redirectId: 92 },
          {
            id: 'relation',
            title: 'The Relationship Between Story and Brand',
            redirectId: 93
          },
          {
            id: 'charter',
            title:
              "The Brand Charter&Task #11: Creating Your Startup's Brand Charter",
            redirectId: 94
          },
          { id: 'vehicles', title: 'The Brand Vehicles', redirectId: 95 },
          {
            id: 'task12',
            title: "Task #12: Create Your Startup's Brand Vehicles",
            redirectId: 96
          },
          {
            id: 'fundamental',
            title: 'The Fundamental Elements of Story',
            redirectId: 97
          },
          {
            id: 'bussines',
            title: 'Stories Your Business Can Tell',
            redirectId: 98
          },
          {
            id: 'storyteller',
            title: 'Embracing Your Inner Storyteller',
            redirectId: 99
          },
          {
            id: 'task13',
            title: 'Task #13: Conduct Focus Groups',
            redirectId: 100
          },
          { id: 'marketing', title: 'The Marketing Plan', redirectId: 101 },
          {
            id: 'task14',
            title: "Task #14: Creating Your Startup's Marketing Plan",
            redirectId: 102
          }
        ]
      },
      {
        id: '3.4',
        title: 'Level 3.4: The Start Stage',
        isParent: true,
        children: [
          {
            id: 'brand',
            title: 'Introduction to the Business Plan',
            redirectId: 104
          },
          {
            id: 'branding',
            title: 'The Business Development Management Map',
            redirectId: 105
          },
          {
            id: 'relation',
            title:
              "Task #15: Create Your Startup's Business Development Management Map",
            redirectId: 106
          },
          {
            id: 'charter',
            title: 'The Test Metric of Sustainability',
            redirectId: 107
          },
          {
            id: 'creating',
            title: 'Task #16: Test The Sustainability of Your Startup',
            redirectId: 108
          },
          {
            id: 'vehicles',
            title: 'The Process of Entrepreneurship Reintroduction',
            redirectId: 109
          },
          { id: 'task12', title: 'Parts of a Business Plan', redirectId: 110 },
          {
            id: 'fundamental',
            title: "Task #17: Write Your Startup's Business Plan",
            redirectId: 111
          },
          {
            id: 'bussines',
            title: 'The Test Metric of Efficiency',
            redirectId: 112
          },
          {
            id: 'storyteller',
            title: 'Task #18: Test the Efficiency of Your Startup',
            redirectId: 113
          },
          {
            id: 'task13',
            title: 'An Introduction to the Financial Plan',
            redirectId: 114
          },
          {
            id: 'marketing',
            title: "Task #19: Create Your Startup's Financial Plan",
            redirectId: 115
          },
          {
            id: 'task14',
            title: 'The Test Metric of Profitability',
            redirectId: 116
          },
          {
            id: 'profitability',
            title: 'Task #20: Test the Potential Profitability of Your Startup',
            redirectId: 117
          },
          { id: 'generation', title: 'Brand Generation', redirectId: 118 },
          { id: 'plan', title: 'Business Plan Musts', redirectId: 119 },
          {
            id: 'executive',
            title:
              "Task #21: Write the Executive Summary of Your Startup's Business",
            redirectId: 120
          },
          {
            id: 'introductory',
            title: "Task #22: Create Your Startup's Brand Introductory Video",
            redirectId: 121
          },
          { id: 'selling', title: 'Selling You', redirectId: 122 },
          { id: 'pitching', title: 'Pitching Yourself', redirectId: 123 },
          {
            id: 'reminders',
            title: 'Reminders Going Forwards',
            redirectId: 124
          },
          {
            id: 'final',
            title: 'Task #23: Create Your Final I Am Video',
            redirectId: 125
          },
          {
            id: 'task24',
            title: "Task #24: Build Your Startup's Final Pitch",
            redirectId: 126
          }
        ]
      }
    ]
  }

  const getCourseStatus = (redirectId) => {
    if (finishedContent.includes(redirectId)) {
      return 'done'
    }

    const nextAvailableId =
      finishedContent.length > 0
        ? Math.min(...finishedContent.map((id) => id + 1))
        : 51

    if (redirectId === nextAvailableId) {
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
            <h4 className='fs-9 my-details-header'>Course Progress</h4>
          </div>
          <div
            className='progress-details cursor-pointer'
            onClick={toggleModal}
          >
            <span>Progress Details</span>
            <img src={rightArrow} alt='right-arr' />
          </div>
        </div>
        <div className='d-flex gap-4 align-items-center justify-content-around flex-col-mob mt-2rem-mob'>
          <div className='d-flex flex-column gap-4'>
            <CircularProgress
              percentage={levelProgress?.level1?.percentage || 0}
              level={1}
            />
            <p className='text-center'>
              Entrepreneurship <br /> & You
            </p>
          </div>
          <div className='d-flex flex-column gap-4'>
            <CircularProgress
              percentage={levelProgress?.level2?.percentage || 0}
              level={2}
            />
            <p className='text-center'>
              Understanding <br /> Learn to Start
            </p>
          </div>
          <div className='d-flex flex-column gap-4'>
            <CircularProgress
              percentage={levelProgress?.level3?.percentage || 0}
              level={3}
            />
            <p className='text-center'>
              The Journey of <br /> Entrepreneurship
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
                    {lessonsByLevel[0].map((lesson, index) => {
                      const status = getCourseStatus(lesson.redirectId)
                      return status === 'done' ? (
                        <ProgressDone key={`lesson-0-${lesson.id}-${index}`} title={lesson.title} />
                      ) : status === 'inProgress' ? (
                        <InProggresCourse key={`lesson-0-${lesson.id}-${index}`} title={lesson.title} />
                      ) : (
                        <CourseNotStarted key={`lesson-0-${lesson.id}-${index}`} title={lesson.title} />
                      )
                    })}
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
                    {lessonsByLevel[1].map((lesson, index) => {
                      const status = getCourseStatus(lesson.redirectId)
                      return status === 'done' ? (
                        <ProgressDone key={`lesson-1-${lesson.id}-${index}`} title={lesson.title} />
                      ) : status === 'inProgress' ? (
                        <InProggresCourse key={`lesson-1-${lesson.id}-${index}`} title={lesson.title} />
                      ) : (
                        <CourseNotStarted key={`lesson-1-${lesson.id}-${index}`} title={lesson.title} />
                      )
                    })}
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
                    {lessonsByLevel[2].map((section, sectionIndex) => (
                      <React.Fragment key={`section-${section.id}-${sectionIndex}`}>
                        <p className='mb-0'>{section.title}</p>
                        {section.children.map((lesson, lessonIndex) => {
                          const status = getCourseStatus(lesson.redirectId)
                          return status === 'done' ? (
                            <ProgressDone key={`lesson-2-${lesson.id}-${lessonIndex}`} title={lesson.title} />
                          ) : status === 'inProgress' ? (
                            <InProggresCourse key={`lesson-2-${lesson.id}-${lessonIndex}`} title={lesson.title} />
                          ) : (
                            <CourseNotStarted key={`lesson-2-${lesson.id}-${lessonIndex}`} title={lesson.title} />
                          )
                        })}
                      </React.Fragment>
                    ))}
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
