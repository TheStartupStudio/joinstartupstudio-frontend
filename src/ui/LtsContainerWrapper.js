import React from 'react'
import Breadcrumbs from '../pages/Breadcrumbs'

const LtsContainerWrapper = ({
  children,
  title,
  titleDescription,
  className
}) => {
  return (
    <div className={`container-fluid iamr-page ${className}`}>
      {/* <Breadcrumbs /> */}
      <div className='pt-5 '>
        <h3 className='fw-bold page-title'>{title}</h3>
        <p className='school-page-desc page-description'>{titleDescription}</p>
      </div>
      <hr />
      <div className='m-0 p-0'>{children}</div>
    </div>
  )
}

export default LtsContainerWrapper
