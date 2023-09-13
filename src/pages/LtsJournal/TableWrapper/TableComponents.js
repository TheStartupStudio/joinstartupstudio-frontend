import React from 'react'

export const JournalTableRow = (props) => {
  return <tr className={'journal_table-row'}>{props.children}</tr>
}
export const JournalTableCell = (props) => {
  const { isGray, colSpan, additionalStyling } = props
  return (
    <td
      colSpan={colSpan}
      style={{
        backgroundColor: isGray ? '#dfdfdf' : '#fff',
        ...additionalStyling
      }}
      className={'journal_table-data'}
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
    isDisabled
  } = props
  return (
    <div
      className={'journal_table-input__container'}
      style={{ ...props.additionalStyle }}
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
        <input
          className={`journal_table-input my-1 py-2 px-2 text-dark `}
          disabled={isDisabled}
          type={type}
          style={{
            width: width ?? '100%'
          }}
          name={inputName ?? ''}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  )
}
