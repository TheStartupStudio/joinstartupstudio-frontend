import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

function StoryInMotion({ intl }) {
  const dispatch = useDispatch();
  const { podcasts, guidanceVideos, masterclassVideos, loading } = useSelector(state => state.podcast);

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

  const filters = [
    { value: 'tl', label: 'Title' },
    { value: 'dt', label: 'Date' },
  ];

  const handleFilter = (selectedFilter) => {
    setFilterBy(selectedFilter);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          dispatch(getGuidanceVideos()),
          dispatch(getMasterclassVideos()),
          dispatch(getAllPodcast())
        ]);
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsInitialLoad(false);
      }
    };

    loadInitialData();
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !isInitialLoad) {
      switch (activeLevel) {
        case 0:
          setPageVideos(guidanceVideos);
          break;
        case 1:
          setPageVideos(masterclassVideos);
          break;
        case 2:
          setPageVideos(podcasts);
          break;
        default:
          break;
      }
    }
  }, [activeLevel, loading, isInitialLoad, guidanceVideos, masterclassVideos, podcasts]);

  useEffect(() => {
    const endOffset = itemOffset + videosPerPage;
    setCurrentPageVideos(pageVideos.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(pageVideos.length / videosPerPage));
  }, [pageVideos, itemOffset, videosPerPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * videosPerPage) % pageVideos.length;
    setItemOffset(newOffset);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam !== null) {
      setActiveLevel(parseInt(tabParam));
    }
  }, [location]);

  const handleLevelChange = (index) => {
    setActiveLevel(index); // Update the active tab
    const newUrl = `${window.location.pathname}?tab=${index}`;
    window.history.pushState({}, '', newUrl);
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
    if (activeLevel === 0) {
      return 'Encouragement Videos';
    } else if (activeLevel === 1) {
      return 'Career Guidance';
    } else if (activeLevel === 2) {
      return 'Story in Motion Podcast Episodes';
    }
    return '';
  };

  return (
    <div id="main-body">
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
            <div style={{ marginBottom: '2rem' }}>
              <Link to="/beyond-your-course" style={{ color: '#000000' }}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <span style={{ marginLeft: '0.5rem' }}>{getSubtitle()}</span>
            </div>

            <h3 className="page-title">{pageTitle}</h3>
            <p className="page-description">{pageDescription}</p>
          </div>

          <div className="gradient-background-story">
            <div className="level-navigation">
              <div
                className={`course-level ${activeLevel === 0 ? 'active-level-master' : ''
                  }`}
                onClick={() => handleLevelChange(0)}
              >
                Encouragement Videos
              </div>
              <div
                className={`course-level ${activeLevel === 1 ? 'active-level-master' : ''
                  }`}
                onClick={() => handleLevelChange(1)}
              >
                Career Guidance Videos
              </div>
              <div
                className={`course-level ${activeLevel === 2 ? 'active-level-master' : ''
                  }`}
                onClick={() => handleLevelChange(2)}
              >
                Story in Motion Podcast Episodes
              </div>
            </div>

            <div className="d-flex justify-content-between"></div>

            <div className="content-videos-container-wrapper">
              <div className="content-videos-container">
                {currentPageVideos.map((video, index) => (
                  <Video
                    key={index}
                    id={video.id}
                    thumbnail={video.thumbnail || storyInMotionPodcast}
                    title={video.title}
                    description={video.description}
                    page={activeLevel === 2 ? 'podcast' : activeLevel === 1 ? 'master-classes' : 'encouragement'}
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
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default injectIntl(StoryInMotion);