import React, { useState, useEffect, memo, useRef, useMemo } from 'react'
import { useParams } from 'react-router-dom'
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

const JournalCourses = memo(() => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [isReflection, setIsReflection] = useState(false)
  const [allTabs, setAllTabs] = useState([])
  const [activeTabData, setActiveTabData] = useState({
    activeTab: 0,
    option: {
      label: 'Welcome to the Journal Course',
      value: 'Welcome to the Journal Course'
    }
  })
  const [showLockModal, setShowLockModal] = useState(false)
  const [currentTitle, setCurrentTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const [levels, setLevels] = useState([])
  const [lessons, setLessons] = useState({})

  const { finishedContent } = useSelector((state) => state.journal)
  const valueRefs = useRef({})

  const { user } = useSelector((state) => state.user.user)
  const userRole = user?.role_id || localStorage.getItem('role')

  const [contentData, setContentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/manage-content/${id}`)
        const data = response.data.data || response.data
        setContentData(data)

        // Use ltsJournalLevels from the response as primary source for levels
        if (data?.ltsJournalLevels && Array.isArray(data.ltsJournalLevels)) {
          console.log('Found ltsJournalLevels:', data.ltsJournalLevels);

          // Map ltsJournalLevels to levels format
          const mappedLevels = data.ltsJournalLevels.map((level, index) => ({
            title: level.title || `Section ${index + 1}`,
            description: level.detailsText || `Welcome to Section ${index + 1}`,
            active: index === 0
          }))

          console.log('Mapped levels:', mappedLevels);
          setLevels(mappedLevels)

          // Create basic lessons for each level
          const basicLessons = {}
          data.ltsJournalLevels.forEach((level, levelIndex) => {
            const sectionKey = levelIndex === 0 ? 'one' : levelIndex === 1 ? 'two' : 'three'
            basicLessons[levelIndex.toString()] = [{
              id: level.id,
              title: level.title,
              value: level.title,
              redirectId: null,
              separate: false,
              component: levelIndex === 0 ?
                <SectionOne setIsReflection={setIsReflection} lessonId={level.id} /> :
                <SectionTwo setIsReflection={setIsReflection} lessonId={level.id} />
            }]
          })

          console.log('Created basic lessons:', basicLessons);
          setLessons(basicLessons)
        } else if (data?.title) {
          // Fallback to API calls if ltsJournalLevels not available
          console.log('No ltsJournalLevels found, falling back to API calls');
          await fetchLevels(data.title)
          await fetchLessons(data.title)
        } else {
          console.log('No ltsJournalLevels or title found in response');
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching journal course content:', error)
        setError(error.message)
        setLoading(false)
      }
    }
    if (id) {
      fetchContent()
    }
  }, [id])

  // Generate sections dynamically from lessons API
  const sections = useMemo(() => {
    const result = {}

    Object.keys(lessons).forEach(levelIndex => {
      const levelLessons = lessons[levelIndex] || []
      const sectionKey = levelIndex === '0' ? 'one' : levelIndex === '1' ? 'two' : 'three'

      result[sectionKey] = levelLessons.map(lesson => {
        // Special handling for specific sections (first 2 lessons are intro sections)
        const lessonIndex = levelLessons.indexOf(lesson)
        let component

        if (lessonIndex === 0 && levelIndex === '0') {
          // First lesson of section 1 - Welcome to Journal Course
          component = <SectionOne setIsReflection={setIsReflection} lessonId={lesson.id} />
        } else if (lessonIndex === 1 && levelIndex === '0') {
          // Second lesson of section 1 - Section One: Who am I?
          component = <IntroWhoAmI setIsReflection={setIsReflection} lessonId={lesson.id} />
        } else if (lessonIndex === 0 && levelIndex === '1') {
          // First lesson of section 2 - Section Two: What can I do?
          component = <SectionTwo setIsReflection={setIsReflection} lessonId={lesson.id} />
        } else if (lessonIndex === 0 && levelIndex === '2') {
          // First lesson of section 3 - Section Three: How do I prove it?
          component = <SectionThree setIsReflection={setIsReflection} lessonId={lesson.id} />
        } else {
          // All other lessons use the Value component
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
    console.log('useEffect triggered:', { levels, lessons, sections });

    if (levels.length === 0) {
      console.log('No levels available, cannot create tabs');
      return;
    }

    const tabs = levels.map((level, index) => {
      // Map level index to section key
      const sectionKey = index === 0 ? 'one' : index === 1 ? 'two' : 'three';
      const sectionLessons = sections[sectionKey] || [];

      console.log(`Creating tab ${index}:`, level.title, 'with lessons:', sectionLessons.length);

      return {
        title: level.title,
        options: sectionLessons.length > 0 ? sectionLessons.map((lesson) => ({
          label: lesson.title,
          value: lesson.title,
          isNext: false,
          id: lesson.id, // Use actual lesson ID from API
          redirectId: lesson.redirectId
        })) : [{
          label: level.title,
          value: level.title,
          isNext: true,
          id: level.id || index + 1,
          redirectId: null
        }]
      };
    });

    console.log('Setting allTabs:', tabs);
    setAllTabs(tabs);
  }, [levels, sections, lessons]);

  // Fetch finished content, levels, and lessons when component mounts
  useEffect(() => {
    dispatch(fetchJournalFinishedContent());
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

      // Check if this is an intro section
      const sectionKey = activeTabData.activeTab === 0 ? 'one' : activeTabData.activeTab === 1 ? 'two' : 'three';
      const currentSectionLessons = sections[sectionKey] || [];
      const currentLessonIndex = currentSectionLessons.findIndex(
        lesson => lesson.title === activeTabData.option?.value
      );

      // For section 1, first 2 lessons are intro sections
      // For sections 2 and 3, first lesson is intro section
      const isIntroSection = (activeTabData.activeTab === 0 && (currentLessonIndex === 0 || currentLessonIndex === 1)) ||
                            (activeTabData.activeTab > 0 && currentLessonIndex === 0);

      if (isIntroSection) {
        // Handle intro sections as before...
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
        window.location.href = `/journal-courses/${id}`;
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

  // Check if current option is an intro section
  const isIntroSection = useMemo(() => {
    const sectionKey = activeTabData.activeTab === 0 ? 'one' : activeTabData.activeTab === 1 ? 'two' : 'three';
    const currentSectionLessons = sections[sectionKey] || [];

    if (currentSectionLessons.length === 0) return false;

    const currentLessonIndex = currentSectionLessons.findIndex(
      lesson => lesson.title === activeTabData.option?.value
    );

    // For section 1 (index 0), first 2 lessons are intro sections
    // For sections 2 and 3 (index 1, 2), first lesson is intro section
    if (activeTabData.activeTab === 0) {
      return currentLessonIndex === 0 || currentLessonIndex === 1;
    } else {
      return currentLessonIndex === 0;
    }
  }, [activeTabData, sections]);

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

  if (loading) {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
            <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
              <div className='d-flex flex-column gap-2'>
                <h3 className='page-title bold-page-title text-black mb-0'>
                  {contentData?.title || 'Journal Course'}
                </h3>
                <p className='fs-13 fw-light text-black'>
                  Loading course content...
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
            <div className='w-100 d-flex justify-content-center align-items-center' style={{ minHeight: '400px' }}>
              <div className='spinner-border text-primary' role='status'>
                <span className='visually-hidden'>Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
            <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
              <div className='d-flex flex-column gap-2'>
                <h3 className='page-title bold-page-title text-black mb-0'>
                  {contentData?.title || 'Journal Course'}
                </h3>
                <p className='fs-13 fw-light text-black'>
                  Error loading course content
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
            <div className='w-100'>
              <div className='alert alert-danger' role='alert'>
                Error loading course content: {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
          <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
            <div className='d-flex flex-column gap-2'>
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
            <div>Loading tabs...</div>
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
                        allTabs[activeTabData.activeTab]?.title || 'Select Journal Sections'
                      ) : currentTitle || 'Select Journal Sections'
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
                <div className='d-flex mt-4'>{renderedSection}</div>
              </div>

              <div className='d-flex justify-content-end mt-4 mb-4'>
                <div className='progress-details'>
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

export default JournalCourses
