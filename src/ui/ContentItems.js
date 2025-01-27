import React, { useEffect, useState } from 'react'
import { getFormattedDate } from '../utils/helpers'
import ReactSelect from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faEye,
  faEyeSlash,
  faQuestion,
  faTimes
} from '@fortawesome/free-solid-svg-icons'
import ReactQuill from 'react-quill'
import saveIcon from '../assets/images/saveIcon.svg'
import deleteIcon from '../assets/images/delete-icon/deleteIconSpot.png'

import './styles.css'

const TextInput = ({ title, name, value, handleChange, showError, error }) => (
  <div className='content-item__container'>
    <label className='content-item__title'>{title}:</label>
    <input
      className='content-item__description'
      type='text'
      name={name}
      onChange={handleChange}
      value={value}
    />
    {showError && error && <small className='ps-1'>{error}</small>}
  </div>
)

const DateInput = ({ title, name, value, handleChange, showError, error }) => (
  <div className='content-item__container'>
    <label className='content-item__title'>{title}:</label>
    <input
      className='content-item__description'
      type='date'
      name={name}
      onChange={handleChange}
      value={getFormattedDate(value)}
    />
    {showError && error && <small className='ps-1'>{error}</small>}
  </div>
)

const QuillEditor = ({ title, name, value, onChange, showError, error }) => {
  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }],
      [
        'bold',
        'italic',
        'underline',
        { list: 'ordered' },
        { list: 'bullet' },
        { align: [] },
        'blockquote',
        'link'
      ]
    ]
  }

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
    'blockquote',
    'align'
  ]

  return (
    <>
      <label className='content-item__title'>{title}:</label>
      <ReactQuill
        theme='custom'
        name='textQuillStandart'
        modules={quillModules}
        formats={quillFormats}
        onChange={(e) => onChange?.(e, name)}
        value={value ?? ''}
      />
    </>
  )
}

const QuillEditorBox = ({ title, name, value, onChange, showError, error }) => {
  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }], // Header options
      ['bold', 'italic', 'underline', 'strike'], // Text formatting
      [{ list: 'ordered' }, { list: 'bullet' }], // Lists
      [{ align: [] }], // Alignment options
      ['blockquote', 'link', 'image'], // Other options
      ['clean'] // Clear formatting
    ]
  }

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'link',
    'blockquote',
    'align'
  ]

  return (
    <div className='content-item__container'>
      <label className='content-item__title'>{title}:</label>
      <ReactQuill
        theme='snow'
        name='textQuillStandart'
        modules={quillModules}
        formats={quillFormats}
        onChange={(e) => onChange?.(e, name)}
        value={value ?? ''}
      />
      {showError && error && <small className='ps-1'>{error}</small>}
    </div>
  )
}

const SelectInput = ({
  title,
  name,
  value,
  options,
  handleChange,
  showError,
  error
}) => (
  <div className='customUI-item content-item__container'>
    <label className='content-item__title'>{title}:</label>
    <ReactSelect
      className='basic-single'
      classNamePrefix='select'
      defaultValue={value}
      isSearchable={false}
      name={name}
      options={options}
      onChange={handleChange}
    />
    {showError && error && <small className='ps-1'>{error}</small>}
  </div>
)
const LtsGradientButton = ({
  children,
  className,
  onClick,
  style,
  showError,
  error
}) => {
  return (
    <div className='customUI-item ltsGradientButton__container'>
      {' '}
      <span
        className={`ltsGradientButton__button ${className}`}
        style={style}
        onClick={onClick}
      >
        {children}
      </span>
      {showError && error && <small className='ps-1'>{error}</small>}
    </div>
  )
}
const CustomInput = ({
  placeholder = '',
  type,
  value,
  handleChange = () => {},
  name,
  showError = false,
  error = '',
  showHint = false,
  hintText = ''
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [hintMenu, setHintMenu] = useState(false)
  return (
    <div className='customUI-item d-flex flex-column  position-relative'>
      <div className='customInput__container'>
        <input
          type={showPassword ? 'text' : type}
          name={name}
          className='customInput'
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete='new-password'
        />

        {type === 'password' && (
          <FontAwesomeIcon
            icon={showPassword ? faEye : faEyeSlash}
            className='pw-revelared__icon'
            onClick={() => setShowPassword((state) => !state)}
          />
        )}
      </div>
      {showHint && (
        <span
          className='hint-icon'
          onClick={() => setHintMenu((state) => !state)}
        >
          <FontAwesomeIcon icon={faQuestion} />
        </span>
      )}

      {hintMenu && <div className='hint-menu'>{hintText}</div>}

      {showError && error && <small className='error ps-1 '>{error}</small>}
    </div>
  )
}

const LtsButton = ({
  disabled,
  className,
  text,
  background,
  width,
  color,
  border,
  onClick,
  imgClassName,

  type,
  loading = false
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`customUI-item LtsButton ${className}`}
      onClick={onClick}
      style={{
        background: background,
        width: width,
        color: color,
        border: border,
        borderRadius: '10px'
      }}
    >
      <img className={`${imgClassName} noShowIcon `} src={saveIcon}></img>

      {loading ? (
        <span
          className='spinner-border spinner-border-sm'
          style={{ fontSize: '13px', fontWeight: 600 }}
        />
      ) : (
        text
      )}
    </button>
  )
}
const CustomCheckbox = ({ handleChange, checked, text, name, value }) => {
  return (
    <div className='customUI-item customCheckbox__container d-flex py-1'>
      <input
        type='checkbox'
        className='customCheckbox'
        onChange={handleChange}
        checked={checked}
        name={name}
        value={value}
      />
      {text}
    </div>
  )
}
const CustomGradientButton = ({
  children,
  className,
  onClick,
  style,
  showError,
  error
}) => {
  return (
    <div className='custom__input-container '>
      {' '}
      <span
        className={`custom-gradient_button ${className}`}
        style={style}
        onClick={onClick}
      >
        {children}
      </span>
      {showError && error && <small className='ps-1'>{error}</small>}
    </div>
  )
}

