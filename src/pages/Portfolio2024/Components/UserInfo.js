import React from 'react'
import UserSocialMedia from './UserSocialMedia'
import UserImage from './UserImage'
import UserCertifications from './UserCertifications'

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
      <div className={'user-info-box'}>
        <div className={'user-name mb-1'}>{props.userInfo?.name}</div>
        <div className={'user-profession mt-1'}>
          {props.userInfo?.userTitle?.trim()?.length > 0
            ? props.userInfo?.userTitle
            : 'No title has been added yet'}
        </div>

        <div className={'user-profession mt-1'}>
          {props.userInfo?.organization?.trim()?.length > 0
            ? props.userInfo?.organization
            : 'No organization has been added yet'}
        </div>
        <UserSocialMedia data={props.userInfo?.socialMediaLinks} />
        {/*<UserCertifications />*/}
      </div>
    </div>
  )
}

export default UserInfo
