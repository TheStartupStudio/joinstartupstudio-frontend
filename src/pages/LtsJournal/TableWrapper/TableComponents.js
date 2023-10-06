import React, { useCallback, useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import { FormControl, FormGroup, InputGroup } from 'react-bootstrap'
import _ from 'lodash'

export const JournalTableRow = (props) => {
  const { children, additionalStyle } = props
  return (
    <tr className={'journal_table-row'} style={{ ...additionalStyle }}>
      {children}
    </tr>
  )
}
export const JournalTableCell = (props) => {
  const { isGray, colSpan, additionalStyling } = props

  return (
    <td
      colSpan={colSpan}
      style={{
        backgroundColor: isGray ? '#dfdfdf' : '#fff',
        ...additionalStyling,
        height: '100%',
        display: 'table-cell'
      }}
      className={'journal_table-data'}
      // className={'table_cell-title_box'}
    >
      {props.children}
    </td>
  )
}

export const JournalTableCellInput = (props) => {
  const {
    title,
    type,
    value,
    handleChange,
    width,
    inputName,
    isBold,
    isDisabled,
    additionalStyle,
    additionalInputStyle,
    inputTag,
    inputType
  } = props
  const inputRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const inputs = document.querySelectorAll('.journal_table-input')
      const currentIndex = Array.from(inputs).indexOf(inputRef.current)
      const nextIndex = (currentIndex + 1) % inputs.length
      inputs[nextIndex].focus()
    }
  }

  const newStyle = {
    width: width ?? '100%',
    ...additionalInputStyle
  }

  const debounce = useCallback(
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 2000),
    []
  )

  return (
    <div
      className={'journal_table-input__container'}
      style={{ ...additionalStyle, height: '100%' }}
    >
      {title ? (
        <div
          className={'journal_table-input__title'}
          style={{ fontWeight: isBold ? 600 : 400 }}
        >
          {title}
        </div>
      ) : null}
      <div className={` ${width ? '' : 'w-100'}`}>
        {inputTag === 'textarea' && (
          <textarea
            key={props.cell.id}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            className={`journal_table-input py-2 px-2 text-dark `}
            disabled={isDisabled}
            // type={inputType}
            style={{ ...newStyle, resize: 'none' }}
            name={'textarea'}
            value={value}
            onChange={(e) => debounce(() => handleChange(e.target.value))}
          />
        )}
        {inputTag === 'input' && (
          <input
            key={props.cell.id}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            className={`journal_table-input py-2 px-2 text-dark `}
            disabled={isDisabled}
            type={inputType}
            style={newStyle}
            name={inputName ?? ''}
            defaultValue={value}
            onChange={(e) => debounce(() => handleChange(e.target.value))}
          />
        )}
        {!inputTag && (
          <input
            key={props.cell.id}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            className={`journal_table-input py-2 px-2 text-dark `}
            disabled={isDisabled}
            type={inputType}
            style={newStyle}
            name={inputName ?? ''}
            value={value}
            onChange={(e) => debounce(() => handleChange(e.target.value))}
          />
        )}
      </div>
    </div>
  )
}

export const UserJournalTableCell = (props) => {
  return (
    <JournalTableCell
      colSpan={props.cell.colSpan}
      additionalStyling={{
        display: 'flex',
        gap: 6,
        ...props.additionalStyling
      }}
    >
      {props.userCell ? (
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
            console.log('isEdit', isEdit)
            console.log('props.userCell', props.userCell)
            return props.handleChangeUserCell(props.userCell, value, isEdit)
          }}
          isDisabled={props.isDisabled}
          inputType={props.cell.inputType}
          inputTag={props.cell.inputTag}
        />
      ) : (
        <JournalTableCellInput
          cell={props.cell}
          additionalStyle={{
            width: '100%'
          }}
          additionalInputStyle={{ ...props.additionalInputStyle }}
          handleChange={(value) => {
            const isEdit = !!props.userCell
            console.log('isEdit', isEdit)
            console.log('props.userCell', props.userCell)
            return props.handleChangeUserCell(props.cell, value, isEdit)
          }}
          isDisabled={props.isDisabled}
          inputType={props.cell.inputType}
          inputTag={props.cell.inputTag}
        />
      )}
    </JournalTableCell>
  )
}

export const TableCellTitle = ({ additionalStyle, backgroundColor, cell }) => {
  if (cell.isTableHeader) {
    return (
      <th
        style={{ ...additionalStyle, ...cell.cellStyle }}
        colSpan={cell.colSpan}
        className={'table_header-title_box'}
      >
        <div className={'table_header-title'} style={{ ...cell.cellStyle }}>
          {cell.content}
        </div>
      </th>
    )
  } else if (cell.isTableSubHeader) {
    return (
      <th
        style={{ ...additionalStyle, ...cell.cellStyle }}
        colSpan={cell.colSpan}
        className={'table-subheader-title_box'}
      >
        <div className={'table-subheader-title'} style={{ ...cell.cellStyle }}>
          {cell.content}
        </div>
      </th>
    )
  }
  return (
    <td
      style={{ ...additionalStyle, backgroundColor, ...cell.cellStyle }}
      colSpan={cell.colSpan}
      className={'table_cell-title_box'}
    >
      <div className={'table_cell-title'} style={{ ...cell.cellStyle }}>
        {cell.content}
      </div>
    </td>
  )
}
