import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Button, Modal, ModalBody } from 'reactstrap'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import universityFlorida from '../../assets/images/academy-icons/Design-queen.png'
import ModalInput from '../ModalInput/ModalInput'
import { createMarketProject, getMarketProjects } from '../../redux/portfolio/Actions'
import uploadImage from '../../assets/images/academy-icons/svg/upload-image.svg'
import trashIcon from '../../assets/images/academy-icons/trash.png'
import axiosInstance from '../../utils/AxiosInstance'

function NewProject({ isOpen, setIsOpen }) {
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({}) 
  const [imageFile, setImageFile] = useState(null)
  
  const [formData, setFormData] = useState({
    projectFile: '',
    contentUrl: '',
    coverUrl: '',
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (validateFile(selectedFile)) {
      setImageFile(selectedFile)
      handleInputChange('coverUrl', URL.createObjectURL(selectedFile))
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (validateFile(droppedFile)) {
      setImageFile(droppedFile)
      handleInputChange('coverUrl', URL.createObjectURL(droppedFile))
    }
  }

  const validateFile = (file) => {
    if (!file) return false

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
    const maxSize = 3 * 1920 * 1080
    
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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.projectFile?.trim()) {
      newErrors.projectFile = 'Project name is required'
    }
    if (!formData.contentUrl?.trim()) {
      newErrors.contentUrl = 'Project URL is required'
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
      let coverUrl = formData.coverUrl

      if (imageFile) {
        const imageData = new FormData()
        imageData.append('img', imageFile)

        const res = await axiosInstance.post('/upload/img', imageData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (res.data.success) {
          coverUrl = res.data.fileLocation
        } else {
          toast.error('Image upload failed')
          return
        }
      }

      const payload = {
        title: formData.projectFile,
        contentUrl: formData.contentUrl,
        coverUrl: coverUrl
      }

      await dispatch(createMarketProject(payload))
      toast.success('Project created successfully!')
      setIsOpen(false)
      setFormData({
        projectFile: '',
        contentUrl: '',
        coverUrl: ''
      })
      dispatch(getMarketProjects())
    } catch (error) {
      toast.error('Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={() => setIsOpen(false)} size='sm' style={{ maxWidth: '600px', width: '100%' }}>
      <ModalBody>
        <img className='modal-credit rounded-circle p-2 mb-2' src={courseLogo} alt='Course logo' />
        <p className='mb-0 fs-15 fw-medium'>Add New Project</p>

        <form onSubmit={handleSubmit}>
          <div className='mt-5'>
            <h4 className='fs-15'>Project Details</h4>
            <div className='d-flex flex-column gap-3'>
              <ModalInput
                id={'projectFile'}
                labelTitle={'Project File*'}
                imgSrc={penIcon}
                value={formData.projectFile}
                onChange={(e) => handleInputChange('projectFile', e.target.value)}
                required
              />
              {errors.projectFile && <span className="text-danger">{errors.projectFile}</span>}
              
              <ModalInput
                id={'contentUrl'}
                labelTitle={'URL To File Or Video*'} 
                imgSrc={penIcon}
                value={formData.contentUrl}
                onChange={(e) => handleInputChange('contentUrl', e.target.value)}
                required
              />
              {errors.contentUrl && <span className="text-danger">{errors.contentUrl}</span>}
            </div>
          </div>
          
          <div className='mt-5'>
            <h4 className='fs-15'>Project Thumbnail</h4>
            <div className='d-flex flex-column p-3 gap-2 profile-container align-items-center'>
              {formData.coverUrl ? (
                <>
                  <img
                    className='trash-icon align-self-end cursor-pointer'
                    src={trashIcon}
                    alt='trash'
                    onClick={() => {
                      handleInputChange('coverUrl', '')
                      setImageFile(null)
                    }}
                  />
                  <div className="project-image-container">
                    <img
                      className='project-preview-image'
                      src={formData.coverUrl}
                      alt='Project thumbnail'
                    />
                  </div>
                </>
              ) : (
                <div className='container d-flex justify-content-center align-items-center'>
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
                      {imageFile ? (
                        <div className="project-image-container">
                          <img
                            src={URL.createObjectURL(imageFile)}
                            alt='Uploaded Preview'
                            className='project-preview-image'
                          />
                        </div>
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
                            <span className='text-secondary'>or drag and drop</span>
                          </p>
                          <p className='fs-14'>
                            Only png, jpg, or jpeg file format supported (max. 1MB)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className='d-flex gap-3 justify-content-center mt-5'>
            <Button className='close-btn' onClick={() => setIsOpen(false)} type="button">
              CANCEL
            </Button>
            <Button className='modal-save-btn' type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'SAVING...' : 'SAVE'}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  )
}

export default NewProject
