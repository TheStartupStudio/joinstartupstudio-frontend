import React, { useState } from 'react'
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
import { useDispatch } from 'react-redux'
import { addMyWorkExperience } from '../../redux/portfolio/Actions'
import { toast } from 'react-toastify'

function NewExperience({ isOpen, setIsOpen }) {
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    if(!formData.website){
      newErrors.website = 'Organization URL is required'
    }
    if (!formData.jobTitle?.trim()) {
      newErrors.jobTitle = 'Experience role is required'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!formData.currentPosition && !formData.endDate) {
      newErrors.endDate = 'End date is required when not current position'
    }
    if (!formData.description?.trim()) {
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
        ...formData,
        description: formData.description || '',
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.currentPosition ? null : formData.endDate ? new Date(formData.endDate).toISOString() : null
      }

      await dispatch(addMyWorkExperience(payload))
      toast.success('Experience added successfully!')
      
      setIsOpen(false)
      setFormData({
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

    } catch (error) {
      toast.error('Failed to add experience')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={() => setIsOpen(false)}>
      <ModalBody>
        <img src={experienceIcon} alt='user' className='mb-3' />
        <div className='d-flex justify-content-between align-items-center'>
          <h3 className='fs-14' style={{ marginBottom: '0' }}>
            Add New Experience
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
                {errors.startDate && <span className="text-danger">{errors.organizationName}</span>}
                <ModalInput
                  id={'website'}
                  labelTitle={'Organization Url'}
                  imgSrc={penIcon}
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
                {errors.startDate && <span className="text-danger">{errors.website}</span>}
                <ModalInput
                  id={'jobTitle'}
                  labelTitle={'Experience Role*'}
                  imgSrc={penIcon}
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                />
                {errors.startDate && <span className="text-danger">{errors.jobTitle}</span>}
              </div>
            </div>
            <div>
              <h4 className='fs-15'>Experience Image/Logo</h4>
              <div className='d-flex flex-column p-3 gap-2 profile-container align-items-center'>
                <img
                  className='trash-icon align-self-end'
                  src={trashIcon}
                  alt='trash'
                  onClick={() => handleInputChange('imageUrl', null)}
                />
                <img
                  className='rounded-circle profile-container-pic'
                  src={formData.imageUrl || universityFlorida}
                  alt='profile'
                />
              </div>
            </div>
          </div>

          <div className='mt-5'>
            <div className='d-flex gap-3 justify-content-between'>
              <div className='w-100 d-flex flex-column gap-2'>
                <label className='fs-15 fw-medium'>Start Date*</label>
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => handleInputChange('startDate', date)}
                  className='form-control'
                  customInput={
                    <div className='d-flex align-items-center gap-2'>
                      <FaRegCalendarAlt className='calendar-icon' />
                      <input
                        className='cursor-pointer'
                        placeholder='Choose Date'
                        readOnly
                        value={
                          formData.startDate
                            ? new Date(formData.startDate).toLocaleDateString('en-US', {
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
                <label className='fs-15 fw-medium'>End Date*</label>
                <DatePicker
                  selected={formData.endDate}
                  onChange={(date) => handleInputChange('endDate', date)}
                  disabled={formData.currentPosition}
                  className='form-control'
                  customInput={
                    <div className='d-flex align-items-center gap-2'>
                      <FaRegCalendarAlt className='calendar-icon' />
                      <input
                        className='cursor-pointer'
                        placeholder='Choose Date'
                        readOnly
                        value={
                          formData.endDate && !formData.currentPosition
                            ? new Date(formData.endDate).toLocaleDateString('en-US', {
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
                <label className='fs-15 fw-medium white-space-no-wrap' style={{ marginBottom: '.75rem' }}>
                  Current Position
                </label>
                <Switch
                  checked={formData.currentPosition}
                  onChange={(checked) => handleInputChange('currentPosition', checked)}
                  onColor='#4CAF50'
                  uncheckedIcon={false}
                  checkedIcon={false}
                />
              </div>
            </div>
            <div className='mt-5'>
              <h4 className='fs-15'>Description*</h4>
              <ReactQuill
                value={formData.description}
                onChange={(content) => handleInputChange('description', content)}
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
              <Button className='close-btn' onClick={() => setIsOpen(false)} type="button">
                CANCEL
              </Button>
              <Button className='modal-save-btn' type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'SAVING...' : 'SAVE'}
              </Button>
            </div>
          </div>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default NewExperience
