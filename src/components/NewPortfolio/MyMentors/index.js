import React from 'react'
import './index.css' // We'll create this CSS file
import { FaPencilAlt, FaCheck, FaEye } from 'react-icons/fa'
const MentorCard = ({ children, onEdit, title, mentor, onClick, width }) => {
  return (
    <div style={{ width: width }} className='mentor-card'>
      <div className='mentor-card-div'>
        <div className='mentor-image-container'>
          <img
            src={mentor.mentorImage}
            title={'mentor image'}
            alt='mentor image'
          />
        </div>
        <div className='mentor-info-container'>
          <p
            style={{
              fontWeight: '600',
              marginBottom: '5px',
              marginTop: '10px'
            }}
            className='mentor-name'
          >
            {mentor.mentorName}
          </p>

          <p
            style={{ fontSize: '8px', marginBottom: '5px' }}
            className='mentor-name'
          >
            {mentor.mentorRole}
          </p>
          <p
            style={{ fontSize: '8px', marginBottom: '5px' }}
            className='mentor-name'
          >
            {mentor?.mentorCompany}
          </p>
          <p
            style={{ fontSize: '8px', marginBottom: '5px' }}
            className='mentor-name'
          >
            {mentor?.mentorDescription?.replace(/<[^>]*>/g, '') || ''}
          </p>
        </div>
        <div
          className='portfolio-actions'
          style={{
            borderTopRightRadius: '36px',
            background:
              ' linear-gradient(rgb(228, 233, 244), rgb(255, 255, 255))'
          }}
        >
          <FaPencilAlt
            className={'action-box pencil-icon'}
            onClick={onClick} // Switch to edit mode
            style={{ cursor: 'pointer' }}
            title='Edit Experience'
          />
        </div>
        {/* {onEdit && (
          <button className='edit-button' onClick={onEdit}>
            <span role='img' aria-label='edit'>
              ✏️
            </span>
          </button>
        )} */}
      </div>

      <div className='profile-card-content'>{children}</div>
    </div>
  )
}

export default MentorCard
