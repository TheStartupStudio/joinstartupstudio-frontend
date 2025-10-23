import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import axiosInstance from '../../utils/AxiosInstance'
import './AddNewLearner.css'
import userIcon from '../../assets/images/academy-icons/svg/user-group-add.svg'
import leftArrow from '../../assets/images/arrowSave/ICON - Click to save@2x.png'
import spark from '../../assets/images/academy-icons/svg/spark.svg'


const AddNewLearner = ({ show, onHide, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [showGenderDropdown, setShowGenderDropdown] = useState(false)
  const [showStateDropdown, setShowStateDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Creating new learner:', formData)
      toast.success('Learner added successfully!')
      
      onSuccess()
      onHide()
      
      // Reset form
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
    } catch (error) {
      console.error('Error adding learner:', error)
      toast.error('Failed to add learner')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return
    onHide()
  }

  return (
    <Modal
      show={show}
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
          <h3 className="modal-title-learner">Add New Learner</h3>
          
          {/* <div 
            className="back-arrow-button"
            onClick={handleClose}
          >
            <img src={leftArrow} alt="close" />
          </div> */}
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

          {/* Gender and Learner Type Row */}
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
               {/* Age */}
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
              'ADD LEARNER'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default AddNewLearner