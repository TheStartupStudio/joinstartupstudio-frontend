import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Video from '../../components/Video';
import IntMessages from '../../utils/IntlMessages';
import masterIcon from '../../assets/images/master-icon.png';
import storyInMotion from '../../assets/images/story-in-motion-logo.png';
import rightArrow from '../../assets/images/academy-icons/right-arrow.png';
import storyInMotionPodcast from '../../assets/images/story-in-motion-podcast.png';
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import './index.css';
import LiveQA from '../../assets/images/LiveQ&A.jpg'
import NotificationBell from '../../components/NotificationBell'
import axiosInstance from '../../utils/AxiosInstance'
import EnLangs from '../../lang/locales/en_US.js'


export default function BeyondYourCourse() {
  const dispatch = useDispatch();

  const [levels, setLevels] = useState([]);
  const [levelContents, setLevelContents] = useState({});
  const [loading, setLoading] = useState(false);

  const [startVideoIndex, setStartVideoIndex] = useState(0);
  const [endVideoIndex, setEndVideoIndex] = useState(5);
  const [width, setWidth] = useState(window.innerWidth);

  const { user } = useSelector((state) => state.user.user)
  const userRole = user?.role_id || localStorage.getItem('role')

  // Helper function to translate video title keys
  const translateVideoTitle = (titleKey) => {
    if (titleKey && titleKey.startsWith('video.')) {
      return EnLangs[titleKey] || titleKey
    }
    return titleKey
  }

  // Helper function to translate description keys
  const translateDescription = (descKey) => {
    if (descKey && descKey.startsWith('video.')) {
      return EnLangs[descKey] || descKey
    }
    return descKey
  }

  // Priority levels that should always be first
  const priorityLevelIds = [11, 12, 13, 14];

  useEffect(() => {
    fetchMasterclassContent();
  }, []);

  const fetchMasterclassContent = async () => {
    try {
      setLoading(true);

      // Fetch masterclass levels first
      const levelsResponse = await axiosInstance.get('/contents/masterclass/levels');
      const allLevels = levelsResponse.data;

      // Sort levels: priority levels first (11, 12, 13, 14), then others, Live Q&A last
      const sortedLevels = allLevels.sort((a, b) => {
        // Live Q&A always last
        if (a.title === 'Live Q&A Episodes') return 1;
        if (b.title === 'Live Q&A Episodes') return -1;

        // Priority levels first
        const aPriority = priorityLevelIds.includes(a.id);
        const bPriority = priorityLevelIds.includes(b.id);

        if (aPriority && !bPriority) return -1;
        if (!aPriority && bPriority) return 1;

        // Within priority levels, sort by ID
        if (aPriority && bPriority) {
          return a.id - b.id;
        }

        // Other levels by ID
        return a.id - b.id;
      });

      setLevels(sortedLevels);

      // Fetch content for each level
      const contentPromises = sortedLevels.map(async (level) => {
        try {
          const contentResponse = await axiosInstance.get(`/contents/by-journal-level/${level.id}`);
          const transformedContent = (contentResponse.data.data || []).map(item => ({
            ...item,
            title: translateVideoTitle(item.title),
            description: translateDescription(item.description)
          }));

          return {
            levelId: level.id,
            content: transformedContent
          };
        } catch (error) {
          console.error(`Error fetching content for level ${level.id}:`, error);
          return {
            levelId: level.id,
            content: []
          };
        }
      });

      const contentResults = await Promise.all(contentPromises);

      // Create a map of level ID to content
      const contentsMap = {};
      contentResults.forEach(({ levelId, content }) => {
        contentsMap[levelId] = content;
      });

      setLevelContents(contentsMap);

    } catch (error) {
      console.error('Error fetching masterclass content:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generic function to render videos for any level
  const renderLevelVideos = (level, videos) => {
    if (loading) {
      return <div className="text-center p-4">Loading...</div>;
    }

    if (!videos || videos.length === 0) {
      return <div className="text-center p-4">No content available for {level.title}.</div>;
    }

    // Show only the last 5 videos for this level
    const videosToShow = videos.slice(-5);

    return (
      <div className="card-group desktop-menu card-group-beyond-your-course w-100">
        {videosToShow.slice(startVideoIndex, endVideoIndex).map((video, index) => (
          <Video
            key={video.id || index}
            id={video.id}
            thumbnail={video.thumbnail}
            title={video.title}
            description={video.description}
            page={level.title.toLowerCase().replace(/\s+/g, '-')}
            isMainPage={true}
            videoData={video}
          />
        ))}
      </div>
    );
  };

  const renderLiveQAVideos = () => {
    if (loading) {
      return <div className="text-center p-4">Loading...</div>;
    }

    // Find Live Q&A level and get its content
    const liveQALevel = levels.find(level => level.title === 'Live Q&A Episodes');
    const liveQAVideos = liveQALevel ? levelContents[liveQALevel.id] || [] : [];

    // If no live QA videos from API, show fallback dummy data
    const displayVideos = liveQAVideos.length > 0 ? liveQAVideos.slice(-5) : [
      {
        id: 'liveqa-1',
        title: 'Live Q&A Session #1',
        description: 'December 12, 2024',
        thumbnail: LiveQA,
        createdAt: '2024-01-15T10:00:00.000Z',
        type: 'live-qa'
      },
      {
        id: 'liveqa-2',
        title: 'Live Q&A Session #2',
        description: 'December 17, 2024',
        thumbnail: LiveQA,
        createdAt: '2024-02-20T14:30:00.000Z',
        type: 'live-qa'
      },
      {
        id: 'liveqa-3',
        title: 'Live Q&A Session #3',
        description: 'January 04, 2025',
        thumbnail: LiveQA,
        createdAt: '2024-03-10T16:00:00.000Z',
        type: 'live-qa'
      },
      {
        id: 'liveqa-4',
        title: 'Live Q&A Session #4',
        description: 'January 13, 2025',
        thumbnail: LiveQA,
        createdAt: '2024-04-05T11:15:00.000Z',
        type: 'live-qa'
      },
      {
        id: 'liveqa-5',
        title: 'Live Q&A Session #5',
        description: 'January 25, 2025',
        thumbnail: LiveQA,
        createdAt: '2024-05-12T13:45:00.000Z',
        type: 'live-qa'
      }
    ];

    return (
      <div className="card-group desktop-menu card-group-beyond-your-course w-100">
        {displayVideos.map((video, index) => (
          <Video
            key={video.id || index}
            id={video.id}
            thumbnail={video.thumbnail || LiveQA}
            title={video.title}
            description={video.description}
            page={'live-qa'}
            isMainPage={true}
            videoData={video}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div id="main-body">
        <div className="row">
          <div>
            <div className="col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
              <div className="account-page-padding d-flex justify-content-between flex-col-tab align-start-tab">
                <div>
                  <h3 className="page-title bold-page-title text-black mb-0">
                    <IntMessages id="beyond_your_course.master_classes_upper" />
                  </h3>
                  <p className="fs-13 fw-light text-black">
                    <IntMessages id="beyond_your_course.page_description" />
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
            <div className="gradient-background-master">
              {/* Dynamically render sections for each level except Live Q&A */}
              {levels
                .filter(level => level.title !== 'Live Q&A Episodes')
                .map((level, index) => {
                  const videos = levelContents[level.id] || [];
                  const tabIndex = priorityLevelIds.includes(level.id) ?
                    priorityLevelIds.indexOf(level.id) :
                    Math.max(...priorityLevelIds) + levels.filter(l => !priorityLevelIds.includes(l.id) && l.title !== 'Live Q&A Episodes').indexOf(level) + 1;

                  return (
                    <div key={level.id} className="videos-container">
                      <div className="guidance-videos-top mb-3 guidance-encouragement-page-titles">
                        <div className="title-container">
                          <img
                            src={level.id === 13 ? storyInMotion : masterIcon}
                            alt="logo"
                            style={{ width: '36px', height: '36px' }}
                            className="welcome-journey-text__icon"
                          />
                          <div style={{textAlign:'start'}}>
                            <h3 className="mb-0">
                              {level.title}
                            </h3>
                            {level.id === 11 && (
                              <p className="guidance-subtitle mb-0">Gary Conroy, Founder and CEO of Learn to Start</p>
                            )}
                          </div>
                        </div>
                        <Link
                          className="guidance-link"
                          to={`/story-in-motion/videos?tab=${tabIndex}`}
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'instant' });
                          }}
                          style={{ marginRight: '1rem' }}
                        >
                          <IntMessages id="general.view_all" />
                          <img src={rightArrow} style={{ marginLeft: '10px', marginBottom: '3px' }} />
                        </Link>
                      </div>
                      {renderLevelVideos(level, videos)}
                    </div>
                  );
                })}

              {/* Live Q&A section (always last) */}
              <div className="videos-container">
                <div className="guidance-videos-top mb-3 guidance-encouragement-page-titles">
                  <div className="title-container">
                    <img
                      src={masterIcon}
                      alt="logo"
                      style={{ width: '36px', height: '36px' }}
                      className="welcome-journey-text__icon"
                    />
                    <h3>
                      Live Q&A Webinars
                    </h3>
                  </div>
                  <Link
                    className="guidance-link"
                    to={`/story-in-motion/videos?tab=3`}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    style={{ marginRight: '1rem' }}
                  >
                    <IntMessages id="general.view_all" />
                    <img
                      src={rightArrow}
                      style={{ marginLeft: '10px', marginBottom: '3px' }}
                      alt="View All"
                    />
                  </Link>
                </div>
                {renderLiveQAVideos()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
