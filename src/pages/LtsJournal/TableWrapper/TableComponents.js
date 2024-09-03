import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill'
import { FormControl, FormGroup, InputGroup } from 'react-bootstrap'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'

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
      className={'journal_table-data journal-table-border'}
      // className={'table_cell-title_box'}
    >
      {props.children}
    </td>
  )
}
const EditButton = (props) => {
  return (
    <span
      style={{
        backgroundColor: '#fff',
        height: '100%',
        padding: '8px 0',
        cursor: 'pointer'
      }}
      className={'d-flex justify-content-end align-items-center z-2 '}
      onClick={() => {
        props.openEditBox()
      }}
    >
      <FontAwesomeIcon className={'me-2'} icon={faPencilAlt} />
    </span>
  )
}

export const JournalTableCellInput = (props) => {
  const {
    cell,
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
    inputType,
    inputRef,
    setLoading
  } = props

  const handleTabKey = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
    }
  }
  const newStyle = {
    width: width ?? '100%',
    ...additionalInputStyle
  }

  const debounce = useCallback(
    _.debounce(async (func, value) => {
      func('debounce', value)
    }, 500),
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
            key={props.cell?.id}
            ref={inputRef}
            className={`journal_table-input py-2 px-2 text-dark `}
            disabled={isDisabled}
            // type={inputType}
            style={{ ...newStyle, resize: 'none' }}
            name={'textarea'}
            defaultValue={value}
            onKeyDown={handleTabKey}
            onChange={(e) => {
              debounce(() => handleChange(e.target.value))
              setLoading(true)
            }}
          />
        )}
        {inputTag === 'input' && (
          <input
            key={props.cell?.id}
            ref={inputRef}
            className={`journal_table-input py-2 px-2 text-dark `}
            disabled={isDisabled}
            type={inputType}
            style={newStyle}
            name={inputName ?? ''}
            defaultValue={value}
            onKeyDown={handleTabKey}
            onChange={(e) => {
              debounce(() => handleChange(e.target.value))
              setLoading(true)
            }}
          />
        )}
        {!inputTag && (
          <input
            key={props.cell?.id}
            ref={inputRef}
            className={`journal_table-input py-2 px-2 text-dark `}
            disabled={isDisabled}
            type={inputType}
            style={newStyle}
            name={inputName ?? ''}
            value={value}
            onKeyDown={handleTabKey}
            onChange={(e) => {
              debounce(() => handleChange(e.target.value))
              setLoading(true)
            }}
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
              className=''
              style={{
                color: '#01c5d1',
                position: 'absolute',
                zIndex: 999,
                bottom: 0,
                right: 13
              }}
            >
              <FontAwesomeIcon icon={faSpinner} className='' spin />
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
