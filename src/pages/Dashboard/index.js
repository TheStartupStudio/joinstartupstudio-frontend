import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import AcademyLogo from '../../assets/images/academy-icons/svg/Startup-Studio-Logo.svg'
import profilePic from '../../assets/images/academy-icons/profile.jpeg'
import CourseProgress from '../../components/CourseProgress/CourseProgress'
import UserDetails from '../../components/UserDetails/UserDetails'
import useImpersonation from '../../hooks/useImpersonation'
import { changeSidebarState } from '../../redux'
import {
  closeTaskModal,
  getEventsStart,
  getPeriodsStart,
  openTaskModal
} from '../../redux/dashboard/Actions'
import IntlMessages from '../../utils/IntlMessages'
import AcademyBtn from '../../components/AcademyBtn'
import SelectLanguage from '../../components/SelectLanguage/SelectLanguage'
import { fetchLtsCoursefinishedContent } from '../../redux/course/Actions'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import { getAllPodcast, getGuidanceVideos, getMasterclassVideos } from '../../redux/podcast/Actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

function Dashboard() {
  const originalToken = localStorage.getItem('original_access_token')
  const userRole = localStorage.getItem('role')
  const dispatch = useDispatch()
  const history = useHistory()
  const periods = useSelector((state) => state.dashboard.periods)
  const events = useSelector((state) => state.dashboard.events)
  const [chatId, setChatId] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const user = useSelector((state) => state.user.user.user)
  
  // Trial countdown states
  const [trialTimeRemaining, setTrialTimeRemaining] = useState(null)
  const [isTrialActive, setIsTrialActive] = useState(false)

  const { finishedContent, levelProgress, loading, totalProgress } =
    useSelector((state) => state.course)

  useImpersonation(originalToken)

  useEffect(() => {
    // Only show trial countdown if trial has started and user is not exempt and not subscribed
    if (!user?.trialStart || user?.subscription_exempt || user?.stripe_subscription_id) return

    const calculateTrialTime = () => {
      const userCreatedDate = new Date(user.createdAt)
      const trialEndDate = new Date(userCreatedDate)
      trialEndDate.setDate(trialEndDate.getDate() + 14)
      
      const now = new Date()
      const timeRemaining = trialEndDate - now

      if (timeRemaining > 0) {
        setIsTrialActive(true)
        
        const totalSeconds = Math.floor(timeRemaining / 1000)
        const totalMinutes = Math.floor(totalSeconds / 60)
        const totalHours = Math.floor(totalMinutes / 60)
        const days = Math.floor(totalHours / 24)
        
        const hours = totalHours % 24
        const minutes = totalMinutes % 60
        const seconds = totalSeconds % 60

        setTrialTimeRemaining({ days, hours, minutes, seconds })
      } else {
        setIsTrialActive(false)
        setTrialTimeRemaining(null)
      }
    }

    calculateTrialTime()

    const interval = setInterval(calculateTrialTime, 1000)

    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    dispatch(getPeriodsStart())
    dispatch(getEventsStart())
    dispatch(fetchLtsCoursefinishedContent())
    dispatch(changeSidebarState(false))
  }, [dispatch])

  function getFormattedDate() {
    const today = new Date()
    const year = today.getFullYear().toString()
    let month = (today.getMonth() + 1).toString().padStart(2, '0')
    let day = today.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const taskEventModal = useSelector(
    (state) => state.dashboard.addTaskEventModal
  )
  const openTaskEventModal = () => {
    dispatch(openTaskModal('create'))
  }

  const closeTaskEventModal = () => {
    dispatch(closeTaskModal('create'))
  }

  const options = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' }
  ]

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption)
  }

  const handleContinueCourse = async () => {
    try {
      await dispatch(fetchLtsCoursefinishedContent());
      
      if (finishedContent && finishedContent.length > 0) {
        const lastCompletedId = Math.max(...finishedContent);
        let nextLessonId = lastCompletedId;
        let targetLevel;
        
        if (lastCompletedId >= 70) {
          targetLevel = 2;
        } else if (lastCompletedId >= 60) {
          targetLevel = 1;
        } else {
          targetLevel = 0;
        }
        
        localStorage.setItem('selectedLesson', JSON.stringify({
          activeLevel: targetLevel,
          nextId: lastCompletedId,
          lessonTitle: "Continue where you left off",
          currentPlaceholder: "Continue where you left off"
        }));
        
        history.push({
          pathname: `/my-course-in-entrepreneurship/journal/${lastCompletedId}`,
          state: {
            activeLevel: targetLevel,
            currentPlaceholder: "Continue where you left off"
          }
        });
      } else {
        localStorage.setItem('selectedLesson', JSON.stringify({
          activeLevel: 0,
          nextId: 51,
          lessonTitle: "The Myths of Entrepreneurship",
          currentPlaceholder: "The Myths of Entrepreneurship"
        }));
        
        history.push({
          pathname: '/my-course-in-entrepreneurship/journal/51',
          state: {
            activeLevel: 0,
            currentPlaceholder: "The Myths of Entrepreneurship"
          }
        });
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        {/* Trial Countdown Banner */}
          {isTrialActive && trialTimeRemaining && (
            <div 
              className=' mb-1rem-tab'
              style={{
                background: 'linear-gradient(180deg, var(--COLORS-Light-Blue, #B9DFEC) 0%, var(--COLORS-White, #FFF) 100%)',
                padding: '10px',
                minHeight: '4rem',

              }}
            >
              <div className='d-flex align-items-center justify-content-center flex-wrap gap-4 text-center' 
              style={{
                  color: '#000',
                  fontFamily: 'Montserrat',
                  fontSize: '1.25rem',
                  fontStyle: 'normal',
                  fontWeight: 500,
                }}>

                <div>
                  TIME REMAINING IN TRIAL PERIOD:
                </div>
                
                <div className='d-flex gap-2 align-items-center flex-wrap'>
                  {trialTimeRemaining.days > 0 && (
                      <div>
                        {trialTimeRemaining.days}
                      </div>
                  )}

                    <div>:</div>
                  
                    <div>
                      {String(trialTimeRemaining.hours).padStart(2, '0')}
                    </div>

                    <div>:</div>
                
                    <div>
                      {String(trialTimeRemaining.minutes).padStart(2, '0')}
                    </div>

                    <div>:</div>
          
                    <div>
                      {String(trialTimeRemaining.seconds).padStart(2, '0')}
                    </div>
                   
                </div>
              </div>
            </div>
          )}
        <div className='col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
          <div className='account-page-padding d-flex justify-content-between align-items-center flex-col-tab align-start-tab'>
            <h3 className='page-title bold-page-title text-black'>
              <IntlMessages id='navigation.dashboard' />
            </h3>
          </div>
          <img
            src={MenuIcon}
            alt='menu'
            className='menu-icon-cie self-start-tab cursor-pointer'
            onClick={() => dispatch(toggleCollapse())}
          />
        </div>

        <div className='d-grid academy-new-dashboard-layout bck-dashboard'>
          <UserDetails
            profilePic={profilePic}
            userName={'Kenia Anders'}
            userProffesion={'Graphic Designer'}
          />

          <CourseProgress />

          <div className='academy-dashboard-card academy-dashboard-bottom d-flex align-items-center justify-content-between flex-col-mob mb-1rem-tab gap-1rem-mob '>
            <div className='d-flex align-items-center gap-3 flex-col-mob'>
              <div className='d-flex gap-1'>
                <img src={AcademyLogo} alt='logo' style={{ width: '150px' }} />
              </div>
              <h3 className='page-title bold-page-title text-black mb-0 text-center-mob'>
                Course in Entrepreneurship
              </h3>
            </div>
            <AcademyBtn
              title={'Continue Course'}
              onClick={handleContinueCourse}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard