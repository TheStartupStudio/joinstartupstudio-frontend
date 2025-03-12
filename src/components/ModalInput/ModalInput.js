function ModalInput({ id, labelTitle, imgSrc }) {
  return (
    <div className='relative w-100 d-flex justify-content-between input-container-modal'>
      <input id={id} type='text' className='input-style' placeholder=' ' />
      <label for={id} className='label-style'>
        {labelTitle}
      </label>
      <label for={id}>
        <img className='image-label' src={imgSrc} />
      </label>
    </div>
  )
}

export default ModalInput
