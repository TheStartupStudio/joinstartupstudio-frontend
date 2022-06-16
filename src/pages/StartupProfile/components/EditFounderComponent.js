import React, { useState } from 'react'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import defaultImage from '../../../assets/images/profile-image.png'
import DeleteFounder from './Modals/DeleteFounder'

const EditFounderComponent = (props) => {
  const [apply, setApply] = useState(false)

  return (
    <>
      <div className='row mb-3'>
        <div className='col-12 col-md-5 col-lg-4'>
          <div className='edit-founders__name'>
            <img
              src={
                props.data.profile_image
                  ? props.data.profile_image
                  : defaultImage
              }
              width={'60px'}
              height={'60px'}
              style={{ objectFit: 'cover' }}
              className='rounded-circle border border-1'
            />
            <span className='ms-2 d-flex align-items-center'>
              {props.data.name}
            </span>
          </div>
        </div>
        <div className='col-10 col-sm-11 col-md-6 col-lg-7 d-flex align-items-center'>
          <input
            type='text'
            name='role'
            onChange={(e) => props.updateState(e, props.data.id)}
            placeholder={
              props.data.Business_Founders.role
                ? props.data.Business_Founders.role
                : 'Role'
            }
            defaultValue={
              props.data.Business_Founders.role
                ? props.data.Business_Founders.role
                : ''
            }
            className='border border-1 text-center my-2 input__position d-block d-md-auto edit-founders__role'
          />
        </div>
        <div className='col-1 col-sm-1 d-flex align-items-center'>
          <FontAwesomeIcon
            onClick={() => setApply(true)}
            icon={faTrash}
            color='#FF3399'
            className='float-end my-auto ms-auto text-end'
          />
        </div>
      </div>
      <DeleteFounder
        show={apply}
        onHide={() => setApply(false)}
        removeFounder={(id) => {
          props.removeFounder(props.data.id)
        }}
      />
    </>
  )
}

export default EditFounderComponent
