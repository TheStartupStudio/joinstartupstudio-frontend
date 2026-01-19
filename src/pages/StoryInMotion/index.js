import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import storyInMotionPodcast from '../../assets/images/story-in-motion-podcast.png';
import ModalInput from '../../components/ModalInput/ModalInput';
import { injectIntl } from 'react-intl';
import searchJ from '../../assets/images/academy-icons/search.png';
import Select from 'react-select';
import Video from '../../components/Video';
import './StoryInMotion.css';
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg';
import { toggleCollapse } from '../../redux/sidebar/Actions';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getAllPodcast, getGuidanceVideos, getMasterclassVideos } from '../../redux/podcast/Actions';
import '../../pages/BeyondYourCourse/index.css';
import axiosInstance from '../../utils/AxiosInstance';
import EnLangs from '../../lang/locales/en_US.js';
 
function StoryInMotion({ intl }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { podcasts, guidanceVideos, masterclassVideos, loading } = useSelector(state => state.podcast);

  const [levels, setLevels] = useState([]);
  const [levelContents, setLevelContents] = useState({});
  const [activeLevel, setActiveLevel] = useState(2);
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [pageVideos, setPageVideos] = useState([]);
  const [currentPageVideos, setCurrentPageVideos] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const videosPerPage = 10;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterBy, setFilterBy] = useState(null);
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [forcePage, setForcePage] = useState(0);

  const titleRef = useRef(null);

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

  const filters = [
    { value: 'tl', label: 'Title' },
    { value: 'dt', label: 'Date' },
  ];

  const handleFilter = (selectedFilter) => {
    setFilterBy(selectedFilter);
  }

  // Fetch masterclass levels and content on component mount
  useEffect(() => {
    fetchMasterclassData();
  }, []);

  const fetchMasterclassData = async () => {
    try {
      // Fetch levels
      const levelsResponse = await axiosInstance.get('/contents/masterclass/levels');
      const levelsData = levelsResponse.data;

      // Sort levels by order
      const sortedLevels = levelsData.sort((a, b) => a.order - b.order);
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

      // Set initial content based on activeLevel
      if (sortedLevels.length > 0) {
        const initialLevel = sortedLevels[activeLevel];
        if (initialLevel) {
          const initialContent = contentsMap[initialLevel.id] || [];
          setPageVideos(initialContent);
          const firstPageVideos = initialContent.slice(0, videosPerPage);
          setCurrentPageVideos(firstPageVideos);
          setPageCount(Math.ceil(initialContent.length / videosPerPage));
        }
      }

      setIsInitialLoad(false);
      setInitialLoading(false);

    } catch (error) {
      console.error('Error fetching masterclass data:', error);
      setIsInitialLoad(false);
      setInitialLoading(false);
    }
  };;

  useEffect(() => {
    titleRef.current?.scrollIntoView({ behavior: 'instant' });
}, [isInitialLoad]);

  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      try {
        await Promise.all([
          dispatch(getGuidanceVideos()),
          dispatch(getMasterclassVideos()),
          dispatch(getAllPodcast())
        ]);
        // Add artificial delay for smoother transition
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setInitialLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadInitialData();
  }, [dispatch]);

