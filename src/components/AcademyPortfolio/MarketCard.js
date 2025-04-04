import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'

function MarketCard({ imgSrc, title, uploaded, setIsOpen, url }) {
  return (
    <div className='d-flex flex-column gap-2'>
      <a href={url} target='_blank' rel='noopener noreferrer' className='text-decoration-none'>
      <img src={imgSrc} alt='design-queen' className='w-100 project-img' />
        </a>
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
