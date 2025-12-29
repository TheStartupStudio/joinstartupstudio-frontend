import React, { useState, useEffect, useRef } from 'react'
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
import spark from '../../assets/images/academy-icons/svg/spark.svg'
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
import CustomBirthDateCalendar from '../CustomBirthDateCalendar'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

function EditUserModal({ isOpen, toggle, subToggle }) {
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [resetPasswordDisabled, setResetPasswordDisabled] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [editorImage, setEditorImage] = useState(null)
  const [scale, setScale] = useState(1)
  const [rotate, setRotate] = useState(0)
  const editorRef = React.useRef(null)

  // Demographics states
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const calendarRef = useRef(null)

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
    profile_image: user?.profile_image || '',
    city: user?.city || '',
    state: user?.state || '',
    gender: user?.gender || '',
    birthDate: user?.birthDate ? new Date(user.birthDate) : null
  })

  const [changedMedias, setChangedMedias] = useState({
    facebook: user?.social_links?.facebook || '',
    twitter: user?.social_links?.twitter || '',
    website: user?.social_links?.website || '',
    instagram: user?.social_links?.instagram || '',
    linkedIn: user?.social_links?.linkedIn || ''
  })

  const dispatch = useDispatch()

  // Dropdown options
  const genderOptions = ['Female', 'Male', 'Non-binary', 'Other']
  
  const stateOptions = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
    'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'
  ]

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (validateFile(selectedFile)) {
      setEditorImage(selectedFile);
      dispatch(setImageCropperData(true));
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

  const handleBirthDateChange = (date) => {
    setChangedUser((prevData) => ({
      ...prevData,
      birthDate: date
    }))
    setShowCalendar(false)
  }

  const handleDropdownSelect = (field, value) => {
    setChangedUser(prev => ({
      ...prev,
      [field]: value
    }))
    setShowGenderDropdown(false)
    setShowStateDropdown(false)
  }

  const handleInputFocus = (inputId) => {
    const inputElement = document.getElementById(inputId)
    if (inputElement) {
      inputElement.focus()
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowCropper(false)
      setEditorImage(null)
      setScale(1)
      setRotate(0)
      setShowStateDropdown(false)
      setShowGenderDropdown(false)
      setShowCalendar(false)
      // Clean up Redux state
      dispatch(setImageCropperData(null))
      dispatch(setCroppedImage(null))
    }
  }, [isOpen])

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

  // Validate demographics for students only
  if (user?.role_id === 1) {
    if (!changedUser.address?.trim()) {
      toast.error('Address is required')
      return
    }
    if (!changedUser.city?.trim()) {
      toast.error('City is required')
      return
    }
    if (!changedUser.state) {
      toast.error('State is required')
      return
    }
    if (!changedUser.gender) {
      toast.error('Gender is required')
      return
    }
    if (!changedUser.birthDate) {
      toast.error('Birth date is required')
      return
    } else {
      const today = new Date()
      const selectedDate = new Date(changedUser.birthDate)
      
      if (selectedDate > today) {
        toast.error('Birth date cannot be in the future')
        return
      }
    }
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
        // Update local state with new image URL
        setChangedUser(prev => ({ ...prev, profile_image: profileImageUrl }))
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

    // Add demographics fields for students - FIXED: Convert Date to ISO string
    if (user?.role_id === 1) {
      params.city = changedUser.city
      params.state = changedUser.state
      params.gender = changedUser.gender
      // Convert Date object to ISO string format (YYYY-MM-DD)
      params.birthDate = changedUser.birthDate 
        ? (changedUser.birthDate instanceof Date 
            ? changedUser.birthDate.toISOString().split('T')[0]
            : changedUser.birthDate)
        : null
    }

    const res = await axiosInstance.put('/users', params)

    setLoading(false)
    const storedUser = JSON.parse(localStorage.getItem('user'))
    const userProfession = storedUser ? storedUser.user?.profession : null

    if (storedUser.email !== changedUser.email) {
      dispatch(setEmail(changedUser.email))
    }

    if (localStorage.getItem('name') !== res.data.name) {
      localStorage.setItem('name', res.data.name)
      dispatch(userUpdate(res.data.name))
    }

    if (userProfession !== res.data.profession) {
      const updatedUser = {
        ...storedUser,
        user: {
          ...storedUser.user,
          profession: res.data.profession
        }
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      dispatch(userUpdateProfession(res.data.profession))
    }

    if (storedUser.user.bio !== res.data.bio) {
      dispatch(setBio(res.data.bio))
    }

    toast.success(<IntlMessages id='alert.my_account.success_change' />)
    dispatch(editSocialMedia(params.social_links))
    
    // Reset image file state
    setImageFile(null)
    
    // Close the modal after successful save
    toggle()
  } catch (err) {
    console.error('Error updating user:', err)
    const errorMessage = err.response?.data?.error || err.response?.data?.message
    toast.error(errorMessage || <IntlMessages id='alerts.something_went_wrong' />)
    setLoading(false)
  }
}

  function handleSubmit(e) {
    e.preventDefault()
    editUser(changedUser, changedMedias, imageFile)
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setResetPasswordDisabled(true);
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
      setResetPasswordDisabled(false);
    }
  }

  useEffect(() => {
    if (general.croppedImage) {
      setImageFile(general.croppedImage)
      setShowCropper(false)
      dispatch(setCroppedImage(null))
      dispatch(setImageCropperData(null))
    }
  }, [general.croppedImage])

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
        // Clean up Redux state to prevent modal reopening
        dispatch(setImageCropperData(null))
      }, 'image/png')
    }
  }

  const isStudent = user?.role_id === 1

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        toggle={toggle}
        keyboard={false}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalBody>
          <img src={userIcon} alt='user' className='mb-3' />
          <div className='d-flex justify-content-between align-items-center'>
            <h3 className='fs-14' style={{ marginBottom: '0' }}>
                {user?.role_id === 3 ? 'Edit Admin Details' : 'Edit Personal Details'}
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

                  {user?.role_id !== 3 && !isStudent && (
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
                  )}
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
                          // Reset file input to allow selecting the same file again
                          const fileInput = document.getElementById('fileInput');
                          if (fileInput) fileInput.value = '';
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

            {/* Demographics Section - Only for Students */}
            {isStudent && (
              <>
                <div className="mt-5">
                  <div className="d-flex align-items-center gap-2 mb-3" style={{background: 'rgba(227, 229, 233, 0.50)', padding: '4px'}}>
                    <img src={spark} alt="Spark Icon" style={{ width: '20px', height: '20px' }} />
                    <h4 className='fs-15 mb-0'>Demographics</h4>
                  </div>

                  {/* Address */}
                  <div className="mb-3" style={{ position: 'relative' }}>
                    <div 
                      style={{
                        borderRadius: '12px',
                        border: 'none',
                        padding: '1rem 0.625rem 0.625rem',
                        boxShadow: '0px 3px 6px #00000029',
                        background: '#ffffff',
                        cursor: 'pointer'
                      }}
                      onClick={() => !loading && handleInputFocus('student-address')}
                    >
                      <input
                        type="text"
                        value={changedUser.address}
                        onChange={(e) => !loading && setChangedUser({ ...changedUser, address: e.target.value })}
                        className="form-input"
                        placeholder=" "
                        id="student-address"
                        disabled={loading}
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          fontSize: '14px',
                          fontFamily: 'Montserrat',
                          background: 'transparent'
                        }}
                      />
                      <label 
                        style={{
                          position: 'absolute',
                          top: changedUser.address ? '4px' : '50%',
                          left: '14px',
                          fontSize: changedUser.address ? '12px' : '14px',
                          color: '#6F6F6F',
                          transition: 'all 0.2s',
                          pointerEvents: 'none',
                          transform: changedUser.address ? 'translateY(0)' : 'translateY(-50%)',
                          fontFamily: 'Montserrat'
                        }}
                      >
                        Address
                      </label>
                      {!loading && (
                        <FontAwesomeIcon 
                          icon={faPencilAlt} 
                          style={{
                            position: 'absolute',
                            right: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#6F6F6F',
                            fontSize: '14px'
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* City and State Row */}
                  <div className="d-flex gap-2 mb-3">
                    {/* City */}
                    <div style={{ flex: 1, position: 'relative' }}>
                      <div 
                        style={{
                          borderRadius: '12px',
                          border: 'none',
                          padding: '1rem 0.625rem 0.625rem',
                          boxShadow: '0px 3px 6px #00000029',
                          background: '#ffffff',
                          cursor: 'pointer'
                        }}
                        onClick={() => !loading && handleInputFocus('student-city')}
                      >
                        <input
                          type="text"
                          value={changedUser.city}
                          onChange={(e) => !loading && setChangedUser({ ...changedUser, city: e.target.value })}
                          className="form-input"
                          placeholder=" "
                          id="student-city"
                          disabled={loading}
                          style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            fontFamily: 'Montserrat',
                            background: 'transparent'
                          }}
                        />
                        <label 
                          style={{
                            position: 'absolute',
                            top: changedUser.city ? '4px' : '50%',
                            left: '14px',
                            fontSize: changedUser.city ? '12px' : '14px',
                            color: '#6F6F6F',
                            transition: 'all 0.2s',
                            pointerEvents: 'none',
                            transform: changedUser.city ? 'translateY(0)' : 'translateY(-50%)',
                            fontFamily: 'Montserrat'
                          }}
                        >
                          City
                        </label>
                        {!loading && (
                          <FontAwesomeIcon 
                            icon={faPencilAlt} 
                            style={{
                              position: 'absolute',
                              right: '14px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#6F6F6F',
                              fontSize: '14px'
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* State */}
                    <div style={{ flex: 1, position: 'relative' }}>
                      <div
                        style={{
                          borderRadius: '12px',
                          border: 'none',
                          padding: '1rem 0.625rem 0.625rem',
                          boxShadow: '0px 3px 6px #00000029',
                          background: '#ffffff',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        onClick={() => !loading && setShowStateDropdown(!showStateDropdown)}
                      >
                        <label 
                          style={{
                            position: 'absolute',
                            top: '4px',
                            left: '14px',
                            fontSize: '12px',
                            color: '#6F6F6F',
                            fontFamily: 'Montserrat'
                          }}
                        >
                          State
                        </label>
                        <span style={{
                          fontSize: '14px',
                          fontFamily: 'Montserrat',
                          color: changedUser.state ? '#000' : '#6F6F6F',
                          display: 'block',
                        }}>
                          {changedUser.state || ''}
                        </span>
                        <svg 
                          width="12" 
                          height="8" 
                          viewBox="0 0 12 8" 
                          fill="none"
                          style={{
                            position: 'absolute',
                            right: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        >
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      {showStateDropdown && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '4px',
                          maxHeight: '200px',
                          overflowY: 'auto',
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                          zIndex: 1000
                        }}>
                          {stateOptions.map((state, index) => (
                            <div
                              key={index}
                              style={{
                                padding: '10px 14px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontFamily: 'Montserrat',
                              }}
                              onClick={() => handleDropdownSelect('state', state)}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              {state}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gender and Birth Date Row */}
                  <div className="d-flex gap-2 mb-3">
                    {/* Gender */}
                    <div style={{ flex: 1, position: 'relative' }}>
                      <div
                        style={{
                          borderRadius: '12px',
                          border: 'none',
                          padding: '1rem 0.625rem 0.625rem',
                          boxShadow: '0px 3px 6px #00000029',
                          background: '#ffffff',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        onClick={() => !loading && setShowGenderDropdown(!showGenderDropdown)}
                      >
                        <label 
                          style={{
                            position: 'absolute',
                            top: '8px',
                            left: '14px',
                            fontSize: '12px',
                            color: '#6F6F6F',
                            fontFamily: 'Montserrat'
                          }}
                        >
                          Gender
                        </label>
                        <span style={{
                          fontSize: '14px',
                          fontFamily: 'Montserrat',
                          color: changedUser.gender ? '#000' : '#6F6F6F',
                          display: 'block',
                          paddingTop: '8px'
                        }}>
                          {changedUser.gender || ''}
                        </span>
                        <svg 
                          width="12" 
                          height="8" 
                          viewBox="0 0 12 8" 
                          fill="none"
                          style={{
                            position: 'absolute',
                            right: '14px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        >
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      {showGenderDropdown && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '4px',
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                          zIndex: 1000
                        }}>
                          {genderOptions.map((gender, index) => (
                            <div
                              key={index}
                              style={{
                                padding: '10px 14px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontFamily: 'Montserrat',
                              }}
                              onClick={() => handleDropdownSelect('gender', gender)}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              {gender}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Birth Date */}
                    <div style={{ flex: 1, position: 'relative' }} ref={calendarRef}>
                      <div 
                        style={{
                          borderRadius: '12px',
                          border: 'none',
                          padding: '0.425rem 0.625rem 0.3rem 0.625rem',
                          boxShadow: '0px 3px 6px #00000029',
                          background: '#ffffff',
                          cursor: 'pointer'
                        }}
                        onClick={() => !loading && setShowCalendar(!showCalendar)}
                      >
                        <div className='d-flex align-items-center justify-content-between'>
                          <div className='d-flex align-items-center gap-2 w-100'>
                            <FaRegCalendarAlt 
                              style={{ 
                                color: '#6F6F6F', 
                                fontSize: '18px',
                                marginLeft: '4px'
                              }} 
                            />
                            <div style={{ flex: 1 }}>
                              <label 
                                style={{
                                  fontSize: '12px',
                                  color: '#6F6F6F',
                                  display: 'block',
                                  fontFamily: 'Montserrat'
                                }}
                              >
                                Birth Date
                              </label>
                              <span style={{
                                fontSize: '14px',
                                fontFamily: 'Montserrat',
                                color: changedUser.birthDate ? '#000' : '#6F6F6F'
                              }}>
                                {changedUser.birthDate
                                  ? changedUser.birthDate.toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })
                                  : ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {showCalendar && (
                        <div 
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '8px',
                            zIndex: 1000,
                            background: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
                          }}
                        >
                          <CustomBirthDateCalendar
                            selectedDate={changedUser.birthDate}
                            onDateChange={handleBirthDateChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Only show Social Media Profiles for non-instructor users */}
            {user?.role_id !== 2 && (
              <div className='mt-5'>
                 <div className="d-flex align-items-center gap-2 mb-3" style={{background: 'rgba(227, 229, 233, 0.50)', padding: '4px'}}>
                    <img src={spark} alt="Spark Icon" style={{ width: '20px', height: '20px' }} />
                    <h4 className='fs-15 mb-0'>Social Media Profiles</h4>
                  </div>
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
              </div>
            )}

            <div className='mt-5'>
                  <div className="d-flex align-items-center gap-2 mb-3" style={{background: 'rgba(227, 229, 233, 0.50)', padding: '4px'}}>
                    <img src={spark} alt="Spark Icon" style={{ width: '20px', height: '20px' }} />
                    <h4 className='fs-15 mb-0'>Personal Bio</h4>
                  </div>
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
                  {loading ? 'SAVING...' : 'SAVE'}
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
                    // Clean up Redux state
                    dispatch(setImageCropperData(null));
                    // Reset file input
                    const fileInput = document.getElementById('fileInput');
                    if (fileInput) fileInput.value = '';
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
