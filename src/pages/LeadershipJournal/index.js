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
import SectionOne from '../../components/LeadershipSections/SectionOne'
import Value from '../../components/LeadershipSections/Value'
import ModalInput from '../../components/ModalInput/ModalInput'
import SelectLanguage from '../../components/SelectLanguage/SelectLanguage'
import IntlMessages from '../../utils/IntlMessages'
import { faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../utils/AxiosInstance'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import store from '../../redux/store'
import { ModalBody, Modal } from 'reactstrap'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NotificationBell from '../../components/NotificationBell'
import { toast } from 'react-toastify'


const LeadershipJournal = memo(() => {
  const [isReflection, setIsReflection] = useState(false)
  const [allTabs, setAllTabs] = useState([])
  const [activeTabData, setActiveTabData] = useState({
    activeTab: 0,
    option: {
      label: 'Welcome to the Leadership Journal',
      value: 'Welcome to the Leadership Journal'
    }
  })
  const [showLockModal, setShowLockModal] = useState(false)
  const [currentTitle, setCurrentTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [levels, setLevels] = useState([])
  const [lessons, setLessons] = useState({})

  const dispatch = useDispatch()
  const { finishedContent } = useSelector((state) => state.journal)
  const valueRefs = useRef({})

        const { user } = useSelector((state) => state.user.user)
        const userRole = user?.role_id || localStorage.getItem('role')

  // Fetch levels from API
  const fetchLevels = async () => {
    try {
      const response = await axiosInstance.get('/LtsJournals/leadership-journal/levels')
      if (response.data && Array.isArray(response.data)) {
        // Map API response to match expected format
        const mappedLevels = response.data.map((level, index) => ({
          title: level.title || `Section ${index + 1}`,
          description: level.description || `Welcome to Section ${index + 1}`,
          active: index === 0 // Set first level as active by default
        }))
        setLevels(mappedLevels)
      }
    } catch (error) {
      console.error('Error fetching leadership levels:', error)
      // Fallback to default levels when API fails
      const defaultLevels = [
        {
          title: 'Section One: Who am I?',
          description: 'Welcome to Section One: Who am I?',
          active: true
        },
        {
          title: 'Section Two: What can I do?',
          description: 'Welcome to Section Two: What can I do?',
          active: false
        },
        {
          title: 'Section Three: How do I prove it?',
          description: 'Welcome to Section Three: How do I prove it?',
          active: false
        }
      ]
      setLevels(defaultLevels)
    }
  }

  // Fetch lessons from API
  const fetchLessons = async () => {
    try {
      const response = await axiosInstance.get('/LtsJournals/leadership-journal/lessons')
      if (response.data) {
        setLessons(response.data)
      }
    } catch (error) {
      console.error('Error fetching leadership lessons:', error)
      // Fallback to empty lessons
      setLessons({})
    }
  }


  // Generate sections dynamically from lessons API
  const sections = useMemo(() => {
    const result = {}

    Object.keys(lessons).forEach(levelIndex => {
      const levelLessons = lessons[levelIndex] || []
      const sectionKey = levelIndex === '0' ? 'one' : levelIndex === '1' ? 'two' : 'three'

      result[sectionKey] = levelLessons.map(lesson => {
        const lessonIndex = levelLessons.indexOf(lesson)
        let component

        // Special case: First lesson of section 1 uses SectionOne component
        if (lessonIndex === 0 && levelIndex === '0') {
          component = <SectionOne setIsReflection={setIsReflection} lessonId={lesson.id} />
        } else {
          // All other lessons use Value component - it handles video/text vs video/text+reflections dynamically
          component = (
            <Value
              ref={el => valueRefs.current[lesson.title] = el}
              id={lesson.id}
              setIsReflection={setIsReflection}
            />
          )
        }

        return {
          title: lesson.title,
          value: lesson.title,
          id: lesson.id,
          redirectId: lesson.redirectId,
          separate: lesson.separate,
          component: component
        }
      })
    })

    return result
  }, [lessons, setIsReflection])

  // Initialize allTabs based on dynamic sections and levels from API
  useEffect(() => {
    if (levels.length === 0 || Object.keys(lessons).length === 0) return;

    const tabs = levels.map((level, index) => {
      // Map level index to section key
      const sectionKey = index === 0 ? 'one' : index === 1 ? 'two' : 'three';
      const sectionLessons = sections[sectionKey] || [];

      return {
        title: level.title,
        options: sectionLessons.map((lesson) => ({
          label: lesson.title,
          value: lesson.title,
          isNext: false,
          id: lesson.id, // Use actual lesson ID from API
          redirectId: lesson.redirectId
        }))
      };
    });

    setAllTabs(tabs);
  }, [levels, sections, lessons]);

  // Fetch finished content, levels, and lessons when component mounts
  useEffect(() => {
    dispatch(fetchJournalFinishedContent());
    // Fetch levels and lessons from API
    fetchLevels();
    fetchLessons();
  }, [dispatch]);

  // Update isNext flag based on finishedContent
  useEffect(() => {
    if (!finishedContent || finishedContent.length === 0) return;

    setAllTabs(prevTabs => {
      if (prevTabs.length === 0) return prevTabs;

      const updatedTabs = [...prevTabs];

      // Helper function to determine the next item that should be marked as "next"
      const updateNextFlags = (options) => {
        let foundNext = false;

        return options.map(option => {
          const finished = finishedContent.includes(option.label);
          const isNext = !finished && !foundNext;
          if (isNext) foundNext = true;

          return {
            ...option,
            isNext
          };
        });
      };

      // Update each tab's options dynamically
      updatedTabs.forEach((tab, index) => {
        if (tab && tab.options) {
          updatedTabs[index].options = updateNextFlags(tab.options);
        }
      });

      return updatedTabs;
    });
  }, [finishedContent]); // Only depend on finishedContent

  // Function to check if a section is accessible
  const canAccessSection = (index) => {
    if (index === 0) return true;

    // Get lessons for the previous section from dynamic sections
    const sectionKey = (index - 1) === 0 ? 'one' : (index - 1) === 1 ? 'two' : 'three';
    const prevSectionLessons = sections[sectionKey] || [];

    // All lessons from the previous section must be completed
    return prevSectionLessons.every(lesson => finishedContent.includes(lesson.title));
  };

  // Handle save and continue
  const handleSaveAndContinue = async () => {
    try {
      setIsSaving(true);

      const currentComponent = valueRefs.current[activeTabData.option?.value];

      // Check if this is an intro section (no reflections)
      // Intro sections just continue to next lesson without saving
      if (!isReflection) {
        const currentSection = allTabs[activeTabData.activeTab].options;
        const currentOptionIndex = currentSection.findIndex(
          option => option.value === activeTabData.option?.value
        );

        if (currentOptionIndex < currentSection.length - 1) {
          setActiveTabData({
            ...activeTabData,
            option: currentSection[currentOptionIndex + 1]
          });
        }
        return;
      }

      // Save changes if it's a reflection section
      if (currentComponent?.saveChanges) {
        await currentComponent.saveChanges();
      }

      // Fetch updated content
      await dispatch(fetchJournalFinishedContent());
      const { journal: { finishedContent: updatedContent } } = store.getState();

      // Check if current content is completed
      if (!updatedContent.includes(activeTabData.option?.value)) {
        setShowLockModal(true);
        return;
      }

      // Special handling for Vision section
      if (activeTabData.option?.value === 'Vision' && updatedContent.includes('Vision')) {
        window.location.href = '/leadership-journal';
        return;
      }

      // Rest of the function remains the same...
      const currentSection = allTabs[activeTabData.activeTab].options;
      const currentOptionIndex = currentSection.findIndex(
        option => option.value === activeTabData.option?.value
      );

      if (currentOptionIndex < currentSection.length - 1) {
        const nextOption = currentSection[currentOptionIndex + 1];
        setActiveTabData({
          ...activeTabData,
          option: nextOption
        });
      } else if (activeTabData.activeTab < allTabs.length - 1) {
        if (canAccessSection(activeTabData.activeTab + 1)) {
          setActiveTabData({
            activeTab: activeTabData.activeTab + 1,
            option: allTabs[activeTabData.activeTab + 1].options[0]
          });
        } else {
          setShowLockModal(true);
        }
      }

      // Update isNext flags...
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Determine if an option is disabled
  const isOptionDisabled = (option) => {
    // Check if the section is accessible
    if (!canAccessSection(activeTabData.activeTab)) {
      return true;
    }

    // Check if this specific option should be disabled
    // An option is disabled if it's not in finishedContent and it's not marked as next
    return !finishedContent.includes(option.label) && !option.isNext;
  };

  // Check if current option is an intro section (no reflections)
  // This is now determined by the Value component setting isReflection to false
  const isIntroSection = !isReflection;

  // Render the appropriate section based on active tab and option
  const renderedSection = useMemo(() => {
    if (allTabs.length === 0) return null;

    // Find the component that matches the selected option from the hardcoded sections
    // Map level index to section key
    const sectionKey = activeTabData.activeTab === 0 ? 'one' :
      activeTabData.activeTab === 1 ? 'two' : 'three';

    const selectedSection = sections[sectionKey]?.find(
      section => section.title === activeTabData.option?.value
    );

    return selectedSection ? selectedSection.component : null;
  }, [activeTabData, allTabs, sections]);

  // Update current title when option changes
  useEffect(() => {
    if (activeTabData.option) {
      setCurrentTitle(activeTabData.option.label);
    } else {
      const tabTitle = allTabs[activeTabData.activeTab]?.title;
      setCurrentTitle(tabTitle);
    }
  }, [activeTabData, allTabs]);

  // Handle tab click
  const handleTabClick = (index) => {
    if (!canAccessSection(index)) {
      setShowLockModal(true);
      return;
    }

    // Get the first lesson from the dynamic sections
    const sectionKey = index === 0 ? 'one' : index === 1 ? 'two' : 'three';
    const sectionLessons = sections[sectionKey] || [];
    const firstLesson = sectionLessons[0];

    let initialOption;
    if (firstLesson) {
      initialOption = {
        label: firstLesson.title,
        value: firstLesson.title,
        id: firstLesson.id, // Use actual lesson ID from API
        redirectId: firstLesson.redirectId
      };
    } else {
      // Fallback if no lessons available
      initialOption = {
        label: levels[index]?.title || `Section ${index + 1}`,
        value: levels[index]?.title || `Section ${index + 1}`
      };
    }

    setActiveTabData({
      activeTab: index,
      option: initialOption
    });
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
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
          <div className="d-flex align-items-center justify-content-center">
                                   {userRole === 2 ? <NotificationBell /> : null}
                                   <img
                                     src={MenuIcon}
                                     alt='menu'
                                     className='menu-icon-cie self-start-tab cursor-pointer'
                                     onClick={() => dispatch(toggleCollapse())}
                                   />
                                 </div>
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
                    className={`fs-14 fw-medium text-center p-2 cursor-pointer w-100-mob ${activeTabData.activeTab === index
                      ? 'active-leadership'
                      : ''
                      }`}
                    onClick={() => handleTabClick(index)}
                    style={{
                      color: canAccessSection(index) ? '#000' : '#999',
                      cursor: canAccessSection(index) ? 'pointer' : 'not-allowed',
                      width: '100%'
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
                    options={allTabs[activeTabData.activeTab]?.options || []}
                    placeholder={
                      !activeTabData.option ? (
                        allTabs[activeTabData.activeTab]?.title || 'Select Journals to View'
                      ) : currentTitle || 'Select Journals to View'
                    }
                    isDisabled={isOptionDisabled}
                  />
                </div>
                <div className='d-flex gap-3 flex-col-mob align-items-end-mob saveContinue-btn'>
                  {(isReflection || isIntroSection) && (
                      <AcademyBtn
                        title={isReflection ? 'Save and Continue' : 'Continue'}
                        icon={isSaving ? faSpinner : faArrowRight}
                        onClick={handleSaveAndContinue}
                        disabled={isSaving}
                        loading={isSaving}
                        spin={isSaving}
                      />)}
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

              <div className='d-flex justify-content-end mt-4 mb-4'>
                <div
                  className='progress-details'

                >
                  <button
                    style={{ padding: '.5rem', background: 'inherit', border: 'none', marginRight: '2rem' }}
                    className='progress-details'
                    onClick={handleSaveAndContinue}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {isReflection
                          ? 'Save and Continue'
                          : isIntroSection ? 'Continue' : 'Save and Continue'}
                        <FontAwesomeIcon icon={faArrowRight} />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
})

export default LeadershipJournal