function ModalInput({
  id,
  labelTitle,
  imgSrc,
  imageStyle,
  type = 'text',
  value = ''
}) {
  return (
    <div className='relative w-100 d-flex justify-content-between input-container-modal'>
      <input
        id={id}
        type={type}
        className='input-style'
        placeholder=' '
        value={value}
      />
      <label for={id} className='label-style'>
        {labelTitle}
      </label>
      <label for={id}>
        <img className='image-label' src={imgSrc} style={imageStyle} />
      </label>
    </div>
  )
}

export default ModalInput
