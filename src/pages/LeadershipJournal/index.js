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
  const [currentTitle, setCurrentTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const dispatch = useDispatch()
  const { finishedContent } = useSelector((state) => state.journal)
  const valueRefs = useRef({})

  const sections = {
    one: [
      { title: 'Welcome to the Leadership Journal', component: <SectionOne setIsReflection={setIsReflection} /> },
      { title: 'Section One: Who am I?', component: <IntroWhoAmI setIsReflection={setIsReflection} /> },
      { 
        title: 'Values',
        component: <Value 
          ref={el => valueRefs.current['Values'] = el}
          id={1001065} 
          setIsReflection={setIsReflection} 
        /> 
      },
      { 
        title: 'Expertise',
        component: <Value 
          ref={el => valueRefs.current['Expertise'] = el}
          id={1001066} 
          setIsReflection={setIsReflection} 
        /> 
      },
      { 
        title: 'Experiences',
        component: <Value 
          ref={el => valueRefs.current['Experiences'] = el}
          id={1001067} 
          setIsReflection={setIsReflection} 
        /> 
      },
      { 
        title: 'Style',
        component: <Value 
          ref={el => valueRefs.current['Style'] = el}
          id={1001068} 
          setIsReflection={setIsReflection} 
        /> 
      },
    ],
    two: [
      { title: 'Section Two: What can I do?', component: <SectionTwo setIsReflection={setIsReflection} /> },
      { 
        title: 'Teamwork',
        component: <Value 
          ref={el => valueRefs.current['Teamwork'] = el}
          id={1001069} 
          setIsReflection={setIsReflection} 
        /> 
      },
      { 
        title: 'Initiative',
        component: <Value 
          ref={el => valueRefs.current['Initiative'] = el}
          id={1001070} 
          setIsReflection={setIsReflection} 
        /> 
      },
      { 
        title: 'Methodology',
        component: <Value 
          ref={el => valueRefs.current['Methodology'] = el}
          id={1001071} 
          setIsReflection={setIsReflection} 
        /> 
      },
      { 
        title: 'Self-Assessment',
        component: <Value 
          ref={el => valueRefs.current['Self-Assessment'] = el}
          id={1001072} 
          setIsReflection={setIsReflection} 
        /> 
      },
    ],
    three: [
      { title: 'Section Three: How do I prove it?', component: <SectionThree setIsReflection={setIsReflection} /> },
      { 
        title: 'Outcomes',
        component: <Value 
          ref={el => valueRefs.current['Outcomes'] = el}
          id={1001073} 
          setIsReflection={setIsReflection} 
        /> 
      },
      { 
        title: 'Feedback',
        component: <Value 
          ref={el => valueRefs.current['Feedback'] = el}
          id={1001074} 
          setIsReflection={setIsReflection} 
        /> 
      },
      { 
        title: 'Iteration',
        component: <Value 
          ref={el => valueRefs.current['Iteration'] = el}
          id={1001075} 
          setIsReflection={setIsReflection} 
        /> 
      },
      { 
        title: 'Vision',
        component: <Value 
          ref={el => valueRefs.current['Vision'] = el}
          id={1001076} 
          setIsReflection={setIsReflection} 
        /> 
      },
    ],
  };

  // Initialize allTabs based on sections data
  useEffect(() => {
    const tabs = [
      {
        title: 'Section One: Who am I?',
        options: sections.one.map((section) => ({
          label: section.title,
          value: section.title,
          isNext: false
        }))
      },
      {
        title: 'Section Two: What can I do?',
        options: sections.two.map((section) => ({
          label: section.title,
          value: section.title,
          isNext: false
        }))
      },
      {
        title: 'Section Three: How do I prove it?',
        options: sections.three.map((section) => ({
          label: section.title,
          value: section.title,
          isNext: false
        }))
      }
    ];
    
    setAllTabs(tabs);
  }, []);

  // Fetch finished content when component mounts
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

      // Update each tab's options
      updatedTabs[0].options = updateNextFlags(updatedTabs[0].options);
      updatedTabs[1].options = updateNextFlags(updatedTabs[1].options);
      updatedTabs[2].options = updateNextFlags(updatedTabs[2].options);

      return updatedTabs;
    });
  }, [finishedContent]); // Only depend on finishedContent

  // Function to check if a section is accessible
  const canAccessSection = (index) => {
    if (index === 0) return true;
    if (index === 1) {
      return finishedContent.includes('Section One: Who am I?');
    }
    if (index === 2) {
      return finishedContent.includes('Section Two: What can I do?');
    }
    return false;
  };

  // Handle save and continue
  const handleSaveAndContinue = async () => {
    try {
      setIsSaving(true);
  
      // Get current component ref
      const currentComponent = valueRefs.current[activeTabData.option?.value];
      
      // Handle intro sections differently
      const isIntroSection = [
        'Welcome to the Leadership Journal',
        'Section One: Who am I?',
        'Section Two: What can I do?',
        'Section Three: How do I prove it?'
      ].includes(activeTabData.option?.value);
  
      if (isIntroSection) {
        // For intro sections, just move to the next content
        const currentSection = allTabs[activeTabData.activeTab].options;
        const currentOptionIndex = currentSection.findIndex(
          option => option.value === activeTabData.option?.value
        );
        
        if (currentOptionIndex < currentSection.length - 1) {
          // Move to next option in current section
          setActiveTabData({
            ...activeTabData,
            option: currentSection[currentOptionIndex + 1]
          });
        }
        return;
      }
  
      // Regular save and continue logic for reflection sections
      if (currentComponent?.saveChanges) {
        await currentComponent.saveChanges();
      }
  
      // Rest of your existing save and continue logic...
      await dispatch(fetchJournalFinishedContent());
      const { journal: { finishedContent: updatedContent } } = store.getState();
  
      // Find next content in sections
      const currentSection = allTabs[activeTabData.activeTab].options;
      const currentOptionIndex = currentSection.findIndex(
        option => option.value === activeTabData.option?.value
      );
      
      if (currentOptionIndex < currentSection.length - 1) {
        const nextOption = currentSection[currentOptionIndex + 1];
        
        if (updatedContent.includes(activeTabData.option?.value)) {
          setActiveTabData({
            ...activeTabData,
            option: nextOption
          });
        }
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
  
      // Update isNext flags after content changes
      setAllTabs(prevTabs => {
        const updatedTabs = [...prevTabs];
        
        updatedTabs.forEach((tab, index) => {
          let foundNext = false;
          tab.options = tab.options.map(option => {
            const finished = updatedContent.includes(option.label);
            const isNext = !finished && !foundNext;
            if (isNext) foundNext = true;
            
            return {
              ...option,
              isNext
            };
          });
        });
  
        return updatedTabs;
      });
  
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Determine if an option is disabled
  const isOptionDisabled = (option) => {
    // Check if the section is accessible
    if (activeTabData.activeTab === 1 && !finishedContent.includes('Section One: Who am I?')) {
      return true;
    }
    
    if (activeTabData.activeTab === 2 && !finishedContent.includes('Section Two: What can I do?')) {
      return true;
    }
    
    // Check if this specific option should be disabled
    // An option is disabled if it's not in finishedContent and it's not marked as next
    return !finishedContent.includes(option.label) && !option.isNext;
  };

  // Render the appropriate section based on active tab and option
  const renderedSection = useMemo(() => {
    if (allTabs.length === 0) return null;
    
    if (!activeTabData.option) {
      // Render the first component of the active section
      switch (activeTabData.activeTab) {
        case 0:
          return sections.one[0].component;
        case 1:
          return sections.two[0].component;
        case 2:
          return sections.three[0].component;
        default:
          return null;
      }
    }

    // Find the component that matches the selected option
    const sectionKey = activeTabData.activeTab === 0 ? 'one' : 
                       activeTabData.activeTab === 1 ? 'two' : 'three';
    
    const selectedSection = sections[sectionKey].find(
      section => section.title === activeTabData.option.value
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
                    className={`fs-14 fw-medium text-center p-2 cursor-pointer col-4 w-100-mob ${
                      activeTabData.activeTab === index
                        ? 'active-leadership'
                        : ''
                    }`}
                    onClick={() => {
                      if (!canAccessSection(index)) {
                        setShowLockModal(true);
                        return;
                      }
                      setActiveTabData({ activeTab: index, option: null });
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
                        allTabs[activeTabData.activeTab]?.title === 'Welcome to the Leadership Journal' ? 'Welcome to the Leadership Journal' :
                        allTabs[activeTabData.activeTab]?.title === 'What can I do?' ? 'What can I do?' :
                        allTabs[activeTabData.activeTab]?.title === 'How do I prove it?' ? 'How do I prove it?' :
                        'Select Journals to View'
                      ) : currentTitle || 'Select Journals to View'
                    }
                    isDisabled={isOptionDisabled}
                  />
                </div>
                <div className='d-flex gap-3 flex-col-mob align-items-end-mob saveContinue-btn'>
                  {(isReflection || 
                    activeTabData.option?.value === 'Welcome to the Leadership Journal' ||
                    activeTabData.option?.value === 'Section One: Who am I?' ||
                    activeTabData.option?.value === 'Section Two: What can I do?' ||
                    activeTabData.option?.value === 'Section Three: How do I prove it?') && (
                    <AcademyBtn
                      title={isReflection ? 'Save and Continue' : 'Continue'}
                      icon={faArrowRight}
                      onClick={handleSaveAndContinue}
                      loading={isSaving}
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