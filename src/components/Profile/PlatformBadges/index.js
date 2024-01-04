import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import BadgeBox from './BadgeBox'
import './style.css'

const PlatformBadges = (props) => {
  return (
    <div className="p-3">
      <div className="border p-3 my-account">
        <div
          className={`my-account col-md-6 intructor-notes__btn-active`}
          onClick={props.platformBadgeHandler}
        >
          <FontAwesomeIcon
            icon={faCircleNotch}
            size="xl"
            style={{ color: 'white', fontSize: '40px' }}
          />
          <h4>PLATFORM BADGES</h4>
        </div>

        <div className="my-account mt-4 mb-2 w-100">
          <BadgeBox />
        </div>
        {/* 822px */}
      </div>
    </div>
  )
}

export default PlatformBadges
