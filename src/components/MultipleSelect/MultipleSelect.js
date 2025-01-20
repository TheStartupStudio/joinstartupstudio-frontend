import React, { useState, useEffect } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import './MultipleSelect.css'

const MultipleSelect = (props) => {
  const {
    label,
    options,
    selectedOptions,
    isOpen: initialIsOpen,
    toggleDropdown,
    renderOptions,
    displaySelectedOptions,
    handleOptionToggle,
  } = props
  const [isOpen, setIsOpen] = useState(initialIsOpen)

  useEffect(() => {
    setIsOpen(initialIsOpen)
  }, [initialIsOpen])

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen)
    toggleDropdown?.()
  }

  return (
    <div className='multiple-select_dropdown'>
      <div className='multiple-select_label'>{label}</div>
      <div
        className={`d-flex align-items-center justify-content-between multiple-select_dropdown-input ${isOpen ? 'open' : ''}`}
        onClick={handleDropdownToggle}
      >
        <div>{selectedOptions.length > 0 ? displaySelectedOptions(selectedOptions): <span style={{fontSize:14}}>Click to select any period</span>}</div>

        <div className="ml-auto">
    <span className={`multiple-select_dropdown-arrow ${isOpen ? 'up' : 'down'}`}>
      {isOpen ? <FaChevronUp width={16} /> : <FaChevronDown width={16} />}
    </span>
        </div>
      </div>

      {isOpen && (
        <div className='multiple-select_dropdown-options'>
          {options?.map((option, index) => (
            <div key={index}>
              {renderOptions({
                option,
                handleOptionToggle,
                selectedOptions,
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MultipleSelect
