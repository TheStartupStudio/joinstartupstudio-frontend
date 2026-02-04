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
  const { id: category } = useParams()
  const dispatch = useDispatch()
  const [isReflection, setIsReflection] = useState(false)
  const [allTabs, setAllTabs] = useState([])
  const [activeTabData, setActiveTabData] = useState({
    activeTab: 0,
    option: {
      label: 'Course Overview',
      value: 'Course Overview',
      isNext: true,
      id: null,
      redirectId: null
    }
  })

  // Track if we're showing overview or lessons
  const [showOverview, setShowOverview] = useState(true)
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

  // Fetch lessons from API
  const fetchLessons = async () => {
    console.log('ardi 1: fetchLessons called with contentData:', contentData)
    try {
      const response = await axiosInstance.get(`/journal-courses/lessons?category=${contentData?.title}`)
      console.log('ardi 2: lessons API response:', response.data)
      if (response.data) {
        setLessons(response.data)

        // Create levels based on ltsJournalLevels from manage-content API
        if (contentData?.ltsJournalLevels && Array.isArray(contentData.ltsJournalLevels)) {
          const mappedLevels = contentData.ltsJournalLevels.map((level, index) => ({
            title: level.title,
            description: level.detailsText || `Welcome to ${level.title}`,
            active: index === 0,
            id: level.id
          }))
          console.log('ardi 3: mapped levels:', mappedLevels)
          setLevels(mappedLevels)
        }
      }
    } catch (error) {
      console.error('ardi 4: Error fetching journal lessons:', error)
      // Fallback to empty lessons
      setLessons({})
    }
  }


  // Fetch content data for SectionOne component
  useEffect(() => {
    console.log('ardi 5: fetchContentData useEffect triggered with category:', category)
    const fetchContentData = async () => {
      try {
        const response = await axiosInstance.get(`/manage-content/${category}`)
        const data = response.data.data || response.data
        console.log('ardi 6: manage-content API response:', data)
        setContentData(data)
      } catch (error) {
        console.error('ardi 7: Error fetching content data:', error)
      }
    }
    if (category) {
      fetchContentData()
    }
  }, [category])

  // Fetch finished content, levels, and lessons when component mounts
  useEffect(() => {
    if (contentData?.title) {
      dispatch(fetchJournalFinishedContent(contentData.title));
      // Fetch lessons from API
      fetchLessons();
      setLoading(false);
    }
  }, [dispatch, contentData?.title])

  // Generate sections dynamically from levels and lessons API
  const sections = useMemo(() => {
    console.log('ardi 8: sections useMemo called with levels:', levels, 'lessons:', lessons)
    const result = {}

    levels.forEach((level, levelIndex) => {
      const sectionKey = levelIndex === 0 ? 'one' : levelIndex === 1 ? 'two' : 'three'
      const levelLessons = lessons[levelIndex.toString()] || []
      console.log('ardi 9: processing level', levelIndex, 'with lessons:', levelLessons)

      // Create sections array for this level
      const levelSections = []

      // For each level, add the corresponding lesson that shows SectionTwo
      if (levelLessons.length > 0) {
        // Find the lesson that matches this level's title
        const matchingLesson = levelLessons.find(lesson => lesson.title === level.title)

        if (matchingLesson) {
          console.log('ardi 10: found matching lesson for level', level.title, ':', matchingLesson.title)
          const lessonComponent = <SectionTwo setIsReflection={setIsReflection} lessonId={matchingLesson.id} />

          levelSections.push({
            title: level.title,
            value: level.title,
            id: matchingLesson.id,
            redirectId: matchingLesson.redirectId,
            separate: matchingLesson.separate,
            component: lessonComponent
          })
        } else {
          // Fallback - show level overview with SectionOne
          console.log('ardi 11: no matching lesson found for level', level.title)
          const levelOverviewComponent = <SectionOne setIsReflection={setIsReflection} lessonId={level.id} contentData={contentData} />
          levelSections.push({
            title: level.title,
            value: level.title,
            id: level.id,
            redirectId: null,
            separate: false,
            component: levelOverviewComponent
          })
        }
      } else {
        // No lessons available - show level overview
        console.log('ardi 12: no lessons available for level', level.title)
        const levelOverviewComponent = <SectionOne setIsReflection={setIsReflection} lessonId={level.id} contentData={contentData} />
        levelSections.push({
          title: level.title,
          value: level.title,
          id: level.id,
          redirectId: null,
          separate: false,
          component: levelOverviewComponent
        })
      }

      result[sectionKey] = levelSections
      console.log('ardi 13: final levelSections for', sectionKey, ':', levelSections.map(s => ({ title: s.title, id: s.id })))
    })

    console.log('ardi 14: final sections result:', Object.keys(result).map(key => ({ key, count: result[key].length })))
    return result
  }, [levels, lessons, contentData, setIsReflection])

  // Initialize allTabs based on dynamic sections and levels from API
  useEffect(() => {
    console.log('ardi 14: allTabs useEffect triggered:', { levels, lessons, sections });

    if (levels.length === 0) {
      console.log('ardi 15: No levels available, cannot create tabs');
      return;
    }

    const tabs = levels.map((level, index) => {
      // Map level index to section key
      const sectionKey = index === 0 ? 'one' : index === 1 ? 'two' : 'three';
      const sectionLessons = sections[sectionKey] || [];

      console.log('ardi 15: Creating tab', index, ':', level.title, 'with lessons:', sectionLessons.length);
      console.log('ardi 16: sectionLessons:', sectionLessons.map(l => ({ title: l.title, id: l.id })));

      // Each tab has only one option - the matching lesson
      const tabOptions = sectionLessons.length > 0 ? sectionLessons.map((lesson) => ({
        label: lesson.title,
        value: lesson.title,
        isNext: true, // All tabs are initially available
        id: lesson.id,
        redirectId: lesson.redirectId
      })) : [{
        label: level.title,
        value: level.title,
        isNext: true,
        id: level.id || index + 1,
        redirectId: null
      }];

      return {
        title: level.title,
        options: tabOptions
      };
    });

    console.log('ardi 18: Setting allTabs:', tabs.map(t => ({ title: t.title, optionsCount: t.options.length })));
    setAllTabs(tabs);

    // Set initial option when tabs are first created
    if (tabs.length > 0 && !activeTabData.option) {
      const firstTab = tabs[0];
      if (firstTab.options && firstTab.options.length > 0) {
        console.log('ardi 19: Setting initial option:', firstTab.options[0]);
        setActiveTabData({
          activeTab: 0,
          option: firstTab.options[0]
        });
      }
    }
  }, [levels, sections, lessons]); // Removed activeTabData.option from dependencies to prevent infinite loops

  // Fetch finished content, levels, and lessons when component mounts
  useEffect(() => {
    if (contentData?.title) {
      dispatch(fetchJournalFinishedContent(contentData.title));
    }
  }, [dispatch, contentData?.title]);

  // Debug activeTabData changes
  useEffect(() => {
    console.log('ardi 34: activeTabData changed:', activeTabData);
  }, [activeTabData]);

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
    // First lesson tab (index 0) is accessible after overview
    if (index === 0) return true;

    // Other lesson tabs (indices 1+) require previous lesson to be completed
    const prevSectionLessons = sections[index === 1 ? 'one' : index === 2 ? 'two' : 'three'] || [];

    // The lesson from the previous section must be completed
    return prevSectionLessons.length > 0 && finishedContent.includes(prevSectionLessons[0].title);
  };

  // Handle save and continue
  const handleSaveAndContinue = async () => {
    try {
      setIsSaving(true);

      console.log('ardi 40: handleSaveAndContinue called, showOverview:', showOverview);

      // If showing overview, switch to lessons mode
      if (showOverview) {
        console.log('ardi 41: switching from overview to lessons');
        setShowOverview(false);
        // Set to first lesson tab
        if (allTabs.length > 0) {
          setActiveTabData({
            activeTab: 0,
            option: allTabs[0].options[0]
          });
        }
        setIsSaving(false);
        return;
      }

      // For lesson tabs, save changes and move to next tab
      const currentComponent = valueRefs.current[activeTabData.option?.value];

      // Save changes if it's a reflection section
      if (currentComponent?.saveChanges) {
        console.log('ardi 42: saving changes');
        await currentComponent.saveChanges();
      }

      // Fetch updated content
      await dispatch(fetchJournalFinishedContent(contentData.title));
      const { journal: { finishedContent: updatedContent } } = store.getState();
      console.log('ardi 43: updated finished content:', updatedContent);

      // Check if current content is completed
      if (!updatedContent.includes(activeTabData.option?.value)) {
        console.log('ardi 44: content not completed, showing lock modal');
        setShowLockModal(true);
        setIsSaving(false);
        return;
      }

      // Move to next tab
      if (activeTabData.activeTab < allTabs.length - 1) {
        if (canAccessSection(activeTabData.activeTab + 1)) {
          console.log('ardi 45: moving to next tab', activeTabData.activeTab + 1);
          setActiveTabData({
            activeTab: activeTabData.activeTab + 1,
            option: allTabs[activeTabData.activeTab + 1].options[0]
          });
        } else {
          console.log('ardi 46: next tab not accessible, showing lock modal');
          setShowLockModal(true);
        }
      } else {
        // End of course - redirect back to course page
        console.log('ardi 47: end of course, redirecting');
        window.location.href = `/journal-courses/${category}`;
        return;
      }

      // Update isNext flags
      setAllTabs(prevTabs => {
        if (prevTabs.length === 0) return prevTabs;

        const updatedTabs = [...prevTabs];

        const updateNextFlags = (options) => {
          let foundNext = false;
          return options.map(option => {
            const finished = updatedContent.includes(option.label);
            const isNext = !finished && !foundNext;
            if (isNext) foundNext = true;
            return { ...option, isNext };
          });
        };

        updatedTabs.forEach((tab, index) => {
          if (tab && tab.options) {
            updatedTabs[index].options = updateNextFlags(tab.options);
          }
        });

        return updatedTabs;
      });

    } catch (error) {
      console.error('ardi 48: Error saving:', error);
      setIsSaving(false);
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
    if (showOverview) return false; // Overview is not an intro section

    // Since each tab has only one lesson and it's always the main content, no intro sections
    return false;
  }, [activeTabData, sections, showOverview]);

  // Render the appropriate section based on active tab and option
  const renderedSection = useMemo(() => {
    console.log('ardi 20: renderedSection useMemo called with activeTabData:', activeTabData, 'showOverview:', showOverview);

    // Show overview (SectionOne with main content) initially
    if (showOverview) {
      console.log('ardi 21: showing overview SectionOne');
      return <SectionOne setIsReflection={setIsReflection} contentData={contentData} />;
    }

    if (allTabs.length === 0) {
      console.log('ardi 22: no allTabs, returning null');
      return null;
    }

    // Handle lesson tabs
    const sectionKey = activeTabData.activeTab === 0 ? 'one' : activeTabData.activeTab === 1 ? 'two' : 'three';

    console.log('ardi 23: looking for section in', sectionKey, 'with title:', activeTabData.option?.value);
    console.log('ardi 24: available sections in', sectionKey, ':', sections[sectionKey]?.map(s => s.title));

    const selectedSection = sections[sectionKey]?.find(
      section => section.title === activeTabData.option?.value
    );

    console.log('ardi 25: selectedSection found:', selectedSection ? 'YES' : 'NO', selectedSection?.title);

    return selectedSection ? selectedSection.component : null;
  }, [activeTabData, allTabs, sections, showOverview, contentData, setIsReflection]);

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
    console.log('ardi 26: handleTabClick called with index:', index, 'showOverview:', showOverview);

    // Prevent tab clicks during overview mode
    if (showOverview) {
      console.log('ardi 27: ignoring tab click during overview mode');
      return;
    }

    // Check accessibility
    if (!canAccessSection(index)) {
      console.log('ardi 28: section not accessible, showing lock modal');
      setShowLockModal(true);
      return;
    }

    // Get the first lesson from the tabs options
    const tabOptions = allTabs[index]?.options || [];
    const firstOption = tabOptions[0];
    console.log('ardi 29: tabOptions for index', index, ':', tabOptions.map(o => ({ label: o.label, value: o.value })));
    console.log('ardi 30: firstOption:', firstOption);

    if (firstOption) {
      console.log('ardi 31: setting activeTabData to:', { activeTab: index, option: firstOption });
      setActiveTabData({
        activeTab: index,
        option: firstOption
      });
    } else {
      console.log('ardi 32: no firstOption found');
    }
  };

  if (loading) {
    return (
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
            <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
              <div className='d-flex flex-column gap-2'>
                <h3 className='page-title bold-page-title text-black mb-0'>
                  {category || 'Journal Course'}
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
                  {category || 'Journal Course'}
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
                      color: showOverview ? '#999' : (canAccessSection(index) ? '#000' : '#999'),
                      cursor: showOverview ? 'not-allowed' : (canAccessSection(index) ? 'pointer' : 'not-allowed'),
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
                    options={showOverview ? [{
                      label: 'Course Overview',
                      value: 'Course Overview',
                      isNext: true,
                      id: null,
                      redirectId: null
                    }] : (allTabs[activeTabData.activeTab]?.options || [])}
                    placeholder={
                      currentTitle || (showOverview ? 'Course Overview' : (allTabs[activeTabData.activeTab]?.title || 'Select Journal Sections'))
                    }
                    isDisabled={showOverview ? (() => false) : isOptionDisabled}
                  />
                </div>
                <div className='d-flex gap-3 flex-col-mob align-items-end-mob saveContinue-btn'>
                  <AcademyBtn
                    title={showOverview ? 'Continue' : (isReflection ? 'Save and Continue' : 'Continue')}
                    icon={isSaving ? faSpinner : faArrowRight}
                    onClick={handleSaveAndContinue}
                    disabled={isSaving}
                    loading={isSaving}
                    spin={isSaving}
                  />
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
            </>
          )}
        </div>
      </div>
    </div>
  )
})

export default JournalCourses
