import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const AddNew = (props) => {
  return (
    <div
      className='ProjectCard border mx-2 px-0 rounded justify-content-center d-flex'
      style={{ minHeight: '213px', cursor: 'pointer' }}
      onClick={() => {
        props.onClick()
      }}
    >
      <FontAwesomeIcon
        icon={faPlus}
        className='justify-content-center align-self-center'
        style={{ fontSize: '49px', color: '#BBBDBF' }}
      />
    </div>
  )
}

export default AddNew