const CustomDropdown = ({
  options,
  name,
  width,
  btnClassName,
  title,
  onClick,
  maxHeight,
  dropdownHeaderHeight,
  isSelectable,
  multiple = false,
  isOpen,
  setOpenDropdown,
  exclusive = false,
  preselectedOptions = [],
  showError = false,
  error = null,
  hasResetOption = false
}) => {
  const [localIsOpen, setLocalIsOpen] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState(
    multiple ? preselectedOptions : preselectedOptions[0] || null
  )

  useEffect(() => {
    if (preselectedOptions.length) {
      setSelectedOptions(multiple ? preselectedOptions : preselectedOptions[0])
    }
  }, [preselectedOptions, multiple])

  const toggleDropdown = () => {
    if (exclusive) {
      setOpenDropdown()
    } else {
      setLocalIsOpen(!localIsOpen)
    }
  }

  const handleOptionClick = (option) => {
    if (multiple) {
      handleCheckboxChange(option)
    } else if (isSelectable) {
      const newSelectedOptions =
        selectedOptions?.id === option.id ? null : option
      setSelectedOptions(newSelectedOptions)
      if (exclusive) {
        setOpenDropdown()
      } else {
        setLocalIsOpen(false)
      }
      if (onClick) {
        onClick(newSelectedOptions)
      }
    } else {
      if (selectedOptions === option) {
        setSelectedOptions(null)
      } else {
        setSelectedOptions(option)
      }
      if (exclusive) {
        setOpenDropdown()
      } else {
        setLocalIsOpen(false)
      }
      if (onClick) {
        onClick(option)
      }
    }
  }

  const handleCheckboxChange = (option) => {
    let newSelectedOptions
    if (
      selectedOptions.some((selectedOption) => selectedOption.id === option.id)
    ) {
      newSelectedOptions = selectedOptions.filter(
        (selectedOption) => selectedOption.id !== option.id
      )
    } else {
      newSelectedOptions = [...selectedOptions, option]
    }
    setSelectedOptions(newSelectedOptions)
    if (onClick) {
      onClick(newSelectedOptions)
    }
  }

  const resetSelection = (e) => {
    e.stopPropagation()
    setSelectedOptions(null)
    if (onClick) {
      onClick(null)
    }
  }

  const isDropdownOpen = exclusive ? isOpen : localIsOpen

  return (
    <div
      className='custom_dropdown'
      style={{ width: width, maxHeight: maxHeight }}
    >
      <CustomGradientButton
        className={`dropdown-header ${btnClassName}`}
        onClick={toggleDropdown}
        style={{ maxHeight: dropdownHeaderHeight }}
        showError={showError}
        error={error}
      >
        <span
          className='p-0 w-100'
          style={{
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            display: 'block'
          }}
        >
          {multiple
            ? selectedOptions.length > 0
              ? selectedOptions.map((option) => option.name).join(', ')
              : title || 'Select an option'
            : selectedOptions
            ? selectedOptions.name
            : title || 'Select an option'}
        </span>

        {!multiple && !isSelectable && selectedOptions && hasResetOption && (
          <span
            className='reset-button d-flex justify-content-end cursor-pointer'
            onClick={(e) => resetSelection(e)}
            style={{ color: 'red' }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </span>
        )}

        <span className={`arrow ${isDropdownOpen ? 'open' : ''}`}>
          <FontAwesomeIcon icon={faAngleDown} />
        </span>
      </CustomGradientButton>
      {isDropdownOpen && (
        <>
          <div className='dropdown-list'>
            {options?.map((option, index) => (
              <div
                key={index}
                name={name}
                className='dropdown-list-item'
                onClick={() => !multiple && handleOptionClick(option)}
              >
                {isSelectable && (
                  <input
                    type='checkbox'
                    name={name}
                    className='agGrid-customFilters__checkbox'
                    onChange={() => handleOptionClick(option)}
                    checked={
                      multiple
                        ? selectedOptions.some(
                            (selectedOption) => selectedOption.id === option.id
                          )
                        : selectedOptions?.id === option.id
                    }
                  />
                )}
                {option.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export {
  TextInput,
  DateInput,
  SelectInput,
  LtsGradientButton,
  CustomInput,
  LtsButton,
  CustomCheckbox,
  QuillEditor,
  QuillEditorBox,
  CustomDropdown
}
