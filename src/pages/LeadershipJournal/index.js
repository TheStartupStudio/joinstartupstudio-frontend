import React, { useState } from 'react'
import Select from 'react-select'
import circleSign from '../../assets/images/academy-icons/circle-fill.png'
import lockSign from '../../assets/images/academy-icons/lock.png'
import searchJ from '../../assets/images/academy-icons/search.png'
import tickSign from '../../assets/images/academy-icons/tick-sign.png'
import SelectCourses from '../../components/LeadershipJournal/SelectCourses'
import YourInstructor from '../../components/LeadershipJournal/YourInstructor'
import IntroWhoAmI from '../../components/LeadershipSections/SectionIntroWhoAmI'
import SectionOne from '../../components/LeadershipSections/SectionOne'
import SectionThree from '../../components/LeadershipSections/SectionThree'
import SectionTwo from '../../components/LeadershipSections/SectionTwo'
import ModalInput from '../../components/ModalInput/ModalInput'
import IntlMessages from '../../utils/IntlMessages'
import Value from '../../components/LeadershipSections/Value'

const allTabs = [
  {
    title: 'Section One: Who am I?',
    mainComponent: <SectionOne />,
    options: [
      {
        value: 0,
        label: 'Intro to Who Am I?',
        icon: tickSign,
        textColor: 'text-black',
        component: <IntroWhoAmI />
      },
      {
        value: 1,
        label: 'Values',
        icon: tickSign,
        textColor: 'text-black',
        component: <Value />
      },
      {
        value: 2,
        label: 'Expertise',
        icon: circleSign,
        textColor: 'text-black'
        // component: <Expertise />
      },
      {
        value: 3,
        label: 'Experience',
        icon: lockSign,
        textColor: 'text-secondary'
        // component: <Experience />
      },
      {
        value: 4,
        label: 'Style',
        icon: lockSign,
        textColor: 'text-secondary'
        // component: <Style />
      }
    ]
  },
  {
    title: 'Section Two: What can I do?',
    mainComponent: <SectionTwo />,
    options: []
  },
  {
    title: 'Section Three: How do I prove it?',
    mainComponent: <SectionThree />,
    options: []
  }
]

function LeadershipJournal() {
  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const [activeTabData, setActiveTabData] = useState({
    activeTab: 0,
    option: null
  })

  const options = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' }
  ]

  const handleChange = (selectedOption) => {
    setSelectedLanguage(selectedOption)
    console.log('Selected Language:', selectedOption.value)
  }

  const renderSection = () => {
    const { activeTab, option } = activeTabData
    return option !== null
      ? allTabs[activeTab]?.options[option?.value]?.component
      : allTabs[activeTab]?.mainComponent
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
                isSearchable={false}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    width: '250px',
                    minHeight: '40px',
                    overflow: 'hidden',
                    border: 'none',
                    borderRadius: '6px'
                  }),
                  singleValue: (base) => ({
                    ...base,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  })
                }}
                components={{
                  IndicatorSeparator: () => null
                }}
              />
            </div>
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
            <div className='col-5'>
              <ModalInput
                id={'searchBar'}
                type={'search'}
                labelTitle={'Search journals'}
                imgSrc={searchJ}
                imageStyle={{ filter: 'grayscale(1)' }}
              />
            </div>
            <SelectCourses
              selectedCourse={activeTabData}
              setSelectedCourse={setActiveTabData}
              options={allTabs[activeTabData.activeTab].options}
            />
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
