import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import './ForumSection.css'
import mentorship from '../../assets/images/academy-icons/svg/icon.core-mentorship-icon.svg'
import wavingHand from '../../assets/images/academy-icons/svg/Waving Hand.svg'
import speechBalloon from '../../assets/images/academy-icons/svg/Speech Balloon.svg'
import partyPopper from '../../assets/images/academy-icons/svg/Party Popper.svg'
import loudSpeaker from '../../assets/images/academy-icons/svg/Loudspeaker.svg'
import lightBulb from '../../assets/images/academy-icons/svg/Light Bulb.svg'
import pin from '../../assets/images/academy-icons/svg/pin.svg'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import axiosInstance from '../../utils/AxiosInstance'

const ForumSection = () => {
  const history = useHistory()
  const [forumData, setForumData] = useState([])
  const [loading, setLoading] = useState(true)

  // Function to get the appropriate icon based on category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Introductions':
        return wavingHand
      case 'Announcements':
        return loudSpeaker
      case 'Celebrations':
        return partyPopper
      case 'Ideas & Feedback':
        return lightBulb
      default:
        return speechBalloon
    }
  }

  // Fetch forum data from API
  useEffect(() => {
    const fetchForumData = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get('/forum/section/dashboardForum')
        setForumData(response.data)
      } catch (error) {
        console.error('Error fetching forum data:', error)
        // Keep dummy data as fallback
        setForumData([])
      } finally {
        setLoading(false)
      }
    }

    fetchForumData()
  }, [])

  // Skeleton component for loading state
  const ForumPostSkeleton = () => (
    <div className="forum-post-section-skeleton">
      <div className="skeleton-avatar-container">
        <div className="skeleton-avatar"></div>
      </div>
      <div className="skeleton-content">
        <div className="skeleton-category"></div>
        <div className="skeleton-title"></div>
        <div className="skeleton-description"></div>
        <div className="skeleton-description short"></div>
      </div>
    </div>
  )

  return (
    <div className="forum-section">
      <div className="forum-header">
        <div className="forum-title-container">
          <div className="forum-icon"><img src={mentorship} alt="Mentorship Icon" /></div>
          <h4 className='fs-9 my-details-header'>Startup Forum</h4>
        </div>
        <div
          className='progress-details cursor-pointer'
          onClick={() => history.push('/startup-forum')}  
        >
          <span>Go to Forum</span>
          <img src={rightArrow} alt='right-arr' />
        </div>
      </div>

      <div className="forum-content">
        {loading ? (
          // Show skeleton loading state
          Array.from({ length: 5 }, (_, index) => (
            <ForumPostSkeleton key={index} />
          ))
        ) : forumData.length > 0 ? (
          // Show actual forum data
          forumData.map((post, index) => (
            <div key={post.id} className="forum-post"
              onClick={() => history.push(`/startup-forum/${post.id}`)}
            >
              <div className="post-avatar-container">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name}
                  className="post-avatar"
                />
                {/* {post.isNew && <div className="new-indicator"><img src={pin} alt="Pin Icon" /></div>} */}
              </div>
              
              <div className="post-content">
                <div className="post-header">
                  <span 
                    className="post-category"
                    style={{ backgroundColor: post.categoryColor }}
                  >
                    <img 
                      src={getCategoryIcon(post.category)} 
                      alt={post.category}
                      className="category-icon"
                    />
                    {post.category}
                  </span>
                </div>
                
                <h4 className="post-title">{post.title}</h4>
                {/* Use dangerouslySetInnerHTML to render HTML content properly */}
                <div 
                  className="post-description"
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    whiteSpace: 'normal',
                    hyphens: 'auto',
                    maxWidth: '100%'
                  }}
                  dangerouslySetInnerHTML={{ 
                    __html: post.description 
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          // Show empty state
          <div className="forum-empty-state">
            <p>No forum discussions available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForumSection