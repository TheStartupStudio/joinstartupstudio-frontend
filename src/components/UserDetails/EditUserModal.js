import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Button, Modal, ModalBody } from 'reactstrap'
import creditCard from '../../assets/images/academy-icons/credit-card.png'
import cancelRenewal from '../../assets/images/academy-icons/cancel-renewal.png'
import facebookLogo from '../../assets/images/academy-icons/facebook.png'
import instaLogo from '../../assets/images/academy-icons/instagram.png'
import browserLogo from '../../assets/images/academy-icons/internet.png'
import linkedinLogo from '../../assets/images/academy-icons/linkedin.png'
import userIcon from '../../assets/images/academy-icons/profile-icon.png'
import resetLogo from '../../assets/images/academy-icons/reset.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import trashIcon from '../../assets/images/academy-icons/trash.png'
import twitterLogo from '../../assets/images/academy-icons/twitter.png'
import uploadImage from '../../assets/images/academy-icons/svg/upload-image.svg'
import { userUpdate, userUpdateProfileImage } from '../../redux'
import {
  editSocialMedia,
  setBio,
  setEmail,
  userUpdateProfession
} from '../../redux/user/Actions'
import axiosInstance from '../../utils/AxiosInstance'
import { validateEmail } from '../../utils/helpers'
import IntlMessages from '../../utils/IntlMessages'
import ModalInput from '../ModalInput/ModalInput'

