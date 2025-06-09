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

function AcademyPortfolio() {
  const [activeTab, setActiveTab] = useState(0)
  const [publicPortfolio, setPublicPortfolio] = useState(null)
  const dispatch = useDispatch()
  const { username } = useParams()
  const history = useHistory() 
  const { user } = useSelector((state) => state.user.user)


  const isUserPortfolio = window.location.pathname.startsWith('/my-portfolio')

  const tabs = ['Education', 'Experience', 'Market-Ready Projects']


  useEffect(() => {
    if (username === user?.username) {
      history.push('/my-portfolio') 
      return
    }
  }, [username, user?.username, history])


  useEffect(() => {
    const fetchPublicPortfolio = async () => {
      try {
        const response = await axiosInstance.get(
          `/hsPortfolio/public-portfolio/${username}`
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
        history.push('/my-portfolio') 
      }
    }

    if (username && username !== user?.username) {
      fetchPublicPortfolio()
    }
  }, [username, user?.username])


  const isPublicView = !window.location.pathname.startsWith('/public-portfolio')

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
          <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
            <div>
              <h3 className='page-title bold-page-title text-black mb-0'>
                <IntlMessages id='portfolio.header' />
              </h3>
              <p className='fs-13 fw-light text-black'>
                <IntlMessages id='portfolio.content' />
              </p>
            </div>

            {/* <SelectLanguage /> */}
          </div>
          <img
            src={MenuIcon}
            alt='menu'
            className='menu-icon-cie self-start-tab cursor-pointer'
            onClick={() => dispatch(toggleCollapse())}
          />
        </div>
        <div className='academy-dashboard-layout lead-class mb-5 bck-dashboard'>
          <AboutMe 
            user={publicPortfolio?.user || user} 
            portfolioData={publicPortfolio?.portfolio}
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
