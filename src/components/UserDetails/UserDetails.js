import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap'
import tickLogo from '../../assets/images/academy-icons/blue-tick.png'
import cancelRenewal from '../../assets/images/academy-icons/cancel-renewal.png'
import creditCard from '../../assets/images/academy-icons/credit-card.png'
import facebookLogo from '../../assets/images/academy-icons/facebook.png'
import instaLogo from '../../assets/images/academy-icons/instagram.png'
import browserLogo from '../../assets/images/academy-icons/internet.png'
import linkedinLogo from '../../assets/images/academy-icons/linkedin.png'
import penIcon from '../../assets/images/academy-icons/pen-icon.png'
import userIcon from '../../assets/images/academy-icons/profile-icon.png'
import resetLogo from '../../assets/images/academy-icons/reset.png'
import trashIcon from '../../assets/images/academy-icons/trash.png'
import twitterLogo from '../../assets/images/academy-icons/twitter.png'
import ModalInput from '../ModalInput/ModalInput'
import CancelRenewalModal from './CancelRenewalModal'
import CancelSubModal from './CancelSubModal'
import leftArrow from '../../assets/images/academy-icons/left-arrow.png'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import save from '../../assets/images/academy-icons/save.png'
import print from '../../assets/images/academy-icons/print.png'
import courseLogoXL from '../../assets/images/academy-icons/academy-logo-group.png'
import signature from '../../assets/images/academy-icons/sign.png'

