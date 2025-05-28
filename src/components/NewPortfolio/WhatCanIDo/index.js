import React from 'react'
import './index.css' // We'll create this CSS file
import { FaPencilAlt, FaCheck, FaEye } from 'react-icons/fa'
import penIcon from '../../../assets/images/pen-icon.svg'

const WhatCanIDoCard = ({ children, onEdit, title, evidence }) => {
  console.log(evidence, 'evidence')
  return (
    <div className='what-can-i-do-card'>
      <div className='mentor-card-div'>
        <div className='mentor-image-container'>
          <img
            src={evidence.imageUrl}
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
            {evidence.evidenceTitle}
          </p>
        </div>
        {/* <div
          className='portfolio-actions'
          style={{
            borderTopRightRadius: '36px',
            background:
              ' linear-gradient(rgb(228, 233, 244), rgb(255, 255, 255))'
          }}
        >
          <img
            src={penIcon}
            alt='pen-icon'
            className={'action-box pencil-icon'}
            // onClick={() => setIsEditMode(!isEditMode)} // Switch to edit mode
            style={{ cursor: 'pointer', background: 'transparent' }}
            title='Edit Experience'
          />
        </div> */}
      </div>

      <div className='profile-card-content'>{children}</div>
    </div>
  )
}

export default WhatCanIDoCard
