import React, { useState } from 'react'
import facebookLogo from '../../assets/images/academy-icons/facebook.png'
import linkedinLogo from '../../assets/images/academy-icons/linkedin.png'
import userIcon from '../../assets/images/academy-icons/profile-icon.png'
import twitterLogo from '../../assets/images/academy-icons/twitter.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import internet from '../../assets/images/academy-icons/svg/internet.svg'

function AboutMe({ profilePic, instructorName, userProffesion }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const fullText = `Sed ut perspiciatis unde omnis iste natus error sit voluptatem
  accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
  quae ab illo inventore veritatis et quasi architecto beatae vitae
  dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
  sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, 
  qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...`

  const shortText = fullText.slice(0, 200)

  return (
    <div className='d-grid academy-dashboard-card pb-5 relative'>
      <div className='d-flex justify-content-between align-items-center align-self-baseline pt-4 mb-5'>
        <div className='d-flex gap-3 align-items-center'>
          <img src={userIcon} alt='user' />
          <h4 className='fs-14 my-details-header text-black'>About Me</h4>
        </div>
        <div>
          <div
            className='d-flex gap-2 align-items-center cursor-pointer'
            style={{ marginRight: '5rem' }}
          >
            <img src={internet} alt='internet' />
            <p className='mb-0 fs-15 fw-medium portfolio-u'>
              Portfolio unpublished
            </p>
          </div>
          <span className='cursor-pointer' style={{ zIndex: '1' }}>
            <img
              className='left-arrow-modal'
              src={penIcon}
              alt='pen-icon'
              style={{ width: '24px' }}
            />
          </span>
        </div>
      </div>
      <div className='d-flex gap-4'>
        <img
          className='profile-dashboard-academy align-self-start'
          src={profilePic}
          alt='profile'
        />
        <div className='academy-profile-info'>
          <h3 className='mb-2'>{instructorName}</h3>
          <p className='text-black fs-15 fw-medium lh-sm mb-3'>
            {userProffesion}
          </p>
          <div className='d-flex gap-2'>
            <img
              className='cursor-pointer'
              src={linkedinLogo}
              alt='linkedin'
              onClick={() => window.open('https://www.linkedin.com/', '_blank')}
            />
            <img
              className='cursor-pointer'
              src={facebookLogo}
              alt='facebook'
              onClick={() => window.open('https://www.facebook.com/', '_blank')}
            />
            <img
              className='cursor-pointer'
              src={twitterLogo}
              alt='twitter'
              onClick={() => window.open('https://www.x.com/', '_blank')}
            />
          </div>
          <p
            className={`mt-3 fs-15 fw-light text-black ${
              isExpanded && 'width-50'
            }`}
          >
            {isExpanded ? fullText : `${shortText}...`}
            <span
              className='blue-color ml-2 fw-medium cursor-pointer'
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutMe
