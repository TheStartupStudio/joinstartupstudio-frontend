import React from 'react'
import Breadcrumbs from '../pages/Breadcrumbs'

const LtsContainerWrapper = ({ children, title, titleDescription }) => {
  return (
    <div className='container-fluid iamr-page'>
      <Breadcrumbs />
      <div className='pt-4 '>
        <h3 className='fw-bold page-title'>{title}</h3>
        <p className='page-description'>{titleDescription}</p>
      </div>
      <hr />
      <div className='m-0 p-0'>{children}</div>
    </div>
  )
}

export default LtsContainerWrapper
