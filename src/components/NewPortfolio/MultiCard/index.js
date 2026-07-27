import React, { useState } from 'react'
import './index.css'
import { FaPencilAlt, FaCheck, FaEye, FaPlus } from 'react-icons/fa'
import penIcon from '../../../assets/images/pen-icon.svg'

import nothingAdded from '../../../assets/images/nothing-added.svg'
import plus from '../../../assets/icons/plus.svg'
import { useSelector } from 'react-redux'

const MultiCard = ({
  children,
  onEdit,
  title,
  icon,
  onClick,
  addIcon,
  onAddClick,
  iconWrapperStyle,
  canEdit
}) => {
  const [shouldRenderIcon, setShouldRenderIcon] = useState(true)
  const userState = useSelector((state) => state?.user?.user)
  const user = userState?.user || null

  const shouldShowAdd =
    canEdit !== undefined ? canEdit : user?.role_id !== 5 && user

  return (
    <div className='profile-card'>
      <div className='profile-card-header'>
        <div style={{ display: 'flex' }} className='title-div'>
          {icon && shouldRenderIcon && (
            <div className='icon-wrapper' style={iconWrapperStyle}>
              <img
                src={icon}
                style={{ cursor: 'pointer' }}
                title={'section icon'}
                height={20}
                width={20}
                alt={`${title} icon`}
                onError={() => setShouldRenderIcon(false)}
                loading='lazy'
                draggable={false}
              />
            </div>
          )}
          <span className='cover-title'>{title}</span>
        </div>

        {shouldShowAdd && (
          <div
            className='portfolio-actions'
            style={{
              borderTopRightRadius: '26px',
              background: 'transparent'
            }}
          >
            <img
              src={plus}
              alt='plus-icon'
              onClick={onAddClick}
              style={{
                width: '40px',
                margin: '0 10px',
                cursor: 'pointer'
              }}
              title='Add'
              className=' pencil-icon'
            />
            {addIcon && (
              <div>
                {' '}
                <img
                  src={penIcon}
                  alt='pen-icon'
                  className={'action-box pencil-icon no-shadow'}
                  onClick={onEdit}
                  style={{
                    cursor: 'pointer',
                    background: 'transparent'
                  }}
                  title='Edit'
                />
              </div>
            )}
          </div>
        )}

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
              className='text-uppercase text-medium nodata-portf-text'
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
