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
import ReportPostModal from './ReportPostModal'
import blankProfile from '../../assets/images/academy-icons/blankProfile.jpg'
import CategoryList from './CategoryList'
import CategoryManagementModal from './CategoryManagementModal'


const StartupForumPage = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()

  const currentUser = useSelector(state => state.user?.user?.user || state.user?.user)

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Latest')
  const [selectedCategory, setSelectedCategory] = useState('All Discussions')
  const [showDiscussionModal, setShowDiscussionModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const [forumData, setForumData] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportingPost, setReportingPost] = useState(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [dbCategories, setDbCategories] = useState([])
  const [allCategories, setAllCategories] = useState([])

  const toggleDiscussionModal = () => {
    setShowDiscussionModal(prev => !prev)
    if (showDiscussionModal) {
      setEditingPost(null)
    }
  }

  const closeDiscussionModal = () => {
    setShowDiscussionModal(false)
    setEditingPost(null)
  }

  const handleEditPost = (post, event) => {
    event.stopPropagation()
    setEditingPost(post)
    setShowDiscussionModal(true)
  }

  const fetchForumData = async (page = 1, category = null, search = null, filter = 'Latest') => {
    if (isFetching) return
    
    setIsFetching(true)
    setLoading(true)
    
    try {
      const filterMapping = {
  'Latest': 'Latest',
  'Oldest': 'Oldest', 
  'Most Comments': 'Most Comments',
  'My posts': 'My posts',
  'Alphabetical': 'Alphabetical'
}

      const mappedFilter = filterMapping[filter] || 'Latest'

const params = {
  page,
  limit: 10,
  filter: mappedFilter
}


      if (search && search.trim()) {
        params.search = search.trim()
      }

      let endpoint = '/forum'


      if (category && category !== 'All Discussions') {
        // Try to find the category in dbCategories first
        const dbCategory = dbCategories.find(cat => cat.name === category)
        
        if (dbCategory && dbCategory.slug) {
          // Use slug from database
          endpoint = `/forum/${dbCategory.slug}`
        } else {
          // Fallback to hardcoded mapping for static categories
          const categoryMapping = {
            'Introductions': 'introductions',
            'Announcements': 'announcements',
            'Celebrations': 'celebrations',
            'Following': 'following',
            'Ask for Feedback': 'ask-for-feedback',
            'Ask for Collaboration': 'ask-for-collaboration',
            'Ask for Mentorship': 'ask-for-mentorship',
            'Reported Posts': 'reported-posts',
          }

          const urlCategory = categoryMapping[category]
          if (urlCategory) {
            endpoint = `/forum/${urlCategory}`
          } else {
            // If not in mapping, create slug from category name
            const slug = category.toLowerCase().replace(/\s+/g, '-')
            endpoint = `/forum/${slug}`
          }
        }
      }

      console.log('API Endpoint:', endpoint, 'Category:', category)

      const response = await axiosInstance.get(endpoint, { params })

      if (response.data) {
        setForumData(response.data.discussions)
        setTotalCount(response.data.totalCount)
        setCurrentPage(response.data.currentPage)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching forum data:', error)
      if (category === 'Following') {
        setForumData([])
        setTotalCount(0)
        setCurrentPage(1)
        setTotalPages(1)
      }
    } finally {
      setLoading(false)
      setIsFetching(false)
    }
  }

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
  
useEffect(() => {
  if (!selectedCategory) return

  const delayedFetch = setTimeout(() => {
    const pageToFetch = searchTerm || selectedFilter !== 'Latest' ? 1 : currentPage
    if (pageToFetch !== currentPage && (searchTerm || selectedFilter !== 'Latest')) {
      setCurrentPage(1)
    }
    
    fetchForumData(pageToFetch, selectedCategory, searchTerm, selectedFilter)
  }, searchTerm ? 700 : 0)

  return () => clearTimeout(delayedFetch)
}, [selectedCategory, searchTerm, selectedFilter, currentPage]) 

  const handleDiscussionSuccess = (discussion, action = 'create') => {
    if (action === 'delete') {
      setForumData(prevData => prevData.filter(post => post.id !== editingPost?.id))
    } else if (action === 'create') {
      fetchForumData(currentPage, selectedCategory, searchTerm, selectedFilter)
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

  const handleViewReportedPosts = () => {
    setSelectedCategory('Reported Posts')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleReportPost = (post, event) => {
    event.stopPropagation()
    setReportingPost(post)
    setShowReportModal(true)
  }

  const handleReportSuccess = () => {
    setReportingPost(null)
    setShowReportModal(false)
  }

  const handleEditCategories = () => {
    setShowCategoryModal(true)
  }

  const handleCategoryManagementSuccess = () => {
    // Refresh categories and forum data
    fetchCategories()
    fetchForumData(currentPage, selectedCategory, searchTerm, selectedFilter)
  }

  const handleCategoryClick = (category) => {
    if (category === selectedCategory) return
    
    setSelectedCategory(category)
    setSearchTerm('') 
    setCurrentPage(1)
  }

  const getHeaderContent = () => {
    // Skip header for All Discussions and Following
    if (selectedCategory === 'All Discussions' || selectedCategory === 'Following') {
      return null
    }

    const category = selectedCategory.toLowerCase()

    // Predefined categories with descriptions
    if (category === 'introductions') {
      return {
        icon: wavingHand,
        title: 'INTRODUCTIONS',
        description: 'Welcome to our newest members. Please share a little about yourself, what brought you to the Academy in Entrepreneurship, and what your goal or vision is.'
      }
    } else if (category === 'announcements') {
      return {
        icon: loudSpeaker,
        title: 'ANNOUNCEMENTS',
        description: 'Find announcements, news, and updates about the platform and Learn to Start.'
      }
    } else if (category === 'celebrations') {
      return {
        icon: partyPopper,
        title: 'CELEBRATIONS',
        description: 'Celebrate your achievements and the achievements of your peers.'
      }
    } else if (category === 'ask for feedback') {
      return {
        icon: lightBulb,
        title: 'ASK FOR FEEDBACK',
        description: 'Share your ideas and get feedback from your peers.'
      }
    } else if (category === 'ask for collaboration') {
      return {
        icon: partyPopper,
        title: 'ASK FOR COLLABORATION',
        description: 'Find a peer to collaborate with.'
      }
    } else if (category === 'ask for mentorship') {
      return {
        icon: speechBalloon,
        title: 'ASK FOR MENTORSHIP',
        description: 'Ask for and discover mentorship opportunities'
      }
    }
    
    // For any other category, show just the icon and title (no description)
    return {
      icon: getCategoryIcon(selectedCategory),
      title: selectedCategory.toUpperCase(),
      description: null
    }
  }

  const headerContent = getHeaderContent()

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

  // Static categories that cannot be removed
  const staticCategories = [
    'All Discussions',
    'Following',
    'Introductions',
    'Announcements',
    'Celebrations',
    'Ask for Feedback',
    'Ask for Collaboration',
    'Ask for Mentorship',
  ]

  // Fetch database categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/forum/categories')
      const dbCats = response.data || []
      console.log('Fetched DB Categories:', dbCats)
      setDbCategories(dbCats)
      
      // Sort all categories by their order field from the database
      const sortedCategories = dbCats
        .filter(cat => cat.is_active)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(cat => cat.name)
      
      console.log('All Categories (sorted by order):', sortedCategories)
      setAllCategories(sortedCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      // If fetch fails, just use static categories
      setAllCategories(staticCategories)
    }
  }

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

const filterOptions = [
  { value: 'My posts', label: 'My posts' },
  { value: 'Alphabetical', label: 'Alphabetical' },
  { value: 'Latest', label: 'Latest' },
  { value: 'Oldest', label: 'Oldest' },
]

  const handleFilterChange = (newFilter) => {
    setSelectedFilter(newFilter)
  }
  
  // Add this useEffect to handle clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (!event.target.closest('.custom-filter-dropdown-container')) {
      setIsFilterDropdownOpen(false)
    }
  }

  if (isFilterDropdownOpen) {
    document.addEventListener('mousedown', handleClickOutside)
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}, [isFilterDropdownOpen])

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
                    placeholder={
                      selectedCategory === 'Following'
                        ? "Search followed discussions"
                        : "Search discussions"
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="search-input"
                  />
                </div>
                {/* Custom Filter Dropdown */}
<div className="custom-filter-dropdown-container" style={{ position: 'relative' }}>
  <div 
    className="filter-dropdown-trigger"
    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 15px',
      borderRadius: '8px',
      backgroundColor: 'white',
      cursor: 'pointer',
      minWidth: '150px',
      fontSize: '15px',
      height: '100%',
    lineHeight: '20px',
    // height: 100% !important;
    // max-height: 250px !important;
    boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)',
    }}
  >
    <span>{filterOptions.find(opt => opt.value === selectedFilter)?.label || 'Select Filter'}</span>
    <svg 
      width="12" 
      height="12" 
      viewBox="0 0 24 24" 
      fill="none" 
      style={{ 
        transform: isFilterDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease'
      }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>

  {isFilterDropdownOpen && (
    <div 
      className="filter-dropdown-menu"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        marginTop: '4px'
      }}
    >
      {filterOptions.map((option, index) => (
  <div
    key={option.value}
    className="filter-dropdown-item"
    onClick={() => {
      handleFilterChange(option.value)
      setIsFilterDropdownOpen(false)
    }}
    style={{
      padding: '6px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      backgroundColor: 'white',
      fontWeight: selectedFilter === option.value ? '600' : '400',
      color: selectedFilter === option.value ? '#52C7DE' : 'black',
      borderRadius: index === 0 ? '8px 8px 0 0' : index === filterOptions.length - 1 ? '0 0 8px 8px' : '0',
      transition: 'background-color 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}
    onMouseEnter={(e) => {
      if (selectedFilter !== option.value) {
        e.target.style.backgroundColor = '#f8f9fa'
      }
    }}
    onMouseLeave={(e) => {
      if (selectedFilter !== option.value) {
        e.target.style.backgroundColor = 'white'
      }
    }}
  >
    {option.label}
    {option.value === 'Latest' && (
  <span style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
    {/* Up arrow SVG */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M10.208 15.4167V5M10.208 5L15.208 10M10.208 5L5.20801 10"
        stroke={selectedFilter === 'Latest' ? '#52C7DE' : 'black'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
)}
{option.value === 'Oldest' && (
  <span style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
    {/* Down arrow SVG */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M10.208 4.58333V15M10.208 15L5.20801 10M10.208 15L15.208 10"
        stroke={selectedFilter === 'Oldest' ? '#52C7DE' : 'black'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
)}
  </div>
))}
    </div>
  )}
</div>
              </div>
            </div>

            {/* Conditionally render header content only if it exists */}
            {headerContent && (
              <div className='d-flex flex-column gap-2 mb-2'>
                <div className='d-flex gap-2 align-items-center'>
                  <img src={headerContent.icon} alt={`${headerContent.title} Icon`} style={{ width: '24px', height: '24px' }} />
                  <span className='fs-21 fw-bold'>{headerContent.title}</span>
                </div>
                {headerContent.description && (
                  <p className='fs-15 fw-light'>{headerContent.description}</p>
                )}
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
                      onClick={() => {
                        history.push(`/startup-forum/post/${post.id}`)
                      }}
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
                              <img src={star} alt="Your Post" style={{ width: '16px', height: '16px', filter: 'invert(1) brightness(1000%)' }} />
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
                            <p className='mb-0 pb-0 post-date-paragraph'>Posted: <span>{post.date}</span></p>
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
                          {post.participants && post.participants.slice(0, 4).map((participant, idx) => (
                            <img
                              key={idx}
                              src={participant || blankProfile}
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
                  onClick={() => {
                    const newPage = currentPage - 1
                    setCurrentPage(newPage)
                    fetchForumData(newPage, selectedCategory, searchTerm, selectedFilter)
                  }}
                >
                  Previous
                </button>
                <span className="align-self-center mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-primary ms-2"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    const newPage = currentPage + 1
                    setCurrentPage(newPage)
                    fetchForumData(newPage, selectedCategory, searchTerm, selectedFilter)
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="forum-sidebar">
            <div className="sidebar-section">
              {currentUser?.role_id === 3 && (
                <div className='mb-3'>
                  <AcademyBtn
                    title={'View Reported Posts'}
                    onClick={handleViewReportedPosts}
                  />
                </div>
              )}
              <AcademyBtn
                title={'Start New Discussion'}
                onClick={handleNewDiscussion}
              />

              <CategoryList
                categories={allCategories}
                staticCategories={staticCategories}
                dbCategories={dbCategories}
                selectedCategory={selectedCategory}
                onCategoryClick={handleCategoryClick}
                isAdmin={currentUser?.role_id === 3}
                onEditCategories={handleEditCategories}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Start New Discussion Modal */}
      <StartNewDiscussionModal
        show={showDiscussionModal}
        onHide={closeDiscussionModal}
        editingPost={editingPost}
        onSuccess={handleDiscussionSuccess}
        dbCategories={dbCategories}
      />

      {/* Report Post Modal */}
      <ReportPostModal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        post={reportingPost}
        onSuccess={handleReportSuccess}
      />

      {/* Category Management Modal */}
      <CategoryManagementModal
        show={showCategoryModal}
        onHide={() => setShowCategoryModal(false)}
        onSuccess={handleCategoryManagementSuccess}
      />
    </>
  )
}

export default StartupForumPage