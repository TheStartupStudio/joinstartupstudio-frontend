import React from 'react'
import './index.css'
import penIcon from '../../../assets/images/pen-icon.svg'
import nothingAdded from '../../../assets/images/nothing-added.svg'
import { useSelector } from 'react-redux'

const MainCard = ({
  children,
  onEdit,
  title,
  icon,
  onClick,
  noIcon,
  multi,
  editSign,
  canEdit 
}) => {

  const userState = useSelector((state) => state?.user?.user)
  const user = userState?.user || null
  const shouldShowEdit = canEdit !== undefined ? canEdit : (user?.role_id !== 5 && user)

  return (
    <div className='profile-card'>
      <div className='profile-card-header'>
        <div style={{ display: 'flex' }} className='title-div'>
          {!multi && !noIcon && icon && (
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

          <span
            className='cover-title'
            style={{
              color: '#231F20',
              fontFamily: 'Montserrat',
              fontSize: '15px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: 'normal'
            }}
          >
            {title}
          </span>
        </div>

        {/* Only show edit button if shouldShowEdit is true */}
        {shouldShowEdit && (
          <div
            className='portfolio-actions'
            style={{
              borderTopRightRadius: '26px',
              background: 'transparent'
            }}
          >
            <img
              src={penIcon}
              alt='pen-icon'
              className={'action-box pencil-icon'}
              onClick={onClick}
              style={{ cursor: 'pointer', background: 'transparent' }}
              title='Edit'
            />
          </div>
        )}
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
              {`Nothing has been added yet.${
                shouldShowEdit ? ` click the ${editSign ? 'edit' : 'plus '} button to get started.` : ''
              }`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainCard