import React, { useState } from 'react'
import './index.css'
import { FaPencilAlt, FaCheck, FaEye } from 'react-icons/fa'

const MentorCard = ({ children, onEdit, title, mentor, onClick, width, isExpanded, onToggleExpand }) => {
  const description = mentor?.mentorDescription?.replace(/<[^>]*>/g, '') || '';
  const shouldShowButton = description.length > 80;

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
        <div className='mentor-info-container' style={{ padding: '15px' }}>
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
            style={{ fontSize: '12px', marginBottom: '5px', fontWeight: '300', color: 'black' }}
            className='mentor-name'
          >
            {mentor.mentorRole}
          </p>
          <p
            style={{ fontSize: '12px', marginBottom: '5px', fontWeight: '400', color: 'black' }}
            className='mentor-name'
          >
            {mentor?.mentorCompany}
          </p>
          <div
            style={{ fontSize: '12px', marginBottom: '5px', fontWeight: '400', color: 'black', textAlign: 'left' }}
            className='mentor-name'
          >
            {isExpanded ? description : description.slice(0, 80)}
            {shouldShowButton && (
              <span
                onClick={() => onToggleExpand()}
                style={{
                  color: 'rgb(0, 218, 218)',
                  cursor: 'pointer',
                  marginLeft: '5px',
                  fontWeight: '500'
                }}
              >
                {isExpanded ? ' Read Less' : '... Read More'}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className='profile-card-content'>{children}</div>
    </div>
  );
};

export default MentorCard;
