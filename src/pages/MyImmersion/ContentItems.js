import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Avatar from '../../assets/images/profile-image.png'
import './style.css'
import { fileNameExtracter } from '../../utils/helpers'
import React from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

const Textarea = ({ placeholder, name, value, onChange, error, showError }) => {
  return (
    <div>
      <textarea
        style={{ fontSize: '13px' }}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-100 ${
          showError && error ? 'error-border' : 'border'
        } bg-transparent p-2`}
        id=''
        cols='30'
        rows='6'
        placeholder={placeholder}
      ></textarea>
      {showError && error && <small className='ps-1'>{error}</small>}
    </div>
  )
}

const UploadFileInput = ({ filename, placeholder, name, onChange, mode }) => {
  const handleClick = () => {
    if (mode === 'edit' && filename) {
      window.open(filename, '_blank')
    }
  }
  return (
    <label
      className='  immersion-upload-file-input border'
      onClick={handleClick}
    >
      <span className='file-input-placeholder'>
        {mode === 'edit'
          ? fileNameExtracter(filename)
          : filename
          ? filename
          : placeholder}
      </span>
      <FontAwesomeIcon icon={faFileUpload} className='file-input-icon' />
      {mode !== 'edit' && (
        <input
          type='file'
          id='inputGroupFile'
          name={name}
          accept='application/pdf'
          className='file-input'
          onChange={onChange}
        />
      )}
    </label>
  )
}

const SubmitButton = ({ text, type, onClick, disabled, className }) => {
  return (
    <button
      className={className}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
const ProfileHolder = ({ profileImage, name, className, classN }) => {
  return (
    <div className={`${classN} d-flex align-items-center mb-5 `}>
      <div
        className={`profile-dropdown me-1 desktop-menu d-none d-xl-block ${className}`}
      >
        <img src={profileImage ? profileImage : Avatar} alt='Profile' />
      </div>
      <div className={` profile-dropdown-info desktop-menu `}>
        <h5>{name ? name : localStorage.getItem('name')}</h5>
      </div>
    </div>
  )
}
// }

// const TooltipAction = (props) => {
//   return (
//     <OverlayTrigger placement='bottom' overlay={props.tooltipContent}>
//       <div
//         className={'action-box cursor-pointer'}
//         onClick={() => props.onClick?.()}
//       >
//         {props.icon}
//       </div>
//     </OverlayTrigger>
//   )
// }

const TermsAndConditionsCheckbox = ({
  text,
  blueText,
  name,
  onChange,
  checked,
  error,
  showError
}) => {
  return (
    <>
      <div className='terms-checkbox'>
        <input
          type='checkbox'
          id='terms'
          checked={checked}
          name={name}
          onChange={onChange}
        />
        <label htmlFor='terms'>
          {text} <a href='/terms'>{blueText}</a>
        </label>
      </div>
      {showError && error && <small className=''>{error}</small>}
    </>
  )
}

const ParentGuardianButton = ({ text, className }) => {
  return <button className='parentGuardian-button '>{text}</button>
}

export {
  Textarea,
  UploadFileInput,
  SubmitButton,
  ProfileHolder,
  TermsAndConditionsCheckbox,
  ParentGuardianButton
}
