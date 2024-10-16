import React, { useEffect, useState } from 'react'
import './style.css'
import axiosInstance from '../../../utils/AxiosInstance'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import { FaPencilAlt, FaCheck, FaEye } from 'react-icons/fa'

const AddImmersionModal = ({
  viewExprience,
  onClose,
  immersionStep,
  onSuccess,
  justView
}) => {
  // Initialize states for form fields
  const [status, setStatus] = useState(false) // Initially inactive
  const [courseName, setCourseName] = useState('')
  const [providerName, setProviderName] = useState('')
  const [courseRating, setCourseRating] = useState('')
  const [numReviews, setNumReviews] = useState('')
  const [typeOfAward, setTypeOfAward] = useState('')
  const [totalTime, setTotalTime] = useState('')
  const [scheduleType, setScheduleType] = useState('')
  const [courseUrl, setCourseUrl] = useState('')
  const [skillsDeveloped, setSkillsDeveloped] = useState('')
  const [courseDescription, setCourseDescription] = useState('')

  const handleSubmit = async () => {
    const formData = {
      status: status ? 'Active' : 'Inactive',
      courseName,
      providerName,
      courseRating,
      numReviews,
      typeOfAward,
      totalTime,
      scheduleType,
      courseUrl,
      skillsDeveloped,
      courseDescription
    }

    try {
      await axiosInstance.post('/course/add', formData)
      onSuccess()
      onClose() // Close the modal after submit
    } catch (err) {
      console.error('Error in submission:', err)
    }
  }

  const handleStatusChange = () => setStatus(!status)

  return (
    <div className='modal-overlay'>
      <div className='modal-container'>
        {/* Modal Header */}
        <div className='modal-header'>
          <h5>Add Course or Credential</h5>
          <div className='status-toggle'>
            <span>Status</span>
            <span style={{ fontSize: '12px', color: 'grey' }}>
              {'Inactive'}
            </span>
            <label className='switch'>
              <input
                type='checkbox'
                checked={status}
                onChange={handleStatusChange}
              />
              <span className='slider'></span>
            </label>
            <span style={{ fontSize: '12px', color: 'grey' }}>{'Active'}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className='modal-body'>
          <div className='input-group'>
            <p className='input-group-title'>Course/Credential Details</p>
            <input
              type='text'
              placeholder='Name of Course or Credential'
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <input
              type='text'
              placeholder='Name of Course/Credential Provider'
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
            />
          </div>

          <div className='input-group'>
            <p className='input-group-title'>Additional Details</p>
            <input
              type='text'
              placeholder='Course Rating'
              value={courseRating}
              onChange={(e) => setCourseRating(e.target.value)}
            />
            <input
              type='text'
              placeholder='Number of Reviews'
              value={numReviews}
              onChange={(e) => setNumReviews(e.target.value)}
            />
          </div>

          <div className='input-group'>
            <input
              type='text'
              placeholder='Type of Award for Completion'
              value={typeOfAward}
              onChange={(e) => setTypeOfAward(e.target.value)}
            />
            <input
              type='text'
              placeholder='Total Time to Complete Course'
              value={totalTime}
              onChange={(e) => setTotalTime(e.target.value)}
            />
          </div>

          <div className='input-group'>
            <input
              type='text'
              placeholder='Select Schedule Type'
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
            />
            <input
              type='url'
              placeholder='Link to Course'
              value={courseUrl}
              onChange={(e) => setCourseUrl(e.target.value)}
            />
          </div>

          <div className='input-group'>
            <textarea
              placeholder='Course/Credential Description'
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
            />
          </div>

          <div className='input-group'>
            <textarea
              placeholder='Skills Developed'
              value={skillsDeveloped}
              onChange={(e) => setSkillsDeveloped(e.target.value)}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className='modal-footer'>
          <button className='cancel-button' onClick={onClose}>
            Cancel
          </button>
          <button className='add-button' onClick={handleSubmit}>
            Add Item
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddImmersionModal
