import React, { useCallback } from 'react'
import _ from 'lodash'

const JournalTableCellInput = (props) => {
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
              setLoading?.(true)
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
            value={value}
            onKeyDown={handleTabKey}
            onChange={(e) => {
              handleChange(e.target.value)
              setLoading?.(true)
            }}
            {...(inputType === 'number' && { step: 'any' })}
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
              setLoading?.(true)
            }}
            {...(inputType === 'number' && { step: 'any' })}
          />
        )}
      </div>
    </div>
  )
}
export default JournalTableCellInput
