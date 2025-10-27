import React, { useState, useRef, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPencilAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { toast } from 'react-toastify'
import 'react-circular-progressbar/dist/styles.css'
import './index.css'
// import userIcon from '../../assets/images/academy-icons/svg/user-icon.svg'
// import demographicsIcon from '../../assets/images/academy-icons/svg/demographics-icon.svg'
// import courseProgressIcon from '../../assets/images/academy-icons/svg/course-progress-icon.svg'
import CourseProgress from '../../CourseProgress/CourseProgress'
import spark from '../../../assets/images/academy-icons/svg/spark.svg'
import CircularProgress from '../../../components/ProgressBar'
// import CourseNotStarted from './CourseNotStarted'
// import InProggresCourse from './InProggresCourse'
// import ProgressDone from './ProgressDone'
import AcademyBtn from '../../AcademyBtn'
import viewPortfolio from '../../../assets/images/academy-icons/icon.core.portfolio.svg'
import graphUp from '../../../assets/images/graph-up.png'
import leftArrow from '../../../assets/images/academy-icons/left-arrow.png'
import progressLogo from '../../../assets/images/academy-icons/progress-details-logo.png'
import CourseNotStarted from '../../CourseProgress/CourseNotStarted'
import InProggresCourse from '../../CourseProgress/InProggresCourse'
import ProgressDone from '../../CourseProgress/ProgressDone'
import { Collapse } from 'bootstrap'

const ViewLearnerModal = ({ show, onHide, learner, onEdit }) => {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const accordionRefs = useRef([])

  // Dummy level progress data
  const levelProgress = {
    level1: { percentage: 75 },
    level2: { percentage: 45 },
    level3: { percentage: 20 }
  }

  // Dummy finished content IDs
  const finishedContent = [51, 52, 53, 54, 55, 56, 60, 61, 62, 70, 71, 72]

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
            title: 'Task #5: Identify a Problem Worth Solving, Assumptions, and Market Trends',
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
          }
        ]
      }
    ]
  }

  useEffect(() => {
    accordionRefs.current.forEach((ref) => {
      if (ref) {
        new Collapse(ref, { toggle: false })
      }
    })
  }, [showProgressModal])

  const handleAccordionClick = (index, event) => {
    event.preventDefault()
    const target = accordionRefs.current[index]
    if (target) {
      const bsCollapse = Collapse.getInstance(target) || new Collapse(target)
      bsCollapse.toggle()
    }
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

  if (!learner) return null

  const handleEditClick = () => {
    // Close the view modal
    onHide()
    // Trigger the edit action with a small delay to ensure smooth transition
    setTimeout(() => {
      onEdit(learner)
    }, 100)
  }

  const handleEmailLearner = () => {
    setShowEmailModal(true)
  }

  const handleCloseEmailModal = () => {
    setShowEmailModal(false)
    setEmailSubject('')
    setEmailMessage('')
  }

  const handleSendEmail = async () => {
    if (!emailSubject.trim()) {
      toast.error('Please enter a subject')
      return
    }

    if (!emailMessage.trim()) {
      toast.error('Please enter a message')
      return
    }

    setSendingEmail(true)

    try {
      // Simulate sending email
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Sending email to:', learner.email)
      console.log('Subject:', emailSubject)
      console.log('Message:', emailMessage)

      toast.success('Email sent successfully!')
      handleCloseEmailModal()
    } catch (error) {
      toast.error('Failed to send email')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleViewPortfolio = () => {
    console.log('View portfolio for:', learner.name)
  }

  const handleViewPerformanceData = () => {
    console.log('View performance data for:', learner.name)
  }

  const handleViewDetails = () => {
    setShowProgressModal(true)
  }

  const toggleProgressModal = () => {
    setShowProgressModal(!showProgressModal)
  }

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        backdrop={true}
        keyboard={true}
        className="view-learner-modal"
        centered
        size="md"
      >
        <div className="modal-content-wrapper-learner">
          {/* Header */}
          <div className="modal-header-view-learner">
            <div className="header-icon-learner">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2.59062 19.9916H17.1706C18.9302 19.9916 19.7612 19.4682 19.7612 18.3369C19.7612 15.4918 16.0035 11.4056 9.87623 11.4056C3.75774 11.4056 0 15.4918 0 18.3369C0 19.4682 0.831124 19.9916 2.59062 19.9916ZM2.15738 18.5817C1.72414 18.5817 1.56499 18.4719 1.56499 18.168C1.56499 16.2009 4.56233 12.824 9.87623 12.824C15.1989 12.824 18.1963 16.2009 18.1963 18.168C18.1963 18.4719 18.0371 18.5817 17.6039 18.5817H2.15738ZM9.89387 9.97045C12.573 9.97045 14.7303 7.71634 14.7303 4.92192C14.7303 2.17814 12.573 0 9.89387 0C7.2237 0 5.04863 2.21191 5.04863 4.9388C5.04863 7.72479 7.21484 9.97045 9.89387 9.97045ZM9.89387 8.56061C8.09904 8.56061 6.61362 6.97338 6.61362 4.9388C6.61362 2.96328 8.09019 1.40988 9.89387 1.40988C11.6976 1.40988 13.1654 2.93795 13.1654 4.92192C13.1654 6.95654 11.6888 8.56061 9.89387 8.56061Z" fill="black"/>
              </svg>
            </div>
            <h3 className="modal-title-view-learner">View Learner</h3>
            
            {/* Action Buttons */}
            <div className="header-actions">
              <div
                onClick={onHide}
                style={{ cursor: 'pointer' }}
                title="Go back"
              >
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M23.125 15H7.5M7.5 15L15 7.5M7.5 15L15 22.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              </div>

              <div
                onClick={handleEditClick}
                style={{ cursor: 'pointer' }}
                title="Edit learner"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M17.9539 7.06445L20.1575 4.86091C20.9385 4.07986 22.2049 4.07986 22.9859 4.86091L25.4608 7.33579C26.2418 8.11683 26.2418 9.38316 25.4608 10.1642L23.2572 12.3678M17.9539 7.06445L5.80585 19.2125C5.47378 19.5446 5.26915 19.983 5.22783 20.4508L4.88296 24.3546C4.82819 24.9746 5.34707 25.4935 5.96708 25.4387L9.87093 25.0939C10.3387 25.0525 10.7771 24.8479 11.1092 24.5158L23.2572 12.3678M17.9539 7.06445L23.2572 12.3678" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Learner Info Section */}
          <div className="learner-info-section">
            <div className="info-row">
              <div className="info-field">
                <label className="info-label">Learner Name</label>
                <p className="info-value">{learner.name}</p>
              </div>
            </div>

            <div className="d-flex gap-3">
              <div className="info-row-split w-100">
                <div className="info-field">
                  <label className="info-label">Email</label>
                  <p className="info-value">{learner.email}</p>
                </div>
              </div>

              <div className="info-row-split d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center justify-content-between w-100 gap-2">
                  <label className="info-label">STATUS</label>
                  <div className="d-flex gap-2">
                    <span className="status-indicator active"></span>
                    <span className="status-text">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="email-learner-btn" onClick={handleEmailLearner}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.83301 7.50032L9.99968 10.417L14.1663 7.50032" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.66699 13.8337V6.16699C1.66699 5.06242 2.56242 4.16699 3.66699 4.16699H16.3337C17.4382 4.16699 18.3337 5.06242 18.3337 6.16699V13.8337C18.3337 14.9382 17.4382 15.8337 16.3337 15.8337H3.66699C2.56242 15.8337 1.66699 14.9382 1.66699 13.8337Z" stroke="black" strokeWidth="1.5"/>
              </svg>
              EMAIL LEARNER
            </button>
          </div>

          {/* Demographics Section */}
          <div className="demographics-section">
            <div className="section-header-view">
              <img src={spark} alt="Demographics" />
              <span>Demographics</span>
            </div>

            <div className="demographics-content">
              <div className="demo-field full-width">
                <p className="demo-value">{learner.address || '125 N City Street'}</p>
              </div>

              <div className="demo-row">
                <div className="demo-field">
                  <p className="demo-value">{learner.city || 'Orlando'}</p>
                </div>
                <div className="demo-field">
                  <p className="demo-value">{learner.state || 'Florida'}</p>
                </div>
              </div>

              <div className="demo-row">
                <div className="info-row w-100">
                  <div className="info-field">
                    <label className="info-label">Learner Gender</label>
                    <p className="info-value">{learner.gender || 'Not Specified'}</p>
                  </div>
                </div>

                <div className="info-row w-100">
                  <div className="info-field">
                    <label className="info-label">Learner Age:</label>
                    <p className="info-value">{learner.age || 'Not Specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Progress Section */}
          <div className="course-progress-section">
            <div className="section-header-view-progress">
              <div className="header-left">
                <img src={spark} alt="Course Progress" />
                <span>Course Progress</span>
              </div>
              <button className="view-details-link" onClick={handleViewDetails}>
                View Details
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5.00033 10H15.417M15.417 10L10.417 5M15.417 10L10.417 15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="progress-circles-container">
              <div className='d-flex gap-4 align-items-center justify-content-around flex-col-mob mt-2rem-mob w-100'>
                <div className='d-flex flex-column gap-4'>
                  <CircularProgress
                    percentage={levelProgress?.level1?.percentage || 20}
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
          </div>

          {/* Action Buttons */}
          <div className="modal-actions-view-learner">
            <AcademyBtn 
              title={`View Portfolio`}
              icon={viewPortfolio}
              imageSide={true}
              onClick={handleViewPortfolio}
            />
            <AcademyBtn 
              title={`View Performance Data`}
              icon={graphUp}
              imageSide={true}
              onClick={handleViewPerformanceData}
            />
          </div>
        </div>
      </Modal>

      {/* Email Learner Modal */}
      <Modal
        show={showEmailModal}
        onHide={handleCloseEmailModal}
        backdrop={true}
        keyboard={true}
        className="email-learner-modal"
        centered
        size="md"
      >
        <div className="email-modal-content">
          {/* Back Button */}
          <div className="email-modal-back" onClick={handleCloseEmailModal}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
              <path d="M23.125 15H7.5M7.5 15L15 7.5M7.5 15L15 22.5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          {/* Header */}
          <div className="email-modal-header">
            <div className="email-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.83301 7.50032L9.99968 10.417L14.1663 7.50032" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1.66699 13.8337V6.16699C1.66699 5.06242 2.56242 4.16699 3.66699 4.16699H16.3337C17.4382 4.16699 18.3337 5.06242 18.3337 6.16699V13.8337C18.3337 14.9382 17.4382 15.8337 16.3337 15.8337H3.66699C2.56242 15.8337 1.66699 14.9382 1.66699 13.8337Z" stroke="black" stroke-width="1.5"/>
              </svg>
            </div>
            <h3 className="email-modal-title">Email Learner</h3>
          </div>

          {/* Email Form */}
          <div className="email-form">
            <input
              type="text"
              className="email-subject-input"
              placeholder="Subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              disabled={sendingEmail}
            />

            <textarea
              className="email-message-textarea"
              placeholder="Add message..."
              value={emailMessage}
              onChange={(e) => setEmailMessage(e.target.value)}
              disabled={sendingEmail}
              rows={8}
            />

            <button 
              className="email-send-btn"
              onClick={handleSendEmail}
              disabled={sendingEmail}
            >
              {sendingEmail ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                'SEND'
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Progress Details Modal */}
      <Modal
        show={showProgressModal}
        onHide={toggleProgressModal}
        className='certificate-modal'
        centered
        size="lg"
      >
        <span
          className='cursor-pointer'
          onClick={toggleProgressModal}
          style={{ zIndex: '1' }}
        >
          <img className='left-arrow-modal' src={leftArrow} alt='left' />
        </span>
        <Modal.Body>
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
                        {section.children?.map((lesson, lessonIndex) => {
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
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ViewLearnerModal