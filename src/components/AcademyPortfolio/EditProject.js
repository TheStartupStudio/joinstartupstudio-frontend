import React, { useState } from 'react'
import { Button, Modal, ModalBody } from 'reactstrap'
import courseLogo from '../../assets/images/academy-icons/course-progress.png'
import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'
import universityFlorida from '../../assets/images/academy-icons/universirty-florida.png'
import ModalInput from '../ModalInput/ModalInput'
import warningTriangle from '../../assets/images/academy-icons/warning-triangle.png'

function EditProject({ isOpen, setIsOpen }) {
  const [deleteProject, setDeleteProject] = useState(false)

  const toggleDelete = () => {
    setDeleteProject((prev) => !prev)
    setIsOpen((prev) => !prev)
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
          <p className='mb-0 fs-15 fw-medium'>Add New Project</p>

          <form>
            <div className='mt-5'>
              <h4 className='fs-15'>Experience Details</h4>
              <div className='d-flex flex-column gap-3'>
                <ModalInput
                  id={'projectFile'}
                  labelTitle={'Project File'}
                  imgSrc={penIcon}
                />
                <ModalInput
                  id={'urlToVideo'}
                  labelTitle={'URL To File Or Video'}
                  imgSrc={penIcon}
                />
              </div>
            </div>
            <div className='mt-5'>
              <h4 className='fs-15'>Project Thumbnail</h4>
              <div className='p-5 w-100 d-flex justify-content-center master-class-container p-block-5'>
                <img src={universityFlorida} />
              </div>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
              <div
                className='d-flex gap-2 align-items-center mt-5 cursor-pointer'
                onClick={toggleDelete}
              >
                <img src={warningTriangle} alt='warning-triangle' />
                <p className='mb-0'>Delete Project</p>
              </div>
              <div className='d-flex gap-3 justify-content-center mt-5'>
                <Button
                  className='close-btn'
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  CANCEL
                </Button>
                <button className='modal-save-btn'>SAVE</button>
              </div>
            </div>
          </form>
        </ModalBody>
      </Modal>

      <Modal isOpen={deleteProject} toggle={setDeleteProject}>
        <ModalBody>
          <img
            className='modal-credit rounded-circle p-2 mb-2'
            src={warningTriangle}
            alt='warnign triangle'
          />
          <p className='mb-0 fs-15 fw-medium'>Delete Project?</p>

          <p className='mt-5 text-center fw-medium'>
            Are you sure you want to delete this project?
          </p>

          <div className='d-flex gap-3 justify-content-center mt-5 mb-3'>
            <Button
              color='info'
              className='sub-close-btn'
              onClick={toggleDelete}
            >
              NO, TAKE ME BACK
            </Button>
            <button
              className='sub-modal-save-btn'
              onClick={() => setDeleteProject((prev) => !prev)}
            >
              YES, DELETE PROJECT
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default EditProject
