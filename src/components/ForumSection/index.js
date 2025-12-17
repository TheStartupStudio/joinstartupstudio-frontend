import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './ForumSection.css'
import UserAgreementModal from '../UserAgreementModal'
import mentorship from '../../assets/images/academy-icons/svg/icon.core-mentorship-icon.svg'
import wavingHand from '../../assets/images/academy-icons/svg/Waving Hand.svg'
import speechBalloon from '../../assets/images/academy-icons/svg/Speech Balloon.svg'
import partyPopper from '../../assets/images/academy-icons/svg/Party Popper.svg'
import loudSpeaker from '../../assets/images/academy-icons/svg/Loudspeaker.svg'
import lightBulb from '../../assets/images/academy-icons/svg/Light Bulb.svg'
import star from '../../assets/images/academy-icons/svg/star.svg'
import message from '../../assets/images/academy-icons/svg/message-text.svg'
import reply from '../../assets/images/academy-icons/svg/reply.svg'
import chatBubble from '../../assets/images/academy-icons/svg/chat-bubble-empty.svg'
import threeDots from '../../assets/images/academy-icons/svg/more-horiz.svg'
import rightArrow from '../../assets/images/academy-icons/right-arrow.png'
import axiosInstance from '../../utils/AxiosInstance'
import blankProfile from '../../assets/images/academy-icons/blankProfile.jpg'

const ForumSection = () => {
  const history = useHistory()
  const [forumData, setForumData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUserAgreement, setShowUserAgreement] = useState(false)
  const currentUser = useSelector((state) => state.user?.user?.user || state.user?.user)

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

  // Function to get shortened display name for categories
  const getCategoryDisplayName = (category) => {
    switch (category) {
      case 'Ask for Feedback':
        return 'Feedback'
      case 'Ask for Collaboration':
        return 'Collaboration'
      case 'Ask for Mentorship':
        return 'Mentorship'
      default:
        return category
    }
  }

  // Fetch forum data from API
  useEffect(() => {
    const fetchForumData = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get('/forum', {
          params: {
            page: 1,
            limit: 5,
            filter: 'Latest'
          }
        })

        const discussions = response.data.discussions || []
       
        
        const mappedData = discussions.map(post => ({
          ...post,
          latestReplyFrom: post.author?.name 
        }))
        
        setForumData(mappedData)
      } catch (error) {
        console.error('Error fetching forum data:', error)
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

  const handleEditPost = (post, event) => {
    event.stopPropagation()
    // Handle edit functionality if needed for dashboard
    console.log('Edit post:', post)
  }

  const handleGoToForum = () => {
    if (!currentUser?.forumAgreement) {
      setShowUserAgreement(true)
      return
    }
    history.push('/startup-forum')
  }

  const handlePostClick = (postId) => {
    if (!currentUser?.forumAgreement) {
      setShowUserAgreement(true)
      return
    }
    history.push(`/startup-forum/${postId}`)
  }

  const handleUserAgreementSuccess = () => {
    setShowUserAgreement(false)
    history.push('/startup-forum')
  }

  return (
    <div className="forum-section">
      <div className="forum-header">
        <div className="forum-title-container">
          <div className="forum-icon"><img src={mentorship} alt="Mentorship Icon" /></div>
          <h4 className='fs-9 my-details-header'>Startup Forum</h4>
        </div>
        <div
          className='cursor-pointer d-flex gap-2 align-items-center'
          style={{fontWeight: 500}}
          onClick={handleGoToForum}  
        >
          <span>Go to Forum</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5.00033 10H15.417M15.417 10L10.417 5M15.417 10L10.417 15" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="forum-content">
        {loading ? (
          // Show skeleton loading state
          Array.from({ length: 5 }, (_, index) => (
            <ForumPostSkeleton key={index} />
          ))
        ) : forumData.length > 0 ? (
          // Show actual forum data with exact same structure as StartupForumPage
          forumData.map((post) => (
            <div 
              key={post.id} 
              className="forum-post"
              onClick={() => handlePostClick(post.id)}
            >
              <div className="post-avatar-container">
                <img
                  src={post.author.avatar || blankProfile}
                  alt={post.author.name}
                  className="post-avatar"
                />
                {/* Show star indicator if user owns the post */}
                {currentUser &&
                  post.author &&
                  currentUser.id &&
                  post.author.id &&
                  parseInt(currentUser.id) === parseInt(post.author.id) && (
                    <div className="new-indicator">
                      <img 
                        src={star} 
                        alt="Your Post" 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          filter: 'invert(1) brightness(1000%)' 
                        }} 
                      />
                    </div>
                  )}
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
                    {getCategoryDisplayName(post.category)}
                  </span>
                </div>

                <h4 className="post-title">{post.title}</h4>

                <div className='d-flex gap-3 align-items-center'>
                  <div className='d-flex align-items-center gap-2 justify-content-center'>
                    <img src={message} alt="Message Icon" />
                    <p className='mb-0 pb-0 post-date-paragraph'>
                      Posted: <span>{post.date}</span>
                    </p>
                  </div>
                  {
                    post.latestReplyFrom && (
                      <div className='d-flex align-items-center gap-2 justify-content-center'>
                    <img src={reply} alt="Reply Icon" />
                    <p className='mb-0 pb-0 post-date-paragraph'>
                      Latest reply from <span>{post.latestReplyFrom}</span>
                    </p>
                  </div>
                    )

                  }
                </div>

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

              <div className='d-flex flex-column gap-2 justify-content-end'>
                <div className="post-right-section">
                  {post.participants && post.participants.filter(p => p !== null).slice(0, 4).map((participant, idx) => (
                    <img
                      key={idx}
                      src={participant}
                      alt="participant"
                      className="participant-avatar"
                    />
                  ))}
                  {currentUser &&
                    post.author &&
                    currentUser.id &&
                    post.author.id &&
                    parseInt(currentUser.id) === parseInt(post.author.id) && (
                      <div className="participant-more" onClick={(e) => handleEditPost(post, e)}>
                        <img src={threeDots} alt="More Options" />
                      </div>
                    )}
                </div>
                <div className="post-comments-count">
                  <img src={chatBubble} alt="Comments Icon" className="comments-icon" />
                  <span className="post-date-paragraph">{post.comments} comments</span>
                </div>
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

      {/* User Agreement Modal */}
      <UserAgreementModal 
        show={showUserAgreement}
        onSuccess={handleUserAgreementSuccess}
        onHide={() => setShowUserAgreement(false)}
      />
    </div>
  )
}

export default ForumSection