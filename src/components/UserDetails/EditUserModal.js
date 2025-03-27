import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
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
import { userUpdate, userUpdateProfileImage } from '../../redux'
import {
  editSocialMedia,
  setEmail,
  userUpdateProfession
} from '../../redux/user/Actions'
import axiosInstance from '../../utils/AxiosInstance'
import { validateEmail } from '../../utils/helpers'
import IntlMessages from '../../utils/IntlMessages'
import ModalInput from '../ModalInput/ModalInput'

function EditUserModal({ isOpen, toggle, subToggle }) {
  const [editPage, setEditPage] = useState(false)

  const { user } = useSelector((state) => state.user.user)
  const profileImage = useSelector((state) => state.user.profile_image)
  console.log('ridon29', user)

  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()

  const [changedUser, setChangedUser] = useState({
    name: user.name || '',
    email: user.email || '',
    bio: user.bio || '',
    profession: user.profession || '',
    profile_image: user.profile_image || ''
  })

  const [changedMedias, setChangedMedias] = useState({
    facebook: user.social_links?.facebook || '',
    twitter: user.social_links?.twitter || '',
    website: user.social_links?.website || '',
    instagram: user.social_links?.instagram || '',
    linkedIn: user.social_links?.linkedIn || ''
  })

  const editUser = async (changedUser, changedMedias) => {
    if (!changedUser?.name) {
      console.error('User data is missing. Cannot proceed.')
      return
    }
    console.log(changedUser, 'leart56')
    setLoading(true)
    const params = {
      name: changedUser.name,
      bio: changedUser.bio,
      profession: changedUser.profession,
      social_links: changedMedias,
      profile_image: changedUser.profile_image,
      language: changedUser.language,
      phone_number: changedUser.phone_number,
      email: changedUser.email
    }

    // if (user.email !== changedUser.email) {
    //   console.log('ridon70')
    //   if (!changedUser.email || changedUser.email === '') {
    //     console.log('ridon71', changedUser.email)
    //     toast.error(<IntlMessages id='alerts.email_required' />)
    //   } else if (!validateEmail(changedUser.email)) {
    //     console.log('ridon74', changedUser.email)
    //     toast.error(<IntlMessages id='alerts.valid_email' />)
    //   } else {
    //     try {
    //       await axiosInstance.put(`/users/change-email`, {
    //         new_email: changedUser.email
    //       })

    //       toast.success('Your email has been changed successfully')
    //       // setUser(res.data)

    //       const storageUser = JSON.parse(localStorage.getItem('user'))
    //       const userObject = {
    //         token: localStorage.getItem('access_token'),
    //         user: {
    //           ...storageUser.user,
    //           email: changedUser.email
    //         }
    //       }
    //       dispatch(setEmail(changedUser.email))
    //       localStorage.setItem('user', JSON.stringify(userObject))
    //     } catch (err) {
    //       setLoading(false)
    //       console.log('ridon96')
    //       toast.error(err.response?.data || 'An error occurred')
    //     }
    //   }
    // }

    await axiosInstance
      .put(`/users`, params)
      .then((res) => {
        setLoading(false)
        const user = JSON.parse(localStorage.getItem('user'))
        const userProfession = user ? user.user?.profession : null

        if (userProfession !== res.data.profession) {
          const updatedUser = {
            ...user,
            profession: res.data.profession
          }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          dispatch(userUpdateProfession(res.data.profession))
        }

        if (user.email !== changedUser.email) {
          if (!changedUser.email || changedUser.email === '') {
            toast.error(<IntlMessages id='alerts.email_required' />)
          } else if (!validateEmail(changedUser.email)) {
            toast.error(<IntlMessages id='alerts.valid_email' />)
          } else {
            dispatch(setEmail(changedUser.email))
          }
        }

        if (localStorage.getItem('name') !== res.data.name) {
          localStorage.setItem('name', res.data.name)
          dispatch(userUpdate(res.data.name))
        }

        if (profileImage !== res.data.profile_image) {
          localStorage.setItem('profileImage', res.data.profile_image)
          dispatch(userUpdateProfileImage(res.data.profile_image))
        }

        toast.success(<IntlMessages id='alert.my_account.success_change' />)
        dispatch(editSocialMedia(params.social_links))
      })
      .catch((err) => {
        toast.error(<IntlMessages id='alerts.something_went_wrong' />)
        setLoading(false)
      })
  }

  function handleSubmit(e) {
    e.preventDefault()
    editUser(changedUser, changedMedias)
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
              <img src={resetLogo} alt='reset' />
              <h3 className='fs-15' style={{ marginBottom: '0' }}>
                Reset Password
              </h3>
            </div>
          </div>

          <form>
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
                  <img
                    className='trash-icon align-self-end'
                    src={trashIcon}
                    alt='trash'
                  />
                  <img
                    className='rounded-circle profile-container-pic'
                    src={user?.profileImage}
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
                <button
                  className='modal-save-btn'
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
