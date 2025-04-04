import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import ReactPaginate from 'react-paginate';
import Waveform from './waveform';
import storyInMotionPodcast from '../../assets/images/story-in-motion-podcast.png';
import ModalInput from '../../components/ModalInput/ModalInput';
import { injectIntl } from 'react-intl';
import { Modal } from 'react-bootstrap'; 
import searchJ from '../../assets/images/academy-icons/search.png';
import Select from 'react-select';
import Video from '../../components/Video';
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import storyInMotion from '../../assets/images/story-in-motion-logo.png'
import './StoryInMotion.css';

function StoryInMotion({ intl }) {
  const [activeLevel, setActiveLevel] = useState(2); 
  const [pageTitle, setPageTitle] = useState('');
  const [pageDescription, setPageDescription] = useState('');
  const [pageVideos, setPageVideos] = useState([]);
  const [currentPageVideos, setCurrentPageVideos] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const videosPerPage = 15;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedAudio, setSelectedAudio] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [filterBy, setFilterBy] = useState(null);

  const filters = [
    { value: 'tl', label: 'Title' },
    { value: 'dt', label: 'Date' },
  ];

  const handleFilter = (selectedFilter) => {
    setFilterBy(selectedFilter);
  };

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
    switch (activeLevel) {
      case 0: // Encouragement Videos
        setPageTitle('MASTER CLASSES | ENCOURAGEMENT VIDEOS');
        setPageDescription('Videos From The Founder And CEO Of The Startup Studio To Help You On Your Journey.');
        getEncouragementVideos();
        break;
      case 1: // Career Guidance Videos
        setPageTitle('MASTER CLASSES | CAREER GUIDANCE');
        setPageDescription('Ongoing Guidance From Entrepreneurs And Experts To Help You On Your Journey');
        getMasterClassVideos();
        break;
      case 2: // Story in Motion Podcast Episodes
        setPageTitle('MASTER CLASSES | STORY IN MOTION PODCAST EPISODES');
        setPageDescription('Ongoing Guidance From Entrepreneurs And Experts To Help You On Your Journey');
        fetchPodcastEpisodes();
        break;
      default:
        break;
    }
  }, [activeLevel]);

  const getEncouragementVideos = async () => {
    try {
      const response = await axiosInstance.get('/contents/by-type/guidance');
      setPageVideos(response.data);
      setItemOffset(0);
    } catch (error) {
      console.error('Error fetching encouragement videos:', error);
    }
  };

  const getMasterClassVideos = async () => {
    try {
      const response = await axiosInstance.get('/contents/by-type/master');
      setPageVideos(response.data);
      setItemOffset(0);
    } catch (error) {
      console.error('Error fetching career guidance videos:', error);
    }
  };

  const fetchPodcastEpisodes = async () => {
    try {
      const response = await axiosInstance.get('/podcast?page=0&size=100');
      setPageVideos(response.data.data);
      setItemOffset(0);
    } catch (error) {
      console.error('Error fetching podcast episodes:', error);
    }
  };

  const handleLevelChange = (index) => {
    setActiveLevel(index); // Update the active tab
  };

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword.toLowerCase());
    const filteredVideos = pageVideos.filter((video) =>
      video.title.toLowerCase().includes(keyword.toLowerCase())
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

  const handleAudioClick = (podcast) => {
    if (activeLevel === 2) {
      setSelectedAudio(podcast);
      setIsPlaying(true);
      setShowAudioModal(true);
    }
  };

  return (
    <div id="main-body">
      <div>
        <div>
          <div className="page-padding">
            <div style={{ marginBottom: '2rem' }}>
              <Link to="/beyond-your-course" style={{ color: '#000000' }}>
                Master Classes &gt;{' '}
              </Link>
              <span>{getSubtitle()}</span>
            </div>

            <h3 className="page-title">{pageTitle}</h3>
            <p className="page-description">{pageDescription}</p>
          </div>

          <div className="gradient-background-story">
            <div className="level-navigation">
              <div
                className={`course-level ${
                  activeLevel === 0 ? 'active-level-master' : ''
                }`}
                onClick={() => handleLevelChange(0)}
              >
                Encouragement Videos
              </div>
              <div
                className={`course-level ${
                  activeLevel === 1 ? 'active-level-master' : ''
                }`}
                onClick={() => handleLevelChange(1)}
              >
                Career Guidance Videos
              </div>
              <div
                className={`course-level ${
                  activeLevel === 2 ? 'active-level-master' : ''
                }`}
                onClick={() => handleLevelChange(2)}
              >
                Story in Motion Podcast Episodes
              </div>
            </div>

        <div className='d-flex justify-content-between'>
        <div className="search-input-wrapper">
              <div className="justify-content-between">
                <div>
                  <ModalInput
                    className="course-btn search-journal"
                    onChange={handleSearch}
                    id={'searchBar'}
                    type={'search'}
                    labelTitle={
                      activeLevel === 2
                        ? intl.formatMessage({
                            id: 'my_journal.search_podcasts',
                            defaultMessage: 'Search podcasts',
                          })
                        : intl.formatMessage({
                            id: 'my_journal.search_lessons_',
                            defaultMessage: 'Search lessons',
                          })
                    }
                    imgSrc={searchJ}
                    imageStyle={{ filter: 'grayscale(1)' }}
                  />
                </div>
              </div>
            </div>
            <div
                 style={{
                                  display: 'inline-block',
                                  borderRadius: '8px',
                                  background:
                                    'linear-gradient(to bottom, #FF3399 0%, #51C7DF 100%)',
                                  padding: '1px', // Adjust this value to control border thickness
                                  height: '58px',
                                  boxShadow: '0px 4px 10px 0px #00000040',
                             
                                }}>  
                    <Select
                                             options={filters}
                                             value={filterBy}
                                             onChange={handleFilter}
                                             placeholder='Sort By'
                                             menuPortalTarget={document.body}
                                             isSearchable={false}
                                             styles={{
                                               menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                               control: (base) => ({
                                                 ...base,
                                                 width: '157px', // Fixed width
                                                 minHeight: '40px', // Fixed height
                                                 overflow: 'hidden',
                                                 border: 'none', // Remove the default border
                                                 borderRadius: '6px' // Slightly smaller than the outer container radius
                                               }),
                                               singleValue: (base) => ({
                                                 ...base,
                                                 whiteSpace: 'nowrap',
                                                 overflow: 'hidden',
                                                 textOverflow: 'ellipsis'
                                               })
                                             }}
                                             components={{
                                               IndicatorSeparator: () => null 
                                             }}
                                           /></div>
        </div>

            <div className="row videos-container">
              {currentPageVideos.map((video, index) => (
                <div
                  key={index}
                  className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4" 
                  style={{ margin: '0 1rem' }}
                >
                  {activeLevel === 2 ? (
                    
                    <div
                      onClick={() => handleAudioClick(video)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={video.thumbnail || storyInMotionPodcast}
                        alt={video.title}
                        className="img-fluid"
                        style={{
                          borderRadius: '15px',
                          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <h5 className="podcast-title" style={{ textAlign: 'center', marginTop: '10px' }}>
                        {video.title}
                      </h5>
                      <p
                        style={{
                          textAlign: 'center',
                          color: '#666',
                          fontSize: '12px',
                          marginTop: '5px',
                        }}
                      >
                        {new Intl.DateTimeFormat('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }).format(new Date(video.date || video.createdAt))}
                      </p>
                    </div>
                  ) : (
                    <Video
                      id={video.id}
                      thumbnail={video.thumbnail || storyInMotionPodcast}
                      title={video.title}
                      description={video.description}
                      page={
                        activeLevel === 1
                          ? 'master-classes'
                          : 'encouragement'
                      }
                      videoData={video}
                    />
                  )}
                </div>
              ))}

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

      {showAudioModal && selectedAudio && activeLevel === 2 && (
        <Modal
          show={showAudioModal}
          onHide={() => {
            setShowAudioModal(false);
            setIsPlaying(false);
          }}
          centered
          size="lg"
          className="podcast-modal"
        >
          <Modal.Header>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src={storyInMotion} // Use the correct imported logo
                    alt="Story in Motion Logo"
                    style={{ width: '36px', height: '36px' }}
                  />
                  <Modal.Title style={{ fontWeight: '400', fontSize: '13px' }}>
                    {selectedAudio.title}
                  </Modal.Title>
                </div>
                <img
                className="left-arrow-modal"
                  src={leftArrow}
                  alt="Close"
                 
                  onClick={() => {
                    setShowAudioModal(false);
                    setIsPlaying(false);
                  }}
                />
              </div>
              <div style={{ fontWeight: '600', fontSize: '12px', color: '#333' }}>
                Now Playing: {selectedAudio.title}
              </div>
            </div>
          </Modal.Header>
          <Modal.Body>
            <Waveform
              url={selectedAudio.url}
              isPlayingParent={setIsPlaying}
              isPlaying={isPlaying}
              selectedTrack={selectedAudio}
            />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default injectIntl(StoryInMotion);