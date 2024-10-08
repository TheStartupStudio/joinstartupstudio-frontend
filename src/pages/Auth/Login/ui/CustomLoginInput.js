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
    <div
      className={`input-with-gradient-border ${cn}`}
      style={{ position: 'relative' }}
    >
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
          <div
            style={{
              // backgroundColor: '#e8f0fe',
              height: '45px',
              width: '50px',
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              position: 'absolute',
              right: 0
            }}
          >
            <FontAwesomeIcon
              icon={faEye}
              className='cursor-pointer'
              onClick={() => setShowPassword((state) => !state)}
              style={{ alignSelf: 'center' }}
            />
          </div>
        ) : (
          <div
            style={{
              // backgroundColor: '#e8f0fe',
              height: '45px',
              width: '50px',
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'center',
              justifyContent: 'center',
              borderRadius: '12px',
              position: 'absolute',
              right: 0
            }}
          >
            <FontAwesomeIcon
              icon={faEyeSlash}
              className='cursor-pointer'
              onClick={() => setShowPassword((state) => !state)}
              style={{ alignSelf: 'center' }}
            />
          </div>
        )
      ) : null}
    </div>
  )
}

export default CustomLoginInput
