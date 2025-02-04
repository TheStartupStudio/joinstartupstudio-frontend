import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import IntlMessages from '../../utils/IntlMessages'
import ContactUsModal from '../Modals/contactUsModal'
import MisconductModal from '../Modals/misconductModal'
import { useHistory } from 'react-router-dom'
import { userLogout } from '../../redux'
import { setGeneralLoading } from '../../redux/general/Actions'

const NavbarProfileMenu = ({
  setCountStudentOfInstructor,
  showDropDown,
  setShowDropDown,
  isMobile = false,
  userRole
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [showContactModal, setShowContactModal] = useState(false)
  const [showMisconductReportModal, setShowMisconductReportModal] =
    useState(false)

  const showModal = () => {
    setShowContactModal(true)
  }
  const closeModal = () => {
    setShowContactModal(false)
  }

  const handleLogout = async () => {
    dispatch(setGeneralLoading(true))
    await dispatch(userLogout())
      .then(() => {
        localStorage.clear()
        setTimeout(() => {
          history.push('/')
        }, 100)
      })
      .catch((error) => {
        console.log('error', error)
      })
      .finally(() => {
        // window.location.href = '/'
        setTimeout(() => {
          history.push('/')
        }, 100)
        dispatch(setGeneralLoading(false))
      })
  }

  const { isAdmin } = useSelector((state) => state.user.user)
  return (
    <>
      <div
        className={`dropdown-menu${
          showDropDown ? 'show1' : ''
        } p-0 text-uppercase`}
        aria-labelledby='dropdownMenuButton'
      >
        <Link
          style={isMobile ? {} : { width: '95%' }}
          className='dropdown-item py-2 dropdown-menu-hover'
          to='/account'
          onClick={() => setShowDropDown((preState) => !preState)}
        >
          <IntlMessages id='my_account.page_title' />
        </Link>

        <Link
          style={isMobile ? {} : { width: '95%' }}
          className='dropdown-item py-2 dropdown-menu-hover'
          to='/archived-portfolio'
          onClick={() => setShowDropDown((preState) => !preState)}
        >
          MY ARCHIVED PORTFOLIO
        </Link>
        {userRole === 'student' && (
          <>
            <Link
              style={{ width: '95%' }}
              className='dropdown-item py-2 dropdown-menu-hover'
              to='#'
              onClick={showModal}
            >
              <IntlMessages id='navigation.contact_us' />
            </Link>
            <Link
              className='dropdown-item py-2 dropdown-menu-hover'
              to='#'
              onClick={() => setShowMisconductReportModal(true)}
            >
              REPORT MISCONDUCT
            </Link>
          </>
        )}
        {userRole !== 'student' && (
          <>
            <Link
              style={isMobile ? {} : { width: '95%' }}
              onClick={() => setShowDropDown((preState) => !preState)}
              to='/briefings'
              className='dropdown-item py-2 dropdown-menu-hover'
            >
              MY NEWS BRIEFINGS ARCHIVE
            </Link>

            <Link
              style={isMobile ? {} : { width: '95%' }}
              onClick={() => setShowDropDown((preState) => !preState)}
              to='/resources'
              className='dropdown-item py-2 dropdown-menu-hover'
            >
              MY RESOURCES
            </Link>
          </>
        )}

        {isAdmin && (
          <Link
            style={isMobile ? {} : { width: '95%' }}
            className='dropdown-item py-2 dropdown-menu-hover'
            to='#'
            onClick={() => {
              setCountStudentOfInstructor(true)
              setShowDropDown((preState) => !preState)
            }}
          >
            Admin panel
          </Link>
        )}

        {/* <Link
className="dropdown-item py-2 dropdown-menu-hover"
to="#"
onClick={() => {
  showModal()
  setShowDropDown((preState) => !preState)
}}
>
SUPPORT
</Link> */}
        {/* <Link
          style={isMobile ? {} : { width: '95%' }}
          className='dropdown-item py-2 dropdown-menu-hover'
          to='/logout'
        >
          <IntlMessages id='navigation.logout' />
        </Link> */}
        <button
          style={isMobile ? {} : { width: '95%' }}
          className='dropdown-item py-2 dropdown-menu-hover'
          onClick={handleLogout}
        >
          <IntlMessages id='navigation.logout' />
        </button>
      </div>
      {showContactModal && (
        <ContactUsModal
          show={showContactModal}
          onHide={closeModal}
          // user={currentUser}
        />
      )}

      {showMisconductReportModal && (
        <MisconductModal
          show={showMisconductReportModal}
          onHide={() => setShowMisconductReportModal(false)}
        />
      )}
    </>
  )
}

export default NavbarProfileMenu
