import { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom' // Change useNavigate to useHistory
import AboutMe from '../../components/AcademyPortfolio/AboutMe'
import SelectLanguage from '../../components/SelectLanguage/SelectLanguage'
import IntlMessages from '../../utils/IntlMessages'
import EducationPortfolio from '../../components/AcademyPortfolio/EducationPortfolio'
import ExperiencePortfolio from '../../components/AcademyPortfolio/ExperiencePortfolio'
import MarketProjects from '../../components/AcademyPortfolio/MarketProjects'
import { useDispatch, useSelector } from 'react-redux'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import AcademyBtn from '../../components/AcademyBtn'
import StartupStudioLogo from './../../../public/academy-logo.png'

function AcademyPortfolio() {
  const [activeTab, setActiveTab] = useState(0)
  const [publicPortfolio, setPublicPortfolio] = useState(null)
  const dispatch = useDispatch()
  const { username } = useParams()
  const history = useHistory()
  
  const user = useSelector((state) => state.user?.user?.user) || null
  const isPublicRoute = window.location.pathname.startsWith('/public-portfolio')

  // Only redirect if user is viewing their own portfolio and is authenticated
  useEffect(() => {
    if (user && username === user?.username) {
      history.push('/my-portfolio')
      return
    }
  }, [username, user?.username, history])

  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        const response = await axiosInstance.get(
          `/public-portfolio/${username}`
        )

        const transformedUser = {
          ...response.data.user,
          username: username,
          social_links: {
            ...response.data.user.social_links,
          }
        }
        setPublicPortfolio({
          ...response.data,
          user: transformedUser
        })
      } catch (error) {
        console.error('Error fetching public portfolio:', error)
        // Show error toast
        toast.error("Portfolio not found")
        // Redirect to home page
        history.push('/')
      }
    }

    // Allow fetching public portfolio even when user is not logged in
    if (username && (isPublicRoute || username !== user?.username)) {
      fetchPublicPortfolio()
    }
  }, [username, user?.username, history])

  const isUserPortfolio = window.location.pathname.startsWith('/my-portfolio')

  const tabs = ['Education', 'Experience', 'Market-Ready Projects']


  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <EducationPortfolio educationData={publicPortfolio?.education?.data} isUserPortfolio={isUserPortfolio} />
      case 1:
        return <ExperiencePortfolio experienceData={publicPortfolio?.work?.data} isUserPortfolio={isUserPortfolio} />
      case 2:
        return <MarketProjects projectsData={publicPortfolio?.projects?.data} isUserPortfolio={isUserPortfolio} />
      default:
        return null
    }
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
          <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab gap-3'>
            <div className='d-flex align-items-center gap-3'>
               {!user && (
              <a href='https://academy.learntostart.com/'>
                      <img
                        src={StartupStudioLogo}
                        alt='course-logo'
                        style={{ width: '80px', objectFit: 'contain' }}
                      />
                    </a>
              )}
              <div className='d-flex flex-column gap-1'>
              <h3 className='page-title bold-page-title text-black mb-0'>
                <IntlMessages id='portfolio.header' />
              </h3>
              <p className='fs-13 fw-light text-black'>
                <IntlMessages id='portfolio.content' />
              </p>
              </div>
            </div>

            {/* <div>
              {!user && (
                <AcademyBtn 
                  title='Login'
                  onClick = {() => history.push('/')}
                />
              )}
            </div> */}

          </div>
          {user && (
            <img
              src={MenuIcon}
              alt='menu'
              className='menu-icon-cie self-start-tab cursor-pointer'
              onClick={() => dispatch(toggleCollapse())}
            />
          )}
        </div>
        <div className='academy-dashboard-layout lead-class mb-5 bck-dashboard'>
          <AboutMe 
            user={publicPortfolio?.user || user || {}} // Provide empty object as fallback
            portfolioData={publicPortfolio?.portfolio || {}} // Provide empty object as fallback
          />

          <div className='course-experts d-flex justify-content-between mt-5 flex-col-mob align-items-center-mob'>
            {tabs.map((tab, index) => (
              <span
                key={tab}
                className={`fs-14 fw-medium col-4 text-center p-2 cursor-pointer w-100-mob ${
                  activeTab === index ? 'active-course' : ''
                }`}
                onClick={() => setActiveTab(index)}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className='mt-3'>{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}

export default AcademyPortfolio
