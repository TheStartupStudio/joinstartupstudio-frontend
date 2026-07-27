import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Video from '../../components/Video';
import IntMessages from '../../utils/IntlMessages';
import masterIcon from '../../assets/images/master-icon.png';
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import './index.css';
import NotificationBell from '../../components/NotificationBell'
import axiosInstance from '../../utils/AxiosInstance'
import EnLangs from '../../lang/locales/en_US.js'


export default function BeyondYourCourse() {
  const dispatch = useDispatch();

  const [encouragementLevel, setEncouragementLevel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchMasterclassContent();
  }, []);

  const fetchMasterclassContent = async () => {
    try {
      setLoading(true);

      const levelsResponse = await axiosInstance.get('/contents/masterclass/levels');
      const allLevels = levelsResponse.data;

      const encouragement = allLevels.find(
        (level) => level.title === 'Encouragement Videos'
      );

      if (!encouragement) {
        setEncouragementLevel(null);
        setVideos([]);
        return;
      }

      setEncouragementLevel(encouragement);

      const contentResponse = await axiosInstance.get(
        `/contents/by-journal-level/${encouragement.id}`
      );
      const transformedContent = (contentResponse.data.data || []).map((item) => ({
        ...item,
        title: translateVideoTitle(item.title),
        description: translateDescription(item.description)
      }));

      setVideos(transformedContent);
    } catch (error) {
      console.error('Error fetching masterclass content:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEncouragementVideos = () => {
    if (loading) {
      return <div className="text-center p-4">Loading...</div>;
    }

    if (!videos || videos.length === 0) {
      return <div className="text-center p-4">No content available for Encouragement Videos.</div>;
    }

    return (
      <div className="content-videos-container">
        {videos.map((video, index) => (
          <Video
            key={video.id || index}
            id={video.id}
            thumbnail={video.thumbnail}
            title={video.title}
            description={video.description}
            page="encouragement"
            videoData={video}
            type="view-all"
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
              <div className="videos-container">
                <div className="guidance-videos-top mb-3 guidance-encouragement-page-titles">
                  <div className="title-container">
                    <img
                      src={masterIcon}
                      alt="logo"
                      style={{ width: '36px', height: '36px' }}
                      className="welcome-journey-text__icon"
                    />
                    <div style={{ textAlign: 'start' }}>
                      <h3 className="mb-0">
                        {encouragementLevel?.title || 'Encouragement Videos'}
                      </h3>
                      <p className="guidance-subtitle mb-0">
                        Gary Conroy, Founder and CEO of Learn to Start
                      </p>
                    </div>
                  </div>
                </div>
                {renderEncouragementVideos()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
