import React, { useState, useEffect } from 'react'
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
import ImageCropper from '../ImageCropper'
import AvatarEditor from 'react-avatar-editor'
import { setImageCropperData, setCroppedImage } from '../../redux'

function EditUserModal({ isOpen, toggle, subToggle }) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [resetPasswordDisabled, setResetPasswordDisabled] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [editorImage, setEditorImage] = useState(null)
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const editorRef = React.useRef(null)

  // Add null check for user state
  const userState = useSelector((state) => state.user?.user) || {}
  const user = userState?.user || {}
  const general = useSelector((state) => state.general)
  
  const [changedUser, setChangedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profession: user?.profession || '',
    address: user?.address || '',
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
  const selectedFile = event.target.files[0];
  if (validateFile(selectedFile)) {
    setEditorImage(selectedFile);
    dispatch(setImageCropperData(true)); // triggers cropper
  }
};


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
    const maxSize = 10 * 1024 * 1024
    console.log('file:', file)
    if (!validTypes.includes(file.type)) {
      toast.error('Only PNG, JPG, or JPEG files are allowed.')
      return false
    }
    if (file.size > maxSize) {
      toast.error('Image file size is to large.')
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
        address: changedUser.address,
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
      console.log('social links:', params.social_links)
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

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setResetPasswordDisabled(true); // Disable button at start
    setLoading(true);
    
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userEmail = storedUser?.user?.email;

    try {
      if (!userEmail) {
        toast.error(<IntlMessages id='alerts.email_required' />);
        return;
      }
      
      if (!validateEmail(userEmail)) {
        toast.error(<IntlMessages id='alerts.email_not_valid' />);
        return;
      }

      const res = await axiosInstance.post('/check-email', {
        email: userEmail
      });

      if (res.data.exists) {
        await axiosInstance
          .post('/auth/forgot-password', {
            email: userEmail
          })
          .then(() => {
            toast.success(<IntlMessages id='alert.check_email_redirect' />);
          })
          .catch((error) => {
            toast.error(
              error.response.data.message || (
                <IntlMessages id='alerts.something_went_wrong' />
              )
            );
          });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(<IntlMessages id='alerts.something_went_wrong' />);
    } finally {
      setLoading(false);
      setResetPasswordDisabled(false); // Re-enable button after completion
    }
  }

  // After cropping, set the cropped image as imageFile
  useEffect(() => {
    if (general.croppedImage) {
      setImageFile(general.croppedImage)
      setShowCropper(false)
      dispatch(setCroppedImage(null))
      dispatch(setImageCropperData(null))
    }
  }, [general.croppedImage])

  // Show cropper only when imageCropperData is set
  useEffect(() => {
    if (general.imageCropperData) {
      setShowCropper(true)
    }
  }, [general.imageCropperData])

  const handleCropSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas()
      canvas.toBlob((blob) => {
        const file = new File([blob], editorImage.name || 'avatar.png', { type: 'image/png' })
        setImageFile(file)
        setShowCropper(false)
        setEditorImage(null)
        setScale(1)
        setRotate(0)
      }, 'image/png')
    }
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
            <div 
  className={`d-flex gap-2 reset-pass-btn ${resetPasswordDisabled ? 'disabled' : ''}`} 
  onClick={!resetPasswordDisabled ? handlePasswordChange : undefined}
  style={{ cursor: resetPasswordDisabled ? 'not-allowed' : 'pointer' }}
>
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
                  <ModalInput
                    id={'address'}
                    labelTitle={'Address EX: San Francisco, USA'}
                    imgSrc={penIcon}
                    value={changedUser.address}
                    onChange={(e) =>
                      setChangedUser({
                        ...changedUser,
                        address: e.target.value
                      })
                    }
                    name='address'
                  />
                </div>
              </div>
              <div>
                <h4 className='fs-15'>Headshot</h4>
                <div className='d-flex flex-column p-3 gap-2 profile-container align-items-center'>
  {(imageFile || changedUser.profile_image) ? (
    <>
      <img
        className='trash-icon align-self-end cursor-pointer'
        src={trashIcon}
        alt='trash'
        onClick={() => {
          setChangedUser({ ...changedUser, profile_image: '' });
          setImageFile(null);
        }}
      />
      <img
        className='rounded-circle profile-container-pic'
        src={
          imageFile
            ? URL.createObjectURL(imageFile)
            : changedUser.profile_image
        }
        alt='profile'
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'cover',
          borderRadius: '50%'
        }}
      />
    </>
  ) : (
    <div
      className='upload-box text-center cursor-pointer'
      onClick={() => document.getElementById('fileInput').click()}
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
        <img
          src={uploadImage}
          alt='Upload Icon'
          className='upload-icon'
        />
        <p className='upload-text'>
          <span className='fw-medium'>Click to upload</span>
          <br />
          <span className='text-secondary'>or drag and drop</span>
        </p>
        <p className='fs-14'>
          Only png, jpg, or jpeg file format supported (max. 10Mb)
        </p>
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

          {showCropper && (
  <div className="cropper-modal" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <div style={{
      backgroundColor: '#fff',
      padding: '24px',
      borderRadius: '8px',
      textAlign: 'center',
      maxWidth: '90%',
      width: '360px'
    }}>
      <h4>Crop Your Profile Picture</h4>
      <AvatarEditor
        ref={editorRef}
        image={editorImage}
        width={200}
        height={200}
        border={50}
        borderRadius={100}
        color={[255, 255, 255, 0.8]}
        scale={scale}
        rotate={rotate}
        style={{ backgroundColor: '#f5f5f5' }}
      />
      <div className='mt-3 d-flex'>
        <label>
          Zoom:
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
          />
        </label>
        <label >
        Rotate:
        <input
          type="range"
          min="0"
          max="180"
          step="1"
          value={rotate}
          onChange={e => setRotate(parseInt(e.target.value, 10))}
        />
      </label>
      </div>
      <div className='mt-3 d-flex justify-content-center gap-3'>
        <Button onClick={handleCropSave} color="primary">Save</Button>
        <Button onClick={() => {
          setShowCropper(false);
          setEditorImage(null);
          setScale(1);
          setRotate(0);
        }} color="secondary">Cancel</Button>
      </div>
    </div>
  </div>
)}

        </ModalBody>
      </Modal>
    </>
  )
}

export default EditUserModal
