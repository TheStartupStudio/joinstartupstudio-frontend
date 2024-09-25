import React from 'react'

const LabeledInput = ({
  title,
  name,
  value,
  onChange,
  width,
  titleClassNames,
  containerClassNames,
  textClassNames,
  inputHeight,
  type,
  placeholder,
  labelAlign,
  titleHeight,
  align,
  readOnly,
  p
}) => {
  return (
    <div
      className={`${containerClassNames ? containerClassNames : ''}`}
      style={{
        border: '1px solid #d4d5d6',
        width: width ? width : '100%',
        overflow: 'hidden',
        background: '#FFFFFF 0% 0% no-repeat padding-box',
        boxShadow: '0px 3px 6px #00000029',
        borderRadius: 12
      }}
    >
      <div
        className={`portf-input-title mb-0 info-label p-2 ${
          titleClassNames ?? ''
        } ${textClassNames ?? ''} justify-content-${labelAlign}`}
        style={{
          // backgroundColor: '#F6F7F7',
          minHeight: titleHeight
        }}
      >
        {title}
      </div>
      {!readOnly ? (
        type !== 'text' ? (
          <textarea
            name={name}
            id={name}
            style={{
              backgroundColor: '#fff',
              minHeight: inputHeight,
              resize: 'none',
              textAlign: 'center'
            }}
            className='w-100 rounded-0 p-2'
            onChange={(e) => onChange?.(e.target.value, 'mentorName')}
            value={value?.trim() !== '' ? value : ''}
            readOnly={readOnly}
            placeholder={placeholder}
          />
        ) : (
          <input
            name={name}
            id={name}
            style={{
              backgroundColor: '#fff',
              minHeight: inputHeight
            }}
            className=' w-100 rounded-0 py-1 px-2'
            onChange={(e) => onChange?.(e.target.value, 'mentorName')}
            value={value?.trim() !== '' ? value : ''}
            placeholder={placeholder}
            readOnly={readOnly}
          />
        )
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: value }}
          style={{
            backgroundColor: '#fff',
            minHeight: inputHeight ?? 35,
            resize: 'none'
          }}
          className='w-100 rounded-0 p-2'
        />
      )}
    </div>
  )
}

export default LabeledInput
