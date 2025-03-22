import React, { useState } from 'react'
import Select from 'react-select'

function SelectCourses({ options, selectedCourse, setSelectedCourse }) {
  const handleChange = (selectedOption) => {
    setSelectedCourse((prev) => ({ ...prev, option: selectedOption }))
    console.log('Selected Language:', selectedOption.value)
  }

  const CustomOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      style={{ cursor: 'pointer', padding: '8px' }}
    >
      <div className='d-flex align-items-center gap-2 '>
        <img className='accordion-icons' src={data.icon} alt='tick' />
        <span className={`accordion-content-modal ${data.textColor}`}>
          {data.label}
        </span>
      </div>
    </div>
  )

  const CustomSingleValue = ({ data }) => (
    <div className='custom-select-course' style={{ alignContent: 'end' }}>
      {data.label}
    </div>
  )

  return (
    <div className='col-3'>
      <Select
        options={options}
        value={selectedCourse?.option}
        onChange={handleChange}
        placeholder='Select Journals to View'
        menuPortalTarget={document.body}
        isSearchable={false}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base) => ({
            ...base,
            width: '100%',
            minHeight: '40px',
            overflow: 'hidden',
            borderRadius: '6px',
            border: 'none',
            boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 10px 0px',
            cursor: 'pointer'
          }),
          singleValue: (base) => ({
            ...base,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          })
        }}
        components={{
          IndicatorSeparator: () => null,
          Option: CustomOption,
          SingleValue: CustomSingleValue
        }}
      />
    </div>
  )
}

export default SelectCourses
