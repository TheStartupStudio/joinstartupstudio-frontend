import React from 'react'
import './style.css'

const TermsAndConditionsCheckbox = ({
  text,
  blueText,
  name,
  onChange,
  checked
}) => {
  return (
    <div className="terms-checkbox">
      <input
        type="checkbox"
        id="terms"
        checked={checked}
        name={name}
        onChange={onChange}
      />
      <label htmlFor="terms">
        {text} <a href="/terms">{blueText}</a>
      </label>
    </div>
  )
}

export default TermsAndConditionsCheckbox
