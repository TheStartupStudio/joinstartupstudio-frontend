import React from 'react'
import WhoAmI from '../../assets/images/academy-icons/WhoAmI.png'

function SectionsWrapper({ title, paragraphs, children, img = WhoAmI }) {
  return (
    <div className='p-4 register-section w-100 h-fit-content'>
      <div className='d-flex gap-3 align-items-center'>
        <img src={img} alt='who-am-i' style={{ width: '40px', height: '40px' }}  />
        <h4 className='fs-18 my-details-header text-black'>{title}</h4>
      </div>
      <div className='mt-5 fs-18 fw-light text-black'>
        {paragraphs &&
          paragraphs.map((item) => (
            <p className='lh-sm' key={item.id}>
              {item.text}
            </p>
          ))}
        {children}
      </div>
    </div>
  )
}

export default SectionsWrapper
