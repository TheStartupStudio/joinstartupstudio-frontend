import React, { useState, useEffect } from 'react'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faExclamationTriangle,
  faPen
} from '@fortawesome/free-solid-svg-icons'
import { FaPencilAlt, FaCheck, FaEye } from 'react-icons/fa'
import ReactImageUpload from '../../../pages/Portfolio2024/Components/ReactAvatarEditor/ReactImageUpload'
import useImageEditor from '../../../hooks/useImageEditor'
import axiosInstance from '../../../utils/AxiosInstance'
import { deleteImage, uploadImage } from '../../../utils/helpers'

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
        }}
      >
        {formData.scheduleType.length === 1
          ? formData.scheduleType[0]
          : formData.scheduleType.length > 1
          ? formData.scheduleType.join(', ')
          : 'Select Schedule Type'}
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
                color: formData.scheduleType.includes('Flexible')
                  ? 'blue'
                  : 'black'
              }}
            >
              <input
                style={{
                  width: '10px',
                  display: 'inline-block',
                  marginRight: '3px'
                }}
                type='checkbox'
                name='scheduleType'
                value='Flexible'
                checked={formData.scheduleType.includes('Flexible')}
                onChange={handleCheckboxChange}
              />
              Flexible (Learn at your own pace)
            </label>

            <label
              style={{
                color: formData.scheduleType.includes('Fixed')
                  ? 'blue'
                  : 'black'
              }}
            >
              <input
                style={{
                  width: '10px',
                  display: 'inline-block',
                  marginRight: '3px'
                }}
                type='checkbox'
                name='scheduleType'
                value='Fixed'
                checked={formData.scheduleType.includes('Fixed')}
                onChange={handleCheckboxChange}
              />
              Fixed (Meet assigned deadlines)
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

