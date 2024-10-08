import React from 'react'
import { FaInstagram, FaLinkedinIn, FaGlobe } from 'react-icons/fa'
import { FaSquareFacebook, FaSquareXTwitter } from 'react-icons/fa6'
import '../../Portfolio2024/index.css'

const ensureUrlProtocol = (url) => {
  if (url?.startsWith('http://') || url?.startsWith('https://')) {
    return url
  } else {
    return `https://${url}`
  }
}

const UserSocialMedia = (props) => {
  const {
    linkedIn = null,
    facebook = null,
    instagram = null,
    xTwitter = null,
    website = null
  } = props.data || {}

  const socialMediaMap = new Map([
    [
      'LinkedIn',
      { Icon: FaLinkedinIn, url: linkedIn && ensureUrlProtocol(linkedIn) }
    ],
    [
      'Instagram',
      { Icon: FaInstagram, url: instagram && ensureUrlProtocol(instagram) }
    ],
    [
      'Twitter',
      { Icon: FaSquareXTwitter, url: xTwitter && ensureUrlProtocol(xTwitter) }
    ],
    [
      'Facebook',
      { Icon: FaSquareFacebook, url: facebook && ensureUrlProtocol(facebook) }
    ],
    ['Website', { Icon: FaGlobe, url: website && ensureUrlProtocol(website) }]
  ])

  return (
    <div className="user-social-media d-flex">
      {[...socialMediaMap].map(([key, { Icon, url }], index) => (
        <span key={index} className="social-media-icon-wrapper">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={key}
            >
              <Icon className="social-media-icon" />
            </a>
          ) : (
            <div
              className="social-media-icon-disabled"
              aria-label={key}
              style={{ pointerEvents: 'none' }}
            >
              <Icon className="social-media-icon" />
            </div>
          )}
        </span>
      ))}
    </div>
  )
}

export default UserSocialMedia
