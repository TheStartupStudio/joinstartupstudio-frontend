import React from 'react'

const LtsContainerWrapper = ({ children, title, titleDescription }) => {
  return (
    <div className='container-fluid iamr-page'>
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