function UserDetails({ profilePic, userName, userProffesion }) {
  const [modal, setModal] = useState(false)
  const [subsbsciptionModal, setSubscriptionModal] = useState(false)
  const [cancelSubModal, setCancelSubModal] = useState(false)
  const [canceledRenewal, setCanceledRenewal] = useState(false)
  const [certificate, setCertificate] = useState(false)
  const [content, setContent] = useState('')

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
            src={profilePic}
            alt='profile'
          />
          <div className='academy-profile-info'>
            <h3>{userName}</h3>
            <p>{userProffesion}</p>
            <div className='d-flex gap-2'>
              <img src={linkedinLogo} alt='linkedin' />
              <img src={facebookLogo} alt='facebook' />
              <img src={twitterLogo} alt='twitter' />
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

      <Modal isOpen={modal} toggle={toggle}>
        <ModalBody>
          <img src={userIcon} alt='user' className='mb-3' />
          <div className='d-flex justify-content-between align-items-center'>
            <h3 className='fs-14' style={{ marginBottom: '0' }}>
              Edit Personal Details
            </h3>
            <div className='d-flex gap-2'>
              <img src={resetLogo} alt='reset' />
              <h3 className='fs-15' style={{ marginBottom: '0' }}>
                Reset Password
              </h3>
            </div>
          </div>

          <form action=''>
            <div
              className='mt-5 d-grid gap-5'
              style={{ gridTemplateColumns: '4fr 2fr' }}
            >
              <div>
                <h4 className='fs-15'>Personal Details</h4>
                <div className='d-flex flex-column gap-3'>
                  <ModalInput
                    id={'fullname'}
                    labelTitle={'Full Name'}
                    imgSrc={penIcon}
                  />
                  <ModalInput
                    id={'email'}
                    labelTitle={'Email'}
                    imgSrc={penIcon}
                  />
                  <ModalInput
                    id={'occupation'}
                    labelTitle={'Occupation'}
                    imgSrc={penIcon}
                  />
                </div>
              </div>
              <div>
                <h4 className='fs-15'>Headshot</h4>
                <div className='d-flex flex-column p-3 gap-2 profile-container align-items-center'>
                  <img
                    className='trash-icon align-self-end'
                    src={trashIcon}
                    alt='trash'
                  />
                  <img
                    className='rounded-circle profile-container-pic'
                    src={profilePic}
                    alt='profile'
                  />
                </div>
              </div>
            </div>

            <div className='mt-5'>
              <h4 className='fs-15'>Social Media Profiles</h4>
              <div className='d-flex flex-column gap-3'>
                <ModalInput
                  id={'linkedin'}
                  labelTitle={'LinkedIn'}
                  imgSrc={linkedinLogo}
                />
                <ModalInput
                  id={'facebook'}
                  labelTitle={'Facebook'}
                  imgSrc={facebookLogo}
                />
                <ModalInput
                  id={'twitter'}
                  labelTitle={'X (Twitter)'}
                  imgSrc={twitterLogo}
                />
                <ModalInput
                  id={'instagram'}
                  labelTitle={'Instagram'}
                  imgSrc={instaLogo}
                />
                <ModalInput
                  id={'website'}
                  labelTitle={'Website'}
                  imgSrc={browserLogo}
                />
              </div>

              <div className='mt-5'>
                <h4 className='fs-15'>Personal Bio</h4>
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ align: [] }],
                      ['link', 'image']
                    ]
                  }}
                />
              </div>
            </div>
            <div className='d-flex justify-content-between mt-3 ms-2'>
              <div
                className='d-flex align-items-center gap-2 cursor-pointer'
                onClick={subToggle}
              >
                <img src={creditCard} alt='credit-card' />
                <p className='mb-0 fs-15 fw-medium'>
                  Manage Subscription & Billing
                </p>
              </div>
              <div className='d-flex gap-3'>
                <Button className='close-btn' onClick={toggle}>
                  CANCEL
                </Button>
                <button className='modal-save-btn'>SAVE</button>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>

      <Modal
        isOpen={subsbsciptionModal}
        toggle={() => setSubscriptionModal((prev) => !prev)}
        size='sm'
        style={{ maxWidth: '600px', width: '100%' }}
      >
        <ModalBody>
          <img
            className='modal-credit rounded-circle p-2 mb-2'
            src={creditCard}
            alt='Credit'
          />
          <p className='mb-0 fs-15 fw-medium'>Manage Subscription & Billing</p>

          <form>
            <div className='mt-5'>
              <h4 className='fs-15'>Card Information</h4>
              <div className='d-flex flex-column gap-3'>
                <ModalInput
                  id={'creditCardName'}
                  labelTitle={'Name on Credit Card'}
                  imgSrc={penIcon}
                />
                <ModalInput
                  id={'cardNumber'}
                  labelTitle={'Card Number'}
                  imgSrc={penIcon}
                />
                <div
                  className='d-grid gap-2'
                  style={{ gridTemplateColumns: '2fr 1fr 2fr' }}
                >
                  <ModalInput
                    id={'expiration'}
                    labelTitle={'Expiration (MM/YY)'}
                    imgSrc={penIcon}
                  />
                  <ModalInput id={'CVC'} labelTitle={'CVC'} imgSrc={penIcon} />
                  <ModalInput
                    id={'zipCode'}
                    labelTitle={'Zip Code'}
                    imgSrc={penIcon}
                  />
                </div>
              </div>
            </div>
            <div className='mt-5'>
              <h4 className='fs-15'>Billing Adress</h4>
              <div className='d-flex flex-column gap-3'>
                <ModalInput
                  id={'address'}
                  labelTitle={'Address'}
                  imgSrc={penIcon}
                />
                <div
                  className='d-grid gap-2'
                  style={{ gridTemplateColumns: '2fr 1fr 2fr' }}
                >
                  <ModalInput
                    id={'city'}
                    labelTitle={'City'}
                    imgSrc={penIcon}
                  />
                  <ModalInput
                    id={'state'}
                    labelTitle={'State'}
                    imgSrc={penIcon}
                  />
                  <ModalInput
                    id={'zipCode2'}
                    labelTitle={'Zip Code'}
                    imgSrc={penIcon}
                  />
                </div>
              </div>
            </div>
            <div className='d-flex gap-3 justify-content-center mt-5'>
              <Button
                className='close-btn'
                onClick={() => setSubscriptionModal((prev) => !prev)}
              >
                CANCEL
              </Button>
              <button className='modal-save-btn'>SAVE</button>
            </div>
          </form>
          <div
            className='d-flex align-items-center justify-content-center gap-2 cursor-pointer mt-5'
            onClick={toggleCancelModal}
          >
            <img src={cancelRenewal} alt='credit-card' />
            <p className='mb-0 fs-15 fw-medium'>Cancel Subscription</p>
          </div>
        </ModalBody>
      </Modal>

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

      <Modal
        isOpen={certificate}
        toggle={toggleCertificate}
        className='certificate-modal'
        style={{ maxWidth: '1100px' }}
      >
        <span
          className=' cursor-pointer'
          onClick={toggleCertificate}
          style={{ zIndex: '1' }}
        >
          <img className='left-arrow-modal' src={leftArrow} alt='left' />
        </span>
        <ModalBody>
          <img src={courseLogo} alt='logo' />
          <div className='d-flex justify-content-between align-items-center mt-3'>
            <h3 className='fs-14' style={{ marginBottom: '0' }}>
              My Course Certificate
            </h3>
            <div className='d-flex gap-3'>
              <div className='d-flex gap-2 align-items-center'>
                <img src={save} alt='save' />
                <span className='hover-certificate cursor-pointer'>Save</span>
              </div>
              <div className='d-flex gap-2 align-items-center'>
                <img src={print} alt='print' />
                <span className='hover-certificate cursor-pointer'>Print</span>
              </div>
            </div>
          </div>
          <div className='d-flex flex-column align-items-center mt-5 certificate-wrapper'>
            <div className='d-flex gap-3 align-items-center'>
              <img
                src={courseLogoXL}
                alt='academy-logo'
                style={{ width: '250px' }}
              />
              <h1 style={{ fontSize: '47px' }}>
                CERTIFICATE OF <br />
                COMPLETION
              </h1>
            </div>

            <div className='d-flex flex-column align-items-center'>
              <p class='text-center certification-paragraph mt-5 mb-1 fw-medium text-black'>
                This is to certify that
              </p>
              <h2
                class='text-center fw-semibold border-bottom-title'
                style={{ fontSize: '64px' }}
              >
                Kenia Anders
              </h2>
              <p class='text-center certification-paragraph mb-0 fw-medium mt-1 text-black'>
                has succesfully completed
              </p>
              <p class='text-center mb-0 fw-medium certificate-reason mt-2 text-black'>
                The Startup Studio’s
                <br /> Course in Entrepreneurship & Innovation
              </p>
              <p class='text-center certification-paragraph mb-0 fw-medium mt-2 text-black'>
                on the 23rd of October, 2025.
              </p>
              <div className='position-relative'>
                <img
                  className='mt-2 signature-border'
                  src={signature}
                  alt='signature'
                />
                <hr className='position-absolute horizontal-line-sign signature-border-bottom' />
              </div>
              <p class='text-center certification-paragraph mb-0 fw-medium mt-2 text-black'>
                Anastasia Hall
              </p>
              <p class='text-center certification-paragraph mb-0 fw-medium text-black'>
                Director of Human Development
              </p>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default UserDetails
