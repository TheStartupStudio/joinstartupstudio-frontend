import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './ForumPage.css'
import IntlMessages from '../../utils/IntlMessages'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { useDispatch } from 'react-redux'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import axiosInstance from '../../utils/AxiosInstance'

import wavingHand from '../../assets/images/academy-icons/svg/Waving Hand.svg'
import speechBalloon from '../../assets/images/academy-icons/svg/Speech Balloon.svg'
import partyPopper from '../../assets/images/academy-icons/svg/Party Popper.svg'
import loudSpeaker from '../../assets/images/academy-icons/svg/Loudspeaker.svg'
import searchIcon from '../../assets/images/academy-icons/svg/search-black.svg'
import pin from '../../assets/images/academy-icons/svg/pin.svg'
import message from '../../assets/images/academy-icons/svg/message-text.svg'
import reply from '../../assets/images/academy-icons/svg/reply.svg'
import chatBubble from '../../assets/images/academy-icons/svg/chat-bubble-empty.svg'
import threeDots from '../../assets/images/academy-icons/svg/more-horiz.svg'
import star from '../../assets/images/academy-icons/svg/star.svg'
import lightBulb from '../../assets/images/academy-icons/svg/Light Bulb.svg'
import editIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import AcademyBtn from '../../components/AcademyBtn'
import StartNewDiscussionModal from './StartNewDiscussionModal'

