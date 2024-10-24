import React, { useState, useEffect } from 'react'
import './IamrSkillSelector.css'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const IAMRSkillSelector = (props) => {
  const {
    options,
    selectedOptions,
    handleChange,
    isOpen: initialIsOpen,
    toggleDropdown
  } = props
  const [isOpen, setIsOpen] = useState(initialIsOpen)

  useEffect(() => {
    setIsOpen(initialIsOpen)
  }, [initialIsOpen])

  // console.log('options', options)
  const handleOptionToggle = (option) => {
    // console.log('option', option)
    const newOption = { ...option }
    delete newOption.id
    const newOptionWithOutId = { ...option, iamrSkillId: option.id }
    // console.log('selectedOptions', selectedOptions)
    const selectedIndex = selectedOptions?.findIndex(
      (selectedOption) => selectedOption?.iamrSkillId === option.id
    )

    let updatedOptions = [...selectedOptions]

    if (selectedIndex === -1) {
      updatedOptions.push(newOptionWithOutId)
    } else {
      updatedOptions.splice(selectedIndex, 1)
    }

    handleChange(updatedOptions)
  }

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen)
    toggleDropdown?.()
  }

  const handleDeleteAllOptions = () => {
    handleChange([])
  }

  return (
    <div className='multiselect-dropdown'>
      <div
        className={`dropdown-input ${isOpen ? 'open' : ''}`}
        onClick={handleDropdownToggle}
      >
        <div className={'multiselect-title'}>{props?.title}</div>

        <div
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        >
          <span className={`dropdown-arrow ${isOpen ? 'up' : 'down'}`}>
            {isOpen ? <FaChevronUp width={16} /> : <FaChevronDown width={16} />}
          </span>
        </div>
      </div>
      {isOpen && (
        <div className='dropdown-options'>
          {options?.map((option, index) => (
            <label key={index} className='option-label'>
              <input
                type='checkbox'
                checked={selectedOptions?.some(
                  (selectedOption) => selectedOption?.iamrSkillId === option.id
                )}
                onChange={() => handleOptionToggle(option)}
                className='multiselect-option-checkbox'
              />
              <div className={'multiselect-option'}>
                {option.title}: {option.description}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default IAMRSkillSelector
