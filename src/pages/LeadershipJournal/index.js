import React, { useState, useEffect, useRef, memo, useMemo } from 'react'
import './LeadershipJournal.css'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchJournalFinishedContent } from '../../redux/journal/Actions'


// Utility function to strip HTML tags from text
const stripHtmlTags = (html) => {
  if (!html) return ''
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  return tempDiv.textContent || tempDiv.innerText || ''
}
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
import { ContentOnlySkeleton } from '../../components/LeadershipSections/Value'

import { toast } from 'react-toastify'



const LeadershipJournal = memo(() => {
  const { id: routeId } = useParams() 
  const finalRouteId = routeId || '1' 
  const [isReflection, setIsReflection] = useState(false)
  const [allTabs, setAllTabs] = useState([])
  const [activeTabData, setActiveTabData] = useState({
    activeTab: 0,
    option: null 
  })
  const [showLockModal, setShowLockModal] = useState(false)
  const [currentTitle, setCurrentTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [navigationLocked, setNavigationLocked] = useState(false)

  const [levels, setLevels] = useState([])
  const [lessons, setLessons] = useState({})
  const [manageContentData, setManageContentData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentRouteId, setCurrentRouteId] = useState(routeId)

  const dispatch = useDispatch()
  const { finishedContent } = useSelector((state) => state.journal)
  const valueRefs = useRef({})
  const initialRouteIdRef = useRef(routeId)
  const abortControllerRef = useRef(null)

  // Function to lighten a hex color
  const lightenColor = (hex, percent) => {
    // Remove # if present
    hex = hex.replace('#', '')

    // Parse r, g, b values
    const num = parseInt(hex, 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt

    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1)
  }

  // Generate dynamic styles based on the journal color
  const dynamicStyles = useMemo(() => {
    const journalColor = manageContentData?.color

    // If no color is provided, return empty styles to use CSS defaults
    if (!journalColor) {
      return {
        leadClass: {},
        activeLeadership: {}
      }
    }

    // Create variations of the color for different uses
    const lightColor = lightenColor(journalColor, 30) // Less lightening
    const mediumColor = lightenColor(journalColor, 0) // Medium lightening

    return {
      leadClass: {
        background: `radial-gradient(circle at 50% 24%, ${mediumColor}70 5%, rgba(255, 255, 255, 0.9) 80%)`,
        boxShadow: '0 -6px 8px rgba(0, 0, 0, 0.05)'
      },
      activeLeadership: {
        backgroundColor: journalColor, // Use original color for active tab
        borderRadius: '8px',
        boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'
      }
    }
  }, [manageContentData?.color]) 

        const { user } = useSelector((state) => state.user.user)
        const userRole = user?.role_id || localStorage.getItem('role')

  const fetchLevels = async () => {
    try {
      const title = manageContentData?.title

      const url = title
        ? `/LtsJournals/leadership-journal/levels?category=${encodeURIComponent(title)}`
        : '/LtsJournals/leadership-journal/levels'

      const response = await axiosInstance.get(url)
      if (response.data && Array.isArray(response.data)) {
        const mappedLevels = response.data.map((level, index) => ({
          title: level.title || `Section ${index + 1}`,
          description: level.description || `Welcome to Section ${index + 1}`,
          active: index === 0
        }))
        setLevels(mappedLevels)
      }
    } catch (error) {
      console.error('Error fetching leadership levels:', error)
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

  const fetchManageContent = async (routeIdToFetch = finalRouteId) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    try {
      setIsLoading(true)
      const response = await axiosInstance.get(`/manage-content/${routeIdToFetch}`, {
        signal: abortControllerRef.current.signal
      })
      const contentData = response.data.data || response.data
      setManageContentData(contentData)
      setCurrentRouteId(routeIdToFetch)
      return contentData
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled')
        return null
      }
      console.error('Error fetching manage-content:', error)
      setManageContentData(null)
    } finally {
      setIsLoading(false)
    }
    return null
  }

  const fetchLessons = async () => {
    try {
      const title = manageContentData?.title

      const url = title
        ? `/LtsJournals/leadership-journal/lessons?category=${encodeURIComponent(title)}`
        : '/LtsJournals/leadership-journal/lessons'

      const response = await axiosInstance.get(url)
      if (response.data) {
        const modifiedLessons = { ...response.data }

        if (modifiedLessons['0'] && modifiedLessons['0'].length > 0 && manageContentData?.title) {
          const welcomeLesson = {
            id: parseInt(finalRouteId), 
            title: manageContentData.title,
            redirectId: modifiedLessons['0'][0].id, 
            separate: false
          }

          modifiedLessons['0'] = [welcomeLesson, ...modifiedLessons['0']]
        }

        setLessons(modifiedLessons)
      }
    } catch (error) {
      console.error('Error fetching leadership lessons:', error)
      setLessons({})
    }
  }


  const sections = useMemo(() => {
    const result = {}

    Object.keys(lessons).forEach(levelIndex => {
      const levelLessons = lessons[levelIndex] || []
      const sectionKey = levelIndex // Use level index directly as section key

      result[sectionKey] = levelLessons.map(lesson => {
        const lessonIndex = levelLessons.indexOf(lesson)

        return {
          title: stripHtmlTags(lesson.title),
          value: stripHtmlTags(lesson.title),
          id: lesson.id,
          redirectId: lesson.redirectId,
          separate: lesson.separate,
          lessonIndex: lessonIndex,
          levelIndex: levelIndex
        }
      })
    })

    return result
  }, [lessons])

  useEffect(() => {
    if (levels.length === 0 || Object.keys(lessons).length === 0) return;

    const tabs = levels.map((level, index) => {
      const sectionKey = index.toString(); // Use level index as string directly as section key
      const sectionLessons = sections[sectionKey] || [];

      return {
        title: level.title,
        options: sectionLessons.map((lesson) => ({
          label: stripHtmlTags(lesson.title),
          value: stripHtmlTags(lesson.title),
          isNext: false,
          id: lesson.id,
          redirectId: lesson.redirectId
        }))
      };
    });

    setAllTabs(tabs);
  }, [levels, sections, lessons]);

  useEffect(() => {
    fetchManageContent();
  }, []);

  // Cleanup effect for abort controller
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (manageContentData && !isLoading && currentRouteId === routeId) {
      const category = manageContentData.title
      dispatch(fetchJournalFinishedContent(category, manageContentData.title));
      fetchLevels();
      fetchLessons();
    }
  }, [manageContentData, dispatch, isLoading, currentRouteId, routeId]);

  useEffect(() => {
    if (routeId && routeId !== initialRouteIdRef.current) {
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Reset all state
      setIsReflection(false)
      setAllTabs([])
      setActiveTabData({
        activeTab: 0,
        option: null
      })
      setShowLockModal(false)
      setCurrentTitle('')
      setIsSaving(false)
      setLevels([])
      setLessons({})
      setManageContentData(null)
      setIsLoading(false)

      // Update the ref to prevent re-triggering
      initialRouteIdRef.current = routeId

      // Fetch new data
      fetchManageContent(routeId)
    }
  }, [routeId])

  useEffect(() => {
    if (!finishedContent || finishedContent.length === 0) return;

    setAllTabs(prevTabs => {
      if (prevTabs.length === 0) return prevTabs;

      const updatedTabs = [...prevTabs];

      const updateNextFlags = (options) => {
        let foundNext = false;

        return options.map(option => {
          const finished = finishedContent.some(finishedItem => stripHtmlTags(finishedItem) === option.label);
          const isNext = !finished && !foundNext;
          if (isNext) foundNext = true;

          return {
            ...option,
            isNext
          };
        });
      };

      updatedTabs.forEach((tab, index) => {
        if (tab && tab.options) {
          updatedTabs[index].options = updateNextFlags(tab.options);
        }
      });

      return updatedTabs;
    });
  }, [finishedContent]); 

  const canAccessSection = (index) => {
    if (index === 0) return true;

    const prevIndex = index - 1;
    const sectionKey = prevIndex.toString(); // Use level index as string directly as section key
    const prevSectionLessons = sections[sectionKey] || [];

    return prevSectionLessons.every(lesson => {
      const strippedLessonTitle = stripHtmlTags(lesson.title);
      return finishedContent.some(finishedItem => stripHtmlTags(finishedItem) === strippedLessonTitle);
    });
  };

  const handleSaveAndContinue = async () => {
    // Prevent rapid successive clicks and navigation during transitions
    if (isSaving || navigationLocked) return;

    try {
      setIsSaving(true);
      setNavigationLocked(true);

      if (!activeTabData.option) {
        const firstSection = allTabs[0];
        if (firstSection && firstSection.options && firstSection.options.length > 0) {
          setActiveTabData({
            activeTab: 0,
            option: firstSection.options[0]
          });
        }
        return;
      }

      // Always save first if we're in reflection mode or if we need to update progress
      const currentComponent = valueRefs.current[activeTabData.option?.value];

      if (isReflection) {
        if (currentComponent?.saveChanges) {
          await currentComponent.saveChanges();
        }

        // Update finished content state
        const category = manageContentData?.title
        await dispatch(fetchJournalFinishedContent(category, manageContentData?.title));

        // Wait for state to update before proceeding
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Now handle navigation logic after saving (if needed)
      const currentTabData = allTabs[activeTabData.activeTab];
      if (!currentTabData || !currentTabData.options) {
        console.error('Current tab data or options not found');
        return;
      }

      const currentSection = currentTabData.options;
      const currentOptionIndex = currentSection.findIndex(
        option => option.value === activeTabData.option?.value
      );

      if (currentOptionIndex === -1) {
        console.error('Current option not found in section');
        return;
      }

      if (currentOptionIndex < currentSection.length - 1) {
        // Move to next option in current section
        const nextOption = currentSection[currentOptionIndex + 1];
        if (nextOption) {
          setActiveTabData({
            ...activeTabData,
            option: nextOption
          });
        }
      } else if (activeTabData.activeTab < allTabs.length - 1) {
        // Move to next section - check if user can access it
        // Get the most current finishedContent state
        const { journal: { finishedContent: currentFinishedContent } } = store.getState();

        const currentTab = activeTabData.activeTab;
        const sectionKey = currentTab.toString(); // Use level index as string directly as section key

        const prevSectionLessons = sections[sectionKey] || [];
        const canAccess = prevSectionLessons.every(lesson => {
          const strippedLessonTitle = stripHtmlTags(lesson.title);
          return currentFinishedContent.some(finishedItem => stripHtmlTags(finishedItem) === strippedLessonTitle);
        });

        if (canAccess) {
          const nextTabData = allTabs[activeTabData.activeTab + 1];
          if (nextTabData && nextTabData.options && nextTabData.options.length > 0) {
            setActiveTabData({
              activeTab: activeTabData.activeTab + 1,
              option: nextTabData.options[0]
            });
          } else {
            console.error('Next tab data or options not found');
          }
        } else {
          setShowLockModal(true);
        }
      }

    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
      // Small delay before unlocking navigation to ensure all state updates are complete
      setTimeout(() => {
        setNavigationLocked(false);
      }, 100);
    }
  };

  const isOptionDisabled = (option) => {
    if (!canAccessSection(activeTabData.activeTab)) {
      return true;
    }

    return !finishedContent.some(finishedItem => stripHtmlTags(finishedItem) === option.label) && !option.isNext;
  };

  const isIntroSection = !isReflection;

  const renderedSection = useMemo(() => {
    // Show loading skeleton during navigation transitions
    if (navigationLocked) {
      return <ContentOnlySkeleton />
    }

    if (!activeTabData.option && manageContentData) {
      return <SectionOne setIsReflection={setIsReflection} lessonId={null} contentData={manageContentData} />
    }

    if (Object.keys(sections).length === 0) return null;

    const currentTab = activeTabData.activeTab;
    const sectionKey = currentTab.toString(); // Use level index as string directly as section key

    const selectedSection = sections[sectionKey]?.find(
      section => section.title === activeTabData.option?.value
    );

    if (!selectedSection) return null;

    // Render component based on section data
    if (selectedSection.lessonIndex === 0 && selectedSection.levelIndex === '0') {
      return <SectionOne setIsReflection={setIsReflection} lessonId={selectedSection.id} contentData={manageContentData} />
    } else {
      return (
        <Value
          key={`value-${selectedSection.id}`}
          ref={el => valueRefs.current[stripHtmlTags(selectedSection.title)] = el}
          id={selectedSection.id}
          setIsReflection={setIsReflection}
        />
      )
    }
  }, [activeTabData.option, sections, manageContentData, setIsReflection, navigationLocked]);

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

    const sectionKey = index.toString(); // Use level index as string directly as section key

    const sectionLessons = sections[sectionKey] || [];
    const firstLesson = sectionLessons[0];

    let initialOption;
    if (firstLesson) {
      initialOption = {
        label: stripHtmlTags(firstLesson.title),
        value: stripHtmlTags(firstLesson.title),
        id: firstLesson.id,
        redirectId: firstLesson.redirectId
      };
    } else {
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
    <div className='container-fluid h-100' style={{ '--bs-gutter-x': '0' }}>
      <div className='d-flex flex-column h-100'>
        <div className='col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4 ' style={{ height: 'fit-content' }}>
          <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
            <div>
              <h3 className='page-title bold-page-title text-black mb-0'>
                {manageContentData?.title || 'Leadership Journal'}
              </h3>
              {manageContentData?.subtitle ? (
                <p className='fs-13 fw-light text-black'>
                  {manageContentData.subtitle}
                </p>
              ) : (
                <p className='fs-13 fw-light text-black'>
                Leadership comes in many forms but the foundation is leading
                yourself first. Use this journal to inspire your development as
                a leader.
              </p>
              )}
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
        <div className='academy-dashboard-layout lead-class pb-5 flex-grow-1' style={Object.keys(dynamicStyles.leadClass).length > 0 ? dynamicStyles.leadClass : undefined}>
          <div className=''>

          {(allTabs.length === 0 || isLoading) ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading journal content...</p>
              </div>
            </div>
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
                      ...(activeTabData.activeTab === index && Object.keys(dynamicStyles.activeLeadership).length > 0 ? dynamicStyles.activeLeadership : {}),
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
    </div>
  )
})

export default LeadershipJournal