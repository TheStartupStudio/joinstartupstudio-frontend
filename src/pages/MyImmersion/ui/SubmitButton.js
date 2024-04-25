import React from 'react'

const SubmitButton = ({ text, type, onClick, disabled }) => {
  return (
    <button
      className="submit-button"
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  )
}

export default SubmitButton
