import React from 'react'

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

export default SubmitButton
