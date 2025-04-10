import React, { useState } from 'react'
import Select from 'react-select'
import lockSign from '../../assets/images/academy-icons/lock.png'

function SelectCourses({ options, selectedCourse, setSelectedCourse }) {
  const handleChange = (selectedOption) => {
    if (selectedOption.icon !== lockSign) {
      setSelectedCourse((prev) => ({ ...prev, option: selectedOption }))
      console.log('Selected Language:', selectedOption.value)
    }
  }

  const isOptionDisabled = (option) => {
    return option.icon === lockSign
  }

  const CustomOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      style={{ 
        cursor: data.icon === lockSign ? 'not-allowed' : 'pointer',
        padding: '8px',
        opacity: data.icon === lockSign ? 0.6 : 1
      }}
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
    <div>
      <Select
        options={options}
        value={selectedCourse?.option}
        onChange={handleChange}
        isOptionDisabled={isOptionDisabled}
        placeholder='Select Journals to View'
        menuPortalTarget={document.body}
        isSearchable={false}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base) => ({
            ...base,
            width: '275px',
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
