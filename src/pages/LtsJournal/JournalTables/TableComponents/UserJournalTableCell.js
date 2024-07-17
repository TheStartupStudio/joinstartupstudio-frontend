import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import JournalTableCellInput from './JournalTableCellInput'
import JournalTableCell from './JournalTableCell'

export const UserJournalTableCell = (props) => {
  return (
    <JournalTableCell
      colSpan={props.cell.colSpan}
      additionalStyling={{
        display: 'flex',
        gap: 6,
        ...props.additionalStyling,
        position: 'relative'
      }}
    >
      {props.userCell ? (
        <>
          <JournalTableCellInput
            cell={props.cell}
            additionalStyle={{
              width: '100%',
              height: '100%'
            }}
            additionalInputStyle={{ ...props.additionalInputStyle }}
            value={props.userCellValue}
            handleChange={(value) => {
              const isEdit = !!props.userCell
              return props.handleChangeUserCell(props.userCell, value, isEdit)
            }}
            isDisabled={props.isDisabled}
            inputType={props.cell.inputType}
            inputTag={props.cell.inputTag}
            inputRef={props.inputRef}
            setLoading={props.setLoading}
          />
          {props.loading && (
            <div
              className=""
              style={{
                color: '#01c5d1',
                position: 'absolute',
                zIndex: 999,
                bottom: 0,
                right: 13
              }}
            >
              <FontAwesomeIcon icon={faSpinner} className="" spin />
            </div>
          )}
        </>
      ) : (
        <JournalTableCellInput
          cell={props.cell}
          additionalStyle={{
            width: '100%'
          }}
          additionalInputStyle={{ ...props.additionalInputStyle }}
          handleChange={(value) => {
            const isEdit = !!props.userCell
            return props.handleChangeUserCell(props.cell, value, isEdit)
          }}
          isDisabled={props.isDisabled}
          inputType={props.cell.inputType}
          inputTag={props.cell.inputTag}
          inputRef={props.inputRef}
          setLoading={props.setLoading}
        />
      )}
    </JournalTableCell>
  )
}
export default UserJournalTableCell
