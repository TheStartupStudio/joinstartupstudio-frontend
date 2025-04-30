import React, { useState } from 'react'
import Select from 'react-select'

function SelectLessons({ 
  options, 
  selectedCourse, 
  setSelectedCourse,
  setShowLockModal,
  setLockModalMessage,
  placeholder 
}) {
  const handleChange = (selectedOption) => {
    if (selectedOption?.disabled) {
      setLockModalMessage('This lesson is currently locked. You must complete the lesson before it to gain access to this lesson.');
      setShowLockModal(true);
      return;
    }
    setSelectedCourse(selectedOption);
  };

  const currentSelection = options?.find(option => 
    option.redirectId === selectedCourse?.redirectId
  );

  const CustomOption = ({ data, innerRef, innerProps }) => (
    <div
      ref={innerRef}
      {...innerProps}
      style={{ 
        cursor: data.disabled ? 'not-allowed' : 'pointer',
        padding: '8px',
        opacity: data.disabled ? 0.6 : 1
      }}
    >
      <div className='d-flex align-items-center gap-2'>
        {data.icon && <img className='accordion-icons' src={data.icon} alt='icon' />}
        <span className={`accordion-content-modal ${data.textColor}`}>
          {data.label}
        </span>
      </div>
    </div>
  );

  const CustomSingleValue = ({ data }) => (
    <div className='custom-select-course' style={{ alignContent: 'end' }}>
      {data.label}
    </div>
  );

  return (
    <div className='select-lessons'>
      <Select
        options={options}
        value={currentSelection || selectedCourse}
        onChange={handleChange}
        isOptionDisabled={(option) => option.disabled}
        placeholder={placeholder || 'Select Journals to View'}
        menuPortalTarget={document.body}
        isSearchable={false}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (base) => ({
            ...base,
            // width: '400px',
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
  );
}

export default SelectLessons;
