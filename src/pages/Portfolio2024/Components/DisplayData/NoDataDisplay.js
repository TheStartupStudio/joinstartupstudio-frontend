import React from 'react'

const NoDataDisplay = ({ src, classNames }) => {
  return (
    <div className={`no-data-container ${classNames ?? ''}`}>
      <img
        src={src}
        width={250}
        height={'100%'}
        alt={'no-data'}
        className='centered-image'
      />
      <div className='no-data-text'>Nothing has been added yet.</div>
    </div>
  )
}

export default NoDataDisplay
