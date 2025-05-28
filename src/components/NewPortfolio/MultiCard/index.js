import React from 'react'
import './index.css' // We'll create this CSS file
import { FaPencilAlt, FaCheck, FaEye, FaPlus } from 'react-icons/fa'
import nothingAdded from '../../../assets/images/nothing-added.svg'

const MultiCard = ({ children, onEdit, title, icon, onClick }) => {
  return (
    <div className='profile-card'>
      <div className='profile-card-header'>
        <div style={{ display: 'flex' }} className='title-div'>
          <div className='icon-wrapper'>
            <img
              src={icon}
              style={{ cursor: 'pointer' }}
              title={'instructor icon'}
              height={20}
              width={20}
              alt='instructor icon'
            />
          </div>
          <span className='cover-title'>{title}</span>
        </div>
        <div
          className='portfolio-actions'
          style={{
            borderTopRightRadius: '26px',
            background: 'transparent'
          }}
        >
          <FaPlus
            className={'action-box pencil-icon'}
            onClick={onClick} // Switch to edit mode
            style={{ cursor: 'pointer', background: 'transparent' }}
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

      <div className='profile-card-content'>
        {React.Children.count(children) > 0 ? (
          children
        ) : (
          <div className='d-flex flex-column justify-content-center align-items-center gap-2'>
            <img src={nothingAdded} alt='nothing-added' />
            <p
              className='text-uppercase text-medium'
              style={{ color: '#6F6F6F' }}
            >
              Nothing has been added yet. click the Add button to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiCard
