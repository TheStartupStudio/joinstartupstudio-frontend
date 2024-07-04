import React, { useState } from 'react'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const CustomLoginInput = ({
  placeholder,
  enterLogin,
  onChange,
  cn,
  inputType,
  inputName
}) => {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className={`input-with-gradient-border ${cn}`}>
      <input
        type={showPassword ? 'text' : inputType}
        name={inputName}
        placeholder={placeholder}
        onKeyDown={enterLogin}
        onChange={onChange}
        className='bg-primary'
      />
      {inputType === 'password' ? (
        showPassword ? (
          <FontAwesomeIcon
            icon={faEye}
            className='cursor-pointer'
            onClick={() => setShowPassword((state) => !state)}
          />
        ) : (
          <FontAwesomeIcon
            icon={faEyeSlash}
            className='cursor-pointer'
            onClick={() => setShowPassword((state) => !state)}
          />
        )
      ) : null}
    </div>
  )
}

export default CustomLoginInput
