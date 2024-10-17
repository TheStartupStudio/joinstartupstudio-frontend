import React from 'react'
import './LabeledCheckbox.css'

const LabeledCheckbox = ({ checked, onChange, label }) => {
  return (
    <label className='checkbox-label'>
      <input
        type='checkbox'
        checked={checked}
        onChange={onChange}
        className='labeled-checkbox-input'
        style={{ width: 14, height: 14 }}
      />
      <div className={'labeled-checkbox-label'}>
        {label}
      </div>
    </label>
  );
};


export default LabeledCheckbox