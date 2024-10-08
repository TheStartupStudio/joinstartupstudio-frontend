import React from 'react'
import IntlMessages from '../../../utils/IntlMessages'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function SkillBox(props) {
  return (
    <button
      className='px-4 py-2 btn border rounded me-2 my-2 skills-button'
      style={{ wordBreak: 'break-all' }}
      id={props.id}
      key={props.id}
      onClick={props.onClick}
    >
      {props.icon}
      {props.icon && <span className='mx-2' />}
      {!props.data ||
        (props?.liveskillname?.lenth === 0 && (
          <FontAwesomeIcon
            icon={faPlus}
            className='mx-5'
            style={{ color: '#707070' }}
          />
        ))}
      {props.data ? (
        <IntlMessages
          id={`${props.data.name ? props.data.name : 'general.loading'}`}
        />
      ) : (
        props.liveskillname && (
          <IntlMessages
            id={`${
              props.liveskillname ? props.liveskillname : 'general.loading'
            }`}
          />
        )
      )}
    </button>
  )
}
