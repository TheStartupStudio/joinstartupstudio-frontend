import {
  faAngleDown,
  faAward,
  faChalkboardTeacher,
  faCheck,
  faEye,
  faEyeSlash,
  faGraduationCap,
  faPencilAlt,
  faSearch,
  faTimes,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import {
  buildStyles,
  CircularProgressbarWithChildren
} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const InfoBox = ({
  children,
  isEditable,
  cn,
  style,
  setMode,
  hasChanges,
  onSaveChanges
}) => {
  const [inEditMode, setInEditMode] = useState(false)

  useEffect(() => {
    if (!isEditable) {
      setInEditMode(false)
    }
  }, [isEditable])

  const handleToggleMode = () => {
    if (inEditMode) {
      if (hasChanges) {
        onSaveChanges()
        setInEditMode(false)
        setMode('view')
      } else {
        setInEditMode(false)
        setMode('view')
      }
    } else {
      setInEditMode(!inEditMode)
      setMode(inEditMode ? 'view' : 'edit')
    }
  }

  return (
    <div className={`info-box ${cn}`} style={style}>
      {isEditable && (
        <div className='check-button' onClick={handleToggleMode}>
          <FontAwesomeIcon
            icon={inEditMode ? (hasChanges ? faCheck : faTimes) : faPencilAlt}
          />
        </div>
      )}
      {children}
    </div>
  )
}

const SkillBox = ({ color, text, className, withStatus }) => {
  return (
    <div
      className={`d-flex align-items-center skillBox-${color}`}
      style={{
        borderRadius: '20px',
        minHeight: '25px',
        width: 'auto',
        margin: '.5rem .5rem',
        padding: '3px 5px',
        lineHeight: '15px'
      }}
    >
      {withStatus && <span className={`dot__${color || text} me-2`}></span>}
      <span className={`${className} `}>{text}</span>
    </div>
  )
}

const DetailsInfoBox = ({ children }) => {
  return <div className='details-info-box my-3 p-2'>{children}</div>
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
    <div className='custom__input-container'>
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
  error = null
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
      setSelectedOptions(option)
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
          className='p-0'
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

const CustomSearchBar = ({ onChange, className }) => {
  return (
    <div className={`custom-searchbar ${className}`}>
      <FontAwesomeIcon icon={faSearch} />
      <input
        type='text'
        className='bg-transparent'
        placeholder='Search by company name'
        onChange={onChange}
      />
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
  error = ''
}) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className='custom__input-container d-flex flex-column align-items-center position-relative'>
      <input
        type={showPassword ? 'text' : type}
        name={name}
        className='custom__input w-100 my-2'
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />

      {type === 'password' && (
        <FontAwesomeIcon
          icon={showPassword ? faEye : faEyeSlash}
          className='pw-revelared__icon'
          onClick={() => setShowPassword((state) => !state)}
        />
      )}
      {showError && error && <small className='ps-1'>{error}</small>}
    </div>
  )
}

const iconMap = {
  studying: faChalkboardTeacher,
  award: faAward,
  users: faUsers,
  graduationCap: faGraduationCap
}

const CountTotalReport = ({ title, totalCount, iconIdentifier, loading }) => {
  const icon = iconMap[iconIdentifier]

  return (
    <div className='countTotalReport'>
      <Row className='m-0 pb-1'>
        <span className='w-50 p-0'>
          {loading ? <Skeleton width={50} /> : 'Total'}
        </span>
        {loading ? (
          <Skeleton width={20} height={10} />
        ) : (
          <FontAwesomeIcon icon={icon} className='w-50' />
        )}
      </Row>
      <p className='m-0 pb-2'>{loading ? <Skeleton width={80} /> : title}</p>
      <h3>{loading ? <Skeleton width={40} /> : totalCount}</h3>
    </div>
  )
}

const CircularProgressComponent = ({ percentage, year, loading }) => {
  return (
    <div className='circularProgressContainer'>
      <CircularProgressbarWithChildren
        strokeWidth={11}
        value={percentage}
        styles={buildStyles({
          rotation: 0,
          strokeLinecap: 'butt',
          textSize: '16px',
          pathTransitionDuration: 0.5,
          // pathTransition: 'none',
          pathColor: `rgba(82, 199, 222,1)`,
          textColor: '#52C7DE',
          trailColor: '#52c7de33',
          backgroundColor: '#52C7DE'
        })}
      >
        <Col className='d-flex flex-column align-items-center justify-content-center'>
          <h1 style={{ color: '#52C7DE' }}>{percentage} % </h1>
          <p>{year}</p>
        </Col>
      </CircularProgressbarWithChildren>
      {/* )} */}
    </div>
  )
}

const SubmitButton = ({
  className,
  text,
  background,
  width,
  color,
  border,
  onClick
}) => {
  return (
    <button
      className={`lts-button ${className}`}
      onClick={onClick}
      style={{
        background: background,
        width: width,
        color: color,
        border: border
      }}
    >
      {text}
    </button>
  )
}

export {
  SkillBox,
  InfoBox,
  DetailsInfoBox,
  CustomGradientButton,
  CustomDropdown,
  CustomSearchBar,
  CountTotalReport,
  CircularProgressComponent,
  CustomInput,
  SubmitButton
}
