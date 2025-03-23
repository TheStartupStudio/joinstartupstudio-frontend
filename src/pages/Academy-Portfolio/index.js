import { useState } from 'react'
import AboutMe from '../../components/AcademyPortfolio/AboutMe'
import SelectLanguage from '../../components/SelectLanguage/SelectLanguage'
import IntlMessages from '../../utils/IntlMessages'
import EducationPortfolio from '../../components/AcademyPortfolio/EducationPortfolio'
import ExperiencePortfolio from '../../components/AcademyPortfolio/ExperiencePortfolio'
import MarketProjects from '../../components/AcademyPortfolio/MarketProjects'

function AcademyPortfolio() {
  const [activeTab, setActiveTab] = useState(0)

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

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 pe-0 me-0'>
          <div className='account-page-padding d-flex justify-content-between align-items-center'>
            <div>
              <h3 className='page-title bold-page-title text-black mb-2'>
                <IntlMessages id='journal.header' />
              </h3>
              <p className='mb-0 fs-13 fw-light text-black'>
                Leadership comes in many forms but the foundation is leading
                yourself first. Use this journal to inspire your development as
                a leader.
              </p>
            </div>

            <SelectLanguage />
          </div>
        </div>
        <div className='academy-dashboard-layout lead-class mb-5 bck-dashboard'>
          <AboutMe
            profilePic={
              'https://s3-alpha-sig.figma.com/img/68e9/25ea/570debe02d3fbad1f2da6b269789b18a?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=GCpYFKTtgB2SUX9M0uYET2FOLh1rTYhAlc2ofcE4wteGrG4sHtjXDh-f~mfKnm-NdJ4ILMiHx--z11IAt7rpWi1gAtOdQeWldJ3VyJoqhbbrIo0z9y5YOWV9gpylui2X8HOcQ4XeOmxNwmJzZMVQti3mCB4oskHIW1JkbhulnQiVBb7Zf8JYnRuXOgpZbVGQ8sCKJ73l2mte5RuBUb1nfHbbUcv0HptmrILpu~jStptKXDEi5VUSZkgJ0544TA8XNeQl9j6PCcAnXM2NFdvxu3HkMjKC-wKt1mP5urzFcRycEC0ky6Tm7BakgInlnmCB7qeNmqXjQ68ozCzHllM8Mw__'
            }
            instructorName={'Kenia Anders'}
            userProffesion={'Graphic Desginer'}
          />

          <div className='course-experts d-flex justify-content-between mt-5'>
            {tabs.map((tab, index) => (
              <span
                key={tab}
                className={`fs-14 fw-medium col-4 text-center p-2 cursor-pointer ${
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
