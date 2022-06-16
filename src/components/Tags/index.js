import React from 'react'
import IntlMessages from '../../utils/IntlMessages'

export default function ProfileTag(props) {
  return (
    <button
      className='px-3 py-2 btn border me-2 my-2 tags-button'
      id={props.id}
      key={props.id}
      onClick={props.onClick}
    >
      {props.icon}
      {props.icon && <span className='mx-2' />}
      <IntlMessages id={`${props.tags}`} />
    </button>
  )
}
