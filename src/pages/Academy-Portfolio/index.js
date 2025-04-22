import { useState } from 'react'
import AboutMe from '../../components/AcademyPortfolio/AboutMe'
import SelectLanguage from '../../components/SelectLanguage/SelectLanguage'
import IntlMessages from '../../utils/IntlMessages'
import EducationPortfolio from '../../components/AcademyPortfolio/EducationPortfolio'
import ExperiencePortfolio from '../../components/AcademyPortfolio/ExperiencePortfolio'
import MarketProjects from '../../components/AcademyPortfolio/MarketProjects'
import { useDispatch, useSelector } from 'react-redux'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'

function AcademyPortfolio() {
  const [activeTab, setActiveTab] = useState(0)

  const dispatch = useDispatch()

  const tabs = ['Education', 'Experience', 'Market-Ready Projects']

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return <EducationPortfolio />
      case 1:
        return <ExperiencePortfolio />
      case 2:
        return <MarketProjects />
      default:
        return null
    }
  }

  const { user } = useSelector((state) => state.user.user)

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
          <AboutMe user={user} />

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
