import React from 'react'

function ModalInput({
  id,
  labelTitle,
  imgSrc,
  imageStyle,
  type = 'text',
  value,
  onChange,
  autoComplete
}) {
  return (
    <div className='relative w-100 d-flex justify-content-between input-container-modal'>
      <input
        id={id}
        type={type}
        className='input-style'
        placeholder=' '
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      <label htmlFor={id} className='label-style'>
        {labelTitle}
      </label>
      <label htmlFor={id}>
        <img className='image-label' src={imgSrc} style={imageStyle} />
      </label>
    </div>
  )
}

export default ModalInput
