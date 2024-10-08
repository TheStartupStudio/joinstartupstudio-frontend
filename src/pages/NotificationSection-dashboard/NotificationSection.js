import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import NotificationBox from './NotificationBox'
import React, { useState } from 'react'

const NotificationSection = () => {
  const [sliceIndex, setSliceIndex] = useState(3)

  const handleShowMore = () => {
    if (typeof sliceIndex === 'undefined') {
      setSliceIndex(3)
    } else {
      setSliceIndex(undefined)
    }
  }
  return (
    <div className="notifications-section">
      <div className={'d-flex gap-2 notifications-section-header'}>
        <div className="notifications-bell-icon-container">
          <FontAwesomeIcon
            icon={faBell}
            style={{
              fontSize: '26px',
              color: '#333D3D'
            }}
            className="nav-bell-icon pt-1"
          />
          <span className={'notification-content-list-item-dot'}></span>
        </div>

        <div className={'notifications-section-title'}>
          LEARN TO START UPDATES
        </div>
      </div>
      <div className={'position-relative'}>
        <div className={'triangle'}></div>

        <div className={'notifications-container'}>
          <NotificationBox sliceIndex={sliceIndex} />
          <div>
            <button className="view-all-button" onClick={handleShowMore}>
              {typeof sliceIndex !== 'undefined' ? 'View All' : 'View less'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default NotificationSection
