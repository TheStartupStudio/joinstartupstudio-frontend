import React from 'react'
import { Modal } from 'react-bootstrap'
import axiosInstance from '../../../../utils/AxiosInstance'

const DeleteProject = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      backdrop='static'
      keyboard={false}
    >
      {/* <Modal.Header className='contact-us-title my-auto p-0 mx-4'>
        <h3 className='mb-0 pt-4 mt-2 '>CONTACT USER</h3>
        <button
          type='button'
          className='btn-close me-1'
          aria-label='Close'
          onClick={props.onHide}
        />
      </Modal.Header> */}
      <Modal.Body
        className='mx-auto px-5 my-auto'
        style={{ minHeight: '360px' }}
      >
        <div className='delete-project-modal px-5 mx-lg-5 my-auto d-flex flex-row mt-5 row text-center'>
          <p className='px-lg-5 mx-lg-5 my-auto mb-2'>
            Are you sure you want to delete this project?
          </p>
          <span
            className='col-12 mt-5 py-2 mb-2'
            style={{ backgroundColor: '#51C7DF', color: '#ffff' }}
            onClick={() => {
              props.deleteProject(props.data.id)
            }}
          >
            I’M SURE. DELETE THIS PROJECT.
          </span>
          <span className='col-12 py-2' onClick={() => props.onHide()}>
            NO! DON’T DELETE THIS PROJECT
          </span>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default DeleteProject
