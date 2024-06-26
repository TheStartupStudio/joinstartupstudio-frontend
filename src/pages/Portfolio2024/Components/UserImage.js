import React from 'react'
import avatar from '../../../assets/images/profile-image.png'
import { useSelector } from 'react-redux'

function UserImage(props) {
  const loggedUser = useSelector((state) => state.user.user.user)
  return (
    <div className={'user-image-box'}>
      <img
        src={loggedUser?.profileImage ?? avatar}
        alt={'user-image'}
        className={'user-image'}
        style={{ width: props.width, height: props.height }}
      />
    </div>
  )
}

export default UserImage
