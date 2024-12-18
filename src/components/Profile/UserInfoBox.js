import React, { useEffect, useState } from 'react'
import { Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import UserSocialMedia from '../../pages/Portfolio2024/Components/UserSocialMedia'
import { getUserBasicInfo } from '../../redux/portfolio/Actions'
import avator from '../../assets/images/profile-image.png'

const UserInfoBox = ({ user }) => {
  const dispatch = useDispatch()
  const [lastLogin, setLastLogin] = useState(null)

  useEffect(() => {
    dispatch(getUserBasicInfo())
  }, [dispatch])

  useEffect(() => {
    if (user?.last_login === null) {
      return setLastLogin('None')
    }
    const milliseconds = user?.last_login * 1000
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    const date = new Date(milliseconds)
    const formatedDate =
      monthNames[date.getMonth()] +
      ' ' +
      date.getUTCDate() +
      ', ' +
      date.getFullYear()
    setLastLogin(formatedDate)
  }, [user.last_login])

  const userBasicInfo = useSelector(
    (state) => state.portfolio.whoSection.userBasicInfo
  )
  return (
    <Col
      lg={6}
      sm={12}
      style={{
        backgroundColor: '#F8F7F7',
        borderRadius: 0,
        minHeight: '166px'
      }}
      className='notification-box'
    >
      <div className='dashboard-profile'>
        <img
          src={
            userBasicInfo?.data?.userImageUrl
              ? userBasicInfo?.data?.userImageUrl
              : avator
          }
          // src={user?.profile_image ? user?.profile_image : avator}
          alt='Profile'
          className='ms-2'
        />
        <div className='profile-margin'>
          <h3>{user?.name}</h3>
          {/*<p>{user?.profession}</p>*/}
          <p>{userBasicInfo?.data?.userTitle}</p>
          <UserSocialMedia data={userBasicInfo?.data?.socialMediaLinks} />
          <div className='dashboard_lastLogin w-100'>
            <span className='me-1'>Last Login:</span>
            {lastLogin}
          </div>
        </div>
      </div>
    </Col>
  )
}

export default UserInfoBox
