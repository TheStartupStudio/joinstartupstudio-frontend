import React, { useState, useEffect, useRef } from 'react'
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
import axiosInstance from '../../utils/AxiosInstance'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import { useDispatch } from 'react-redux'

function LeadershipJournal() {
  const [isReflection, setIsReflection] = useState(false)
  const [allTabs, setAllTabs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTabData, setActiveTabData] = useState({
    activeTab: 0,
    option: null
  })

  const dispatch = useDispatch()

  const valueRefs = useRef({})

  const getComponentWithRef = (Component, id) => {
    if (Component.type === Value) {
      return React.cloneElement(Component, {
        ref: (el) => (valueRefs.current[id] = el)
      })
    }
    return Component
  }

  const handleSaveAndContinue = async () => {
    const currentOption =
      allTabs[activeTabData.activeTab]?.options[activeTabData.option?.value]
    if (currentOption?.id && valueRefs.current[currentOption.id]) {
      await valueRefs.current[currentOption.id].saveChanges()
    }
  }

  const renderSection = () => {
    const { activeTab, option } = activeTabData
    return option !== null
      ? allTabs[activeTab]?.options[option?.value]?.component
      : allTabs[activeTab]?.mainComponent
  }

  const staticComponents = {
    'SECTION ONE: WHO AM I?': {
      mainComponent: <SectionOne setIsReflection={setIsReflection} />,
      introComponent: <IntroWhoAmI setIsReflection={setIsReflection} />
    },
    'SECTION TWO: WHAT CAN I DO?': {
      mainComponent: <SectionTwo setIsReflection={setIsReflection} />,
      introComponent: <SectionTwo setIsReflection={setIsReflection} />
    },
    'SECTION THREE: HOW DO I PROVE IT?': {
      mainComponent: <SectionThree setIsReflection={setIsReflection} />,
      introComponent: <GoToJournal />
    }
  }

  const transformApiDataToTabs = (data, finishedContent) => {
    const parentSections = data
      .filter((item) => !item.parentId)
      .sort((a, b) => a.order - b.order)

    return parentSections.map((section) => {
      const children = data
        .filter((item) => item.parentId === section.id)
        .sort((a, b) => a.order - b.order)

      const sectionTitle = section.title
      const staticSection = staticComponents[sectionTitle]

      const allItems = [sectionTitle, ...children.map((child) => child.title)]
      const nextUnfinishedIndex = allItems.findIndex(
        (item) => !finishedContent.includes(item)
      )

      const options = [
        {
          value: 0,
          label: `Intro to ${sectionTitle}`,
          icon: finishedContent.includes(sectionTitle)
            ? tickSign
            : nextUnfinishedIndex === 0
            ? circleSign
            : lockSign,
          textColor:
            finishedContent.includes(sectionTitle) || nextUnfinishedIndex === 0
              ? 'text-black'
              : 'text-secondary',
          component: staticSection?.introComponent
        },
        ...children.map((child, index) => {
          const itemIndex = index + 1
          const isFinished = finishedContent.includes(child.title)
          const isNext = nextUnfinishedIndex === itemIndex

          return {
            value: itemIndex,
            label: child.title,
            icon: isFinished ? tickSign : isNext ? circleSign : lockSign,
            textColor: isFinished || isNext ? 'text-black' : 'text-secondary',
            component: getComponentWithRef(
              <Value id={child.id} setIsReflection={setIsReflection} />,
              child.id
            ),
            id: child.id
          }
        })
      ]

      return {
        title: sectionTitle,
        mainComponent: staticSection?.mainComponent,
        options
      }
    })
  }

  useEffect(() => {
    const fetchJournalContent = async () => {
      try {
        setLoading(true)
        const [contentResponse, finishedResponse] = await Promise.all([
          axiosInstance.get('/ltsJournals/LtsJournalContent'),
          axiosInstance.get('/ltsJournals/LtsJournalFinishedContent')
        ])

        const transformedTabs = transformApiDataToTabs(
          contentResponse.data,
          finishedResponse.data.finishedContent
        )
        setAllTabs(transformedTabs)
      } catch (error) {
        console.error('Error fetching journal content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJournalContent()
  }, [])

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
          <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
            <div>
              <h3 className='page-title bold-page-title text-black mb-0'>
                <IntlMessages id='journal.header' />
              </h3>
              <p className='fs-13 fw-light text-black'>
                Leadership comes in many forms but the foundation is leading
                yourself first. Use this journal to inspire your development as
                a leader.
              </p>
            </div>

            <SelectLanguage />
          </div>
          <img
            src={MenuIcon}
            alt='menu'
            className='menu-icon-cie self-start-tab cursor-pointer'
            onClick={() => dispatch(toggleCollapse())}
          />
        </div>
        <div className='academy-dashboard-layout lead-class mb-5'>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className='course-experts d-flex flex-col-mob align-center-mob'>
                {allTabs.map((tab, index) => (
                  <span
                    key={index}
                    className={`fs-14 fw-medium text-center p-2 cursor-pointer col-4 w-100-mob ${
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
              <div className='mt-4 d-flex justify-content-between flex-col-mob gap-1rem-mob'>
                <div className='search-journals-width w-100-mob'>
                  <ModalInput
                    id={'searchBar'}
                    type={'search'}
                    labelTitle={'Search journals'}
                    imgSrc={searchJ}
                    imageStyle={{ filter: 'grayscale(1)' }}
                  />
                </div>
                <div className='d-flex gap-3 flex-col-mob align-items-end-mob'>
                  <SelectCourses
                    selectedCourse={activeTabData}
                    setSelectedCourse={setActiveTabData}
                    options={allTabs[activeTabData.activeTab].options}
                  />
                  {isReflection && (
                    <AcademyBtn
                      title={'Save and Continue'}
                      icon={faArrowRight}
                      onClick={handleSaveAndContinue}
                    />
                  )}
                </div>
              </div>
              <div>
                <div className='d-flex mt-4 gap-5'>{renderSection()}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default LeadershipJournal