const AddCourseandCredentialModal = ({
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

  const [formData, setFormData] = useState({
    name: '',
    provider: '',
    rating: '',
    reviews: '',
    description: '',
    skills: '',
    awardType: '',
    completionTime: '',
    scheduleType: [], // Changed to array to store multiple selections
    url: '',
    status: 'inactive',
    image: null,
    weeklyTimeBreakdown: ''
  })

  useEffect(() => {
    if (viewExprience) {
      setFormData({
        name: viewExprience.name_course_credential || '',
        provider: viewExprience.name_course_credential_provider || '',
        rating: viewExprience.course_rating || '',
        reviews: viewExprience.number_reviews || '',
        description: viewExprience.course_credential_description || '',
        skills: viewExprience.skills_developed || '',
        awardType: viewExprience.type_award || '',
        completionTime: viewExprience.total_completion_time || '',
        scheduleType:
          viewExprience.schedule_type && viewExprience.schedule_type.length > 0
            ? [...viewExprience.schedule_type]
            : [],
        url: viewExprience.url_link || '',
        status: viewExprience.status || 'inactive',
        weeklyTimeBreakdown: viewExprience.weekly_time_breakdown // Add logic to handle image if needed
      })
    }
  }, [viewExprience])

  const [isEditMode, setIsEditMode] = useState(false)
  const [editingImmersion, setEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (e) => {
    const { value } = e.target
    setFormData((prevData) => {
      // Toggle the selection in the scheduleType array
      if (prevData.scheduleType.includes(value)) {
        return {
          ...prevData,
          scheduleType: prevData.scheduleType.filter((type) => type !== value)
        }
      } else {
        return {
          ...prevData,
          scheduleType: [...prevData.scheduleType, value]
        }
      }
    })
  }

  const handleStatusChange = () => {
    setFormData({
      ...formData,
      status: formData.status === 'active' ? 'inactive' : 'active'
    })
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `coursesandcredentials/remove-courses-credentials/${viewExprience.id}`
      )

      onSuccess()
      onClose() // Close modal after deletion
    } catch (err) {
      console.error('Error in deletion:', err)
    }
  }

  const toggleEditing = () => setEditing(!editing)

  const handleSubmit = async (e) => {
    e.preventDefault()

    let newImage = null

    try {
      // Only attempt to upload the image if it's provided
      if (imageProperties.croppedImage) {
        newImage = await uploadImage(imageProperties.croppedImage)
      }

      // Map frontend payload to match backend field names
      const payload = {
        name_course_credential: formData.name,
        name_course_credential_provider: formData.provider,
        course_rating: formData.rating,
        number_reviews: formData.reviews,
        type_award: formData.awardType,
        total_completion_time: formData.completionTime,
        weekly_time_breakdown: formData.weeklyTimeBreakdown || '', // Handle missing field gracefully
        schedule_type: formData.scheduleType || [], // Default to empty array
        url_link: formData.url,
        status: formData.status,
        course_credential_description: formData.description,
        skills_developed: formData.skills,
        image_preview: newImage || formData.image || null // Use existing image or null
      }

      let response

      if (viewExprience) {
        // If viewExperience exists, send PUT request to edit endpoint
        response = await axiosInstance.put(
          `coursesandcredentials/edit-courses-credentials/${viewExprience.id}`,
          payload
        )
      } else {
        // Otherwise, send POST request to add endpoint
        response = await axiosInstance.post(
          'coursesandcredentials/add-courses-credentials',
          payload
        )
      }

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
        scheduleType: [], // Reset to an empty array
        url: '',
        status: 'inactive',
        image: null,
        weeklyTimeBreakdown: ''
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
      scheduleType: [], // Changed to array to store multiple selections
      url: '',
      status: 'inactive',
      image: null,
      weeklyTimeBreakdown: ''
    })
    onClose() // Close modal after cancel
  }

  return (
    <div className='modal-overlay'>
      <div className='modal-container'>
        {viewExprience && (
          <div
            className='portfolio-actions'
            style={{ borderTopRightRadius: '36px' }}
          >
            {isEditMode ? (
              <>
                <FaCheck
                  className={'action-box public-icon'}
                  onClick={handleSubmit} // Save changes to backend
                  style={{ cursor: 'pointer' }}
                  title='Save Changes'
                />

                {!justView && (
                  <FaEye
                    className={'action-box pencil-icon'}
                    onClick={() => setIsEditMode(!isEditMode)} // Switch to view-only mode
                    style={{ cursor: 'pointer' }}
                    title='Switch to View Mode'
                  />
                )}
              </>
            ) : (
              <>
                <FaCheck
                  className={'action-box public-icon'}
                  onClick={onClose} // Close the modal
                  style={{ cursor: 'pointer' }}
                  title='Close'
                />

                {!justView && (
                  <FaPencilAlt
                    className={'action-box pencil-icon'}
                    onClick={() => setIsEditMode(!isEditMode)} // Switch to edit mode
                    style={{ cursor: 'pointer' }}
                    title='Edit Experience'
                  />
                )}
              </>
            )}
          </div>
        )}
        {/* <div className='header'>
          <h2>Course Details</h2>
          <FontAwesomeIcon
            icon={faPen}
            className='edit-icon'
            onClick={() => setIsEditMode(!isEditMode)}
          />
        </div> */}
        <div style={{ marginTop: '20px' }}>
          <p>View Course or Credential</p>
          <p
            style={{
              borderBottom: '1px solid grey'
            }}
          ></p>
        </div>
        {!isEditMode && viewExprience ? (
          <ViewEditMode course={viewExprience} />
        ) : (
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
                      value={formData.name}
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
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
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
                <ScheduleTypeDropdown
                  formData={formData}
                  handleCheckboxChange={handleCheckboxChange}
                />
                {/* <div>
                  <label>Select Schedule Type</label>
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center'
                    }}
                  >
                    <label
                      style={{
                        color: formData.scheduleType.includes('Flexible')
                          ? 'blue'
                          : 'black'
                      }}
                    >
                      <input
                        type='checkbox'
                        name='scheduleType'
                        value='Flexible'
                        checked={formData.scheduleType.includes('Flexible')}
                        onChange={handleCheckboxChange}
                      />
                      Flexible( Learn at your own pace)
                    </label>

                    <label
                      style={{
                        color: formData.scheduleType.includes('Fixed')
                          ? 'blue'
                          : 'black'
                      }}
                    >
                      <input
                        type='checkbox'
                        name='scheduleType'
                        value='Fixed'
                        checked={formData.scheduleType.includes('Fixed')}
                        onChange={handleCheckboxChange}
                      />
                      Fixed (Meet assigned deadlines)
                    </label>
                  </div>
                </div> */}
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
                  <span style={{ fontSize: '12px', color: 'grey' }}>
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex' }}>
              <div
                style={{
                  width: '66%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
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

              <div
                style={{
                  margin: 'auto'
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

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {isEditMode && viewExprience && (
                <>
                  <div
                    className='delete-button'
                    onClick={() => setShowDeleteConfirm(true)} // Open delete confirmation modal
                  >
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ marginLeft: '5px' }}>Delete Experience</span>
                  </div>
                  <div
                    className='cancel-edit'
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={{ marginLeft: '5px' }}>Cancel Edits</span>
                  </div>
                </>
              )}
            </div>

            {!viewExprience ? (
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
            ) : (
              ''
            )}
          </form>
        )}

        {showDeleteConfirm && (
          <div className='modal-overlay'>
            <div className='modal-container-delete'>
              <div className='immersion-modal-header'>
                <div className='portfolio-actions'>
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    onClick={() => setShowDeleteConfirm(false)} // Close confirmation modal
                    className='action-box-delete'
                    style={{
                      cursor: 'pointer',
                      fontSize: '20px',
                      width: '45px'
                    }}
                  />
                </div>

                <h5 style={{ marginTop: '10px' }}>
                  Delete Immersion Experience
                </h5>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderTop: '1px solid black'
                }}
                className='modal-body-delete'
              >
                <p style={{ paddingTop: '25px' }}>
                  Are you sure you want to delete this experience? All
                  submissions will also be deleted.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: 'none'
                }}
                className='modal-footer'
              >
                <button
                  className='delete-confirm-button'
                  onClick={handleDelete}
                >
                  YES, DELETE EXPERIENCE
                </button>
                <button
                  style={{ border: 'none' }}
                  className='cancel-button'
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteConfirm && (
          <div className='modal-overlay'>
            <div className='modal-container-delete'>
              <div className='immersion-modal-header'>
                <div className='portfolio-actions'>
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    onClick={() => setShowDeleteConfirm(false)} // Close confirmation modal
                    className='action-box-delete'
                    style={{
                      cursor: 'pointer',
                      fontSize: '20px',
                      width: '45px'
                    }}
                  />
                </div>

                <h5 style={{ marginTop: '10px' }}>
                  Delete Course or credential
                </h5>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: 'center',
                  borderTop: '1px solid black'
                }}
                className='modal-body-delete'
              >
                <p style={{ paddingTop: '25px' }}>
                  Are you sure you want to delete this item? You will not be
                  able to recover it
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: 'none'
                }}
                className='modal-footer'
              >
                <button
                  className='delete-confirm-button'
                  onClick={handleDelete}
                >
                  YES, DELETE ITEM
                </button>
                <button
                  style={{ border: 'none' }}
                  className='cancel-button'
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const ViewEditMode = ({ course }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '20%' }}>
        <div style={{ fontSize: '0.7em', textAlign: 'center' }}>
          Course/Credential Card
        </div>
        <div key={course && course.id} className='course-card'>
          <img
            src={(course && course.image_preview) || 'default-image.png'}
            alt={course && course.name_course_credential}
          />
          <h3 style={{ textAlign: 'left' }}>
            {course && course.name_course_credential}
          </h3>
        </div>
        <div>
          <label style={{ fontSize: '10px' }}>
            Type of Award for Completion
          </label>
          <input
            className='view-award-input'
            name='awardType'
            value={course ? course.type_award : ''}
          />
        </div>
        <div style={{ marginTop: '10px' }} className='status-toggle'>
          <span style={{ fontSize: '10px', margin: '0' }}>Status</span>
          <span style={{ fontSize: '8px', color: 'grey', margin: '3px' }}>
            Inactive
          </span>
          <label className='switch'>
            <input
              type='checkbox'
              checked={course && course.status === 'active'}
            />
            <span className='slider'></span>
          </label>
          <span style={{ fontSize: '8px', color: 'grey', margin: '3px' }}>
            Active
          </span>
        </div>
      </div>

      <Modal course={course} />
    </div>
  )
}

const Modal = ({ course }) => {
  return (
    <div style={{ width: '75%' }}>
      <div style={{ fontSize: '0.7em', textAlign: 'left' }}>
        Course/Credential Details
      </div>

      <div className='view-modal-container'>
        <h2>{course && course.name_course_credential}</h2>
        <p>By {course && course.name_course_credential_provider}</p>
        <p>{course && course.course_credential_description}</p>

        <div style={{ display: 'flex' }}>
          <p>
            <strong>Rating:</strong> {course && course.course_rating} ⭐ (
            {course && course.number_reviews} reviews)
          </p>

          <p>{course && course.total_completion_time} hours to complete</p>

          <p>
            <strong>Schedule:</strong>{' '}
            {(course && course.schedule_type) || 'N/A'}
          </p>
        </div>
        <p>
          <strong>Skills You’ll Gain:</strong>{' '}
          {course && course.skills_developed}
        </p>
      </div>
    </div>
  )
}

export default AddCourseandCredentialModal
