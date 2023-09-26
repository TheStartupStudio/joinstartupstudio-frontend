import React from 'react'
import ReactQuill from 'react-quill'
import { FormControl, FormGroup, InputGroup } from 'react-bootstrap'

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
  const newStyle = {
    width: width ?? '100%',
    ...additionalInputStyle
  }

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
            className={`journal_table-input py-2 px-2 text-dark `}
            disabled={isDisabled}
            type={inputType}
            style={{ ...newStyle, resize: 'none' }}
            name={inputName ?? ''}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          />
        )}
        {inputTag === 'input' && (
          <input
            className={`journal_table-input py-2 px-2 text-dark `}
            disabled={isDisabled}
            type={inputType}
            style={newStyle}
            name={inputName ?? ''}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          />
        )}
        {!inputTag && (
          <input
            className={`journal_table-input py-2 px-2 text-dark `}
            disabled={isDisabled}
            type={inputType}
            style={newStyle}
            name={inputName ?? ''}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
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
        />
      ) : (
        <JournalTableCellInput
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
