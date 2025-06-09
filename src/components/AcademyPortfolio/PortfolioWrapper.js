import plusIcon from '../../assets/images/academy-icons/svg/Plus-Icon.svg'

function PortfolioWrapper({ img, title, children, setOpenNew }) {
  return (
    <div className='p-4 register-section w-100 d-fit-content relative'>
      <div className='d-flex gap-3 align-items-center'>
        <img src={img} alt='who-am-i' />
        <h4 className='fs-14 fw-medium my-details-header text-black'>
          {title}
        </h4>
        {setOpenNew && (
          <span
            className='cursor-pointer'
            style={{ zIndex: '1' }}
            onClick={() => setOpenNew((prev) => !prev)}
          >
            <img
              className='left-arrow-modal object-scale-down'
              src={plusIcon}
              alt='pen-icon'
              style={{ width: '24px' }}
            />
          </span>
        )}
      </div>
      <div className='mt-5 fs-18 fw-light text-black'>{children}</div>
    </div>
  )
}

export default PortfolioWrapper
