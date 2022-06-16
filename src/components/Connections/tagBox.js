import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import React, { useState } from 'react'

export default function TagBox(props) {
  let [isSelected, setIsSelected] = useState(false)

  const tagData = props.data
  const toggleTag = (id) => {
    props.toggleTag(id, !isSelected)
    setIsSelected(!isSelected)
  }
  return (
    <button
      className={`tag-box-not-selected ${
        isSelected ? 'active-tag-box' : ''
      } col-md-2 me-3 my-2`}
      onClick={() => toggleTag(tagData.id)}
    >
      <span className='my-auto py-1 mx-2'>
        {' '}
        <FontAwesomeIcon
          className='mx-1 me-2'
          icon={isSelected ? faCheck : faTimes}
        />
        {tagData.name}{' '}
      </span>
    </button>
    // {props.icon}
    // {props.icon && <span className='mx-2'></span>}
    // {props.tags}
  )
}
