import React, { useState } from 'react'
import IntlMessages from '../../../utils/IntlMessages'
import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './index.css'

export default function SkillBoxButton(props) {
  const [selected, setSelected] = useState(false)

  return (
    <button
      className={`${
        selected && 'active'
      } px-5 py-2 btn border rounded me-2 my-2 skills-button`}
      style={{ wordBreak: 'break-all' }}
      id={props.id}
      key={props.id}
      onClick={
        props.from == 'addModal' && !selected
          ? () => {
              props.setSelectedSkills((old) => [...old, props.data.name])
              setSelected(true)
            }
          : props.from == 'addModal' && selected
          ? () => {
              props.editAddedSelectedSkill(props.data.name)
              setSelected(false)
            }
          : props.from == 'removeModal' && !selected
          ? () => {
              props.setRemoveSkill((old) => [...old, props.data.name])
              setSelected(true)
            }
          : props.from == 'removeModal' && selected
          ? () => {
              props.editRemoveSkill(props.data.name)
              setSelected(false)
            }
          : props.from0 == 'public'
          ? null
          : () => {
              props.openModal()
            }
      }
      // onClick={selected ? () => setSelected(false) : () => setSelected(true)}
    >
      {props.from == 'removeModal' && (
        <span className={`mx-1 ${selected && 'icon-active'}`}>X</span>
      )}
      {props.isEmpty && (
        <FontAwesomeIcon
          icon={faPlus}
          className={`mx-4 ${selected && 'icon-active'}`}
        />
      )}
      {selected && props.from != 'removeModal' && (
        <FontAwesomeIcon icon={faCheck} className='me-2' />
      )}
      {!props.isEmpty && props.data.name}
    </button>
  )
}