const StartupForumPage = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  
  const currentUser = useSelector(state => state.user?.user?.user || state.user?.user)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Latest First')
  const [selectedCategory, setSelectedCategory] = useState('All Discussions')
  const [showDiscussionModal, setShowDiscussionModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [forumData, setForumData] = useState([])

  const toggleDiscussionModal = () => {
    setShowDiscussionModal(prev => !prev)
    if (showDiscussionModal) {
      setEditingPost(null)
    }
  }

  const handleEditPost = (post, event) => {
    event.stopPropagation() 
    setEditingPost(post)
    setShowDiscussionModal(true)
  }

  const fetchForumData = async (page = 1, category = null, search = null, sort = 'created_at', order = 'DESC') => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 3,
        sort,
        order
      }

      if (search && search.trim()) {
        params.search = search.trim()
      }

      let endpoint = '/forum'
      
      if (category && category !== 'All Discussions' && category !== 'Following') {
        const categoryMapping = {
          'Introductions': 'introductions',
          'Announcements': 'announcements',
          'Celebrations': 'celebrations',
          'Ideas & Feedback': 'ideas-feedback',
          'Misc. Topics': 'misc-topics'
        }
        
        const urlCategory = categoryMapping[category]
        if (urlCategory) {
          endpoint = `/forum/${urlCategory}`
        }
      }

      const response = await axiosInstance.get(endpoint, { params })
      
      if (response.data) {
        setForumData(response.data.discussions)
        setTotalCount(response.data.totalCount)
        setCurrentPage(response.data.currentPage)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching forum data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const category = getCurrentCategoryFromUrl()
    setSelectedCategory(category)
    fetchForumData(1, category, null, 'created_at', 'DESC')
  }, [])

  const handleDiscussionSuccess = (discussion, action = 'create') => {
    if (action === 'delete') {
      setForumData(prevData => prevData.filter(post => post.id !== editingPost?.id))
    } else if (action === 'create') {
      fetchForumData(currentPage, selectedCategory, searchTerm)
    } else {
      setForumData(prevData => 
        prevData.map(post => 
          post.id === discussion.id ? { ...post, ...discussion } : post
        )
      )
    }
    
    setEditingPost(null)
    setShowDiscussionModal(false)
  }

  const handleNewDiscussion = () => {
    setEditingPost(null)
    setShowDiscussionModal(true)
  }

  const getCurrentCategoryFromUrl = () => {
    const path = location.pathname.toLowerCase()
    
    if (path.includes('introductions')) return 'Introductions'
    if (path.includes('announcements')) return 'Announcements'
    if (path.includes('celebrations')) return 'Celebrations'
    if (path.includes('ideas') || path.includes('feedback')) return 'Ideas & Feedback'
    if (path.includes('misc')) return 'Misc. Topics'
    if (path.includes('following')) return 'Following'
    return 'All Discussions'
  }

  useEffect(() => {
    setSelectedCategory(getCurrentCategoryFromUrl())
  }, [location.pathname])

  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    
    switch (category) {
      case 'All Discussions':
        history.push('/startup-forum')
        break
      case 'Following':
        history.push('/startup-forum/following')
        break
      case 'Introductions':
        history.push('/startup-forum/introductions')
        break
      case 'Announcements':
        history.push('/startup-forum/announcements')
        break
      case 'Celebrations':
        history.push('/startup-forum/celebrations')
        break
      case 'Ideas & Feedback':
        history.push('/startup-forum/ideas-feedback')
        break
      case 'Misc. Topics':
        history.push('/startup-forum/misc-topics')
        break
      default:
        history.push('/startup-forum')
    }
  }

  const getHeaderContent = () => {
    const path = location.pathname.toLowerCase()
    
    if (path.includes('introductions')) {
      return {
        icon: wavingHand,
        title: 'INTRODUCTIONS',
        description: 'Welcome to our newest members. Please share a little about yourself, what brought you to the Academy in Entrepreneurship, and what your goal or vision is.'
      }
    } else if (path.includes('announcements')) {
      return {
        icon: loudSpeaker,
        title: 'ANNOUNCEMENTS',
        description: 'Find announcements, news, and updates about the platform and Learn to Start.'
      }
    } else if (path.includes('celebrations')) {
      return {
        icon: partyPopper,
        title: 'CELEBRATIONS',
        description: 'Celebrate your achievements and the achievements of your peers.'
      }
    } else if (path.includes('ideas') || path.includes('feedback')) {
      return {
        icon: lightBulb,
        title: 'IDEAS & FEEDBACK',
        description: 'Share your ideas and get feedback from your peers.'
      }
    } else if (path.includes('misc')) {
      return {
        icon: speechBalloon,
        title: 'MISC. TOPICS',
        description: 'Ask questions and chat about other course or entrepreneurship topics.'
      }
    }
    return null
  }

  const headerContent = getHeaderContent()

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

  const categories = [
    'All Discussions',
    'Following',
    'Introductions',
    'Announcements',
    'Celebrations',
    'Ideas & Feedback',
    'Misc. Topics'
  ]

  const filterOptions = ['Latest First', 'Oldest First', 'Most Comments']

  return (
    <>
      <div className='d-flex space-between align-items-center'>
        <div className='col-12 col-md-12 pe-0 me-0 d-flex-tab justify-content-between p-1rem-tab p-right-1rem-tab gap-4'>
          <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
            <div>
              <h3 className='page-title bold-page-title text-black mb-0'>Startup Forum</h3>
              <p className='fs-13 fw-light text-black'>Connect with others and Share Your Achievements</p>
            </div>
          </div>
          <img
            src={MenuIcon}
            alt='menu'
            className='menu-icon-cie self-start-tab cursor-pointer'
            onClick={() => dispatch(toggleCollapse())}
          />
        </div>
      </div>

      <div className="forum-page">
        <div className="forum-page-container">
          <div className="forum-main-content">
            {/* Search and Controls */}
            <div className="forum-controls">
              <div className="search-section">
                <div className="search-box">
                  <img 
                    src={searchIcon} 
                    alt="Search" 
                    className="forum-search-icon"
                    style={{
                      filter: isSearchFocused 
                        ? 'brightness(0) saturate(100%) invert(47%) sepia(68%) saturate(478%) hue-rotate(166deg) brightness(94%) contrast(89%)'
                        : 'none',
                      transition: 'filter 0.2s ease'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search discussions"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="search-input"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="filter-dropdown"
                >
                  {filterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conditionally render header content only if it exists */}
            {headerContent && (
              <div className='d-flex flex-column gap-2 mb-2'>
                <div className='d-flex gap-2 align-items-center'>
                  <img src={headerContent.icon} alt={`${headerContent.title} Icon`} style={{ width: '24px', height: '24px' }} />
                  <span className='fs-21 fw-bold'>{headerContent.title}</span>
                </div>
                <p className='fs-15 fw-light'>{headerContent.description}</p>
              </div>
            )}

            {/* Forum Posts */}
            <div className="forum-posts-section">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                  </div>
                </div>
              ) : forumData.length === 0 ? (
                <div className="text-center py-4">
                  <p>No discussions found.</p>
                </div>
              ) : (
                forumData.map((post, index) => {
                  
                  return (
                    <div key={post.id} className="forum-post"
                      onClick={() => history.push(`/startup-forum/${post.id}`)}
                    >
                      <div className="post-avatar-container">
                        <img
                          src={post.author.avatar || 'https://via.placeholder.com/40'}
                          alt={post.author.name}
                          className="post-avatar"
                        />
                        {post.isNew && <div className="new-indicator"><img src={pin} alt="Pin Icon" /></div>}
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

                        <div className='d-flex gap-3 align-items-center'>
                          <div className='d-flex align-items-center gap-2 justify-content-center'>
                            <img src={message} alt="Message Icon" />
                            <p className='mb-0 pb-0 post-date-paragraph'>Posted: <span>{post.date}</span></p>
                          </div>
                          <div className='d-flex align-items-center gap-2 justify-content-center'>
                            <img src={reply} alt="Reply Icon" />
                            <p className='mb-0 pb-0 post-date-paragraph'>Latest reply from <span>@{post.author.name}</span></p>
                          </div>
                        </div>

                        <p className="post-description">{post.description}</p>
                      </div>

                      <div className='d-flex flex-column gap-2 justify-content-end'>
                        <div className="post-right-section">
                          {post.participants && post.participants.slice(0, 4).map((participant, idx) => (
                            <img
                              key={idx}
                              src={participant}
                              alt="participant"
                              className="participant-avatar"
                            />
                          ))}
                          {/* Only show edit button if current user is the author - with better checking */}
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
                  )
                })
              )}
            </div>

            {/* Add pagination if needed */}
            {totalPages > 1 && (
              <div className="forum-pagination d-flex justify-content-center mt-4">
                <button 
                  className="btn btn-outline-primary me-2"
                  disabled={currentPage === 1}
                  onClick={() => fetchForumData(currentPage - 1, selectedCategory, searchTerm)}
                >
                  Previous
                </button>
                <span className="align-self-center mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="btn btn-outline-primary ms-2"
                  disabled={currentPage === totalPages}
                  onClick={() => fetchForumData(currentPage + 1, selectedCategory, searchTerm)}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="forum-sidebar">
            <div className="sidebar-section">
              <div className="categories-list">
                <AcademyBtn
                  title={'Start New Discussion'}
                  onClick={handleNewDiscussion}
                />
                
                {categories.map((category, index) => (
                  <div key={category}>
                    <div
                      className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category === 'All Discussions' && <img src={message} alt="Speech Bubble Icon" />}
                      {category === 'Following' && <img src={star} alt="Star Icon" className='icon' />}
                      {category === 'Introductions' && <img src={wavingHand} alt="Waving Hand Icon" />}
                      {category === 'Announcements' && <img src={loudSpeaker} alt="Megaphone Icon" />}
                      {category === 'Celebrations' && <img src={partyPopper} alt="Party Popper Icon" />}
                      {category === 'Ideas & Feedback' && <img src={lightBulb} alt="Light Bulb Icon" />}
                      {category === 'Misc. Topics' && <img src={speechBalloon} alt="Speech Bubble Icon" />}
                      <span>{category}</span>
                    </div>
                    {category === 'Following' && <hr style={{ width: '100%', borderColor: 'gray', margin: '8px 0' }} />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Start New Discussion Modal */}
      <StartNewDiscussionModal 
        show={showDiscussionModal}
        onHide={toggleDiscussionModal}
        editingPost={editingPost}
        onSuccess={handleDiscussionSuccess}
      />
    </>
  )
}

export default StartupForumPage