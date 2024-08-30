import React from 'react'
import UserSocialMedia from './UserSocialMedia'
import UserImage from './UserImage'

function UserInfo(props) {
  return (
    <div
      className={'d-flex gap-3 portfolio-user-box'}
      style={{ marginTop: '30px' }}
    >
      <UserImage
        width={150}
        height={150}
        userImageUrl={props.userInfo?.userImageUrl}
      />
      <div className={'user-info-box'}>
        <div className={'user-name'}>{props.user?.name}</div>
        <div className={'user-profession mt-1'}>
          {props.userInfo?.userTitle}
        </div>
        <UserSocialMedia data={props.userInfo?.socialMediaLinks} />
      </div>
    </div>
  )
}

export default UserInfo
