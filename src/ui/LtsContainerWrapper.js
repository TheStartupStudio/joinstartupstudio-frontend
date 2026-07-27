import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Breadcrumbs from '../pages/Breadcrumbs'
import MenuIcon from '../assets/images/academy-icons/svg/icons8-menu.svg'
import { toggleCollapse } from '../redux/sidebar/Actions'
import NotificationBell from '../components/NotificationBell'

const LtsContainerWrapper = ({
  children,
  title,
  titleDescription,
  className
}) => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user.user || {})
  const userRole = user?.role_id || localStorage.getItem('role')

  return (
    <div className={`container-fluid iamr-page ${className || ''}`}>
      {/* <Breadcrumbs /> */}
      <div className='col-12 col-md-12 pe-0 me-0 d-flex justify-content-between p-1rem-tab p-right-1rem-tab gap-4 pt-5'>
        <div className='account-page-padding d-flex justify-content-between flex-col-tab align-start-tab'>
          <div>
            <h3 className='fw-bold page-title mb-0'>{title}</h3>
            <p className='school-page-desc page-description mb-0'>
              {titleDescription}
            </p>
          </div>
        </div>
        <div className='d-flex align-items-center justify-content-center'>
          {Number(userRole) === 2 ? <NotificationBell /> : null}
          <img
            src={MenuIcon}
            alt='menu'
            className='menu-icon-cie self-start-tab cursor-pointer'
            onClick={() => dispatch(toggleCollapse())}
          />
        </div>
      </div>
      {/* <hr /> */}
      <div className='m-0 p-0'>{children}</div>
    </div>
  )
}

export default LtsContainerWrapper
