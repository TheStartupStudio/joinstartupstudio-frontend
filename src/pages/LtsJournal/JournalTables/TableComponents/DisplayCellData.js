import React, { useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'

export const DisplayCellData = (props) => {
  const newRef = useRef(null)

  useEffect(() => {
    if (props.selectedCell) {
      function handleOutsideClick(e) {
        if (
          !e.target.classList.contains('edit-pencil') &&
          !e.target.classList.contains('edit-pencil-container') &&
          !e.target.classList.contains('journal_table-input') &&
          !props.loading
        ) {
          props.setDisplayedCellIndex(null)
          props.setSelectedCell(null)
        }
      }

      document.addEventListener('mousedown', handleOutsideClick)

      return () => {
        document.removeEventListener('mousedown', handleOutsideClick)
      }
    }
  }, [props.selectedCell])
  return (
    <span
      disabled={props.disabled}
      style={{
        ...props.additionalStyle,
        backgroundColor: '#fff',
        height: '100%',
        padding: '8px 0',
        cursor: 'pointer'
      }}
      className={'d-flex justify-content-between align-items-center '}
    >
      <div>
        <div style={{ overflowWrap: 'anywhere' }}>{props.userCellValue}</div>
        {/*<div></div>*/}
      </div>
      <div
        ref={newRef}
        onClick={(event) => {
          props.openEditBox(event)
        }}
        className={'edit-pencil-container d-flex justify-content-end'}
        style={{ padding: '16px 0 16px 16px' }}
      >
        <FontAwesomeIcon
          className={'z-3 ml-1 edit-pencil'}
          icon={faPencilAlt}
        />
      </div>
    </span>
  )
}

export default DisplayCellData
