import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function AddEntryButton(props) {
  return (
    <div
      className={
        'd-flex flex-column align-items-center mt-4 cursor-pointer py-3'
      }
      style={{
        background: '#FFFFFF 0% 0% no-repeat padding-box',
        boxShadow: '0px 3px 10px #00000029',
        borderRadius: 28
      }}
      onClick={props.onClick}
    >
      <FontAwesomeIcon
        icon={faPlus}
        className="plus-ico mb-2"
        style={{
          width: '40px',
          height: '40px',
          color: '#707070'
        }}
      />
      {props.title}
    </div>
  )
}

export default AddEntryButton
