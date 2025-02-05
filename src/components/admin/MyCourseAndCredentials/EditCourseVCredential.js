import React, { useState } from 'react'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { FaPencilAlt, FaCheck, FaEye } from 'react-icons/fa'
import ReactImageUpload from '../../../pages/Portfolio2024/Components/ReactAvatarEditor/ReactImageUpload'
import useImageEditor from '../../../hooks/useImageEditor'
import axiosInstance from '../../../utils/AxiosInstance'

const ScheduleTypeDropdown = ({ formData, handleCheckboxChange }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <label>Select Schedule Type</label>
      <button
        type='button'
        onClick={toggleDropdown}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px 15px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '5px',
          cursor: 'pointer',
          color: 'grey'
          // height: '60px'
        }}
      >
        {formData.scheduleType ? formData.scheduleType : 'Select Schedule Type'}
      </button>

      {isDropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            zIndex: '10',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            width: '100%'
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <label
              style={{
                color: formData.scheduleType === 'Flexible' ? 'blue' : 'black',
                display: 'flex'
              }}
            >
              <input
                type='radio'
                name='scheduleType'
                value='Flexible'
                checked={formData.scheduleType === 'Flexible'}
                onChange={handleCheckboxChange}
                style={{ marginRight: '5px', height: '100%', width: '20px' }}
              />
              Flexible (Learn at your own pace)
            </label>
            <label
              style={{
                color: formData.scheduleType === 'Fixed' ? 'blue' : 'black',
                display: 'flex'
              }}
            >
              <input
                type='radio'
                name='scheduleType'
                value='Fixed'
                checked={formData.scheduleType === 'Fixed'}
                onChange={handleCheckboxChange}
                style={{ marginRight: '5px', height: '100%', width: '20px' }}
              />
              Fixed (Meet assigned deadlines)
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

const EditCourseandCredentialModal = ({
  viewExprience,
  onClose,
  immersionStep,
  onSuccess,
  justView
}) => {
  const {
    imageProperties,
    handleImageLoadSuccess,
    handleFileInputChange,
    handleLabelClick,
    handlePositionChange,
    updateCroppedImage,
    imageUrl,
    setImageUrl,
    avatarEditorActions,
    editorRef
  } = useImageEditor()

  // Initialize states for form fields
  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    rating: '',
    reviews: '',
    description: '',
    skills: '',
    awardType: '',
    completionTime: '',
    scheduleType: '', // Changed to array to store multiple selections
    url: '',
    status: 'inactive',
    image: null
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, scheduleType: e.target.value })
  }

  const handleStatusChange = () => {
    setFormData({
      ...formData,
      status: formData.status === 'active' ? 'inactive' : 'active'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Map frontend payload to match backend field names
      const payload = {
        name_course_credential: formData.name,
        name_course_credential_provider: formData.provider,
        course_rating: formData.rating,
        number_reviews: formData.reviews,
        type_award: formData.awardType,
        total_completion_time: formData.completionTime,
        weekly_time_breakdown: formData.weeklyTimeBreakdown, // This field is missing in the frontend, adjust as necessary
        schedule_type: formData.scheduleType, // Assuming this is an array as expected
        url_link: formData.url,
        status: formData.status,
        course_credential_description: formData.description,
        skills_developed: formData.skills,
        image_preview: imageUrl || null // Use image URL or null if not available
      }

      // Send POST request using Axios instance
      const response = await axiosInstance.post(
        'coursesandcredentials/add-courses-credentials',
        payload
      )

      // Handle success callback if provided
      if (onSuccess) {
        onSuccess(response.data)
      }

      // Reset form after success
      setFormData({
        name: '',
        provider: '',
        rating: '',
        reviews: '',
        description: '',
        skills: '',
        awardType: '',
        completionTime: '',
        scheduleType: [],
        url: '',
        status: 'inactive',
        image: null
      })
      onClose() // Close modal
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: '',
      provider: '',
      rating: '',
      reviews: '',
      description: '',
      skills: '',
      awardType: '',
      completionTime: '',
      scheduleType: [],
      url: '',
      status: 'inactive',
      image: null
    })
    onClose() // Close modal after cancel
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-container'>
        <form onSubmit={handleSubmit} className='course-form'>
          <div style={{ fontSize: '15px' }}>Add Course or Credential</div>
          <div className='add-course-container'>
            <div className='form-group'>
              <div>
                <label>Course/Credential Details</label>
                <div>
                  <input
                    type='text'
                    name='name'
                    placeholder='Name of Course or Credential'
                    value={valueformData.name}
                    onChange={handleInputChange}
                  />
                  <input
                    type='text'
                    name='provider'
                    placeholder='Name of Course/Credential Provider'
                    value={formData.provider}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <label>Course Rating</label>
                  <div>
                    <input
                      type='text'
                      name='rating'
                      placeholder='Numerical Rating'
                      value={formData.rating}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label>No. Of Reviews</label>
                  <input
                    type='text'
                    name='reviews'
                    placeholder='Number of Reviews'
                    value={formData.reviews}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className='form-group'>
              <div>
                <label>Type of Award for Completion</label>
                <select
                  name='awardType'
                  value={formData.awardType}
                  onChange={handleInputChange}
                >
                  <option value=''>Select Type of Award</option>
                  <option value='Certificate'>Certificate</option>
                  <option value='Credential'>Credential</option>
                </select>
              </div>
              <div>
                <label>Total Time to Complete Course/Credential</label>

                <input
                  type='text'
                  name='completionTime'
                  placeholder='Total Time to Complete Course/Credential'
                  value={formData.completionTime}
                  onChange={handleInputChange}
                />
                <input
                  type='text'
                  name='weeklyTimeBreakdown'
                  placeholder='Weekly time breakdown (optional)'
                  value={formData.weeklyTimeBreakdown}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className='form-group'>
              <div>
                {/* <label>Select Schedule Type</label> */}
                <ScheduleTypeDropdown
                  formData={formData}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </div>
              <div>
                <label>Link to Course</label>
                <input
                  type='text'
                  name='url'
                  placeholder='URL to course'
                  value={formData.url}
                  onChange={handleInputChange}
                />
              </div>

              <div className='status-toggle'>
                <span>Status</span>
                <span style={{ fontSize: '12px', color: 'grey' }}>
                  Inactive
                </span>
                <label className='switch'>
                  <input
                    type='checkbox'
                    checked={formData.status === 'active'}
                    onChange={handleStatusChange}
                  />
                  <span className='slider'></span>
                </label>
                <span style={{ fontSize: '12px', color: 'grey' }}>Active</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex' }}>
            <div
              style={{ width: '66%', display: 'flex', flexDirection: 'column' }}
            >
              <div>
                <label>Course/Credential Description</label>
                <textarea
                  name='description'
                  placeholder='Course/Credential Description'
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label>Skills Developed</label>
                <input
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '60px',
                    background: 'white',
                    border: '1px solid #ccc',
                    padding: '10px',
                    fontSize: '14px'
                  }}
                  type='text'
                  name='skills'
                  placeholder='Add each skill separated by a comma'
                  value={formData.skills}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            {console.log(formData, 'formdataaa')}
            <div
              style={{
                marginLeft: 'auto'
              }}
              className=''
            >
              <ReactImageUpload
                {...imageProperties}
                onChangeImageCrop={updateCroppedImage}
                onImageLoadSuccess={handleImageLoadSuccess}
                onLabelClick={handleLabelClick}
                onFileInputChange={handleFileInputChange}
                onPositionChange={handlePositionChange}
                actions={avatarEditorActions}
                editorRef={editorRef}
              />
            </div>
          </div>

          <div className='form-buttons'>
            <button
              style={{
                background: 'white',
                border: '1px solid #ccc',
                color: 'grey',
                marginRight: '5px'
              }}
              type='button'
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button type='submit'>Add Item</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditCourseandCredentialModal
