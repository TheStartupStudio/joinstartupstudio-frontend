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
import ModalInput from '../ModalInput/ModalInput'
import { getMyEducations, updateMyEducation } from '../../redux/portfolio/Actions'

function EditEduction({ isOpen, setIsOpen, educationData }) {
  const dispatch = useDispatch()
  const [content, setContent] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isCurrentStudent, setIsCurrentStudent] = useState(false)

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

  // Add useEffect to populate form data when educationData changes
  useEffect(() => {
    if (educationData) {
      setFormData({
        organizationName: educationData.organizationName || '',
        location: educationData.location || '',
        website: educationData.website || '',
        startDate: educationData.startDate ? new Date(educationData.startDate) : null,
        endDate: educationData.endDate ? new Date(educationData.endDate) : null,
        description: educationData.description || '',
        imageUrl: educationData.imageUrl,
        currentPosition: educationData.currentPosition || false,
        showSection: educationData.showSection || true,
        jobTitle: educationData.jobTitle || ''
      })
      setStartDate(educationData.startDate ? new Date(educationData.startDate) : null)
      setEndDate(educationData.endDate ? new Date(educationData.endDate) : null)
      setContent(educationData.description || '')
      setIsCurrentStudent(educationData.currentPosition || false)
    }
  }, [educationData])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const payload = {
        id: educationData.id, // Important: Include the id for update
        organizationName: formData.organizationName,
        location: formData.location,
        website: formData.website,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: isCurrentStudent ? null : endDate ? endDate.toISOString() : null,
        description: content,
        imageUrl: formData.imageUrl,
        currentPosition: isCurrentStudent,
        showSection: formData.showSection,
        jobTitle: formData.jobTitle,
        type: 'education' // Important: Include type for the backend
      }

      await dispatch(updateMyEducation(payload))
      toast.success('Education updated successfully!')
      setIsOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update education')
    }
  }

  useEffect(() => {

  }, [])

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
          <div className='mt-5 d-grid gap-5' style={{ gridTemplateColumns: '4fr 2fr' }}>
            <div>
              <h4 className='fs-15'>School Details</h4>
              <div className='d-flex flex-column gap-3'>
                <ModalInput
                  id={'schoolname'}
                  labelTitle={'School Name'}
                  imgSrc={penIcon}
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                />
                <ModalInput
                  id={'schoolUrl'}
                  labelTitle={'School Url'}
                  imgSrc={penIcon}
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
                <ModalInput
                  id={'degree'}
                  labelTitle={'Degree'}
                  imgSrc={penIcon}
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                />
              </div>
            </div>
            <div>
              <h4 className='fs-15'>School Logo</h4>
              <div className='d-flex flex-column p-3 gap-2 profile-container align-items-center'>
                <img
                  className='trash-icon align-self-end'
                  src={trashIcon}
                  alt='trash'
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
            </div>
          </div>
          <div className='d-flex justify-content-end mt-3 ms-2'>
            <div className='d-flex gap-3'>
              <Button
                className='close-btn'
                type="button"
                onClick={() => setIsOpen(false)}
              >
                CANCEL
              </Button>
              <Button 
                className='modal-save-btn'
                type="submit"
              >
                SAVE
              </Button>
            </div>
          </div>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default EditEduction
