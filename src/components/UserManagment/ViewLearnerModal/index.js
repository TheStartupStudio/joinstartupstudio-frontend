import React, { useState, useRef, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faPencilAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import { toast } from 'react-toastify'
import 'react-circular-progressbar/dist/styles.css'
import './index.css'
import CourseProgress from '../../CourseProgress/CourseProgress'
import spark from '../../../assets/images/academy-icons/svg/spark.svg'
import CircularProgress from '../../../components/ProgressBar'
import AcademyBtn from '../../AcademyBtn'
import viewPortfolio from '../../../assets/images/academy-icons/icon.core.portfolio.svg'
import graphUp from '../../../assets/images/graph-up.png'
import leftArrow from '../../../assets/images/academy-icons/left-arrow.png'
import progressLogo from '../../../assets/images/academy-icons/progress-details-logo.png'
import CourseNotStarted from '../../CourseProgress/CourseNotStarted'
import InProggresCourse from '../../CourseProgress/InProggresCourse'
import ProgressDone from '../../CourseProgress/ProgressDone'
import { Collapse } from 'bootstrap'
import axiosInstance from '../../../utils/AxiosInstance'
import lockSign from '../../../assets/images/academy-icons/lock.png'

const ViewLearnerModal = ({ show, onHide, learner, onEdit }) => {
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const accordionRefs = useRef([])

  const [learnerData, setLearnerData] = useState(null)
  const [levelProgress, setLevelProgress] = useState({
    level1: { percentage: 0, completed: 0, total: 8 },
    level2: { percentage: 0, completed: 0, total: 8 },
    level3: { percentage: 0, completed: 0, total: 52 }
  })
  const [finishedContent, setFinishedContent] = useState([])
  const [loading, setLoading] = useState(false)
  const [lessonsByLevel, setLessonsByLevel] = useState({})
  const [lessonsLoading, setLessonsLoading] = useState(true)

  useEffect(() => {
    if (show && learner?.id) {
      fetchLearnerData()
      fetchLevelProgress()
      fetchLessons()
    }
  }, [show, learner?.id])

  const fetchLearnerData = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/super-admin/learners/${learner.id}`)
      setLearnerData(response.data.data)
    } catch (error) {
      console.error('Error fetching learner data:', error)
      toast.error('Failed to load learner data')
    } finally {
      setLoading(false)
    }
  }

  const fetchLevelProgress = async () => {
  try {
    const response = await axiosInstance.get(`/super-admin/user-level-progress/${learner.id}`)
    const progressData = response.data

    setFinishedContent(progressData.finishedContent || [])
    setLevelProgress({
      level1: progressData.levelProgress?.level1 || { percentage: 0, completed: 0, total: 8 },
      level2: progressData.levelProgress?.level2 || { percentage: 0, completed: 0, total: 8 },
      level3: progressData.levelProgress?.level3 || { percentage: 0, completed: 0, total: 52 }
    })

  } catch (error) {
    console.error('Error fetching level progress:', error)
    toast.error('Failed to load progress data')
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

  if (!learner) return null

  const displayData = learnerData || learner

  const handleEditClick = () => {
    onHide()
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
      await axiosInstance.post(`/super-admin/send-email/${learner.id}`, {
        subject: emailSubject,
        message: emailMessage
      })

      toast.success('Email sent successfully!')
      handleCloseEmailModal()
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email')
    } finally {
      setSendingEmail(false)
    }
  }

  const handleViewPortfolio = () => {
    window.open(`/user-portfolio/${displayData.username || learner.id}`, '_blank')
  }

  const handleViewPerformanceData = () => {
    window.open(`/performance-data/${learner.id}`, '_blank')
  }

  const handleViewDetails = () => {
    setShowProgressModal(true)
  }

  const toggleProgressModal = () => {
    setShowProgressModal(!showProgressModal)
  }

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return 'Not Specified'
    
    const birthDate = new Date(birthDateString)
    const today = new Date()
    
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const getRoleBasedTitle = () => {
    const role = displayData?.role_id || learner?.role_id
    switch(role) {
      case 1:
        return 'Learner'
      case 2:
        return 'Client'
      case 3:
        return 'Admin'
      default:
        return 'User'
    }
  }

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Modal>
    )
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
            <h3 className="modal-title-view-learner">View {getRoleBasedTitle()}</h3>
            
            {/* Action Buttons */}
            <div className="header-actions">
              <div onClick={onHide} style={{ cursor: 'pointer' }} title="Go back">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <path d="M23.125 15H7.5M7.5 15L15 7.5M7.5 15L15 22.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div onClick={handleEditClick} style={{ cursor: 'pointer' }} title={`Edit ${getRoleBasedTitle().toLowerCase()}`}>
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
                <label className="info-label">{getRoleBasedTitle()} Name</label>
                <p className="info-value">{displayData.name}</p>
              </div>
            </div>

            <div className="d-flex gap-3">
              <div className="info-row-split w-100">
                <div className="info-field">
                  <label className="info-label">Email</label>
                  <p className="info-value">{displayData.email}</p>
                </div>
              </div>

              <div className="info-row-split d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center justify-content-between w-100 gap-2">
                  <label className="info-label">STATUS</label>
                  <div className="d-flex gap-2">
                    <span className={`status-indicator ${displayData.activeStatus ? 'active' : 'inactive'}`}></span>
                    <span className="status-text">{displayData.activeStatus ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="email-learner-btn" onClick={handleEmailLearner}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.83301 7.50032L9.99968 10.417L14.1663 7.50032" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M1.66699 13.8337V6.16699C1.66699 5.06242 2.56242 4.16699 3.66699 4.16699H16.3337C17.4382 4.16699 18.3337 5.06242 18.3337 6.16699V13.8337C18.3337 14.9382 17.4382 15.8337 16.3337 15.8337H3.66699C2.56242 15.8337 1.66699 14.9382 1.66699 13.8337Z" stroke="black" strokeWidth="1.5"/>
              </svg>
              EMAIL {getRoleBasedTitle().toUpperCase()}
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
                <p className="demo-value">{displayData.address || 'Not Specified'}</p>
              </div>

              <div className="demo-row">
                <div className="demo-field">
                  <p className="demo-value">{displayData.city || 'Not Specified'}</p>
                </div>
                <div className="demo-field">
                  <p className="demo-value">{displayData.state || 'Not Specified'}</p>
                </div>
              </div>

              <div className="demo-row">
                <div className="info-row w-100">
                  <div className="info-field">
                    <label className="info-label">Learner Gender</label>
                    <p className="info-value">{displayData.gender || 'Not Specified'}</p>
                  </div>
                </div>

                <div className="info-row w-100">
                  <div className="info-field">
                    <label className="info-label">Learner Age:</label>
                    <p className="info-value">{calculateAge(displayData.birthDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* My Studio Progress Section */}
          <div className="course-progress-section">
            <div className="section-header-view-progress">
              <div className="header-left">
                <img src={spark} alt="My Studio Progress" />
                <span>My Studio Progress</span>
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

      {/* Email Learner Modal - unchanged */}
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
            <h3 className="email-modal-title">Email {getRoleBasedTitle()}</h3>
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

      {/* Progress Details Modal - updated with dynamic data */}
      <Modal
        show={showProgressModal}
        onHide={toggleProgressModal}
        // className='certificate-modal'
        centered
        size="lg"
        backdrop={false}
      >
        <span className='cursor-pointer' onClick={toggleProgressModal} style={{ zIndex: '1' }}>
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
            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header' id='headingOne'>
                <button
                  className='accordion-button collapsed text-secondary fw-medium'
                  type='button'
                  onClick={(e) => handleAccordionClick(0, e)}
                  aria-expanded='false'
                  aria-controls='collapseOne'
                >
                  LEVEL 1 | The Myths of Entrepreneurship ({levelProgress.level1.completed}/{levelProgress.level1.total})
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

            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header' id='headingTwo'>
                <button
                  className='accordion-button collapsed text-secondary fw-medium'
                  type='button'
                  onClick={(e) => handleAccordionClick(1, e)}
                  aria-expanded='false'
                  aria-controls='collapseTwo'
                >
                  LEVEL 2 | Understanding Learn to Start ({levelProgress.level2.completed}/{levelProgress.level2.total})
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
                        const status = getCourseStatus(lesson.id, lessonsByLevel[1])
                        if (!isLevelAccessible(1)) {
                          // Level is locked, show all lessons as locked
                          return (
                            <div key={`lesson-1-${lesson.id}-${index}`} style={{ position: 'relative', opacity: 0.6 }}>
                              <CourseNotStarted title={lesson.title} />
                            
                            </div>
                          )
                        }
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

            <div className='accordion-item progress-details-accordion'>
              <h2 className='accordion-header' id='headingThree'>
                <button
                  className='accordion-button collapsed text-secondary fw-medium'
                  type='button'
                  onClick={(e) => handleAccordionClick(2, e)}
                  aria-expanded='false'
                  aria-controls='collapseThree'
                >
                  LEVEL 3 | The LEARN Stage ({levelProgress.level3.completed}/{levelProgress.level3.total})
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
                      (() => {
                        // Flatten level 2 lessons for status calculation
                        const allLevel2Lessons = lessonsByLevel[2].flatMap(section =>
                          section.children ? section.children : []
                        )

                        return lessonsByLevel[2].map((section, sectionIndex) => (
                          <React.Fragment key={`section-${section.id}-${sectionIndex}`}>
                            <p className='mb-0'>{section.title}</p>
                            {section.children && section.children.map((lesson, lessonIndex) => {
                              const status = getCourseStatus(lesson.id, allLevel2Lessons)
                              if (!isLevelAccessible(2)) {
                                // Level is locked, show all lessons as locked
                                return (
                                  <div key={`lesson-2-${lesson.id}-${lessonIndex}`} style={{ position: 'relative', opacity: 0.6 }}>
                                    <CourseNotStarted title={lesson.title} />
                                    
                                  </div>
                                )
                              }
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
                      })()
                    ) : (
                      <div className='text-center text-secondary'>No lessons available</div>
                    )}
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