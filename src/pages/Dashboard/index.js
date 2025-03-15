import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

function Dashboard() {
  const originalToken = localStorage.getItem('original_access_token')
  const userRole = localStorage.getItem('role')
  const dispatch = useDispatch()
  const periods = useSelector((state) => state.dashboard.periods)
  const events = useSelector((state) => state.dashboard.events)
  const [chatId, setChatId] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState(null)

  useImpersonation(originalToken)

  useEffect(() => {
    dispatch(changeSidebarState(false))
  }, [dispatch])

  useEffect(() => {
    dispatch(getPeriodsStart())
    dispatch(getEventsStart())
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

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 pe-0 me-0'>
          <div className='account-page-padding d-flex justify-content-between align-items-center'>
            <h3 className='page-title bold-page-title'>
              <IntlMessages id='navigation.dashboard' />
            </h3>

            <div
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
        </div>

        <div className='d-grid academy-dashboard-layout'>
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
              <h3 className='page-title bold-page-title'>
                Course in Entrepreneurship
              </h3>
            </div>
            <AcademyBtn title={'Continue Course'} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
