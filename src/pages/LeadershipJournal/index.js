import React, { useState, useEffect, useRef } from 'react'
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
import { Modal } from 'react-bootstrap'

function LeadershipJournal() {
  const [isReflection, setIsReflection] = useState(false)
  const [allTabs, setAllTabs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTabData, setActiveTabData] = useState({
    activeTab: 0,
    option: null
  })
  const [showLockModal, setShowLockModal] = useState(false)

  const dispatch = useDispatch()
  const { finishedContent, loading: finishedContentLoading } = useSelector(
    (state) => state.journal
  )

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
    fetchJournalContent()
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
      setLoading(true)
      const [contentResponse] = await Promise.all([
        axiosInstance.get('/ltsJournals/LtsJournalContent'),
        dispatch(fetchJournalFinishedContent())
      ])

      // Get current finishedContent from redux state
      const { finishedContent } = store.getState().journal

      // Transform new data while keeping existing tabs in state
      const transformedTabs = transformApiDataToTabs(
        contentResponse.data,
        finishedContent
      )

      // Only update state after new data is ready
      setAllTabs((prevTabs) => {
        // Keep showing previous tabs until new ones are ready
        if (transformedTabs?.length) {
          return transformedTabs
        }
        return prevTabs
      })
    } catch (error) {
      console.error('Error fetching journal content:', error)
    } finally {
      setLoading(false)
    }
  }

  const isContentCompleted = (title) => {
    return finishedContent.includes(title)
  }

  const canAccessSection = (sectionIndex) => {
    // Can always access first section
    if (sectionIndex === 0) return true;

    const sections = {
      one: ['SECTION ONE: WHO AM I?', 'Values', 'Expertise', 'Experiences', 'Style'],
      two: ['SECTION TWO: WHAT CAN I DO?', 'Teamwork', 'Initiative', 'Methodology', 'Self-Assessment'],
      three: ['SECTION THREE: HOW DO I PROVE IT?', 'Outcomes', 'Feedback', 'Iteration', 'Vision']
    };

    // Get section title
    const sectionTitle = allTabs[sectionIndex]?.title;

    // For Section Two, check if Section One is completed
    if (sectionTitle === 'SECTION TWO: WHAT CAN I DO?') {
      const sectionOneComplete = sections.one.every(title => 
        finishedContent.includes(title)
      );
      if (!sectionOneComplete) {
        setShowLockModal(true);
        return false;
      }
    }

    // For Section Three, check if both Section One and Two are completed  
    if (sectionTitle === 'SECTION THREE: HOW DO I PROVE IT?') {
      const sectionOneComplete = sections.one.every(title => 
        finishedContent.includes(title)
      );
      const sectionTwoComplete = sections.two.every(title => 
        finishedContent.includes(title)
      );
      if (!sectionOneComplete || !sectionTwoComplete) {
        setShowLockModal(true);
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    fetchJournalContent()
    // Remove finishedContent from dependencies
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
                    isDisabled={(option) => {
                      // Disable Section Three options if Section Two is not completed
                      if (allTabs[activeTabData.activeTab].title === 'SECTION THREE: HOW DO I PROVE IT?') {
                        if (!finishedContent.includes('SECTION TWO: WHAT CAN I DO?')) {
                          return true;
                        }
                      }
                      return !isContentCompleted(option.label) && !option.isNext;
                    }}
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
      {showLockModal && (
        <Modal
          show={showLockModal}
          onHide={() => setShowLockModal(false)}
          centered
          className="lesson-locked-modal"
        >
          <Modal.Body className="text-center p-4 position-relative">
            <div className="mb-3">
              <i className="fa fa-lock fs-1"></i>
            </div>
            <h5 className="mb-3">Lesson Locked</h5>
            <p>
              This lesson is currently locked. You must complete
              the lesson before it to gain access to this lesson.
            </p>
            <button 
              className="mt-3 position-absolute top-20 end-20 rounded-5 rounded-top-0 rounded-end-0 border-0"
              onClick={() => setShowLockModal(false)}
            >
              Close
            </button>
          </Modal.Body>
        </Modal>
      )}
    </div>
  )
}

export default LeadershipJournal
