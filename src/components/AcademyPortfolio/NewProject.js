import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { Button, Modal, ModalBody } from 'reactstrap'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import universityFlorida from '../../assets/images/academy-icons/Design-queen.png'
import ModalInput from '../ModalInput/ModalInput'
import { createMarketProject, getMarketProjects } from '../../redux/portfolio/Actions'

function NewProject({ isOpen, setIsOpen }) {
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({}) 
  
  const [formData, setFormData] = useState({
    projectFile: '',
    contentUrl: '',
    coverUrl: universityFlorida
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
      const payload = {
        title: formData.projectFile,
        contentUrl: formData.contentUrl,
        coverUrl: formData.coverUrl
      }

      await dispatch(createMarketProject(payload))
      toast.success('Project created successfully!')
      setIsOpen(false)
      setFormData({
        projectFile: '',
        contentUrl: '',
        coverUrl: universityFlorida
      })
      dispatch(getMarketProjects())
    } catch (error) {
      toast.error('Failed to create project')
    } finally {
      setIsSubmitting(false)
      dispatch(getMarketProjects())
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
            <div className=' w-100 d-flex justify-content-center master-class-container object-fit-cover'>
              <img src={formData.coverUrl} alt="Project thumbnail" />
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
