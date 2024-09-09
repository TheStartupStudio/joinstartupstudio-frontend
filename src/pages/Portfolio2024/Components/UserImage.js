import React from 'react'
import { useSelector } from 'react-redux'
import avatar from '../../../assets/images/profile-image.png'

function UserImage(props) {
  return (
    <div className={'user-image-box'}>
      <img
        src={props.userImageUrl ? props.userImageUrl : avatar}
        alt={'user-image'}
        className={'user-image'}
        style={{ width: props.width, height: props.height }}
      />
    </div>
  )
}

export default UserImage