function EditUserModal({ isOpen, toggle, subToggle }) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const { user } = useSelector((state) => state.user.user)
  const [changedUser, setChangedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profession: user?.profession || '',
    profile_image: user?.profile_image || ''
  })
  const [changedMedias, setChangedMedias] = useState({
    facebook: user?.social_links?.facebook || '',
    twitter: user?.social_links?.twitter || '',
    website: user?.social_links?.website || '',
    instagram: user?.social_links?.instagram || '',
    linkedIn: user?.social_links?.linkedIn || ''
  })

  const dispatch = useDispatch()

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (validateFile(selectedFile)) {
      setImageFile(selectedFile)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (validateFile(droppedFile)) {
      setImageFile(droppedFile)
    }
  }

  const validateFile = (file) => {
    if (!file) return false

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
    const maxSize = 1 * 1024 * 1024
    console.log('file:', file)
    if (!validTypes.includes(file.type)) {
      toast.error('Only PNG, JPG, or JPEG files are allowed.')
      return false
    }
    if (file.size > maxSize) {
      toast.error('File size must be under 2MB.')
      return false
    }
    return true
  }

  const editUser = async (changedUser, changedMedias, imageFile) => {
    if (!changedUser?.name) {
      toast.error(<IntlMessages id='alerts.name_required' />)
      return
    }
    if (!changedUser.email || changedUser.email === '') {
      toast.error(<IntlMessages id='alerts.email_required' />)
      return
    }
    if (!validateEmail(changedUser.email)) {
      toast.error(<IntlMessages id='alerts.valid_email' />)
      return
    }

    setLoading(true)

    try {
      let profileImageUrl = changedUser.profile_image

      if (!profileImageUrl) {
        dispatch(userUpdateProfileImage(profileImageUrl))
      }

      if (imageFile) {
        const formData = new FormData()
        formData.append('img', imageFile)

        const res = await axiosInstance.post('/upload/img', formData)

        if (res.data.success) {
          profileImageUrl = res.data.fileLocation
          dispatch(userUpdateProfileImage(profileImageUrl))
        } else {
          toast.error('Image upload failed')
        }
      }

      const params = {
        name: changedUser.name,
        bio: changedUser.bio,
        profession: changedUser.profession,
        social_links: changedMedias,
        profile_image: profileImageUrl,
        language: changedUser.language,
        phone_number: changedUser.phone_number,
        email: changedUser.email
      }

      const res = await axiosInstance.put('/users', params)

      setLoading(false)
      const user = JSON.parse(localStorage.getItem('user'))
      const userProfession = user ? user.user?.profession : null

      if (user.email !== changedUser.email) {
        dispatch(setEmail(changedUser.email))
      }

      if (localStorage.getItem('name') !== res.data.name) {
        localStorage.setItem('name', res.data.name)
        dispatch(userUpdate(res.data.name))
      }

      if (userProfession !== res.data.profession) {
        const updatedUser = {
          ...user,
          profession: res.data.profession
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        dispatch(userUpdateProfession(res.data.profession))
      }

      // if (profileImageUrl !== res.data.profile_image) {
      //   localStorage.setItem('profileImage', res.data.profile_image)
      //   dispatch(userUpdateProfileImage(res.data.profile_image))
      // }

      if (user.user.bio !== res.data.bio) {
        dispatch(setBio(res.data.bio))
      }

      toast.success(<IntlMessages id='alert.my_account.success_change' />)
      dispatch(editSocialMedia(params.social_links))
    } catch (err) {
      toast.error(<IntlMessages id='alerts.something_went_wrong' />)
      setLoading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    editUser(changedUser, changedMedias, imageFile)
    toggle()
  }

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
              <img src={resetLogo} alt='reset' className='reset-btn-edit' />
              <h3 className='fs-15' style={{ marginBottom: '0' }}>
                Reset Password
              </h3>
            </div>
          </div>

          <form>
            <div className='mt-5 d-grid gap-5 grid-col-4-2 edit-user-modal'>
              <div>
                <h4 className='fs-15'>Personal Details</h4>
                <div className='d-flex flex-column gap-3'>
                  <ModalInput
                    id={'fullname'}
                    labelTitle={'Full Name'}
                    imgSrc={penIcon}
                    value={changedUser.name}
                    onChange={(e) =>
                      setChangedUser({ ...changedUser, name: e.target.value })
                    }
                    name='name'
                  />
                  <ModalInput
                    id={'email'}
                    labelTitle={'Email'}
                    imgSrc={penIcon}
                    value={changedUser.email}
                    onChange={(e) =>
                      setChangedUser({ ...changedUser, email: e.target.value })
                    }
                    name='email'
                  />
                  <ModalInput
                    id={'occupation'}
                    labelTitle={'Occupation'}
                    imgSrc={penIcon}
                    value={changedUser.profession}
                    onChange={(e) =>
                      setChangedUser({
                        ...changedUser,
                        profession: e.target.value
                      })
                    }
                    name='occupation'
                  />
                </div>
              </div>
              <div>
                <h4 className='fs-15'>Headshot</h4>
                <div className='d-flex flex-column p-3 gap-2 profile-container align-items-center'>
                  {changedUser.profile_image ? (
                    <>
                      <img
                        className='trash-icon align-self-end cursor-pointer'
                        src={trashIcon}
                        alt='trash'
                        onClick={() =>
                          setChangedUser({ ...changedUser, profile_image: '' })
                        }
                      />
                      <img
                        className='rounded-circle profile-container-pic'
                        src={user?.profileImage}
                        alt='profile'
                      />
                    </>
                  ) : (
                    <div className='container d-flex justify-content-center align-items-center'>
                      <div
                        className='upload-box text-center cursor-pointer'
                        onClick={() =>
                          document.getElementById('fileInput').click()
                        }
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <input
                          type='file'
                          id='fileInput'
                          className='d-none'
                          accept='image/png, image/jpeg, image/jpg'
                          onChange={handleFileChange}
                        />
                        <div className='upload-area'>
                          {imageFile ? (
                            <img
                              src={URL.createObjectURL(imageFile)}
                              alt='Uploaded Preview'
                              className='uploaded-image'
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <>
                              <img
                                src={uploadImage}
                                alt='Upload Icon'
                                className='upload-icon'
                              />
                              <p className='upload-text'>
                                <span className='fw-medium'>
                                  Click to upload
                                </span>
                                <br />
                                <span className='text-secondary'>
                                  or drag and drop
                                </span>
                              </p>
                              <p className='fs-14'>
                                Only png, jpg, or jpeg file format supported
                                (max. 2Mb)
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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
                  value={changedMedias?.linkedIn}
                  onChange={(e) =>
                    setChangedMedias({
                      ...changedMedias,
                      linkedIn: e.target.value
                    })
                  }
                />
                <ModalInput
                  id={'facebook'}
                  labelTitle={'Facebook'}
                  imgSrc={facebookLogo}
                  value={changedMedias?.facebook}
                  onChange={(e) =>
                    setChangedMedias({
                      ...changedMedias,
                      facebook: e.target.value
                    })
                  }
                />
                <ModalInput
                  id={'twitter'}
                  labelTitle={'X (Twitter)'}
                  imgSrc={twitterLogo}
                  value={changedMedias?.twitter}
                  onChange={(e) =>
                    setChangedMedias({
                      ...changedMedias,
                      twitter: e.target.value
                    })
                  }
                />
                <ModalInput
                  id={'instagram'}
                  labelTitle={'Instagram'}
                  imgSrc={instaLogo}
                  value={changedMedias?.instagram}
                  onChange={(e) =>
                    setChangedMedias({
                      ...changedMedias,
                      instagram: e.target.value
                    })
                  }
                />
                <ModalInput
                  id={'website'}
                  labelTitle={'Website'}
                  imgSrc={browserLogo}
                  value={changedMedias?.website}
                  onChange={(e) =>
                    setChangedMedias({
                      ...changedMedias,
                      website: e.target.value
                    })
                  }
                />
              </div>

              <div className='mt-5'>
                <h4 className='fs-15'>Personal Bio</h4>
                <ReactQuill
                  value={changedUser?.bio}
                  onChange={(content) =>
                    setChangedUser({ ...changedUser, bio: content })
                  }
                  className='text-black'
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
            <div className='d-flex justify-content-between mt-3 ms-2 flex-col-900 gap-05-900'>
              <div
                className='d-flex align-items-center gap-2 cursor-pointer'
                onClick={subToggle}
              >
                <img src={creditCard} alt='credit-card' />
                <p className='mb-0 fs-15 fw-medium'>
                  Manage Subscription & Billing
                </p>
              </div>
              <div className='d-flex gap-3 d-grid-900 grid-col-2-900 grid-col-1-500'>
                <Button className='close-btn w-full-900' onClick={toggle}>
                  CANCEL
                </Button>
                <button
                  className='modal-save-btn w-full-900'
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? '...' : 'SAVE'}
                </button>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  )
}

export default EditUserModal
