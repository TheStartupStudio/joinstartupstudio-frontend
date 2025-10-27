import React, { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import './AddNewLearner.css'
import userIcon from '../../assets/images/academy-icons/svg/user-group-add.svg'
import leftArrow from '../../assets/images/arrowSave/ICON - Click to save@2x.png'
import spark from '../../assets/images/academy-icons/svg/spark.svg'
import UserManagementPopup from '../../components/UserManagment/AlertPopup'

const AddNewLearner = ({ show, onHide, onSuccess, mode = 'add', learnerData = null }) => {
  const [loading, setLoading] = useState(false)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  const [showResetPasswordPopup, setShowResetPasswordPopup] = useState(false)
  const [showDeactivateUserPopup, setShowDeactivateUserPopup] = useState(false)
  const [showMainModal, setShowMainModal] = useState(false)
  const [isUserActive, setIsUserActive] = useState(true)
  
  const [formData, setFormData] = useState({
    learnerName: '',
    email: '',
    password: '',
    address: '',
    city: '',
    state: '',
    gender: '',
    learnerType: '',
    age: ''
  })

  // Sync showMainModal with show prop
  useEffect(() => {
    setShowMainModal(show)
  }, [show])

  // Initialize form data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && learnerData) {
      setFormData({
        learnerName: learnerData.name || '',
        email: learnerData.email || '',
        password: '********',
        address: learnerData.address || '125 N City Street',
        city: learnerData.city || 'Orlando',
        state: learnerData.state || 'Florida',
        gender: learnerData.gender || 'Female',
        learnerType: learnerData.learnerType || 'Student',
        age: learnerData.age || '24'
      })
      setIsUserActive(learnerData.isActive !== false)
    } else {
      setFormData({
        learnerName: '',
        email: '',
        password: '',
        address: '',
        city: '',
        state: '',
        gender: '',
        learnerType: '',
        age: ''
      })
      setIsUserActive(true)
    }
  }, [mode, learnerData, show])

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

  const learnerTypeOptions = ['Student', 'Professional', 'Educator', 'Other']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleInputFocus = (inputId) => {
    const inputElement = document.getElementById(inputId)
    if (inputElement) {
      inputElement.focus()
    }
  }

  const handleDropdownSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setShowGenderDropdown(false)
    setShowStateDropdown(false)
    setShowTypeDropdown(false)
  }

  const handleStatusToggle = () => {
    // Close main modal and show deactivate/activate popup
    setShowMainModal(false)
    setShowDeactivateUserPopup(true)
  }

  const validateForm = () => {
    const { learnerName, email, password, address, city, state, gender, learnerType, age } = formData
    
    if (!learnerName.trim()) {
      toast.error('Learner name is required')
      return false
    }
    
    if (!email.trim()) {
      toast.error('Email is required')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    
    if (!password.trim()) {
      toast.error('Password is required')
      return false
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return false
    }

    if (!address.trim()) {
      toast.error('Address is required')
      return false
    }

    if (!city.trim()) {
      toast.error('City is required')
      return false
    }

    if (!state) {
      toast.error('State is required')
      return false
    }

    if (!gender) {
      toast.error('Gender is required')
      return false
    }

    if (!learnerType) {
      toast.error('Learner type is required')
      return false
    }

    if (!age.trim()) {
      toast.error('Age is required')
      return false
    }

    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      toast.error('Please enter a valid age')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (mode === 'edit') {
        console.log('Updating learner:', formData)
        toast.success('Learner updated successfully!')
      } else {
        console.log('Creating new learner:', formData)
        toast.success('Learner added successfully!')
      }
      
      onSuccess()
      onHide()
      
      if (mode === 'add') {
        setFormData({
          learnerName: '',
          email: '',
          password: '',
          address: '',
          city: '',
          state: '',
          gender: '',
          learnerType: '',
          age: ''
        })
      }
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'adding'} learner:`, error)
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'add'} learner`)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    onHide()
  }

  const handleResetPasswordClick = () => {
    setShowMainModal(false)
    setShowResetPasswordPopup(true)
  }

  const handleResetPasswordCancel = () => {
    setShowResetPasswordPopup(false)
    setShowMainModal(true)
  }

  const handleConfirmResetPassword = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Password reset for learner:', learnerData?.id)
      toast.success('Password has been reset to default (Learntostart1!)')
      setShowResetPasswordPopup(false)
      onHide()
    } catch (error) {
      toast.error('Failed to reset password')
      setShowMainModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLearnerClick = () => {
    setShowMainModal(false)
    setShowDeletePopup(true)
  }

  const handleDeleteCancel = () => {
    setShowDeletePopup(false)
    setShowMainModal(true)
  }

  const handleConfirmDelete = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Deleting learner:', learnerData?.id)
      toast.success('Learner deleted successfully!')
      setShowDeletePopup(false)
      onHide()
      onSuccess()
    } catch (error) {
      toast.error('Failed to delete learner')
      setShowMainModal(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivateUserCancel = () => {
    setShowDeactivateUserPopup(false)
    setShowMainModal(true)
  }

  const handleConfirmDeactivateUser = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const newStatus = !isUserActive
      console.log(`${newStatus ? 'Activating' : 'Deactivating'} learner:`, learnerData?.id)
      toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`)
      setIsUserActive(newStatus)
      setShowDeactivateUserPopup(false)
      setShowMainModal(true)
    } catch (error) {
      toast.error(`Failed to ${isUserActive ? 'deactivate' : 'activate'} user`)
      setShowMainModal(true)
    } finally {
      setLoading(false)
    }
  }

  const isEditMode = mode === 'edit'

  return (
    <>
      <Modal
        show={showMainModal}
        onHide={handleClose}
        backdrop={true}
        keyboard={true}
        className="add-learner-modal"
        centered
      >
        <div className="modal-content-wrapper">
          {/* Header with back arrow */}
          <div className="modal-header-learner">
            <div className="header-icon-circle">
              <img src={userIcon} alt="User" className="header-icon" />
            </div>

            <div className="d-flex justify-content-between align-item-center gap-3 flex-wrap">
              <h3 className="modal-title-learner">
                {isEditMode ? 'Edit Learner' : 'Add New Learner'}
              </h3>

              {isEditMode && (
                <div className='d-flex gap-2 align-items-center'>
                  <h4
                    style={{
                      overflow: 'hidden',
                      color: 'var(--COLORS-Black, #000)',
                      textOverflow: 'ellipsis',
                      fontFamily: 'Montserrat',
                      fontSize: '14px',
                      fontWeight: 500,
                      marginBottom: '0px',
                      marginRight: '20px'
                    }}
                  >Status</h4>

                  <p
                    style={{
                      color: "#000",
                      fontFamily: "Montserrat",
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: "20px",
                      marginBottom: '0px',
                      marginRight: '20px'
                    }}
                  >{isUserActive ? 'Active' : 'Inactive'}</p>

                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={isUserActive}
                      onChange={handleStatusToggle}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="form-section-learner">
            {/* Learner Name */}
            <div className="input-group" onClick={() => !loading && handleInputFocus('learnerName')}>
              <input
                type="text"
                value={formData.learnerName}
                onChange={(e) => !loading && handleInputChange('learnerName', e.target.value)}
                className="form-input"
                placeholder=" "
                id="learnerName"
                disabled={loading}
              />
              <label className="input-label" htmlFor="learnerName">Learner Name</label>
              {!loading && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
            </div>

            <div className="d-flex gap-2">
              {/* Email */}
              <div className="input-group" onClick={() => !loading && handleInputFocus('email')}>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => !loading && handleInputChange('email', e.target.value)}
                  className="form-input"
                  placeholder=" "
                  id="email"
                  disabled={loading}
                />
                <label className="input-label" htmlFor="email">Email</label>
                {!loading && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
              </div>

              {/* Password */}
              <div className="input-group" onClick={() => !loading && handleInputFocus('password')}>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => !loading && handleInputChange('password', e.target.value)}
                  className="form-input"
                  placeholder=" "
                  id="password"
                  disabled={loading}
                />
                <label className="input-label" htmlFor="password">Password: Learntostart1!</label>
                {!loading && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
              </div>
            </div>

            {/* Reset Password Button - Only in Edit Mode */}
            {isEditMode && (
              <div 
                className="d-flex justify-content-end align-items-center gap-2 w-100"
                style={{ cursor: 'pointer' }}
                onClick={handleResetPasswordClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M8.62006 9.18489C10.9541 9.18489 12.834 7.10837 12.834 4.53404C12.834 1.95971 10.9544 0 8.62006 0C6.28575 0 4.39844 2.03748 4.39844 4.54966C4.39844 7.06184 6.28575 9.18489 8.62006 9.18489ZM8.62006 1.29888C10.1915 1.29888 11.4704 2.70643 11.4704 4.53404C11.4704 6.36165 10.1838 7.88601 8.62006 7.88601C7.05633 7.88601 5.76203 6.4238 5.76203 4.54966C5.76203 2.67552 7.04859 1.29888 8.62006 1.29888Z" fill="black"/>
                  <path d="M13.8571 18.4163H2.25698C0.724176 18.4163 0 17.9341 0 16.8919C0 14.271 3.27379 10.5068 8.60473 10.5068C9.78272 10.5068 10.8605 10.6905 11.8244 11.0043C12.0657 11.6783 12.2222 12.2201 12.6825 12.7567C11.5847 12.1898 10.2173 11.8135 8.60473 11.8135C3.97477 11.8135 1.36328 14.9241 1.36328 16.7364C1.36328 17.0162 1.50218 17.1174 1.87958 17.1174H13.8568V18.4163H13.8571Z" fill="black"/>
                  <path d="M16.5615 7.13965C17.3445 7.15152 17.9183 7.73147 18.0451 8.40854C17.9183 7.73147 17.3445 7.1512 16.5615 7.13965Z" fill="#FF7BAC"/>
                  <path d="M15.0199 8.61914C15.014 8.73455 15.0211 8.85121 15.0418 8.96663C15.0208 8.8509 15.0137 8.73455 15.0196 8.61914H15.0199Z" fill="#FF7BAC"/>
                  <path d="M15.8666 10.9048C15.6166 10.6191 15.5761 10.2568 15.6838 9.94792C15.8128 9.5769 16.1549 9.28271 16.6053 9.28927C16.8342 9.2927 17.0347 9.37296 17.1921 9.5007C17.0139 9.05379 16.5422 8.6987 15.9241 8.69058C15.5761 8.68589 15.2739 8.79332 15.0419 8.96634C15.088 9.22025 15.2015 9.46946 15.3945 9.68964C15.4746 9.78115 15.5622 9.85953 15.655 9.92699C15.5622 9.85953 15.4743 9.78115 15.3942 9.68995C15.2015 9.46947 15.088 9.22056 15.0419 8.96634C14.5005 9.37046 14.3431 10.1334 14.8853 10.674C15.1996 10.9876 15.6404 11.1203 16.0621 11.0772C15.9919 11.0301 15.926 10.9729 15.8666 10.9048Z" fill="black"/>
                  <path d="M18.4778 18.0818L18.9056 17.6112L18.3333 16.8154L17.8848 17.362L18.4778 18.0818Z" fill="black"/>
                  <path d="M17.9736 14.5044L18.7281 15.3342L18.906 15.0862L18.1237 14.1006C18.0785 14.1303 18.0318 14.1602 17.9835 14.1912L17.9739 14.5044H17.9736Z" fill="black"/>
                  <path d="M19.9873 9.94503C19.87 8.39194 18.6379 7.07776 17.1132 6.86415C15.8315 6.68332 14.6662 7.15272 13.8783 8.17739C13.3605 8.85009 13.1362 9.69769 13.1959 10.5384C13.2092 10.7249 13.2358 10.9107 13.277 11.094C13.328 11.3226 13.4041 11.5362 13.5006 11.7361C15.8718 13.0631 17.2165 15.2124 17.2165 16.8923C17.2165 17.8873 16.5557 18.3716 15.1612 18.4132L16.7336 20.0003L18.4777 18.0818L17.8847 17.362L18.3332 16.8154L17.9988 16.351L18.7279 15.3345L17.9734 14.5047L17.983 14.1914C18.0313 14.1608 18.078 14.1305 18.1232 14.1009L18.0619 14.0237L18.0585 13.381L18.065 13.3673C18.6082 13.0715 19.0998 12.6546 19.4586 12.1468C19.9059 11.5137 20.0448 10.7121 19.9873 9.94503ZM15.0235 8.83167C15.0183 8.7742 15.0164 8.71674 15.018 8.65927C15.0167 8.71643 15.0183 8.7742 15.0235 8.83167ZM17.351 10.8679C17.0256 11.2776 16.4694 11.3513 16.062 11.0778C15.6401 11.1209 15.1996 10.9881 14.8849 10.6746C14.343 10.134 14.5001 9.37102 15.0415 8.96689C15.0396 8.95565 15.0375 8.94441 15.0359 8.93348C15.0378 8.94472 15.0396 8.95565 15.0418 8.96689C15.2735 8.79388 15.5757 8.68676 15.924 8.69113C16.5418 8.69925 17.0136 9.05434 17.1917 9.50125C17.3192 9.60431 17.4188 9.73798 17.4822 9.88757C17.6121 10.1939 17.5914 10.5656 17.351 10.8679ZM17.738 9.63117C17.7284 9.64335 17.7185 9.65553 17.7086 9.66708C17.7185 9.65521 17.7281 9.64335 17.7377 9.63117C17.7489 9.6168 17.76 9.60275 17.7705 9.58838C17.76 9.60275 17.7492 9.6168 17.738 9.63117ZM17.1964 7.28888C17.4856 7.42817 17.717 7.65553 17.8689 7.92723C17.7167 7.65584 17.4853 7.42848 17.1964 7.28888ZM17.8992 7.98407C17.9332 8.0509 17.9626 8.12024 17.9867 8.19144C17.9623 8.12024 17.9332 8.0509 17.8992 7.98407Z" fill="black"/>
                  <path d="M15.648 15.768H15.1348V15.6191H15.1351V14.833C15.3566 15.1481 15.5283 15.4639 15.648 15.768Z" fill="black"/>
                  <path d="M15.854 16.7363C15.854 17.0162 15.7155 17.1174 15.3377 17.1174H15.1357V15.7676H15.6486C15.7844 16.1121 15.854 16.4415 15.854 16.7363Z" fill="black"/>
                  <path d="M17.2165 16.8925C17.2165 17.8875 16.5558 18.3719 15.1612 18.4134L15.1417 18.3937L15.1356 18.3669L15.1349 17.6364V17.118H15.3369C15.7146 17.118 15.8532 17.0168 15.8532 16.737C15.8532 16.4421 15.7836 16.1127 15.6478 15.7682C15.5281 15.464 15.3564 15.1483 15.1346 14.8331V13.434V13.3725C14.4429 12.974 13.8422 12.4424 13.501 11.7363C15.8721 13.0633 17.2168 15.2126 17.2168 16.8925H17.2165Z" fill="black"/>
                </svg>

                <div style={{
                  color: '#000',
                  fontFamily: 'Montserrat',
                  fontSize: '15px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: 'normal',
                }}>
                  Reset to default (Learntostart1!)
                </div>
              </div>
            )}

            {/* Demographics Section */}
            <div className="section-header">
              <img src={spark} alt="Spark Icon" />
              <span>Organization Details</span>
            </div>

            {/* Address */}
            <div className="input-group" onClick={() => !loading && handleInputFocus('address')}>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => !loading && handleInputChange('address', e.target.value)}
                className="form-input"
                placeholder=" "
                id="address"
                disabled={loading}
              />
              <label className="input-label" htmlFor="address">Learner Address</label>
              {!loading && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
            </div>

            {/* City and State Row */}
            <div className="form-row-learner">
              <div className="form-group-half">
                <div className="input-group" onClick={() => !loading && handleInputFocus('city')}>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => !loading && handleInputChange('city', e.target.value)}
                    className="form-input"
                    placeholder=" "
                    id="city"
                    disabled={loading}
                  />
                  <label className="input-label" htmlFor="city">Learner City</label>
                  {!loading && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
                </div>
              </div>

              <div className="form-group-half">
                <div className="custom-dropdown-learner">
                  <div
                    className="dropdown-trigger-learner"
                    onClick={() => !loading && setShowStateDropdown(!showStateDropdown)}
                  >
                    <span className={formData.state ? 'selected-value' : 'placeholder-value'}>
                      {formData.state || 'Learner State'}
                    </span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {showStateDropdown && (
                    <div className="dropdown-menu-learner">
                      {stateOptions.map((state, index) => (
                        <div
                          key={index}
                          className="dropdown-item-learner"
                          onClick={() => handleDropdownSelect('state', state)}
                        >
                          {state}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gender and Age Row */}
            <div className="form-row-learner">
              <div className="form-group-half">
                <div className="custom-dropdown-learner">
                  <div
                    className="dropdown-trigger-learner"
                    onClick={() => !loading && setShowGenderDropdown(!showGenderDropdown)}
                  >
                    <span className={formData.gender ? 'selected-value' : 'placeholder-value'}>
                      {formData.gender || 'Gender'}
                    </span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {showGenderDropdown && (
                    <div className="dropdown-menu-learner">
                      {genderOptions.map((gender, index) => (
                        <div
                          key={index}
                          className="dropdown-item-learner"
                          onClick={() => handleDropdownSelect('gender', gender)}
                        >
                          {gender}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group-half">
                <div className="input-group" onClick={() => !loading && handleInputFocus('age')}>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => !loading && handleInputChange('age', e.target.value)}
                    className="form-input"
                    placeholder=" "
                    id="age"
                    disabled={loading}
                    min="1"
                    max="120"
                  />
                  <label className="input-label" htmlFor="age">Learner Age</label>
                  {!loading && <FontAwesomeIcon icon={faPencilAlt} className="input-icon" />}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-actions-learner">
            {/* Delete Learner Button - Only in Edit Mode */}
            {isEditMode && (
              <div 
                className="d-flex align-items-center gap-2"
                style={{ cursor: 'pointer' }}
                onClick={handleDeleteLearnerClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.1266 17.4997H3.87405C2.33601 17.4997 1.37357 15.8361 2.14023 14.5027L8.26651 3.84833C9.03552 2.51092 10.9651 2.51092 11.7341 3.84833L17.8604 14.5027C18.6271 15.8361 17.6646 17.4997 16.1266 17.4997Z" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 7.5V10.8333" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 14.1753L10.0083 14.1661" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <div style={{
                  color: 'var(--COLORS-Black, #000)',
                  fontFamily: 'Montserrat',
                  fontSize: '15px',
                  fontWeight: 600,
                }}>
                  Delete Learner
                </div>
              </div>
            )}

            <button
              type="button"
              className="cancel-btn-learner"
              onClick={handleClose}
              disabled={loading}
            >
              CANCEL
            </button>
            <button
              type="button"
              className="add-btn-learner"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                isEditMode ? 'SAVE CHANGES' : 'ADD LEARNER'
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Learner Popup */}
      <UserManagementPopup
        show={showDeletePopup}
        onHide={handleDeleteCancel}
        onConfirm={handleConfirmDelete}
        title="Delete User?"
        message="Are you sure you want to delete the user(s)? User and all work will be removed from the system. This action cannot be undone."
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, DELETE USER(S)"
        loading={loading}
      />

      {/* Reset Password Popup */}
      <UserManagementPopup
        show={showResetPasswordPopup}
        onHide={handleResetPasswordCancel}
        onConfirm={handleConfirmResetPassword}
        title="Reset Password?"
        message="Are you sure you want to reset this learner's password to the default (Learntostart1!)? The learner will need to use this password on their next login."
        cancelText="NO, TAKE ME BACK"
        confirmText="YES, RESET PASSWORD(S)"
        loading={loading}
      />

      {/* Deactivate/Activate User Popup */}
      <UserManagementPopup
        show={showDeactivateUserPopup}
        onHide={handleDeactivateUserCancel}
        onConfirm={handleConfirmDeactivateUser}
        title={isUserActive ? "Deactivate User?" : "Activate User?"}
        message={
          isUserActive 
            ? "Are you sure you want to deactivate the user(s)? Work and settings will be preserved, but user(s) will no longer have access to the platform."
            : "Are you sure you want to activate the user(s)? User(s) will regain access to the platform."
        }
        cancelText="NO, TAKE ME BACK"
        confirmText={isUserActive ? "YES, DEACTIVATE USER(S)" : "YES, ACTIVATE USER(S)"}
        loading={loading}
      />
    </>
  )
}

export default AddNewLearner