import {
  faGripLines,
  faKey,
  faUser,
  faUserMinus,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons'
import {
  FaPencilAlt,
  FaCheck,
  FaEye,
  FaTrashAlt,
  FaBackspace
} from 'react-icons/fa'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axiosInstance from '../../../utils/AxiosInstance'
import React, { useState, useEffect, useRef, useCallback } from 'react'
// import { useGridFilter } from 'ag-grid-react/lib/main'
import { useGridFilter } from 'ag-grid-react'
import '../MySchool/style.css'
// import ResetPasswordModal from './ResetPasswordModal'
// import AddInstructorModal from './Instructors/AddInstructorModal'
import useModalState from './useModalState'
import AddCourseandCredentialModal from './AddCourseandCredentialModal'
// import DeleteUserModal from './DeleteUserModal'
// import StudentActionsModal from './Learners/StudentActionsModal'
// import TransferStudentsModal from './Learners/TransferStudentsModal'
import DeleteModal from './DeleteImmersionModal'

const CustomHeader = ({ displayName, options, handleOptionClick }) => {
  const [showDropdown, setShowDropdown] = useState(false)
  return (
    <div className='custom-header' style={{ position: 'relative' }}>
      <span>{displayName}</span>
      <FontAwesomeIcon
        className='ms-3'
        icon={faGripLines}
        onClick={() => setShowDropdown((state) => !state)}
      />
      {showDropdown && (
        <div className='dropdown-list'>
          {options.map((option, index) => (
            <div
              key={index}
              className='dropdown-list-item'
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const ActiveInactiveFilter = ({ model, onModelChange, getValue }) => {
  const doesFilterPass = useCallback(
    (params) => {
      const { data } = params

      const value = data.status

      if (model) {
        return value === model
      }
      return true
    },
    [model]
  )

  useGridFilter({ doesFilterPass })

  const handleCheckboxChange = (newValue) => {
    onModelChange(newValue)
  }

  return (
    <div style={{ padding: '4px' }}>
      <div className='agGrid-customFilters__checkbox-container d-flex py-1'>
        <input
          type='checkbox'
          className='agGrid-customFilters__checkbox'
          onChange={() => handleCheckboxChange('active')}
          checked={model === 'active'}
        />
        Active
      </div>
      <div className='agGrid-customFilters__checkbox-container d-flex py-1'>
        <input
          type='checkbox'
          className='agGrid-customFilters__checkbox'
          onChange={() => handleCheckboxChange('unactive')}
          checked={model === 'unactive'}
        />
        Unactive
      </div>
    </div>
  )
}

const AwardTypeFilter = ({ model, onModelChange, getValue }) => {
  const doesFilterPass = useCallback(
    (params) => {
      const { data } = params

      const value = data.type_award // Adjust this to the field you're filtering

      if (model) {
        return value === model
      }
      return true
    },
    [model]
  )

  // Hook to integrate filter logic with AG Grid
  useGridFilter({ doesFilterPass })

  const handleCheckboxChange = (newValue) => {
    if (model === newValue) {
      onModelChange(null) // Unselect the filter if it's already selected
    } else {
      onModelChange(newValue)
    }
  }

  return (
    <div style={{ padding: '4px' }}>
      <div className='agGrid-customFilters__checkbox-container d-flex py-1'>
        <input
          type='checkbox'
          className='agGrid-customFilters__checkbox'
          onChange={() => handleCheckboxChange('Certificate')}
          checked={model === 'Certificate'}
        />
        Certificate
      </div>
      <div className='agGrid-customFilters__checkbox-container d-flex py-1'>
        <input
          type='checkbox'
          className='agGrid-customFilters__checkbox'
          onChange={() => handleCheckboxChange('Credential')}
          checked={model === 'Credential'}
        />
        Credential
      </div>
    </div>
  )
}

const LevelsFilter = ({ model, onModelChange, getValue }) => {
  const [selectedLevels, setSelectedLevels] = useState(model || [])
  const doesFilterPass = useCallback(
    (params) => {
      const { node } = params
      const value = getValue(node)

      if (selectedLevels.length === 0) {
        return true
      }

      if (model) {
        // return value === model
        return selectedLevels.some((level) => value.includes(level))
      }
      return true
    },
    [model, getValue, selectedLevels]
  )

  useGridFilter({ doesFilterPass })

  const handleCheckboxChange = (level) => {
    setSelectedLevels((prevSelected) =>
      prevSelected.includes(level)
        ? prevSelected.filter((p) => p !== level)
        : [...prevSelected, level]
    )
    onModelChange(level)
  }

  return (
    <div style={{ padding: '4px' }}>
      <div className='agGrid-customFilters__checkbox-container d-flex py-1'>
        <input
          type='checkbox'
          className='agGrid-customFilters__checkbox'
          onChange={() => handleCheckboxChange('HS')}
          checked={selectedLevels.includes('HS')}
        />
        High school
      </div>
      <div className='agGrid-customFilters__checkbox-container d-flex py-1'>
        <input
          type='checkbox'
          className='agGrid-customFilters__checkbox'
          onChange={() => handleCheckboxChange('MS')}
          checked={selectedLevels.includes('MS')}
        />
        Middle School
      </div>
      <div className='agGrid-customFilters__checkbox-container d-flex py-1'>
        <input
          type='checkbox'
          className='agGrid-customFilters__checkbox'
          onChange={() => handleCheckboxChange('LS')}
          checked={selectedLevels.includes('LS')}
        />
        Low School
      </div>
    </div>
  )
}

const PROGRAMS_OPTIONS = [
  'Community-Ready',
  'Community-Active',
  'Market-Ready',
  'Market-Active'
]
const ProgramsFilter = ({ model, onModelChange, getValue }) => {
  const [selectedPrograms, setSelectedPrograms] = useState(model || [])

  const doesFilterPass = useCallback(
    (params) => {
      const { data } = params
      const programs = data.programs || data.program || []

      if (selectedPrograms.length === 0) {
        return true
      }

      if (Array.isArray(programs)) {
        return selectedPrograms.some((selectedProgram) =>
          programs.includes(selectedProgram)
        )
      } else {
        return selectedPrograms.includes(programs)
      }
    },
    [selectedPrograms]
  )

  useGridFilter({ doesFilterPass })

  const handleCheckboxChange = (program) => {
    const updatedSelectedPrograms = selectedPrograms.includes(program)
      ? selectedPrograms.filter((p) => p !== program)
      : [...selectedPrograms, program]

    setSelectedPrograms(updatedSelectedPrograms)
    onModelChange(updatedSelectedPrograms)
  }

  return (
    <div style={{ padding: '4px' }}>
      {PROGRAMS_OPTIONS.map((program) => (
        <div
          className='agGrid-customFilters__checkbox-container d-flex py-1'
          key={program}
        >
          <input
            type='checkbox'
            className='agGrid-customFilters__checkbox'
            onChange={() => handleCheckboxChange(program)}
            checked={selectedPrograms.includes(program)}
          />
          {program}
        </div>
      ))}
    </div>
  )
}

const TRANSFER_OPTIONS = ['none', 'requested', 'transferred', 'denied']
const TransferFilter = ({ model, onModelChange, getValue }) => {
  const [selectedTransferStatus, setSelectedTransferStatus] = useState(
    model || []
  )

  const doesFilterPass = useCallback(
    (params) => {
      const { data } = params
      const transferStatus = data.transferStatus || []

      if (selectedTransferStatus.length === 0) {
        return true
      }

      return selectedTransferStatus.includes(transferStatus.toLowerCase())
    },
    [selectedTransferStatus]
  )

  useGridFilter({ doesFilterPass })

  const handleCheckboxChange = (transfer) => {
    const updatedSelectedTransfers = selectedTransferStatus.includes(transfer)
      ? selectedTransferStatus.filter((p) => p !== transfer)
      : [...selectedTransferStatus, transfer]

    setSelectedTransferStatus(updatedSelectedTransfers)
    onModelChange(updatedSelectedTransfers)
  }

  return (
    <div style={{ padding: '4px' }}>
      {TRANSFER_OPTIONS.map((transfer) => (
        <div
          className='agGrid-customFilters__checkbox-container d-flex py-1'
          key={transfer}
        >
          <input
            type='checkbox'
            className='agGrid-customFilters__checkbox'
            onChange={() => handleCheckboxChange(transfer)}
            checked={selectedTransferStatus.includes(transfer)}
          />
          {transfer}
        </div>
      ))}
    </div>
  )
}

const CustomSelectCellEditor = (props) => {
  const { values } = props
  const [selectedValue, setSelectedValue] = useState(props.value)
  const selectRef = useRef(null)

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.focus()
    }
  }, [])

  const onChange = (event) => {
    setSelectedValue(event.target.value)
  }

  return (
    <select value={selectedValue} onChange={onChange} className='custom-select'>
      <option className='select-options' value={'title'}>
        {props.placeHolder}
      </option>
      {values.map((value, index) => (
        <option className='select-options' key={index} value={value}>
          {value}
        </option>
      ))}
    </select>
  )
}

const Icon = ({ isOpen }) => {
  return (
    <svg
      viewBox='0 0 24 24'
      width='18'
      height='18'
      stroke='#222'
      strokeWidth='1.5'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={isOpen ? 'translate' : ''}
    >
      <polyline points='6 9 12 15 18 9'></polyline>
    </svg>
  )
}

const CloseIcon = () => {
  return (
    <svg
      viewBox='0 0 24 24'
      width='14'
      height='14'
      stroke='#fff'
      strokeWidth='2'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='18' y1='6' x2='6' y2='18'></line>
      <line x1='6' y1='6' x2='18' y2='18'></line>
    </svg>
  )
}

const CustomSelect = ({
  placeHolder,
  options,
  isMulti,
  isSearchable,
  onChange,
  align
}) => {
  // State variables using React hooks
  const [showMenu, setShowMenu] = useState(false) // Controls the visibility of the dropdown menu
  const [selectedValue, setSelectedValue] = useState(isMulti ? [] : null) // Stores the selected value(s)
  const [searchValue, setSearchValue] = useState('') // Stores the value entered in the search input
  const searchRef = useRef() // Reference to the search input element
  const inputRef = useRef() // Reference to the custom select input element

  useEffect(() => {
    setSearchValue('')
    if (showMenu && searchRef.current) {
      searchRef.current.focus()
    }
  }, [showMenu])

  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }

    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('click', handler)
    }
  })

  const handleInputClick = (e) => {
    setShowMenu(!showMenu)
  }

  const getDisplay = () => {
    if (!selectedValue || selectedValue.length === 0) {
      return placeHolder
    }
    if (isMulti) {
      return (
        <div className='dropdown-tags'>
          {selectedValue.map((option, index) => (
            <div key={`${option.value}-${index}`} className='dropdown-tag-item'>
              {option.label}
              <span
                onClick={(e) => onTagRemove(e, option)}
                className='dropdown-tag-close'
              >
                <CloseIcon />
              </span>
            </div>
          ))}
        </div>
      )
    }
    return selectedValue.label
  }

  const removeOption = (option) => {
    return selectedValue.filter((o) => o.value !== option.value)
  }

  const onTagRemove = (e, option) => {
    e.stopPropagation()
    const newValue = removeOption(option)
    setSelectedValue(newValue)
    onChange(newValue)
  }

  const onItemClick = (option) => {
    let newValue
    if (isMulti) {
      if (selectedValue.findIndex((o) => o.value === option.value) >= 0) {
        newValue = removeOption(option)
      } else {
        newValue = [...selectedValue, option]
      }
    } else {
      newValue = option
    }
    setSelectedValue(newValue)
    onChange(newValue)
  }

  const isSelected = (option) => {
    if (isMulti) {
      return selectedValue.filter((o) => o.value === option.value).length > 0
    }

    if (!selectedValue) {
      return false
    }

    return selectedValue.value === option.value
  }

  const onSearch = (e) => {
    setSearchValue(e.target.value)
  }

  const getOptions = () => {
    if (!searchValue) {
      return options
    }

    return options.filter(
      (option) =>
        option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
    )
  }

  return (
    <div className='custom--dropdown-container'>
      <div ref={inputRef} onClick={handleInputClick} className='dropdown-input'>
        <div
          className={`dropdown-selected-value ${
            !selectedValue || selectedValue.length === 0 ? 'placeholder' : ''
          }`}
        >
          {getDisplay()}
        </div>
        <div className='dropdown-tools'>
          <div className='dropdown-tool'>
            <Icon isOpen={showMenu} />
          </div>
        </div>
      </div>

      {showMenu && (
        <div className={`dropdown-menu alignment--${align || 'auto'}`}>
          {isSearchable && (
            <div className='search-box'>
              <input
                className='form-control'
                onChange={onSearch}
                value={searchValue}
                ref={searchRef}
              />
            </div>
          )}
          {getOptions().map((option) => (
            <div
              onClick={() => onItemClick(option)}
              key={option.value}
              className={`dropdown-item ${isSelected(option) && 'selected'}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const Actions = ({
  setViewExprience,
  immersion,
  setViewDeleteModal,
  onSuccess,
  handleConfirmDeleteFrom,
  setShowDeleteModal,
  setDeleteImmersion
}) => {
  const [modals, setModalState] = useModalState()

  const handleDeleteExperience = (e) => {
    e.preventDefault() // Prevent default navigation behavior
    setShowDeleteModal(true)

    setDeleteImmersion(immersion)
    // setViewExprience(immersion)
  }

  return (
    <div>
      <div className='d-flex align-items-center agGrid__actions'>
        {/* View Item */}
        <div
          className='action-item cursor-pointer'
          onClick={() => setViewExprience(immersion)}
        >
          <a href='/my-school/learners' className='pe-1'>
            <FaEye style={{ fontSize: '16px', color: 'grey' }} />
          </a>
          <p className='m-0 pe-2'> View Item</p>
        </div>

        {/* Delete Item */}
        <div
          className='action-item cursor-pointer'
          onClick={handleDeleteExperience}
        >
          <a href='/my-school/learners' className='pe-1'>
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              style={{ fontSize: '16px', color: 'grey' }}
            />
          </a>
          <p className='m-0 pe-2'> Delete Item</p>
        </div>
      </div>

      {/* DeleteModal Integration */}
    </div>
  )
}

export {
  CustomHeader,
  ActiveInactiveFilter,
  AwardTypeFilter,
  LevelsFilter,
  ProgramsFilter,
  TransferFilter,
  CustomSelectCellEditor,
  CustomSelect,
  Actions
}
