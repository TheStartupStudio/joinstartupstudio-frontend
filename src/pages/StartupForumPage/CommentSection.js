import React, { useRef, useEffect, useState } from 'react'
import { useLocation, useHistory, useParams } from 'react-router-dom'
import './ForumPage.css'
import IntlMessages from '../../utils/IntlMessages'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { useDispatch, useSelector } from 'react-redux'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, triangle} from '@fortawesome/free-solid-svg-icons'
import axiosInstance from '../../utils/AxiosInstance'
import { toast } from 'react-toastify'
import { Button } from 'react-bootstrap'

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
import warningTriangle from '../../assets/images/academy-icons/warning-triangle.png'
import AcademyBtn from '../../components/AcademyBtn'
import AddCommentModal from './AddCommentModal'
import StartNewDiscussionModal from './StartNewDiscussionModal'
import blankProfile from '../../assets/images/academy-icons/blankProfile.jpg'


const ForumPostSkeleton = () => {
  return (
    <div className="main-comment-card-container" style={{ width: '100%' }}>
      <div className="forum-post-main">
        <div className="post-avatar-container">
          <div 
            className="skeleton-avatar"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#e5e7eb',
              animation: 'skeleton-loading 1.5s infinite ease-in-out'
            }}
          />
        </div>

        <div className="post-content" style={{ flex: 1 }}>
          <div 
            className="skeleton-title"
            style={{
              height: '24px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              marginBottom: '12px',
              width: '70%',
              animation: 'skeleton-loading 1.5s infinite ease-in-out'
            }}
          />
          
          <div 
            className="skeleton-description"
            style={{
              height: '16px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              marginBottom: '8px',
              width: '100%',
              animation: 'skeleton-loading 1.5s infinite ease-in-out'
            }}
          />
          <div 
            className="skeleton-description"
            style={{
              height: '16px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              marginBottom: '8px',
              width: '85%',
              animation: 'skeleton-loading 1.5s infinite ease-in-out'
            }}
          />
        </div>

        <div className='d-flex flex-column gap-2 justify-content-end'>
          <div className='d-flex align-items-center justify-content-end gap-2'>
            <div 
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#e5e7eb',
                borderRadius: '2px',
                animation: 'skeleton-loading 1.5s infinite ease-in-out'
              }}
            />
            <div 
              style={{
                width: '120px',
                height: '14px',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                animation: 'skeleton-loading 1.5s infinite ease-in-out'
              }}
            />
          </div>

          <div className="post-right-section">
            {[1, 2, 3].map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#e5e7eb',
                  marginLeft: idx > 0 ? '-15px' : '0',
                  border: '3px solid white',
                  animation: 'skeleton-loading 1.5s infinite ease-in-out'
                }}
              />
            ))}
          </div>
          
          <div className='d-flex align-items-center justify-content-end gap-2'>
            <div 
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#e5e7eb',
                borderRadius: '2px',
                animation: 'skeleton-loading 1.5s infinite ease-in-out'
              }}
            />
            <div 
              style={{
                width: '80px',
                height: '14px',
                backgroundColor: '#e5e7eb',
                borderRadius: '4px',
                animation: 'skeleton-loading 1.5s infinite ease-in-out'
              }}
            />
          </div>
        </div>
      </div>

      <div className='d-flex align-items-center justify-content-end gap-2 mt-3'>
        <div 
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#e5e7eb',
            borderRadius: '2px',
            animation: 'skeleton-loading 1.5s infinite ease-in-out'
          }}
        />
        <div 
          style={{
            width: '100px',
            height: '16px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            animation: 'skeleton-loading 1.5s infinite ease-in-out'
          }}
        />
      </div>
    </div>
  )
}

const SkeletonStyles = () => (
  <style>
    {`
      @keyframes skeleton-loading {
        0% {
          background-color: #e5e7eb;
        }
        50% {
          background-color: #f3f4f6;
        }
        100% {
          background-color: #e5e7eb;
        }
      }
    `}
  </style>
)

