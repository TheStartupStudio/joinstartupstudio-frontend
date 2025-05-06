import React, { useState, useEffect, useRef, memo, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchJournalFinishedContent } from '../../redux/journal/Actions'
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
import store from '../../redux/store'
import { ModalBody, Modal } from 'reactstrap'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'

const LeadershipJournal = memo(() => {
  const [isReflection, setIsReflection] = useState(false)
  const [allTabs, setAllTabs] = useState([])
  const [activeTabData, setActiveTabData] = useState({
    activeTab: 0,
    option: null
  })
  const [showLockModal, setShowLockModal] = useState(false)

  const dispatch = useDispatch()
  const { finishedContent } = useSelector((state) => state.journal)
  const valueRefs = useRef({})

  const staticComponents = useMemo(() => ({
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
      introComponent: <SectionThree setIsReflection={setIsReflection} />
    }
  }), [])

  const renderedSection = useMemo(() => {
    const { activeTab, option } = activeTabData
    return option !== null
      ? allTabs[activeTab]?.options[option?.value]?.component
      : allTabs[activeTab]?.mainComponent
  }, [activeTabData, allTabs])

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
    fetchJournalContent()
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
          label: `${sectionTitle}`,
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
            id: child.id,
            isNext
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

  const fetchJournalContent = async () => {
    try {
      const [contentResponse] = await Promise.all([
        axiosInstance.get('/ltsJournals/LtsJournalContent'),
        dispatch(fetchJournalFinishedContent())
      ])

      const { finishedContent } = store.getState().journal
      const transformedTabs = transformApiDataToTabs(contentResponse.data, finishedContent)

      setAllTabs(prevTabs => {
        if (transformedTabs?.length) {
          return transformedTabs
        }
        return prevTabs
      })
    } catch (error) {
      console.error('Error fetching journal content:', error)
    }
  }

  const canAccessSection = useMemo(() => (sectionIndex) => {
    if (sectionIndex === 0) return true

    const sections = {
      one: ['SECTION ONE: WHO AM I?', 'Values', 'Expertise', 'Experiences', 'Style'],
      two: ['SECTION TWO: WHAT CAN I DO?', 'Teamwork', 'Initiative', 'Methodology', 'Self-Assessment'],
      three: ['SECTION THREE: HOW DO I PROVE IT?', 'Outcomes', 'Feedback', 'Iteration', 'Vision']
    }

    const sectionTitle = allTabs[sectionIndex]?.title

    if (sectionTitle === 'SECTION TWO: WHAT CAN I DO?') {
      const sectionOneComplete = sections.one.every(title => finishedContent.includes(title))
      if (!sectionOneComplete) {
        setShowLockModal(true)
        return false
      }
    }

    if (sectionTitle === 'SECTION THREE: HOW DO I PROVE IT?') {
      const sectionOneComplete = sections.one.every(title => finishedContent.includes(title))
      const sectionTwoComplete = sections.two.every(title => finishedContent.includes(title))
      if (!sectionOneComplete || !sectionTwoComplete) {
        setShowLockModal(true)
        return false
      }
    }

    return true
  }, [allTabs, finishedContent])

  useEffect(() => {
    fetchJournalContent()
  }, [dispatch])

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
          </div>
          <img
            src={MenuIcon}
            alt='menu'
            className='menu-icon-cie self-start-tab cursor-pointer'
            onClick={() => dispatch(toggleCollapse())}
          />
        </div>
        <div className='academy-dashboard-layout lead-class mb-5'>
          {allTabs.length === 0 ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className='course-experts d-flex flex-col-mob align-center-mob'>
                {allTabs.map((tab, index) => (
                  <span
                    key={index}
                    className={`fs-14 fw-medium text-center p-2 cursor-pointer col-4 w-100-mob ${allTabs[activeTabData.activeTab].title === tab.title
                        ? 'active-leadership'
                        : ''
                      }`}
                    onClick={() => {
                      if (!canAccessSection(index)) {
                        return
                      }
                      setActiveTabData({ activeTab: index, option: null })
                    }}
                  >
                    {tab.title}
                  </span>
                ))}
              </div>
              <div className='mt-4 d-flex justify-content-between flex-col-mob gap-1rem-mob align-items-center leadership-btn-section'>
                <div className='search-journals-width w-100-mob'>
                  <SelectCourses
                    selectedCourse={activeTabData}
                    setSelectedCourse={setActiveTabData}
                    options={allTabs[activeTabData.activeTab].options}
                    placeholder={
                      allTabs[activeTabData.activeTab]?.title === 'SECTION ONE: WHO AM I?' ? 'Welcome to the Leadership Journal' :
                      allTabs[activeTabData.activeTab]?.title === 'SECTION TWO: WHAT CAN I DO?' ? 'What can I do?' :
                      allTabs[activeTabData.activeTab]?.title === 'SECTION THREE: HOW DO I PROVE IT?' ? 'How do I prove it?'
                      : 'Select Journals to View'
                    }
                    isDisabled={(option) => {
                      if (allTabs[activeTabData.activeTab].title === 'SECTION THREE: HOW DO I PROVE IT?') {
                        if (!finishedContent.includes('SECTION TWO: WHAT CAN I DO?')) {
                          return true
                        }
                      }
                      return !finishedContent.includes(option.label) && !option.isNext
                    }}
                  />
                </div>
                <div className='d-flex gap-3 flex-col-mob align-items-end-mob saveContinue-btn'>
                  {isReflection && (
                    <AcademyBtn
                      title={'Save and Continue'}
                      icon={faArrowRight}
                      onClick={handleSaveAndContinue}
                    />
                  )}
                </div>
                {showLockModal && (
                  <Modal
                    isOpen={showLockModal}
                    toggle={() => setShowLockModal(false)}
                    className='certificate-modal'
                  >
                    <span
                      className='cursor-pointer'
                      onClick={() => setShowLockModal(false)}
                      style={{ zIndex: '1' }}
                    >
                      <img className='left-arrow-modal' src={leftArrow} alt='left' />
                    </span>
                    <ModalBody>
                      <img src={lockSign} alt='lock' className='mb-3' />
                      <div className='d-flex justify-content-between align-items-center'>
                        <h3 className='fs-14' style={{ marginBottom: '0' }}>
                          Lesson Locked
                        </h3>
                      </div>

                      <div className='mt-5'>
                        <p className='text-secondary text-center'>This lesson is currently locked. You must complete the lesson before it to gain access to this lesson.</p>
                      </div>
                    </ModalBody>
                  </Modal>
                )}
              </div>
              <div className='leadership-btn-section'>
                <div className='d-flex mt-4 gap-5'>{renderedSection}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

export default LeadershipJournal
