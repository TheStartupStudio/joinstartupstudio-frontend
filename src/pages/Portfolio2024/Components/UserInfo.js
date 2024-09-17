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
        width={190}
        height={190}
        userImageUrl={props.userInfo?.userImageUrl}
      />
      <div className={'user-info-box'} style={{ marginTop: '30px' }}>
        <div
          className={'user-name'}
          style={{ fontSize: '25px', fontWeight: '400' }}
        >
          {props.user?.name}
        </div>
        <div className={'user-profession mt-1'}>
          {props.userInfo?.userTitle}
        </div>
        <UserSocialMedia data={props.userInfo?.socialMediaLinks} />
      </div>
    </div>
  )
}

export default UserInfo
