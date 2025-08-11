import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPodcast, getGuidanceVideos, getMasterclassVideos } from '../../redux/podcast/Actions';
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

export default function BeyondYourCourse() {
  const dispatch = useDispatch();
  const { podcasts, guidanceVideos, masterclassVideos, loading } = useSelector(state => state.podcast);

  const [startVideoIndex, setStartVideoIndex] = useState(0);
  const [endVideoIndex, setEndVideoIndex] = useState(5);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Only fetch if we don't have the data
    if (!guidanceVideos?.length || !masterclassVideos?.length || !podcasts?.length) {
      dispatch(getGuidanceVideos());
      dispatch(getMasterclassVideos());
      dispatch(getAllPodcast());
    }
  }, [dispatch, guidanceVideos, masterclassVideos, podcasts]);

  const renderGuidanceVideos = () => {
    if (loading) {
      return <div className="text-center p-4">Loading...</div>;
    }
    return (
      <div className="card-group desktop-menu card-group-beyond-your-course w-100">
        {guidanceVideos?.slice(startVideoIndex, endVideoIndex).map((video, index) => (
          <Video
            key={index}
            id={video.id}
            thumbnail={video.thumbnail}
            title={video.title}
            description={video.description}
            page={'encouragement'}
            isMainPage={true}
            videoData={video}
          />
        ))}
      </div>
    );
  };

  const renderMasterClassVideos = () => {
    if (loading) {
      return <div className="text-center p-4">Loading...</div>;
    }
    return (
      <div className="card-group desktop-menu card-group-beyond-your-course w-100">
        {masterclassVideos?.slice(startVideoIndex, endVideoIndex).map((video, index) => (
          <Video
            key={index}
            id={video.id}
            thumbnail={video.thumbnail}
            title={video.title}
            description={video.description}
            page={'master-classes'}
            isMainPage={true}
            videoData={video}
          />
        ))}
      </div>
    );
  };

  const renderPodcastEpisodes = () => {
    if (loading) {
      return <div className="text-center p-4">Loading...</div>;
    }
    return (
      <div className="card-group desktop-menu card-group-beyond-your-course w-100">
        {podcasts?.slice(startVideoIndex, endVideoIndex).map((video, index) => (
          <Video
            key={index}
            id={video.id}
            thumbnail={video.thumbnail || storyInMotionPodcast}
            title={video.title}
            description={video.description}
            page={'podcast'}
            isMainPage={true}
            videoData={video}
          />
        ))}
      </div>
    );
  };

  const renderLiveQAVideos = () => {
    // Dummy data for Live Q&A videos with dates
    const liveQAVideos = [
      {
        id: 'liveqa-1',
        title: 'Live Q&A Session #1',
        description: 'December 12, 2024',
        thumbnail: LiveQA,
        createdAt: '2024-01-15T10:00:00.000Z', // January 15, 2024
        type: 'live-qa' // Add type to enable description display
      },
      {
        id: 'liveqa-2', 
        title: 'Live Q&A Session #2',
        description: 'December 17, 2024',
        thumbnail: LiveQA,
        createdAt: '2024-02-20T14:30:00.000Z', // February 20, 2024
        type: 'live-qa'
      },
      {
        id: 'liveqa-3',
        title: 'Live Q&A Session #3', 
        description: 'January 04, 2025',
        thumbnail: LiveQA,
        createdAt: '2024-03-10T16:00:00.000Z', // March 10, 2024
        type: 'live-qa'
      },
      {
        id: 'liveqa-4',
        title: 'Live Q&A Session #4',
        description: 'January 13, 2025',
        thumbnail: LiveQA,
        createdAt: '2024-04-05T11:15:00.000Z', // April 5, 2024
        type: 'live-qa'
      },
      {
        id: 'liveqa-5',
        title: 'Live Q&A Session #5',
        description: 'January 25, 2025',
        thumbnail: LiveQA,
        createdAt: '2024-05-12T13:45:00.000Z', // May 12, 2024
        type: 'live-qa'
      }
    ];

    return (
      <div className="card-group desktop-menu card-group-beyond-your-course w-100">
        {liveQAVideos.map((video, index) => (
          <Video
            key={index}
            id={video.id}
            thumbnail={video.thumbnail}
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
            <div className="col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4">
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
              <img
                    src={MenuIcon}
                    alt='menu'
                    className='menu-icon-cie self-start-tab cursor-pointer'
                    onClick={() => dispatch(toggleCollapse())}
                  />
            </div>
            <div className="gradient-background-master">
              <div className="videos-container">
                <div className="guidance-videos-top mb-3 guidance-encouragement-page-titles">
                  <div className="title-container">
                    <img
                      src={masterIcon}
                      alt="logo"
                      style={{ width: '36px', height: '36px' }}
                      className="welcome-journey-text__icon"
                    />
                    <div style={{textAlign:'start'}}>
                      <h3 className="mb-0">
                        <IntMessages id="beyond_your_course.encouragement_no_videos" />
                      </h3>
                      <p className="guidance-subtitle mb-0">Gary Conroy, Founder and CEO of Learn to Start</p>
                    </div>
                  </div>
                  <Link
                    className="guidance-link"
                    to={`/story-in-motion/videos?tab=0`}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    style={{ marginRight: '1rem' }}
                  >
                    <IntMessages id="general.view_all" />
                    <img src={rightArrow} style={{ marginLeft: '10px', marginBottom: '3px' }} />
                  </Link>
                </div>
                {renderGuidanceVideos()}
              </div>

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
                      <IntMessages id="beyond_your_course.Career_Guidance" />
                    </h3>
                  </div>
                  <Link
                    className="guidance-link"
                    to={`/story-in-motion/videos?tab=1`}
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    style={{ marginRight: '1rem' }}
                  >
                    <IntMessages id="general.view_all" />
                    <img src={rightArrow} style={{ marginLeft: '10px', marginBottom: '3px' }} />
                  </Link>
                </div>
                {renderMasterClassVideos()}
              </div>

              <div className="videos-container">
                <div className="guidance-videos-top mb-3 guidance-encouragement-page-titles">
                  <div className="title-container">
                    <img
                      src={storyInMotion}
                      alt="logo"
                      style={{ width: '36px', height: '36px' }}
                      className="welcome-journey-text__icon"
                    />
                    <h3>
                      <IntMessages id="beyond_your_course.startup_live" />
                    </h3>
                  </div>
                  <Link
                    className="guidance-link"
                    to="/story-in-motion/videos?tab=2"
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
                {renderPodcastEpisodes()}
              </div>

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
                    to="/beyond-your-course"
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
