import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import defaultImage from '../../../assets/images/profile-image.png'

const SingleFounder = (props) => {
  return (
    <div className='my-2 row w-100'>
      <div className='d-flex flex-row flex-grow-1 py-2'>
        <img
          src={
            props.data.profile_image ? props.data.profile_image : defaultImage
          }
          width={'60px'}
          height={'60px'}
          style={{ objectFit: 'cover' }}
          className='rounded-circle border border-1 d-flex'
        />
        <p className='my-auto ms-4 col-3'>{props.data.name}</p>
        <input
          type='text'
          name='role'
          onChange={(e) => props.updateRole(e, props.data.id)}
          placeholder='Company Position'
          className='border border-1 text-center my-2 input__position'
        />
        <FontAwesomeIcon
          icon={faTrash}
          onClick={() => {
            props.removeFounder(props.data.id)
          }}
          style={{ color: '#FF3399' }}
          color='#FF3399'
          className='float-end my-auto ms-auto text-end order-2'
        />
      </div>
    </div>
  )
}

export default SingleFounder
