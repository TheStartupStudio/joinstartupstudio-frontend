import React from 'react'
import facebookLogo from '../../assets/images/academy-icons/facebook.png'
import linkedinLogo from '../../assets/images/academy-icons/linkedin.png'
import userIcon from '../../assets/images/academy-icons/profile-icon.png'
import twitterLogo from '../../assets/images/academy-icons/twitter.png'

function YourInstructor({ profilePic, instructorName, userProffesion }) {
  return (
    <>
      <div
        className='d-grid academy-dashboard-card pb-5'
        style={{ gridTemplateRows: '1fr 1fr' }}
      >
        <div className='d-flex justify-content-between align-items-center align-self-baseline pt-4'>
          <div className='d-flex gap-3 align-items-center'>
            <img src={userIcon} alt='user' />
            <h4 className='fs-18 my-details-header text-black'>
              Your Instructor
            </h4>
          </div>
        </div>
        <div className='d-flex gap-4 align-items-center'>
          <img
            className='profile-dashboard-academy'
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
                onClick={() =>
                  window.open('https://www.linkedin.com/', '_blank')
                }
              />
              <img
                className='cursor-pointer'
                src={facebookLogo}
                alt='facebook'
                onClick={() =>
                  window.open('https://www.facebook.com/', '_blank')
                }
              />
              <img
                className='cursor-pointer'
                src={twitterLogo}
                alt='twitter'
                onClick={() => window.open('https://www.x.com/', '_blank')}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default YourInstructor
