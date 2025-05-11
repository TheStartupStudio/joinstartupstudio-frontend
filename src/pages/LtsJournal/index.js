import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  NavLink,
  useHistory,
  Switch,
  Route,
  useParams,
  Redirect,
  useLocation
} from 'react-router-dom'
import { injectIntl } from 'react-intl'
import 'react-quill/dist/quill.snow.css'
import './ltsjournal.css'
import ReactPlayer from 'react-player'
import Accordion from 'react-bootstrap/Accordion'
import { changeSidebarState } from '../../redux'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faFileAlt,
  faSearch,
  faUser,
  faArrowLeft,
  faArrowRight,
  faPlay,
  faTimes,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'
import IntlMessages from '../../utils/IntlMessages'
import axiosInstance from '../../utils/AxiosInstance'
import searchIcon from '../../assets/images/search-icon.png'
import circleIcon from '../../assets/images/circle-user-icon.png'
import UserIcon from '../../assets/images/user-icon-journal.png'
import LtsJournalContent from './content'
import LtsJournalReflection from './reflection'
import { Modal, ModalBody } from 'reactstrap'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import progressLogo from '../../assets/images/academy-icons/progress-details-logo.png'
import CircularProgress from '../../components/ProgressBar'
import ProgressDone from '../../components/CourseProgress/ProgressDone'
import InProggresCourse from '../../components/CourseProgress/InProggresCourse'
import CourseNotStarted from '../../components/CourseProgress/CourseNotStarted'
import ModalInput from '../../components/ModalInput/ModalInput'
import searchJ from '../../assets/images/academy-icons/search.png'
import MediaLightbox from '../../components/MediaLightbox'
import ReactQuill from 'react-quill'
import lockSign from '../../assets/images/academy-icons/lock.png'
import circleSign from '../../assets/images/academy-icons/circle-fill.png'
import tickSign from '../../assets/images/academy-icons/tick-sign.png'
import SelectLessons from './SelectLessons'
import { fetchLtsCoursefinishedContent } from '../../redux/course/Actions'
import SelectLanguage from '../../components/SelectLanguage/SelectLanguage'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import WhoAmI from '../../assets/images/academy-icons/WhoAmI.png'
import { toast } from 'react-toastify'
import FoulWords from '../../utils/FoulWords'
import { JOURNALS } from '../../utils/constants'
import { NotesButton } from '../../components/Notes'

function LtsJournal(props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const { journalId } = useParams()
  const location = useLocation()
  const isRootPath = location.pathname === '/my-course-in-entrepreneurship/journal'
  const [journals, setJournals] = useState([])
  const [journalsData, setJournalsData] = useState([])
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [activeLevel, setActiveLevel] = useState(0)
  const [editorContent, setEditorContent] = useState('')
  const currentLanguage = useSelector((state) => state.lang.locale)
  const contentContainer = useRef()
  const [modal, setModal] = useState(false)
  const toggleModal = () => setModal(!modal)
  const [showVideo, setShowVideo] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [videos, setVideos] = useState([])
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [showLockModal, setShowLockModal] = useState(false);
  const [lockModalMessage, setLockModalMessage] = useState('');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [reflectionContent, setReflectionContent] = useState('');
  const [reflectionsData, setReflectionsData] = useState({});
  const [saving, setSaving] = useState(false);
  const [reflectionData, setReflectionData] = useState({
    content: '',
    journalId: null,
    journalEntryId: null,
    entryId: null,
    foulWords: null
  });
  const [isIntroVideo, setIsIntroVideo] = useState(false);

  const handleIntroVideoChange = (isIntro) => {
    setIsIntroVideo(isIntro);
  };

  const { finishedContent, levelProgress, loading } = useSelector(
    (state) => state.course
  )

  // console.log('Finished Content:', finishedContent);

  const levels = [
    {
      title: 'Level 1: Entrepreneurship and You',
      description: 'Welcome to Level 1',
      active: true
    },
    {
      title: 'Level 2: Understanding Learn to Start',
      description: 'Welcome to Level 2',
      active: false
    },
    {
      title: 'Level 3: The Journey of Entrepreneurship',
      description: 'Welcome to Level 3',
      active: false
    }
  ]
  const lessonsByLevel = {
    0: [
      {
        id: 'myths',
        title: 'Myths of Entrepreneurship',
        status: 'done',
        redirectId: 51
      },
      {
        id: 'definition',
        title: 'Definition of Entrepreneurship',
        status: 'done',
        redirectId: 52
      },
      {
        id: 'reasons',
        title: 'Reasons Why Startups Fail',
        status: 'inProgress',
        redirectId: 53
      },
      {
        id: 'skills',
        title: 'Skills and Traits of Effective Entrepreneurs',
        status: 'notStarted',
        redirectId: 54
      },
      {
        id: 'people',
        title: 'People Buy Into People',
        status: 'notStarted',
        redirectId: 55
      },
      {
        id: 'selfBrand',
        title: 'Creating Your Self Brand First',
        status: 'notStarted',
        redirectId: 56
      },
      {
        id: 'task1',
        title: 'Task #1: Create your Individual Value Proposition',
        status: 'notStarted',
        redirectId: 57
      },
      {
        id: 'task2',
        title: 'Task #2: Create your I Am Video',
        status: 'notStarted',
        redirectId: 58
      }
    ],
    1: [
      {
        id: 'journey',
        title: 'The Journey of Entrepreneurship',
        status: 'notStarted',
        redirectId: 60
      },
      {
        id: 'intro',
        title: 'An Introduction to the LTS Model and Four Environments',
        status: 'notStarted',
        redirectId: 61
      },
      {
        id: 'coreSkills',
        title: 'The Core Skills and LEARN Stage of the LTS Model',
        status: 'notStarted',
        redirectId: 62
      },
      {
        id: 'develop',
        title: 'The DEVELOP Stage of the LTS Model',
        status: 'notStarted',
        redirectId: 63
      },
      {
        id: 'start',
        title: 'Understanding START & the Test Metrics of LTS',
        status: 'notStarted',
        redirectId: 65
      },
      {
        id: 'task3',
        title: 'Task #1: Evaluate Your Mindset and Skill Set',
        status: 'notStarted',
        redirectId: 66
      },
      {
        id: 'process',
        title: 'The Process of Entrepreneurship',
        status: 'notStarted',
        redirectId: 67
      },
      {
        id: 'task4',
        title: 'Task #2: Build Your Team and Find Your Mentor',
        status: 'notStarted',
        redirectId: 68
      }
    ],
    2: [
      {
        id: '3.1',
        title: 'Level 3.1: The Journey of Entrepreneurship',
        isParent: true,
        children: [
          {
            id: 'journey31',
            title: 'The Journey of Entrepreneurship',
            status: 'notStarted',
            redirectId: 70
          },
          {
            id: 'process31',
            title: 'The Process and Skill of Storytelling',
            redirectId: 71
          },
          { id: 'relevancy', title: 'Relevancy in World 4.0', redirectId: 72 },
          { id: 'learn', title: 'The LEARN Stage', redirectId: 73 },
          { id: 'problems', title: 'Problems Worth Solving', redirectId: 74 },
          {
            id: 'task5',
            title:
              'Task #5: Identify a Problem Worth Solving, Assumptions, and Market Trends',
            redirectId: 75
          },
          {
            id: 'task6',
            title: 'Task #6: Conduct an Industry Analysis',
            redirectId: 76
          }
        ]
      },
      {
        id: '3.2',
        title: 'Level 3.2: The Develop Stage',
        isParent: true,
        children: [
          { id: 'solution', title: 'Finding the Solution', redirectId: 78 },
          {
            id: 'value',
            title: "Creating Your Startup's Value Proposition",
            redirectId: 79
          },
          {
            id: 'task7',
            title: "Task #7: Create Your Startup's Value Proposition",
            redirectId: 80
          },
          {
            id: 'testing',
            title: "Testing Your Startup's Value Proposition",
            redirectId: 81
          },
          {
            id: 'task8',
            title:
              "Task #8: Conduct Market Validation for Your Startup's Value Proposition",
            redirectId: 82
          },
          {
            id: 'inovation',
            title: 'Understanding Innovation and Its Enemies',
            redirectId: 85
          },
          {
            id: 'skills',
            title: 'The Five Skills of Innovation',
            redirectId: 86
          },
          { id: 'develop', title: 'The DEVELOP Stage', redirectId: 87 },
          {
            id: 'task9',
            title: "Task #9: Develop Your Startup's Business Model",
            redirectId: 88
          },
          {
            id: 'task10',
            title: "Write Your Startup's Concept Plan",
            redirectId: 89
          }
        ]
      },
      {
        id: '3.3',
        title: 'Level 3.3: The Develop Stage',
        isParent: true,
        children: [
          { id: 'brand', title: 'Definition of Brand', redirectId: 91 },
          { id: 'branding', title: 'Branding Strategies', redirectId: 92 },
          {
            id: 'relation',
            title: 'The Relationship Between Story and Brand',
            redirectId: 93
          },
          {
            id: 'charter',
            title:
              "The Brand Charter&Task #11: Creating Your Startup's Brand Charter",
            redirectId: 94
          },
          { id: 'vehicles', title: 'The Brand Vehicles', redirectId: 95 },
          {
            id: 'task12',
            title: "Task #12: Create Your Startup's Brand Vehicles",
            redirectId: 96
          },
          {
            id: 'fundamental',
            title: 'The Fundamental Elements of Story',
            redirectId: 97
          },
          {
            id: 'bussines',
            title: 'Stories Your Business Can Tell',
            redirectId: 98
          },
          {
            id: 'storyteller',
            title: 'Embracing Your Inner Storyteller',
            redirectId: 99
          },
          {
            id: 'task13',
            title: 'Task #13: Conduct Focus Groups',
            redirectId: 100
          },
          { id: 'marketing', title: 'The Marketing Plan', redirectId: 101 },
          {
            id: 'task14',
            title: "Task #14: Creating Your Startup's Marketing Plan",
            redirectId: 102
          }
        ]
      },
      {
        id: '3.4',
        title: 'Level 3.4: The Start Stage',
        isParent: true,
        children: [
          {
            id: 'brand1',
            title: 'Introduction to the Business Plan',
            redirectId: 104
          },
          {
            id: 'branding',
            title: 'The Business Development Management Map',
            redirectId: 105
          },
          {
            id: 'relation',
            title:
              "Task #15: Create Your Startup's Business Development Management Map",
            redirectId: 106
          },
          {
            id: 'charter',
            title: 'The Test Metric of Sustainability',
            redirectId: 107
          },
          {
            id: 'creating',
            title: 'Task #16: Test The Sustainability of Your Startup',
            redirectId: 108
          },
          {
            id: 'vehicles',
            title: 'The Process of Entrepreneurship Reintroduction',
            redirectId: 109
          },
          { id: 'task12', title: 'Parts of a Business Plan', redirectId: 110 },
          {
            id: 'fundamental',
            title: "Task #17: Write Your Startup's Business Plan",
            redirectId: 111
          },
          {
            id: 'bussines',
            title: 'The Test Metric of Efficiency',
            redirectId: 112
          },
          {
            id: 'storyteller',
            title: 'Task #18: Test the Efficiency of Your Startup',
            redirectId: 113
          },
          {
            id: 'task13',
            title: 'An Introduction to the Financial Plan',
            redirectId: 114
          },
          {
            id: 'marketing',
            title: "Task #19: Create Your Startup's Financial Plan",
            redirectId: 115
          },
          {
            id: 'task14',
            title: 'The Test Metric of Profitability',
            redirectId: 116
          },
          {
            id: 'profitability',
            title: 'Task #20: Test the Potential Profitability of Your Startup',
            redirectId: 117
          },
          { id: 'generation', title: 'Brand Generation', redirectId: 118 },
          { id: 'plan', title: 'Business Plan Musts', redirectId: 119 },
          {
            id: 'executive',
            title:
              "Task #21: Write the Executive Summary of Your Startup's Business",
            redirectId: 120
          },
          {
            id: 'introductory',
            title: "Task #22: Create Your Startup's Brand Introductory Video",
            redirectId: 121
          },
          { id: 'selling', title: 'Selling You', redirectId: 122 },
          { id: 'pitching', title: 'Pitching Yourself', redirectId: 123 },
          {
            id: 'reminders',
            title: 'Reminders Going Forwards',
            redirectId: 124
          },
          {
            id: 'final',
            title: 'Task #23: Create Your Final I Am Video',
            redirectId: 125
          },
          // { id: 'task4', title: "Task #4: Build Your Team and Find Your Mentor",redirectId:126},
          {
            id: 'task24',
            title: "Task #24: Build Your Startup's Final Pitch",
            redirectId: 126
          }
        ]
      }
    ]
  }

  async function getJournals(redir = true) {
    try {
      const { data } = await axiosInstance.get('/ltsJournals/', {
        params: {
          category: props.category,
          platform: props.category === 'market-ready' ? 'student' : 'instructor'
        }
      })
      setJournalsData(data)
      setJournals(data)
      setLoaded(true)

      if (data.length > 0 && redir && isRootPath) {
        if (data[0].children?.length > 0) {
          history.push(`${props.match.url}/${data[0].children[0].id}`)
        } else {
          history.push(
            `${props.match.url}/${props.location.search.split('?')[1] || data[0].id
            }`
          )
        }
      }
    } catch (err) {
      console.error('Error fetching journals:', err)
    }
  }

  function journalChanged(journal) {
    getJournals(false)
  }

  useEffect(() => {
    dispatch(changeSidebarState(false))
    if (isRootPath) {
      getJournals()
    }
  }, [dispatch, isRootPath])

  useEffect(() => {
    dispatch(fetchLtsCoursefinishedContent())
  }, [dispatch])

  useEffect(() => {
    if (journalId) {
      const numericId = parseInt(journalId);

      // Find the lesson in the current level
      let foundLesson = null;

      if (activeLevel === 2) {
        // For Level 3's nested structure
        lessonsByLevel[2].some(section => {
          const found = section.children?.find(child => child.redirectId === numericId);
          if (found) {
            foundLesson = {
              value: `${section.id}_${found.id}`,
              label: found.title,
              redirectId: found.redirectId
            };
            return true;
          }
          return false;
        });
      } else {
        const found = lessonsByLevel[activeLevel]?.find(
          lesson => lesson.redirectId === numericId
        );
        if (found) {
          foundLesson = {
            value: found.id,
            label: found.title,
            redirectId: found.redirectId
          };
        }
      }

      if (foundLesson) {
        setSelectedLesson(foundLesson);
      }
    }
  }, [journalId, activeLevel]);

  const handleJournalSearch = (e) => {
    const keyword = e.target.value.toLowerCase()
    setJournals(
      keyword
        ? journalsData.filter(
          (journal) =>
            journal.title.toLowerCase().includes(keyword) ||
            journal.children.some((child) =>
              child.title.toLowerCase().includes(keyword)
            )
        )
        : journalsData
    )
  }

  const handleLevelClick = (clickedLevel) => {
    // First check if level is locked
    if (clickedLevel === 1 && !finishedContent.includes(58)) {
      setLockModalMessage('This lesson is currently locked. You must complete Level 1 before it to gain access to Level 2.');
      setShowLockModal(true);
      return;
    }

    if (clickedLevel === 2 && !finishedContent.includes(68)) {
      setLockModalMessage('This lesson is currently locked. You must complete Level 2 before it to gain access to Level 3.');
      setShowLockModal(true);
      return;
    }

    // If level is accessible, navigate to the first lesson of that level
    setActiveLevel(clickedLevel);
    
    // Map of welcome/first lesson IDs for each level
    const welcomeLessonIds = {
      0: 51, // Level 1 welcome lesson
      1: 60, // Level 2 welcome lesson
      2: 70  // Level 3 welcome lesson
    };

    // Navigate to the welcome lesson of the clicked level
    const welcomeLessonId = welcomeLessonIds[clickedLevel];
    if (welcomeLessonId) {
      history.push(`/my-course-in-entrepreneurship/journal/${welcomeLessonId}`);
    }
  };

  useEffect(() => {
    const matchedVideos = videos.filter(
      (video) => video.redirectId === parseInt(journalId)
    )
    if (matchedVideos.length > 0) {
      setVideos(matchedVideos)
      setCurrentVideoIndex(0)
    } else {
      setVideos([])
    }
  }, [journalId])

  useEffect(() => {
    const levelVideos = videos.filter((video) => {
      const levelRedirectIds = lessonsByLevel[activeLevel]?.map(
        (lesson) => lesson.redirectId
      )
      return levelRedirectIds?.includes(video.redirectId)
    })
    setVideos(levelVideos)
  }, [activeLevel])

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1)
    }
  }

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1)
    }
  }

  const getOptionStatus = (redirectId, lessons, isLevel3 = false) => {
    if (isLevel3) {
      const allLevel3Content = lessonsByLevel[2]
        .flatMap((section) => section.children)
        .sort((a, b) => a.redirectId - b.redirectId)

      const index = allLevel3Content.findIndex(
        (item) => item.redirectId === redirectId
      )
      const lastCompletedIndex = allLevel3Content.findIndex((item) => {
        const nextItem = allLevel3Content[allLevel3Content.indexOf(item) + 1]
        return (
          finishedContent.includes(item.redirectId) &&
          (!nextItem || !finishedContent.includes(nextItem.redirectId))
        )
      })

      if (finishedContent.includes(redirectId)) {
        return { status: 'done', disabled: false }
      } else if (index === lastCompletedIndex + 1) {
        return { status: 'inProgress', disabled: false }
      } else {
        return { status: 'notStarted', disabled: true }
      }
    }

    const index = lessons.findIndex(
      (lesson) => lesson.redirectId === redirectId
    )
    const lastCompletedIndex = lessons.findIndex((lesson) => {
      const nextItemIndex = lessons.indexOf(lesson) + 1
      return (
        finishedContent.includes(lesson.redirectId) &&
        (!lessons[nextItemIndex] ||
          !finishedContent.includes(lessons[nextItemIndex].redirectId))
      )
    })

    if (finishedContent.includes(redirectId)) {
      return { status: 'done', disabled: false }
    } else if (index === lastCompletedIndex + 1) {
      return { status: 'inProgress', disabled: false }
    } else {
      return { status: 'notStarted', disabled: true }
    }
  }

  const options = lessonsByLevel[activeLevel]?.flatMap((lesson, index) => {
    if (activeLevel === 2) {
      const parentOption = {
        value: `${lesson.id}_parent`,
        label: lesson.title,
        textColor: 'text-dark',
        fontWeight: 'bolder',
        disabled: false
      }

      const childOptions = lesson.children?.map((child) => {
        const status = getOptionStatus(child.redirectId, lesson.children, true)

        return {
          value: `${lesson.id}_${child.id}`,
          label: child.title,
          icon:
            status.status === 'done'
              ? tickSign
              : status.status === 'inProgress'
                ? circleSign
                : lockSign,
          textColor:
            status.status === 'notStarted' ? 'text-secondary' : 'text-dark',
          disabled: status.disabled,
          redirectId: child.redirectId,
          parentId: lesson.id
        }
      })

      return [parentOption, ...(childOptions || [])]
    }

    const status = getOptionStatus(
      lesson.redirectId,
      lessonsByLevel[activeLevel]
    )

    return {
      value: lesson.id,
      label: lesson.title,
      icon:
        status.status === 'done'
          ? tickSign
          : status.status === 'inProgress'
            ? circleSign
            : lockSign,
      textColor:
        status.status === 'notStarted' ? 'text-secondary' : 'text-dark',
      disabled: status.disabled,
      redirectId: lesson.redirectId
    }
  })

  const isContentAccessible = (journalId) => {
    const numericId = parseInt(journalId)

    if (finishedContent.includes(numericId)) {
      return true
    }

    const lastCompletedId = Math.max(...finishedContent)

    if (numericId === 70) {
      const lastLevel2Item = lessonsByLevel[1][lessonsByLevel[1].length - 1]
      return finishedContent.includes(lastLevel2Item.redirectId)
    }

    for (let level = 0; level <= 2; level++) {
      const lessons = lessonsByLevel[level]
      if (!lessons) continue

      if (level === 2) {
        for (const section of lessons) {
          const children = section.children || []
          for (let i = 0; i < children.length; i++) {
            if (children[i].redirectId === numericId) {
              if (i === 0 && section === lessons[0]) {
                const lastLevel2Item =
                  lessonsByLevel[1][lessonsByLevel[1].length - 1]
                return finishedContent.includes(lastLevel2Item.redirectId)
              }
              return (
                i === 0 || finishedContent.includes(children[i - 1].redirectId)
              )
            }
          }
        }
      } else {
        for (let i = 0; i < lessons.length; i++) {
          if (lessons[i].redirectId === numericId) {
            if (i === 0 && level === 0) return true

            if (i === 0) {
              const prevLevelLessons = lessonsByLevel[level - 1]
              const lastItemPrevLevel =
                prevLevelLessons[prevLevelLessons.length - 1]
              return finishedContent.includes(lastItemPrevLevel.redirectId)
            }
            return finishedContent.includes(lessons[i - 1].redirectId)
          }
        }
      }
    }
    return false
  }

  const getCourseStatus = (redirectId) => {
    if (finishedContent.includes(redirectId)) {
      return 'done'
    }

    const nextAvailableId =
      finishedContent.length > 0
        ? Math.min(...finishedContent.map((id) => id + 1))
        : 51

    if (redirectId === nextAvailableId) {
      return 'inProgress'
    }

    return 'notStarted'
  }

  const handleReflectionContentChange = (content, data) => {
    const reflectionKey = `${data.journalId}_${data.journalEntryId}_${data.entryId || 'new'}`;
    setReflectionsData(prev => ({
      ...prev,
      [reflectionKey]: {
        ...data,
        content
      }
    }));
  };

  const findNextLesson = (currentId) => {
    const numericId = parseInt(currentId);

    if (numericId === 63) {
      return 65;
    }

    const lastLessonsByLevel = {
      0: 58, 
      1: 68,
      2: 126 
    };

    if (Object.values(lastLessonsByLevel).includes(numericId)) {
      if (activeLevel < 2) {
        const nextLevel = activeLevel + 1;
        if (nextLevel === 2) {
          const firstSection = lessonsByLevel[2][0];
          return firstSection.children[0].redirectId;
        } else {
          return lessonsByLevel[nextLevel][0].redirectId;
        }
      }
      return null; 
    }

    if (activeLevel === 2) {
      const allLessons = lessonsByLevel[2].flatMap(section =>
        section.children || []
      ).filter(lesson => lesson);

      const currentIndex = allLessons.findIndex(lesson => lesson.redirectId === numericId);
      if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
        return allLessons[currentIndex + 1].redirectId;
      }
      return null;
    }

    const currentLevelLessons = lessonsByLevel[activeLevel];
    const currentIndex = currentLevelLessons.findIndex(lesson => lesson.redirectId === numericId);
    if (currentIndex !== -1 && currentIndex < currentLevelLessons.length - 1) {
      return currentLevelLessons[currentIndex + 1].redirectId;
    }

    return null;
  };

  const handleSaveAndContinue = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const myTraining = history.location.pathname.includes('my-training');
      let didSave = false;
      let hasValidReflection = false;
      let emptyReflections = [];

      Object.entries(reflectionsData).forEach(([key, reflectionData]) => {
        const { content } = reflectionData;
        if (!content || content.trim() === '' || content === '<p><br></p>') {
          emptyReflections.push(key);
        } else {
          hasValidReflection = true;
        }
      });

      if (emptyReflections.length > 0) {
        toast.success('Please complete the reflection before continuing.', {
          className: 'toastify-success-info'
        });
        setSaving(false);
        return;
      }

      if (!hasValidReflection) {
        toast.success('Please write something on reflection before continuing.', {
          className: 'toastify-success-info'
        });
        setSaving(false);
        return;
      }

      const savePromises = Object.values(reflectionsData).map(async (reflectionData) => {
        const { journalId, journalEntryId, entryId, content } = reflectionData;

        if (!content || content.trim() === '' || content === '<p><br></p>') return; 

        didSave = true; 

        const payload = {
          content: content,
          trainingId: myTraining ? journalId : null
        };

        if (!entryId) {
          return axiosInstance.post(
            `/ltsJournals/${journalId}/entries/${journalEntryId}/userEntries`,
            payload
          );
        } else {
          return axiosInstance.put(
            `/ltsJournals/${journalId}/entries/${journalEntryId}/userEntries/${entryId}`,
            payload
          );
        }
      });

      await Promise.all(savePromises);

      setReflectionsData({});

      if (didSave) {
        toast.success('Reflection has been saved successfully!', {
          className: 'toastify-success-info'
        });
      } else {
        toast.success('No reflection to save. Please write something before saving.', {
          className: 'toastify-success-info'
        });
        setSaving(false);
        return;
      }

      const currentPath = history.location.pathname;
      const currentJournalId = parseInt(currentPath.split('/').pop());
      const nextLessonId = findNextLesson(currentJournalId);

      if (nextLessonId) {
        let nextLesson = null;
        let nextLevel = activeLevel;
        
        const currentLevelLastId = {
          0: 58,
          1: 68,
          2: 126
        }[activeLevel];

        if (currentJournalId === currentLevelLastId && activeLevel < 2) {
          nextLevel = activeLevel + 1;
          setActiveLevel(nextLevel);
        }
        
        if (nextLevel === 2) {
          for (const section of lessonsByLevel[2]) {
            const found = section.children?.find(child => child.redirectId === nextLessonId);
            if (found) {
              nextLesson = {
                value: `${section.id}_${found.id}`,
                label: found.title,
                redirectId: nextLessonId
              };
              break;
            }
          }
        } else {
          const found = lessonsByLevel[nextLevel]?.find(
            lesson => lesson.redirectId === nextLessonId
          );
          if (found) {
            nextLesson = {
              value: found.id,
              label: found.title,
              redirectId: nextLessonId
            };
          }
        }

        if (nextLesson) {
          setSelectedLesson(nextLesson);
        }

        await dispatch(fetchLtsCoursefinishedContent());
        history.push(`/my-course-in-entrepreneurship/journal/${nextLessonId}`);
      }

    } catch (error) {
      console.error('Save error:', error);
      if (error.response) {
        toast.error(error.response.data.errors.map(e => e.message).join('.'), {
          className: 'toastify-success-info'
        });
      } else if (error.request) {
        toast.error('No response received from server. Please check your connection.', {
          className: 'toastify-success-info'
        });
      } else {
        toast.error('Something went wrong, please try to save the answer again.', {
          className: 'toastify-success-info'
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const getCurrentLessonTitle = () => {
    if (!journalId) return "Select a Lesson";

    const numericId = parseInt(journalId);

    if (activeLevel === 2) {
      for (const section of lessonsByLevel[2]) {
        const found = section.children?.find(child => child.redirectId === numericId);
        if (found) return found.title;
      }
    } else {
      const found = lessonsByLevel[activeLevel]?.find(
        lesson => lesson.redirectId === numericId
      );
      if (found) return found.title;
    }

    for (let level = 0; level <= 2; level++) {
      if (level === 2) {
        for (const section of lessonsByLevel[2]) {
          const found = section.children?.find(child => child.redirectId === numericId);
          if (found) return found.title;
        }
      } else {
        const found = lessonsByLevel[level]?.find(
          lesson => lesson.redirectId === numericId
        );
        if (found) return found.title;
      }
    }

    if (selectedLesson?.label) {
      return selectedLesson.label;
    }

    return "Select a Lesson";
  };

  const handleContinue = () => {
    history.push('/my-course-in-entrepreneurship/journal/51');
  };

  return (
    <>
      <div id='main-body'>
        <div className='container-fluid'>
          <div className='row'>
            <div className='px-0'>
              <div>
                <div className='col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
                  <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
                    <div>
                      <h3 className='page-title bold-page-title text-black mb-0'>
                        Course in Entrepreneurship & Innovation
                      </h3>
                      <p className='fs-13 fw-light text-black'>
                        Embarking on the Entrepreneurial Journey
                      </p>
                    </div>

                    {/* <SelectLanguage /> */}
                  </div>
                  <img
                    src={MenuIcon}
                    alt='menu'
                    className='menu-icon-cie self-start-tab cursor-pointer'
                    onClick={() => dispatch(toggleCollapse())}
                  />
                </div>

                <div>
                  <div className='gradient-background-journal' ref={contentContainer}>
                    <div>
                      <div className='levels-container-journal'>
                        {levels.map((level, index) => {
                          let levelClass = '';
                          if (index === activeLevel) {
                            levelClass = 'active-level-journal';
                          } else if (index === 1 && finishedContent.includes(58)) {
                            levelClass = 'accessible-level-journal';
                            
                          } else if (index === 2 && finishedContent.includes(68)) {
                            levelClass = 'accessible-level-journal'; 
                          } else if (!isContentAccessible(lessonsByLevel[index]?.[0]?.redirectId)) {
                            levelClass = 'inactive-level-journal';
                          } else {
                            levelClass = 'accessible-level-journal';
                          }
                          return (
                            <div
                              key={index}
                              className={`course-level-journal ${levelClass}`}
                              onClick={() => handleLevelClick(index)}
                            >
                              {level.title}
                            </div>
                          );
                        })}
                      </div>

                      <div className='course-section'>
                        <div className='course-button-group'>
                          <div className='select-lessons'>
                            <SelectLessons
                              options={options}
                              selectedCourse={selectedLesson}
                              setSelectedCourse={(selectedOption) => {
                                if (!selectedOption || !selectedOption.value) return;

                                setSelectedLesson(selectedOption);

                                if (activeLevel === 2) {
                                  const [parentId, childId] = selectedOption.value.split('_');
                                  if (childId === 'parent') return;

                                  const selectedSection = lessonsByLevel[2].find(
                                    section => section.id === parentId
                                  );
                                  const selectedLesson = selectedSection?.children?.find(
                                    child => child.id === childId
                                  );

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
                              setShowLockModal={setShowLockModal}
                              setLockModalMessage={setLockModalMessage}
                              activeLevel={activeLevel}
                              placeholder={getCurrentLessonTitle() || levels[activeLevel]?.description}
                            />
                          </div>

                          {!isIntroVideo && (
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
                              }}
                            >
                              <button
                                style={{ padding: '.5rem' }}
                                className='review-progress-btn'
                                onClick={isRootPath ? handleContinue : handleSaveAndContinue}
                                disabled={saving}
                              >
                                {saving ? (
                                  <FontAwesomeIcon icon={faSpinner} spin />
                                ) : (
                                  <span style={{ display: 'flex', alignItems: 'center',justifyContent:'center', gap: '8px' }}>
                                    {isRootPath
                                      ? props.intl.formatMessage({
                                        id: 'my_journal.continue',
                                        defaultMessage: 'Continue'
                                      })
                                      : props.intl.formatMessage({
                                        id: 'my_journal.save_and_continue',
                                        defaultMessage: 'Save and Continue'
                                      })}
                                    <FontAwesomeIcon icon={faArrowRight} />
                                  </span>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    <Switch>
                      <Route
                        exact
                        path={props.match.url}
                        render={() => (
                          <div className="d-flex justify-content-between align-items-start general-video-container-journal" style={{ gap: '2rem' }}>
                            <div id="video-container-journal" className="video-container-bg" style={{ flex: '1 1 50%' }}>
                              <div className="d-flex placeholder-content-img align-items-center">
                                <img
                                  src={circleIcon}
                                  alt="circle-icon"
                                  style={{ width: '36px', height: '36px', marginRight: '10px' }}
                                />
                                <h6>{levels[activeLevel]?.description}</h6>
                              </div>
                              <div style={{ position: 'relative', cursor: 'pointer' }}>
                                <img
                                  src="https://d5tx03iw7t69i.cloudfront.net/Month_1/M1-Vid-1-Thumbnail.jpg"
                                  alt="video-thumbnail"
                                  style={{ width: '100%', borderRadius: '20px', marginTop: '1rem' }}
                                  onClick={() => setShowVideoModal(true)}
                                />
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    borderRadius: '50%',
                                    padding: '1rem'
                                  }}
                                  onClick={() => setShowVideoModal(true)}
                                >
                                  <FontAwesomeIcon icon={faPlay} style={{ color: '#fff', fontSize: 32 }} />
                                </div>
                              </div>
                              <Modal
                                isOpen={showVideoModal}
                                toggle={() => setShowVideoModal(false)}
                                className="videoPlayerModal"
                                centered
                              >
                                <ModalBody className="p-0 m-0" style={{ position: 'relative' }}>
                                  <button
                                    className="media-lightbox__close"
                                    onClick={() => setShowVideoModal(false)}
                                    aria-label="Close"
                                    type="button"
                                  >
                                    <FontAwesomeIcon icon={faTimes} />
                                  </button>
                                  <ReactPlayer
                                    url="https://d5tx03iw7t69i.cloudfront.net/Month_1/M1-Vid-1-Welcome-to-Level-1-V3.mp4"
                                    controls
                                    playing
                                    width="100%"
                                    height="100%"
                                    config={{
                                      file: {
                                        attributes: {
                                          controlsList: 'nodownload'
                                        }
                                      }
                                    }}
                                  />
                                </ModalBody>
                              </Modal>
                            </div>
                            <div id="content-container" className="content-container"
                              style={{
                                flex: '1 1 50%',
                                width: '100%',
                                boxShadow: '0px 15px 20px 8px rgba(0, 0, 0, 0.09)',
                                borderRadius: '20px',
                                padding: '25px 25px'
                              }}>
                              <div className="d-flex align-items-center reflection-header">

                                <img
                                  src={WhoAmI}
                                  alt="page-icon"
                                  style={{ width: '36px', height: '36px', marginRight: '10px' }}
                                />
                                <h6>Level 1: Entrepreneurship and You</h6>
                              </div>
                              <p className='pt-3'>Entrepreneurship is a mindset, and in the first level of this program, you will engage in developing this mindset as your preparation for starting your journey on the pathway to entrepreneurship. You need proof of yourself as an entrepreneur and through this program you will create content that can publicly speak to your values, your purpose,your mindset, and your skillset. The first step in creating this proof is developing content that solidifies your statement of "I Am". Who are you and how do you want the world to see you? It's time for you to communicate you professional identity.</p>


                            </div>
                          </div>
                        )}
                      />
                      <Route
                        path={`${props.match.url}/:journalId`}
                        render={(renderProps) => {
                          const { journalId } = renderProps.match.params

                          if (!isContentAccessible(journalId)) {
                            return <Redirect to={`${props.match.url}/51`} />
                          }

                          return (
                            <LtsJournalContent
                              {...renderProps}
                              contentContainer={contentContainer}
                              backRoute={props.match.url}
                              saved={journalChanged}
                              onReflectionContentChange={handleReflectionContentChange}
                              onIntroVideoChange={handleIntroVideoChange}
                              noteButtonProps={{
                                from: "entrepreneurshipJournal",
                                data: {
                                  id: selectedLesson?.redirectId || renderProps.match.params.journalId,
                                  title: getCurrentLessonTitle()
                                },
                                createdFrom: getCurrentLessonTitle() || 'Entrepreneurship Journal',
                                journalId: selectedLesson?.redirectId || renderProps.match.params.journalId
                              }}
                            />
                          )
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

                    {/* <div className='page-card__sidebar-content styled-scrollbar'>
                      <Accordion
                        defaultActiveKey='0'
                        className='accordion-menu lizas-accordion'
                      >
                        {journals.map((journalItem, journalItemIdx) => (
                          <div
                            key={journalItem.id}
                            className='accordion-menu__item cursor-pointer accordion-menu__item-transition'
                          >
                            {journalItem.children?.length ? (
                              <>
                                <Accordion.Toggle
                                  as='a'
                                  href='#'
                                  className='accordion-menu__item-toggle'
                                  eventKey={`${journalItemIdx}`}
                                  onClick={() =>
                                    journalItem.content &&
                                    history.push(
                                      `${props.match.url}/${journalItem.id}`)
                                  }
                                >
                                  <span>{journalItem.title}</span>
                                  <FontAwesomeIcon icon={faAngleDown} />
                                </Accordion.Toggle>

                                <Accordion.Collapse
                                  eventKey={`${journalItemIdx}`}
                                >
                                  <ul className='accordion-menu__submenu'>
                                    {journalItem.children.map(
                                      (journalChildren) => (
                                        <li
                                          key={journalChildren.id}
                                          className='accordion-menu__submenu-item'
                                        >
                                          <NavLink
                                            to={`${props.match.url}/${journalChildren.id}`}
                                          >
                                            <div className='accordion-menu__submenu-item-icon'>
                                              <FontAwesomeIcon
                                                icon={faFileAlt}
                                              />
                                            </div>
                                            <div className='accordion-menu__submenu-item-details'>
                                              <h5 className='accordion-menu__submenu-item-title'>
                                                {journalChildren.title}
                                              </h5>
                                              {journalChildren.userEntry?.[0]
                                                ?.createdAt ? (
                                                <div className='accordion-menu__submenu-item-subtitle'>
                                                  {moment(
                                                    journalChildren.userEntry[0]
                                                      .createdAt
                                                  )
                                                    .locale(currentLanguage)
                                                    .format(
                                                      'MMMM D, YYYY | hh:mma'
                                                    )}
                                                </div>
                                              ) : (
                                                <div className='accordion-menu__submenu-item-subtitle accordion-menu__submenu-item-subtitle--not-started'>
                                                  NOT STARTED
                                                </div>
                                              )}
                                            </div>
                                          </NavLink>
                                        </li>
                                      )
                                    )}
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
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                Level Locked
              </h3>
            </div>

            <div className='mt-5'>
              <p className='text-secondary text-center'>{lockModalMessage}</p>
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  )
}

export default injectIntl(LtsJournal)

