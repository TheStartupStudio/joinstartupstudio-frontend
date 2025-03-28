import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'

function MarketCard({ imgSrc, title, uploaded, setIsOpen }) {
  return (
    <div>
      <img src={imgSrc} alt='design-queen' className='w-100' />
      <div className='d-flex justify-content-between'>
        <h5 className='mb-0 text-black fs-21 fw-medium'>{title}</h5>
        <img
          src={penIcon}
          alt='pen-icon'
          className='cursor-pointer'
          onClick={() => setIsOpen((prev) => !prev)}
        />
      </div>
      <p className='fs-15 fw-medium text-black'>Uploaded: {uploaded}</p>
    </div>
  )
}

export default MarketCard
