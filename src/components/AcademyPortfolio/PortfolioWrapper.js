import plusIcon from '../../assets/images/academy-icons/svg/Plus-Icon.svg'

function PortfolioWrapper({ img, title, description, children, setOpenNew }) {
  return (
    <div className='p-4 register-section w-100 d-fit-content relative'>
      <div className='d-flex gap-3 align-items-center'>
        <div style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={img} alt='who-am-i' className='portfolio-section-icon' />
        </div>
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
