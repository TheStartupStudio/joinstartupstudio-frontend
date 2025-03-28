import React, { useState } from 'react'
import circleSign from '../../assets/images/academy-icons/circle-fill.png'
import lockSign from '../../assets/images/academy-icons/lock.png'
import searchJ from '../../assets/images/academy-icons/search.png'
import tickSign from '../../assets/images/academy-icons/tick-sign.png'
import AcademyBtn from '../../components/AcademyBtn'
import SelectCourses from '../../components/LeadershipJournal/SelectCourses'
import Expertise from '../../components/LeadershipSections/Expertise'
import GoToJournal from '../../components/LeadershipSections/GoToJournal'
import IntroWhoAmI from '../../components/LeadershipSections/SectionIntroWhoAmI'
import SectionOne from '../../components/LeadershipSections/SectionOne'
import SectionThree from '../../components/LeadershipSections/SectionThree'
import SectionTwo from '../../components/LeadershipSections/SectionTwo'
import Value from '../../components/LeadershipSections/Value'
import ModalInput from '../../components/ModalInput/ModalInput'
import SelectLanguage from '../../components/SelectLanguage/SelectLanguage'
import IntlMessages from '../../utils/IntlMessages'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

function LeadershipJournal() {
  const [isReflection, setIsReflection] = useState(false)

  const [activeTabData, setActiveTabData] = useState({
    activeTab: 0,
    option: null
  })

  const renderSection = () => {
    const { activeTab, option } = activeTabData
    return option !== null
      ? allTabs[activeTab]?.options[option?.value]?.component
      : allTabs[activeTab]?.mainComponent
  }

  const allTabs = [
    {
      title: 'Section One: Who am I?',
      mainComponent: <SectionOne setIsReflection={setIsReflection} />,
      options: [
        {
          value: 0,
          label: 'Intro to Who Am I?',
          icon: tickSign,
          textColor: 'text-black',
          component: <IntroWhoAmI setIsReflection={setIsReflection} />
        },
        {
          value: 1,
          label: 'Values',
          icon: tickSign,
          textColor: 'text-black',
          component: <Value setIsReflection={setIsReflection} />
        },
        {
          value: 2,
          label: 'Expertise',
          icon: circleSign,
          textColor: 'text-black',
          component: <Expertise setIsReflection={setIsReflection} />
        },
        {
          value: 3,
          label: 'Experience',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        },
        {
          value: 4,
          label: 'Style',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        }
      ]
    },
    {
      title: 'Section Two: What can I do?',
      mainComponent: <SectionTwo setIsReflection={setIsReflection} />,
      options: [
        {
          value: 0,
          label: 'Intro to What can I do',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        },
        {
          value: 1,
          label: 'Teamwork',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        },
        {
          value: 2,
          label: 'Initiative',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        },
        {
          value: 3,
          label: 'Methodology',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        },
        {
          value: 4,
          label: 'Self-Assessment',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        }
      ]
    },
    {
      title: 'Section Three: How do I prove it?',
      mainComponent: <SectionThree setIsReflection={setIsReflection} />,
      options: [
        {
          value: 0,
          label: 'Intro to How do I prove it?',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        },
        {
          value: 1,
          label: 'Outcomes',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        },
        {
          value: 2,
          label: 'Feedback',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        },
        {
          value: 3,
          label: 'Iteration',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        },
        {
          value: 4,
          label: 'Vision',
          icon: lockSign,
          textColor: 'text-secondary',
          component: <GoToJournal />
        }
      ]
    }
  ]

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
        <div className='academy-dashboard-layout lead-class mb-5'>
          <div className='course-experts d-flex'>
            {allTabs.map((tab, index) => (
              <span
                key={index}
                className={`fs-14 fw-medium text-center p-2 cursor-pointer col-4 ${
                  allTabs[activeTabData.activeTab].title === tab.title
                    ? 'active-leadership'
                    : ''
                }`}
                onClick={() =>
                  setActiveTabData({ activeTab: index, option: null })
                }
              >
                {tab.title}
              </span>
            ))}
          </div>
          <div className='mt-4 d-flex justify-content-between'>
            <div className='search-journals-width'>
              <ModalInput
                id={'searchBar'}
                type={'search'}
                labelTitle={'Search journals'}
                imgSrc={searchJ}
                imageStyle={{ filter: 'grayscale(1)' }}
              />
            </div>
            <div className='d-flex gap-3'>
              <SelectCourses
                selectedCourse={activeTabData}
                setSelectedCourse={setActiveTabData}
                options={allTabs[activeTabData.activeTab].options}
              />
              {isReflection && (
                <AcademyBtn title={'Save and Continue '} icon={faArrowRight} />
              )}
            </div>
          </div>
          <div>
            <div className='d-flex mt-4 gap-5'>{renderSection()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadershipJournal
