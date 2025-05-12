import React, { useState } from 'react'
import Select from 'react-select'
import lockSign from '../../assets/images/academy-icons/lock.png'
import tickSign from '../../assets/images/academy-icons/tick-sign.png'
import circleSign from '../../assets/images/academy-icons/circle-fill.png'

function SelectCourses({ options, selectedCourse, setSelectedCourse, placeholder, isDisabled }) {
  // Process options to add the appropriate icon
  const processedOptions = options.map(option => {
    // Clone the option to avoid mutating the original
    const newOption = { ...option };
    
    // Add icon based on status
    if (isDisabled(option)) {
      newOption.icon = lockSign;
      newOption.textColor = 'text-secondary';
    } else if (option.isNext) {
      newOption.icon = circleSign;
      newOption.textColor = 'text-black';
    } else {
      newOption.icon = tickSign;
      newOption.textColor = 'text-black';
    }
    
    return newOption;
  });

  const handleChange = (selectedOption) => {
    if (selectedOption.icon !== lockSign) {
      setSelectedCourse((prev) => ({ ...prev, option: selectedOption }))
      console.log('Selected Journal:', selectedOption.value)
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
      <div className='d-flex align-items-center gap-2'>
        <img className='accordion-icons' src={data.icon} alt={data.icon === lockSign ? 'lock' : data.icon === circleSign ? 'circle' : 'tick'} />
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
        options={processedOptions}
        value={selectedCourse?.option}
        onChange={handleChange}
        isOptionDisabled={isOptionDisabled}
        placeholder={placeholder}
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