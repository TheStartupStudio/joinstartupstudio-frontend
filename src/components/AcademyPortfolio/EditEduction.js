import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaRegCalendarAlt } from 'react-icons/fa'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Switch from 'react-switch'
import { Button, Modal, ModalBody } from 'reactstrap'
import educationIcon from '../../assets/images/academy-icons/svg/education&ac.svg'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import trashIcon from '../../assets/images/academy-icons/trash.png'
import universityFlorida from '../../assets/images/academy-icons/universirty-florida.png'
import uploadImage from '../../assets/images/academy-icons/svg/upload-image.svg'
import ModalInput from '../ModalInput/ModalInput'
import {
  deleteMyEducation,
  updateMyEducation
} from '../../redux/portfolio/Actions'
import axiosInstance from '../../utils/AxiosInstance'

function EditEduction({ isOpen, setIsOpen, educationData }) {
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isCurrentStudent, setIsCurrentStudent] = useState(false)
  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    organizationName: '',
    location: '',
    website: '',
    startDate: null,
    endDate: null,
    description: '',
    imageUrl: null,
    currentPosition: false,
    showSection: true,
    jobTitle: ''
  })

  useEffect(() => {
    if (educationData) {
      setFormData({
        organizationName: educationData.organizationName || '',
        location: educationData.location || '',
        website: educationData.website || '',
        startDate: educationData.startDate
          ? new Date(educationData.startDate)
          : null,
        endDate: educationData.endDate ? new Date(educationData.endDate) : null,
        description: educationData.description || '',
        imageUrl: educationData.imageUrl,
        currentPosition: educationData.currentPosition || false,
        showSection: educationData.showSection || true,
        jobTitle: educationData.jobTitle || ''
      })
      setStartDate(
        educationData.startDate ? new Date(educationData.startDate) : null
      )
      setEndDate(educationData.endDate ? new Date(educationData.endDate) : null)
      setContent(educationData.description || '')
      setIsCurrentStudent(educationData.currentPosition || false)
    }
  }, [educationData])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.organizationName?.trim()) {
      newErrors.organizationName = 'School name is required'
    }
    if (!formData.website) {
      newErrors.website = 'School URL is required'
    }
    if (!formData.jobTitle?.trim()) {
      newErrors.jobTitle = 'Degree is required'
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!isCurrentStudent && !endDate) {
      newErrors.endDate = 'End date is required when not current student'
    }
    if (!content?.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
    const maxSize = 1 * 1024 * 1024 // 1MB

    if (!validTypes.includes(file.type)) {
      toast.error('Only PNG, JPG, or JPEG files are allowed.')
      return false
    }
    if (file.size > maxSize) {
      toast.error('File size must be under 1MB.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!validateForm()) {
      setIsSubmitting(false)
      toast.error('Please fill in all required fields')
      return
    }

    try {
      let logoUrl = formData.imageUrl

      if (imageFile) {
        const imageData = new FormData()
        imageData.append('img', imageFile)

        const res = await axiosInstance.post('/upload/img', imageData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (res.data.success) {
          logoUrl = res.data.fileLocation
        } else {
          toast.error('Image upload failed')
          return
        }
      }

      const payload = {
        id: educationData.id,
        organizationName: formData.organizationName,
        location: formData.location,
        website: formData.website,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: isCurrentStudent
          ? null
          : endDate
          ? endDate.toISOString()
          : null,
        description: content,
        imageUrl: logoUrl,
        currentPosition: isCurrentStudent,
        showSection: formData.showSection,
        jobTitle: formData.jobTitle,
        type: 'education'
      }

      await dispatch(updateMyEducation(payload))
      toast.success('Education updated successfully!')
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to update education')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteMyEducation(educationData.id))
      toast.success('Experience deleted successfully!')
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to delete experience')
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={() => setIsOpen((prev) => !prev)}>
      <ModalBody>
        <img src={educationIcon} alt='user' className='mb-3' />
        <div className='d-flex justify-content-between align-items-center'>
          <h3 className='fs-14' style={{ marginBottom: '0' }}>
            Edit Education
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className='mt-5 d-grid gap-5'
            style={{ gridTemplateColumns: '4fr 2fr' }}
          >
            <div>
              <h4 className='fs-15'>School Details</h4>
              <div className='d-flex flex-column gap-3'>
                <ModalInput
                  id={'schoolname'}
                  labelTitle={'School Name*'}
                  imgSrc={penIcon}
                  value={formData.organizationName}
                  onChange={(e) =>
                    handleInputChange('organizationName', e.target.value)
                  }
                />
                {errors.organizationName && (
                  <span className='text-danger'>{errors.organizationName}</span>
                )}
                <ModalInput
                  id={'schoolUrl'}
                  labelTitle={'School Url*'}
                  imgSrc={penIcon}
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
                {errors.website && (
                  <span className='text-danger'>{errors.website}</span>
                )}
                <ModalInput
                  id={'degree'}
                  labelTitle={'Degree*'}
                  imgSrc={penIcon}
                  value={formData.jobTitle}
                  onChange={(e) =>
                    handleInputChange('jobTitle', e.target.value)
                  }
                />
                {errors.jobTitle && (
                  <span className='text-danger'>{errors.jobTitle}</span>
                )}
              </div>
            </div>
            <div>
              <h4 className='fs-15'>School Logo</h4>
              <div className='d-flex flex-column p-3 gap-2 profile-container align-items-center'>
                {formData.imageUrl ? (
                  <>
                    <img
                      className='trash-icon align-self-end cursor-pointer'
                      src={trashIcon}
                      alt='trash'
                      onClick={() => handleInputChange('imageUrl', null)}
                    />
                    <img
                      className='rounded-circle profile-container-pic'
                      src={formData.imageUrl}
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
                              <span className='fw-medium'>Click to upload</span>
                              <br />
                              <span className='text-secondary'>
                                or drag and drop
                              </span>
                            </p>
                            <p className='fs-14'>
                              Only png, jpg, or jpeg file format supported (max.
                              1MB)
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
            <div className='d-flex gap-3 justify-content-between'>
              <div className='w-100 d-flex flex-column gap-2'>
                <label className='fs-15 fw-medium'>Start Date*</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className='form-control'
                  popperPlacement='bottom-start'
                  popperModifiers={[
                    {
                      name: 'preventOverflow',
                      options: {
                        boundary: 'window'
                      }
                    },
                    {
                      name: 'flip',
                      enabled: false // Prevents flipping upward
                    }
                  ]}
                  customInput={
                    <div className='d-flex align-items-center gap-2'>
                      <FaRegCalendarAlt className='calendar-icon' />
                      <input
                        className='cursor-pointer'
                        placeholder='Choose Date'
                        readOnly
                        value={
                          startDate
                            ? startDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : ''
                        }
                        style={{ background: 'transparent' }}
                      />
                    </div>
                  }
                />
                {errors.startDate && (
                  <span className='text-danger'>{errors.startDate}</span>
                )}
              </div>
              <div className='w-100 d-flex flex-column gap-2'>
                <label className='fs-15 fw-medium'>End Date*</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  disabled={isCurrentStudent}
                  className='form-control'
                  customInput={
                    <div className='d-flex align-items-center gap-2'>
                      <FaRegCalendarAlt className='calendar-icon' />
                      <input
                        className='cursor-pointer'
                        placeholder='Choose Date'
                        readOnly
                        value={
                          endDate
                            ? endDate.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })
                            : ''
                        }
                        style={{ background: 'transparent' }}
                      />
                    </div>
                  }
                />
                {errors.endDate && (
                  <span className='text-danger'>{errors.endDate}</span>
                )}
              </div>
              <div className='flex flex-col items-center'>
                <label
                  className='fs-15 fw-medium white-space-no-wrap'
                  style={{ marginBottom: '.75rem' }}
                >
                  Current Student
                </label>
                <Switch
                  checked={isCurrentStudent}
                  onChange={setIsCurrentStudent}
                  onColor='#4CAF50'
                  uncheckedIcon={false}
                  checkedIcon={false}
                />
              </div>
            </div>
            <div className='mt-5'>
              <h4 className='fs-15'>Description*</h4>
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
              {errors.description && (
                <span className='text-danger'>{errors.description}</span>
              )}
            </div>
          </div>
          <div className='d-flex justify-content-end mt-3 ms-2'>
            <div className='d-flex gap-3'>
              <Button
                className='modal-save-btn'
                onClick={handleDelete}
                type='button'
                style={{ backgroundColor: 'red' }}
              >
                DELETE
              </Button>
              <Button
                className='close-btn'
                type='button'
                onClick={() => setIsOpen(false)}
              >
                CANCEL
              </Button>
              <Button
                className='modal-save-btn'
                type='submit'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SAVING...' : 'SAVE'}
              </Button>
            </div>
          </div>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default EditEduction
