import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Modal } from 'react-bootstrap'
import '../index.css'
import AddIndividual from './AddIndividual'

const AddStudentsModal = (props) => {
  const arrays = [1, 2, 3]

  return (
    <Modal
      show={props.show}
      className={'Add-Student-Modal'}
      onHide={() => props.onHide()}
      style={{ marginTop: '3.9%' }}
    >
      <Modal.Header className='contact-us-title my-auto p-0 mx-4'>
        <h3 className='mb-0 pt-4 mt-2 '>ADD USERS</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header>
      <Modal.Body>
        <div className='row ms-3'>
          <div className='col-12 col-md-7 Add-User-Bulk px-0'>
            <p className='title mb-0'>Upload Bulk Users</p>
            <p className='description mb-0'>
              Upload multiple users at one time using a CVS file.
            </p>
            <p className='description'>
              (Download <span className='brand'>template</span> to edit)
            </p>
            <p className='supported-formats mb-0'>Supported formats: -</p>
            <p className='supported-formats-description mb-0'>.csv only</p>
          </div>
          <div className='col-12 col-md-5 pt-3'>
            <label className='text-center border-1 col-8 col-md-12'>
              <input
                type='file'
                id='inputGroupFile'
                name='profile_image'
                className='d-none'
                // onChange={imageChange}
              />
              <div className='image-upload d-flex upload-user-input w-100 my-auto py-2 px-2'>
                <p className='py-auto my-auto'>Choose Image</p>
                <FontAwesomeIcon
                  icon={faFileUpload}
                  className='edit-modal-sm ms-auto float-end'
                  //   style={{ height: '27px', width: '20px' }}
                />
              </div>
            </label>
            <button className='upload-user-button px-3 py-4 float-md-end mt-3'>
              UPLOAD USER FILE CSV
            </button>
          </div>
          <div className='row mx-0 px-0'>
            <p className='add-individual mx-0 px-0 mt-2 mb-0'>Add individual</p>
            {arrays.map(() => (
              <>
                <AddIndividual />
              </>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AddStudentsModal
