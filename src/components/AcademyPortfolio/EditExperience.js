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
import experienceIcon from '../../assets/images/academy-icons/svg/experience.svg'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import trashIcon from '../../assets/images/academy-icons/trash.png'
import universityFlorida from '../../assets/images/academy-icons/universirty-florida.png'
import ModalInput from '../ModalInput/ModalInput'
import { updateMyWorkExperience, deleteMyWorkExperience } from '../../redux/portfolio/Actions'

function EditExperience({ isOpen, setIsOpen, experienceData }) {
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null) 
  const [isCurrentPosition, setIsCurrentPosition] = useState(false)

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
    jobTitle: '',
    type: 'work'
  })

  useEffect(() => {
    if (experienceData) {
      setFormData({
        organizationName: experienceData.organizationName || '',
        location: experienceData.location || '',
        website: experienceData.website || '', 
        startDate: experienceData.startDate ? new Date(experienceData.startDate) : null,
        endDate: experienceData.endDate ? new Date(experienceData.endDate) : null,
        description: experienceData.description || '',
        imageUrl: experienceData.imageUrl,
        currentPosition: experienceData.currentPosition || false,
        showSection: experienceData.showSection || true,
        jobTitle: experienceData.jobTitle || '',
        type: experienceData.type || 'work'
      })
      setStartDate(experienceData.startDate ? new Date(experienceData.startDate) : null)
      setEndDate(experienceData.endDate ? new Date(experienceData.endDate) : null)
      setContent(experienceData.description || '')
      setIsCurrentPosition(experienceData.currentPosition || false)
    }
  }, [experienceData])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.organizationName?.trim()) {
      newErrors.organizationName = 'Organization name is required'  
    }
    if (!formData.website) {
      newErrors.website = 'Organization URL is required'
    }
    if (!formData.jobTitle?.trim()) {
      newErrors.jobTitle = 'Experience role is required'
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!isCurrentPosition && !endDate) {
      newErrors.endDate = 'End date is required when not current position'
    }
    if (!content?.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
      const payload = {
        id: experienceData.id,
        organizationName: formData.organizationName,
        location: formData.location,
        website: formData.website,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: isCurrentPosition ? null : endDate ? endDate.toISOString() : null,
        description: content,
        imageUrl: formData.imageUrl,
        currentPosition: isCurrentPosition,
        showSection: formData.showSection,
        jobTitle: formData.jobTitle,
        type: 'work'
      }

      await dispatch(updateMyWorkExperience(payload))
      toast.success('Experience updated successfully!')
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to update experience')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteMyWorkExperience(experienceData.id))
      toast.success('Experience deleted successfully!')
      setIsOpen(false)
    } catch (error) {
      toast.error('Failed to delete experience')
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={() => setIsOpen(false)}>
      <ModalBody>
        <img src={experienceIcon} alt='user' className='mb-3' />
        <div className='d-flex justify-content-between align-items-center'>
          <h3 className='fs-14' style={{ marginBottom: '0' }}>
            Edit Experience
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mt-5 d-grid gap-5' style={{ gridTemplateColumns: '4fr 2fr' }}>
            <div>
              <h4 className='fs-15'>Experience Details</h4>
              <div className='d-flex flex-column gap-3'>
                <ModalInput
                  id={'organizationName'}
                  labelTitle={'Organization Name*'}
                  imgSrc={penIcon}
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                />
                {errors.organizationName && <span className="text-danger">{errors.organizationName}</span>}

                <ModalInput
                  id={'website'}
                  labelTitle={'Organization Url*'}
                  imgSrc={penIcon}
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
                {errors.website && <span className="text-danger">{errors.website}</span>}

                <ModalInput
                  id={'jobTitle'}
                  labelTitle={'Experience Role*'}
                  imgSrc={penIcon}
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                />
                {errors.jobTitle && <span className="text-danger">{errors.jobTitle}</span>}
              </div>
            </div>
            <div>
              <h4 className='fs-15'>Experience Image/Logo</h4>
              <div className='d-flex flex-column p-3 gap-2 profile-container align-items-center'>
                <img
                  className='trash-icon align-self-end'
                  src={trashIcon}
                  alt='trash'
                />
                <img
                  className='rounded-circle profile-container-pic'
                  src={universityFlorida}
                  alt='profile'
                />
              </div>
            </div>
          </div>

          <div className='mt-5'>
            <div className='d-flex gap-3 justify-content-between'>
              <div className='w-100 d-flex flex-column gap-2'>
                <label className='fs-15 fw-medium'>Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  className='form-control'
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
                {errors.startDate && <span className="text-danger">{errors.startDate}</span>}
              </div>
              <div className='w-100 d-flex flex-column gap-2'>
                <label className='fs-15 fw-medium'>End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
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
                {errors.endDate && <span className="text-danger">{errors.endDate}</span>}
              </div>
              <div className='flex flex-col items-center'>
                <label
                  className='fs-15 fw-medium white-space-no-wrap'
                  style={{ marginBottom: '.75rem' }}
                >
                  Current Student
                </label>
                <Switch
                  checked={isCurrentPosition}
                  onChange={setIsCurrentPosition}
                  onColor='#4CAF50'
                  uncheckedIcon={false}
                  checkedIcon={false}
                />
              </div>
            </div>
            <div className='mt-5'>
              <h4 className='fs-15'>Description</h4>
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
              {errors.description && <span className="text-danger">{errors.description}</span>}
            </div>
          </div>
          <div className='d-flex justify-content-end mt-3 ms-2'>
            <div className='d-flex gap-3'>
              <Button 
                className='modal-save-btn' 
                onClick={handleDelete} 
                type="button"
                style={{ backgroundColor: 'red' }}
              >
                DELETE
              </Button>
              <Button 
                className='close-btn' 
                onClick={() => setIsOpen(false)} 
                type="button"
              >
                CANCEL
              </Button>
              <Button 
                className='modal-save-btn' 
                type="submit" 
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

export default EditExperience
