import React from 'react'
import './style.css'

const FormWrapper = ({ children, className, style }) => {
  return (
    <div className={`public-login-form ${className}`} style={style}>
      {children}
    </div>
  )
}

export default FormWrapper
