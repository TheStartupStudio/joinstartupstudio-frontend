import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import './ForumPage.css'
import IntlMessages from '../../utils/IntlMessages'
import MenuIcon from '../../assets/images/academy-icons/svg/icons8-menu.svg'
import { useDispatch } from 'react-redux'
import { toggleCollapse } from '../../redux/sidebar/Actions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, triangle} from '@fortawesome/free-solid-svg-icons'

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

const CommentSection = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('Latest First')
  const [selectedCategory, setSelectedCategory] = useState('All Discussions')
  const [showAddCommentModal, setShowAddCommentModal] = useState(false)
  const [editingComment, setEditingComment] = useState(null) // Add state for editing comment

  const forumData = [
    {
      id: 1,
      category: 'Introductions',
      isNew: true,
      title: 'Started small but looking to grow big',
      description: 'Hey everyone! New member here. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus...',
      author: {
        name: 'cassiewallace',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      date: '12/23/2025',
      comments: 25,
      participants: [
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ',
        'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'

      ]
    }
  ]

  // Updated repliesData with nested structure
  const repliesData = [
    {
      id: 2,
      category: 'Announcements',
      isOwn: true,
      title: 'Started small but looking to grow big',
      description: 'Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas lacuis massa nisl malesuada lacinia int...',
      author: {
        name: 'Emma',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      nestingLevel: 1,
      replies: [
        {
          id: 4,
      title: 'Started small but looking to grow big',
          description: 'This is really helpful for our community discussions.',
          author: {
            name: 'Garry',
            avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
          },
          nestingLevel: 2,
          replies: [
            {
              id: 5,
      title: 'Started small but looking to grow big',
              description: 'Yes, this will make communication so much better.',
              author: {
                name: 'Emma',
                avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
              },
              nestingLevel: 3,
              isOwn: true
            }
          ]
        }
      ]
    },
    {
      id: 3,
      category: 'Celebrations',
      title: 'Started small but looking to grow big',
      description: 'Looking forward to more conversations like this.',
      author: {
        name: 'John',
        avatar: 'https://imgs.search.brave.com/dybKygqTKstercZqjtGWGYIT7XeGZqyueoBc2tC0KkM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEy/OTYzODYwOC9waG90/by9zbWlsaW5nLWJ1/c2luZXNzd29tYW4t/bG9va2luZy1hdC1j/YW1lcmEtd2ViY2Ft/LW1ha2UtY29uZmVy/ZW5jZS1idXNpbmVz/cy1jYWxsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1OSDRa/UXZkeTdFOEduZW4y/MWU1MHpnS2piWnpn/TnlnbnJWekNJMEUz/dTlvPQ'
      },
      nestingLevel: 1
    }
  ]

    const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    
    // Navigate to corresponding page
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

  // Function to calculate width based on nesting level
  const getCommentWidth = (nestingLevel) => {
    const baseWidth = 100
    const reductionPerLevel = 10
    return Math.max(baseWidth - (nestingLevel * reductionPerLevel), 60) // Minimum 60% width
  }

  const toggleAddCommentModal = () => {
    setShowAddCommentModal(prev => !prev)
    // Clear editing comment when closing modal
    if (showAddCommentModal) {
      setEditingComment(null)
    }
  }

  // Add function to handle edit comment
  const handleEditComment = (comment, event) => {
    event.stopPropagation() // Prevent any parent click handlers
    setEditingComment(comment)
    setShowAddCommentModal(true)
  }

  // Add function to handle new comment
  const handleNewComment = () => {
    setEditingComment(null)
    setShowAddCommentModal(true)
  }

  // Function to render comments recursively
  const renderComment = (comment, nestingLevel = 1) => {
    const width = getCommentWidth(nestingLevel)
    
    return (
      <div className='d-flex flex-column align-items-end w-100' key={comment.id}>
        <div 
          className="d-flex flex-column"
          style={{ 
            border: '1px solid #D9D9D9', 
            padding: '16px 25px 16px 30px', 
            borderRadius: '8px', 
            width: `${width}%`,
            marginLeft: nestingLevel > 1 ? '20px' : '0',
            marginBottom: '5px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
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
                <h4 style={{ color: 'gray', fontSize: '16px', margin: 0, lineHeight: 'unset' }}>{comment.title}</h4>
              </div>
              
              <p className="post-description">{comment.description}</p>
            </div>
          </div>

          <div className='d-flex align-items-center justify-content-end gap-2 mt-3'>
            {comment.isOwn ? (
              <div className='d-flex align-items-center gap-4 cursor-pointer'>
                <div className='d-flex align-items-center gap-2 cursor-pointer'>
                  <img src={warningTriangle} alt="Warning Icon" style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontWeight: '600', color: 'black' }}>Delete comment</span>
                </div>
                <div className='d-flex align-items-center gap-2 cursor-pointer' onClick={(e) => handleEditComment(comment, e)}>
                  <FontAwesomeIcon icon={faPencilAlt} style={{ color: 'black', width: '16px', height: '16px' }} />
                  <span style={{ fontWeight: '600', color: 'black' }}>Edit comment</span>
                </div>
              </div>
            ) : (
              <>
                <img src={reply} alt="Reply Icon" style={{ filter: 'brightness(0) saturate(100%)', width: '20px', height: '20px' }} />
                <span style={{ fontWeight: '600', color: 'black' }}>Reply to comment</span>
              </>
            )}
          </div>
        </div>

        {/* Render nested replies */}
        {comment.replies && comment.replies.map(reply => 
          renderComment(reply, nestingLevel + 1)
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

            {/* Forum Posts */}
            <div className="forum-posts-comment-section">
              {/* Original Post */}
              {forumData.map((post, index) => (
                <div style={{ border: '1px solid #D9D9D9', padding: '16px 25px 16px 30px', borderRadius: '8px', marginBottom: '20px', width: '100%' }} key={index}>
                  <div key={post.id} className="forum-post-main">
                    <div className="post-avatar-container">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="post-avatar"
                      />
                      {post.isNew && <div className="new-indicator"><img src={pin} alt="Pin Icon" /></div>}
                    </div>

                    <div className="post-content">


                      <h4 className="post-title">{post.title}</h4>

                      <p className="post-description">{post.description}</p>
                    </div>


                    <div className='d-flex flex-column gap-2 justify-content-end'>

                      <div className='post-comments-count'>
                        <img src={star} alt="Star Icon" style={{ filter: 'brightness(0) saturate(100%)', width: '16px', height: '16px' }} />
                        <span className="post-date-paragraph">Follow discussions</span>
                      </div>

                      <div className="post-right-section">
                        {post.participants.slice(0, 4).map((participant, idx) => (
                          <img
                            key={idx}
                            src={participant}
                            alt="participant"
                            className="participant-avatar"
                          />
                        ))}
                        {post.participants.length > 4 && (
                          <div className="participant-more"><img src={threeDots} alt="More Participants" /></div>
                        )}

                      </div>
                      <div className="post-comments-count">
                        <img src={chatBubble} alt="Comments Icon" className="comments-icon" />
                        <span className="post-date-paragraph">{post.comments} comments</span>
                      </div>

                    </div>


                  </div>

                  <div className='d-flex align-items-center justify-content-end gap-2 mt-3'>
                    <img src={reply} alt="Reply Icon" style={{ filter: 'brightness(0) saturate(100%)', width: '20px', height: '20px' }} />
                    <span style={{ fontWeight: '600', color: 'black' }}>Reply to post</span>
                  </div>
                </div>
              ))}

              {/* Nested Comments */}
              {repliesData.map(comment => renderComment(comment))}
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

      {/* Add Comment Modal */}
      <AddCommentModal 
        show={showAddCommentModal}
        onHide={toggleAddCommentModal}
        originalPost={forumData[0]} // Pass the original post data
        editingComment={editingComment} // Pass the editing comment
      />
    </>
  )
}

export default CommentSection