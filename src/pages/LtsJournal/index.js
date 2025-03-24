import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useHistory, Switch, Route } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import 'react-quill/dist/quill.snow.css'
import './ltsjournal.css'
import ReactPlayer from 'react-player'
import Accordion from 'react-bootstrap/Accordion'
import { changeSidebarState } from '../../redux'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown, faFileAlt,faSearch,faUser,faArrowLeft,faArrowRight, faPlay } from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import searchIcon from '../../assets/images/search-icon.png'
import circleIcon from '../../assets/images/circle-user-icon.png'
import UserIcon from '../../assets/images/user-icon-journal.png'
import LtsJournalContent from './content'
import { Modal, ModalBody } from 'reactstrap';
import leftArrow from '../../assets/images/academy-icons/left-arrow.png';
import progressLogo from '../../assets/images/academy-icons/progress-details-logo.png';
import CircularProgress from '../../components/ProgressBar';
import ProgressDone from '../../components/CourseProgress/ProgressDone';
import InProggresCourse from '../../components/CourseProgress/InProggresCourse';
import CourseNotStarted from '../../components/CourseProgress/CourseNotStarted';
import SelectCourses from '../../components/LeadershipJournal/SelectCourses'
import ModalInput from '../../components/ModalInput/ModalInput'
import searchJ from '../../assets/images/academy-icons/search.png'
import MediaLightbox from '../../components/MediaLightbox';

