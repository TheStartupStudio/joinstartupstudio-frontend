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
  titleHeight
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
        className={`mb-0 info-label p-2 ${titleClassNames} ${textClassNames}`}
        style={{ backgroundColor: '#f3f3f3', minHeight: titleHeight }}
      >
        {title}
      </div>
      {type !== 'text' ? (
        <textarea
          name={name}
          id={name}
          style={{
            backgroundColor: '#fff',
            minHeight: inputHeight,
            resize: 'none'
          }}
          className="w-100 rounded-0 p-2"
          onChange={(e) => onChange?.(e.target.value, 'mentorName')}
          value={value ?? ''}
        />
      ) : (
        <input
          name={name}
          id={name}
          style={{ backgroundColor: '#fff', minHeight: inputHeight }}
          className=" w-100 rounded-0 py-1 px-2"
          onChange={(e) => onChange?.(e.target.value, 'mentorName')}
          value={value ?? ''}
        />
      )}
    </div>
  )
}

export default LabeledInput
