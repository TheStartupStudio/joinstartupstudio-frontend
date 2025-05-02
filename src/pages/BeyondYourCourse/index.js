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
import './index.css';

export default function BeyondYourCourse() {
  const dispatch = useDispatch();
  const { podcasts, guidanceVideos, masterclassVideos, loading } = useSelector(state => state.podcast);

  const [startVideoIndex, setStartVideoIndex] = useState(0);
  const [endVideoIndex, setEndVideoIndex] = useState(5);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    dispatch(getGuidanceVideos());
    dispatch(getMasterclassVideos());
    dispatch(getAllPodcast());
  }, [dispatch]);

  const renderGuidanceVideos = () => (
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

  const renderMasterClassVideos = () => (
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

  const renderPodcastEpisodes = () => (
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
                    <h3>
                      <IntMessages id="beyond_your_course.encouragement_no_videos" />
                    </h3>
                  </div>
                  <Link
                    className="guidance-link"
                    to={`/story-in-motion/videos?tab=0`}
                    onClick={() => window.scrollTo({ top: 0 })}
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
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
