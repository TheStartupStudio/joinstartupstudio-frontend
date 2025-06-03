import React from 'react'
import './index.css'
import { FaPencilAlt, FaCheck, FaEye, FaPlus } from 'react-icons/fa'
import nothingAdded from '../../../assets/images/nothing-added.svg'

const MultiCard = ({ 
  children, 
  onEdit, 
  title, 
  icon, 
  onClick, 
  titleComponent: TitleComponent, // New prop for custom title component
  titleClassName = 'cover-title', // Default class for title
  titleStyle = {} // Default style for title
}) => {
  return (
    <div className='profile-card'>
      <div className='profile-card-header'>
        <div style={{ display: 'flex', width:'100%' }} className='title-div'>
          {icon && (
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
          )}
          {TitleComponent ? (
            <TitleComponent>{title}</TitleComponent>
          ) : (
            <span 
              className={titleClassName}
              style={titleStyle}
            >
              {title}
            </span>
          )}
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
            onClick={onClick}
            style={{ cursor: 'pointer', background: 'transparent' }}
            title='Edit Experience'
          />
        </div>
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
