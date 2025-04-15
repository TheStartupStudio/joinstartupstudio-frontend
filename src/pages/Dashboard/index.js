import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import AcademyLogo from '../../assets/images/academy-icons/academy-logo.png'
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
import { fetchLtsCoursefinishedContent } from '../../redux/course/Actions';

function Dashboard() {
  const originalToken = localStorage.getItem('original_access_token')
  const userRole = localStorage.getItem('role')
  const dispatch = useDispatch()
  const history = useHistory()
  const periods = useSelector((state) => state.dashboard.periods)
  const events = useSelector((state) => state.dashboard.events)
  const [chatId, setChatId] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  const { finishedContent, levelProgress, loading, totalProgress } = useSelector(
    (state) => state.course
  );

  useImpersonation(originalToken)

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
    console.log('Selected Language:', selectedOption.value)
  }

  const handleContinueCourse = () => {
    if (finishedContent && finishedContent.length > 0) {
      // Get the last completed ID
      const lastCompletedId = Math.max(...finishedContent);
      // Navigate to the next lesson
      history.push(`/my-course-in-entrepreneurship/journal/${lastCompletedId}`);
    } else {
      // If no lessons completed, start from the first lesson (ID: 51)
      history.push('/my-course-in-entrepreneurship/journal/51');
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 pe-0 me-0'>
          <div className='account-page-padding d-flex justify-content-between align-items-center '>
            <h3 className='page-title bold-page-title text-black'>
              <IntlMessages id='navigation.dashboard' />
            </h3>

            <SelectLanguage />
          </div>
        </div>

        <div className='d-grid academy-dashboard-layout bck-dashboard'>
          <UserDetails
            profilePic={profilePic}
            userName={'Kenia Anders'}
            userProffesion={'Graphic Designer'}
          />

          <CourseProgress />

          <div className='academy-dashboard-card academy-dashboard-bottom d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center gap-3'>
              <div className='d-flex gap-1'>
                <img src={AcademyLogo} alt='logo' style={{ width: '3rem' }} />
                <div>
                  <h4 className='academy-header'>
                    <span className='header-title'>THE</span>
                    <br />
                    STARTUP
                    <br />
                    STUDIO
                  </h4>
                  <p className='powered' style={{ marginBottom: 0 }}>
                    Powered by Learn to Start
                  </p>
                </div>
              </div>
              <h3 className='page-title bold-page-title text-black mb-0'>
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