const CommentSection = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const { id } = useParams()
  
  const currentUser = useSelector(state => state.user?.user?.user || state.user?.user)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Latest First')
  const [selectedCategory, setSelectedCategory] = useState('All Discussions')
  const [showAddCommentModal, setShowAddCommentModal] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  
  const [showDiscussionModal, setShowDiscussionModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  
  const [loading, setLoading] = useState(true)
  const [forumData, setForumData] = useState([])
  const [repliesData, setRepliesData] = useState([])
  const [repliesLoading, setRepliesLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [parentReplyId, setParentReplyId] = useState(null)
  const [parentComment, setParentComment] = useState(null) 
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    const fetchDiscussionData = async () => {
      if (!id) return

      setLoading(true)
      try {
        const response = await axiosInstance.get(`/forum/discussion/${id}`)
        if (response.data) {
          // The API now returns the exact format we need
          const formattedData = {
            id: response.data.id,
            category: response.data.category,
            isNew: response.data.isNew,
            title: response.data.title,
            description: response.data.description,
            content: response.data.content, // Full content for single discussion view
            author: {
              id: response.data.author?.id,
              name: response.data.author?.name,
              avatar: response.data.author?.avatar || blankProfile
            },
            date: response.data.date,
            comments: response.data.comments || 0,
            participants: response.data.participants || [],
            viewCount: response.data.viewCount,
            isPinned: response.data.isPinned,
            lastReplyAt: response.data.lastReplyAt,
            lastReplyUser: response.data.lastReplyUser
          }
          
          setForumData([formattedData])
          // Use ref to scroll to header after data is set
          setTimeout(() => {
            headerRef.current?.scrollIntoView({ behavior: 'instant' })
          }, 0)
        }
      } catch (error) {
        console.error('Error fetching discussion:', error)
        history.push('/startup-forum')
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussionData()
  }, [id, history])

  useEffect(() => {
    if (location.state?.discussionData) {
      setForumData([location.state.discussionData])
      setLoading(false)
    }
  }, [location.state])

  const fetchReplies = async (page = 1) => {
    if (!forumData.length || !forumData[0].id) return
    
    setRepliesLoading(true)
    try {
      const response = await axiosInstance.get(`/forum/discussion/${forumData[0].id}/replies`, {
        params: {
          page,
          limit: 10
        }
      })
      
      if (response.data) {
        setRepliesData(response.data.replies)
        setCurrentPage(response.data.currentPage)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Error fetching replies:', error)
    } finally {
      setRepliesLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && forumData.length > 0) {
      fetchReplies()
    }
  }, [loading, forumData])

  const checkFollowStatus = async (discussionId) => {
    try {
      const response = await axiosInstance.get(`/forum/discussion/${discussionId}/follow-status`)
      setIsFollowing(response.data.isFollowing)
    } catch (error) {
      console.error('Error checking follow status:', error)
    }
  }

  const handleFollowDiscussion = async () => {
    if (!forumData.length || followLoading) return
    
    setFollowLoading(true)
    try {
      const discussionId = forumData[0].id
      
      if (isFollowing) {
        // Unfollow
        await axiosInstance.delete(`/forum/discussion/${discussionId}/follow`)
        setIsFollowing(false)
        toast.success('Successfully unfollowed discussion')
      } else {
        // Follow
        await axiosInstance.post(`/forum/discussion/${discussionId}/follow`)
        setIsFollowing(true)
        toast.success('Successfully followed discussion')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Something went wrong'
      toast.error(errorMessage)
    } finally {
      setFollowLoading(false)
    }
  }

  useEffect(() => {
    if (forumData.length > 0) {
      checkFollowStatus(forumData[0].id)
    }
  }, [forumData])

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

  const getCommentWidth = (nestingLevel) => {
    const baseWidth = 100
    const reductionPerLevel = 5
    return Math.max(baseWidth - (nestingLevel * reductionPerLevel), 30)
  }

  const toggleAddCommentModal = () => {
    if (showAddCommentModal) {
      setEditingComment(null)
      setParentReplyId(null)
      setParentComment(null)
      setShowAddCommentModal(false)
    } else {
      setShowAddCommentModal(true)
    }
  }

  const handleNewComment = () => {
    setEditingComment(null)
    setParentReplyId(null)
    setParentComment(null)
    setShowAddCommentModal(true)
  }

  const handleEditComment = (comment, event) => {
    event.stopPropagation()
    setEditingComment(comment)
    setParentReplyId(null)
    setParentComment(null)
    setShowAddCommentModal(true)
  }

  const handleDeleteComment = (comment, event) => {
    event.stopPropagation()
    setCommentToDelete(comment)
    setShowDeleteConfirm(true)
  }

  const handleReplyToComment = (comment, event) => {
    event.stopPropagation()
    setParentReplyId(comment.id)
    setParentComment(comment)
    setEditingComment(null)
    setShowAddCommentModal(true)
  }

  const handleConfirmDelete = async () => {
  if (!commentToDelete) return
  
  setDeleteLoading(true)
  try {
    await axiosInstance.delete(`/forum/replies/${commentToDelete.id}`)
    toast.success('Comment deleted successfully!')
    
    // Refresh replies and update comment count
    fetchReplies(currentPage)
    if (forumData.length > 0) {
      const updatedForumData = [...forumData]
      updatedForumData[0].comments = Math.max((updatedForumData[0].comments || 0) - 1, 0)
      setForumData(updatedForumData)
    }
    
    // Close modal
    setShowDeleteConfirm(false)
    setCommentToDelete(null)
    
  } catch (error) {
    console.error('Error deleting comment:', error)
    const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Something went wrong. Please try again.'
    toast.error(errorMessage)
  } finally {
    setDeleteLoading(false)
  }
}

  const handleReplySuccess = (reply, action = 'create') => {
    if (action === 'delete') {
      fetchReplies(currentPage)
      if (forumData.length > 0) {
        const updatedForumData = [...forumData]
        updatedForumData[0].comments = Math.max((updatedForumData[0].comments || 0) - 1, 0)
        setForumData(updatedForumData)
      }
    } else if (action === 'create') {
      fetchReplies(currentPage)
      if (forumData.length > 0) {
        const updatedForumData = [...forumData]
        updatedForumData[0].comments = (updatedForumData[0].comments || 0) + 1
        setForumData(updatedForumData)
      }
    } else if (action === 'update') {
      fetchReplies(currentPage)
    }
    
    setShowAddCommentModal(false)
    setEditingComment(null)
    setParentReplyId(null)
    setParentComment(null)
  }

  const renderComment = (comment) => {
    const width = getCommentWidth(comment.nestingLevel)
    
    return (
      <div className='d-flex flex-column align-items-end w-100' key={comment.id}>
        <div 
          className="d-flex flex-column main-comment-card-container"
          style={{ 
            width: `${width}%`
          }}
        >
          <div className="forum-post-main">
            <div className="post-avatar-container">
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="post-avatar"
              />
              {comment.isOwn && (
                <div className="new-indicator">
                  <img 
                    src={star} 
                    alt="Star Icon" 
                    style={{
                      filter: 'invert(1) brightness(1000%)', 
                      width: '16px', 
                      height: '16px'
                    }} 
                  />
                </div>
              )}
            </div>

            <div className="post-content">
              <div className='d-flex align-items-center gap-1'>
                <img src={reply} alt="Reply Icon" style={{ filter: 'brightness(100%) saturate(0%)', width: '16px', height: '16px' }} />
                <h4 style={{ color: 'gray', fontSize: '16px', margin: 0, lineHeight: 'unset' }}>
                  Reply by {comment.author.name}
                  {comment.isEdited && <span style={{ fontSize: '12px', color: '#999', marginLeft: '8px' }}>(edited)</span>}
                </h4>
              </div>
              
              {/* Use dangerouslySetInnerHTML for comment content as well */}
              <div 
                className="post-description comment-description"
                  style={{
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  whiteSpace: 'normal',
                  hyphens: 'auto',
                  maxWidth: '100%'
                }}
                dangerouslySetInnerHTML={{ 
                  __html: comment.content 
                }}
              />
            </div>
          </div>

          <div className='d-flex align-items-center justify-content-end gap-2 mt-3'>
            {comment.isOwn ? (
              <div className='d-flex align-items-center gap-4 cursor-pointer delete-edit-btn-container'>
                <div 
                  className='d-flex align-items-center gap-2 cursor-pointer'
                  onClick={(e) => handleDeleteComment(comment, e)}
                >
                  <img src={warningTriangle} alt="Warning Icon" style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontWeight: '600', color: 'black' }}>Delete comment</span>
                </div>
                <div className='d-flex align-items-center gap-2 cursor-pointer' onClick={(e) => handleEditComment(comment, e)}>
                  <FontAwesomeIcon icon={faPencilAlt} style={{ color: 'black', width: '16px', height: '16px' }} />
                  <span style={{ fontWeight: '600', color: 'black' }}>Edit comment</span>
                </div>
              </div>
            ) : (
              comment.nestingLevel < 5 && (
                <div className='d-flex align-items-center gap-2 cursor-pointer' onClick={(e) => handleReplyToComment(comment, e)}>
                  <img src={reply} alt="Reply Icon" style={{ filter: 'brightness(0) saturate(100%)', width: '20px', height: '20px' }} />
                  <span style={{ fontWeight: '600', color: 'black' }}>Reply to comment</span>
                </div>
              )
            )}
          </div>
        </div>

        {comment.replies && comment.replies.length > 0 && comment.replies.map(nestedReply => 
          renderComment(nestedReply)
        )}
      </div>
    )
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

  const handleEditPost = (post, event) => {
    event.stopPropagation()
    setEditingPost(post)
    setShowDiscussionModal(true)
  }

  const toggleDiscussionModal = () => {
    setShowDiscussionModal(prev => !prev)
    if (showDiscussionModal) {
      setEditingPost(null)
    }
  }

  const handleDiscussionSuccess = (discussion, action = 'update') => {
    if (action === 'delete') {
      history.push('/startup-forum')
    } else if (action === 'update') {
      // Update with the new API format while preserving existing data
      setForumData(prevData => 
        prevData.map(post => 
          post.id === discussion.id 
            ? { 
                ...post, 
                title: discussion.title || post.title,
                description: discussion.description || post.description,
                content: discussion.content || post.content,
                category: discussion.category || post.category,
                // Preserve other fields from the original API response
                author: post.author, // Keep original author data
                date: post.date, // Keep original date
                comments: post.comments, // Keep original comment count
                participants: post.participants, // Keep original participants
                viewCount: post.viewCount,
                isPinned: post.isPinned,
                lastReplyAt: post.lastReplyAt,
                lastReplyUser: post.lastReplyUser
              } 
            : post
        )
      )
    }
    
    setEditingPost(null)
    setShowDiscussionModal(false)
  }

  return (
    <>
      <SkeletonStyles />
      <div ref={headerRef} className='d-flex space-between align-items-center'>
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

            {/* Forum Posts */}
            <div className="forum-posts-comment-section">
              {/* Show skeleton while loading */}
              {loading ? (
                <ForumPostSkeleton />
              ) : !forumData.length ? (
                <div className="text-center py-4">
                  <p>Discussion not found.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => history.push('/startup-forum')}
                  >
                    Back to Forum
                  </button>
                </div>
              ) : (
                /* Original Post - Now using dynamic data */
                forumData.map((post, index) => (
                  <div className="main-comment-card-container" style={{ width: '100%' }} key={index}>
                    <div key={post.id} className="forum-post-main">
                      <div className="post-avatar-container">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="post-avatar"
                        />
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
                        <h4 className="post-title">{post.title}</h4>
                        {/* Use dangerouslySetInnerHTML to render HTML content properly */}
                        <div 
                          className="post-description comment-description"
                          style={{
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere',
                          whiteSpace: 'normal',
                          hyphens: 'auto',
                          maxWidth: '100%'
                          }}
                          dangerouslySetInnerHTML={{ 
                            __html: post.content || post.description 
                          }}
                        />
                      </div>

                      <div className='d-flex flex-column gap-2'>
                        <div 
                          className='post-comments-count cursor-pointer'
                          onClick={handleFollowDiscussion}
                          style={{ 
                            opacity: followLoading ? 0.6 : 1,
                            pointerEvents: followLoading ? 'none' : 'auto'
                          }}
                        >
                          <img 
                            src={star} 
                            alt="Star Icon" 
                            style={{ 
                              filter: isFollowing 
                                ? 'brightness(0) saturate(100%) invert(47%) sepia(68%) saturate(478%) hue-rotate(166deg) brightness(94%) contrast(89%)' // Blue filter
                                : 'brightness(0) saturate(100%)', // Default black
                              width: '16px', 
                              height: '16px' 
                            }} 
                          />
                          <span 
                            className="post-date-paragraph"
                            style={{ 
                              color: isFollowing ? '#52C7DE' : 'inherit' // Blue color when following
                            }}
                          >
                            {followLoading 
                              ? (isFollowing ? 'Unfollowing...' : 'Following...')
                              : (isFollowing ? 'Following discussion' : 'Follow discussion')
                            }
                          </span>
                        </div>

                        <div className="post-right-section">
                          {post.participants && post.participants.slice(0, 4).map((participant, idx) => (
                            <img
                              key={idx}
                              src={participant}
                              alt="participant"
                              className="participant-avatar"
                            />
                          ))}
                          {/* Show edit option if user is the post author */}
                          {currentUser && 
                           post.author && 
                           currentUser.id && 
                           post.author.id && 
                           parseInt(currentUser.id) === parseInt(post.author.id) ? (
                            <div className="participant-more" onClick={(e) => handleEditPost(post, e)}>
                              <img src={threeDots} alt="Edit Post" />
                            </div>
                          ) : (
                            post.participants && post.participants.length > 4 && (
                              <div className="participant-more">
                                <img src={threeDots} alt="More Participants" />
                              </div>
                            )
                          )}
                        </div>
                        
                        <div className="post-comments-count">
                          <img src={chatBubble} alt="Comments Icon" className="comments-icon" />
                          <span className="post-date-paragraph">{post.comments} comments</span>
                        </div>
                        
                        
                        {/* {post.isPinned && (
                          <div className="post-comments-count">
                            <img src={pin} alt="Pinned Icon" style={{ width: '16px', height: '16px' }} />
                            <span className="post-date-paragraph">Pinned</span>
                          </div>
                        )} */}
                      </div>
                    </div>

                    <div className='d-flex align-items-center justify-content-end gap-2 mt-3 cursor-pointer' onClick={handleNewComment}>
                      <img src={reply} alt="Reply Icon" style={{ filter: 'brightness(0) saturate(100%)', width: '20px', height: '20px' }} />
                      <span style={{ fontWeight: '600', color: 'black' }}>Reply to post</span>
                    </div>
                  </div>
                ))
              )}

              {/* Only show comments if not loading and we have forum data */}
              {!loading && forumData.length > 0 && (
                <div className="replies-section" style={{width: '100%'}}>
                  {repliesLoading ? (
                        <span className="sr-only">Loading replies...</span>
                  ) : (
                    /* Nested Comments */
                    repliesData.map(comment => renderComment(comment))
                  )}
                  
                  {/* Pagination for replies */}
                  {totalPages > 1 && (
                    <div className="forum-pagination d-flex justify-content-center mt-4">
                      <button 
                        className="btn btn-outline-primary me-2"
                        disabled={currentPage === 1}
                        onClick={() => fetchReplies(currentPage - 1)}
                      >
                        Previous
                      </button>
                      <span className="align-self-center mx-2">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button 
                        className="btn btn-outline-primary ms-2"
                        disabled={currentPage === totalPages}
                        onClick={() => fetchReplies(currentPage + 1)}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="forum-sidebar">
            <div className="sidebar-section">
              <div className="categories-list">
                <AcademyBtn
                  title={'ADD REPLY'}
                  onClick={handleNewComment}
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


      <AddCommentModal 
        show={showAddCommentModal}
        onHide={toggleAddCommentModal}
        originalPost={forumData[0]}
        editingComment={editingComment}
        onSuccess={handleReplySuccess}
        parentReplyId={parentReplyId}
        parentComment={parentComment}
      />

      <StartNewDiscussionModal 
        show={showDiscussionModal}
        onHide={toggleDiscussionModal}
        editingPost={editingPost}
        onSuccess={handleDiscussionSuccess}
      />

      {showDeleteConfirm && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => {
            setShowDeleteConfirm(false)
            setCommentToDelete(null)
          }}
        >
          <div 
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '24px',
              textAlign: 'center',
              width: '100%',
              maxWidth: '748px',
              margin: '0px 15px',
            }}
            className="delete-new-discussion-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-100 text-start">
              <div style={{padding: '5px', borderRadius: '50%', backgroundColor: '#E2E6EC', width: '36px', height:'36px', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img src={warningTriangle} alt="Warning Icon" style={{ width: '16px', height: '16px' }} />
              </div>
              <h5 style={{ margin: '16px 0px', fontSize:'15px' }}>Delete Comment?</h5>
            </div>
            <p style={{ margin: '30px 0px 55px 0px' }}>
              Are you sure you want to delete this comment?
            </p>
            <div className="d-flex gap-5 justify-content-center align-items-center modal-btn-container">
              <Button  
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setCommentToDelete(null)
                }}
                disabled={deleteLoading}
                style={{ 
                                  width: '100%',
                                  backgroundColor: '#DEE1E6', 
                                  boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)', 
                                  padding: '12px 12px',
                                  maxWidth: '250px',
                                  borderRadius: '8px',
                                  fontSize:'17px',
                                  fontWeight: '600',
                                  color:'black',
                                  border:'none'
                                }}
                              >
                                NO, TAKE ME BACK
                              </Button>
              <Button  
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                style={{ 
                                  width: '100%',
                                  backgroundColor: '#FF3399', 
                                  boxShadow: '0 4px 10px 0 rgba(0, 0, 0, 0.25)', 
                                  padding: '12px',
                                  maxWidth: '250px',
                                  borderRadius: '8px',
                                  fontSize:'17px',
                                  fontWeight: '600',
                                  border: 'none'
                                }}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CommentSection