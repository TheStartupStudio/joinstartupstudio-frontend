import React from 'react'
import './style.css'

const CustomLoginInput = ({
  placeholder,
  enterLogin,
  onChange,
  cn,
  inputType,
  inputName
}) => {
  return (
    <div className={`input-with-gradient-border ${cn}`}>
      <input
        type={inputType}
        name={inputName}
        placeholder={placeholder}
        onKeyDown={enterLogin}
        onChange={onChange}
      />
    </div>
  )
}

export default CustomLoginInput
