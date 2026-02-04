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

  const fetchLessons = async () => {
    try {
      const response = await axiosInstance.get(`/journal-courses/lessons?category=${contentData?.title}`)
      if (response.data) {
        setLessons(response.data)

        if (contentData?.ltsJournalLevels && Array.isArray(contentData.ltsJournalLevels)) {
          const mappedLevels = contentData.ltsJournalLevels.map((level, index) => ({
            title: level.title,
            description: level.detailsText || `Welcome to ${level.title}`,
            active: index === 0,
            id: level.id
          }))
          setLevels(mappedLevels)
        }
      }
    } catch (error) {
      console.error('ardi 4: Error fetching journal lessons:', error)
      setLessons({})
    }
  }


  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const response = await axiosInstance.get(`/manage-content/${category}`)
        const data = response.data.data || response.data
        setContentData(data)
      } catch (error) {
        console.error('ardi 7: Error fetching content data:', error)
      }
    }
    if (category) {
      fetchContentData()
    }
  }, [category])

  useEffect(() => {
    if (contentData?.title) {
      fetchLessons();
      setLoading(false);
    }
  }, [contentData?.title])

  const sections = useMemo(() => {
    const result = {}

    levels.forEach((level, levelIndex) => {
      const sectionKey = levelIndex === 0 ? 'one' : levelIndex === 1 ? 'two' : 'three'
      const levelLessons = lessons[levelIndex.toString()] || []

      const levelSections = []

      if (levelLessons.length > 0) {
        const matchingLesson = levelLessons.find(lesson => lesson.title === level.title)

        if (matchingLesson) {
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
    })

    return result
  }, [levels, lessons, contentData, setIsReflection])

  useEffect(() => {

    if (levels.length === 0) {
      return;
    }

    const tabs = levels.map((level, index) => {
      const sectionKey = index === 0 ? 'one' : index === 1 ? 'two' : 'three';
      const sectionLessons = sections[sectionKey] || [];

      const tabOptions = sectionLessons.length > 0 ? sectionLessons.map((lesson) => ({
        label: lesson.title,
        value: lesson.title,
        isNext: true, 
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

    setAllTabs(tabs);

    if (tabs.length > 0 && !activeTabData.option) {
      const firstTab = tabs[0];
      if (firstTab.options && firstTab.options.length > 0) {
        setActiveTabData({
          activeTab: 0,
          option: firstTab.options[0]
        });
      }
    }
  }, [levels, sections, lessons]); 

  useEffect(() => {
    if (contentData?.title) {
      dispatch(fetchJournalFinishedContent(contentData.title));
    }
  }, [dispatch, contentData?.title]);


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

    const prevSectionLessons = sections[index === 1 ? 'one' : index === 2 ? 'two' : 'three'] || [];

    return prevSectionLessons.length > 0 && finishedContent.includes(prevSectionLessons[0].title);
  };

  const handleSaveAndContinue = async () => {
    try {
      setIsSaving(true);

      if (showOverview) {
        setShowOverview(false);
        if (allTabs.length > 0) {
          setActiveTabData({
            activeTab: 0,
            option: allTabs[0].options[0]
          });
        }
        setIsSaving(false);
        return;
      }

      const currentComponent = valueRefs.current[activeTabData.option?.value];

      if (currentComponent?.saveChanges) {
        await currentComponent.saveChanges();
      }

      await dispatch(fetchJournalFinishedContent(contentData.title));
      const { journal: { finishedContent: updatedContent } } = store.getState();

      if (!updatedContent.includes(activeTabData.option?.value)) {
        setShowLockModal(true);
        setIsSaving(false);
        return;
      }

      if (activeTabData.activeTab < allTabs.length - 1) {
        if (canAccessSection(activeTabData.activeTab + 1)) {
          setActiveTabData({
            activeTab: activeTabData.activeTab + 1,
            option: allTabs[activeTabData.activeTab + 1].options[0]
          });
        } else {
          setShowLockModal(true);
        }
      } else {
        window.location.href = `/journal-courses/${category}`;
        return;
      }

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

  const isOptionDisabled = (option) => {
    if (!canAccessSection(activeTabData.activeTab)) {
      return true;
    }

    return !finishedContent.includes(option.label) && !option.isNext;
  };

  const isIntroSection = useMemo(() => {
    if (showOverview) return false; 

    return false;
  }, [activeTabData, sections, showOverview]);

  const renderedSection = useMemo(() => {

    if (showOverview) {
      return <SectionOne setIsReflection={setIsReflection} contentData={contentData} />;
    }

    if (allTabs.length === 0) {
      return null;
    }

    const sectionKey = activeTabData.activeTab === 0 ? 'one' : activeTabData.activeTab === 1 ? 'two' : 'three';

    const selectedSection = sections[sectionKey]?.find(
      section => section.title === activeTabData.option?.value
    );

    return selectedSection ? selectedSection.component : null;
  }, [activeTabData, allTabs, sections, showOverview, contentData, setIsReflection]);

  useEffect(() => {
    if (activeTabData.option) {
      setCurrentTitle(activeTabData.option.label);
    } else {
      const tabTitle = allTabs[activeTabData.activeTab]?.title;
      setCurrentTitle(tabTitle);
    }
  }, [activeTabData, allTabs]);

  const handleTabClick = (index) => {
    if (!canAccessSection(index)) {
      setShowLockModal(true);
      return;
    }

    if (showOverview) {
      setShowOverview(false);
    }

    const tabOptions = allTabs[index]?.options || [];
    const firstOption = tabOptions[0];

    if (firstOption) {
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
                    className={`fs-14 fw-medium text-center p-2 cursor-pointer w-100-mob ${activeTabData.activeTab === index && !showOverview
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
                    setSelectedCourse={(newData) => {
                      if (showOverview && newData.option && newData.option.value !== 'Course Overview') {
                        setShowOverview(false);
                        setActiveTabData({
                          activeTab: 0,
                          option: newData.option
                        });
                      } else {
                        setActiveTabData(newData);
                      }
                    }}
                    options={showOverview ? [
                      {
                        label: 'Course Overview',
                        value: 'Course Overview',
                        isNext: true,
                        id: null,
                        redirectId: null
                      },
                      ...(allTabs[0]?.options || []) 
                    ] : (allTabs[activeTabData.activeTab]?.options || [])}
                    placeholder={
                      currentTitle || (showOverview ? 'Select Lesson' : (allTabs[activeTabData.activeTab]?.title || 'Select Journal Sections'))
                    }
                    isDisabled={showOverview ? ((option) => {
                      return option.value === 'Course Overview' ? false : !canAccessSection(0);
                    }) : isOptionDisabled}
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
