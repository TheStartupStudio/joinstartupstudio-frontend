import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Modal, ModalBody } from 'reactstrap'
import { toast } from 'react-toastify'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import universityFlorida from '../../assets/images/academy-icons/universirty-florida.png'
import ModalInput from '../ModalInput/ModalInput'
import warningTriangle from '../../assets/images/academy-icons/warning-triangle.png'
import { updateMarketProject, deleteMarketProject, getMarketProjects } from '../../redux/portfolio/Actions'

function EditProject({ isOpen, setIsOpen, projectData }) {
  const dispatch = useDispatch()
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteProject, setDeleteProject] = useState(false)
  
  const [formData, setFormData] = useState({
    projectFile: '',
    urlToVideo: '',
    imageUrl: universityFlorida
  })

  useEffect(() => {
    if (projectData) {
      setFormData({
        projectFile: projectData.title || '',
        urlToVideo: projectData.contentUrl || '',
        imageUrl: projectData.coverUrl || universityFlorida,
        description: projectData.description || ''
      })
    }
  }, [projectData])

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
    if (!formData.urlToVideo?.trim()) {
      newErrors.urlToVideo = 'Project URL is required'
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
        id: projectData.id,
        title: formData.projectFile,
        contentUrl: formData.urlToVideo,
        coverUrl: formData.imageUrl,
        description: formData.description
      }

      await dispatch(updateMarketProject(projectData.id, payload))
      console.log('Ardi 76, ', payload)
      toast.success('Project updated successfully!')
      setIsOpen(false)
      dispatch(getMarketProjects())
    } catch (error) {
      toast.error('Failed to update project')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteMarketProject(projectData.id))
      toast.success('Project deleted successfully!')
      setDeleteProject(false)
      setIsOpen(false)
      dispatch(getMarketProjects())
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={() => setIsOpen((prev) => !prev)}
        size='sm'
        style={{ maxWidth: '600px', width: '100%' }}
      >
        <ModalBody>
          <img
            className='modal-credit rounded-circle p-2 mb-2'
            src={courseLogo}
            alt='Course logo'
          />
          <p className='mb-0 fs-15 fw-medium'>Edit Project</p>

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
                />
                {errors.projectFile && <span className="text-danger">{errors.projectFile}</span>}
                <ModalInput
                  id={'urlToVideo'}
                  labelTitle={'URL To File Or Video*'}
                  imgSrc={penIcon}
                  value={formData.urlToVideo}
                  onChange={(e) => handleInputChange('urlToVideo', e.target.value)}
                />
                {errors.urlToVideo && <span className="text-danger">{errors.urlToVideo}</span>}
              </div>
            </div>
            
            <div className='mt-5'>
              <h4 className='fs-15'>Project Thumbnail</h4>
              <div className='p-5 w-100 d-flex justify-content-center master-class-container p-block-5'>
                <img src={formData.imageUrl || universityFlorida} alt="Project thumbnail" />
              </div>
            </div>

            <div className='d-flex justify-content-between align-items-center'>
              <div
                className='d-flex gap-2 align-items-center mt-5 cursor-pointer'
                onClick={() => setDeleteProject(true)}
              >
                <img src={warningTriangle} alt='warning-triangle' />
                <p className='mb-0'>Delete Project</p>
              </div>
              <div className='d-flex gap-3 justify-content-center mt-5'>
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

      <Modal isOpen={deleteProject} toggle={() => setDeleteProject(false)}>
        <ModalBody>
          <img
            className='modal-credit rounded-circle p-2 mb-2'
            src={warningTriangle}
            alt='warning triangle'
          />
          <p className='mb-0 fs-15 fw-medium'>Delete Project?</p>

          <p className='mt-5 text-center fw-medium'>
            Are you sure you want to delete this project?
          </p>

          <div className='d-flex gap-3 justify-content-center mt-5 mb-3'>
            <Button
              color='info'
              className='sub-close-btn'
              onClick={() => setDeleteProject(false)}
            >
              NO, TAKE ME BACK
            </Button>
            <Button
              className='sub-modal-save-btn'
              onClick={handleDelete}
            >
              YES, DELETE PROJECT
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default EditProject
