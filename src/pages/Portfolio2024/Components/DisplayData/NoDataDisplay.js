import React from 'react'
import { useSelector } from 'react-redux'

const NoDataDisplay = ({ src, classNames, text = null }) => {
  const mode = useSelector((state) => state.portfolio.mode)
  return (
    <div className={`no-data-container ${classNames ?? ''}`}>
      <img
        src={src}
        width={250}
        height={'100%'}
        alt={'no-data'}
        className='centered-image'
      />
      <div className='no-data-text'>
        {mode === 'edit' ? text : 'Nothing has been added yet.'}
      </div>
    </div>
  )
}

export default NoDataDisplay
