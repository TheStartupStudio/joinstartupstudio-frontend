import penIcon from '../../assets/images/academy-icons/svg/pen-icon.svg'

function MarketCard({ imgSrc, title, description, url, uploaded, setIsOpen, isUserPortfolio }) {
  const formatURL = (url) => {
    if (!url) return '#'
    return url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`
  }

  return (
    <div className="market-card">
      <a href={formatURL(url)} target='_blank' rel='noopener noreferrer' className='text-decoration-none'>
        <img src={imgSrc} alt={title} className='w-100 project-img' />
      </a>
      <div className="content">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className='mb-0 text-black fs-21 fw-medium'>{title}</h4>
          {isUserPortfolio && (
            <img
              src={penIcon}
              className="cursor-pointer"
              alt="edit"
              onClick={setIsOpen}
            />
          )}
        </div>
        <p className='fs-15 fw-medium text-black'>Uploaded: {uploaded}</p>
        <p className='fs-15 fw-medium text-black'>{description}</p>
      </div>
    </div>
  )
}

export default MarketCard
