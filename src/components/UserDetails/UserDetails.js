import React, { useState } from 'react'
import tickLogo from '../../assets/images/academy-icons/blue-tick.png'
import facebookLogo from '../../assets/images/academy-icons/facebook.png'
import linkedinLogo from '../../assets/images/academy-icons/linkedin.png'
import userIcon from '../../assets/images/academy-icons/profile-icon.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import twitterLogo from '../../assets/images/academy-icons/twitter.png'
import CancelRenewalModal from './CancelRenewalModal'
import CancelSubModal from './CancelSubModal'
import CertificateModal from './CertificateModal'
import EditUserModal from './EditUserModal'
import SubscriptionModal from './SubscriptionModal'

function UserDetails({ profilePic, userName, userProffesion }) {
  const [modal, setModal] = useState(false)
  const [subsbsciptionModal, setSubscriptionModal] = useState(false)
  const [cancelSubModal, setCancelSubModal] = useState(false)
  const [canceledRenewal, setCanceledRenewal] = useState(false)
  const [certificate, setCertificate] = useState(false)

  const toggle = () => setModal((prev) => !prev)

  const subToggle = () => {
    setModal((prev) => !prev)
    setSubscriptionModal((prev) => !prev)
  }

  const toggleCancelModal = () => {
    setCancelSubModal((prev) => !prev)
    setSubscriptionModal((prev) => !prev)
  }

  const toggleCancelRenewal = () => {
    setCancelSubModal((prev) => !prev)
    setCanceledRenewal((prev) => !prev)
  }

  const toggleCertificate = () => {
    setCertificate((prev) => !prev)
  }

  const { user } = JSON.parse(localStorage.getItem('user'))

  return (
    <>
      <div
        className='d-grid academy-dashboard-card'
        style={{ gridTemplateRows: '1fr 1fr 1fr' }}
      >
        <div className='d-flex justify-content-between align-items-center align-self-baseline pt-4'>
          <div className='d-flex gap-3 align-items-center'>
            <img src={userIcon} alt='user' />
            <h4 className='fs-9 my-details-header'>My Details</h4>
          </div>
          <button onClick={toggle} className='modal-btn'>
            <img src={penIcon} alt='edit' />
          </button>
        </div>
        <div className='d-flex gap-4 align-items-center'>
          <img
            className='profile-dashboard-academy'
            src={user.profileImage}
            alt='profile'
          />
          <div className='academy-profile-info'>
            <h3>{user.name}</h3>
            <p>{user.profession}</p>
            <div className='d-flex gap-2'>
              <img
                className='cursor-pointer'
                src={linkedinLogo}
                alt='linkedin'
                onClick={() =>
                  window.open(user.social_links.linkedIn, '_blank')
                }
              />
              <img
                className='cursor-pointer'
                src={facebookLogo}
                alt='facebook'
                onClick={() =>
                  window.open(user.social_links.facebook, '_blank')
                }
              />
              <img
                className='cursor-pointer'
                src={twitterLogo}
                alt='twitter'
                onClick={() => window.open(user.social_links.twitter, '_blank')}
              />
            </div>
          </div>
        </div>
        <div
          className='d-flex gap-2 view-certificate align-items-center mb-3 cursor-pointer'
          onClick={toggleCertificate}
        >
          <img
            src={tickLogo}
            alt='blue-tick'
            style={{ width: '20px', height: '20px' }}
          />
          <p className='mb-0'>View my certificate</p>
        </div>
      </div>

      <EditUserModal isOpen={modal} toggle={toggle} subToggle={subToggle} />

      <SubscriptionModal
        subsbsciptionModal={subsbsciptionModal}
        setSubscriptionModal={setSubscriptionModal}
        toggleCancelModal={toggleCancelModal}
      />

      <CancelSubModal
        cancelSubModal={cancelSubModal}
        setCancelSubModal={setCancelSubModal}
        toggleCancelModal={toggleCancelModal}
        toggleCancelRenewal={toggleCancelRenewal}
      />
      <CancelRenewalModal
        canceledRenewal={canceledRenewal}
        setCanceledRenewal={setCanceledRenewal}
      />

      <CertificateModal
        certificate={certificate}
        toggleCertificate={toggleCertificate}
        name={user.name}
      />
    </>
  )
}

export default UserDetails
