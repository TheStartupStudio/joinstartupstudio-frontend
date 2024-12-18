import React, { useRef, useState } from 'react'
import { NavLink } from 'react-bootstrap'
import HSmySpark from '../../assets/images/LTS-HS/Spark .svg'
import HSGooglePlay from '../../assets/images/LTS-HS/Story in motion-01.svg'
import HSCommunity from '../../assets/images/LTS-HS/Community-01.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faBell } from '@fortawesome/free-solid-svg-icons'
import Notifications from '../Header/notifications'
import NavbarProfile from './NavbarProfile'
import notesIcon from '../../assets/images/notes-icon.svg'
import { faHeart as heart } from '@fortawesome/free-regular-svg-icons'

const NavbarIcon = (props) => {
  return (
    <li
      className='nav-item  my-auto'
      onClick={
        props.isMobile ? () => {} : () => props.setShowNotifications(false)
      }
    >
      <NavLink
        className={`nav-link m-0 p-0 icon-menu ${props.cn}`}
        to={props.to}
      >
        <img
          src={props.srcWithFocus}
          width={props.width}
          height={props.height}
          style={props.style}
          alt={props.alt}
        />
      </NavLink>
    </li>
  )
}

const NavbarListItems = (props) => {
  const notificationsRef = useRef(null)
  const [showNotifications, setShowNotifications] = useState(false)
  return (
    <ul
      className={`navbar-nav mt-1 ${
        props.isMobile ? ' navbar-icon-list navbar-list-margin' : 'ms-auto'
      } `}
    >
      <div className={props.isMobile ? 'navbar-top-icons d-flex' : 'd-flex'}>
        <NavbarIcon
          to={'/story-in-motion'}
          cn={`hs-icon ${props.isMobile ? 'safari_only' : ''}`}
          srcWithFocus={HSGooglePlay}
        />
        <NavbarIcon
          to={'/my-spark/widgets'}
          cn={`spark-icon ${props.isMobile ? 'safari_only' : ''}`}
          srcWithFocus={HSmySpark}
        />
        <NavbarIcon
          to={'/my-classroom'}
          cn={'comm-icon my-auto'}
          srcWithFocus={HSCommunity}
          width={'55px'}
          height={'45px'}
        />
      </div>

      <div
        className={props.isMobile ? `navbar-bottom-icons` : ''}
        style={props.isMobile ? { display: 'flex' } : { display: 'inherit' }}
      >
        <div
          className={`my-auto mx-3 ${
            props.isMobile ? 'navbar-icons-border' : ''
          }`}
          style={{ borderRight: '1px solid #BBBDBF', height: '20px' }}
        ></div>
        <li className='nav-item my-auto me-2 position-relative'>
          <a
            className={`nav-link icon-menu px-2 my-auto nav-notifications position-relative ${
              showNotifications ? 'active' : ''
            }`}
            onClick={() => setShowNotifications((state) => !state)}
            href
          >
            <FontAwesomeIcon
              icon={faBell}
              style={{
                fontSize: '30px',
                color: '#333D3D'
              }}
              className='nav-bell-icon pt-1'
            />
            {props.unreadNotifications > 0 && (
              <span className='badge nofitication-badge'>
                {props.unreadNotifications}
              </span>
            )}
          </a>
          {showNotifications && (
            <Notifications
              unreadNotifications={props.unreadNotifications}
              notifications={props.notifications}
              setShowNotifications={setShowNotifications}
              setUnreadNotifications={props.setUnreadNotifications}
              notificationsRef={notificationsRef}
            />
          )}
        </li>
        <li
          className='nav-item my-auto me-2'
          onClick={
            props.isMobile ? () => {} : () => setShowNotifications(false)
          }
        >
          <NavLink
            className={`nav-link icon-menu px-2 my-auto `}
            to={'/savedMedia'}
          >
            <FontAwesomeIcon
              icon={heart}
              style={{ fontSize: '30px' }}
              className='pt-1'
            />
          </NavLink>
        </li>

        <li
          className='nav-item notes-nav my-auto me-2 '
          onClick={
            props.isMobile ? () => {} : () => setShowNotifications(false)
          }
        >
          <NavLink
            className={`nav-link icon-menu`}
            to={
              props.firstNote !== ''
                ? `${`/my-notes/${props.firstNote}`}`
                : '/my-notes'
            }
          >
            <div style={props.isMobile ? { padding: '0px 9px' } : {}}>
              <img
                src={notesIcon}
                className='not-focus-icon'
                width='27px'
                alt='note'
              />
            </div>
          </NavLink>
        </li>
        {!props.isMobile && (
          <NavbarProfile
            setCountStudentOfInstructor={props.setCountStudentOfInstructor}
            user={props.user}
            setShowNotifications={setShowNotifications}
            userRole={props.userRole}
          />
        )}
      </div>
      {props.isMobile && (
        <button
          className='btn navbar-dropdown-desktop'
          type='button'
          id='dropdownMenuButton'
          data-toggle='dropdown'
          aria-haspopup='true'
          aria-expanded='false'
          onClick={() => {
            props.setShowDropDown((preState) => !preState)
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      )}
    </ul>
  )
}

export default NavbarListItems