useEffect(() => {
  if (location.pathname === '/story-in-motion/videos') {
    window.scrollTo({
      top: -50,
      behavior: 'instant'
    });
  }
}, [location.pathname, location.search]);

  useEffect(() => {
    if (levels.length > 0 && !isInitialLoad) {
      const currentLevel = levels[activeLevel];
      if (currentLevel) {
        // Use dynamic content from API
        const newVideos = levelContents[currentLevel.id] || [];
        setPageVideos(newVideos);
        // Reset to first page of new content
        const firstPageVideos = newVideos.slice(0, videosPerPage);
        setCurrentPageVideos(firstPageVideos);
        setPageCount(Math.ceil(newVideos.length / videosPerPage));
        setItemOffset(0);
      }
    }
  }, [activeLevel, levels, levelContents, isInitialLoad, videosPerPage]);

  useEffect(() => {
    const endOffset = itemOffset + videosPerPage;
    setCurrentPageVideos(pageVideos.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(pageVideos.length / videosPerPage));
  }, [pageVideos, itemOffset, videosPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * videosPerPage) % pageVideos.length;
    setItemOffset(newOffset);
    titleRef.current?.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam !== null) {
      setActiveLevel(parseInt(tabParam));
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.search]);

  const handleLevelChange = (index) => {
    setActiveLevel(index);
    // Reset pagination
    setItemOffset(0); 
    setCurrentPageVideos([]); 
    setPageCount(0); 
    setForcePage(0); // Reset to first page
    
    // Update URL and scroll to top
    const newUrl = `/story-in-motion/videos?tab=${index}`;
    history.push(newUrl);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword.toLowerCase());
    const filteredVideos = pageVideos.filter((video) =>
      video.title.toLowerCase().includes(keyword.toLowerCase())
    );
    setCurrentPageVideos(filteredVideos.slice(0, videosPerPage));
    setPageCount(Math.ceil(filteredVideos.length / videosPerPage));
  };

  const handleJournalSearch = (event) => {
    const keyword = event.target.value.toLowerCase();
    setSearchKeyword(keyword);

    const filteredVideos = pageVideos.filter((video) =>
      video.title.toLowerCase().includes(keyword)
    );

    setCurrentPageVideos(filteredVideos.slice(0, videosPerPage));
    setPageCount(Math.ceil(filteredVideos.length / videosPerPage));
  };

  const getSubtitle = () => {
    if (levels.length > 0 && activeLevel >= 0 && activeLevel < levels.length) {
      return levels[activeLevel].title;
    }
    return '';
  };

  return (
    <div id="main-body">
      <div ref={titleRef}></div>
    <div>
        <div>
          <div className="page-padding">
            <img
              src={MenuIcon}
              alt="menu"
              className="menu-icon-cie self-start-tab cursor-pointer"
              onClick={() => dispatch(toggleCollapse())}
              style={{ position: 'absolute', right: '1rem' }}
            />
            <Link to="/beyond-your-course" style={{ color: '#000000' }}>
            <div style={{ marginBottom: '2rem' }}>
                <FontAwesomeIcon icon={faArrowLeft} />
              <span style={{ marginLeft: '0.5rem' }}>{getSubtitle()}</span>
            </div>
            </Link>

            <h3 className="page-title">{pageTitle}</h3>
            <p className="page-description">{pageDescription}</p>
          </div>

          <div className="gradient-background-story">
            <div className="level-navigation">
              {levels.map((level, index) => (
                <div
                  key={level.id}
                  className={`course-level ${activeLevel === index ? 'active-level-master' : ''}`}
                  onClick={() => handleLevelChange(index)}
                >
                  {level.title}
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between"></div>

            <div className="content-videos-container-wrapper">
              {initialLoading ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading videos...</p>
                </div>
              ) : (
                <>
                  <div className="content-videos-container">
                    {currentPageVideos.map((video, index) => (
                      <Video
                        key={index}
                        id={video.id}
                        thumbnail={video.thumbnail || storyInMotionPodcast}
                        title={video.title}
                        description={video.description}
                        page={levels[activeLevel] ? levels[activeLevel].title.toLowerCase().replace(/\s+/g, '-').replace(':', '') : 'default'}
                        videoData={video}
                      />
                    ))}
                  </div>

                  {/* Pagination inside the podcast episodes div */}
                  {pageVideos.length > videosPerPage && (
                    <div className="pagination-container" style={{ marginTop: '20px' }}>
                      <ReactPaginate
                        previousLabel="<<"
                        nextLabel=">>"
                        breakLabel="..."
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName="pagination custom-pagination"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        activeClassName="active"
                        forcePage={forcePage} // Add this prop
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default injectIntl(StoryInMotion);