import React, { useState, useEffect, useRef, memo, useMemo } from 'react'
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

  const [levels, setLevels] = useState([])
  const [lessons, setLessons] = useState({})
  const [manageContentData, setManageContentData] = useState(null)

  const dispatch = useDispatch()
  const { finishedContent } = useSelector((state) => state.journal)
  const valueRefs = useRef({})
  const initialRouteIdRef = useRef(routeId) 

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

  const fetchManageContent = async () => {
    try {
      const response = await axiosInstance.get(`/manage-content/${finalRouteId}`)
      const contentData = response.data.data || response.data
      setManageContentData(contentData)
      return contentData
    } catch (error) {
      console.error('Error fetching manage-content:', error)
      setManageContentData(null)
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
      const sectionKey = levelIndex === '0' ? 'one' : levelIndex === '1' ? 'two' : 'three'

      result[sectionKey] = levelLessons.map(lesson => {
        const lessonIndex = levelLessons.indexOf(lesson)
        let component

        if (lessonIndex === 0 && levelIndex === '0') {
          component = <SectionOne setIsReflection={setIsReflection} lessonId={lesson.id} contentData={manageContentData} />
        } else {
          component = (
            <Value
              ref={el => valueRefs.current[stripHtmlTags(lesson.title)] = el}
              id={lesson.id}
              setIsReflection={setIsReflection}
            />
          )
        }

        return {
          title: stripHtmlTags(lesson.title),
          value: stripHtmlTags(lesson.title),
          id: lesson.id,
          redirectId: lesson.redirectId,
          separate: lesson.separate,
          component: component
        }
      })
    })

    return result
  }, [lessons, setIsReflection])

  useEffect(() => {
    if (levels.length === 0 || Object.keys(lessons).length === 0) return;

    const tabs = levels.map((level, index) => {
      const sectionKey = index === 0 ? 'one' : index === 1 ? 'two' : 'three';
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

  useEffect(() => {
    if (manageContentData) {
      const category = manageContentData.title
      dispatch(fetchJournalFinishedContent(category, manageContentData.title));
      fetchLevels();
      fetchLessons();
    }
  }, [manageContentData, dispatch]);

  useEffect(() => {
    if (routeId && routeId !== initialRouteIdRef.current) {
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
      fetchManageContent()
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
          const finished = finishedContent.includes(option.label);
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

    const sectionKey = (index - 1) === 0 ? 'one' : (index - 1) === 1 ? 'two' : 'three';
    const prevSectionLessons = sections[sectionKey] || [];

    return prevSectionLessons.every(lesson => finishedContent.includes(stripHtmlTags(lesson.title)));
  };

  const handleSaveAndContinue = async () => {
    try {
      setIsSaving(true);

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

      const currentComponent = valueRefs.current[activeTabData.option?.value];

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

      if (currentComponent?.saveChanges) {
        await currentComponent.saveChanges();
      }

      const category = manageContentData?.title
      await dispatch(fetchJournalFinishedContent(category, manageContentData?.title));
      const { journal: { finishedContent: updatedContent } } = store.getState();

      if (!updatedContent.includes(activeTabData.option?.value)) {
        setShowLockModal(true);
        return;
      }

      if (activeTabData.option?.value === 'Vision' && updatedContent.includes('Vision')) {
        window.location.href = '/leadership-journal';
        return;
      }

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

    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const isOptionDisabled = (option) => {
    if (!canAccessSection(activeTabData.activeTab)) {
      return true;
    }

    return !finishedContent.includes(option.label) && !option.isNext;
  };

  const isIntroSection = !isReflection;

  const renderedSection = useMemo(() => {
    if (!activeTabData.option && manageContentData) {
      return <SectionOne setIsReflection={setIsReflection} lessonId={null} contentData={manageContentData} />
    }

    if (allTabs.length === 0) return null;

    const sectionKey = activeTabData.activeTab === 0 ? 'one' :
      activeTabData.activeTab === 1 ? 'two' : 'three';

    const selectedSection = sections[sectionKey]?.find(
      section => section.title === activeTabData.option?.value
    );

    return selectedSection ? selectedSection.component : null;
  }, [activeTabData, allTabs, sections, setIsReflection, manageContentData]);

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

    const sectionKey = index === 0 ? 'one' : index === 1 ? 'two' : 'three';
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
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
          <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
            <div>
              <h3 className='page-title bold-page-title text-black mb-0'>
                {manageContentData?.title || 'Leadership Journal'}
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