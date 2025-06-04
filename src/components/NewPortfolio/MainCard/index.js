import React from 'react'
import './index.css' // We'll create this CSS file
import { FaPencilAlt, FaCheck, FaEye } from 'react-icons/fa'
import penIcon from '../../../assets/images/pen-icon.svg'
import nothingAdded from '../../../assets/images/nothing-added.svg'

const MainCard = ({
  children,
  onEdit,
  title,
  icon,
  onClick,
  noIcon,
  multi
}) => {
  return (
    <div className='profile-card'>
      <div className='profile-card-header'>
        <div style={{ display: 'flex' }} className='title-div'>
          {multi || noIcon ? (
            ''
          ) : (
            <div className='icon-wrapper'>
              <img
                src={noIcon ? '' : icon}
                style={{ cursor: 'pointer' }}
                title={'instructor icon'}
                height={20}
                width={20}
                alt='instructor icon'
              />
            </div>
          )}

          <span className='cover-title'>{title}</span>
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
              Nothing has been added yet. click the Edit button to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainCard
