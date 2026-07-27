import React, { useState } from 'react'
import './index.css'
import { FaPencilAlt } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const MentorCard = ({
  children,
  onEdit,
  title,
  mentor,
  onClick,
  width,
  canEdit
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const cleanDescription = mentor?.mentorDescription || ''
  const toggleExpanded = () => setIsExpanded((prev) => !prev)

  const truncateAtWord = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text
    let lastSpace = text.lastIndexOf(' ', maxLength)
    if (lastSpace === -1) lastSpace = maxLength
    return text.substring(0, lastSpace) + (lastSpace < text.length ? '...' : '')
  }

  const displayedDescription = isExpanded
    ? cleanDescription
    : truncateAtWord(cleanDescription, 150)

  const shouldTruncate =
    cleanDescription.length > 150 ||
    (cleanDescription.length > 0 && displayedDescription.endsWith('...'))

  const userState = useSelector((state) => state?.user?.user)
  const user = userState?.user || null

  const shouldShowEdit =
    canEdit !== undefined ? canEdit : user?.role_id !== 5 && user

  return (
    <div style={{ width: width }} className='mentor-card'>
      <div className='mentor-card-div'>
        <div className='mentor-image-container'>
          <img
            src={mentor.mentorImage}
            title='mentor image'
            alt='mentor'
            style={{ height: '350px' }}
          />
        </div>

        <div className='mentor-info-container'>
          <p
            style={{
              marginBottom: '0',
              marginTop: '10px',
              fontFamily: 'Montserrat',
              fontSize: '15px',
              fontStyle: 'normal',
              fontWeight: '500',
              lineHeight: 'normal',
              fontVariant: 'all-small-caps',
              color: '#000'
            }}
            className='mentor-name'
          >
            {mentor.mentorName}
          </p>

          <p
            style={{
              fontSize: '8px',
              marginBottom: '0',
              fontFamily: 'Montserrat',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: '300',
              lineHeight: 'normal',
              textTransform: 'none',
              color: '#000'
            }}
            className='mentor-name'
          >
            {mentor.mentorRole}
          </p>

          <p
            style={{
              fontSize: '8px',
              marginBottom: '0',
              fontFamily: 'Montserrat',
              fontSize: '13px',
              fontStyle: 'normal',
              fontWeight: '300',
              lineHeight: 'normal',
              textTransform: 'none',
              marginBottom: '0',
              color: '#000',
              textTransform: 'none'
            }}
            className='mentor-name'
          >
            {mentor.mentorCompany}
          </p>

          <div
            className='mentor-description-container'
            style={{
              // maxHeight: isExpanded ? '500px' : '60px',
              overflow: 'hidden',
              transition: 'max-height 0.3s ease',
              transition: 'max-height 0.3s ease',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <p
              style={{
                marginBottom: '0',
                lineHeight: '12px',
                textAlign: 'left',
                padding: '10px',
                fontFamily: 'Montserrat',
                fontSize: '15px',
                fontStyle: 'normal',
                fontWeight: 300,
                lineHeight: 'normal',
                textTransform: 'none',
                color: '#000'
              }}
              className='mentor-name'
              dangerouslySetInnerHTML={{
                __html: displayedDescription?.replace(/&nbsp;/g, ' ') || ''
              }}
            >
              {/* {displayedDescription} */}
            </p>
            {shouldTruncate && (
              <span
                onClick={toggleExpanded}
                style={{
                  color: '#52C7D3',
                  cursor: 'pointer',
                  fontWeight: 400,
                  fontSize: '15px',
                  fontStyle: 'normal',
                  lineHeight: '20px',
                  marginLeft: '10px',
                  marginTop: '-10px',
                  fontFamily: 'Montserrat'
                }}
              >
                {isExpanded ? ' Read less' : 'Read more'}
              </span>
            )}
          </div>
        </div>

        {shouldShowEdit && (
          <div
            className='portfolio-actions'
            style={{
              borderTopRightRadius: '36px',
              right: '-5px',
              background:
                'linear-gradient(rgb(228, 233, 244), rgb(255, 255, 255))'
            }}
          >
            <FaPencilAlt
              className='action-box pencil-icon'
              onClick={onClick}
              style={{ cursor: 'pointer' }}
              title='Edit'
            />
          </div>
        )}
      </div>

      <div className='profile-card-content'>{children}</div>
    </div>
  )
}

export default MentorCard
