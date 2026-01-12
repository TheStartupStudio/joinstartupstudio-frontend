import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify' // Add this import
import { useSelector } from 'react-redux'
import facebookLogo from '../../assets/images/academy-icons/facebook.png'
import linkedinLogo from '../../assets/images/academy-icons/linkedin.png'
import instagramLogo from '../../assets/images/academy-icons/svg/instagram-svgrepo-com.png'
import userIcon from '../../assets/images/academy-icons/profile-icon.png'
import twitterLogo from '../../assets/images/academy-icons/twitter.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import internet from '../../assets/images/academy-icons/svg/internet.svg'
import EditUserModal from '../UserDetails/EditUserModal'
import SubscriptionModal from '../UserDetails/SubscriptionModal'
import CancelSubModal from '../UserDetails/CancelSubModal'
import CancelRenewalModal from '../UserDetails/CancelRenewalModal'
import ShareLink from '../../assets/images/academy-icons/svg/share-link.svg'
import SharePortfolioModal from './SharePortfolioModal'
import Tooltip from './Tooltip'
import blankProfile from '../../assets/images/academy-icons/blankProfile.jpg'
import axiosInstance from '../../utils/AxiosInstance'
import website from '../../assets/images/academy-icons/svg/site-svgrepo-com.svg'