function LtsJournal(props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const [journals, setJournals] = useState([])
  const [journalsData, setJournalsData] = useState([])
  const [selectedLesson, setSelectedLesson] = useState('')
  const [activeLevel, setActiveLevel] = useState(0)
  const currentLanguage = useSelector((state) => state.lang.locale)
  const contentContainer = useRef()
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [showVideo, setShowVideo] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  const handleShowVideo = (video) => {
    setShowVideo(video.id);
  };

  // Course data
  const levels = [
    { title: 'Level 1: Entrepreneurship and You',description:'Welcome to Level 1', active: true },
    { title: 'Level 2: Understanding Learn to Start',description:'Welcome to Level 2', active: false },
    { title: 'Level 3: The Journey of Entrepreneurship',description:'Welcome to Level 3', active: false },
  ]

  const searchItems = [
    'The StarLog Studio - G.',
    'Course in Entrepreneur.',
    'Amr - backend-plastic.',
    'Index.js - IE-time - Yls.',
    'Vulcan Manual (DM)',
  ]

  // Replace the single lessonOptions with an object containing options for each level
  const lessonsByLevel = {
    0: [ // Level 1 options - matches modal structure
      { id: 'myths', title: "Myths of Entrepreneurship", status: 'done' },
      { id: 'definition', title: "Definition of Entrepreneurship", status: 'done' },
      { id: 'reasons', title: "Reasons Why Startups Fail", status: 'inProgress' },
      { id: 'skills', title: "Skills and Traits of Effective Entrepreneurs", status: 'notStarted' },
      { id: 'people', title: "People Buy Into People", status: 'notStarted' },
      { id: 'selfBrand', title: "Creating Your Self Brand First", status: 'notStarted' },
      { id: 'task1', title: "Task #1: Create your Individual Value Proposition", status: 'notStarted' },
      { id: 'task2', title: "Task #2: Create your I Am Video", status: 'notStarted' }
    ],
    1: [ // Level 2 options - matches modal structure
      { id: 'journey', title: "The Journey of Entrepreneurship", status: 'notStarted' },
      { id: 'intro', title: "An Introduction to the LTS Model and Four Environments", status: 'notStarted' },
      { id: 'coreSkills', title: "The Core Skills and LEARN Stage of the LTS Model", status: 'notStarted' },
      { id: 'develop', title: "The DEVELOP Stage of the LTS Model", status: 'notStarted' },
      { id: 'start', title: "Understanding START & the Test Metrics of LTS", status: 'notStarted' },
      { id: 'task3', title: "Task #3: Evaluate Your Mindset and Skill Set", status: 'notStarted' },
      { id: 'process', title: "The Process of Entrepreneurship", status: 'notStarted' },
      { id: 'task4', title: "Task #4: Build Your Team and Find Your Mentor", status: 'notStarted' }
    ],
    2: [ // Level 3 options - matches modal structure
      {
        id: "3.1",
        title: "Level 3.1: The Journey of Entrepreneurship",
        isParent: true,
        children: [
          { id: 'journey31', title: "The Journey of Entrepreneurship" },
          { id: 'process31', title: "The Process and Skill of Storytelling" },
          { id: 'relevancy', title: "Relevancy in World 4.0" },
          { id: 'learn', title: "The LEARN Stage" },
          { id: 'problems', title: "Problems Worth Solving" },
          { id: 'task5', title: "Task #5: Identify a Problem Worth Solving, Assumptions, and Market Trends" },
          { id: 'task6', title: "Task #6: Conduct an Industry Analysis" }
        ]
      },
      {
        id: "3.2",
        title: "Level 3.2: The Develop Stage",
        isParent: true,
        children: [
          { id: 'solution', title: "Finding the Solution" },
          { id: 'value', title: "Creating Your Startup's Value Proposition" },
          { id: 'task7', title: "Task #7: Create Your Startup's Value Proposition" },
          { id: 'testing', title: "Testing Your Startup's Value Proposition" },
          { id: 'task8', title: "Task #8: Conduct Market Validation for Your Startup's Value Proposition" },
          { id: 'inovation', title: "Understanding Innovation and Its Enemies" },
          { id: 'skills', title: "The Five Skills of Innovation" },
          { id: 'develop', title: "The DEVELOP Stage" },
          { id: 'task9', title: "Develop Your Startup's Business Model" },
          { id: 'task10', title: "Write Your Startup's Concept Plan" },
        ]
      },
      {
        id: "3.3",
        title: "Level 3.3: The Develop Stage",
        isParent: true,
        children: [
          { id: 'brand', title: "Definition of Brand" },
          { id: 'branding', title: "Branding Strategies" },
          { id: 'relation', title: "The Relationship Between Story and Brand" },
          { id: 'charter', title: "The Brand Charter" },
          { id: 'creating', title: "Task #11: Creating Your Startup's Brand Charter" },
          { id: 'vehicles', title: "The Brand Vehicles" },
          { id: 'task12', title: "Task #12: Create Your Startup's Brand Vehicles" },
          { id: 'fundamental', title: "The Fundamental Elements of Story" },
          { id: 'bussines', title: "Stories Your Bussines Can Tell" },
          { id: 'storyteller', title: "Embracing Your Inner Storyteller" },
          { id: 'task13', title: "Task #13: Conduct Focus Groups" },
          { id: 'marketing', title: "The Marketing Plan" },
          { id: 'task14', title: "Task #14: Creating Your Startup's Marketing Plan" },
        ]
      },
      {
        id: "3.4",
        title: "Level 3.4: The Start Stage",
        isParent: true,
        children: [
          { id: 'brand', title: "Introduction to the Business Plan" },
          { id: 'branding', title: "The Business Development Management Map" },
          { id: 'relation', title: "Task #15: Create Your Startup's Business Development Management Map" },
          { id: 'charter', title: "The Test Metric of Sustainability" },
          { id: 'creating', title: "Task #16: Test The Sustainability of Your Startup" },
          { id: 'vehicles', title: "The Process of Entrepreneurship Reintroduction" },
          { id: 'task12', title: "Parts of a Business Plan" },
          { id: 'fundamental', title: "Task #17: Write Your Startup's Business Plan" },
          { id: 'bussines', title: "The Test Metric of Efficiency" },
          { id: 'storyteller', title: "Task #18: Test the Efficiency of Your Startup" },
          { id: 'task13', title: "An Introduction to the Financial Plan" },
          { id: 'marketing', title: "Task #19: Create Your Startup's Financial Plan" },
          { id: 'task14', title: "Task #20: Test the Potential Profitability of Your Startup" },
          { id: 'task14', title: "Brand Generation" },
          { id: 'task14', title: "Business Plan Musts" },
          { id: 'task14', title: "Task #21: Write the Executive Summary of Your Startup's Business" },
          { id: 'task14', title: "Task #22: Create Your Startup's Brand Introductory Video" },
          { id: 'task14', title: "Selling You" },
          { id: 'task14', title: "Pitching Yourself" },
          { id: 'task14', title: "Reminders Going Forwards" },
          { id: 'task14', title: "Task #23: Create Your Final I Am Video" },
          { id: 'task14', title: "Task #24: Build Your Team and Find Your Mentor" },
          { id: 'task14', title: "Task #25: Build Your Startup's Final Pitch" },
        ]
      }
    ]
  };

  const [videos, setVideos] = useState([
    {
      id: 'level1video',
      url: 'https://d5tx03iw7t69i.cloudfront.net/Month_1/M1-Vid-1-Welcome-to-Level-1-V3.mp4',
      thumbnail: 'https://d5tx03iw7t69i.cloudfront.net/Month_1/M1-Vid-1-Thumbnail.jpg'
    },
    {
      id: 'level2video',
      url: 'https://d5tx03iw7t69i.cloudfront.net/Month_2/welcome-level2.mp4',
      thumbnail: 'https://d5tx03iw7t69i.cloudfront.net/Month_2/welcome-level2-thumb.jpg'
    },
    {
      id: 'level3video',
      url: 'https://d5tx03iw7t69i.cloudfront.net/Month_3/welcome-level3.mp4',
      thumbnail: 'https://d5tx03iw7t69i.cloudfront.net/Month_3/welcome-level3-thumb.jpg'
    }
  ]);

  async function getJournals(redir = true) {
    try {
      const { data } = await axiosInstance.get('/ltsJournals/', {
        params: {
          category: props.category,
          platform: props.category === 'market-ready' ? 'student' : 'instructor'
        }
      });
      setJournalsData(data);
      setJournals(data);
      setLoaded(true);
  
      if (data.length > 0 && redir) {
        if (data[0].children?.length > 0) {
          // Fixed template literal syntax
          history.push(`${props.match.url}/${data[0].children[0].id}`);
        } else {
          // Fixed template literal syntax
          history.push(
            `${props.match.url}/${
              props.location.search.split('?')[1] || data[0].id
            }`
          );
        }
      }
    } catch (err) {
      console.error('Error fetching journals:', err);
    }
  }

  function journalChanged(journal) {
    getJournals(false)
  }

  useEffect(() => {
    dispatch(changeSidebarState(false))
    getJournals()
  }, [dispatch])

  const handleJournalSearch = (e) => {
    const keyword = e.target.value.toLowerCase()
    setJournals(
      keyword 
        ? journalsData.filter(journal => 
            journal.title.toLowerCase().includes(keyword) || 
            journal.children.some(child => 
              child.title.toLowerCase().includes(keyword)
            )
          )
        : journalsData
    )
  }

  const handleLevelNavigation = (direction) => {
    setActiveLevel(prev => {
      const newLevel = direction === 'next' ? prev + 1 : prev - 1
      return Math.max(0, Math.min(levels.length - 1, newLevel))
    })
  }

  useEffect(() => {
    setSelectedLesson(''); // Reset selected lesson when level changes
  }, [activeLevel]);

  // Add this effect to update videos based on active level
  useEffect(() => {
    // Show only the video for the current level
    const currentVideo = videos.filter((video, index) => index === activeLevel);
    setVideos(currentVideo);
  }, [activeLevel]);

  return (
    <>
    <div id='main-body'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='px-0'>
            <div>
              {/* Course Header */}
              <div style={{margin: '40px 40px 40px 30px'}}>
              <h3 className="page-title" style={{ marginLeft: '20px' }}>
                           
                           Course in Entrepreneurship & Innovation
                          </h3>
                          <p  style={{ marginLeft: '20px' }}>
                          
                            Embarking on the Entrepreneurial Journey
                          </p>
              </div>

              <div >
                <div className='styled-scrollbar gradient-background-journal' ref={contentContainer}>
                  {/* Course Content */}
                  <div className='course-container'>
                    <div className='levels-container'>
                      {levels.map((level, index) => (
                        <div
                          key={index}
                          className={`course-level ${index === activeLevel ? 'active-level' : ''}`}
                          onClick={() => setActiveLevel(index)}
                        >
                          {level.title}
                        </div>
                      ))}
                    </div>

                    <div className='course-section'>
                    <div className='course-button-group'>
                    <div className="search-input-wrapper">
                    <div className='justify-content-between'>
            <div>
              <ModalInput
              
               className='course-btn search-journal'
               onChange={handleJournalSearch}
                id={'searchBar'}
                type={'search'}
                labelTitle={props.intl.formatMessage({
                  id: 'my_journal.search_journals',
                  defaultMessage: 'Search Journals'
                })}
                imgSrc={searchJ}
                imageStyle={{ filter: 'grayscale(1)' }}
              />
            </div>
          </div>
</div>

<div className="search-input-wrapper">
  <select 
    className='course-btn select-lesson search-journal-input' 
    value={selectedLesson}
    onChange={(e) => setSelectedLesson(e.target.value)}
  >
    <option value="">
      {props.intl.formatMessage({ 
        id: 'my_journal.select_lessons', 
        defaultMessage: 'Select Lessons to View' 
      })}
    </option>
    {lessonsByLevel[activeLevel].map(lesson => 
      lesson.isParent ? (
        <optgroup key={lesson.id} label={lesson.title} style={{color: '#333', fontWeight: 'bold'}}>
          {lesson.children.map(child => (
            <option key={child.id} value={child.id}>
              {child.title}
            </option>
          ))}
        </optgroup>
      ) : (
        <option key={lesson.id} value={lesson.id}>
          {lesson.title}
        </option>
      )
    )}
  </select>
</div>

                        <div style={{
                  display: 'inline-block',
                  borderRadius: '8px',
                  background:
                    'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                  padding: '1px',
                  height: '58px',
                  boxShadow: '0px 4px 10px 0px #00000040'
                }}>
                        <button className='review-progress-btn' onClick={toggleModal}>
  {props.intl.formatMessage({
    id: 'my_journal.review_course_progress',
    defaultMessage: 'Review Course Progress'
  })}
</button>
                        </div>
                      </div>
                    </div>

                  

                   
{/* 
                    <div className='course-dropdown-section'>
                      <select
                        className='course-dropdown'
                        value={selectedLesson}
                        onChange={(e) => setSelectedLesson(e.target.value)}
                      >
                        <option value="">
                          Select lesson to access
                        </option>
                        {journalsData.map(journal => (
                          <option key={journal.id} value={journal.id}>
                            {journal.title}
                          </option>
                        ))}
                      </select>
                    </div> */}

                    {/* <div className='course-signature-section'>
                      <div>SIGNATURE BY LIGHT TO SHIP USE</div>
                      <div className='course-learn-forward'>LEARNFORWARD</div>
                    </div> */}
         <div className="col-md-12 general-video-container">
  <div className="video-container-journal">
    <div>
      <div className="video-container-bg">
        <div className="video-title">
          <img src={circleIcon} alt="circle-icon" />
          <h6>{levels[activeLevel].description}</h6>
        </div>
        {videos && videos.map((video, index) => (
          <MediaLightbox
            key={index}
            video={video}
            show={showVideo === video.id}
            onClose={() => setShowVideo(false)}
            handleShowVideo={() => handleShowVideo(video)}
          />
        ))}
        {videos && videos.constructor === Array && videos.length > 0 && (
          <div className={`journal-entries__videos journal-entries__videos--${videos.length > 1 ? 'multiple' : 'single'}`}>
            {videos.map((video, index) => (
              <div key={index} className="journal-entries__video">
                <div 
                  className="journal-entries__video-thumbnail"
                  onClick={() => handleShowVideo(video)}
                >
                  <img src={video.thumbnail} alt="thumbnail" />
                  <div className="journal-entries__video-thumbnail-icon">
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className='course-navigation'>
          <button className='course-nav-btn' onClick={() => handleLevelNavigation('previous')}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Previous
          </button>
          <button className='course-nav-btn' onClick={() => handleLevelNavigation('next')}>
            Next
            <FontAwesomeIcon icon={faArrowRight}/>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div className='content-container'>
    <img src={UserIcon} style={{ width:'55%',height:'50%'}} alt="user" />
  </div>
</div>

                    {/* <div className='course-search-section'>
                      {searchItems.map((item, index) => (
                        <div key={index} className='course-search-item'>
                          {item}
                        </div>
                      ))}
                    </div> */}
                  </div>

                  {/* Existing Journal Content */}
                  <Switch>
                    <Route
                      path={`${props.match.url}/:journalId`}
                      render={(renderProps) => (
                        <LtsJournalContent
                          {...renderProps}
                          contentContainer={contentContainer}
                          backRoute={props.match.url}
                          saved={journalChanged}
                        />
                      )}
                    />
                  </Switch>
                </div>

                {/* Existing Sidebar */}
                <div className='page-card__sidebar col-lg-4 col-md-5'>
                  {/* <div className='page-card__sidebar-header'>
                    <label className='search-input'>
                      <img className='search-input__icon' src={searchIcon} alt='Search' />
                      <input
                        type='text'
                        className='search-input__input'
                        name='searchedNote'
                        placeholder={props.intl.formatMessage({
                          id: 'my_journal.search_journals',
                          defaultMessage: 'Search Journals'
                        })}
                        onChange={handleJournalSearch}
                      />
                    </label>
                  </div> */}

                  <div className='page-card__sidebar-content styled-scrollbar'>
                    <Accordion defaultActiveKey='0' className='accordion-menu lizas-accordion'>
                      {journals.map((journalItem, journalItemIdx) => (
                        <div key={journalItem.id} className='accordion-menu__item cursor-pointer accordion-menu__item-transition'>
                          {journalItem.children?.length ? (
                            <>
                              <Accordion.Toggle
                                as='a'
                                href='#'
                                className='accordion-menu__item-toggle'
                                eventKey={`${journalItemIdx}`}
                                onClick={() => journalItem.content && history.push(`${props.match.url}/${journalItem.id}`)}
                              >
                                <span>{journalItem.title}</span>
                                <FontAwesomeIcon icon={faAngleDown} />
                              </Accordion.Toggle>

                              <Accordion.Collapse eventKey={`${journalItemIdx}`}>
                                <ul className='accordion-menu__submenu'>
                                  {journalItem.children.map((journalChildren) => (
                                    <li key={journalChildren.id} className='accordion-menu__submenu-item'>
                                      <NavLink to={`${props.match.url}/${journalChildren.id}`}>
                                        <div className='accordion-menu__submenu-item-icon'>
                                          <FontAwesomeIcon icon={faFileAlt} />
                                        </div>
                                        <div className='accordion-menu__submenu-item-details'>
                                          <h5 className='accordion-menu__submenu-item-title'>
                                            {journalChildren.title}
                                          </h5>
                                          {journalChildren.userEntry?.[0]?.createdAt ? (
                                            <div className='accordion-menu__submenu-item-subtitle'>
                                              {moment(journalChildren.userEntry[0].createdAt)
                                                .locale(currentLanguage)
                                                .format('MMMM D, YYYY | hh:mma')}
                                            </div>
                                          ) : (
                                            <div className='accordion-menu__submenu-item-subtitle accordion-menu__submenu-item-subtitle--not-started'>
                                              NOT STARTED
                                            </div>
                                          )}
                                        </div>
                                      </NavLink>
                                    </li>
                                  ))}
                                </ul>
                              </Accordion.Collapse>
                            </>
                          ) : (
                            <NavLink 
                              to={`${props.match.url}/${journalItem.id}`} 
                              className='accordion-menu__item-toggle'
                            >
                              <span>{journalItem.title}</span>
                            </NavLink>
                          )}
                        </div>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {modal && (
       <Modal isOpen={modal} toggle={toggleModal} className='certificate-modal'>
       <span
         className=' cursor-pointer'
         onClick={toggleModal}
         style={{ zIndex: '1' }}
       >
         <img className='left-arrow-modal' src={leftArrow} alt='left' />
       </span>
       <ModalBody>
         <img src={progressLogo} alt='user' className='mb-3' />
         <div className='d-flex justify-content-between align-items-center'>
           <h3 className='fs-14' style={{ marginBottom: '0' }}>
             View Progress Details
           </h3>
         </div>

         <div className='accordion mt-5' id='progressAccordion'>
           <div className='accordion-item progress-details-accordion'>
             <h2 className='accordion-header' id='headingOne'>
               <button
                 className='accordion-button collapsed text-secondary fw-medium'
                 type='button'
                 data-bs-toggle='collapse'
                 data-bs-target='#collapseOne'
                 aria-expanded='false'
                 aria-controls='collapseOne'
               >
                 LEVEL 1 | The Myths of Entrepreneurship
               </button>
             </h2>
             <div
               id='collapseOne'
               className='accordion-collapse collapse'
               aria-labelledby='headingOne'
               data-bs-parent='#progressAccordion'
             >
               <div className='accordion-body d-flex gap-4'>
                 <div className='d-flex flex-column gap-4'>
                   <CircularProgress percentage={20} level={1} />
                 </div>
                 <div className='d-flex flex-column gap-3'>
                   <ProgressDone title={'Myths of Entrepreneurship'} />
                   <ProgressDone title={'Definition of Entrepreneurship'} />
                   <InProggresCourse title={'Reasons Why Startups Fail'} />
                   <CourseNotStarted
                     title={'Skills and Traits of Effective Entrepreneus'}
                   />
                   <CourseNotStarted title={'People Buy Into People'} />
                   <CourseNotStarted
                     title={'Creating Your Self Brand First'}
                   />
                   <CourseNotStarted
                     title={
                       'Task #1: Create your Individual Value Proposition'
                     }
                   />
                   <CourseNotStarted
                     title={'Task #2: Create your I Am Video'}
                   />
                 </div>
               </div>
             </div>
           </div>

           <div className='accordion-item progress-details-accordion'>
             <h2 className='accordion-header ' id='headingTwo'>
               <button
                 className='accordion-button collapsed  text-secondary fw-medium'
                 type='button'
                 data-bs-toggle='collapse'
                 data-bs-target='#collapseTwo'
                 aria-expanded='false'
                 aria-controls='collapseTwo'
               >
                 LEVEL 2 | Understanding Learn to Start
               </button>
             </h2>
             <div
               id='collapseTwo'
               className='accordion-collapse collapse'
               aria-labelledby='headingTwo'
               data-bs-parent='#progressAccordion'
             >
               <div className='accordion-body d-flex gap-4'>
                 <div className='d-flex flex-column gap-4'>
                   <CircularProgress percentage={0} level={2} />
                 </div>
                 <div className='d-flex flex-column gap-3'>
                   <CourseNotStarted title='The Journey of Entrepreneurship' />
                   <CourseNotStarted title='An Introduction to the LTS Model and Four Environments' />
                   <CourseNotStarted title='The Core Skills and LEARN Stage of the LTS Model' />
                   <CourseNotStarted title='The DEVELOP Stage of the LTS Model' />
                   <CourseNotStarted title='Understanding START & the Test Metrics of LTS' />
                   <CourseNotStarted title='Task #3: Evaluate Your Mindset and Skill Set' />
                   <CourseNotStarted title='The Process of Entrepreneurship' />
                   <CourseNotStarted title='Task #4: Build Your Team and Find Your Mentor' />
                 </div>
               </div>
             </div>
           </div>

           <div className='accordion-item progress-details-accordion'>
             <h2 className='accordion-header' id='headingThree'>
               <button
                 className='accordion-button collapsed  text-secondary fw-medium'
                 type='button'
                 data-bs-toggle='collapse'
                 data-bs-target='#collapseThree'
                 aria-expanded='false'
                 aria-controls='collapseThree'
               >
                 LEVEL 3 | The LEARN Stage
               </button>
             </h2>
             <div
               id='collapseThree'
               className='accordion-collapse collapse'
               aria-labelledby='headingThree'
               data-bs-parent='#progressAccordion'
             >
               <div className='accordion-body d-flex gap-4'>
                 <div className='d-flex flex-column gap-4'>
                   <CircularProgress percentage={0} level={3} />
                 </div>
                 <div className='d-flex flex-column gap-3 text-black'>
                   <p className='mb-0'>
                     Level 3.1: The Journey of Entrepreneurship
                   </p>
                   <CourseNotStarted title='The Journey of Entrepreneurship' />
                   <CourseNotStarted title='The Process and Skill of Storytelling' />
                   <CourseNotStarted title='Relevancy in World 4.0' />
                   <CourseNotStarted title='The LEARN Stage' />
                   <CourseNotStarted title='Problems Worth Solving' />
                   <CourseNotStarted title='Task #5: Identify a Problem Worth Solving, Assumptions, and Market Trends' />
                   <CourseNotStarted title='Task #6: Conduct an Industry Analysis' />
                   <p className='mb-0'>Level 3.2: The Develop Stage</p>
                   <CourseNotStarted title='Finding the Solution' />
                   <CourseNotStarted title="Creating Your Startup's Value Proposition" />
                   <CourseNotStarted title="Task #7: Create Your Startup's Value Proposition" />
                   <CourseNotStarted title="Testing Your Startup's Value Proposition" />
                   <CourseNotStarted title="Task #8: Conduct Market Validation for Your Startup's Value Proposition" />
                   <CourseNotStarted title='Understanding Innovation and Its Enemies' />
                   <CourseNotStarted title='The Five Skills of Innovation' />
                   <CourseNotStarted title='The DEVELOP Stage' />
                   <CourseNotStarted title="Task #9: Develop Your Startup's Business Model" />
                   <CourseNotStarted title="Task #10: Write Your Startup's Concept Plan" />
                   <p className='mb-0'>Level 3.3: The Brand Stage</p>
                   <CourseNotStarted title='Definition of Brand' />
                   <CourseNotStarted title='Branding Strategies' />
                   <CourseNotStarted title='The Relationship Between Story and Brand' />
                   <CourseNotStarted title='The Brand Charter' />
                   <CourseNotStarted title="Task #11: Creating Your Startup's Brand Charter" />
                   <CourseNotStarted title='The Brand Vehicles' />
                   <CourseNotStarted title="Task #12: Create Your Startup's Brand Vehicles" />
                   <CourseNotStarted title='The Fundamental Elements of Story' />
                   <CourseNotStarted title='Stories Your Business Can Tell' />
                   <CourseNotStarted title='Embracing Your Inner Storyteller' />
                   <CourseNotStarted title='Task #13: Conduct Focus Groups' />
                   <CourseNotStarted title='The Marketing Plan' />
                   <CourseNotStarted title="Task #14: Creating Your Startup's Marketing Plan" />
                   <p className='mb-0'>Level 3.4: The Start Stage</p>
                   <CourseNotStarted title='Introduction to the Business Plan' />
                   <CourseNotStarted title='The Business Development Management Map' />
                   <CourseNotStarted title="Task #15: Create Your Startup's Business Development Management Map" />
                   <CourseNotStarted title='The Test Metric of Sustainability' />
                   <CourseNotStarted title='Task #16: Test the Sustainability of Your Startup' />
                   <CourseNotStarted title='The Process of Entrepreneurship Reintroduction' />
                   <CourseNotStarted title='Parts of a Business Plan' />
                   <CourseNotStarted title="Task #17: Write Your Startup's Business Plan" />
                   <CourseNotStarted title='The Test Metric of Efficiency' />
                   <CourseNotStarted title='Task #18: Test the Efficiency of Your Startup' />
                   <CourseNotStarted title='An Introduction to the Financial Plan' />
                   <CourseNotStarted title="Task #19: Create Your Startup's Financial Plan" />
                   <CourseNotStarted title='The Test Metric of Profitability' />
                   <CourseNotStarted title='Task #20: Test the Potential Profitability of Your Startup' />
                   <CourseNotStarted title='Brand Generation' />
                   <CourseNotStarted title='Business Plan Musts' />
                   <CourseNotStarted title="Task #21: Write the Executive Summary of Your Startup's Business Plan" />
                   <CourseNotStarted title="Task #22: Create Your Startup's Brand Introductory Video" />
                   <CourseNotStarted title='Selling You' />
                   <CourseNotStarted title='Pitching Yourself' />
                   <CourseNotStarted title='Reminders Going Forward' />
                   <CourseNotStarted title='Task #23: Create Your Final I Am Video' />
                   <CourseNotStarted title='Task #4: Build Your Team and Find Your Mentor' />
                   <CourseNotStarted title="Task #24: Build Your Startup's Final Pitch" />
                 </div>
               </div>
             </div>
           </div>
         </div>
       </ModalBody>
     </Modal>
    )}
    </>
  )
}

export default injectIntl(LtsJournal)