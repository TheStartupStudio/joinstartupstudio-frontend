import React from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button, Modal, ModalBody } from 'reactstrap'
import creditCard from '../../assets/images/academy-icons/credit-card.png'
import facebookLogo from '../../assets/images/academy-icons/facebook.png'
import instaLogo from '../../assets/images/academy-icons/instagram.png'
import browserLogo from '../../assets/images/academy-icons/internet.png'
import linkedinLogo from '../../assets/images/academy-icons/linkedin.png'
import userIcon from '../../assets/images/academy-icons/profile-icon.png'
import resetLogo from '../../assets/images/academy-icons/reset.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import trashIcon from '../../assets/images/academy-icons/trash.png'
import twitterLogo from '../../assets/images/academy-icons/twitter.png'
import ModalInput from '../ModalInput/ModalInput'

function EditUserModal({
  isOpen,
  toggle,
  content,
  setContent,
  subToggle,
  profilePic
}) {
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle}>
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
    </>
  )
}

export default EditUserModal
