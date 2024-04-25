import React from 'react'
import Avatar from '../../../assets/images/profile-image.png'

const ProfileHolder = ({ profileImage, name }) => {
  return (
    <div className="d-flex align-items-center mb-5 ">
      <div className="profile-dropdown me-1 desktop-menu d-none d-xl-block">
        <img src={profileImage ? profileImage : Avatar} alt="Profile" />
      </div>
      <div className="profile-dropdown-info desktop-menu">
        <h5>{name ? name : localStorage.getItem('name')}</h5>
      </div>
    </div>
  )
}

export default ProfileHolder
