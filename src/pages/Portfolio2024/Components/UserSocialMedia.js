import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookSquare,
  faInstagram,
  faLinkedin,
  faTwitterSquare
} from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

const UserSocialMedia = () => {
  return (
    <div className={'user-social-media'}>
      <a target="_blank">
        <FontAwesomeIcon icon={faLinkedin} className={'social-media-icon'} />
      </a>
      <a target="_blank">
        <FontAwesomeIcon
          icon={faTwitterSquare}
          className={'social-media-icon'}
        />
      </a>
      <a target="_blank">
        <FontAwesomeIcon icon={faInstagram} className={'social-media-icon'} />
      </a>
      <a target="_blank">
        <FontAwesomeIcon
          icon={faFacebookSquare}
          className={'social-media-icon'}
        />
      </a>
      <a target="_blank">
        <FontAwesomeIcon icon={faGlobe} className={'social-media-icon'} />
      </a>
    </div>
  )
}

export default UserSocialMedia
