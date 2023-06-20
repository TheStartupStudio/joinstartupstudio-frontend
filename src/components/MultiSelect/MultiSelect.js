import React, { useEffect, useState } from 'react'
import './MultiSelect.css'

const MultiSelectDropdown = (props) => {
  const [selectedOptions, setSelectedOptions] = useState(props.options ?? [])

  const [isOpen, setIsOpen] = useState(false)

  const [options, setOptions] = useState(props.periods)

  useEffect(() => {
    if (props.options) setSelectedOptions(props.options)
  }, [props.options])
  useEffect(() => {
    if (props.periods) setOptions(props.periods)
  }, [props.periods])

  useEffect(() => {
    props.handleChange(selectedOptions)
  }, [selectedOptions])
  const handleOptionToggle = (option) => {
    const selectedIndex = selectedOptions?.findIndex(
      (selectedOption) => selectedOption.id === option.id
    )

    let updatedOptions = [...selectedOptions]

    if (selectedIndex === -1) {
      updatedOptions.push(option)
    } else {
      updatedOptions.splice(selectedIndex, 1)
    }

    setSelectedOptions(updatedOptions)
  }

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleDeleteAllOptions = () => {
    setSelectedOptions([])
  }

  return (
    <div className="multiselect-dropdown">
      <div
        className={`dropdown-input ${isOpen ? 'open' : ''}`}
        onClick={handleDropdownToggle}
      >
        <div style={{ width: '90%', display: 'flex', flexWrap: 'wrap' }}>
          {selectedOptions?.length === 0 ? (
            <span className="placeholder">Select options...</span>
          ) : (
            selectedOptions?.map((option, index) => (
              <span className="chip" key={index}>
                {option.name}
                <button
                  className="chip-remove"
                  onClick={() => handleOptionToggle(option)}
                >
                  &times;
                </button>
              </span>
            ))
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          {selectedOptions?.length > 0 && (
            <span
              className="delete-all-options"
              onClick={handleDeleteAllOptions}
            >
              X
            </span>
          )}
          <span className={`dropdown-arrow ${isOpen ? 'up' : 'down'}`}>
            {isOpen ? '\u25B2' : '\u25BC'}
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {options?.map((option, index) => (
            <label key={index} className="option-label">
              <input
                type="checkbox"
                checked={selectedOptions?.some(
                  (selectedOption) => selectedOption.id === option.id
                )}
                onChange={() => handleOptionToggle(option)}
              />
              <div>{option.name}</div>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default MultiSelectDropdown