function AboutMe({ user = {}, portfolioData = {} }) { // Add default empty objects
  const [isExpanded, setIsExpanded] = useState(false)
  const [modal, setModal] = useState(false)
  const [subsbsciptionModal, setSubscriptionModal] = useState(false)
  const [cancelSubModal, setCancelSubModal] = useState(false)
  const [canceledRenewal, setCanceledRenewal] = useState(false)
  const [content, setContent] = useState('')
  const [isPublishedVisible, setIsPublishedVisible] = useState(false)
  const [sharePortfolio, setSharePortfolio] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  // Add new state to track if viewing own portfolio
  const [isOwnPortfolio, setIsOwnPortfolio] = useState(false)
  const currentUser = useSelector((state) => state.user?.user?.user) || {}

  const toggle = () => setModal((prev) => !prev)

  const subToggle = () => {
    setModal((prev) => !prev)
    setSubscriptionModal((prev) => !prev)
  }

  const toggleCancelModal = () => {
    setCancelSubModal((prev) => !prev)
    setSubscriptionModal((prev) => !prev)
  }

  const toggleCancelRenewal = () => {
    setCancelSubModal((prev) => !prev)
    setCanceledRenewal((prev) => !prev)
  }

  const formatURL = (url) => {
    if (!url) return '#'
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`
  }

  // Get initial publish state and update when portfolioData changes
  useEffect(() => {
    if (portfolioData?.is_published !== undefined) {
      setIsPublishedVisible(portfolioData.is_published)
    } else if (isOwnPortfolio) {
      // Only fetch if viewing own portfolio and no data provided
      const getPublishState = async () => {
        try {
          const response = await axiosInstance.get('/portfolio')
          setIsPublishedVisible(response.data.is_published)
        } catch (error) {
          console.error('Error fetching portfolio status:', error)
        }
      }
      getPublishState()
    }
  }, [portfolioData, isOwnPortfolio])

  // Check if viewing own portfolio
  useEffect(() => {
    setIsOwnPortfolio(currentUser?.username === user?.username)
  }, [currentUser?.username, user?.username])

  const handlePublishPortfolio = async () => {
    setIsPublishing(true)
    try {
      await axiosInstance.put('/portfolio', {
        is_published: !isPublishedVisible
      })
      
      setIsPublishedVisible(prev => !prev)
      toast.success(isPublishedVisible ? 
        'Portfolio unpublished successfully' : 
        'Portfolio published successfully!')
      
      // If publishing, show share modal
      if (!isPublishedVisible) {
        setSharePortfolio(true)
      }
    } catch (error) {
      toast.error('Error updating portfolio status')
      console.error('Error:', error)
    } finally {
      setIsPublishing(false)
    }
  }

  // Update click handler for publish/unpublish
  const handleVisibilityClick = () => {
    handlePublishPortfolio()
  }

  // Update click handler for share
  const handleShareClick = () => {
    const portfolioUrl = portfolioData?.url || `${window.location.origin}/public-portfolio/${encodeURIComponent(user.username)}`
    setContent(portfolioUrl)
    setSharePortfolio(true)
  }

  return (
    <>
      <div className='d-grid academy-dashboard-card pb-5 relative'>
        <div className='d-flex justify-content-between align-items-center align-self-baseline pt-4 mb-5 flex-col-mob gap-3 align-start-mob'>
          <div className='d-flex gap-3 align-items-center'>
            <img src={userIcon} alt='user' />
            <h4 className='fs-14 my-details-header text-black'>About Me</h4>
          </div>
          {isOwnPortfolio && ( // Only show controls if own portfolio
            <div>
              <div
                className='d-flex gap-4 align-items-center'
                style={{ marginRight: '5rem' }}
              >
                {isPublishedVisible ? (
                  <>
                    <div className='d-flex gap-2 align-items-center cursor-pointer' title='Click to unpublish' onClick={handleVisibilityClick}>
                      <img
                        src={internet}
                        alt='internet'
                        className='internet-class'
                      />
                      {/* <Tooltip text={'Click to unpublish'}> */}
                        <p
                          className='mb-0 fs-15 fw-medium portfolio-u text-black'
                          
                        >
                          {isPublishing ? 'Updating...' : 'Portfolio published'}
                        </p>
                      {/* </Tooltip> */}
                    </div>
                    <div className='d-flex gap-2 align-items-center cursor-pointer' title='Click to get link' onClick={handleShareClick}>
                      <img src={ShareLink} alt='sharelink' />
                      {/* <Tooltip text={'Click to get link'}> */}
                        <p
                          className='mb-0 fs-15 fw-medium portfolio-u  text-black'
                        >
                          Share link to portfolio
                        </p>
                      {/* </Tooltip> */}
                    </div>
                  </>
                ) : (
                  <div
                    className='d-flex gap-2 align-items-center cursor-pointer'
                    onClick={handleVisibilityClick}
                    title='Click to publish'
                  >
                    <img src={internet} alt='internet' />
                    {/* <Tooltip text={'Click to publish'}> */}
                      <p className='mb-0 fs-15 fw-medium portfolio-u'>
                        {isPublishing ? 'Publishing...' : 'Portfolio unpublished'}
                      </p>
                    {/* </Tooltip> */}
                  </div>
                )}
              </div>
              <span className='cursor-pointer' style={{ zIndex: '1' }}>
                <img
                  className='left-arrow-modal cursor-pointer'
                  src={penIcon}
                  alt='pen-icon'
                  style={{ width: '24px' }}
                  onClick={toggle}
                />
              </span>
            </div>
          )}
        </div>
        <div className='d-flex gap-4 flex-col-mob'>
          <img
            className='profile-dashboard-academy align-self-start'
            src={user.profile_image ? user.profile_image : blankProfile}
            alt='profile'
          />
          <div className='academy-profile-info'>
            <h3 className='mb-2'>{user?.name}</h3>
            <p className='text-black fs-15 fw-medium lh-sm mb-3'>
              {user?.profession}
            </p>
            <div className='d-flex gap-2' style={{height:'16px'}}>
                          {user.social_links.linkedIn && (
                            <img
                              className='cursor-pointer'
                              src={linkedinLogo}
                              alt='linkedin'
                              onClick={() =>
                                window.open(formatURL(user.social_links.linkedIn), '_blank')
                              }
                            />
                          )}
            
                          {user.social_links.facebook && (
                            <img
                              className='cursor-pointer'
                              src={facebookLogo}
                              alt='facebook'
                              onClick={() =>
                                window.open(formatURL(user.social_links.facebook), '_blank')
                              }
                            />
                          )}
                           {user.social_links.instagram && (
                            <img
                              className='cursor-pointer social-icon'
                              src={instagramLogo}
                              alt='instagram'
                              onClick={() =>
                                window.open(formatURL(user.social_links.instagram), '_blank')
                              }
                            />
                          )}
            
                          {user.social_links.twitter && (
                            <img
                              className='cursor-pointer'
                              src={twitterLogo}
                              alt='twitter'
                              onClick={() =>
                                window.open(formatURL(user.social_links.twitter), '_blank')
                              }
                            />
                          )}
                          {user.social_links.website && (
                <img
                  className='cursor-pointer social-icon'
                  src={website}
                  alt='website'
                  onClick={() =>
                    window.open(formatURL(user.social_links.website), '_blank')
                  }
                />
              )}
                        </div>
            {user?.bio && (
              <p className={`mt-3 fs-15 fw-light text-black text-break ${
                isExpanded && 'width-50 w-100-mob'
              }`}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: isExpanded
                      ? user.bio
                      : `${user.bio.length > 200 ? user.bio.slice(0, 200) + '...' : user.bio}`
                  }}
                />

                {user.bio.length > 200 && (
                  <span
                    className='blue-color ml-2 fw-medium cursor-pointer'
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>

      <EditUserModal isOpen={modal} toggle={toggle} subToggle={subToggle} />

      <SubscriptionModal
        subsbsciptionModal={subsbsciptionModal}
        setSubscriptionModal={setSubscriptionModal}
        toggleCancelModal={toggleCancelModal}
      />

      <CancelSubModal
        cancelSubModal={cancelSubModal}
        setCancelSubModal={setCancelSubModal}
        toggleCancelModal={toggleCancelModal}
        toggleCancelRenewal={toggleCancelRenewal}
      />
      <CancelRenewalModal
        canceledRenewal={canceledRenewal}
        setCanceledRenewal={setCanceledRenewal}
      />
      <SharePortfolioModal 
        sharePortfolio={sharePortfolio} 
        setSharePortfolio={setSharePortfolio}
        portfolioUrl={content}
      />
    </>
  )
}

export default AboutMe
