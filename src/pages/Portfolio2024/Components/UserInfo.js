import React from 'react'
import UserSocialMedia from './UserSocialMedia'
import UserImage from './UserImage'

function UserInfo(props) {
  return (
    <div className={'d-flex gap-3'}>
      <UserImage width={150} height={150} />
      <div className={'user-info-box'}>
        <div className={'user-name'}>{props.user?.name}</div>
        <div className={'user-profession'}>{props.user?.profession}</div>
        <UserSocialMedia />
      </div>
    </div>
  )
}

export default UserInfo
