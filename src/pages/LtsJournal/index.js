import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useHistory, Switch, Route, useParams, Redirect } from 'react-router-dom'
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
import ModalInput from '../../components/ModalInput/ModalInput'
import searchJ from '../../assets/images/academy-icons/search.png'
import MediaLightbox from '../../components/MediaLightbox';
import ReactQuill from 'react-quill'; 
import lockSign from '../../assets/images/academy-icons/lock.png'
import circleSign from '../../assets/images/academy-icons/circle-fill.png'
import tickSign from '../../assets/images/academy-icons/tick-sign.png'
import SelectLessons from './SelectLessons'
import { fetchLtsCoursefinishedContent } from '../../redux/course/Actions';



function LtsJournal(props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const { journalId } = useParams(); 
  const [journals, setJournals] = useState([])
  const [journalsData, setJournalsData] = useState([])
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [activeLevel, setActiveLevel] = useState(0)
  const [editorContent, setEditorContent] = useState(''); 
  const currentLanguage = useSelector((state) => state.lang.locale)
  const contentContainer = useRef()
  const [modal, setModal] = useState(false);
  const toggleModal = () => setModal(!modal);
  const [showVideo, setShowVideo] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Track the current video index

  const { finishedContent, levelProgress, loading } = useSelector(
    (state) => state.course
  );

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

  const lessonsByLevel = {
  0: [ 
    { id: 'myths', title: "Myths of Entrepreneurship", status: 'done', redirectId: 51 },
    { id: 'definition', title: "Definition of Entrepreneurship", status: 'done', redirectId: 52 },
    { id: 'reasons', title: "Reasons Why Startups Fail", status: 'inProgress', redirectId: 53 },
    { id: 'skills', title: "Skills and Traits of Effective Entrepreneurs", status: 'notStarted', redirectId: 54 },
    { id: 'people', title: "People Buy Into People", status: 'notStarted', redirectId: 55 },
    { id: 'selfBrand', title: "Creating Your Self Brand First", status: 'notStarted', redirectId: 56 },
    { id: 'task1', title: "Task #1: Create your Individual Value Proposition", status: 'notStarted', redirectId: 57 },
    { id: 'task2', title: "Task #2: Create your I Am Video", status: 'notStarted', redirectId: 58 }
  ],
  1: [
    { id: 'journey', title: "The Journey of Entrepreneurship", status: 'notStarted', redirectId: 60 },
    { id: 'intro', title: "An Introduction to the LTS Model and Four Environments", status: 'notStarted', redirectId: 61 },
    { id: 'coreSkills', title: "The Core Skills and LEARN Stage of the LTS Model", status: 'notStarted', redirectId: 62 },
    { id: 'develop', title: "The DEVELOP Stage of the LTS Model", status: 'notStarted', redirectId: 63 },
    { id: 'start', title: "Understanding START & the Test Metrics of LTS", status: 'notStarted', redirectId: 65 },
    { id: 'task3', title: "Task #1: Evaluate Your Mindset and Skill Set", status: 'notStarted', redirectId: 66 },
    { id: 'process', title: "The Process of Entrepreneurship", status: 'notStarted', redirectId: 67 },
    { id: 'task4', title: "Task #2: Build Your Team and Find Your Mentor", status: 'notStarted', redirectId: 68 },
  ],
  2: [
    {
      id: "3.1",
      title: "Level 3.1: The Journey of Entrepreneurship",
      isParent: true,
      children: [
        { id: 'journey31', title: "The Journey of Entrepreneurship", status: 'notStarted', redirectId: 70 },
        { id: 'process31', title: "The Process and Skill of Storytelling", redirectId: 71 },
        { id: 'relevancy', title: "Relevancy in World 4.0", redirectId: 72 },
        { id: 'learn', title: "The LEARN Stage", redirectId: 73 },
        { id: 'problems', title: "Problems Worth Solving", redirectId: 74 },
        { id: 'task5', title: "Task #5: Identify a Problem Worth Solving, Assumptions, and Market Trends", redirectId: 75 },
        { id: 'task6', title: "Task #6: Conduct an Industry Analysis", redirectId: 76 }
      ]
    },
    {
      id: "3.2",
      title: "Level 3.2: The Develop Stage",
      isParent: true,
      children: [
        { id: 'solution', title: "Finding the Solution", redirectId: 78 },
        { id: 'value', title: "Creating Your Startup's Value Proposition", redirectId: 79 },
        { id: 'task7', title: "Task #7: Create Your Startup's Value Proposition", redirectId: 80 },
        { id: 'testing', title: "Testing Your Startup's Value Proposition", redirectId: 81 },
        { id: 'task8', title: "Task #8: Conduct Market Validation for Your Startup's Value Proposition", redirectId: 82 },
        { id: 'inovation', title: "Understanding Innovation and Its Enemies", redirectId: 85 },
        { id: 'skills', title: "The Five Skills of Innovation", redirectId: 86 },
        { id: 'develop', title: "The DEVELOP Stage", redirectId: 87 },
        { id: 'task9', title: "Task #9: Develop Your Startup's Business Model", redirectId: 88 },
        { id: 'task10', title: "Write Your Startup's Concept Plan", redirectId: 89 }
      ]
    },
    {
      id: "3.3",
      title: "Level 3.3: The Develop Stage",
      isParent: true,
      children: [
        { id: 'brand', title: "Definition of Brand", redirectId: 91 },
        { id: 'branding', title: "Branding Strategies", redirectId: 92 },
        { id: 'relation', title: "The Relationship Between Story and Brand", redirectId: 93 },
        { id: 'charter', title: "The Brand Charter&Task #11: Creating Your Startup's Brand Charter",redirectId:94},
        { id: 'vehicles', title: "The Brand Vehicles", redirectId: 95},
        { id: 'task12', title: "Task #12: Create Your Startup's Brand Vehicles", redirectId: 96},
        { id: 'fundamental', title: "The Fundamental Elements of Story", redirectId: 97},
        { id: 'bussines', title: "Stories Your Business Can Tell", redirectId: 98},
        { id: 'storyteller', title: "Embracing Your Inner Storyteller", redirectId:99},
        { id: 'task13', title: "Task #13: Conduct Focus Groups", redirectId: 100},
        { id: 'marketing', title: "The Marketing Plan", redirectId: 101 },
        { id: 'task14', title: "Task #14: Creating Your Startup's Marketing Plan", redirectId: 102 }
      ]
    },
    {
      id: "3.4",
      title: "Level 3.4: The Start Stage",
      isParent: true,
      children: [
        { id: 'brand1', title: "Introduction to the Business Plan", redirectId: 104 },
        { id: 'branding', title: "The Business Development Management Map", redirectId: 105 },
        { id: 'relation', title: "Task #15: Create Your Startup's Business Development Management Map", redirectId: 106 },
        { id: 'charter', title: "The Test Metric of Sustainability", redirectId: 107 },
        { id: 'creating', title: "Task #16: Test The Sustainability of Your Startup", redirectId: 108 },
        { id: 'vehicles', title: "The Process of Entrepreneurship Reintroduction", redirectId: 109 },
        { id: 'task12', title: "Parts of a Business Plan", redirectId: 110 },
        { id: 'fundamental', title: "Task #17: Write Your Startup's Business Plan", redirectId: 111 },
        { id: 'bussines', title: "The Test Metric of Efficiency", redirectId: 112 },
        { id: 'storyteller', title: "Task #18: Test the Efficiency of Your Startup", redirectId: 113 },
        { id: 'task13', title: "An Introduction to the Financial Plan", redirectId: 114 },
        { id: 'marketing', title: "Task #19: Create Your Startup's Financial Plan", redirectId: 115 },
        { id: 'task14', title: "The Test Metric of Profitability", redirectId: 116 },
        { id: 'profitability', title: "Task #20: Test the Potential Profitability of Your Startup", redirectId: 117 },
        { id: 'generation', title: "Brand Generation", redirectId: 118 },
        { id: 'plan', title: "Business Plan Musts", redirectId: 119 },
        { id: 'executive', title: "Task #21: Write the Executive Summary of Your Startup's Business", redirectId: 120 },
        { id: 'introductory', title: "Task #22: Create Your Startup's Brand Introductory Video", redirectId: 121 },
        { id: 'selling', title: "Selling You", redirectId: 122 },
        { id: 'pitching', title: "Pitching Yourself", redirectId: 123 },
        { id: 'reminders', title: "Reminders Going Forwards", redirectId: 124 },
        { id: 'final', title: "Task #23: Create Your Final I Am Video", redirectId: 125 },
        // { id: 'task4', title: "Task #4: Build Your Team and Find Your Mentor",redirectId:126},
        { id: 'task24', title: "Task #24: Build Your Startup's Final Pitch",redirectId:126}
      ]
    }
  ]
};

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
          history.push(`${props.match.url}/${data[0].children[0].id}`);
        } else {
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

  useEffect(() => {
    dispatch(fetchLtsCoursefinishedContent());
  }, [dispatch]);

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
    setSelectedLesson(null); 
  }, [activeLevel]);

  
  useEffect(() => {
    const currentVideo = videos.filter((video, index) => index === activeLevel);
    setVideos(currentVideo);
  }, [activeLevel]);

  useEffect(() => {
    const matchedVideos = videos.filter((video) => video.redirectId === parseInt(journalId));
    if (matchedVideos.length > 0) {
      setVideos(matchedVideos); 
      setCurrentVideoIndex(0);
    } else {
      setVideos([]);
    }
  }, [journalId]);

  useEffect(() => {

    const levelVideos = videos.filter((video) => {
      const levelRedirectIds = lessonsByLevel[activeLevel]?.map((lesson) => lesson.redirectId);
      return levelRedirectIds?.includes(video.redirectId);
    });
    setVideos(levelVideos);
  }, [activeLevel]);

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const getOptionStatus = (redirectId, lessons, isLevel3 = false) => {
    // Special handling for level 3
    if (isLevel3) {
      // Get all children from all sections flattened into a single array
      const allLevel3Content = lessonsByLevel[2]
        .flatMap(section => section.children)
        .sort((a, b) => a.redirectId - b.redirectId);

      const index = allLevel3Content.findIndex(item => item.redirectId === redirectId);
      const lastCompletedIndex = allLevel3Content.findIndex(item => {
        const nextItem = allLevel3Content[allLevel3Content.indexOf(item) + 1];
        return finishedContent.includes(item.redirectId) && 
               (!nextItem || !finishedContent.includes(nextItem.redirectId));
      });

      if (finishedContent.includes(redirectId)) {
        return { status: 'done', disabled: false };
      } else if (index === lastCompletedIndex + 1) {
        return { status: 'inProgress', disabled: false };
      } else {
        return { status: 'notStarted', disabled: true };
      }
    }

    // Regular handling for other levels remains the same
    const index = lessons.findIndex(lesson => lesson.redirectId === redirectId);
    const lastCompletedIndex = lessons.findIndex(lesson => {
      const nextItemIndex = lessons.indexOf(lesson) + 1;
      return finishedContent.includes(lesson.redirectId) && 
             (!lessons[nextItemIndex] || !finishedContent.includes(lessons[nextItemIndex].redirectId));
    });

    if (finishedContent.includes(redirectId)) {
      return { status: 'done', disabled: false };
    } else if (index === lastCompletedIndex + 1) {
      return { status: 'inProgress', disabled: false };
    } else {
      return { status: 'notStarted', disabled: true };
    }
  };

  const options = lessonsByLevel[activeLevel]?.flatMap((lesson, index) => {
    if (activeLevel === 2) {
      const parentOption = {
        value: `${lesson.id}_parent`,
        label: lesson.title,
        textColor: 'text-dark',
        fontWeight: 'bolder',
        disabled: false
      };
  
      const childOptions = lesson.children?.map(child => {
        const status = getOptionStatus(
          child.redirectId,
          lesson.children,
          true
        );
  
        return {
          value: `${lesson.id}_${child.id}`, // Create unique value by combining parent and child IDs
          label: child.title,
          icon: status.status === 'done' ? tickSign :
            status.status === 'inProgress' ? circleSign :
              lockSign,
          textColor: status.status === 'notStarted' ? 'text-secondary' : 'text-dark',
          disabled: status.disabled,
          redirectId: child.redirectId,
          parentId: lesson.id // Add parent ID reference
        };
      });
  
      return [parentOption, ...(childOptions || [])];
    }
  
    const status = getOptionStatus(
      lesson.redirectId,
      lessonsByLevel[activeLevel]
    );
  
    return {
      value: lesson.id,
      label: lesson.title,
      icon: status.status === 'done' ? tickSign :
        status.status === 'inProgress' ? circleSign :
          lockSign,
      textColor: status.status === 'notStarted' ? 'text-secondary' : 'text-dark',
      disabled: status.disabled,
      redirectId: lesson.redirectId
    };
  });

  const isContentAccessible = (journalId) => {
    const numericId = parseInt(journalId);
    
    if (finishedContent.includes(numericId)) {
      return true;
    }
  
    // Find the last completed ID from all levels
    const lastCompletedId = Math.max(...finishedContent);
  
    // For level 3, check if previous level is completed
    if (numericId === 70) {
      const lastLevel2Item = lessonsByLevel[1][lessonsByLevel[1].length - 1];
      return finishedContent.includes(lastLevel2Item.redirectId);
    }
  
    for (let level = 0; level <= 2; level++) {
      const lessons = lessonsByLevel[level];
      if (!lessons) continue;
  
      if (level === 2) {
        for (const section of lessons) {
          const children = section.children || [];
          for (let i = 0; i < children.length; i++) {
            if (children[i].redirectId === numericId) {
              if (i === 0 && section === lessons[0]) {
                // First item of level 3, check if last item of level 2 is completed
                const lastLevel2Item = lessonsByLevel[1][lessonsByLevel[1].length - 1];
                return finishedContent.includes(lastLevel2Item.redirectId);
              }
              return i === 0 || finishedContent.includes(children[i - 1].redirectId);
            }
          }
        }
      } else {
        // Regular handling for levels 1 and 2
        for (let i = 0; i < lessons.length; i++) {
          if (lessons[i].redirectId === numericId) {
            if (i === 0 && level === 0) return true;
            
            if (i === 0) {
              const prevLevelLessons = lessonsByLevel[level - 1];
              const lastItemPrevLevel = prevLevelLessons[prevLevelLessons.length - 1];
              return finishedContent.includes(lastItemPrevLevel.redirectId);
            }
            return finishedContent.includes(lessons[i - 1].redirectId);
          }
        }
      }
    }
    return false;
  };

  const getCourseStatus = (redirectId) => {
    if (finishedContent.includes(redirectId)) {
      return 'done';
    }
  
    const nextAvailableId = finishedContent.length > 0 ? 
      Math.min(...finishedContent.map(id => id + 1)) : 51;
  
    if (redirectId === nextAvailableId) {
      return 'inProgress';
    }
  
    return 'notStarted';
  };

  return (
    <>
    <div id='main-body'>
      <div className='container-fluid'>
        <div className='row'>
          <div className='px-0'>
            <div>
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
                  id: 'my_journal.search_lessons',
                  defaultMessage: 'Search lessons'
                })}
                imgSrc={searchJ}
                imageStyle={{ filter: 'grayscale(1)' }}
              />
            </div>
          </div>
