import React from 'react'

const Textarea = ({ placeholder, name, onChange, value }) => {
  return (
    <textarea
      style={{ fontSize: '13px' }}
      name={name}
      onChange={onChange}
      className="w-100 border bg-transparent p-2"
      id=""
      cols="30"
      rows="6"
      value={value}
      placeholder={placeholder}
    ></textarea>
  )
}

export default Textarea