</div>

<div className="select-lessons">
  <SelectLessons
    options={options}
    selectedCourse={selectedLesson}
    setSelectedCourse={(selectedOption) => {
      if (!selectedOption || !selectedOption.value) {
        console.error('Invalid selected option:', selectedOption);
        return;
      }

      setSelectedLesson(selectedOption);

      if (activeLevel === 2) {
        const [parentId, childId] = selectedOption.value.split('_');
        if (childId === 'parent') return; // Skip parent options

        // Find the correct section and child based on both parent and child IDs
        const selectedSection = lessonsByLevel[2].find(section => section.id === parentId);
        const selectedLesson = selectedSection?.children?.find(child => child.id === childId);

        if (selectedLesson?.redirectId) {
          history.push(`/my-course-in-entrepreneurship/journal/${selectedLesson.redirectId}`);
        }
      } else {
        const selectedLesson = lessonsByLevel[activeLevel]?.find(
          lesson => lesson.id === selectedOption.value
        );

        if (selectedLesson?.redirectId) {
          history.push(`/my-course-in-entrepreneurship/journal/${selectedLesson.redirectId}`);
        }
      }
    }}
  />
</div>

                        <div
                        className='review-course-btn'
                         style={{
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

                  

                   

         {/* <div className="col-md-12 general-video-container"> */}
  {/* <div className="video-container-journal">
    <div>
      <div className="video-container-bg">
        <div className="video-title">
          <img src={circleIcon} alt="circle-icon" />
          <h6>{levels[activeLevel]?.description}</h6>
        </div>
        {videos.length > 0 && (
          <>
            <ReactPlayer
              url={videos[currentVideoIndex].url}
              controls
              width="100%"
              height="auto"
              light={videos[currentVideoIndex].thumbnail}
            />
            <div className="video-navigation-buttons d-flex justify-content-between mt-3">
              <button
                className="btn btn-primary"
                onClick={handlePreviousVideo}
                disabled={currentVideoIndex === 0}
              >
                Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNextVideo}
                disabled={currentVideoIndex === videos.length - 1}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div> */}
  {/* <div className='content-container'>
    <ReactQuill
      theme="snow"
      value={editorContent}
      onChange={setEditorContent}
      placeholder="Write your notes here..."
    />
  </div> */}
{/* </div> */}

                  </div>

                  <Switch>
                    <Route
                      path={`${props.match.url}/:journalId`}
                      render={(renderProps) => {
                        const { journalId } = renderProps.match.params;
                        
                        if (!isContentAccessible(journalId)) {
                          return <Redirect to={`${props.match.url}/51`} />;
                        }
              
                        return (
                          <LtsJournalContent
                            {...renderProps}
                            contentContainer={contentContainer}
                            backRoute={props.match.url}
                            saved={journalChanged}
                          />
                        );
                      }}
                    />
                  </Switch>
                </div>

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
         <img className='left-arrow' src={leftArrow} alt='left'  />
       </span>
       <ModalBody>
         <img src={progressLogo} alt='user' className='mb-3' />
         <div className='d-flex justify-content-between align-items-center'>
           <h3 className='fs-14' style={{ marginBottom: '0' }}>
             View Progress Details
           </h3>
         </div>

         <div className='accordion mt-5' id='progressAccordion'>
           {/* Level 1 */}
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
                   <CircularProgress 
                     percentage={levelProgress?.level1?.percentage || 0} 
                     level={1} 
                   />
                 </div>
                 <div className='d-flex flex-column gap-3'>
                   {lessonsByLevel[0].map(lesson => {
                     const status = getCourseStatus(lesson.redirectId);
                     return status === 'done' ? (
                       <ProgressDone title={lesson.title} />
                     ) : status === 'inProgress' ? (
                       <InProggresCourse title={lesson.title} />
                     ) : (
                       <CourseNotStarted title={lesson.title} />
                     );
                   })}
                 </div>
               </div>
             </div>
           </div>

           {/* Level 2 */}
           <div className='accordion-item progress-details-accordion'>
             <h2 className='accordion-header' id='headingTwo'>
               <button
                 className='accordion-button collapsed text-secondary fw-medium'
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
                   <CircularProgress 
                     percentage={levelProgress?.level2?.percentage || 0} 
                     level={2} 
                   />
                 </div>
                 <div className='d-flex flex-column gap-3'>
                   {lessonsByLevel[1].map(lesson => {
                     const status = getCourseStatus(lesson.redirectId);
                     return status === 'done' ? (
                       <ProgressDone title={lesson.title} />
                     ) : status === 'inProgress' ? (
                       <InProggresCourse title={lesson.title} />
                     ) : (
                       <CourseNotStarted title={lesson.title} />
                     );
                   })}
                 </div>
               </div>
             </div>
           </div>

           {/* Level 3 */}
           <div className='accordion-item progress-details-accordion'>
             <h2 className='accordion-header' id='headingThree'>
               <button
                 className='accordion-button collapsed text-secondary fw-medium'
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
                   <CircularProgress 
                     percentage={levelProgress?.level3?.percentage || 0} 
                     level={3} 
                   />
                 </div>
                 <div className='d-flex flex-column gap-3 text-black'>
                   {lessonsByLevel[2].map(section => (
                     <>
                       <p className='mb-0'>{section.title}</p>
                       {section.children.map(lesson => {
                         const status = getCourseStatus(lesson.redirectId);
                         return status === 'done' ? (
                           <ProgressDone title={lesson.title} />
                         ) : status === 'inProgress' ? (
                           <InProggresCourse title={lesson.title} />
                         ) : (
                           <CourseNotStarted title={lesson.title} />
                         );
                       })}
                     </>
                   ))}
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